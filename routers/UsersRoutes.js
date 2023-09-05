const router = require('express').Router();
const UsersControlller = require('../controllers/UserController');
const verifyToken = require('../helpers/verifyToken');
const { imageUpload } = require('../helpers/imageUpload');

router.post('/register', UsersControlller.register)
router.post('/login', UsersControlller.login)
router.get('/checkuser', UsersControlller.checkUser)
router.get('/:id', UsersControlller.getUserbyId)
router.patch('/:id', verifyToken, imageUpload.single('image'),UsersControlller.editUser)






module.exports = router;