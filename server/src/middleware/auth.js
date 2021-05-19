const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (req, res, next) => {
    try{
        const token = req.header('Authorization').replace('Bearer ','');
        const payload = jwt.verify(token, 'supersecretkey');
        console.log(payload);
        const user = await User.findOne({_id: payload._id, 'tokens.token' : token});
    

        console.log(user);
        if(!user){
            throw new Error();
        }
     
        req.user = user;
        req.token = token;
        next();
    }catch(e){
        console.log(e);
        res.status(401).send(e);
    }
}

module.exports = auth;

