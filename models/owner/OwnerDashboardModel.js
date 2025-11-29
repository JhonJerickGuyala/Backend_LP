import db from '../../config/db.js';

const OwnerDashboardModel = {
    fixDate(dateField) { 
        return `CAST(${dateField} AS DATE)`; 
    },

    // SALES STATS BOXES (Uses PH Time for all stats)
    getSalesStatsBoxes: async () => {
        const phTimeNow = `CONVERT_TZ(NOW(), '+00:00', '+08:00')`;
        const phDateToday = `DATE(${phTimeNow})`;
        const phMonth = `MONTH(${phTimeNow})`;
        const phYear = `YEAR(${phTimeNow})`;
        
        const [todayRows] = await db.query(`SELECT IFNULL(SUM(amount), 0) as total FROM sales WHERE DATE(date) = ${phDateToday}`);
        const [monthRows] = await db.query(`SELECT IFNULL(SUM(amount), 0) as total FROM sales WHERE MONTH(date) = ${phMonth} AND YEAR(date) = ${phYear}`);
        const [yearRows] = await db.query(`SELECT IFNULL(SUM(amount), 0) as total FROM sales WHERE YEAR(date) = ${phYear}`);

        return {
            today: parseFloat(todayRows[0].total) || 0,
            thisMonth: parseFloat(monthRows[0].total) || 0,
            thisYear: parseFloat(yearRows[0].total) || 0
        };
    },
}