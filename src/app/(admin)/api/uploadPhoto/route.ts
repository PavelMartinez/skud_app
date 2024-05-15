import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { writeFile } from "fs/promises";

export const POST = async (req: NextRequest, res: NextResponse) => {
	const formData = await req.formData();

	const file = formData.get("file");
	if (!file) {
		return NextResponse.json({ error: "No files received." }, { status: 400 });
	}
	// @ts-ignore
	const extension = file.name.split('.').pop();

	console.log(req)
	// @ts-ignore
	const buffer = Buffer.from(await file.arrayBuffer());
	// @ts-ignore
	const filename = `photo_uploaded_${Math.floor(new Date().getTime() / 1000)}.${extension}`;
	try {
		await writeFile(
		path.join(process.cwd(), "public/assets/" + filename),
		buffer
		);
		return NextResponse.json({ Message: "Success", status: 201, photo_path: filename });
	} catch (error) {
		console.log("Error occured ", error);
		return NextResponse.json({ Message: "Failed", status: 500 });
	}
};