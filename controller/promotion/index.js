const promotion = require("../../models/promotions")
const addPromotion = async (req, res) => {

    try {
        const { restaurantName, restaurantId, discount, dish, expireDate } = req.body;
        console.log(req.body);

        const result = new promotion({ restaurantName, restaurantId, discount, dish, expireDate });
        const data = await result.save();
        res.status(200).send(data);

    } catch (error) {
        res.status(500).send(`Something went wrong ${error}`);
    }
}

const getPromotion = async (req, res) => {
    try {
        console.log(req.body);

        const result = await promotion.find({});
        res.status(200).send(result);

    } catch (error) {
        res.status(500).send(`Something went wrong ${error}`);
    }
}


module.exports = {
    addPromotion,
    getPromotion
}