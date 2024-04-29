const express = require('express');
const controller = require('../controllers/itemController');
const {validateId} = require('../middlewares/validator');
const {isLoggedIn, isSeller} = require('../middlewares/auth');


const multer  = require('multer');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

const router = express.Router();

//route for GET: handling landing page and search request
router.get('/', controller.handleReq);

//route for GET: the new page
router.get('/new', isLoggedIn, controller.new);

//route for POST: newly created listing
router.post('/', upload.single('image'), isLoggedIn, controller.create);

//route for GET: item selected
router.get('/:id', validateId, controller.item);

//route for GET: selected item edit page
router.get('/:id/edit', validateId, isSeller, controller.edit);

//route for PUT: edited item update
router.put('/:id', upload.single('image'), isLoggedIn, validateId, isSeller, controller.update);

//route for DELETE: deleting selected item
router.delete('/:id', isLoggedIn, validateId, isSeller, controller.delete);


module.exports = router;