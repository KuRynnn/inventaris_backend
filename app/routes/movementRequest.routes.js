const express = require('express');
const router = express.Router();
const movementRequestController = require('../controllers/movementRequest.controller');
const authMiddleware = require('../middleware/auth.middleware');
const roleCheck = require('../middleware/roleCheck.middleware');
const { validateMovementRequest, validatePagination } = require('../middleware/validators.middleware');

router.get('/', authMiddleware, validatePagination, movementRequestController.getAllRequests);
router.get('/:id', authMiddleware, movementRequestController.getRequestById);
router.post('/', authMiddleware, validateMovementRequest, movementRequestController.createRequest);
router.put('/:id', authMiddleware, roleCheck(['admin']), movementRequestController.updateRequestStatus);
router.get('/:id/pdf', authMiddleware, roleCheck(['admin']), movementRequestController.generatePDF);

module.exports = router;