import React, { useState, type FormEvent, type FormEventHandler } from 'react'
import FileUploader from '~/components/fileUploader';
import Navbar from '~/components/Navbar'

const Upload = () => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [statusText, setStatusText] = useState('');
    const handleSubmit = (e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        const form = e.currentTarget.closest('form');
        if (!form) return;
            const formData = new FormData(form);
            const companyName = formData.get('company-name')
            const jobTitle = formData.get('job-title')
            const jobDescription = formData.get('job-description')
        console.log({companyName,jobDescription,jobTitle,file})
    };
    const [file, setFile] = useState<File|null>(null);
    const handleFileSelect = (file:File| null) => {
        setFile(file);
    };
    return (
    <main className="bg-[url('images/bg-auth.svg')] bg-cover">
        <Navbar/>
        <section className='main-section'>
            <div className='page-heading py-16'>
                <h1>Smart feedback for your dream job</h1>
                {isProcessing?(
                    <>
                        <h2>{statusText}</h2>
                        <img src="/images/resume-scan.gif" className='w-full' />
                    </>
                ):(
                    <h2 className=''>Drop your resume for ATS score and improvement tips.</h2>

                )}
                {!isProcessing && (<form id="upload-form" 
                    onSubmit={handleSubmit} className='flex flex-col gap-4 mt-8'>
                        <div className='form-div'>
                            <label htmlFor="company-name">Company Name</label>
                            <input type="text" name="company-name" placeholder='Company Name' id='company-name' />
                        </div>  
                        <div className='form-div'>
                            <label htmlFor="job-title">Job Title</label>
                            <input type="text" name="job-title" placeholder='Job Title' id='job-title' />
                        </div>  
                         <div className='form-div'>
                            <label htmlFor="job-description">Job Description</label>
                            {/* <input type="text" name="job-description" placeholder='Job Description' id='job-description' /> */}
                            <textarea name="job-description" id="job-description" rows={5} placeholder='Job Description'></textarea>
                        </div>  
                         <div className='form-div'>
                            <label htmlFor="uploader">Upload Resume</label>
                            <FileUploader onFileSelect={handleFileSelect}/>
                        </div>  
                        <button className='primary-button' type='submit'>Analyze Resume</button>
                </form>)}
            </div>

        </section>
    </main>
  )
}

export default Upload