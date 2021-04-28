const express = require('express');
const router = express.Router();
const TrackController = require('../controllers/Track');

router.post('/new',TrackController.uploadTrack);

router.get('/all',TrackController.getAllTracks);

router.patch('/:id',TrackController.updateTrack);

router.delete('/:id',TrackController.deleteTrack);

router.get('/:id',TrackController.getTrackInfo);

router.get('/',TrackController.getTrackByQuery);

module.exports = router;