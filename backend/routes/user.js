const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');


router.post('/', userController.createUser);
router.post('/signin', userController.signIn);
router.get('/users', userController.getUsers);
router.put('/:id', userController.updateUser);
router.put('/:id/modules', userController.updateUserModules);
router.put('/:id/resetPassword', userController.resetPassword);
router.delete('/:id', userController.deleteUser);
router.post('/multiple', userController.addMultipleUsers);

module.exports = router;
