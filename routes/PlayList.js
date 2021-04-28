const express = require('express');
const router = express.Router();
const PlayListController = require('../controllers/PlayList');

router.get('/all',PlayListController.getPlaylist);

router.post('/new',PlayListController.createPlayList);

router.post('/add/track/:id/',PlayListController.addTrack);

router.delete('/remove/track/:id',PlayListController.removeTrack);

router.delete('/delete/:id',PlayListController.deletePlayList);

router.get('/:id',PlayListController.getPlaylist);

router.get('/',PlayListController.findPlayListByQuery);

module.exports = router;