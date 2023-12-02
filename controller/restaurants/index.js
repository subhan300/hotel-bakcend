const Restaurant=require("../../models/restaurant")

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

const getRestaurants=async(req,res)=>{

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


module.exports= {
    addRestaurants,
    getRestaurants
}