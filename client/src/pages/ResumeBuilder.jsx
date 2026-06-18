import React, { useEffect, useState } from 'react'
import {  Link, useParams } from 'react-router-dom'
import { ArrowLeftIcon, Briefcase, ChevronLeft, ChevronRight, DownloadIcon, EyeIcon, EyeOffIcon, FileText, FolderIcon, GraduationCap, Share2Icon, Sparkles, User } from 'lucide-react'
import PersonalInfoForm from '../components/PersonalInfoForm'
import ResumePreview from '../components/ResumePreview'
import TemplateSelector from '../components/TemplateSelector'
import ColorPicker from '../components/ColorPicker'
import ProfessionalSummary from '../components/ProfessionalSummary'
import { dummyResumeData } from "../assets/assets";
import ExperienceForm from '../components/ExperienceForm'
import EducationForm from '../components/EducationForm'
import ProjectForm from '../components/ProjectForm'
import SkillsForm from '../components/SkillsForm'
import { useSelector } from 'react-redux'
import api from '../configs/api'
import toast from 'react-hot-toast'

const ResumeBuilder = () => {
    const { resumeId } = useParams();
    const token = localStorage.getItem('token'); 
    const [resumeData, setResumeData] = useState({
    _id: '',
    title: '',
    personal_info: {},
    professional_summary:"",
    experience: [],
    education: [],
    projects: [],
    skills: [],
    template: "classic",
    accent_color: "#3B82F6",
    public: false,
  })

const loadExistingResume = async () => {
  try {
    const {data} = await api.get('/api/resumes/get/' + resumeId, {headers: {
      Authorization: token }})
      if(data.resume){
        setResumeData(data.resume)
        document.title = "ResumeAI";
      }
  } catch (error) {
    console.log(error.message)
    
  }
}

const [activeSectionIndex, setActiveSectionIndex] = useState(0)
const [removeBackground, setRemoveBackground] = useState(false); 
const [atsScore, setAtsScore] = useState(null);
const [atsSuggestions, setAtsSuggestions] = useState([]);
const [jobDescription, setJobDescription] = useState("");
const [jobMatch, setJobMatch] = useState(null);
const [companyName, setCompanyName] = useState("");
const [jobTitle, setJobTitle] = useState("");
const [coverLetter, setCoverLetter] = useState("");
const [interviewQuestions, setInterviewQuestions] =useState(null);

const sections = [
  { id: "personal",name: "Personal Info", icon: User },
  { id: "summary",name: "Summary", icon: FileText },
  { id: "experience",name: "Experience", icon: Briefcase },
  { id: "education",name: "Education", icon: GraduationCap },
  { id: "projects",name: "Projects", icon: FolderIcon },
  { id: "skills",name: "Skills", icon: Sparkles },
]

const activeSection = sections[activeSectionIndex]

useEffect(()=>{
  loadExistingResume()
},[])

const changeResumeVisibility = async () => {
  try {
    const formData = new FormData()
    formData.append("resumeId", resumeId)
    formData.append("resumeData", JSON.stringify({public: !resumeData.public}))
    const {data} = await api.put(`/api/resumes/update/${resumeId}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    setResumeData({...resumeData, public: !resumeData.public})
    toast.success(data.message)
  } catch (error) {
    console.error("Error saving resume: ", error)
    toast.error(error.response?.data?.message || 'Failed to update')
  }
}


const downloadResume = () => {
  window.print();
} 

const handleShare = () => {
  const frontendUrl = window.location.href.split('/app/')[0];
  const resumeUrl = frontendUrl + '/view/' + resumeId;

  if(navigator.share){
    navigator.share({url: resumeUrl, text: "My Resume", })
  }else{
    alert("share not supported on this browser.")
  }
}

const saveChanges = async () => {
  try {
    console.log("Saving with resumeId:", resumeId);

    let dataToSend = { ...resumeData };

    delete dataToSend._id;

    if (dataToSend.personal_info?.image instanceof File) {
      delete dataToSend.personal_info.image;
    }

    const cleanData = JSON.parse(
      JSON.stringify(dataToSend)
    );

    console.log("DATA BEING SAVED:");
    console.log(
      JSON.stringify(cleanData, null, 2)
    );

    const { data } = await api.put(
      `/api/resumes/update/${resumeId}`,
      {
        resumeData: cleanData,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("SERVER RESPONSE:");
    console.log(data);

    setResumeData(data.resume);

    toast.success("Saved successfully");
  } catch (error) {
    console.error("SAVE ERROR:", error);
    console.error(
      "SERVER ERROR:",
      error.response?.data
    );

    toast.error(
      error.response?.data?.message ||
      "Failed to save"
    );
  }
};

const analyzeATS = async () => {
  try {
    const { data } = await api.get(
      `/api/resumes/ats/${resumeId}`
    );

    console.log("ATS RESPONSE:", data);

    setAtsScore(data.score || 0);
    setAtsSuggestions(data.suggestions || []);

    toast.success("ATS Analysis Complete");
  } catch (error) {
    console.log("ATS ERROR:", error);
    console.log("SERVER RESPONSE:", error.response?.data);

    toast.error(
      error.response?.data?.message || "Failed to analyze ATS"
    );
  }
};

const analyzeJobMatch = async () => {
  try {
    const { data } = await api.post(
      "/api/ai/job-match",
      {
        resumeData,
        jobDescription,
      }
    );

    setJobMatch(data);

    toast.success("Job Match Analysis Complete");
  } catch (error) {
    console.log(error);

    toast.error(
      error.response?.data?.message ||
      "Failed to analyze Job Match"
    );
  }
};

const generateCoverLetter = async () => {
  try {
    const { data } = await api.post(
      "/api/ai/cover-letter",
      {
        companyName,
        jobTitle,
        jobDescription,
        resumeData,
      }
    );

    setCoverLetter(data.coverLetter);

    toast.success(
      "Cover Letter Generated Successfully"
    );
  } catch (error) {
    console.log(error);

    toast.error(
      error.response?.data?.message ||
      "Failed to generate cover letter"
    );
  }
};

const generateQuestions = async () => {
  try {

    const { data } = await api.post(
      "/api/ai/interview-questions",
      {
        resumeData
      }
    );

    setInterviewQuestions(data);

    toast.success(
      "Interview Questions Generated"
    );

  } catch (error) {
    toast.error(
      error.response?.data?.message ||
      "Failed"
    );
  }
};

  return (
    <div className='items-center justify-center'>
      <div className="max-w-7xl mx-auto px-4  py-6 ">
        <Link to={'/app'} className='inline-flex gap-2 items-center text-slate-500 hover:text-slate-700 transition-all'>
        <ArrowLeftIcon className='size-4'/>Back to Dashboard</Link>
      </div>
      <div className='max-w-[2200px] mx-auto px-4 pb-8'>
        <div className='grid lg:grid-cols-12  gap-8'>
          {/* Left Panel - Form */}
          <div className='relative lg:col-span-4 rounded-lg overflow-hidden'>
            <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6 pt-1'>
              {/* progress bar using activeSectionIndex */}
              <hr className='absolute top-0 left-0 right-0 border-2 border-gray-200'/>
              <hr className='absolute top-0 left-0 h-1 bg-gradient-to-br from-green-500 to-green-600 border-none transition-all duration-2000'
              style={{width:`${activeSectionIndex * 100 / (sections.length - 1)}%`}}/>

              {/* Section Navigation */}
              <div className='flex justify-between items-center mb-6 border border-gray-300 py-1'>
                <div className='flex items-center gap-2'>
                  <TemplateSelector selectedTemplate={resumeData.template} onChange={(template)=>setResumeData(prev => ({...prev, template}))}/>
                    <ColorPicker selectedColor={resumeData.accent_color} onChange={(color)=>setResumeData(prev =>({...prev, accent_color:color}))}/>
                </div>
                <div className='flex items-center bg-green-400 rounded-2xl text-white hover:bg-green-500'>
                  {activeSectionIndex !== 0 && (
                    <button onClick={()=>setActiveSectionIndex((prevIndex)=>Math.max(prevIndex - 1, 0))} className='flex items-center gap-1 p-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50
                    transition-all' disabled={activeSectionIndex === 0}>
                      <ChevronLeft className='size-4'/>
                      Previous
                    </button>
                  )}
                  <button onClick={()=>setActiveSectionIndex((prevIndex)=>Math.min(prevIndex + 1, sections.length -1))} className={`flex items-center gap-1 p-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50
                    transition-all ${activeSectionIndex === sections.length - 1 && 'opacity-50'}`} disabled={activeSectionIndex === sections.length - 1}>Next
                      <ChevronRight className='size-4'/>
                    </button>

                </div>

              </div>

              <div className='space-y-6 w-full'>
                {activeSection.id === 'personal' && (
                  <PersonalInfoForm data={resumeData.personal_info} onChange={(data)=>setResumeData(prev => ({...prev, personal_info:data}))} removeBackground={removeBackground}
                  setRemoveBackground={setRemoveBackground}/>
                )}
                {activeSection.id === 'summary' && (
                  <ProfessionalSummary data={resumeData.professional_summary}
                  onChange={(data)=>setResumeData(prev=>({...prev, professional_summary: data}))} setResumeData={setResumeData}/>

                )}
                {activeSection.id === 'experience' && (
                  <ExperienceForm data={resumeData.experience}
                  onChange={(data)=>setResumeData(prev=>({...prev, experience: data}))} />

                )}
                {activeSection.id === 'education' && (
                  <EducationForm data={resumeData.education}
                  onChange={(data)=>setResumeData(prev=>({...prev, education: data}))} />

                )}
                {activeSection.id === 'projects' && (
                  <ProjectForm data={resumeData.projects}
                  onChange={(data)=>setResumeData(prev=>({...prev, projects: data}))} />

                )}
                {activeSection.id === 'skills' && (
                  <SkillsForm data={resumeData.skills}
                  onChange={(data)=>setResumeData(prev=>({...prev, skills: data}))} />

                )}

              </div>
              <button onClick={saveChanges} className='bg-green-400 ring-green-300 text-green-600 ring hover:ring-green-600 transition-all rounded-md px-6 font-semibold py-2 mt-6 text-sm text-slate-700'>Save Changes</button>


            </div>

          </div>

          {/* Right Panel - Preview */}
          <div className='lg:col-span-8 max-lg:mt-6'>
            <div className='relative '>
              <div className='absolute bottom-3 left-0 right-0 flex items-center justify-end gap-2'>
                {resumeData.public && (
                  <button onClick={handleShare} className='flex items-center p-2 px-4 gap-2 font-semibold text-xs
                  text-blue-600 rounded-lg ring-blue-300 hover:ring transition-colors'>
                    <Share2Icon className='size-4'/>Share
                  </button>
                )}
                <button onClick={changeResumeVisibility} className='flex items-center p-2 px-5 gap-4 py-2 text-sm font-semibold bg-purple-500 text-slate-700
                text-purple-300 rounded-lg hover:ring transition-colors '>
                  {resumeData.public ? <EyeIcon className='size-4'/> : <EyeOffIcon  className='size-4'/>}
                  {resumeData.public ? 'public' : 'private'}
                </button>
                <button onClick={analyzeATS} className="flex items-center gap-2 p-2 px-5 py-2 font-semibold text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">ATS Score</button>
                <button  onClick={downloadResume} className='flex items-center gap-2 p-2 px-5 py-2 font-semibold text-sm bg-green-400 text-green-600
                rounded-lg ring-green-300 hover:ring transition-colors text-slate-700 '>
                  <DownloadIcon className='size-4'/>Download
                </button>

              </div>
            </div>

            <div className="grid lg:grid-cols-10 gap-4">

              <div className="lg:col-span-7">
                <div id="resume-preview-container" className='w-full flex justify-center' >
                  <ResumePreview data={resumeData} template={resumeData.template} accentColor={resumeData.accent_color}/>
                </div>
              </div>

              <div className="lg:col-span-3 space-y-4">

                <div className="bg-white rounded-lg shadow p-4">
                  <h2 className="text-lg font-bold mb-2">Job Description Match</h2>
                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste Job Description Here..."
                    className="w-full border rounded-lg p-3 mb-3"
                    rows={6}
                  />
                  <button
                    onClick={analyzeJobMatch}
                    className="bg-purple-500 text-white px-4 py-2 rounded-lg"
                  >
                    Analyze Job Match
                  </button>
                </div>
                <button
  onClick={generateQuestions}
  className="bg-orange-500 text-white px-4 py-2 rounded-lg"
>
  Interview Questions
</button>

                <div className="bg-white rounded-lg shadow p-4">
                  <h2 className="text-lg font-bold mb-3">AI Cover Letter Generator</h2>
                  <input
                    type="text"
                    placeholder="Company Name"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full border rounded-lg p-3 mb-3"
                  />
                  <input
                    type="text"
                    placeholder="Job Title"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className="w-full border rounded-lg p-3 mb-3"
                  />
                  <button
                    onClick={generateCoverLetter}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg"
                  >
                    Generate Cover Letter
                  </button>
                </div>

                {atsScore !== null && (
                  <div className="bg-white rounded-lg shadow p-4">
                    <h2 className="text-xl font-bold">ATS Score: {atsScore}/100</h2>
                    <ul className="list-disc ml-5 mt-2">
                      {atsSuggestions.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {jobMatch && (
                  <div className="bg-white rounded-lg shadow p-4">
                    <h2 className="text-xl font-bold">Match Score: {jobMatch.matchScore}%</h2>
                  </div>
                )}

                {coverLetter && (
                  <div className="bg-white rounded-lg shadow p-4">
                    <h2 className="text-xl font-bold mb-2">Generated Cover Letter</h2>
                    <textarea
                      value={coverLetter}
                      readOnly
                      rows={15}
                      className="w-full border rounded-lg p-3"
                    />
                  </div>
                )}

                {interviewQuestions && (
  <div className="bg-white rounded-lg shadow p-4">

    <h2 className="text-xl font-bold mb-3">
      Interview Questions
    </h2>

    <h3 className="font-semibold">
      Technical
    </h3>

    <ul className="list-disc ml-5 mb-3">
      {interviewQuestions.technical?.map(
        (q, i) => (
          <li key={i}>{q}</li>
        )
      )}
    </ul>

    <h3 className="font-semibold">
      Project
    </h3>

    <ul className="list-disc ml-5 mb-3">
      {interviewQuestions.project?.map(
        (q, i) => (
          <li key={i}>{q}</li>
        )
      )}
    </ul>

    <h3 className="font-semibold">
      HR
    </h3>

    <ul className="list-disc ml-5">
      {interviewQuestions.hr?.map(
        (q, i) => (
          <li key={i}>{q}</li>
        )
      )}
    </ul>

  </div>
)}

              </div>

            </div>

           

          </div>

        </div>
      </div>
      
    </div>
  )
}

export default ResumeBuilder
