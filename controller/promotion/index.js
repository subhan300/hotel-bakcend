const promotion = require("../../models/promotions")
const addPromotion = async (req, res) => {

    try {
        const { menuId, restaurantId, discount, dish, expireDate } = req.body;
        console.log(req.body);

        const result = new promotion({ menuId, restaurantId, discount, dish, expireDate });
        const data = await result.save();
        res.status(200).send(data);

    } catch (error) {
        res.status(500).send(`Something went wrong ${error}`);
    }
}

const getPromotion = async (req, res) => {
    try {
        console.log(req.body);

        const result = await promotion.find({}).populate({path:"restaurantId",select:"name"}).populate({path:"menuId",select:"dish price"});
        res.status(200).send(result);

    } catch (error) {
        res.status(500).send(`Something went wrong ${error}`);
    }
}


module.exports = {
    addPromotion,
    getPromotion
}