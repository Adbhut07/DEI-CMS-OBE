import { Router } from 'express';
import { createUser, deleteUser, getUserByEmail, getUserProfile, getUsers, getUsersByRole, updateUserProfile, updateUserRole } from '../../controllers/user/user.controller';

const router = Router();

router.get('/', getUsers);
router.get('/email/:email', getUserByEmail);
router.post('/', createUser);
router.put('/:id', updateUserProfile);
router.get('/userProfile/:id', getUserProfile)
router.delete('/:id', deleteUser);
router.put('/updateRole/:id', updateUserRole);
router.get('/getUserByRole', getUsersByRole);

export default router;
