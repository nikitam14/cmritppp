import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { ArrowLeft, LayoutDashboard, ListChecks } from "lucide-react";
import Link from "next/link";
import { IconBadge } from "@/components/icon-badge";
import { Banner } from "@/components/ui/banner";
import { CompanyName } from "./name-form";
import { CompanyDescriptionForm } from "./description-form";

const CompanyEditPage = async ({params} : { params: {companyId: string }})=>{

    // Validate the jobId format (MongoDB ObjectId format)
    const validObjectIdRegex = /^[0-9a-fA-F]{24}$/;
    if (!validObjectIdRegex.test(params.companyId)) {
    return redirect("/admin/companies");
    }

    // Authenticate user
    const { userId } = await auth();
    if (!userId) {
    return redirect("/");
    }

    // Fetch job details
    const company = await db.company.findUnique({
    where: {
        id: params.companyId,
        userId,
    },
    });

    // Fetch categories
    const categories = await db.category.findMany({
    orderBy: { name: "asc" },
    });

    // Redirect if job not found
    if (!company) {
    return redirect("/admin/companies");
    }

    // Determine completion status
    const requiredFields = [
        company.name, 
        company.description, 
        company.logo, 
        company.coverImage,
        company.mail, 
        company.website, 
        company.linkedin, 
        company.address_line_1,
        company.city,
        company.state,
        company.overview,
        company.whyJoinUs
    ];

    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter(Boolean).length;
    const completionText = `(${completedFields}/${totalFields})`;
    const isComplete = requiredFields.every(Boolean);


    
    return ( 
        <div className="p-6">
        {/* Back Button */}
        <Link href={"/admin/companies"}>
            <div className="flex items-center gap-3 text-sm text-neutral-500">
            <ArrowLeft className="w-4 h-4" />
            Back
            </div>
        </Link>

        {/* Title and Publish Button */}
        <div className="flex items-center justify-between my-4">
            <div className="flex flex-col gap-y-2">
            <h1 className="text-2xl font-medium">Company Setup</h1>
            <span className="text-sm text-neutral-500">Complete All Fields {completionText}</span>
            </div>
        </div>


        {/* Form Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
            <div>
            {/* Header */}
            <div className="flex items-center gap-x-2">
                <IconBadge icon={LayoutDashboard} />
                <h2 className="text-xl text-neutral-700">Customize your company</h2>
            </div>

            {/* Name form */}
            <CompanyName initialData={company} companyId={company.id}/>

            {/*Description*/}
            <CompanyDescriptionForm initialData={company} companyId={company.id}/>

            </div>

            {/* right container */}
            <div className="space-y-6">

            </div>



        </div>
        </div>
     );
}

export default CompanyEditPage;