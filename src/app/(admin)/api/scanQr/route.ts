import database from "@/database/database"

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const secret_key = String(searchParams.get('secret_key'))
    const QR = await database.models.Qr.findOne({
        where: {
            secret_key: secret_key
        },
        include: [
            {
                model: database.models.Employee,
                as: "IdQrEmployee"
            },
            {
                model: database.models.Guest,
                as: "IdQrGuest"
            }
        ]
        });
        if(QR)
        {
            const user = QR.IdQrEmployee || QR.IdQrGuest;
            return Response.json({ user: user, isGuest: user == QR.IdQrGuest ? 1 : 0 });
        }
}