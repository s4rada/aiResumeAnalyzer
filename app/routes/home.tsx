import ResumeCard from "~/components/ResumeCard";
import { resumes } from "../../constants";
import Navbar from "~/components/Navbar";
import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router';
import { usePuterStore } from '~/lib/puter'

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resumind" },
    { name: "description", content: "Smart Feedback for your dream job!" },
  ];
}

export default function Home() {
  const {auth, kv} = usePuterStore();
  const navigate = useNavigate()
  const [resumes,setResumes] = useState<Resume[]>([])
  const [loadingResumes, setLoadingResumes] = useState(false)
  useEffect((): void => {
  if (!auth.isAuthenticated) navigate('/auth?next=/');
}, [auth.isAuthenticated]);

  useEffect(()=>{
    const loadResume = async()=>{
      setLoadingResumes(true);
      const resumes = (await kv.list('resume:*', true)) as KVItem[];
      const parsedResumes = resumes?.map((resume)=>(
        JSON.parse(resume.value) as Resume
      ))
      console.log("parsedResumes",parsedResumes);
      setResumes(parsedResumes|| []);
      setLoadingResumes(false);
    }
    loadResume()
  }, [])
  return (
  <main className="bg-[url('/images/bg-main.svg')] bg-cover">
    <Navbar/>
    {/* {window.puter.ai.chat()} */}
    <section className="main-section">
      <div className="page-heading py-16">
        <h1>Track your Applications & Resume Ratings</h1>
        {!loadingResumes && resumes?.length === 0 ? (
          <h2>No Resume found. Upload your first Resume to get feedback.</h2>

        ):(
          <h2>Review your submission and check AI-powered Feedback.</h2>
        )}
      </div>
      {loadingResumes && (
        <div className="flex flex-col items-center justify-center">
        <img src="/images/resume-scan-2.gif" alt="" className="w-[200px]"/>
        </div>
      )}
    {!loadingResumes && resumes.length > 0 && (
      <div className="resumes-section">
        {resumes.map((resume) => (
          <ResumeCard key={resume.id} resume={resume}/>
        ))}
      </div>
    )}

    {!loadingResumes && resumes?.length === 0 && (
      <div className="flex flex-col items-center justify-center mt-10 gap-4">
        <Link to="/upload" className="primary-button w-fit text-xl font-semibold"> Upload Resume</Link>
      </div>
    )}
    </section>
  </main>
  );
}
