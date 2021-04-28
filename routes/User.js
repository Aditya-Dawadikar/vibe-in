const express = require('express');
const router = express.Router();
const UserController = require('../controllers/User');
const User = require('../models/User');

router.post('/new',UserController.newUser);

router.post('/login',UserController.login);

router.get('/all',UserController.getAllUsers);

router.patch('/:id',UserController.updateProfile);

router.delete('/:id',UserController.deleteAccount);

router.get('/:id',UserController.findUser);

router.get('/',UserController.findUserByQuery);

module.exports = router;