const Review = require("../../models/review")
const User=require("../../models/users")

const addReview = async (req, res) => {
    try {
        const { userId, review,rating,restaurantId } = req.body
        const createReview = new Review({ userId, rating,review, rating,restaurantId  })
        const reviewExistOfUser = await Review.findOne({ userId })
        
        if (reviewExistOfUser) {
            return res.status(200).send("Duplicate review not allowed for same user")
        }
        

        const getUser=req.user
        if(!getUser.status){
         res.status(401).send("You Are not Allowed To Give Review")
        }
        const saveResult = await createReview.save()
        res.status(200).send(saveResult)

    } catch (err) {
        res.status(401).send(err)
    }
}

const getReview = async (req, res) => {
    try {
        const {id}=req.query
        console.log("id==",id)
        const getReviews = await Review.find({restaurantId:id})
        res.status(200).send(getReviews)
    } catch (err) {
        res.status(401).send(err)
    }
}


module.exports = {
    addReview,
    getReview
}