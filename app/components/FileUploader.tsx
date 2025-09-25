import React, {useCallback, useState} from 'react'
import {useDropzone} from 'react-dropzone'
import { formatSize } from '~/lib/utils';

interface FileUploaderProps{
    onFileSelect?: (file:File | null) => void;
}

const FileUploader = ({onFileSelect}:FileUploaderProps) => {
    // const [file,setFile] = useState();
    const onDrop = useCallback((acceptedFiles:File[]) => {
        const file = acceptedFiles[0] || null;
        onFileSelect?.(file);
    // Do something with the files
  }, [onFileSelect])
  const maxFileSize = 20*1024*1024;
  const {getRootProps, getInputProps, isDragActive, acceptedFiles} = useDropzone({onDrop, multiple:false, accept:{'application/pdf':['.pdf']},maxSize: maxFileSize})
  const file = acceptedFiles[0] || null;

  return (
    <div className="w-full gradient-border">
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <div className='space-y-4 cursor-pointer'>
        
        {file?(
        <div className='uploader-selected-file' >
                <img src="images/pdf.png" alt="pdf" className='size-10'/>
            <div className='flex items-center space-x-3' onClick={(e) => e.stopPropagation()}>
                <div className=''>
                    <p className='text-lg text-gray-700 font-medium truncate max-w-xs'>{file.name}</p>
                    <p className='text-sm text-gray-500'>{formatSize(file.size)}</p>
                </div>
                <button className='p-2 cursor-pointer mt-2 mx-auto bg-gray-100 rounded-full hover:bg-gray-200' onClick={(e)=>[ onFileSelect?.(null)]}>
                    <img src="icons/cross.svg" alt="remove" className='w-4 h-4'/>
                </button>
            </div>
            {/* <img src="/images/pdf.png" alt="" className='size-20'/> */}
        </div>
      ):(
        <div>
            <p className='text-lg text-gray-500'>
                <div className='mx-auto w-16 h-16 flex items-center justify-center'>
                    <img src="icons/info.svg" alt="upload" className='size-20'/>
                </div>
                <span className='semi-bold'>
                    Click to upload
                </span> or drag and drop
            </p>
            <p className='text-lg text-gray-500'>
                PDF (max {formatSize(maxFileSize)})
            </p>
        </div>
      )}
      </div>
      
    </div>
    </div>
  )
}

export default FileUploader