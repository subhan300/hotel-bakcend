const popularRestaurant = require("../../models/popularRestaurant");
const promotion = require("../../models/promotions")
const Restaurant = require("../../models/restaurant")
const mongoose = require("mongoose")
const globalFunctions = require("../../utils/globalFunctions")
const ObjectId = mongoose.Types.ObjectId;
const addPopularRestaurant = async (req, res) => {

    try {
        const { restaurantId, expireDate } = req.body;
        const result = new popularRestaurant({ restaurantId: new ObjectId(restaurantId), expireDate });
        console.log("result===", result)

        const data = await result.save();
        const popularInfo = await popularRestaurant.populate(data, [
            { path: "restaurantId", select: "name" },
        ]);
        console.log("promo info====", popularInfo)
        res.status(200).send(popularInfo);

    } catch (error) {
        res.status(500).send(`Something went wrong ${error}`);
    }
}

const getPopularRestaurant = async (req, res) => {
    try {
        const result = await popularRestaurant.aggregate([
            {
              $lookup: {
                from: 'restaurants', // The name of the 'restaurant' collection
                localField: 'restaurantId',
                foreignField: '_id',
                as: 'restaurantDetails',
              },
            },
            {
              $unwind: '$restaurantDetails',
            },
            {
              $lookup: {
                from: 'locations', // The name of the 'locations' collection
                localField: 'restaurantDetails.location',
                foreignField: '_id',
                as: 'locationDetails',
              },
            },
            {
              $unwind: '$locationDetails',
            },
            {
              $project: {
                expireDate: 1,
                restaurantDetails: {
                  name: 1,
                  email: 1,
                  phone: 1,
                  logo: 1,
                  description: 1,
                  menus: 1,
                  createdAt: 1,
                  location: '$locationDetails', // Replace 'location' with the actual location details
                },
              },
            },
          ])
        res.status(200).send(result);

    } catch (error) {
        res.status(500).send(`Something went wrong ${error}`);
    }
}


module.exports = {
    addPopularRestaurant,
    getPopularRestaurant
}