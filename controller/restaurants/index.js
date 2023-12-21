const Restaurant = require("../../models/restaurant");
const restaurantMenu = require("../../models/restaurant_menu");
const globalController = require("../../controller/globalController");
const helper = require("../../models/helperModels");
const mongoose = require("mongoose");
const globalFunctions = require("../../utils/globalFunctions");
const ObjectId = mongoose.Types.ObjectId;
const addRestaurants = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      name,
      email,
      phone,
      location,
      logo,
      menus,
      description,
      bannerImg,
      businessInfo,
    } = req.body;

    const checkRestaurant = await globalController.checkRecordExist(
      helper.location,
      "_id",
      location
    );
    // if (!checkRestaurant) {
    //   return res.status(401).send({ message: "Location Not Exist Exist" });
    // }
    const restaurant = new Restaurant({
      name,
      email,
      phone,
      logo,
      location,
      description,
      bannerImg,
      businessInfo,
    });
    const savedRestaurant = await restaurant.save({ session });

    const menuData = menus.map((val) => ({
      restaurantId: savedRestaurant._id,
      ...val,
    }));
    console.log("menu====", menuData);
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
    const restaurantsWithMenus =
      await globalFunctions.completeRestaurantResponse([]);

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
    const restaurant = await globalFunctions.restaurantDetail([
      {
        $match: { _id: new ObjectId(id) },
      },
    ]);
    res.send(restaurant);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const searchRestaurant = async (req, res) => {
  try {
    const queryKey = req.query;
    console.log(queryKey);
    let restaurantsCombine = await globalFunctions.completeRestaurantResponse(
      []
    );
    let searchResult;
    if (queryKey.location) {
      searchResult = restaurantsCombine.filter(
        (val) => val.locations === queryKey.location
      );
    } else if (queryKey.dish) {
      searchResult = [];
      restaurantsCombine.forEach((val) => {
        const filterMenu = val.menus.filter(
          (menu) => menu.dish === queryKey.dish
        );
        if (filterMenu.length) {
          searchResult.push({ ...val, menus: filterMenu });
        }
      });
      // console.log(searchResult)
    } else if (queryKey.cusines) {
      searchResult = [];
      restaurantsCombine.forEach((val) => {
        const filterMenu = val.menus.filter(
          (menu) => menu.cusines === queryKey.cusines
        );
        if (filterMenu.length) {
          searchResult.push({ ...val, menus: filterMenu });
        }
      });
    } else {
      return res.status(401).send("search with dish or location");
    }
    return res.status(200).send(searchResult);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const searchRestaurantByName = async (req, res) => {
  try {
    const name = req.query.name;
    let restaurantsCombine = await globalFunctions.completeRestaurantResponse(
      []
    );
    let searchResult = restaurantsCombine.filter((val) => val.name === name);
    return res.status(200).send(searchResult);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const filterRestaurant = async (req, res) => {
  try {
    const keyCollection = req.query;
    let restaurants = await globalFunctions.completeRestaurantResponse([]);

    if (keyCollection.for === "restaurant") {
      for (const key in keyCollection) {
        console.log(key);
        const value = keyCollection[key];
        if (key === "location") {
          restaurants = restaurants.filter((val) => val.locations === value);
        } else if (key === "category") {
          const categoryList = value.split(",");
          restaurants = restaurants.filter((restaurant) =>
            restaurant.menus.some((menu) => {
              return categoryList.includes(menu.category.name);
            })
          );
        } else if (key === "price") {
          const priceList = value.split(",");
          console.log("price", priceList);
          restaurants = restaurants.filter((restaurant) =>
            restaurant.menus.some((menu) =>
              priceList.some((price) => menu.price <= Number(price))
            )
          );
        } else if (key === "rating") {
          const ratingList = value.split(",");
          console.log("rating", ratingList);
          restaurants = restaurants.filter((restaurant) =>
            ratingList.some((rating) => restaurant.reviews >= Number(rating))
          );
          console.log(restaurants);
        }
      }
    } else {
      for (const key in keyCollection) {
        console.log("key=====>", key);
        const value = keyCollection[key];
        if (key === "location") {
          restaurants = restaurants.filter((val) => val.locations === value);
        } else if (key === "category") {
          const categoryList = value.split(",");
          restaurants = restaurants
            .map((restaurant) => ({
              ...restaurant,
              menus: restaurant.menus.filter((menu) =>
                categoryList.includes(menu.category.name)
              ),
            }))
            .filter((val) => val.menus.length);
        } else if (key === "price") {
          const priceList = value.split(",");
          restaurants = restaurants
            .map((restaurant) => ({
              ...restaurant,
              menus: restaurant.menus.filter((menu) =>
                priceList.some((price) => menu.price <= Number(price))
              ),
            }))
            .filter((val) => val.menus.length);
        }
      }
    }

    res.status(200).send(restaurants);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getRestaurantAggreParactice = async (req, res) => {
  try {
    // const restaurant = await Restaurant.aggregate([
    //   {
    //     $lookup: {
    //       from: "restaurantmenus",
    //       foreignField: "restaurantId",
    //       localField: "_id",
    //       as: "menus"
    //     },
    //   },
    //   { $unwind: "$menus" },
    //   {
    //     $project: {
    //       menus: 1,

    //       menusFilter:
    //       {
    //         $filter: {
    //           input: [{
    //             "_id": "65803bbd39f30c4980d557b1",
    //             "price": 100,
    //             "dish": "Chiken Pizza",
    //             "img": "https://res.cloudinary.com/dtiffjbxv/image/upload/v1/stickimages/stick-products/front-view-delicious-cheese-pizza-consists-olives-pepper-tomatoes-dark-surface_el8idh",
    //             "restaurantId": "65803bbd39f30c4980d557af",
    //             "category": "6570e3bb8b5d7bbe8c0ab5a1",
    //             "cusines": "6579a674f564d940095a5f12",
    //             "type": "657b1d95fdf13127ba59988e",
    //             "createdAt": "2023-12-18T12:31:57.282Z",
    //             "__v": 0
    //           },
    //           {
    //             "_id": "65803bbd39f30c4980d557b1",
    //             "price": 430,
    //             "dish": "Chiken Pizza",
    //             "img": "https://res.cloudinary.com/dtiffjbxv/image/upload/v1/stickimages/stick-products/front-view-delicious-cheese-pizza-consists-olives-pepper-tomatoes-dark-surface_el8idh",
    //             "restaurantId": "65803bbd39f30c4980d557af",
    //             "category": "6570e3bb8b5d7bbe8c0ab5a1",
    //             "cusines": "6579a674f564d940095a5f12",
    //             "type": "657b1d95fdf13127ba59988e",
    //             "createdAt": "2023-12-18T12:31:57.282Z",
    //             "__v": 0
    //           }],
    //           cond: { $gte: ["$$this.price", 10] },
    //           // cond:{$and:[{ $gte: ["$$this.price", 10] }]}
    //         }
    //       }


    //     }
    //     ,

    //   },
    //   {
    //     // $project: {
    //     //   input: "$menusFilter",
    //     //   cond: {
    //     //     $if: { $eq: [{ "$size": "$menusFilter" }, 0] },
    //     //     $then: {
    //     //       $map: {
    //     //         input: '$menuFilter',
    //     //         as:"item",
    //     //         in:{
    //     //           $add:["$$item.price",200]
    //     //         }
    //     //       }
    //     //     },
    //     //     $else: {}
    //     //   }
    //     // }
    //     $project: {
    //       menusFilter: {
    //         $map: {
    //           input: '$menusFilter',
    //           as: "item",
    //           in: {
    //             $mergeObjects: ["$$item", { price: { $add: ["$$item.price", 200], } }, { "sum": { $sum: 1 } },

    //               {
    //                 dish: {
    //                   $cond: {
    //                     if: { $eq: [{ $arrayElemAt: ["$menusFilter.dish", 0] }, "biryani"] },
    //                     then: { $arrayElemAt: ["$menusFilter.dish", 0] },
    //                     else: "Tikka"
    //                   }
    //                 },
    //               }
    //             ]

    //           }
    //         }
    //       },

    //       totalPrice: {
    //         $reduce: {
    //           input: "$menusFilter",
    //           initialValue: 0,
    //           in: {
    //             $add: ["$$value", "$$this.price"]
    //           }


    //         }

    //       }
    //     }
    //   }


    // ]);


    const query = { $text: { $search: "restaurant" } };
    // Return only the `title` of each matched document
    const projection = {
      _id: 0,
      name: 1,
      description: 1
    };
    // Find documents based on our query and projection
    // const findRestaurant =await Restaurant.find(query).select(projection);
    // const searchKeyword = "horizon"
    //   ? {

    //     email:{
    //       $regex:"absdc3",
    //       $options:'i'
    //     }
    //   }
    //   : {};
    // const findRestaurant = await Restaurant.find({ ...searchKeyword });
    // res.status(200).send(findRestaurant)
    const restaurant = await Restaurant.aggregate([
      {
        $match: {
          name: {
            $eq: 'Horizon'
          }
        }
      },
      {
        $count: "name"
      }

      // {
      //   $lookup: {
      //     from: "restaurantmenus",
      //     localField: "_id",
      //     foreignField: "restaurantId",
      //     as: "menus"
      //   },

      // },
      // { $unwind: "$menus" },
      // {
      //   $lookup: {
      //     from: "categories",
      //     foreignField: "_id",
      //     localField: "menus.category",
      //     as: "menus.category",

      //   }
      // },
      // {
      //   $group: {
      //     _id: "$_id",
      //     menus: {
      //       $addToSet: {
      //         "_id": "$menus._id",
      //         "dish": "$menus.dish"
      //       }
      //     },
      //     count:{$sum:1}

      //   }
      // },
      // {
      //   $project: {
      //     _id: 1,
      //     name: 1,
      //     menus: 1,
      //   // count:1
      //   },
      // },


    ])
    res.status(200).send(restaurant)
  } catch (err) {
    console.log(err);
    res.status(400).send(err.message)
  }
};
const updateRestaurant = async (req, res) => {
  try {
    const restaurantId = req.query.restaurantId;
    const menuId = req.query.menuId
    const { restaurantAttributes, menuAttributes } = req.body;
    let updateResult;
    if (restaurantId && restaurantAttributes) {
      updateResult = await Restaurant.findByIdAndUpdate(restaurantId, restaurantAttributes, { new: true });
    }

    if (menuId && menuAttributes) {
      const temp = await restaurantMenu
        .findByIdAndUpdate(menuId, menuAttributes, { new: true })
        .populate("category")
        .populate({ path: "cusines", select: "name -_id" })
        .populate({ path: "type", select: "type -_id" });

      updateResult = { ...updateResult?._doc, menus: { ...temp._doc, cusines: temp._doc.cusines.name, type: temp._doc.type.type } }

    }
    res.status(200).send(updateResult)
  } catch (err) {
    res.status(400).send(err.message)
  }
}
const deleteRestaurant = async (req, res) => {
  try {
    const restaurantId = req.query.restaurantId;
    const menuId = req.query.menuId;
    if (restaurantId) {
      await Restaurant.findByIdAndDelete(restaurantId);
    }
    if (menuId) {
      const menuDeleted = await restaurantMenu.findByIdAndDelete(menuId);
      console.log(menuDeleted)
    }
    res.status(200).send("Deleted Successfully")
  } catch (err) {
    res.status(200).send(err)
  }

}
module.exports = {
  deleteRestaurant,
  updateRestaurant,
  getRestaurantAggreParactice,
  addRestaurants,
  getRestaurants,
  getRestaurantAllId,
  getRestaurantById,
  searchRestaurant,
  searchRestaurantByName,
  filterRestaurant,
};
