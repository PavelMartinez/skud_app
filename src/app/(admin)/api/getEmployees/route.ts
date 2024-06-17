import database from "@/database/database"
import { revalidatePath } from "next/cache";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const path = request.nextUrl.searchParams.get('path')
 
    if (path) {
      revalidatePath(path)
    }
    const users = await database.models.Employee.findAll();


    return Response.json({ users })
}