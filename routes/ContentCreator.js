const express = require('express');
const router = express.Router();
const ContentCreatorController = require('../controllers/ContentCreator');


router.post('/new',ContentCreatorController.newUser);

router.post('/login',ContentCreatorController.login);

router.get('/all',ContentCreatorController.getAllContentCreators);

router.patch('/:id',ContentCreatorController.updateProfile);

router.delete('/:id',ContentCreatorController.deleteAccount);

router.get('/:id',ContentCreatorController.findContentCreator);

router.get('/',ContentCreatorController.findContentCreatorByQuery);

module.exports = router;