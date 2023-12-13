
const app=require("express")
const actions=require("../../controller/globalController")
const router=app.Router()

router.post("/addCategory",actions.addCategory)
router.get("/getAllCategories",actions.getCategory)
router.post("/addLocation",actions.addLocation)
router.get("/getAllLocations",actions.getLocation)
router.post("/addCusines",actions.addCusines)
router.get("/getAllCusines",actions.getCusines)




module.exports=router