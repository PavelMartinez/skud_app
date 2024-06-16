import { Log } from "@/database/models/Log";
import { Op } from "sequelize";

async function generateDailyPresenceReport(employeeId: number) {
    return new Promise<{ date: any; duration: number; }[]>(async (resolve, reject) => {
        const logs = await Log.findAll({
            where: {
                employeeId: employeeId,
                action: {
                    [Op.or]: ['enteredQr', 'leftQr']
                }
            },
            order: [
                ['createdAt', 'ASC']
            ],
            raw: true  // Extracts the data as plain objects
        });
      
        const presenceReport: { date: any; duration: number; }[] = [];
        let currentEntry: Log | null = null;
      
        logs.forEach(log => {
          if (log.action === 'enteredQr') {
            currentEntry = log;
          } else if (log.action === 'leftQr' && currentEntry) {
            // @ts-ignore
            const duration = (new Date(log.createdAt) - new Date(currentEntry.createdAt)) / 1000; // duration in seconds
            presenceReport.push({
              date: new Date(currentEntry.createdAt).toISOString().split('T')[0],
              duration: duration
            });
            currentEntry = null;
          }
        });
      
        return resolve(presenceReport);
    })
}

export default generateDailyPresenceReport;