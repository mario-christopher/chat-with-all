import express from 'express';
import bodyParser from 'body-parser';

import { logApi, notFound, isAuthorized } from './middleware';
import { addUser, removeUser, getAllUsers, getUserMessages } from './chat-data';

export const router = express.Router();

router.use(logApi);

router.post('/join', bodyParser.json(), (req, res) => {

    let user = req.body;
    if (user) {
        addUser(user.userName)
            .then(newUser => {
                if (req.session) {
                    req.session.user = newUser;
                }
                res.json(newUser);
            })
            .catch(err => {
                res.status(500).send(err);
            });
    }
    else
        res.status(400).send();
})

router.post('/leave', isAuthorized, (req, res) => {

    let user = req.session.user;
    removeUser(user.userName)
        .then(() => {
            req.session.destroy();
            res.json(null);
        })
        .catch(err => {
            res.status(500).send(err);
        })
})

router.get('/hasjoined', (req, res) => {

    let joinedUser = null;
    if (req.session && req.session.user) {
        joinedUser = req.session.user;
    }
    res.json(joinedUser);
})

router.get('/users', isAuthorized, (req, res) => {

    getAllUsers()
        .then(users => {
            res.json(users);
        })
        .catch(err => {
            res.status(500).send(err);
        })
})

router.get('/messages', isAuthorized, (req, res) => {

    let userName = req.session.user.userName;
    getUserMessages(userName)
        .then(messages => {
            res.json(messages);
        })
        .catch(err => {
            res.status(500).send(err);
        });
})

router.use(notFound);