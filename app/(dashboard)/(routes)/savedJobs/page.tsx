import { getJobs } from "@/actions/get-jobs";
import Box from "@/components/ui/box";
import { CustomBreadCrumb } from "@/components/ui/customBreadCrumb";
import { SearchContainer } from "@/components/ui/search-container";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import JobCardItem from "../search/_components/job-card-item";
import Image from 'next/image';  // Import Image component

interface SearchProps {
  searchParams: {
    title?: string;
    categoryId?: string;
    createdAtFilter?: string;
    shiftTiming?: string;
    workMode?: string;
    yearsOfExperience?: string;
  };
}

const SavedJobsPage = async ({ searchParams }: SearchProps) => {
  const { userId } = await auth();
  if (!userId) {
    redirect("/");
  }

  // Wait for the searchParams to be resolved before using them
  const validatedSearchParams = await searchParams;

  // Fetch saved jobs with the validated searchParams
  const jobs = await getJobs({ ...validatedSearchParams, savedJobs: true });

  return (
    <div className="flex-col px-6 py-6 space-y-6">
      <Box className="mt-4 items-center justify-start gap-2 mb-4 px-2">
        <CustomBreadCrumb breadCrumbPage="Saved Jobs" />
      </Box>

      {/* Search Bar */}
      <div className="mt-8">
        <SearchContainer />
      </div>

      {/* Display jobs or a message with image when there are no jobs */}
      <div>
        {jobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-6 mt-8">
            {/* Render job cards */}
            {jobs.map((job) => (
              <JobCardItem key={job.id} job={job} userId={userId} />
            ))}
          </div>
        ) : (
          <div className="text-center mt-10">
            {/* Display message and image when no jobs are found */}
            <div className="mt-4">
              <Image
                src="/img/404.jpg"  // Path to your "no results" image
                alt="No jobs found"
                width={400}  // Width of the image
                height={300}  // Height of the image
                className="mx-auto"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedJobsPage;
