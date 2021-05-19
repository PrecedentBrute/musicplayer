const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Playlist = require('../models/playlist');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    password:{
        type: String,
        required: true,
        validate(value){
            if((value.length < 6) || (value.includes('password'))){
                throw new Error('Please try again.')
            } 
        },
        trim: true  
    },
    age: {
        type: Number,
        validate(value) {
            if(value < 0){
                throw new Error('Age must be a positive number!');
            }
        },
        default: 0 
    },
    email: {
        type: String,
        unique: true,
        required: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid!');
            }
        },
        trim: true
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
});


userSchema.virtual('userPlaylists', {
    ref: 'Playlist',
    localField: '_id',
    foreignField: 'owner'
}); 

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({email});
    
    if(!user){
        throw new Error("Unable to login!");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch){
        throw new Error("Unable to login!");
    }

    return user;
}

userSchema.methods.generateAuthToken = async function() {
    const user = this; 
    const token = jwt.sign({_id: user._id.toString()}, 'supersecretkey');
    
    user.tokens = user.tokens.concat({token});
    await user.save();
    
    return token;
}


userSchema.methods.toJSON = function () {
    
    const user = this;
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.tokens;

    return userObject; 
}


userSchema.pre('save', async function (next) {
    const user = this;
    
    if(user.isModified('password')) {
        const password = await bcrypt.hash(user.password, 8);
        user.password = password;
    }
    
    next();
});

userSchema.pre('remove', async function (next) {
    const user = this; 
    await Playlist.deleteMany({ owner: user._id });
    next(); 

})

const User = mongoose.model('User', userSchema);

module.exports = User;