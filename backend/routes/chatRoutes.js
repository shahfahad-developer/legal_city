const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateToken } = require('../utils/middleware');

// Get all conversations for a user
router.get('/conversations', authenticateToken, async (req, res) => {
  try {
    const { id: userId, userType } = req.user;
    
    const conversations = await db('chat_messages')
      .select(
        db.raw(`
          CASE 
            WHEN sender_id = ? AND sender_type = ? THEN receiver_id
            ELSE sender_id
          END as partner_id
        `, [userId, userType]),
        db.raw(`
          CASE 
            WHEN sender_id = ? AND sender_type = ? THEN receiver_type
            ELSE sender_type
          END as partner_type
        `, [userId, userType]),
        db.raw('MAX(created_at) as last_message_time'),
        db.raw('COUNT(CASE WHEN read_status = 0 AND receiver_id = ? AND receiver_type = ? THEN 1 END) as unread_count', [userId, userType])
      )
      .where(function() {
        this.where({ sender_id: userId, sender_type: userType })
          .orWhere({ receiver_id: userId, receiver_type: userType });
      })
      .groupBy('partner_id', 'partner_type')
      .orderBy('last_message_time', 'desc');

    const conversationsWithDetails = await Promise.all(
      conversations.map(async (conv) => {
        const table = conv.partner_type === 'lawyer' ? 'lawyers' : 'users';
        const partner = await db(table)
          .select('id', 'name', 'email', 'profile_image')
          .where('id', conv.partner_id)
          .first();

        const lastMessage = await db('chat_messages')
          .where(function() {
            this.where({ 
              sender_id: userId, 
              sender_type: userType,
              receiver_id: conv.partner_id,
              receiver_type: conv.partner_type
            }).orWhere({ 
              sender_id: conv.partner_id,
              sender_type: conv.partner_type,
              receiver_id: userId,
              receiver_type: userType
            });
          })
          .orderBy('created_at', 'desc')
          .first();

        return {
          partner_id: conv.partner_id,
          partner_type: conv.partner_type,
          partner_name: partner?.name || 'Unknown',
          partner_email: partner?.email,
          partner_image: partner?.profile_image,
          last_message: lastMessage?.content,
          last_message_time: conv.last_message_time,
          unread_count: conv.unread_count
        };
      })
    );

    res.json(conversationsWithDetails);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
});

// Get messages between two users
router.get('/messages/:partnerId/:partnerType', authenticateToken, async (req, res) => {
  try {
    const { id: userId, userType } = req.user;
    const { partnerId, partnerType } = req.params;
    const { limit = 50, offset = 0 } = req.query;

    const messages = await db('chat_messages')
      .where(function() {
        this.where({
          sender_id: userId,
          sender_type: userType,
          receiver_id: partnerId,
          receiver_type: partnerType
        }).orWhere({
          sender_id: partnerId,
          sender_type: partnerType,
          receiver_id: userId,
          receiver_type: userType
        });
      })
      .orderBy('created_at', 'desc')
      .limit(limit)
      .offset(offset);

    res.json(messages.reverse());
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Mark conversation as read
router.put('/messages/read/:partnerId/:partnerType', authenticateToken, async (req, res) => {
  try {
    const { id: userId, userType } = req.user;
    const { partnerId, partnerType } = req.params;

    await db('chat_messages')
      .where({
        sender_id: partnerId,
        sender_type: partnerType,
        receiver_id: userId,
        receiver_type: userType,
        read_status: 0
      })
      .update({ read_status: 1 });

    res.json({ success: true });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    res.status(500).json({ error: 'Failed to mark messages as read' });
  }
});

// Delete conversation
router.delete('/conversation/:partnerId/:partnerType', authenticateToken, async (req, res) => {
  try {
    const { id: userId, userType } = req.user;
    const { partnerId, partnerType } = req.params;

    await db('chat_messages')
      .where(function() {
        this.where({
          sender_id: userId,
          sender_type: userType,
          receiver_id: partnerId,
          receiver_type: partnerType
        }).orWhere({
          sender_id: partnerId,
          sender_type: partnerType,
          receiver_id: userId,
          receiver_type: userType
        });
      })
      .delete();

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting conversation:', error);
    res.status(500).json({ error: 'Failed to delete conversation' });
  }
});

module.exports = router;