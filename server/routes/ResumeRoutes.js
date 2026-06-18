import express from "express";
import protect from "../middlewares/authMiddleware.js";
import { createResume, deleteResume, getPublicResumeId, getResumeId, UpdateResume, downloadResume,  analyzeATS } from "../controllers/ResumeController.js";
import upload from "../configs/Multer.js";

const resumeRouter = express.Router();

resumeRouter.post('/create', protect, createResume);
resumeRouter.put('/update/:resumeId',protect,upload.single('image'), UpdateResume);
resumeRouter.delete('/delete/:resumeId', protect, deleteResume);
resumeRouter.get('/get/:resumeId', protect, getResumeId);
resumeRouter.get('/public/:resumeId', getPublicResumeId);
resumeRouter.post('/download/:resumeId', protect, downloadResume);
resumeRouter.get('/ats/:resumeId', protect, analyzeATS);

export default resumeRouter;