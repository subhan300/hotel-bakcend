const Restaurant = require("../../models/restaurant")
const Menu=require("../../models/restaurant_menu")
const checkExistingRecordByAttribute = async (name) => {
    try {
        const existingRestaurant = await Restaurant.findOne({ name: name });

        if (existingRestaurant) {
            // Restaurant with the same name exists
            return true
        }

        // Restaurant with the given name doesn't exist
        return false;
    } catch (error) {
        console.log(err)
    }
};


module.exports = {
    checkExistingRecordByAttribute
}