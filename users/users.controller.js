const express = require('express');
const router = express.Router();
const userService = require('./user.service');

// routes
router.post('/authenticate', authenticate);
router.post('/createProject', createProject);
router.post('/getUserList', getUserList);
router.post('/getProjectList', getProjectList);
router.get('/', getAll);

module.exports = router;

function authenticate(req, res, next) {
    userService.authenticate(req.body)
        .then(user => user ? res.json(user) : res.status(400).json({ message: 'Username or password is incorrect' }))
        .catch(err => next(err));
}

function createProject(req, res, next) {
    console.log(req)
    userService.createProject(req.body)
        .then(user => user ? res.json(user) : res.status(400).json({ message: 'Failed to add Project' }))
        .catch(err => next(err));
}

function getUserList(req, res, next) {
    console.log(req)
    userService.getUserList(req.body)
        .then(result => result ? res.json(result) : res.status(400).json({ message: 'Unable to Access User List' }))
        .catch(err => next(err));
}

function getProjectList(req, res, next) {
    console.log(req)
    userService.getProjectList(req.body)
        .then(result => result ? res.json(result) : res.status(400).json({ message: 'Unable to Access Project List' }))
        .catch(err => next(err));
}

function getAll(req, res, next) {
    userService.getAll()
        .then(users => res.json(users))
        .catch(err => next(err));
}
