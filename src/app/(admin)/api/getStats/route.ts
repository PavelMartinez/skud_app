import database from "@/database/database"
import { Employee } from "@/database/models/Employee"

export async function GET(request: Request) {
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

    const countAllGuest = await Employee.count({
        where: {
            is_blocked: 0
        }
    })
    const countEnteredGuest = await Employee.count({
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