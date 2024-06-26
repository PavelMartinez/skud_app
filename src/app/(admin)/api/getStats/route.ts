import database from "@/database/database"
import { Employee } from "@/database/models/Employee"
import { Guest } from "@/database/models/Guest"
import { revalidatePath } from "next/cache"
import { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
    const path = request.nextUrl.searchParams.get('path')
 
    if (path) {
      revalidatePath(path)
    }
    const countAllEmployee = await Employee.count({
        where: {
            is_blocked: 0
        }
    })
    const countEnteredEmployee = await Employee.count({
        where: {
            is_blocked: 0,
            is_entered: 1
        }
    })
    const countBreakEmployee = await Employee.count({
        where: {
            is_blocked: 0,
            is_entered: 1,
            is_onBreak: 1
        }
    })

    const countAllGuest = await Guest.count({
        where: {
            is_blocked: 0
        }
    })
    const countEnteredGuest = await Guest.count({
        where: {
            is_blocked: 0,
            is_entered: 1
        }
    })
    return Response.json({ 
        guest: {
            all: countAllGuest,
            entered: countEnteredGuest
        },
        employee: {
            all: countAllEmployee,
            entered: countEnteredEmployee,
            break: countBreakEmployee
        }
    })
}