const menus=require("../../models/restaurant_menu")
const addMenus = async (req, res) => {
    try {
      const  menuItems  = req.body;
      const menuCollection= await menus.insertMany(menuItems)
      res.status(200).send(menuCollection);
    
    } catch (error) {
      res.status(500).send(`Something went wrong ${error}`);
    }
  };


module.exports={
    addMenus
}