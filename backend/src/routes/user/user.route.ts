import { Router } from 'express';
import { createUser, deleteUser, getUserByEmail, getUserProfile, getUsers, getUsersByRole, updateUser, updateUserPassword, updateUserProfile, updateUserRole } from '../../controllers/user/user.controller';

const router = Router();

router.get('/', getUsers);
router.get('/email/:email', getUserByEmail);
router.post('/', createUser);
router.put('/:id', updateUserProfile);
router.get('/userProfile/:id', getUserProfile)
router.delete('/:id', deleteUser);
router.put('/updateRole/:id', updateUserRole);
router.get('/getUserByRole/:role', getUsersByRole);
router.put('/updatePassword/:id', updateUserPassword);
router.put('/updateUser/:id', updateUser);

export default router;
