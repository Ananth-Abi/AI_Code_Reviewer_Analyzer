import React, { useState } from 'react';
import Header from './components/Header';
import CodeEditor from './components/CodeEditor';
import LanguageSelector from './components/LanguageSelector';
import ReviewResults from './components/ReviewResults';
import ReviewHistory from './components/ReviewHistory';
import { analyzeCode, getReviewById } from './utils/api';
import type { ReviewResults as ReviewResultsType, Review } from './types';

function App() {
  const [code, setCode] = useState<string>('');
  const [language, setLanguage] = useState<string>('javascript');
  const [results, setResults] = useState<ReviewResultsType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshHistory, setRefreshHistory] = useState<number>(0);

  const handleAnalyze = async () => {
    if (!code.trim()) {
      setError('Please enter some code to analyze');
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const data = await analyzeCode(code, language);
      setResults(data.results);
      setRefreshHistory(prev => prev + 1);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to analyze code');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectReview = async (review: Review) => {
    try {
      const data = await getReviewById(review._id);
      setCode(data.review.code);
      setLanguage(data.review.language);
      setResults(data.review.reviewResults);
    } catch (err) {
      console.error('Failed to load review:', err);
    }
  };

  const handleClear = () => {
    setCode('');
    setResults(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-black">
      <Header />

      <div className="max-w-[1800px] mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel */}
          <div>
            <LanguageSelector selectedLanguage={language} onChange={setLanguage} />
            
            <CodeEditor 
              code={code} 
              onChange={(value) => setCode(value || '')} 
              language={language}
            />

            <div className="flex gap-4 mt-6">
              <button
                onClick={handleAnalyze}
                disabled={loading}
                className="flex-1 py-4 px-8 text-lg font-bold bg-primary-red text-black rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(255,0,0,0.5)]"
              >
                {loading ? '⏳ Analyzing...' : '🚀 Analyze Code'}
              </button>
              <button
                onClick={handleClear}
                className="px-8 py-4 text-lg font-bold bg-primary-darkGray text-white border-2 border-primary-red rounded-lg hover:bg-primary-lightGray transition-all duration-300"
              >
                🗑️ Clear
              </button>
            </div>

            {error && (
              <div className="mt-4 p-4 bg-red-900/20 border-2 border-primary-red rounded-lg text-red-400 text-center">
                ⚠️ {error}
              </div>
            )}
          </div>

          {/* Right Panel */}
          <div className="space-y-8">
            <ReviewResults results={results} loading={loading} />
            <ReviewHistory 
              onSelectReview={handleSelectReview}
              refreshTrigger={refreshHistory}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;