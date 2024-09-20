const express = require('express');
const router = express.Router();
const itemController = require('../controllers/item.controller');
const authMiddleware = require('../middleware/auth.middleware');
const roleCheck = require('../middleware/roleCheck.middleware');
const { validateItem, validatePagination } = require('../middleware/validators.middleware');

router.get('/', authMiddleware, validatePagination, itemController.getAllItems);
router.get('/stats', authMiddleware, itemController.getItemStats);
router.get('/:id', authMiddleware, itemController.getItemById);
router.post('/', authMiddleware, roleCheck(['admin', 'petugas']), validateItem, itemController.createItem);
router.put('/:id', authMiddleware, roleCheck(['admin', 'petugas']), validateItem, itemController.updateItem);
router.delete('/:id', authMiddleware, roleCheck(['admin', 'petugas']), itemController.deleteItem);

module.exports = router;