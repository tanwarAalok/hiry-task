const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const authMiddleware = require('../middlewares/auth');
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/upload', upload.single('file'), messageController.uploadMedia);


router.use(authMiddleware);

router.get('/:contactId', messageController.getMessages);
router.post('/', messageController.sendMessage);
router.put('/:messageId/read', messageController.markMessageAsRead);

module.exports = router;