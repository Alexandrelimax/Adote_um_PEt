const PetController = require('../controllers/PetController');

const router = require('express').Router();
const verifyToken = require('../helpers/verifyToken')
const { imageUpload } = require('../helpers/imageUpload')


router.post('/create', verifyToken, imageUpload.array('images'), PetController.create)
router.get('/', verifyToken, PetController.getAll)
router.get('/mypets', verifyToken, PetController.getAllUserPets)
router.get('/myadoptions', verifyToken, PetController.getAllUserAdoptions)
router.get('/:id', PetController.getPetById)
router.delete('/:id', verifyToken, PetController.removePetById)
router.patch('/:id', verifyToken, imageUpload.array('images'), PetController.updatePetById)
router.patch('/schedule/:id', verifyToken, PetController.schedule)
router.patch('/conclude/:id', verifyToken, PetController.concludeAdoption)


module.exports = router;