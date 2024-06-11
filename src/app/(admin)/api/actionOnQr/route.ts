import database from "@/database/database"
import { auth } from "@/auth"
import { NextResponse } from "next/server"

// @ts-ignore
export const GET = auth(async function GET(request) {
  	if(request.auth)
	{
        const userAuth = request.auth.user;
        const { searchParams } = new URL(request.url)
        const secret_key = String(searchParams.get('secret_key'))
        console.log(secret_key)
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
            console.log(QR)
            // @ts-ignore
            if(QR && new Date(QR?.expiredAt) >= new Date())
            {
                const user = QR.IdQrEmployee || QR.IdQrGuest;
                if(QR.IdQrEmployee)
                {
                    // Если это сотрудник
                    if(QR.type == "enterleave")
                    {
                        // На вход и выход
                        // Обновить статус пользователя, добавить лог
                        if(user.is_onBreak)
                        {
                            return NextResponse.json({ message: "Сотрудник на перерыве. Отсканируйте QR перерыва" })
                        }
                        if(user.is_entered == 1)
                        {
                            // Внутри, скан на выход
                            user.is_entered = 0;
                            user.lastLeftAt = new Date();
                            await user.save();

                            await user.createLog({
                                action: "leftQr",
                                issuedByUser: userAuth.id
                            })
                        }
                        else
                        {
                            // на улице, скан на вход
                            user.is_entered = 1;
                            user.lastEnteredAt = new Date();
                            await user.save();

                            await user.createLog({
                                action: "enteredQr",
                                issuedByUser: userAuth.id
                            })
                        }
                    }
                    else {
                        if(!user.is_entered)
                        {
                            return NextResponse.json({ message: "Сотрудник на не на работе. Отсканируйте QR входа/выхода" })
                        }
                        // На перерыв
                        user.is_onBreak = user.is_onBreak ? 0 : 1;
                        user.lastBreakAt = new Date();
                        await user.save();

                        await user.createLog({
                            action: user.is_onBreak ? "leftOnBreakQr" : "enteredAfterBreakQr",
                            issuedByUser: userAuth.id
                        })
                    }
                }
                else if(QR.IdQrGuest)
                {
                    if(user.is_entered == 1)
                    {
                        // Внутри, скан на выход
                        user.is_entered = 0;
                        user.lastLeftAt = new Date();
                        await user.save();

                        await user.createLog({
                            action: "leftQr",
                            issuedByUser: userAuth.id
                        })
                    }
                    else
                    {
                        // на улице, скан на вход
                        user.is_entered = 1;
                        user.lastEnteredAt = new Date();
                        await user.save();

                        await user.createLog({
                            action: "enteredQr",
                            issuedByUser: userAuth.id
                        })
                    }
                }
                else
                {
                    // Ни тот ни другой, ошибка
                    return NextResponse.json({ message: "QR-код неисправен" })
                }
                return NextResponse.json({ status: "ok", message: "QR отсканирован" });
            }
            else
            {
                return NextResponse.json({ message: "No valid QR" }, { status: 404 })
            }
        }
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
})