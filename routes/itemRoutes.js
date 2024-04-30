const express = require('express');
const controller = require('../controllers/itemController');
const offerRoutes = require('./offerRoutes');
const {upload} = require('../middlewares/multer')
const {validateId, validateItem, validateResults} = require('../middlewares/validator');
const {isLoggedIn, isSeller} = require('../middlewares/auth');

const router = express.Router({mergeParams: true});

//route for GET: handling landing page and search request
router.get('/', controller.handleReq);

//route for GET: the new page
router.get('/new', isLoggedIn, controller.new);

//route for POST: newly created listing
router.post('/', upload, isLoggedIn, validateItem, validateResults, controller.create);

//route for GET: item selected
router.get('/:id', validateId, controller.item);

//route for GET: selected item edit page
router.get('/:id/edit', validateId, isSeller, controller.edit);

//route for PUT: edited item update
router.put('/:id', upload, isLoggedIn, validateId, validateItem, validateResults, isSeller, controller.update);

//route for DELETE: deleting selected item
router.delete('/:id', isLoggedIn, validateId, isSeller, controller.delete);

//nested-router for offerRoutes
router.use('/:id/offers', offerRoutes);

module.exports = router;