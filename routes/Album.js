const express = require('express');
const router = express.Router();
const AlbumController = require('../controllers/Album');

router.get('/all',AlbumController.findAllAlbums);

router.post('/new',AlbumController.createAlbum);

router.post('/add/track/:id/',AlbumController.addTrack);

router.patch('/cover/:id',AlbumController.updateCover);

router.delete('/remove/track/:id',AlbumController.removeTrack);

router.delete('/delete/:id',AlbumController.deleteAlbum);

router.get('/my/:id',AlbumController.findMyAlbums);

router.get('/:id',AlbumController.getAlbumInfo);

router.get('/',AlbumController.findAlbumByQuery);

module.exports = router;