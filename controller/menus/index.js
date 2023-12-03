const menus=require("../../models/restaurant_menu")
const { Types } = require('mongoose');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const addMenus = async (req, res) => {
    try {
      const  menuItems  = req.body;
      const menuCollection= await menus.insertMany(menuItems)
      res.status(200).send(menuCollection);
    
    } catch (error) {
      res.status(500).send(`Something went wrong ${error}`);
    }
  };
  const getMenuAllId=async(req,res)=>{
    try {
      const allIdCollection = await menus.find({},'_id dish ');
      console.log("==",allIdCollection)
      res.json(allIdCollection);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
  const getMenuByRestaurantId=async(req,res)=>{

    try {
      const restaurantId=req.query.id
      if (!Types.ObjectId.isValid(restaurantId)) {
        return res.status(400).json({ message: 'Invalid restaurantId' });
      }
      const menuCollection = await menus.find({restaurantId:new ObjectId(restaurantId)})
      res.send(menuCollection);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

module.exports={
    addMenus,
    getMenuAllId,
    getMenuByRestaurantId
}