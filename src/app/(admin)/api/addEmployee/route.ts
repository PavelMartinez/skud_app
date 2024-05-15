import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { rename } from "fs/promises";
import database from "@/database/database";
import transliterate from "@/app/utils/transliterateRuToEng";
import getRandomLetter from "@/app/utils/getRandomLatinLetter";
import generator from 'generate-password-ts';

export const POST = async (req: NextRequest, res: NextResponse) => {
	const data = await req.json()

    const newFilename = `${data.surname}_${data.name}_${data.photo_path}`
    try {
		await rename(
            path.join(process.cwd(), "public/assets/" + data.photo_path),
            path.join(process.cwd(), "public/assets/" + newFilename)
		);
	} catch (error) {
		console.log("Error occured ", error);
		return NextResponse.json({ Message: "Failed", status: 500 });
	}

    data.photo_path = newFilename;
    try {
        const newLogin = `${Array.from(transliterate(data.surname.toLowerCase())[0])}${Array.from(transliterate(data.name.toLowerCase())[0])}${data.surname ? Array.from(transliterate(data.last_name.toLowerCase())[0]): ""}${(new Date().getMonth() + 1).toString().padStart(2, '0')}${getRandomLetter()}${100 + Math.floor(Math.random() * 899)}`

        const password = generator.generate({
            length: 7,
            numbers: true
        });
        const bcrypt = require("bcrypt");
        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = await database.models.Users.create({
            surname: data.surname,
            name: data.name,
            lastname: data.last_name || null,
            username: newLogin,
            hashedPassword: hashedPassword,
            role: data.role
        });
        if(newUser)
        {
            const newEmployee = await database.models.Employee.create({
                ...data,
                userId: newUser.id
            });
            if(newEmployee)
            {
                console.log(newEmployee)
                return NextResponse.json({ Message: "Success", status: 200, username: newLogin, password: password, surname: newEmployee.surname, name: newEmployee.name, last_name: newEmployee.last_name });
            }
        }
    } catch (error) {
		console.log("Error occured ", error);
		return NextResponse.json({ Message: "Failed", status: 500 });
	}
}; 