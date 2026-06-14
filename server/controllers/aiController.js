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



