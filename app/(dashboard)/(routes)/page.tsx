import { getJobs } from "@/actions/get-jobs";
import Box from "@/components/ui/box";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { HomesearchContainer } from "../_components/home-search-container";
import Image from "next/image";

const DashboardHomePage = async () => {
    // Fetch authenticated user
    const { userId } = await auth();
    
    // Fetch jobs, categories, and companies
    const jobs = await getJobs({});
    const categories = await db.category.findMany({
        orderBy: { name: "asc" },
    });
    const companies = await db.company.findMany({
        orderBy: {
            createdAt: "desc",
        },
    });

    return (
        <div className="flex-col py-6 px-4 space-y-24">
            {/* Header Section */}
            <Box className="flex-col justify-center w-full space-y-4 mt-12">
                <h2 className="text-2xl md:text-4xl font-sans font-bold tracking-wide text-neutral-600">
                    Find Your Dream Job
                </h2>
                <p className="text-2xl text-muted-foreground">
                    {jobs.length} + Jobs For you to explore
                </p>
            </Box>

            {/* Search Container Section */}
            <HomesearchContainer />

            {/* Image Section */}
            <div className="flex justify-center items-center">
                <Image
                    alt="Home Screen Banner"
                    src="/img/job-portal-banner.png"
                    width={400}
                    height={300}
                    className="object-cover rounded-lg"
                />
            </div>
        </div>
    );
};

export default DashboardHomePage;
