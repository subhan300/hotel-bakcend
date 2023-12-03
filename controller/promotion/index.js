const promotion = require("../../models/promotions")
const mongoose =require("mongoose")
const ObjectId = mongoose.Types.ObjectId;
const addPromotion = async (req, res) => {

    try {
        const { menuId, restaurantId, discount, expireDate } = req.body;
        console.log(req.body);

        const result = new promotion({ menuId:new ObjectId(menuId), restaurantId:new ObjectId(restaurantId), discount, expireDate });
        const data = await result.save();
        res.status(200).send(data);

    } catch (error) {
        res.status(500).send(`Something went wrong ${error}`);
    }
}

const getPromotion = async (req, res) => {
    try {

        const result = await promotion.find({}).populate({path:"restaurantId",select:"name"}).populate({path:"menuId",select:"dish price"});
        const filterRestaurants=result.filter(res=>res.restaurantId && res.menuId)
        res.status(200).send(filterRestaurants);

    } catch (error) {
        res.status(500).send(`Something went wrong ${error}`);
    }
}

const featureRestaurant=async(req,res)=>{
    try {
        const { menuId, restaurantId, discount, expireDate } = req.body;
        console.log(req.body);

        const result = new promotion({ menuId, restaurantId, discount, dish, expireDate });
        const data = await result.save();
        res.status(200).send(data);

    } catch (error) {
        res.status(500).send(`Something went wrong ${error}`);
    }
}

module.exports = {
    addPromotion,
    getPromotion
}