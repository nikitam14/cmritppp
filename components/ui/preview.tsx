"use client"

import dynamic from 'next/dynamic';

import 'react-quill-new/dist/quill.bubble.css';

import { useMemo } from 'react';

interface PreviewProps{

    value: string;
}

import React from 'react'

export const Preview = ({value} : PreviewProps) => {
    const ReactQuill = useMemo(()=>dynamic(()=>import("react-quill-new"), {ssr:false}),[])
  return (
    <div className='bg-white'>
        <ReactQuill value={value} theme="bubble"/>
    </div>
  )
}

export default Preview