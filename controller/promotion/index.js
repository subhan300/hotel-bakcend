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
//         const result = await promotion.find({}).populate({ path: "restaurantId", select: "name" }).populate({ path: "menuId", select: "dish price img" });
//     //   always check from : mongoose collection name 
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
//                     as: 'menuLikeItem',
//                 },
//             },
//             {
//                 $unwind: '$menuLikeItem',
//             },
//             {
//                 $group:{
//                     _id: '$menuId',
//                     restaurant: {$first:"restaurant.name"},
//                     menu: {$first:'menu.dish'},
//                     img:{$first:'menu.img'},
                   
//                     // menuLikeItem: '$menuLikeItem.userLike',
//                     discount: {$first:'discount'},
//                     openingAt: {$first:'openingAt'},
//                     expireDate:{$first:'expireDate'},
//                 }
//                 // $project: {
//                 //     _id: 0,
//                 //     restaurant: '$restaurant.name',
//                 //     menu: '$menu.dish',
//                 //     img:'$menu.img',
//                 //     price: '$menu.price',
//                 //     // menuLikeItem: '$menuLikeItem.userLike',
//                 //     discount: 1,
//                 //     openingAt: 1,
//                 //     expireDate:1
//                 // },
//             },
//         ];



  
//         const resi = await promotion.aggregate(pipeline)
//         console.log("res===", resi)

//         // const filterRestaurants = result.filter(res => res.restaurantId && res.menuId)
//         // res.status(200).send(result);
//         res.status(200).send(resi);

//     } catch (error) {
//         res.status(500).send(`Something went wrong ${error}`);
//     }
// }
const getPromotion = async (req, res) => {
    try {
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
                $group: {
                    _id: '$menuId',
                    restaurant: { $first: '$restaurant.name' },
                    menu: { $first: '$menu.dish' },
                    img: { $first: '$menu.img' },
                    price: { $first: '$menu.price' },
                    discount: { $first: '$discount' },
                    openingAt: { $first: '$openingAt' },
                    expireDate: { $first: '$expireDate' },
                    menuLikeItems: { $first: '$menuLikeItems.userLike' },
                },
            },
            {
                $project: {
                    _id: 0,
                    restaurant: 1,
                    menu: 1,
                    img: 1,
                    price: 1,
                    discount: 1,
                    openingAt: 1,
                    expireDate: 1,
                    menuLikeItems:1,
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
                      }
                    
                },
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