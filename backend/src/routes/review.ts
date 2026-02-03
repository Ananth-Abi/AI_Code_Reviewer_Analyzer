import express, { Request, Response } from 'express';
import axios from 'axios';
import crypto from 'crypto';
import Review from '../models/Review';
import ReviewCache from '../models/ReviewCache';
import { ReviewRequest, ReviewResults, GeminiResponse } from '../types';

const router = express.Router();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyC_Jh1D_2MZrrhdujVDzhSDiB8-sWhY49Y';

// Test which model works
const testModels = async () => {
  console.log('\n🔍 Testing Gemini Models...\n');
  
  const models = [
    'gemini-1.5-flash',
    'gemini-1.5-pro', 
    'gemini-2.0-flash',
    'gemini-2.0-flash-exp',
    'gemini-2.5-flash'
  ];

  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
      
      await axios.post(url, {
        contents: [{ parts: [{ text: 'Hello' }] }]
      }, { timeout: 5000 });
      
      console.log(`✅ ${model} - WORKS!`);
      return model; // Return first working model
    } catch (error: any) {
      console.log(`❌ ${model} - ${error.response?.data?.error?.message || 'Failed'}`);
    }
  }
  
  return null;
};

// Call test on startup
testModels().then(workingModel => {
  if (workingModel) {
    console.log(`\n🎉 Using model: ${workingModel}\n`);
  } else {
    console.log('\n❌ No working model found!\n');
  }
});

// Use the working model
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

// Generate hash for caching
const generateCodeHash = (code: string, language: string): string => {
  return crypto.createHash('md5').update(code + language).digest('hex');
};

// POST /api/review - Analyze code
router.post('/review', async (req: Request, res: Response) => {
  try {
    const { code, language, sessionId }: ReviewRequest = req.body;

    if (!code || !language) {
      return res.status(400).json({ error: 'Code and language are required' });
    }

    const codeHash = generateCodeHash(code, language);

    // Check cache first
    const cachedReview = await ReviewCache.findOne({
      codeHash,
      language,
      expiresAt: { $gt: new Date() }
    });

    if (cachedReview) {
      await ReviewCache.updateOne({ codeHash }, { $inc: { hitCount: 1 } });

      const review = new Review({
        sessionId,
        code,
        language,
        reviewResults: cachedReview.reviewResults,
        timestamp: new Date(),
        fromCache: true,
        codeHash
      });
      await review.save();

      return res.json({
        success: true,
        cached: true,
        results: cachedReview.reviewResults,
        reviewId: review._id
      });
    }

    // Call Gemini API
    const prompt = `You are an expert code reviewer. Analyze the following ${language} code and provide a detailed review in JSON format.

Code to review:
\`\`\`${language}
${code}
\`\`\`

Provide your analysis in this exact JSON structure:
{
  "overallScore": <number 0-100>,
  "issues": [
    {
      "severity": "high|medium|low",
      "line": <line number or null>,
      "issue": "description",
      "suggestion": "how to fix"
    }
  ],
  "suggestions": [
    {
      "category": "performance|readability|maintainability",
      "suggestion": "description",
      "impact": "high|medium|low"
    }
  ],
  "security": [
    {
      "severity": "critical|high|medium|low",
      "vulnerability": "description",
      "recommendation": "how to fix"
    }
  ],
  "bestPractices": [
    {
      "practice": "description",
      "current": "what code does now",
      "recommended": "what it should do"
    }
  ],
  "summary": "brief overall assessment"
}

Return ONLY valid JSON, no markdown formatting.`;

    const geminiResponse = await axios.post<GeminiResponse>(
      GEMINI_API_URL,
      {
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.4,
          topK: 32,
          topP: 1,
          maxOutputTokens: 2048,
        }
      },
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );

    const responseText = geminiResponse.data.candidates[0].content.parts[0].text;
    const cleanedText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const reviewResults: ReviewResults = JSON.parse(cleanedText);

    // Save to cache
    const cache = new ReviewCache({
      codeHash,
      language,
      reviewResults,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });
    await cache.save();

    // Save to user's history
    const review = new Review({
      sessionId,
      code,
      language,
      reviewResults,
      timestamp: new Date(),
      codeHash
    });
    await review.save();

    res.json({
      success: true,
      cached: false,
      results: reviewResults,
      reviewId: review._id
    });

  } catch (error: any) {
    console.error('❌ Review error:', error.response?.data || error.message);
    res.status(500).json({
      error: 'Failed to analyze code',
      details: error.response?.data?.error?.message || error.message
    });
  }
});

// GET /api/reviews/:sessionId
router.get('/reviews/:sessionId', async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const reviews = await Review.find({ sessionId })
      .sort({ timestamp: -1 })
      .limit(50)
      .select('-code');

    res.json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// GET /api/review/:id
router.get('/review/:id', async (req: Request, res: Response) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }
    res.json({ success: true, review });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch review' });
  }
});

// GET /api/stats
router.get('/stats', async (req: Request, res: Response) => {
  try {
    const totalReviews = await Review.countDocuments();
    const languageStats = await Review.aggregate([
      { $group: { _id: '$language', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      stats: {
        totalReviews,
        languages: languageStats
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

export default router;