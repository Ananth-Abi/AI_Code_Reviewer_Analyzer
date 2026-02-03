import mongoose, { Document, Schema } from 'mongoose';
import { ReviewResults } from '../types';

export interface IReviewCache extends Document {
  codeHash: string;
  language: string;
  reviewResults: ReviewResults;
  createdAt: Date;
  expiresAt: Date;
  hitCount: number;
}

const reviewCacheSchema = new Schema<IReviewCache>({
  codeHash: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  language: {
    type: String,
    required: true
  },
  reviewResults: {
    type: Object,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    required: true,
    index: true
  },
  hitCount: {
    type: Number,
    default: 0
  }
});

export default mongoose.model<IReviewCache>('ReviewCache', reviewCacheSchema);