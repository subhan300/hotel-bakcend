
const app=require("express")
const actions=require("../../controller/promotion/")
const router=app.Router()

router.post("/add",actions.addPromotion)
router.get("/getAll",actions.getPromotion)



module.exports=router