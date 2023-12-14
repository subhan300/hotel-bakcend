
const app=require("express")
const actions=require("../../controller/globalController")
const router=app.Router()

router.post("/addCategory",actions.addCategory)
router.get("/getAllCategories",actions.getCategory)
router.post("/addType",actions.addTypes)
router.get("/getAllTypes",actions.getTypes)
router.post("/addLocation",actions.addLocation)
router.get("/getAllLocations",actions.getLocation)
router.post("/addCusines",actions.addCusines)
router.get("/getAllCusines",actions.getCusines)
router.get("/getAllLikeMenuItems",actions.getLikeMenuItem)
router.post("/addLikeMenuItem",actions.addLikeMenuItem)




module.exports=router