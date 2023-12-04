const Review = require("../../models/review")
const addReview = async (req, res) => {
    try {
        const { userId, title, review, location, price, service, foodQuality } = req.body
        const createReview = new Review({ userId, title, review, location, price, service, foodQuality })
        const reviewExistOfUser = await Review.findOne({ userId })
        if (reviewExistOfUser) {
            return res.status(200).send("Duplicate review not allowed for same user")
        }
        const saveResult = await createReview.save()
        res.status(200).send(saveResult)

    } catch (err) {
        res.status(401).send(err)
    }
}

const getReview = async (req, res) => {
    try {
        const getReviews = await Review.find({})
        res.status(200).send(getReviews)
    } catch (err) {
        res.status(401).send(err)
    }
}


module.exports = {
    addReview,
    getReview
}