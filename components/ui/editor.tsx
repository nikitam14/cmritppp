"use client"

import dynamic from 'next/dynamic';

import 'react-quill-new/dist/quill.snow.css';

import { useMemo } from 'react';

interface EditorProps{
    onChange : (value: string) => void;
    value: string;
}

import React from 'react'

export const Editor = ({onChange,value} : EditorProps) => {
    const ReactQuill = useMemo(()=>dynamic(()=>import("react-quill-new"), {ssr:false}),[])
  return (
    <div className='bg-white'>
        <ReactQuill value={value} onChange={onChange} theme="snow"/>
    </div>
  )
}

export default Editor