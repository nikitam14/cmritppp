import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { DataTable } from "@/components/ui/data-table";
import { columns, JobsColumns } from "./_components/columns";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { format } from "date-fns";
const JobsPageOverview = async () => {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/");
  }

  const jobs = await db.job.findMany({
    where: {
      userId,
    },
    include: {
      category: true,
      company:true
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formatedJobs: JobsColumns[] = jobs.map((job) => ({
    id: job.id,
    title: job.title,
    company: job.company ? job.company.name: "",
    category: job.category ? job.category?.name : "N/A",
    isPublished: job.isPublished,
    createdAt: job.createdAt
      ? format(job.createdAt.toLocaleDateString(), "MMMM do, yyyy")
      : "N/A",
  }));

  return (
    <div className="p-6">
      <div className="flex items-end justify-end">
        <Link href={"/admin/create"}>
          <Button>
            <Plus className="w-5 h-5 mr-2"></Plus>
            New Job
          </Button>
        </Link>
      </div>

      {/* Datatable - List of Jobs */}
      <div className="mt-6">
        <DataTable columns={columns} data={[]} searchKey="title"/>
      </div>
    </div>
  );
};

export default JobsPageOverview;
