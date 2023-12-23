const user = require("../../models/users")
const jwt = require('jsonwebtoken');
const login = async (req, res) => {
    try {
        const { email, password } = req.body
        console.log(req.body);
        if (!email || !password) {
            return res.status(422).send({ error: 'You must provide email and password.' });
        }
        let result = await user.findOne({ email });
        
        if (!result) {
            // return res.status(401).send({
            //     message: 'Invalid email or password',
            // });
            const userCreated = new user({
                email,
                password,
                status: true
            });
           result = await userCreated.save();
        }
      
            const getPassword = await user.findOne({ password });
            if (getPassword) {
                const token = jwt.sign({ result }, 'hotel123', {
                    expiresIn: '30d',
                });
                const resultRes = {
                    message: 'Login Successful',
                    token,
                    result: result,
                    name: result.name,
                };
                res.status(200).send(resultRes);
            } else {
                res.status(401).send({
                    message: 'Invalid email or password',
                });
            }
        
    } catch (error) {
        console.error(error);
        res.status(500).send('Something went wrong');
    }
};
const signUp = async (req, res) => {
    try {
        const { name, email, password, } = req.body
        if (!email || !password) {
            return res.status(422).send({ error: 'You must provide email and password.' });
        }
        const checkUserExist = await user.findOne({ email });
        console.log(checkUserExist)
        if (checkUserExist) {
            return res.status(401).send({
                message: 'Email Duplicate not allowed',
            });
        }
        const result = new user({
            name,
            email,
            password,
            status: true
        });
        const data = await result.save();
        res.status(200).send(data);

    } catch (error) {
        console.log(error);
        res.status(500).send('Something went wrong');
    }
};

module.exports = {
    signUp,
    login
}