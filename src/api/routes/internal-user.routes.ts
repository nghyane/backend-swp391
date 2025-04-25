import { Router } from 'express';
import * as InternalUserController from '../controllers/internal-user.controller';
import { authenticateUser, authorizeRoles } from '../../middlewares/auth.middleware';

const router = Router();

// Public routes - không cần xác thực
router.post('/login', InternalUserController.login);

// Protected routes - cần xác thực JWT
router.get('/profile', authenticateUser, InternalUserController.getProfile);
router.put('/change-password', authenticateUser, InternalUserController.changePassword);

// Admin only routes - cần xác thực JWT và phải có role admin
router.post('/register', authenticateUser, authorizeRoles('admin'), InternalUserController.register);
router.get('/', authenticateUser, authorizeRoles('admin'), InternalUserController.getAllUsers);
router.get('/:id', authenticateUser, authorizeRoles('admin'), InternalUserController.getUserById);
router.put('/:id', authenticateUser, InternalUserController.updateUser);
router.delete('/:id', authenticateUser, authorizeRoles('admin'), InternalUserController.deleteUser);

export default router; 