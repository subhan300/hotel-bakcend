
const app=require("express")
const actions=require("../../controller/user")
const authMiddleware=require("../../middleware/authentication")
const router=app.Router()

router.post("/signup",actions.signUp)
router.post("/login",actions.login)



module.exports=router