const express = require('express');
const controller = require('../controllers/offerController');
const {validateId} = require('../middlewares/validator');
const {isLoggedIn, isSeller, isSellerOfOffer} = require('../middlewares/auth');

const router = express.Router({mergeParams: true});

//route for POST: posting a new offer
router.post('/', isLoggedIn, isSellerOfOffer, controller.new);

//route for GET: viewing all ofers
router.get('/', isLoggedIn, isSeller, controller.view);

//route for POST: updating upon accept offer
router.post('/accept', controller.accept);

module.exports = router;