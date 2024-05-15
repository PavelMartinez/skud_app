import database from "@/database/database"

export async function GET(request: Request) {
    const guests = await database.models.Guest.findAll();


    return Response.json({ guests })
}