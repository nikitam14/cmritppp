"use client"

import { cn } from "@/lib/utils";

interface BoxProps{
    children: React.ReactNode;
    className?: string;
}

const Box=({children, className}: BoxProps)=>{
    return(
        <div className={cn("w-full flex items-center justify-between", className)}>
            {children}
        </div>
    )
}

export default Box;