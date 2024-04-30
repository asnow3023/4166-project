const {body} = require('express-validator');
const {validationResult} = require('express-validator');
const {imageValidator} = require('./multer');

//validates if ObjectId is in valid form
exports.validateId = (req, res, next) => {
    let id = req.params.id;

    if(!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Invalid Item id');
        err.status = 400;
        return next(err);
    } else {
        return next();
    }
}

exports.validateSignUp = [body('firstName', 'First name cannot be empty').notEmpty().trim().escape(), 
body('lastName', 'Last name cannot be empty').notEmpty().trim().escape(), 
body('email', 'Email must be a valid address').isEmail().trim().escape().normalizeEmail(), 
body('password', 'Password must be at least 8 characters and at most 64 characters').trim().isLength({min: 8, max: 64})];

exports.validateLogIn = [body('email', 'Email must be a valid address').isEmail().trim().escape().normalizeEmail(), 
body('password', 'Password must be at least 8 characters and at most 64 characters').trim().isLength({min: 8, max: 64})];

exports.validateItem = [body('title', 'Title field cannot be empty').notEmpty().trim().escape(),
body('condition', 'You must select the item condition from the list').isIn('New', 'Like New', 'Good Condition', 'Aged Vintage/Antique', 'Needs Repair/Refurbishment'),
body('price', 'Price must be a number greater than 0').trim().isFloat({gt:0}),
body('details', 'Item details cannot be empty').notEmpty().trim().escape(),
body('image').custom(imageValidator)] //cannot check for req.file using default express-validator. proceeded with customer validtor that checks !req.file and filename === 'image'

exports.validateOffer = [body('amount', 'offer must be a number greater than 0').trim().isFloat({gt:0})]

exports.validateResults = (req, res, next) => {
    let errors = validationResult(req);
    if(!errors.isEmpty()){
        errors.array().forEach(error => {
            req.flash('error', error.msg);
        });
        return res.redirect('back');
    } else{
        return next();
    }
}

exports.validateStory = [body('title', 'Title cannot be empty!').notEmpty().trim().escape(), 
body('content', 'Content cannot be less than 10 characters').isLength({min:10}).trim().escape()]