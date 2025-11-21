const db = require('../db');
const bcrypt = require('bcryptjs');

// Log admin activity
const logActivity = async (adminId, action, targetType = null, targetId = null, details = null, ipAddress = null) => {
  try {
    await db('activity_logs').insert({
      admin_id: adminId,
      action,
      target_type: targetType,
      target_id: targetId,
      details: JSON.stringify(details),
      ip_address: ipAddress
    });
  } catch (error) {
    console.error('Failed to log activity:', error);
  }
};

// Get dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalLawyers,
      verifiedLawyers,
      unverifiedLawyers,
      recentUsers,
      recentLawyers
    ] = await Promise.all([
      db('users').where({ role: 'user' }).count('id as count').first(),
      db('lawyers').count('id as count').first(),
      db('lawyers').where({ lawyer_verified: 1 }).count('id as count').first(),
      db('lawyers').where({ lawyer_verified: 0 }).count('id as count').first(),
      db('users').where({ role: 'user' }).orderBy('created_at', 'desc').limit(5),
      db('lawyers').orderBy('created_at', 'desc').limit(5)
    ]);

    res.json({
      stats: {
        totalUsers: totalUsers.count,
        totalLawyers: totalLawyers.count,
        verifiedLawyers: verifiedLawyers.count,
        unverifiedLawyers: unverifiedLawyers.count
      },
      recentUsers: recentUsers.map(u => ({
        id: u.id,
        name: u.name,
        email: u.email,
        verified: u.is_verified === 1,
        createdAt: u.created_at
      })),
      recentLawyers: recentLawyers.map(l => ({
        id: l.id,
        name: l.name,
        email: l.email,
        speciality: l.speciality || 'Not provided',
        registration_id: l.registration_id || 'Not provided',
        verified: l.lawyer_verified === 1 || l.is_verified === 1,
        createdAt: l.created_at
      }))
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard statistics' });
  }
};

// Get all users with pagination
const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';

    let query = db('users').where({ role: 'user' });
    
    if (search) {
      query = query.where(function() {
        this.where('name', 'like', `%${search}%`)
          .orWhere('email', 'like', `%${search}%`)
          .orWhere('username', 'like', `%${search}%`);
      });
    }

    const [users, totalCount] = await Promise.all([
      query.clone().select('*').orderBy('created_at', 'desc').limit(limit).offset(offset),
      query.clone().count('id as count').first()
    ]);

    const sanitizedUsers = users.map(user => {
      const { password, email_verification_code, reset_token, ...rest } = user;
      return {
        ...rest,
        verified: user.is_verified === 1,
        mobile_number: rest.mobile_number || 'Not provided'
      };
    });

    res.json({
      users: sanitizedUsers,
      pagination: {
        total: totalCount.count,
        page,
        limit,
        totalPages: Math.ceil(totalCount.count / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

// Get all lawyers with pagination
const getAllLawyers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';
    const verified = req.query.verified;

    let query = db('lawyers');
    
    if (search) {
      query = query.where(function() {
        this.where('name', 'like', `%${search}%`)
          .orWhere('email', 'like', `%${search}%`)
          .orWhere('registration_id', 'like', `%${search}%`)
          .orWhere('speciality', 'like', `%${search}%`);
      });
    }

    if (verified !== undefined) {
      query = query.where('lawyer_verified', verified === 'true' ? 1 : 0);
    }

  const [lawyers, totalCount] = await Promise.all([
    query.clone().select('*').orderBy('updated_at', 'desc').limit(limit).offset(offset),
    query.clone().count('id as count').first()
  ]);

    const sanitizedLawyers = lawyers.map(lawyer => {
      const { password, email_verification_code, reset_token, ...rest } = lawyer;
      return {
        ...rest,
        registration_id: rest.registration_id || 'Not provided',
        law_firm: rest.law_firm || 'Not provided',
        speciality: rest.speciality || 'Not provided',
        mobile_number: rest.mobile_number || 'Not provided',
        name: rest.name || 'Not provided',
        email: rest.email || 'Not provided',
        username: rest.username || 'Not provided'
      };
    });

    res.json({
      lawyers: sanitizedLawyers,
      pagination: {
        total: totalCount.count,
        page,
        limit,
        totalPages: Math.ceil(totalCount.count / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching lawyers:', error);
    res.status(500).json({ message: 'Failed to fetch lawyers' });
  }
};

// Get unverified lawyers (existing function, enhanced)
const getUnverifiedLawyers = async (req, res) => {
  try {
    const unverifiedLawyers = await db('lawyers')
      .where({ lawyer_verified: 0 })
      .select('id', 'name', 'email', 'registration_id', 'law_firm', 'speciality', 'created_at');

    res.json(unverifiedLawyers);
  } catch (error) {
    console.error('Error fetching unverified lawyers:', error);
    res.status(500).json({ message: 'Failed to fetch unverified lawyers' });
  }
};

// Verify lawyer (existing function, enhanced with logging)
const verifyLawyer = async (req, res) => {
  try {
    const { id } = req.params;

    const lawyer = await db('lawyers').where({ id }).first();

    if (!lawyer) {
      return res.status(404).json({ message: 'Lawyer not found' });
    }

    await db('lawyers').where({ id }).update({
      lawyer_verified: 1,
      is_verified: 1,
      updated_at: db.fn.now(),
      profile_completed: 1
    });

    // Log admin activity
    await logActivity(
      req.user.id,
      'VERIFY_LAWYER',
      'lawyer',
      id,
      { lawyerName: lawyer.name, lawyerEmail: lawyer.email },
      req.ip
    );

    res.json({ message: 'Lawyer verified successfully' });
  } catch (error) {
    console.error('Error verifying lawyer:', error);
    res.status(500).json({ message: 'Failed to verify lawyer' });
  }
};

// Reject/Unverify lawyer
const rejectLawyer = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const lawyer = await db('lawyers').where({ id }).first();

    if (!lawyer) {
      return res.status(404).json({ message: 'Lawyer not found' });
    }

    await db('lawyers').where({ id }).update({
      lawyer_verified: 0,
      is_verified: 0,
      updated_at: db.fn.now(),
      profile_completed: 0
    });

    // Log admin activity
    await logActivity(
      req.user.id,
      'REJECT_LAWYER',
      'lawyer',
      id,
      { lawyerName: lawyer.name, lawyerEmail: lawyer.email, reason },
      req.ip
    );

    res.json({ message: 'Lawyer verification rejected' });
  } catch (error) {
    console.error('Error rejecting lawyer:', error);
    res.status(500).json({ message: 'Failed to reject lawyer' });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await db('users').where({ id }).first();

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.is_admin) {
      return res.status(403).json({ message: 'Cannot delete admin users' });
    }

    await db('users').where({ id }).delete();

    // Log admin activity
    await logActivity(
      req.user.id,
      'DELETE_USER',
      'user',
      id,
      { userName: user.name, userEmail: user.email },
      req.ip
    );

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Failed to delete user' });
  }
};

// Delete lawyer
const deleteLawyer = async (req, res) => {
  try {
    const { id } = req.params;

    const lawyer = await db('lawyers').where({ id }).first();

    if (!lawyer) {
      return res.status(404).json({ message: 'Lawyer not found' });
    }

    await db('lawyers').where({ id }).delete();

    // Log admin activity
    await logActivity(
      req.user.id,
      'DELETE_LAWYER',
      'lawyer',
      id,
      { lawyerName: lawyer.name, lawyerEmail: lawyer.email },
      req.ip
    );

    res.json({ message: 'Lawyer deleted successfully' });
  } catch (error) {
    console.error('Error deleting lawyer:', error);
    res.status(500).json({ message: 'Failed to delete lawyer' });
  }
};

// Get activity logs
const getActivityLogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const [logs, totalCount] = await Promise.all([
      db('activity_logs')
        .leftJoin('users', 'activity_logs.admin_id', 'users.id')
        .select(
          'activity_logs.*',
          'users.name as admin_name',
          'users.email as admin_email'
        )
        .orderBy('activity_logs.created_at', 'desc')
        .limit(limit)
        .offset(offset),
      db('activity_logs').count('id as count').first()
    ]);

    res.json({
      logs: logs.map(log => ({
        ...log,
        details: log.details ? JSON.parse(log.details) : null
      })),
      pagination: {
        total: totalCount.count,
        page,
        limit,
        totalPages: Math.ceil(totalCount.count / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching activity logs:', error);
    res.status(500).json({ message: 'Failed to fetch activity logs' });
  }
};

// Make user admin
const makeUserAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await db('users').where({ id }).first();

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await db('users').where({ id }).update({
      role: 'admin',
      is_admin: true
    });

    // Log admin activity
    await logActivity(
      req.user.id,
      'GRANT_ADMIN',
      'user',
      id,
      { userName: user.name, userEmail: user.email },
      req.ip
    );

    res.json({ message: 'Admin access granted successfully' });
  } catch (error) {
    console.error('Error making user admin:', error);
    res.status(500).json({ message: 'Failed to grant admin access' });
  }
};

// Remove admin access
const removeAdminAccess = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await db('users').where({ id }).first();

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.id === req.user.id) {
      return res.status(403).json({ message: 'Cannot remove your own admin access' });
    }

    await db('users').where({ id }).update({
      role: 'user',
      is_admin: false
    });

    // Log admin activity
    await logActivity(
      req.user.id,
      'REVOKE_ADMIN',
      'user',
      id,
      { userName: user.name, userEmail: user.email },
      req.ip
    );

    res.json({ message: 'Admin access removed successfully' });
  } catch (error) {
    console.error('Error removing admin access:', error);
    res.status(500).json({ message: 'Failed to remove admin access' });
  }
};

module.exports = {
  getDashboardStats,
  getAllUsers,
  getAllLawyers,
  getUnverifiedLawyers,
  verifyLawyer,
  rejectLawyer,
  deleteUser,
  deleteLawyer,
  getActivityLogs,
  makeUserAdmin,
  removeAdminAccess
};
