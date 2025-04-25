import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { generateToken } from '../../utils/jwt.utils';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { db } from '../../db/index';
import { internalUsers, InternalUserRole } from '../../db/schema';
import { eq, or } from 'drizzle-orm';

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password, role } = req.body;
    
    // Verify role is valid
    if (role !== 'admin' && role !== 'staff') {
      res.status(400).json({
        success: false,
        message: 'Role không hợp lệ. Role phải là "admin" hoặc "staff"'
      });
      return;
    }
    
    // Check if user already exists using Drizzle
    const existingUsers = await db.select()
      .from(internalUsers)
      .where(or(
        eq(internalUsers.username, username),
        eq(internalUsers.email, email)
      ));
    
    if (existingUsers.length > 0) {
      res.status(400).json({ 
        success: false, 
        message: 'Username hoặc email đã được sử dụng' 
      });
      return;
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create new user using Drizzle
    const [newUser] = await db.insert(internalUsers)
      .values({
        username,
        email,
        password_hash: hashedPassword,
        role: role as InternalUserRole,
        is_active: true
      })
      .returning();
    
    res.status(201).json({
      success: true,
      data: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role
      },
      message: 'Internal user đã được tạo thành công'
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Đã xảy ra lỗi khi tạo internal user' 
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    
    // Find user by username using Drizzle
    const [user] = await db.select()
      .from(internalUsers)
      .where(eq(internalUsers.username, username))
      .limit(1);
    
    if (!user || !user.is_active) {
      res.status(401).json({ 
        success: false, 
        message: 'Thông tin đăng nhập không hợp lệ hoặc tài khoản không hoạt động' 
      });
      return;
    }
    
    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      res.status(401).json({ 
        success: false, 
        message: 'Thông tin đăng nhập không hợp lệ' 
      });
      return;
    }
    
    // Generate token
    const token = generateToken({ 
      userId: user.id, 
      role: user.role 
    });
    
    // Return user data and token
    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        },
        token
      },
      message: 'Đăng nhập thành công'
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Đã xảy ra lỗi khi đăng nhập' 
    });
  }
};

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Không được xác thực'
      });
      return;
    }

    // Get user profile using Drizzle
    const users = await db.select({
      id: internalUsers.id,
      username: internalUsers.username,
      email: internalUsers.email,
      role: internalUsers.role,
      is_active: internalUsers.is_active,
      created_at: internalUsers.created_at
    })
    .from(internalUsers)
    .where(eq(internalUsers.id, req.user.userId));

    if (!users.length) {
      res.status(404).json({
        success: false,
        message: 'Không tìm thấy người dùng'
      });
      return;
    }

    const user = users[0];

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Đã xảy ra lỗi khi lấy thông tin người dùng'
    });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    // Get all users using Drizzle, excluding password hash
    const usersList = await db.select({
      id: internalUsers.id,
      username: internalUsers.username,
      email: internalUsers.email,
      role: internalUsers.role,
      is_active: internalUsers.is_active,
      created_at: internalUsers.created_at
    })
    .from(internalUsers);

    res.status(200).json({
      success: true,
      data: usersList,
      message: 'Lấy danh sách người dùng thành công'
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Đã xảy ra lỗi khi lấy danh sách người dùng'
    });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Get user by id using Drizzle
    const users = await db.select({
      id: internalUsers.id,
      username: internalUsers.username,
      email: internalUsers.email,
      role: internalUsers.role,
      is_active: internalUsers.is_active,
      created_at: internalUsers.created_at
    })
    .from(internalUsers)
    .where(eq(internalUsers.id, parseInt(id, 10)));

    if (!users.length) {
      res.status(404).json({
        success: false,
        message: 'Không tìm thấy người dùng'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: users[0],
      message: 'Lấy thông tin người dùng thành công'
    });
  } catch (error) {
    console.error('Get user by id error:', error);
    res.status(500).json({
      success: false,
      message: 'Đã xảy ra lỗi khi lấy thông tin người dùng'
    });
  }
};

export const updateUser = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = parseInt(id, 10);
    const { email, username, role, is_active } = req.body;
    
    // Kiểm tra quyền - chỉ Admin có thể cập nhật user khác hoặc thay đổi role
    if (req.user?.role !== 'admin' && req.user?.userId !== userId) {
      res.status(403).json({
        success: false,
        message: 'Không có quyền thực hiện hành động này'
      });
      return;
    }

    // Nếu không phải admin thì không được thay đổi role hoặc trạng thái active
    if (req.user?.role !== 'admin' && (role || is_active !== undefined)) {
      res.status(403).json({
        success: false,
        message: 'Chỉ Admin mới có thể thay đổi role hoặc trạng thái người dùng'
      });
      return;
    }

    // Kiểm tra user tồn tại
    const existingUsers = await db.select()
      .from(internalUsers)
      .where(eq(internalUsers.id, userId));

    if (existingUsers.length === 0) {
      res.status(404).json({
        success: false,
        message: 'Không tìm thấy người dùng'
      });
      return;
    }

    // Kiểm tra username hoặc email đã tồn tại cho user khác
    if (username || email) {
      const duplicateUsers = await db.select()
        .from(internalUsers)
        .where(
          or(
            username ? eq(internalUsers.username, username) : undefined,
            email ? eq(internalUsers.email, email) : undefined
          )
        );
      
      // Nếu có user khác đã dùng username/email này
      const duplicateForOtherUser = duplicateUsers.some(user => user.id !== userId);
      if (duplicateForOtherUser) {
        res.status(400).json({
          success: false,
          message: 'Username hoặc email đã được sử dụng bởi người dùng khác'
        });
        return;
      }
    }

    // Chuẩn bị dữ liệu cập nhật
    const updateData: any = {};
    
    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (req.user?.role === 'admin' && role) updateData.role = role;
    if (req.user?.role === 'admin' && is_active !== undefined) updateData.is_active = is_active;

    // Cập nhật user
    const [updatedUser] = await db.update(internalUsers)
      .set(updateData)
      .where(eq(internalUsers.id, userId))
      .returning();

    res.status(200).json({
      success: true,
      data: {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        role: updatedUser.role,
        is_active: updatedUser.is_active
      },
      message: 'Cập nhật người dùng thành công'
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Đã xảy ra lỗi khi cập nhật người dùng'
    });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = parseInt(id, 10);

    // Kiểm tra user tồn tại
    const existingUsers = await db.select()
      .from(internalUsers)
      .where(eq(internalUsers.id, userId));

    if (existingUsers.length === 0) {
      res.status(404).json({
        success: false,
        message: 'Không tìm thấy người dùng'
      });
      return;
    }

    // Xóa user
    await db.delete(internalUsers)
      .where(eq(internalUsers.id, userId));

    res.status(200).json({
      success: true,
      message: 'Xóa người dùng thành công'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Đã xảy ra lỗi khi xóa người dùng'
    });
  }
};

export const changePassword = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Không được xác thực'
      });
      return;
    }

    const { currentPassword, newPassword } = req.body;

    // Kiểm tra user tồn tại
    const users = await db.select()
      .from(internalUsers)
      .where(eq(internalUsers.id, req.user.userId));

    if (users.length === 0) {
      res.status(404).json({
        success: false,
        message: 'Không tìm thấy người dùng'
      });
      return;
    }

    const user = users[0];

    // Kiểm tra mật khẩu hiện tại
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isPasswordValid) {
      res.status(400).json({
        success: false,
        message: 'Mật khẩu hiện tại không đúng'
      });
      return;
    }

    // Hash mật khẩu mới
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Cập nhật mật khẩu
    await db.update(internalUsers)
      .set({ password_hash: hashedPassword })
      .where(eq(internalUsers.id, req.user.userId));

    res.status(200).json({
      success: true,
      message: 'Đổi mật khẩu thành công'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Đã xảy ra lỗi khi đổi mật khẩu'
    });
  }
}; 