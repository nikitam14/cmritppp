"use client"

import Box from "@/components/ui/box";
import { CustomBreadCrumb } from "@/components/ui/customBreadCrumb";
import { Company, Job } from "@prisma/client"
import {  UserProfile } from "@prisma/client"

interface JobDetailsPageContentProps{
    job: Job & {company :  Company | null},
    jobId: string,
    userProfile: UserProfile | null;
   
}
export const JobDetailsPageContent= ({job,jobId, userProfile}: JobDetailsPageContentProps) =>{


  return (
    <>
      <Box className="mt-4">
        <CustomBreadCrumb
            breadCrumbItem={[{label:"Search", link:"/search"}]}
            breadCrumbPage={job?.title !== undefined ? job.title : ""}
        />
      </Box>
    </>
  )
}
