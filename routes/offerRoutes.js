const express = require('express');
const controller = require('../controllers/offerController');
const {validateId, validateOffer, validateResults} = require('../middlewares/validator');
const {isLoggedIn, isSeller, isSellerOfOffer} = require('../middlewares/auth');

const router = express.Router({mergeParams: true});

//route for POST: posting a new offer
router.post('/', isLoggedIn, validateOffer, validateResults, isSellerOfOffer, controller.new);

//route for GET: viewing all offers
router.get('/', isLoggedIn, isSeller, controller.view);

//route for POST: updating upon accept offer
router.post('/:offerId/accept', isLoggedIn, validateId, isSeller, controller.accept);

module.exports = router;