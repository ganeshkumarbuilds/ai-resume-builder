import express from "express";
import protect from "../middlewares/authMiddleware.js"
import { enhanceJobDescription, generateInterviewQuestions,generateCoverLetter, enhanceProfessionalSummary, uploadResume, analyzeJobMatch } from "../controllers/aiController.js";

const aiRouter = express.Router();


aiRouter.post('/enhance-pro-sum', protect, enhanceProfessionalSummary)
aiRouter.post('/enhance-job-desc', protect, enhanceJobDescription)
aiRouter.post('/upload-resume', protect, uploadResume)
aiRouter.post("/job-match",protect,analyzeJobMatch);
aiRouter.post("/cover-letter",protect,generateCoverLetter);
aiRouter.post("/interview-questions",protect,generateInterviewQuestions);

export default aiRouter