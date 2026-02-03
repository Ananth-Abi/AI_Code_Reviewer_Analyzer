import React, { useState, useEffect } from 'react';
import { getReviewHistory } from '../utils/api';
import type { Review } from '../types';

interface ReviewHistoryProps {
  onSelectReview: (review: Review) => void;
  refreshTrigger: number;
}

const ReviewHistory: React.FC<ReviewHistoryProps> = ({ onSelectReview, refreshTrigger }) => {
  const [history, setHistory] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, [refreshTrigger]);

  const loadHistory = async () => {
    try {
      const data = await getReviewHistory();
      setHistory(data.reviews || []);
    } catch (error) {
      console.error('Failed to load history:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-gray-400 p-6 text-center">
        Loading history...
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="text-gray-400 p-6 text-center">
        No review history yet. Start analyzing code!
      </div>
    );
  }

  return (
    <div className="border-2 border-primary-red rounded-lg p-6 bg-primary-darkGray max-h-[600px] overflow-y-auto">
      <h3 className="text-2xl font-bold text-primary-red mb-4">📜 Review History</h3>
      <div className="space-y-3">
        {history.map((review) => (
          <div
            key={review._id}
            onClick={() => onSelectReview(review)}
            className="p-4 bg-black rounded-lg cursor-pointer border border-primary-lightGray hover:border-primary-red hover:bg-primary-lightGray transition-all duration-300"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-primary-red font-bold text-sm uppercase">
                {review.language}
              </span>
              <span className="text-gray-500 text-xs">
                {new Date(review.timestamp).toLocaleDateString()}
              </span>
            </div>
            <div className="text-gray-400 text-sm flex items-center gap-2">
              <span>Score: {review.reviewResults?.overallScore || 'N/A'}/100</span>
              {review.fromCache && (
                <span className="text-green-500 text-xs">⚡ Cached</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewHistory;