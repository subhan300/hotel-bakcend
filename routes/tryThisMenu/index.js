const express=require("express")
const router=express.Router()
const actions=require("../../controller/tryThisMenu")
router.post("/add",actions.addTryMenuItems)
router.get("/getAll",actions.getTryMenuItems)

module.exports=router
