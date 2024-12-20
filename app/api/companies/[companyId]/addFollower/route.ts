import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const PATCH = async (req: Request, {params}: {params : {companyId: string}}) => {
    try {
        // Await the result of auth() to destructure userId
        const { userId } = await auth();
        const {companyId}=params;

        const updatedValues = await req.json();

        if (!userId) {
            return new NextResponse("Un-Authorized", { status: 401 });
        }

        if (!companyId) {
            return new NextResponse("ID is missing", { status: 401 });
        }

        const company = await db.company.findUnique({
            where:{
                id: companyId,
            },
        });

        if(!company){
            return new NextResponse("Company Not Found", {status: 401});
        }

        // update the data
        const updatedData={
            
        }

        return NextResponse.json(company);
    } catch (error) {
        console.log(`[COMPANY_PATCH] : ${error}`);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
};
