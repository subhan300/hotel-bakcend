const promotion = require("../../models/promotions")
const Restaurant = require("../../models/restaurant")
const mongoose = require("mongoose")

const ObjectId = mongoose.Types.ObjectId;
const addPromotion = async (req, res) => {

    try {
        const { menuId, restaurantId, discount, expireDate, openingAt } = req.body;
        const result = new promotion({ menuId: new ObjectId(menuId), restaurantId: new ObjectId(restaurantId), discount, expireDate, openingAt });
        console.log("result===", result)

        const data = await result.save();
        // const promotionInfo = await data.populate({ path: "restaurantId", select: "name" }).populate({ path: "menuId", select: "dish price img" });
        const promotionInfo = await promotion.populate(data, [
            { path: "restaurantId", select: "name" },
            { path: "menuId", select: "dish price img" }
        ]);
        console.log("promo info====", promotionInfo)
        res.status(200).send(promotionInfo);

    } catch (error) {
        res.status(500).send(`Something went wrong ${error}`);
    }
}

const getPromotion = async (req, res) => {
    try {
        const result = await promotion.find({}).populate({ path: "restaurantId", select: "name" }).populate({ path: "menuId", select: "dish price img" });
        // const pipeline = [
        //     {
        //         $lookup: {
        //             from: 'restaurantmenus',
        //             localField: 'menuId',
        //             foreignField: '_id',
        //             as: 'restaurant',
        //         },
        //     },
        //     {
        //         $unwind: '$restaurant',
        //     },
        //     {
        //         $lookup: {
        //             from: 'restaurantMenu',
        //             localField: 'menuId',
        //             foreignField: '_id',
        //             as: 'menu',
        //         },
        //     },
        //     {
        //         $unwind: '$menu',
        //     },
        //     {
        //         $project: {
        //             _id: 0,
        //             restaurant: '$restaurant.name',
        //             menu: '$menu.dish',
        //             discount: 1,
        //             openingAt: 1,
        //         },
        //     },
        // ];



        // const resi = await promotion.aggregate(pipeline)
        // console.log("res===", resi)
        res.status(200).send(result);

    } catch (error) {
        res.status(500).send(`Something went wrong ${error}`);
    }
}

const featureRestaurant = async (req, res) => {
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