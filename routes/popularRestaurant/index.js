
const app=require("express")
const actions=require("../../controller/populorRestaurant")
const router=app.Router()

router.post("/addRestaurant",actions.addPopularRestaurant)
router.get("/getAll",actions.getPopularRestaurant)



module.exports=router