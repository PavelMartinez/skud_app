import database from "@/database/database"

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const id = Number(searchParams.get('id'))
    const guest = await database.models.Guest.findByPk(id, {
        include: [
            {
                model: database.models.Qr,
                as: "Qrs"
            },
            {
                model: database.models.Log,
                as: "Logs"
            }
        ]
    }
    );
    console.log(guest)

    return Response.json({ guest })
}