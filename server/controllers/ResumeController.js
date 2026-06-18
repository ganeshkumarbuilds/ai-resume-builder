import { request } from "http";
import imagekit from "../configs/ImageKit.js";
import Resume from "../models/Resume.js";
import fs from 'fs';
import puppeteer from 'puppeteer';


export const createResume = async (req, res) => {
    try {
        const userId = req.userId;
        const {title} = req.body;

        const newResume = await Resume.create({userId, title})
        return res.status(201).json({message: "Resume created successfully",
            resume: newResume})
    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}

export const deleteResume = async (req, res) => {
    try {
        const userId = req.userId;
        const { resumeId } = req.params;
        const deleted = await Resume.findOneAndDelete({ userId, _id: resumeId });
        if (!deleted) return res.status(404).json({ message: "Resume not found" });
        return res.status(200).json({ message: "Resume deleted successfully." });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

export const downloadResume = async (req, res) => {
  try {
    const { resumeId } = req.params;
    const { html } = req.body;

    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.setRequestInterception(true);
    page.on('request', request => request.continue());
    await page.setContent(`
  <html>
    <head>
      <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body>
      ${html}
    </body>
  </html>
`, { waitUntil: 'networkidle0' });
    const pdf = await page.pdf({ format: 'A4', printBackground: true });
    await browser.close();

    res.set({ 'Content-Type': 'application/pdf', 'Content-Disposition': 'attachment; filename=resume.pdf' });
    res.send(pdf);
  } catch (error) {
    console.error('PDF error:', error);
    res.status(500).json({ message: 'Failed to generate PDF' });
  }
}

export const getResumeId = async (req, res) => {
    try {
        const userId = req.userId;
        const {resumeId} = req.params;
        const resume = await Resume.findOne({userId, _id: resumeId})
        if(!resume){
            return res.status(404).json({message: "Resume not found"})
        }
        resume.__v = undefined;
        resume.createdAt = undefined;
        resume.updatedAt = undefined;

        return res.status(200).json({resume})
    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}

export const getPublicResumeId = async(req, res) => {
    try {
        const { resumeId } = req.params;
        const resume = await Resume.findOne({public: true, _id: resumeId})
        if(!resume){
            return res.status(404).json({message: "Resume not found"})
        }
        return res.status(200).json({resume})
        
    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}

export const UpdateResume = async(req, res) => {
    try {
        const userId = req.userId;
        const { resumeData, removeBackground } = req.body;
        const { resumeId } = req.params;
        const image = req.file;

        let resumeDataCopy;

        if (typeof resumeData === "string") {
            resumeDataCopy = JSON.parse(resumeData);
        } else {
            resumeDataCopy = structuredClone(resumeData);
        }

        if (!image) {
            const existingResume = await Resume.findById(resumeId);

            if (existingResume?.personal_info?.image) {
                resumeDataCopy.personal_info = {
                    ...resumeDataCopy.personal_info,
                    image: existingResume.personal_info.image,
                };
            }
        }

        if (image) {
            const imageBufferData = fs.createReadStream(image.path);

            const response = await imagekit.files.upload({
                file: imageBufferData,
                fileName: "resume.png",
                folder: "user-resumes",
                transformation: {
                    pre:
                        "w-300,h-300,fo-face,z-0.75" +
                        (removeBackground ? ",e-bgremove" : ""),
                },
            });

            resumeDataCopy.personal_info.image = response.url;
        }

        const resume = await Resume.findOneAndUpdate(
            { userId, _id: resumeId },
            resumeDataCopy,
            { new: true }
        );

        return res.status(200).json({
            message: "Saved successfully",
            resume,
        });

    } catch (error) {
        return res.status(400).json({
            message: error.message,
        });
    }
};
        

export const analyzeATS = async (req, res) => {
  try {
    const { resumeId } = req.params;

    const resume = await Resume.findById(resumeId);
    console.log("ATS RESUME DATA:");
console.log(JSON.stringify(resume, null, 2));

    if (!resume) {
      return res.status(404).json({
        message: "Resume not found",
      });
    }

    let score = 0;
    let suggestions = [];

    if (resume.personal_info?.full_name) score += 10;
    else suggestions.push("Add Full Name");

    if (resume.personal_info?.email) score += 10;
    else suggestions.push("Add Email");

    if (resume.professional_summary?.length > 50) score += 15;
    else suggestions.push("Add a stronger Professional Summary");

    if (resume.skills?.length >= 5) score += 20;
    else suggestions.push("Add more technical skills");

    if (resume.experience?.length > 0) score += 20;
    else suggestions.push("Add work experience");

    if (resume.projects?.length > 0) score += 15;
    else suggestions.push("Add projects");

    if (resume.education?.length > 0) score += 10;
    else suggestions.push("Add education details");

    resume.atsScore = score;
    resume.atsSuggestions = suggestions;

    await resume.save();

    return res.status(200).json({
      score,
      suggestions,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};