import express from 'express';
import bodyParser from 'body-parser';

export const router = express.Router();

router.use((req, res, next) => {
    console.log('API called : ', req.originalUrl);
    next();
});

router.post('/join', bodyParser.json(), (req, res) => {
    let user = req.body;
    let newUser;
    if (user) {
        newUser = {
            name: user.userName,
            joined: true,
            time: new Date()
        };
    }
    if (req.session) {
        req.session.user = newUser;
    }
    res.json({
        name: user.userName,
        joined: true,
        time: new Date()
    });
})

router.post('/leave', (req, res) => {
    let leftUser = req.session.user;
    req.session.destroy();
    res.json({
        ...leftUser,
        joined: false,
        time: new Date()
    });
})

router.get('/hasjoined', (req, res) => {
    let joinedUser = { joined: false };
    if (req.session && req.session.user) {
        joinedUser = req.session.user;
    }
    res.json(joinedUser);
})

router.use((req, res, next) => {
    res.status(404).send(`'${req.originalUrl}' does not exist`);
});