const menus=require("../../models/restaurant_menu")
const addMenus = async (req, res) => {
    try {
    //   const { employeeEmail, employeePassword } = req.body;
      console.log(req.body);
  
      const result = new menus(req.body);
      const data = await result.save();
      res.status(200).send(data);
      if (!result) {
        return res.status(401).send({
          message: 'Invalid email or password',
        });
      }
      res.status(200).send({result})
    
    } catch (error) {
      console.error(error);
      res.status(500).send('Something went wrong');
    }
  };


module.exports={
    addMenus
}