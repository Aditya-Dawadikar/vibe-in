const express = require('express');
const router = express.Router();
const PlayListController = require('../controllers/PlayList');

// router.get('/all',PlayListController.getAllPlaylist);

router.post('/new',PlayListController.createPlayList);

router.post('/add/tracks',PlayListController.addTrack);

router.delete('/remove/track',PlayListController.removeTrack);

router.delete('/delete/:id',PlayListController.deletePlayList);

router.get('/my/:id',PlayListController.findMyPlayLists);

router.get('/:id',PlayListController.getPlaylist);

router.get('/',PlayListController.findPlayListByQuery);

module.exports = router;