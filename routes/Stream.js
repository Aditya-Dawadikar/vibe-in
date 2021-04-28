const express = require('express');
const router = express.Router();
const streamController = require('../controllers/Stream');

router.get('/:id',streamController.streamTrack);

module.exports=router;