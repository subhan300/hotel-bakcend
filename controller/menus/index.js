const menus=require("../../models/restaurant_menu")
const addMenus = async (req, res) => {
    try {
    //   const { employeeEmail, employeePassword } = req.body;
      console.log(req.body);
  
      const result = new menus(req.body);
      const data = await result.save();
      res.status(200).send(data);
    
    } catch (error) {
      res.status(500).send(`Something went wrong ${error}`);
    }
  };


module.exports={
    addMenus
}