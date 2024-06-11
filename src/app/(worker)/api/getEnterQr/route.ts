import { auth } from "@/auth"
import database from "@/database/database";
import { NextResponse } from "next/server"
import generator from 'generate-password-ts';


// @ts-ignore
export const GET = auth(async function GET(req) {
  	if(req.auth)
	{
		const userAuth = req.auth.user;
		const thisEmployee = await database.models.Employee.findOne({
			where: {
				userId: userAuth.id
			},
			include: [{
				model: database.models.Qr,
				as: "Qrs"
			}]
		});

		const thisGuest = await database.models.Guest.findOne({
			where: {
				userId: userAuth.id
			},
			include: [{
				model: database.models.Qr,
				as: "Qrs"
			}]
		});

		const user = thisEmployee || thisGuest;

		if(user)
		{
			// @ts-ignore
			const validQr = user.Qrs.filter((item: {
				type: string; expiredAt: string | number | Date; 
				}) => { return new Date(item.expiredAt) >= new Date() && item.type == "enterleave"});
			if(validQr.length > 0)
			{
				return NextResponse.json({ qr: validQr[0], user: user, isGuest: user == thisGuest })
			}
			// Создаём новый QR
			const secret_key = generator.generate({
				length: 128,
				numbers: true
			});
			const bcrypt = require("bcrypt");
			const hashed_secret_key = await bcrypt.hash(secret_key, 12);

			const currentDate = new Date();
			currentDate.setHours(currentDate.getHours() + 1);

			// @ts-ignore
			const newQR = await user.createQr({
				type: "enterleave",
				secret_key: hashed_secret_key,
				expiredAt: currentDate
			})
			console.log(newQR);
			return NextResponse.json({ qr: newQR, user: user, isGuest: user == thisGuest });
		}
	}
  	return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
})