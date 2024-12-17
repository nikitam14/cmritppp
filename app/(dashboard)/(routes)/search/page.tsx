import { getJobs } from "@/actions/get-jobs";
import { SearchContainer } from "@/components/ui/search-container";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { CategoriesList } from "./_components/categories-list";
import { PageContent } from "./_components/page-content";
import { AppliedFilters } from "./_components/applied-filters";

// Type definition for search parameters
interface SearchProps {
  searchParams: {
    title?: string;
    categoryId?: string;
    createdAtFilter?:string; 
    shiftTiming?: string;
    workMode?: string;
    yearsOfExperience?: string;
  };
}

// Utility function to validate sort order
const isValidSortOrder = (value: string | undefined): value is "asc" | "desc" =>
  value === "asc" || value === "desc";

const SearchPage = async ({ searchParams }: { searchParams: SearchProps["searchParams"] }) => {


  try {

    // Validate and ensure `createdAtFilter` is correct
    const validatedSearchParams = {
      ...searchParams,
      createdAtFilter: isValidSortOrder(searchParams.createdAtFilter)
        ? searchParams.createdAtFilter
        : undefined,
    };
   

    // Fetch categories
    const categories = await db.category.findMany({
      orderBy: {
        name: "asc",
      },
    });

    // Fetch user authentication
    const { userId } = await auth();

    // Fetch jobs
    const jobs = await getJobs(validatedSearchParams);
    // console.log(`Jobs count:, ${jobs.length}`);

    return (
      <>
        <div className="px-6 pt-6 block md:hidden md:mb-0">
          <SearchContainer />
        </div>

        <div className="p-6">
          {/* Categories */}
          <CategoriesList categories={categories} />

           {/* Applied filters */}
           <AppliedFilters categories={categories}/>

          {/* Page Content */}
          <PageContent jobs={jobs} userId={userId} />
        </div>
      </>
    );
  } catch (error) {
    console.error("Error in SearchPage:", error);
    return (
      <div className="text-center mt-20">
        <h1 className="text-2xl font-bold text-red-500">Something went wrong!</h1>
      </div>
    );
  }
};


 



export default SearchPage;



