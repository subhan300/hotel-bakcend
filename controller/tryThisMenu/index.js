const TryMenuItem = require("../../models/tryThisMenu");
const { isExist } = require("../../utils/globalFunctions");
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const addTryMenuItems = async (req, res) => {
    try {
        const { menuId } = req.body;
        const id = new ObjectId(menuId)
        const isExistItem = await TryMenuItem.findOne({ menuId: new ObjectId(menuId) }); // Search based on criteria
        console.log(isExistItem)
        if (!!isExistItem) {
            return res.status(401).send("Already Exist")
        }
        console.log(isExistItem)

        const createTryMenuItem = new TryMenuItem({ menuId })

        const saveResult = await createTryMenuItem.save()
        res.status(200).send(saveResult)

    } catch (err) {
        console.log(err)
        res.status(401).send(err)
    }
}

const getTryMenuItems = async (req, res) => {
    try {
        // const getReviews = await TryMenuItem.find({}).populate("menuId")
        const getReviews = await TryMenuItem.aggregate([{
            $lookup: {
                from: "restaurantmenus",
                localField: "menuId",
                foreignField: "_id",
                as: "menus"
            },
        },
        { $unwind: "$menus" },
        {
            $lookup: {
                from: "menulikeitems",
                localField: "menuId",
                foreignField: "menuId",
                as: "trueLikesCount"
            }
        },
        {
            $group:
            {
                _id: "$menuId",
                menuLikeItems: { $first: '$trueLikesCount.userLike' },
                allUsersLikes: { $first: '$trueLikesCount' },
                menus:{$first:'$menus'},
                menuId:{$first:"$menus._id"},
                menuInfo:{$first:"$menus.menuInfo"},
                price:{$first:"$menus.price"},
                dish:{$first:"$menus.dish"},
                img:{$first:"$menus.img"},
                restaurantId:{$first:"$menus.restaurantId"},
                category:{$first:"$menus.category"},
            }
        },
        {
            $project: {
                _id: 0,
                menuId: 1,
                restaurantId:1,
                dish: 1,
                price:1,
                img:1,
                menuInfo:1,
                category:1,

                // trueLikesCount:1
                trueLikesCount: {
                    $reduce: {
                      input: "$menuLikeItems",
                      initialValue: 0,
                      in: {
                        $cond: {
                          if: { $eq: ["$$this", true] },
                          then: { $add: ["$$value", 1] },
                          else: "$$value"
                        }
                      }
                    }
                  },
                  allUsersLikes: 1
            }
        }

        ])
        res.status(200).send(getReviews)
    } catch (err) {
        res.status(401).send(err)
    }
}


module.exports = {
    getTryMenuItems,
    addTryMenuItems
}