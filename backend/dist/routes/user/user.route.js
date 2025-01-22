"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../../controllers/user/user.controller");
const router = (0, express_1.Router)();
router.get('/', user_controller_1.getUsers);
router.get('/email/:email', user_controller_1.getUserByEmail);
router.post('/', user_controller_1.createUser);
router.put('/:id', user_controller_1.updateUserProfile);
router.get('/userProfile/:id', user_controller_1.getUserProfile);
router.delete('/:id', user_controller_1.deleteUser);
router.put('/updateRole/:id', user_controller_1.updateUserRole);
router.get('/getUserByRole/:role', user_controller_1.getUsersByRole);
router.put('/updatePassword/:id', user_controller_1.updateUserPassword);
exports.default = router;
