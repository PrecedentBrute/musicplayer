const express = require('express');
const router = new express.Router();
const Playlist = require('../models/playlist');
const auth = require('../middleware/auth');

router.post('/playlists', auth, async (req, res) => {
    
    const playlist = new Playlist({
        ...req.body,
        owner: req.user._id
    });
     
    try {
        await playlist.save();
        res.status(201).send(playlist);
    }catch(e){
        res.status(400).send(e);
    }
});


router.get('/playlists', auth, async (req, res) => {
    try{
        await req.user.populate('userPlaylists').execPopulate();
        res.status(200).send(req.user.userPlaylists);
    }catch(e){
        res.status(500).send(e);
    }
});

router.get('/playlists/:id', auth, async (req, res) => {
    try{

        const playlist = await Playlist.findOne({ _id: req.params.id, owner: req.user._id });
        
        if (!playlist) {
            return res.status(404).send("Not found!");
        }
        res.send(playlist);
    }catch(e){
        res.status(500).send(e);
    }
});

router.patch('/playlists/:id', auth,  async(req, res) => {
    const allowedUpdates = ['name', 'playlists', 'dateCreated'];
    const updates = Object.keys(req.body);

    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if(!isValidOperation){
        return res.status(400).send("Invalid update!");
    }

    try{
        //const playlist = await Playlist.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true});
        const playlist = await Playlist.findOne({ _id: req.params.id, owner: req.user._id });
        
        
        if (!playlist) {
            return res.status(404).send("Playlist not found!");
        }

        updates.forEach(update => playlist[update] = req.body[update]);
        await playlist.save();
 
        res.send(playlist);
    }catch(e){
        res.status(400).send(e);
    }
});

router.delete('/playlists/:id', auth, async(req, res) => {
    try{
        const playlist = await Playlist.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
        if (!playlist) {
            return res.status(404).send("No such playlist!");
        }
        res.status(200).send(playlist)
    } catch (e) {
        res.status(500).send(e);
    }
})


module.exports = router;