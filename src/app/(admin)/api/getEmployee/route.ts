import database from "@/database/database"

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const id = Number(searchParams.get('id'))
    const user = await database.models.Employee.findByPk(id, {
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
    console.log(user)

    return Response.json({ user })
}