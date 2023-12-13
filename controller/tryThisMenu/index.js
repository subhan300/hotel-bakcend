const TryMenuItem = require("../../models/tryThisMenu");
const { isExist } = require("../../utils/globalFunctions");

const addTryMenuItems = async (req, res) => {
    try {
        const { menuId} = req.body;
        const isExistItem=await isExist(TryMenuItem,{menuId});
        console.log("---",isExistItem)
        if(isExistItem){
          return  res.status(401).send("Already Exist")
        }
        const createTryMenuItem= new TryMenuItem({ menuId  })
        
        const saveResult = await createTryMenuItem.save()
        res.status(200).send(saveResult)

    } catch (err) {
        res.status(401).send(err)
    }
}

const getTryMenuItems = async (req, res) => {
    try {
        const {id}=req.query
        const getReviews = await TryMenuItem.find({menuId:id}).populate("menuId")
        res.status(200).send(getReviews)
    } catch (err) {
        res.status(401).send(err)
    }
}


module.exports = {
    getTryMenuItems,
    addTryMenuItems
}