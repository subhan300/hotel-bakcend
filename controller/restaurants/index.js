const Restaurant = require("../../models/restaurant");
const restaurantMenu = require("../../models/restaurant_menu");
const globalController = require("../../controller/globalController");
const helper = require("../../models/helperModels");
const mongoose = require("mongoose");
const globalFunctions = require("../../utils/globalFunctions")
const ObjectId = mongoose.Types.ObjectId;
const addRestaurants = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { name, email, phone, location, logo, menus, description } = req.body;

    const checkRestaurant = await globalController.checkRecordExist(
      helper.location,
      "_id",
      location
    );
    if (!checkRestaurant) {
      return res.status(401).send({ message: "Location Not Exist Exist" });
    }
    const restaurant = new Restaurant({
      name,
      email,
      phone,
      logo,
      location,
      description,
    });
    const savedRestaurant = await restaurant.save({ session });

    const menuData = menus.map((val) => ({
      restaurantId: savedRestaurant._id,
      ...val,
    }));
    const menuCollection = await restaurantMenu.insertMany(menuData, {
      session,
    });

    // Commit the transaction if both operations succeed
    await session.commitTransaction();
    session.endSession();

    res.status(200).send("Created successfully");
  } catch (err) {
    // Rollback the transaction if an error occurs
    await session.abortTransaction();
    session.endSession();

    console.error(err);
    res.status(500).send({ message: err.message });
  }
};

// const getRestaurants = async (req, res) => {
//   try {
//     const restaurantsWithMenus = await Restaurant.aggregate([
//       {
//         $lookup: {
//           from: 'restaurantmenus',
//           localField: '_id',
//           foreignField: 'restaurantId',
//           as: 'menus'
//         }
//       },
//       {
//         $lookup: {
//           from: 'categories',
//           localField: 'menus.category',
//           foreignField: '_id',
//           as: 'menus.category',
//         }
//       }
//       ,
//       { $unwind: '$menus' },
//       // { $unwind: '$category' },
//       {
//         $lookup: {
//           from: 'locations',
//           localField: 'location',
//           foreignField: '_id',
//           as: 'location'
//         },
//       },
//       { $unwind: '$location' },

//       // {
//       //   $project: {
//       //     _id: 1,
//       //     name: 1,
//       //     menus: {
//       //       $map: {
//       //         input: '$menus',
//       //         as: 'menu',
//       //         in: {
//       //           menuInfo: '$$menu.menuInfo',
//       //           category: { $arrayElemAt: ['$$menu.category.name', 0] },
//       //           dishes: '$$menu.dishes',
//       //         },
//       //       },
//       //     },
//       //     location: {
//       //       street: '$location.street',
//       //     },
//       //   },
//       // }
//     ]);
//     console.log("==", restaurantsWithMenus)
//     res.json(restaurantsWithMenus);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// }
const getRestaurants = async (req, res) => {
  try {
    const restaurantsWithMenus = await globalFunctions.completeRestaurantResponse([])

    res.json(restaurantsWithMenus);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getRestaurantAllId = async (req, res) => {
  try {
    const allIdCollection = await Restaurant.find({}, "_id name");
    res.json(allIdCollection);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getRestaurantById = async (req, res) => {
  try {
    const id = req.query.id;
    const restaurant = await globalFunctions.completeRestaurantResponse([{
      $match: { _id: new ObjectId(id) },
    }])
    console.log("==", restaurant);
    res.send(restaurant);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const searchRestaurant = async (req, res) => {
  try {
    const queryKey = req.query;
    let restaurantsCombine = await globalFunctions.completeRestaurantResponse([]);
    let searchResult;
    if (queryKey.location) {
      searchResult = restaurantsCombine.filter(val => val.locations === queryKey.location)
    } else if (queryKey.dish) {
      searchResult = restaurantsCombine.filter(val => val.menus.some(menu => menu.dish === queryKey.dish))
    } else {
      return res.status(401).send('search with dish or location');
    }
    return res.status(200).send(searchResult);


  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const filterRestaurant = async (req, res) => {
  try {
    const queryKeys = req.query;
    // const queryKeys=[location, category, price, rating, dish ]
    console.log(queryKeys)

    // console.log("id==", location, category, price, rating, dish);
    // const restaurantsCombineWithLocation=await globalFunctions.restaurantCombineWithChunk('locations','location','_id','location')
    // const restaurantsCombineWithMenu=await globalFunctions.restaurantCombineWithChunk('restaurantmenus','_id','restaurantId','menus')
    // const filterByCategory=await restaurantsCombineWithMenu.filter(val=>val.menus.dish===dish);

    // const filterByLocation=restaurantsCombineWithLocation.filter(val=>val.location.street===location)
    res.send('filterByCategory');
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  addRestaurants,
  getRestaurants,
  getRestaurantAllId,
  getRestaurantById,
  searchRestaurant,
};
