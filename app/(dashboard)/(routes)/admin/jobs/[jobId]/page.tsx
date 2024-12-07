import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { ArrowLeft, BadgeIndianRupee, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { JobPublishAction } from "./_components/job-publish-action";
import { Banner } from "@/components/ui/banner";
import { IconBadge } from "@/components/icon-badge";
import { TitleForm } from "./_components/title-form";

const JobDetailsPage = async(
    {params} : {params : {jobId : string}}
) =>{

    // Verify the mongodb ID 
        const validObjectIdRegex = /^[0-9a-fA-F]{24}$/;

        if(!validObjectIdRegex.test(params.jobId)){
            return redirect("/admin/jobs")
        }

        const {userId}=await auth();

        if(!userId){
            return redirect("/");
        }

        const job= await db.job.findUnique({
            where:{
                id: params.jobId,
                userId,
            }
        });

        if(!job){
            return redirect("/admin/jobs");
        }

        const requiredFields =[
            job.title,
            job.description,
            job.imageUrl,
        ]

        const totalFields = requiredFields.length;
        const completedFields= requiredFields.filter(Boolean).length;
        const completionText= `(${completedFields}/${totalFields})`;

        const isComplete = requiredFields.every(Boolean);

    return(
        <div className="p-6">
           <Link href={"/admin/jobs"}>
                <div className="flex items-center gap-3 text-sm text-neutral-500">
                    <ArrowLeft className="w-4 h-4"/>
                    Back
                </div>
           </Link>

           {/* Title */}
           <div className="flex items-center justify-between my-4">
                <div className="flex flex-col gap-y-2">
                    <h1 className="text-2xl font-medium">Company Setup</h1>
                    <span className="text-sm text-neutral-500">Complete All Fields {completionText}</span>
                </div>

                {/* Action Button */}
                <JobPublishAction 
                    jobId={params.jobId}
                    isPublished={job.isPublished}
                    disabled={!isComplete}
                />
           </div>

           {/* Warning before publishing the course */}
           {!job.isPublished &&(
            <Banner variant={"warning"} 
            label="This Company is unpublished. It will not be visible in the companies list"/>   
           )}

           {/* COntainer layout */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
            <div>
                {/* Title */}
                <div className="flex items-center gap-x-2">
                    <IconBadge icon={LayoutDashboard}/>
                    <h2 className="text-xl text-neutral-700">Customize your company</h2>
                </div>

                {/* Title form */}
                <TitleForm initialData={job} jobId={job.id}/>
            </div>

           </div>
        </div>
    )
}

export default JobDetailsPage;