import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { Job } from "@prisma/client";

type GetJobs = {
  title?: string;
  categoryId?: string;
  createdAtFilter?: "asc" | "desc";
  shiftTiming?: string;
  workMode?: string;
  yearsOfExperience?: string;
  savedJobs?: boolean;
};

export const getJobs = async ({
  title,
  categoryId,
  createdAtFilter,
  shiftTiming,
  workMode,
  yearsOfExperience,
  savedJobs,
}: GetJobs): Promise<Job[]> => {
  const { userId } = await auth();

  try {
    // Construct the query
    let query: any = {
      where: {
        isPublished: true,
        ...(title && { title: { contains: title, mode: "insensitive" } }),
        ...(categoryId && { categoryId }),
        ...(shiftTiming && { shiftTiming }),
        ...(workMode && { workMode }),
        ...(yearsOfExperience && { yearsOfExperience: { equals: yearsOfExperience } }),
        ...(savedJobs && userId && { savedUsers: { has: userId } }),
      },
      include: {
        company: true,
        category: true,
      },
      orderBy: {
        createdAt: createdAtFilter || "desc",
      },
    };

    // Fetch jobs from the database
    const jobs = await db.job.findMany(query);
    return jobs;
  } catch (error) {
    console.error("[GET_JOBS]:", error);
    return [];
  }
};
