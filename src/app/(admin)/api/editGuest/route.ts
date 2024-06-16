import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { rename } from "fs/promises";
import { Guest } from "@/database/models/Guest";
import database from "@/database/database";

export const POST = async (req: NextRequest, res: NextResponse) => {
	const data = await req.json()

    if(data.photo_path)
    {
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
    }

    try {
        console.log({ ...data })
        const updatedGuest = await database.models.Guest.findByPk(data.guestId)
    
        if(updatedGuest)
        {
            updatedGuest.surname = data.surname;
            updatedGuest.name = data.name;
            updatedGuest.last_name = data.last_name;
            updatedGuest.visit_purpose = data.visit_purpose;
            updatedGuest.document_number = data.document_number;
            updatedGuest.foreignId = data.foreign_id;
            if(data.photo_path)
                updatedGuest.photo_path = data.photo_path;

            await updatedGuest.save();


            return NextResponse.json({ Message: "Success", status: 200 });
        }
        else
        {
            console.error(updatedGuest)
            return NextResponse.json({ Message: "Error", status: 500 });
        }
    } catch(err)
    {
        console.error(err)
        return NextResponse.json({ Message: "Error", status: 500 });
    }
}; 