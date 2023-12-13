const Restaurant = require("../../models/restaurant")
const helperModel=require("../../models/helperModels")
const checkRecordExist = async (model,key,value) => {
    try {
        const  isExist = await model.exists({[key]:value})
        console.log("ex",isExist)
        return isExist
    } catch (error) {
        console.log(error)
    }
};

const addCategory=async(req,res)=>{
    try{
        const categoryReqList=req.body;
        console.log(categoryReqList)
        const addCategoryList=await helperModel.category.insertMany(categoryReqList)
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

const addCusines=async(req,res)=>{
    try{  
        const cusinesCategoryReqList=req.body;
        const addCusinesList=await helperModel.cusines.insertMany(cusinesCategoryReqList)
        res.status(200).send(addCusinesList)

    }catch(err){
          res.status(401).send({message:err.message})
    }
}

const getLikeMenuItem=async(req,res)=>{
    try{
        const getCategories=await helperModel.menuLikeItem.find({})
        res.status(200).send(getCategories)

    }catch(err){
          res.status(401).send({message:err.message})
    }
}
const addLikeMenuItem=async(req,res)=>{
    try{  
        const {userId,menuId,userLike}=req.body;
        const addLikeItem=await new helperModel.menuLikeItem({userId,menuId,userLike})
        const saveResult=await addLikeItem.save()
        res.status(200).send(saveResult)

    }catch(err){
          res.status(401).send({message:err.message})
    }
}

const getCusines=async(req,res)=>{
    try{
        const getCategories=await helperModel.cusines.find({})
        res.status(200).send(getCategories)

    }catch(err){
          res.status(401).send({message:err.message})
    }
}
module.exports = {
    addCategory,
    getCategory,
    addLocation,
    getLocation,
    checkRecordExist,
    addCusines,
    getCusines,
    addLikeMenuItem,
    getLikeMenuItem
}