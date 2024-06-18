import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { rename } from "fs/promises";
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
            return NextResponse.json({ Message: "Failed", status: 500 });
        }
    
        data.photo_path = newFilename;
    }
    console.log(data.photo_path);

    try {
        const updatedEmployee = await database.models.Employee.findByPk(data.employeeId)
    
        if(updatedEmployee)
        {
            updatedEmployee.surname = data.surname;
            updatedEmployee.name = data.name;
            updatedEmployee.last_name = data.last_name;
            updatedEmployee.position = data.position;
            updatedEmployee.department = data.department;
            updatedEmployee.foreignId = data.foreignId;
            if(data.photo_path)
            {
                updatedEmployee.photo_path = data.photo_path;
            }

            await updatedEmployee.save();
            return NextResponse.json({ Message: "Success", status: 200 });
        }
        else
        {
            return NextResponse.json({ Message: "Error", status: 500 });
        }
    } catch(err)
    {
        console.error(err)
        return NextResponse.json({ Message: "Error", status: 500 });
    }
}; 