const Restaurant = require("../models/restaurant")


const restaurantCombineWithChunk = async (from, localField, foreignField, as) => {
  const restaurantCombine = await Restaurant.aggregate([
    {
      $lookup: {
        from,
        localField,
        foreignField,
        as
      },

    },
    {
      $unwind: `$${as}`
    }
  ])
  return restaurantCombine
}

const completeRestaurantResponse=async(items)=>{
  const response= await Restaurant.aggregate([
    ...items,
    {
      $lookup: {
        from: "restaurantmenus",
        localField: "_id",
        foreignField: "restaurantId",
        as: "menus",
      },
    },
    { $unwind: "$menus" },
    {
      $lookup: {
        from: "locations",
        localField: "location",
        foreignField: "_id",
        as: "location",
      },
    },
    { $unwind: "$location" },
    {
      $lookup: {
        from: "reviews",
        localField: "_id",
        foreignField: "restaurantId",
        as: "review",
      },
    },
    { $unwind: "$review" },
    {
      $lookup: {
        from: "categories",
        localField: "menus.category",
        foreignField: "_id",
        as: "menus.category",
      },
    },
    {
      $group: {
        _id: "$_id",
        name: { $first: "$name" },
        email: { $first: "$email" },
        phone: { $first: "$phone" },
        logo: { $first: "$logo" },
        description: { $first: "$description" },
        locations: { $first: "$location.street" },
        reviews:{$first:"$review.rating"},
        menus: {
          $push: {
            _id: "$menus._id",
            dish: "$menus.dish",
            price: "$menus.price",
            img: "$menus.img",
            category: { $arrayElemAt: ["$menus.category", 0] },
          },
        },
      },
    },
  ]);
  return response
}
module.exports = {
  restaurantCombineWithChunk,
  completeRestaurantResponse
}