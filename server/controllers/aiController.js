import Resume from "../models/Resume.js";
import ai from "../configs/ai.js";

export const enhanceProfessionalSummary = async (req, res) => {
  try {
    const { userContent } = req.body;
    console.log('Received userContent:', userContent);
    
    if(!userContent){
      return res.status(400).json({message: 'Missing required fields'})
    }

    const response = await ai.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      messages: [
        {
          role: "system",
          content: "You are an expert in resume writing. Your task is to enhance the professional summary of a resume. Return only the enhanced summary text for exactly 3 sentences, no extra explanation."
        },
        {
          role: "user",
          content: userContent,
        },
      ],
    })

    console.log('AI response:', JSON.stringify(response));
    
    const enhancedContent = response.choices[0].message.content;
    return res.status(200).json({enhancedContent})
  } catch (error) {
    console.error('Full error:', error.message, error.status);
    return res.status(400).json({message: error.message})
  }
}

export const enhanceJobDescription = async (req, res) => {
  try {
    const { userContent } = req.body;
    if(!userContent) return res.status(400).json({message: 'Missing required fields'})

    const response = await ai.chat.completions.create({
  model: process.env.OPENAI_MODEL,
  max_tokens: 150,
  messages: [
    {
      role: "system",
      content: "You are a resume writer. Write a 3-4 sentence job description paragraph using strong action verbs. No bullet points, no dashes, plain paragraph text only. Maximum 120 words."
    },
    { role: "user", content: userContent }
  ],
})

    const enhancedContent = response.choices[0].message.content;
    return res.status(200).json({enhancedContent})
  } catch (error) {
    console.error('Error:', error.message);
    return res.status(400).json({message: error.message})
  }
}


export const uploadResume = async (req, res) => {
    try{
        const {resumeText, title} = req.body;
        const userId = req.userId;

        if(!resumeText){
            return res.status(400).json({message: 'Missing required fields'})
        }

        const systemPrompt = "You are an expert AI Agent to extract data from resume."

        const userPrompt = `extract data from this resume: ${resumeText}
        Provide data in the following JSON format with no additional text before or after:
        {
        professional_summary: {type: String, default: ""},
        skills: [{type: String}],
        personal_info: {
        image: {type: String, default: ''},
        full_name: {type: String, default: ''},
        profession: {type: String, default: ''},
        email: {type: String, default: ''},
        phone: {type: String, default: ''},
        location: {type: String, default: ''},
        website: {type: String, default: ''},
    },
    experience: [
        {
            company: {type: String},
            positon: {type: String},
            start_date: {type: String},
            end_date: {type: String},
            description: {type: String},
            is_current: {type: Boolean},
        }
    ],
    projects:[
        {
            name: {type: String},
            type: {type: String},
            description: {type: String},
            
        }
    ],
    education:[
        {
            institution: {type: String},
            degree: {type: String},
            field: {type: String},
            graduation_date: {type: String},
            gpa: {type: String},
        }}
        `


        const response = await ai.chat.completions.create({
            model: process.env.OPENAI_MODEL,
    messages: [
        {   role: "system",
            content: systemPrompt 
        },
        {
            role: "user",
            content: userPrompt,
        },
    ],
    response_format: {type: 'json_object'}
        })

        const extractedData = response.choices.message[0].content;
        const parsedData = JSON.parse({extractedData})
        const newResume = await Resume.create({userId, title, ...parsedData})

        res.json({resumeId: newResume._id})
    } catch (error) {
        return res.status(400).json({message: error.message})
    }
    
}

export const generateCoverLetter = async (req, res) => {
  try {
    const {
      companyName,
      jobTitle,
      jobDescription,
      resumeData
    } = req.body;

    const prompt = `
Generate a professional cover letter.

Applicant Name: ${resumeData?.personal_info?.full_name}
Profession: ${resumeData?.personal_info?.profession}

Company Name: ${companyName}
Job Title: ${jobTitle}

Job Description:
${jobDescription}

Write a professional cover letter with:
- Introduction
- Relevant skills
- Why interested in company
- Professional closing

Return only the cover letter.
`;

    const response = await ai.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      messages: [
        {
          role: "system",
          content:
            "You are an expert cover letter writer."
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const coverLetter =
      response.choices[0].message.content;

    return res.status(200).json({
      coverLetter,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const analyzeJobMatch = async (req, res) => {
  try {
    const { resumeData, jobDescription } = req.body;

    if (!resumeData || !jobDescription) {
      return res.status(400).json({
        message: "Resume data and Job Description are required",
      });
    }

    const prompt = `
You are an ATS Resume Analyzer.

Resume:
${JSON.stringify(resumeData, null, 2)}

Job Description:
${jobDescription}

Analyze the resume against the job description.

Return ONLY valid JSON:

{
  "matchScore": 85,
  "missingSkills": ["Docker", "AWS"],
  "strengths": [
    "Strong React experience",
    "Relevant projects"
  ],
  "suggestions": [
    "Add Docker skills",
    "Mention AWS projects"
  ]
}
`;

    const response = await ai.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      messages: [
        {
          role: "system",
          content: "You are an ATS resume analyzer.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: {
        type: "json_object",
      },
    });

    const result = JSON.parse(
      response.choices[0].message.content
    );

    return res.status(200).json(result);

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

export const generateInterviewQuestions = async (req, res) => {
  try {
    const { resumeData } = req.body;

    const prompt = `
Generate interview questions based on this resume.

Resume:
${JSON.stringify(resumeData)}

Return JSON only:

{
  "technical": [
    "question1",
    "question2"
  ],
  "project": [
    "question1",
    "question2"
  ],
  "hr": [
    "question1",
    "question2"
  ]
}
`;

    const response = await ai.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      messages: [
        {
          role: "system",
          content:
            "You are an expert technical interviewer. Return only JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(
      response.choices[0].message.content
    );

    return res.status(200).json(result);

  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
};


