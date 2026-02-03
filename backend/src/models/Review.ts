import mongoose, { Document, Schema } from 'mongoose';
import { ReviewResults } from '../types';

export interface IReview extends Document {
  sessionId: string;
  code: string;
  language: string;
  reviewResults: ReviewResults;
  timestamp: Date;
  codeHash: string;
  fromCache: boolean;
}

const reviewSchema = new Schema<IReview>({
  sessionId: {
    type: String,
    required: true,
    index: true
  },
  code: {
    type: String,
    required: true
  },
  language: {
    type: String,
    required: true
  },
  reviewResults: {
    overallScore: Number,
    issues: Array,
    suggestions: Array,
    security: Array,
    bestPractices: Array,
    summary: String
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  codeHash: String,
  fromCache: {
    type: Boolean,
    default: false
  }
});

export default mongoose.model<IReview>('Review', reviewSchema);