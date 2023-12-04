const express=require("express")
const router=express.Router()
const actions=require("../../controller/review")
const authMiddleware=require("../../middleware/authentication")
router.post("/add",authMiddleware.ensureUserAuth,actions.addReview)
router.get("/getAll",actions.getReview)

module.exports=router
