import generateDailyPresenceReport from "@/app/utils/generateDailyPresenceReport";
import database from "@/database/database"

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    if(/^[0-9]+$/gi.test(searchParams.get('id') || ""))
    {
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
        });
        const presenceReport = await generateDailyPresenceReport(id);
        console.log(presenceReport);
        return Response.json({ user, presenceReport })
    }
    else {
        const id = String(searchParams.get('id'))
        console.log("id ", id)
        const user = await database.models.Employee.findOne({
            include: [
                {
                    model: database.models.Qr,
                    as: "Qrs"
                },
                {
                    model: database.models.Log,
                    as: "Logs"
                }
            ],
            where: {
                userId: id
            }
        });
        return Response.json({ user }) 
    }
}