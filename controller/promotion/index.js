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

        res.status(200).send(promotionInfo);

    } catch (error) {
        res.status(500).send(`Something went wrong ${error}`);
    }
}


// const getPromotion = async (req, res) => {

//     try {
//         const userId = req.query.userId
//         console.log('userid=', userId)
//         const pipeline = [
//             {
//                 $lookup: {
//                     from: 'restaurantmenus',
//                     localField: 'menuId',
//                     foreignField: '_id',
//                     as: 'menu',
//                 },
//             },
//             {
//                 $unwind: '$menu',
//             },
//             {
//                 $lookup: {
//                     from: 'restaurants',
//                     localField: 'restaurantId',
//                     foreignField: '_id',
//                     as: 'restaurant',
//                 },
//             },
//             {
//                 $unwind: '$restaurant',
//             },
//             {
//                 $lookup: {
//                     from: 'menulikeitems',
//                     localField: 'menuId',
//                     foreignField: 'menuId',
//                     as: 'menuLikeItems',
//                 },
//             },

//             {
//                 $group: {
//                     _id: '$menuId',
//                     restaurant: { $first: '$restaurant.name' },
//                     restaurantId: { $first: '$restaurant._id' },
//                     menu: { $first: '$menu.dish' },
//                     menuId: { $first: '$menu._id' },
//                     img: { $first: '$menu.img' },
//                     price: { $first: '$menu.price' },
//                     discount: { $first: '$discount' },
//                     openingAt: { $first: '$openingAt' },
//                     expireDate: { $first: '$expireDate' },
//                     menuLikeItems: { $first: '$menuLikeItems.userLike' },
//                     allUsersLikes: { $first: '$menuLikeItems' }
//                 },
//             },
//             {
//                 $project: {
//                     _id: 0,
//                     restaurant: 1,
//                     restaurantId: 1,
//                     menu: 1,
//                     menuId: 1,
//                     img: 1,
//                     price: 1,
//                     discount: 1,
//                     openingAt: 1,
//                     expireDate: 1,
//                     trueLikesCount: {
//                         $reduce: {
//                             input: "$menuLikeItems",
//                             initialValue: 0,
//                             in: {
//                                 $cond: {
//                                     if: { $eq: ["$$this", true] },
//                                     then: { $add: ["$$value", 1] },
//                                     else: "$$value"
//                                 }
//                             }
//                         }
//                     },
//                     allUsersLikes: 1,
//                     personalLike: {
//                         $filter: {
//                             input: '$menuLikeItems',
//                             as: 'like',
//                             cond: { $eq: ['$$like.userId', new mongoose.Types.ObjectId(userId)] }
//                         }
//                     }

//                 },
//             },
            
//         ];

//         const resi = await promotion.aggregate(pipeline);
//         res.status(200).send(resi);
//     } catch (error) {
//         res.status(500).send(`Something went wrong ${error}`);
//     }
// };


const getPromotion = async (req, res) => {
    try {
        const userId = req.query.userId;
        console.log('userid=', userId);

        const pipeline = [
            {
                $lookup: {
                    from: 'restaurantmenus',
                    localField: 'menuId',
                    foreignField: '_id',
                    as: 'menu',
                },
            },
            {
                $unwind: '$menu',
            },
            {
                $lookup: {
                    from: 'restaurants',
                    localField: 'restaurantId',
                    foreignField: '_id',
                    as: 'restaurant',
                },
            },
            {
                $unwind: '$restaurant',
            },
            {
                $lookup: {
                    from: 'menulikeitems',
                    localField: 'menuId',
                    foreignField: 'menuId',
                    as: 'menuLikeItems',
                },
            },
            {
                $project: {
                    _id: 0,
                    restaurant: '$restaurant.name',
                    restaurantId: '$restaurant._id',
                    menu: '$menu.dish',
                    menuId: '$menu._id',
                    img: '$menu.img',
                    price: '$menu.price',
                    discount: 1,
                    openingAt: 1,
                    expireDate: 1,
                    trueLikesCount: {
                        $reduce: {
                            input: '$menuLikeItems',
                            initialValue: 0,
                            in: {
                                $cond: {
                                    if: { $eq: ['$$this.userLike', true] },
                                    then: { $add: ['$$value', 1] },
                                    else: '$$value'
                                }
                            }
                        }
                    },
                    personalLike: {
                        $filter: {
                            input: '$menuLikeItems',
                            as: 'like',
                            cond: { $eq: ['$$like.userId',new mongoose.Types.ObjectId(userId)] }
                        }
                    }
                },
            },
            {
                $addFields: {
                    personalLike: {
                        $arrayElemAt: ['$personalLike', 0]
                    }
                }
            },
        ];

        const resi = await promotion.aggregate(pipeline);
        res.status(200).send(resi);
    } catch (error) {
        res.status(500).send(`Something went wrong ${error}`);
    }
};




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