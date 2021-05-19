const express = require('express');
const router = new express.Router();
const User = require('../models/user');
const auth = require('../middleware/auth');

router.post('/users', async (req, res) => {
    const user = new User(req.body);

    try{
        await user.save();
        const token = await user.generateAuthToken();
        res.status(201).send({user, token});
    }catch(e){
        console.log(e);
        res.status(400).send(e);
    }
    
});


router.get('/users/me', auth, async (req, res) => {
    try{
        res.status(200).send(req.user);
    }catch(e){
        res.status(500).send(e);
    }
});

router.post('/users/login', async(req, res) => {
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();

        res.send({user, token});
    }catch(e){
        res.status(400).send();
    }
});

router.post('/users/logoutall', auth, async (req, res) => {
    try {
        req.user.tokens = [];

        await req.user.save();

        res.status(200).send();
    } catch (e) {
        res.status(500).send();
    }
});

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(token => {
            return token.token !== req.token;
        });
        await req.user.save();

        res.status(200).send();
    } catch (e) {
        res.status(500).send();
    }
});

router.patch('/users/me', auth, async(req, res) => {
    const allowedUpdates = ['name', 'email', 'password', 'age'];
    const updates = Object.keys(req.body);

    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if(!isValidOperation){
        return res.status(400).send("Invalid update!");
    }

    try{
        
        const user = req.user;
    
        
        updates.forEach( update => user[update] = req.body[update]);

        await user.save();
        res.send(user);
    }catch(e){
        console.log(e);
        res.status(400).send(e);
    }
});

router.delete('/users/me', auth, async(req, res) => {
    try{
        // const user = await User.findByIdAndDelete(req.user._id);
        // if(!user){
        //     return res.status(404).send("No such user!");
        // }

        await req.user.remove(); 
        res.status(200).send("Deleted");
    }catch(e){
        res.status(400).send(e);
        console.log(e);
    }
})


module.exports = router;