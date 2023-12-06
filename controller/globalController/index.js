const Restaurant = require("../../models/restaurant")
const helperModel=require("../../models/helperModels")
const checkExistingRecordByAttribute = async (name) => {
    try {
        const existingRestaurant = await Restaurant.findOne({ name: name });

        if (existingRestaurant) {
            // Restaurant with the same name exists
            return true
        }

        // Restaurant with the given name doesn't exist
        return false;
    } catch (error) {
        console.log(err)
    }
};

const addCategory=async(req,res)=>{
    try{
        const categoryReqList=req.body;
        console.log(categoryReqList)
        const addCategoryList=await helperModel.category.insertMany(categoryReqList)
        console.log("res===",addCategoryList)
        res.status(200).send(addCategoryList)

    }catch(err){
          res.status(401).send({message:err.message})
    }
}

const getCategory=async(req,res)=>{
    try{
        const getCategories=await helperModel.category.find({})
        res.status(200).send(getCategories)

    }catch(err){
          res.status(401).send({message:err.message})
    }
}
const addLocation=async(req,res)=>{
    try{
        const LocationReqList=req.body;
        const addLocationList=await helperModel.location.insertMany(LocationReqList)
        res.status(200).send(addLocationList)

    }catch(err){
          res.status(401).send({message:err.message})
    }
}

const getLocation=async(req,res)=>{
    try{
        const getLocations=await helperModel.location.find({})
        res.status(200).send(getLocations)

    }catch(err){
          res.status(401).send({message:err.message})
    }
}

module.exports = {
    checkExistingRecordByAttribute,
    addCategory,
    getCategory,
    addLocation,
    getLocation
}