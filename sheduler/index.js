const cron = require('node-cron');
const promotion=require("../models/promotions");
const dayjs = require('dayjs');

// Schedule a job to run every day to check and delete expired documents
cron.schedule('* * * * *', async () => {
    try {
        const currentDate =dayjs(new Date()).format("YYYY-MM-DD");
        console.log("curreendtae",currentDate)
        await promotion.deleteMany({ expireDate: { $lte: currentDate } });
    } catch (error) {
        console.error('Error deleting expired documents:', error);
    }
});
