import {Router} from "express";

const router = Router();
const artistController = require('../controllers/artist.controller');

router.get('/search', artistController.getArtist);
router.get('/download', artistController.generateArtistCsv);
router.get('/populate', artistController.generateJsonFallbackFile);

module.exports = router;