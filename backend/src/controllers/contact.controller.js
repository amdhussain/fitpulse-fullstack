const contactService = require('../services/contact.service');
const { successResponse, createdResponse, paginatedResponse } = require('../helpers/apiResponse');
const asyncHandler = require('../middlewares/asyncHandler');

// ─── Contact Controller ─────────────────────────────────────
// HTTP handlers for contact form submissions.
// Public: submit messages. Admin: manage messages.
// ───────────────────────────────────────────────────────────

// @desc    Submit contact message (public)
// @route   POST /api/v1/public/contact
// @access  Public
const submit = asyncHandler(async (req, res) => {
  const message = await contactService.createMessage({
    ...req.body,
    userId: req.user ? req.user.id : null,
  });
  return createdResponse(res, message, 'Message sent successfully');
});

// @desc    List all contact messages (admin)
// @route   GET /api/v1/contact-messages
// @access  Admin
const getAll = asyncHandler(async (req, res) => {
  const result = await contactService.getMessages(req.query);
  return paginatedResponse(res, result);
});

// @desc    Get contact message by ID (admin)
// @route   GET /api/v1/contact-messages/:id
// @access  Admin
const getById = asyncHandler(async (req, res) => {
  const message = await contactService.getMessageById(req.params.id);
  return successResponse(res, message, 'Message retrieved successfully');
});

// @desc    Mark message as read (admin)
// @route   PUT /api/v1/contact-messages/:id/read
// @access  Admin
const markAsRead = asyncHandler(async (req, res) => {
  const message = await contactService.markAsRead(req.params.id);
  return successResponse(res, message, 'Message marked as read');
});

// @desc    Mark all messages as read (admin)
// @route   PUT /api/v1/contact-messages/read-all
// @access  Admin
const markAllAsRead = asyncHandler(async (req, res) => {
  await contactService.markAllAsRead();
  return successResponse(res, null, 'All messages marked as read');
});

// @desc    Delete contact message (admin)
// @route   DELETE /api/v1/contact-messages/:id
// @access  Admin
const remove = asyncHandler(async (req, res) => {
  await contactService.removeMessage(req.params.id);
  return successResponse(res, null, 'Message deleted successfully');
});

// @desc    Get unread message count (admin)
// @route   GET /api/v1/contact-messages/unread/count
// @access  Admin
const getUnreadCount = asyncHandler(async (req, res) => {
  const count = await contactService.getUnreadCount();
  return successResponse(res, { count }, 'Unread count retrieved successfully');
});

module.exports = {
  submit,
  getAll,
  getById,
  markAsRead,
  markAllAsRead,
  remove,
  getUnreadCount,
};
