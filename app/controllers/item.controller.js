const Item = require('../models/item.model');
const MovementRequest = require('../models/movementRequest.model');

exports.getAllItems = async (req, res) => {
  try {
    console.log('Fetching all items');
    const { type, page = 1, limit = 10, search = '' } = req.query;
    const items = await Item.getAll(type, page, limit, search);
    const totalCount = await Item.getCount({ search });
    console.log('Items fetched successfully:', items.length, 'Total count:', totalCount);
    res.json({ items, totalCount });
  } catch (error) {
    console.error('Error in getAllItems:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};

exports.getItemById = async (req, res, next) => {
  try {
    const item = await Item.getById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json(item);
  } catch (error) {
    next(error);
  }
};

exports.createItem = async (req, res, next) => {
  try {
    const itemId = await Item.create(req.validatedBody);
    res.status(201).json({ message: 'Item created successfully', itemId });
  } catch (error) {
    next(error);
  }
};

exports.updateItem = async (req, res, next) => {
  try {
    await Item.update(req.params.id, req.validatedBody);
    res.json({ message: 'Item updated successfully' });
  } catch (error) {
    next(error);
  }
};

exports.deleteItem = async (req, res, next) => {
  try {
    await Item.delete(req.params.id);
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    next(error);
  }
};

exports.getItemStats = async (req, res) => {
  try {
    console.log('Fetching item stats');
    const stats = await Item.getStats();
    const pendingRequestsCount = await MovementRequest.getPendingCount();
    console.log('Stats fetched successfully:', stats, 'Pending requests:', pendingRequestsCount);
    res.json({ ...stats, pendingRequestsCount });
  } catch (error) {
    console.error('Error in getItemStats:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};