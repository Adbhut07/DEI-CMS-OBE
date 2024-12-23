import { Router } from 'express';
import { createUser, deleteUser, getUserByEmail, getUserProfile, getUsers, updateUserProfile } from '../../controllers/user/user.controller';

const router = Router();

router.get('/', getUsers);
router.get('/email/:email', getUserByEmail);
router.post('/', createUser);
router.put('/:id', updateUserProfile);
router.get('/userProfile/:id', getUserProfile)
router.delete('/:id', deleteUser);

export default router;
