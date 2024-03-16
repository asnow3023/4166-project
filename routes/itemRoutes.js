const express = require('express');
const controller = require('../controllers/itemController');

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
router.get('/new', controller.new);

//route for POST: newly created listing
router.post('/', upload.single('image'), controller.create);

//route for GET: item selected
router.get('/:id', controller.item);

//route for GET: selected item edit page
router.get('/:id/edit', controller.edit);

//route for PUT: edited item update
router.put('/:id', upload.single('image'), controller.update);

//route for DELETE: deleting selected item
router.delete('/:id', controller.delete);


module.exports = router;