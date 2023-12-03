const Restaurant=require("../../models/restaurant")
const restaurantMenu=require("../../models/restaurant_menu")
const addRestaurants=async(req,res)=>{

  try{
    // const {name,email,phone,logo,location}=req.body
    const result = new Restaurant({
       ...req.body
      });
      const data = await result.save();
      res.status(200).send(data);
  }catch(err){
    console.log("err",err)
    res.status(401).send({
        message: 'issue while creating restaurant',
        err
      });
  }
}

const getRestaurants=async (req, res) => {
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
    console.log("==",restaurantsWithMenus)
    res.json(restaurantsWithMenus);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

const getRestaurantAllId=async(req,res)=>{
  try {
    const allIdCollection = await Restaurant.find({},'_id');
    console.log("==",allIdCollection)
    res.json(allIdCollection);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports= {
    addRestaurants,
    getRestaurants,
    getRestaurantAllId
}