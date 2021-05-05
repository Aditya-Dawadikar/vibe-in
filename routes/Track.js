const express = require('express');
const router = express.Router();
const TrackController = require('../controllers/Track');

router.post('/upload/track',TrackController.uploadTrack);
router.post('/upload/info/:trackName',TrackController.postTrackData);

router.post('/new/cover',TrackController.uploadCover);

router.get('/all',TrackController.getAllTracks);

router.patch('/update/track/:id/:trackName',TrackController.updateTrack);
router.patch('/update/info/:id',TrackController.updateTrackInfo);

router.delete('/:id',TrackController.deleteTrack);

router.delete('/:id',TrackController.deleteCover);

router.get('/:id',TrackController.getTrackInfo);

router.get('/',TrackController.getTrackByQuery);

module.exports = router;