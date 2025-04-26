import express from 'express';
import playlistController from '../controllers/playlistController.js';
const router = express.Router();

router.get('/', playlistController.getPlaylists);
router.post('/', playlistController.createPlaylist);
router.delete('/:id', playlistController.deletePlaylist);
router.patch('/:id', playlistController.updatePlaylist);
router.get('/:id', playlistController.getPlaylistById);

export default router;
