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

// const completeRestaurantResponse = async (items) => {
//   const response = await Restaurant.aggregate([
//     ...items,
//     {
//       $lookup: {
//         from: "restaurantmenus",
//         localField: "_id",
//         foreignField: "restaurantId",
//         as: "menus",
//       },
//     },
//     { $unwind: "$menus" },
//     {
//       $lookup: {
//         from: "locations",
//         localField: "location",
//         foreignField: "_id",
//         as: "location",
//       },
//     },
//     { $unwind: "$location" },
//     {
//       $lookup: {
//         from: "reviews",
//         localField: "_id",
//         foreignField: "restaurantId",
//         as: "review",
//       },
//     },
//     { $unwind: { path: "$review", preserveNullAndEmptyArrays: true } }, // Preserve null reviews
//     {
//       $lookup: {
//         from: "categories",
//         localField: "menus.category",
//         foreignField: "_id",
//         as: "menus.category",
//       },
//     },
//     {
//       $group: {
//         _id: "$_id",
//         name: { $first: "$name" },
//         email: { $first: "$email" },
//         phone: { $first: "$phone" },
//         logo: { $first: "$logo" },
//         description: { $first: "$description" },
//         locations: { $first: "$location.street" },
//         reviews: { $max: { $ifNull: ["$review.rating", 0] } }, // Use $max to consider non-null reviews
//         menus: {
//           $push: {
//             _id: "$menus._id",
//             dish: "$menus.dish",
//             price: "$menus.price",
//             img: "$menus.img",
//             category: { $arrayElemAt: ["$menus.category", 0] },
//           },
//         },
//       },
//     },
//     {
//       $project: {
//         _id: 1,
//         name: 1,
//         email: 1,
//         phone: 1,
//         logo: 1,
//         description: 1,
//         locations: 1,
//         reviews: {
//           $cond: {
//             if: { $eq: ["$reviews", null] },
//             then: 0,
//             else: "$reviews",
//           },
//         },
//         menus: 1,
//       },
//     },
//   ]);
//   return response;
// };
const completeRestaurantResponse = async (items) => {
  const response = await Restaurant.aggregate([
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
        let: { restaurantId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: { $and: [{ $eq: ["$restaurantId", "$$restaurantId"] }, { $gt: ["$rating", 0] }] },
            },
          },
          { $limit: 1 }, // Limit 1 review per restaurant
        ],
        as: "review",
      },
    },
    { $unwind: { path: "$review", preserveNullAndEmptyArrays: true } }, // Preserve null reviews
    {
      $lookup: {
        from: "categories",
        localField: "menus.category",
        foreignField: "_id",
        as: "menus.category",
      },
    },
    {
      $lookup: {
        from: "cusines",
        localField: "menus.cusines",
        foreignField: "_id",
        as: "menus.cusines"
      }
    },
    {
      $lookup: {
        from: "types",
        localField: "menus.type",
        foreignField: "_id",
        as: "menus.type"
      }
    },
    {
      $group: {
        _id: "$_id",
        name: { $first: "$name" },
        businessInfo:{$first:"businessInfo"},
        email: { $first: "$email" },
        phone: { $first: "$phone" },
        logo: { $first: "$logo" },
        description: { $first: "$description" },
        locations: { $first: "$location.street" },
        reviews: { $max: { $ifNull: ["$review.rating", 0] } },
        menus: {
          $push: {
            _id: "$menus._id",
            dish: "$menus.dish",
            price: "$menus.price",
            img: "$menus.img",
            category: { $arrayElemAt: ["$menus.category", 0] },
            cusines: { $arrayElemAt: ["$menus.cusines.name", 0] },
            type: { $arrayElemAt: ["$menus.type.type", 0] }
          },
        },
      },
    },
    {
      $project: {
        _id: 1,
        name: 1,
        businessInfo:1,
        email: 1,
        phone: 1,
        logo: 1,
        description: 1,
        locations: 1,
        reviews: {
          $cond: {
            if: { $eq: ["$reviews", null] },
            then: 0,
            else: "$reviews",
          },
        },
        menus: 1,
      },
    },
  ]);
  return response;
};


const restaurantDetail = async (items) => {
  const response = await Restaurant.aggregate([
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
        from: "reviews",
        let: { restaurantId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: { $and: [{ $eq: ["$restaurantId", "$$restaurantId"] }, { $gt: ["$rating", 0] }] },
            },
          },
          { $limit: 1 }, // Limit 1 review per restaurant
        ],
        as: "review",
      },
    },
    { $unwind: { path: "$review", preserveNullAndEmptyArrays: true } }, // Preserve null reviews
    {
      $lookup: {
        from: "categories",
        localField: "menus.category",
        foreignField: "_id",
        as: "menus.category",
      },
    },
    {
      $lookup: {
        from: "cusines",
        localField: "menus.cusines",
        foreignField: "_id",
        as: "menus.cusines"
      }
    },
    {
      $lookup: {
        from: "types",
        localField: "menus.type",
        foreignField: "_id",
        as: "menus.type"
      }
    },
    {
      $lookup: {
        from: "promotions",
        foreignField: "restaurantId",
        localField: "_id",
        as: "promotion",
      },
    },
    { $unwind: { path: "$promotion", preserveNullAndEmptyArrays: true } }, // Unwind to preserve empty arrays
    {
      $lookup: {
        from: "trymenuitems",
        foreignField: "menuId",
        localField: "menus._id",
        as: "tryMenuItem",
      },
    },
    { $unwind: { path: "$tryMenuItem", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "restaurantmenus",
        foreignField: "_id",
        localField: "tryMenuItem.menuId",
        as:"tryMenuItem.menu"
      }
    },
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
      $group: {
        _id: "$_id",
        name: { $first: "$name" },
        businessInfo:{$first:"$businessInfo"},
        email: { $first: "$email" },
        phone: { $first: "$phone" },
        logo: { $first: "$logo" },
        description: { $first: "$description" },
        locations: { $first: "$location.street" },
        reviews: { $max: { $ifNull: ["$review.rating", 0] } },
        menus: {
          $push: {
            _id: "$menus._id",
            dish: "$menus.dish",
            price: "$menus.price",
            img: "$menus.img",
            category: { $arrayElemAt: ["$menus.category", 0] },
            cusines: { $arrayElemAt: ["$menus.cusines.name", 0] },
            type: { $arrayElemAt: ["$menus.type.type", 0] }
          },
        },
        promotion: {
          $addToSet: {
            "promotionId": "$promotion._id",
            "expireDate": "$promotion.expireDate",
            "discount": "$promotion.discount",
            "menuId": "$promotion.menuId",
            "openingAt": "$promotion.openingAt"
          }
        }
        ,
        tryMenuItem: {
          $addToSet: {
            "menuId": "$tryMenuItem.menuId",
            "tryThisProductId": "$tryMenuItem._id"
          }
        }
      }
    },


    {
      $project: {
        _id: 1,
        name: 1,
        businessInfo:1,
        email: 1,
        phone: 1,
        logo: 1,
        description: 1,
        locations: 1,
        reviews: {
          $cond: {
            if: { $eq: ["$reviews", null] },
            then: 0,
            else: "$reviews",
          },
        },
        menus: 1,
        promotion: {
          $filter: {
            input: '$promotion',
            as: 'promotion',
            cond: { $ne: ['$$promotion', {}] }
          }
        },
        tryMenuItem: {
          $filter: {
            input: '$tryMenuItem',
            as: 'tryMenu',
            cond: { $ne: ['$$tryMenu', {}] }
          }
        }
      },
    },
  ]);
  return response;
};

const isExist = async (model, criteria) => {
  try {
    console.log(criteria, '--', model)
    const document = await model.findOne(criteria); // Search based on criteria
    return !!document; // Returns true if document exists, false if not
  } catch (error) {
    // Handle error if findOne() encounters an issue (e.g., database error)
    console.error('Error:', error);
    return false; // Return false in case of an error
  }
}

module.exports = {
  restaurantCombineWithChunk,
  completeRestaurantResponse,
  isExist,
  restaurantDetail
}