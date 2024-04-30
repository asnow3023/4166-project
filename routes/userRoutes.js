const express = require('express');
const controller = require('../controllers/userController');
const {isGuest, isLoggedIn} = require('../middlewares/auth');
const {validateSignUp, validateLogIn, validateResults} = require('../middlewares/validator')

const router = express.Router();

//route for GET: the new user signup page
router.get('/new', isGuest, controller.new);

//route for POST: newly created user
router.post('/', isGuest, validateSignUp, validateResults, controller.create);

//route for GET: the login page
router.get('/login', isGuest, controller.getLogin);

//route for POST: login authentication
router.post('/login' , isGuest, validateLogIn, validateResults, controller.login);

//route for GET: the user profile page
router.get('/profile', isLoggedIn, controller.profile);

//route for GET: logout page
router.get('/logout', isLoggedIn, controller.logout);

module.exports = router;