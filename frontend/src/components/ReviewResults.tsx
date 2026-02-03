import React, { useState } from 'react';
import type { ReviewResults as ReviewResultsType } from '../types';

interface ReviewResultsProps {
  results: ReviewResultsType | null;
  loading: boolean;
}

type TabType = 'summary' | 'issues' | 'suggestions' | 'security' | 'bestPractices';

const ReviewResults: React.FC<ReviewResultsProps> = ({ results, loading }) => {
  const [activeTab, setActiveTab] = useState<TabType>('summary');

  if (loading) {
    return (
      <div className="p-10 text-center text-primary-red text-xl">
        <div className="inline-block animate-pulse-red">
          🔍 Analyzing your code...
        </div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="p-10 text-center text-gray-400 text-lg">
        Paste your code and click "Analyze Code" to get started
      </div>
    );
  }

  const tabs = [
    { id: 'summary' as TabType, label: '📋 Summary', count: null },
    { id: 'issues' as TabType, label: '🐛 Issues', count: results.issues?.length || 0 },
    { id: 'suggestions' as TabType, label: '💡 Suggestions', count: results.suggestions?.length || 0 },
    { id: 'security' as TabType, label: '🔒 Security', count: results.security?.length || 0 },
    { id: 'bestPractices' as TabType, label: '✨ Best Practices', count: results.bestPractices?.length || 0 }
  ];

  const getSeverityColor = (severity?: string): string => {
    switch (severity?.toLowerCase()) {
      case 'critical': return 'text-red-600 border-red-600';
      case 'high': return 'text-red-500 border-red-500';
      case 'medium': return 'text-orange-500 border-orange-500';
      case 'low': return 'text-yellow-500 border-yellow-500';
      default: return 'text-primary-red border-primary-red';
    }
  };

  return (
    <div className="border-2 border-primary-red rounded-lg p-6 bg-primary-darkGray">
      {/* Score Badge */}
      <div className="text-center mb-8 p-6 bg-black rounded-lg">
        <div className="text-6xl font-bold text-primary-red mb-2">
          {results.overallScore}/100
        </div>
        <div className="text-gray-400 text-sm">Overall Code Quality Score</div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 pb-4 border-b-2 border-primary-lightGray">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
              activeTab === tab.id
                ? 'bg-primary-red text-black'
                : 'bg-black text-white hover:bg-primary-lightGray'
            }`}
          >
            {tab.label} {tab.count !== null && `(${tab.count})`}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-4">
        {activeTab === 'summary' && (
          <div>
            <h3 className="text-2xl font-bold text-primary-red mb-4">Summary</h3>
            <p className="text-gray-300 leading-relaxed text-base">
              {results.summary}
            </p>
          </div>
        )}

        {activeTab === 'issues' && (
          <div className="space-y-4">
            {results.issues?.length > 0 ? (
              results.issues.map((issue, index) => (
                <div
                  key={index}
                  className={`p-4 bg-black rounded-lg border-l-4 ${getSeverityColor(issue.severity)}`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className={`text-xs font-bold uppercase ${getSeverityColor(issue.severity)}`}>
                      {issue.severity} SEVERITY
                    </span>
                    {issue.line && (
                      <span className="text-gray-500 text-sm">Line {issue.line}</span>
                    )}
                  </div>
                  <h4 className="text-white font-semibold mb-2">{issue.issue}</h4>
                  <p className="text-gray-400 text-sm">
                    <strong className="text-primary-red">Fix:</strong> {issue.suggestion}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center py-8">No issues found! 🎉</p>
            )}
          </div>
        )}

        {activeTab === 'suggestions' && (
          <div className="space-y-4">
            {results.suggestions?.length > 0 ? (
              results.suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="p-4 bg-black rounded-lg border-l-4 border-primary-red"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-primary-red text-xs font-bold uppercase">
                      {suggestion.category}
                    </span>
                    <span className="text-gray-500 text-sm">{suggestion.impact} impact</span>
                  </div>
                  <p className="text-gray-300 text-sm">{suggestion.suggestion}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center py-8">No suggestions at this time.</p>
            )}
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-4">
            {results.security?.length > 0 ? (
              results.security.map((sec, index) => (
                <div
                  key={index}
                  className={`p-4 bg-black rounded-lg border-l-4 ${getSeverityColor(sec.severity)}`}
                >
                  <div className={`text-xs font-bold uppercase mb-2 ${getSeverityColor(sec.severity)}`}>
                    {sec.severity} RISK
                  </div>
                  <h4 className="text-white font-semibold mb-2">{sec.vulnerability}</h4>
                  <p className="text-gray-400 text-sm">
                    <strong className="text-primary-red">Recommendation:</strong> {sec.recommendation}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center py-8">No security issues detected! 🔒</p>
            )}
          </div>
        )}

        {activeTab === 'bestPractices' && (
          <div className="space-y-4">
            {results.bestPractices?.length > 0 ? (
              results.bestPractices.map((practice, index) => (
                <div
                  key={index}
                  className="p-4 bg-black rounded-lg border-l-4 border-primary-red"
                >
                  <h4 className="text-primary-red font-semibold mb-3">{practice.practice}</h4>
                  <p className="text-gray-400 text-sm mb-2">
                    <strong className="text-gray-500">Current:</strong> {practice.current}
                  </p>
                  <p className="text-gray-400 text-sm">
                    <strong className="text-green-500">Recommended:</strong> {practice.recommended}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center py-8">Following best practices! ✨</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewResults;