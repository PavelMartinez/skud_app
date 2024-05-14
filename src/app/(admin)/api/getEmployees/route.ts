import database from "@/database/database"

export async function GET(request: Request) {
    const users = await database.models.Employee.findAll();


    return Response.json({ users })
}