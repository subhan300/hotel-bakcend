const Restaurant = require("../../models/restaurant")
const restaurantMenu = require("../../models/restaurant_menu")
const globalController = require("../../controller/globalController")
const mongoose = require("mongoose")
// const addRestaurants = async (req, res) => {

//   try {
//     const { name, email, phone, location, logo, menus } = req.body;
//     const checkRestaurant=await globalController.checkExistingRecordByAttribute(name)
//     if (checkRestaurant) {
//       return res.status(401).send({ message: "Restaurant  Name Already Exist" })
//     }
//     const result = new Restaurant({
//       name, email, phone, logo, location
//     });
//     const data = await result.save();
//     console.log("data", data)
//     const menuData = menus.map(val => ({
//       restaurantId: data._id, ...val
//     }))
//     console.log("menus", menuData)
//     const menuCollection = await restaurantMenu.insertMany(menuData)
//     console.log("menus", menuCollection)
//     // const temp = { ...data, ...menuCollection }
//     res.status(200).send("created successfully");
//   } catch (err) {
//     console.log("err", err)
//     res.status(401).send({
//       message: err
//     });
//   }
// }
const addRestaurants = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { name, email, phone, location, logo, menus } = req.body;
    const checkRestaurant = await globalController.checkExistingRecordByAttribute(name)
    if (checkRestaurant) {
      return res.status(401).send({ message: "Restaurant  Name Already Exist" })
    }
    const restaurant = new Restaurant({ name, email, phone, logo, location });
    const savedRestaurant = await restaurant.save({ session });

    const menuData = menus.map(val => ({ restaurantId: savedRestaurant._id, ...val }));
    const menuCollection = await restaurantMenu.insertMany(menuData, { session });

    // Commit the transaction if both operations succeed
    await session.commitTransaction();
    session.endSession();

    res.status(200).send('Created successfully');
  } catch (err) {
    // Rollback the transaction if an error occurs
    await session.abortTransaction();
    session.endSession();

    console.error(err);
    res.status(500).send({ message: err });
  }
};


const getRestaurants = async (req, res) => {
  try {
    const restaurantsWithMenus = await Restaurant.aggregate([
      {
        $lookup: {
          from: 'restaurantmenus',
          localField: '_id',
          foreignField: 'restaurantId',
          as: 'menus'
        }
      }
    ]);
    console.log("==", restaurantsWithMenus)
    res.json(restaurantsWithMenus);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

const getRestaurantAllId = async (req, res) => {
  try {
    const allIdCollection = await Restaurant.find({}, '_id name');
    console.log("==", allIdCollection)
    res.json(allIdCollection);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = {
  addRestaurants,
  getRestaurants,
  getRestaurantAllId
}