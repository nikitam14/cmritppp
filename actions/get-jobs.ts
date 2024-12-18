import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { Job } from "@prisma/client";

type GetJobs = {
  title?: string;
  categoryId?: string;
  createdAtFilter?: string;
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

    if(typeof title !== "undefined" || typeof categoryId !== "undefined"){
      query.where= {
        AND: [
          typeof title!== "undefined" && {
            title: {
              contains : title,
              mode: "insensitive"
            }
          },
          typeof categoryId !== "undefined" && {
            categoryId : {
              equals: categoryId
            }
          }
        ].filter(Boolean)
      }
    }
    

    // check whether the createdAtFilter is provided or not
    if(createdAtFilter){
      const currentDate= new Date();
      // console.log(currentDate);
      let startDate : Date;
      switch(createdAtFilter){
        case "today" :
          startDate= new Date(currentDate);
          break;

        case "yesterday" :
          startDate=new Date(currentDate);
          startDate.setDate(startDate.getDate()-1)
          break;

        case "thisWeek":
          startDate=new Date(currentDate);
          startDate.setDate(startDate.getDate()-currentDate.getDay())
          break;
        case "lastWeek":
          startDate=new Date(currentDate);
          startDate.setDate(startDate.getDate()-currentDate.getDay()-7)
          break;
        case "thisMonth":
          startDate=new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
          break;
        default:
          startDate=new Date(0);
      }

      // add the condition in the query
      query.where.createdAt = {
        gte: startDate
      }
    }

    // filter the data based on the shift timing
    let formattedShiftTiming = shiftTiming?.split(',')

    if(formattedShiftTiming && formattedShiftTiming.length>0){
      query.where.shiftTiming={
        in: formattedShiftTiming,
      }
    }

    // filter data based on wokring modes
    let formattedWorkingMode = workMode?.split(',')

    if(formattedWorkingMode && formattedWorkingMode.length>0){
      query.where.workMode={
        in: formattedWorkingMode,
      }
    }

    // filter data based on wokring experience
    // let formattedYOExperience = yearsOfExperience?.split(',')

    // if(formattedYOExperience && formattedYOExperience.length>0){
    //   query.where.workMode={
    //     in: formattedYOExperience,
    //   }
    // }

    

    // Fetch jobs from the database
    const jobs = await db.job.findMany(query);
    return jobs;
  } catch (error) {
    console.error("[GET_JOBS]:", error);
    return [];
  }
};
