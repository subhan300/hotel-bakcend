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
    const { name, email, phone, location, logo, menus, description, bannerImg, businessInfo } = req.body;

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
      bannerImg,
      businessInfo
    });
    const savedRestaurant = await restaurant.save({ session });

    const menuData = menus.map((val) => ({
      restaurantId: savedRestaurant._id,
      ...val,
    }));
    console.log("menu====", menuData)
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
    const restaurant = await globalFunctions.restaurantDetail([{
      $match: { _id: new ObjectId(id) },
    }])
    res.send(restaurant);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const searchRestaurant = async (req, res) => {
  try {
    const queryKey = req.query;
    console.log(queryKey)
    let restaurantsCombine = await globalFunctions.completeRestaurantResponse([]);
    let searchResult;
    if (queryKey.location) {
      searchResult = restaurantsCombine.filter(val => val.locations === queryKey.location)
    } else if (queryKey.dish) {
      searchResult = []
      restaurantsCombine.forEach(val => {
        const filterMenu = val.menus.filter(menu => menu.dish === queryKey.dish)
        if (filterMenu.length) {
          searchResult.push({ ...val, menus: filterMenu })
        }

      }
      )
      // console.log(searchResult)
    } else if (queryKey.cusines) {
      searchResult = []
      restaurantsCombine.forEach(val => {
        const filterMenu = val.menus.filter(menu => menu.cusines === queryKey.cusines)
        if (filterMenu.length) {
          searchResult.push({ ...val, menus: filterMenu })
        }

      }
      )
    } else {
      return res.status(401).send('search with dish or location');
    }
    return res.status(200).send(searchResult);


  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const searchRestaurantByName = async (req, res) => {
  try {
    const name = req.query.name;
    let restaurantsCombine = await globalFunctions.completeRestaurantResponse([]);
    let searchResult = restaurantsCombine.filter(val => val.name === name)
    return res.status(200).send(searchResult);


  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const filterRestaurant = async (req, res) => {
  try {
    const keyCollection = req.query
    let restaurants = await globalFunctions.completeRestaurantResponse([]);

    if (keyCollection.for === "restaurant") {
      for (const key in keyCollection) {

        console.log(key)
        const value = keyCollection[key];
        if (key === "location") {
          restaurants = restaurants.filter(val => val.locations === value)
        } else if (key === "category") {
          const categoryList = value.split(',')
          restaurants = restaurants.filter(restaurant => restaurant.menus.some(menu => {
            return categoryList.includes(menu.category.name)
          }))
        } else if (key === "price") {
          const priceList = value.split(',')
          console.log('price', priceList)
          restaurants = restaurants.filter(restaurant => restaurant.menus.some(menu => priceList.some(price => menu.price <= Number(price))))
        } else if (key === "rating") {
          const ratingList = value.split(',')
          console.log('rating', ratingList)
          restaurants = restaurants.filter(restaurant => ratingList.some(rating => restaurant.reviews >= Number(rating)))
          console.log(restaurants)
        }

      }
    } else {
      for (const key in keyCollection) {
        console.log('key=====>', key)
        const value = keyCollection[key];
        if (key === "location") {
          restaurants = restaurants.filter(val => val.locations === value)
        } else if (key === "category") {
          const categoryList = value.split(',')
          restaurants = restaurants.map(restaurant => ({
            ...restaurant,
            menus: restaurant.menus.filter(menu => categoryList.includes(menu.category.name))
          })).filter(val=>val.menus.length);
        } else if (key === "price") {
          const priceList = value.split(',')
          restaurants = restaurants.map(restaurant => ({ ...restaurant, menus: restaurant.menus.filter(menu => priceList.some(price => menu.price <= Number(price))) })).filter(val=>val.menus.length)
        }
      }
    }

    res.status(200).send(restaurants);
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
  searchRestaurantByName,
  filterRestaurant
};
