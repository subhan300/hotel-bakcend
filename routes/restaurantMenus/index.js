
const app=require("express")
const actions=require("../../controller/menus/")
const router=app.Router()

router.post("/add",actions.addMenus)
router.get("/getAllMenuId",actions.getMenuAllId)


module.exports=router