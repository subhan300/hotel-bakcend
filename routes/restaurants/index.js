
const app=require("express")
const actions=require("../../controller/restaurants/")
const router=app.Router()

router.post("/add",actions.addRestaurants)
router.get("/getAll",actions.getRestaurants)
router.get("/getAllId",actions.getRestaurantAllId)
router.get("/getRestaurantById",actions.getRestaurantById)
router.get("/searchRestaurant",actions.searchRestaurant)
router.get("/searchByName",actions.searchRestaurantByName)
router.get("/filter",actions.filterRestaurant)
router.get("/aggregateParactice",actions.getRestaurantAggreParactice)
router.put("/update",actions.updateRestaurant)
router.delete("/delete",actions.deleteRestaurant)

module.exports=router