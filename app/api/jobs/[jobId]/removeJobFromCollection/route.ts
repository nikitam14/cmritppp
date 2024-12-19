import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define the type for the context parameter
interface Context {
  params: {
    jobId: string;
  };
}

export const PATCH = async (req: Request, { params }: Context) => {
  try {
    const { userId } = await auth();
    const { jobId } = params; // Correctly destructure jobId from params

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!jobId) {
      return new NextResponse("Id is Missing", { status: 404 });
    }

    const job = await db.job.findUnique({
      where: {
        id: jobId,
        
      },
    });

    if (!job) {
      return new NextResponse("Job Not Found", { status: 404 });
    }

    // Check if userId exists in savedUsers
    const userIndex = job.savedUsers.indexOf(userId);

    let updatedJob;

    if (userIndex !== -1) {
      // Remove the userId from savedUsers
      updatedJob = await db.job.update({
        where: {
          id: jobId,
          
        },
        data: {
          savedUsers: {
            set: job.savedUsers.filter((savedUserId) => savedUserId !== userId),
          },
        },
      });
    }

    return NextResponse.json(updatedJob);
  } catch (err) {
    console.log(`[JOB_PUBLISH_PATCH] : ${err}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
