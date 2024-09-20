const MovementRequest = require('../models/movementRequest.model');
const PDFDocument = require('pdfkit');

exports.getAllRequests = async (req, res, next) => {
  try {
    const { page, limit, search } = req.validatedQuery;
    const requests = await MovementRequest.getAll(page, limit, search);
    const totalRequests = await MovementRequest.getCount(search);
    res.json({
      requests,
      currentPage: page,
      totalPages: Math.ceil(totalRequests / limit),
      totalItems: totalRequests
    });
  } catch (error) {
    next(error);
  }
};

exports.getRequestById = async (req, res, next) => {
  try {
    const request = await MovementRequest.getById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Movement request not found' });
    }
    res.json(request);
  } catch (error) {
    next(error);
  }
};

exports.createRequest = async (req, res, next) => {
  try {
    const requestId = await MovementRequest.create(req.validatedBody);
    res.status(201).json({ message: 'Movement request created successfully', requestId });
  } catch (error) {
    next(error);
  }
};

exports.updateRequestStatus = async (req, res, next) => {
  try {
    await MovementRequest.update(req.params.id, req.body.status);
    res.json({ message: 'Movement request status updated successfully' });
  } catch (error) {
    next(error);
  }
};

exports.generatePDF = async (req, res, next) => {
  try {
    const request = await MovementRequest.getById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Movement request not found' });
    }

    // Create a new PDF document
    const doc = new PDFDocument();

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=nota-dinas-${request._id}.pdf`);

    // Pipe the PDF document to the response
    doc.pipe(res);

    // Add content to the PDF
    doc.fontSize(18).text('Surat Nota Dinas Pemindahan Barang', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Nama Barang: ${request.itemName}`);
    doc.text(`Qty: ${request.quantity}`);
    doc.text(`Nama Peminjam: ${request.requestedBy}`);
    doc.text(`NIP: ${request.nip}`);
    doc.text(`Waktu Pinjam: ${request.createdAt}`);
    doc.text(`Waktu Pemindahan: ${request.moveTime}`);
    doc.text(`Detail Pemindahan: From ${request.fromLocation} to ${request.toLocation}`);

    // Finalize the PDF and end the stream
    doc.end();
  } catch (error) {
    next(error);
  }
};