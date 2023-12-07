
const app=require("express")
const actions=require("../../controller/restaurants/")
const router=app.Router()

router.post("/add",actions.addRestaurants)
router.get("/getAll",actions.getRestaurants)
router.get("/getAllId",actions.getRestaurantAllId)
router.get("/getRestaurantById",actions.getRestaurantById)
router.get("/searchRestaurant",actions.searchRestaurant)
router.get("/searchByName",actions.searchRestaurantByName)

module.exports=router