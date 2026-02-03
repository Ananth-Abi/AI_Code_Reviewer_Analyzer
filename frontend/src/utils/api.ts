import axios from 'axios';
import type { ReviewRequest, ReviewResults, Review } from '../types';

const API_BASE_URL = 'http://localhost:5000/api';

export const getSessionId = (): string => {
  let sessionId = localStorage.getItem('sessionId');
  if (!sessionId) {
    sessionId = 'session_' + Math.random().toString(36).substr(2, 9) + Date.now();
    localStorage.setItem('sessionId', sessionId);
  }
  return sessionId;
};

export const analyzeCode = async (code: string, language: string) => {
  const sessionId = getSessionId();
  const response = await axios.post(`${API_BASE_URL}/review`, {
    code,
    language,
    sessionId
  });
  return response.data;
};

export const getReviewHistory = async (): Promise<{ success: boolean; reviews: Review[] }> => {
  const sessionId = getSessionId();
  const response = await axios.get(`${API_BASE_URL}/reviews/${sessionId}`);
  return response.data;
};

export const getReviewById = async (id: string): Promise<{ success: boolean; review: Review }> => {
  const response = await axios.get(`${API_BASE_URL}/review/${id}`);
  return response.data;
};

export const getStats = async () => {
  const response = await axios.get(`${API_BASE_URL}/stats`);
  return response.data;
};