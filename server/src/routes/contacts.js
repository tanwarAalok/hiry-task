const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const authMiddleware = require('../middlewares/auth');

router.use(authMiddleware);

router.get('/', contactController.getContacts);
router.get('/get/:contactId', contactController.getContactById);
router.get('/all', contactController.getNonContactUsers);
router.get('/search', contactController.searchUsers);
router.post('/add', contactController.addContact);
router.put('/:contactId/archive', contactController.updateContactStatus);
router.put('/:contactId/block', contactController.updateContactStatus);

module.exports = router;