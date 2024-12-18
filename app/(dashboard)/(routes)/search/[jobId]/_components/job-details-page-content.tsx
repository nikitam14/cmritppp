"use client"

import Box from "@/components/ui/box";
import { Company, Job } from "@prisma/client"
// import {  userProfile } from "@prisma/client"

interface JobDetailsPageContentProps{
    job: Job & {company :  Company | null},
    jobId: string,
    // userProfile: UserProfile | null;
   
}
export const JobDetailsPageContent= ({job,jobId, /*userProfile*/}: JobDetailsPageContentProps) =>{


  return (
    <>
      {/* <Box className="mt-4">
        <CustomBreadCrumb
            breadCrumbItem={[{label:"Search", link:"/search"}]}
            breadCrumbItem={job?.title !== undefined ? job.title : ""}
        />
      </Box> */}
    </>
  )
}
