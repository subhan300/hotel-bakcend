
const app=require("express")
const actions=require("../../controller/menus/")
const router=app.Router()

router.post("/add",actions.addMenus)
router.get("/getAllMenuId",actions.getMenuAllId)
router.get("/getMenuByRestaurantId",actions.getMenuByRestaurantId)
router.put("/update",actions.updateMenu)

module.exports=router