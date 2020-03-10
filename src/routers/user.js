const express = require('express');
const router = new express.Router(); //create new router
const multer = require('multer');
const sharp = require('sharp');
const User = require('../models/user');
const auth = require('../middleware/auth');
const {sendWelcomeEmail, sendGoodbyeEmail} = require('../emails/account');

router.post('/users', async(req, res) => {
    //create a new User object based on POST data
    const user = new User(req.body); 

    try {
        await user.save();
        sendWelcomeEmail(user.email, user.name);
        const token = user.generateAuthToken();
        res.status(201).send(user);
    } catch(e) {
        //If user.save() is not successful, it will throw an error.
        res.status(400).send(e);
    }
});

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken(); //generate the token for a very specific user
        await user.save();
        res.send({user, token});
    } catch (e) {
        res.status(400).send();
    }
});

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => token.token !== req.token);
        await req.user.save();
        res.send();
    } catch (e) {
        res.status(500).send(e);
    }
});

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send();
    } catch (e) {
        res.status(500).send(e);
    }
});

//put 'auth' middleware function as the second argument
router.get('/users/me', auth, async(req, res) => {
    res.send(req.user);
});

//PATCH HTTP method was designed for updating the existing resource
router.patch('/users/me', auth, async (req, res) => {
    //make sure every single update is in allowedUpdates
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'age'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({error: 'Invalid updates!'});
    }
    
    try {
        //replace it to make sure mongoose middleware works properly
        // const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});
        updates.forEach((update) => req.user[update] = req.body[update]);
        await req.user.save();
        res.send(req.user);
    } catch (e) {
        res.send(400).send(e);
    }
});

router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove();
        sendGoodbyeEmail(req.user.email, req.user.name);
        res.send(user);
    } catch (e) {
        res.status(400).send(e);
    }
});

const upload = multer({
    // Hide this line so the image will be passed to the function inside router (req.file.buffer)
    // dest: 'avatars', // from the project root dir
    limits: {
        fileSize: 1000000 //1MB 
    },
    fileFilter(req, file, cb) {
        // Examine if the file format using regex
        if (!file.originalname.match('\.(jpg|jpeg|png)$')) {
            return cb(new Error('Please upload an image (jpg, jpeg or png).'));
        }
        cb(undefined, true);
    }
});

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.send();
}, (error, req, res, next) => { 
    // Express error handling
    res.status(400).send({error: error.message});
});

router.delete('/users/me/avatar', auth, async (req, res) => {
    try {
        req.user.avatar = undefined;
        await req.user.save();
        res.send();
    } catch (e) {
        res.status(400).send(e);
    }
});

router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user || !user.avatar) {
            throw new Error();
        }

        res.set('Content-Type', 'image/png');
        res.send(user.avatar);
    } catch (e) {
        res.status(404).send(e);
    }
});

module.exports = router;