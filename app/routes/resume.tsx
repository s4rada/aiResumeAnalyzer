import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import Ats from '~/components/ats'
import Details from '~/components/Details'
import Summary from '~/components/summary'
import { usePuterStore } from '~/lib/puter'

export const meta = () => {[
    {title: 'Resumind | Review'},
    {name: 'description', content: 'Detailed overview of your resume'}
]}

const Resume = () => {
    const {auth, kv, fs, isLoading } = usePuterStore();
    const {id} = useParams();
    const [imageUrl, setImageUrl] = useState("");
    const [resumeUrl, setResumeUrl] = useState("");
    const [feedback, setFeedback] = useState<Feedback | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    
    useEffect((): void => {
      if (!isLoading && !auth.isAuthenticated) navigate(`/auth?next=/resume/${id}`);
    }, [isLoading]);
    
    useEffect(()=>{
        const loadResume = async() => {
            setLoading(true);
            try {
                const resume = await kv.get(`resume:${id}`);
                if (!resume) return;
                const data = JSON.parse(resume);
                const resumeBlob = await fs.read(data.resumePath);
                if (!resumeBlob) return;
                const pdfBlob = new Blob([resumeBlob], {type: 'application/pdf'});
                const resumeUrl = URL.createObjectURL(pdfBlob);
                setResumeUrl(resumeUrl);
                const imageBlob = await fs.read(data.imagePath);
                if (!imageBlob) return;
                const imageUrl = URL.createObjectURL(imageBlob);
                setImageUrl(imageUrl);
                setFeedback(data.feedback);
            } catch (error) {
                console.error('Error loading resume:', error);
            } finally {
                setLoading(false);
            }
        }
        loadResume();
    },[id]);

  return (
    <main className='min-h-screen bg-gray-50'>
        {/* Navigation */}
        <nav className='bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='flex justify-between items-center h-16'>
                    <Link 
                        to="/" 
                        className='inline-flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors duration-200 group'
                    >
                        <div className='flex items-center justify-center w-8 h-8 bg-gray-100 rounded-lg group-hover:bg-gray-200 transition-colors duration-200'>
                            <img 
                                src="/icons/back.svg" 
                                alt="back" 
                                className='w-4 h-4 text-gray-600'
                            />
                        </div>
                        <span className='text-sm font-medium'>Back to Home</span>
                    </Link>
                    <h1 className='text-xl font-bold text-gray-900'>Resume Review</h1>
                </div>
            </div>
        </nav>

        {/* Main Content */}
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
                {/* Resume Preview Section */}
                <section className='lg:sticky lg:top-24 h-fit'>
                    <div className='bg-white rounded-xl shadow-lg p-6 border border-gray-200'>
                        <h2 className='text-2xl font-bold text-gray-900 mb-6'>Resume Preview</h2>
                        {loading ? (
                            <div className='flex items-center justify-center h-96 bg-gray-100 rounded-lg animate-pulse'>
                                <div className='text-center'>
                                    <div className='w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4'></div>
                                    <p className='text-gray-600'>Loading your resume...</p>
                                </div>
                            </div>
                        ) : imageUrl && resumeUrl ? (
                            <div className='animate-in fade-in duration-700'>
                                <div className='relative group'>
                                    <div className='gradient-border rounded-2xl p-2 bg-gradient-to-r from-blue-50 to-purple-50'>
                                        <a 
                                            href={resumeUrl} 
                                            target="_blank" 
                                            rel='noopener noreferrer'
                                            className='block relative'
                                        >
                                            <img 
                                                src={imageUrl} 
                                                alt="Resume preview" 
                                                className='w-full h-auto object-contain rounded-xl shadow-sm transition-transform duration-300 group-hover:scale-[1.02]'
                                            />
                                            <div className='absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100'>
                                                <div className='bg-white rounded-full p-3 shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300'>
                                                    <img 
                                                        src="/icons/external-link.svg" 
                                                        alt="Open resume" 
                                                        className='w-5 h-5'
                                                    />
                                                </div>
                                            </div>
                                        </a>
                                    </div>
                                    <div className='mt-4 text-center'>
                                        <a 
                                            href={resumeUrl}
                                            target="_blank"
                                            rel='noopener noreferrer'
                                            className='inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium'
                                        >
                                            <span>Open Full Resume</span>
                                            <img src="/icons/external-link-white.svg" alt="" className='w-4 h-4'/>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className='text-center py-12'>
                                <div className='w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center'>
                                    <img src="/icons/file-error.svg" alt="Error" className='w-12 h-12 text-gray-400'/>
                                </div>
                                <h3 className='text-lg font-medium text-gray-900 mb-2'>Resume not found</h3>
                                <p className='text-gray-600'>Unable to load the requested resume.</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* Feedback Section */}
                <section className='space-y-8'>
                    <div className='bg-white rounded-xl shadow-lg p-6 border border-gray-200'>
                        <h2 className='text-3xl font-bold text-gray-900 mb-2'>Resume Review</h2>
                        <p className='text-gray-600'>Detailed analysis and suggestions for improvement</p>
                    </div>

                    {loading ? (
                        <div className='space-y-6'>
                            {[1, 2, 3].map((item) => (
                                <div key={item} className='bg-white rounded-xl shadow-lg p-6 border border-gray-200 animate-pulse'>
                                    <div className='h-6 bg-gray-200 rounded w-1/3 mb-4'></div>
                                    <div className='space-y-3'>
                                        <div className='h-4 bg-gray-200 rounded'></div>
                                        <div className='h-4 bg-gray-200 rounded w-2/3'></div>
                                        <div className='h-4 bg-gray-200 rounded w-1/2'></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : feedback ? (
                        <div className='space-y-8 animate-in fade-in duration-700'>
                            <Summary feedback={feedback}/>
                            <Ats score={feedback.ATS.score || 0} suggestions={feedback.ATS.tips || []}/>
                            <Details feedback={feedback}/>
                        </div>
                    ) : (
                        <div className='bg-white rounded-xl shadow-lg p-8 border border-gray-200 text-center'>
                            <div className='max-w-md mx-auto'>
                                <img 
                                    src="/images/resume-scan-2.gif" 
                                    alt="Analyzing resume" 
                                    className='w-48 h-48 mx-auto mb-6 rounded-lg'
                                />
                                <h3 className='text-xl font-semibold text-gray-900 mb-2'>Analyzing Your Resume</h3>
                                <p className='text-gray-600 mb-4'>We're processing your resume to provide detailed feedback and suggestions.</p>
                                <div className='flex items-center justify-center gap-2 text-sm text-gray-500'>
                                    <div className='w-2 h-2 bg-blue-600 rounded-full animate-bounce'></div>
                                    <div className='w-2 h-2 bg-blue-600 rounded-full animate-bounce' style={{animationDelay: '0.1s'}}></div>
                                    <div className='w-2 h-2 bg-blue-600 rounded-full animate-bounce' style={{animationDelay: '0.2s'}}></div>
                                </div>
                            </div>
                        </div>
                    )}
                </section>
            </div>
        </div>
    </main>
  )
}

export default Resume