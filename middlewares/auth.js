const Item = require('../models/item');

//check if user is a guest
exports.isGuest = (req, res, next)=> {
    if(!req.session.user)
        return next();
    else{
        req.flash('error', 'You are logged in already');
        return res.redirect('/users/profile');
    }
}

//Check if user is authenticated
exports.isLoggedIn = (req, res, next) => {
    if(req.session.user)
        return next();
    else{
        req.flash('error', 'You need to log in first');
        return res.redirect('/users/login');
    }
}

//check if user is seller of the item
exports.isSeller = (req, res, next) => {
    Item.findById(req.params.id)
    .then(item => {
        if(item) {
            if(item.sellerId == req.session.user)
                return next();
            else {
                let err = new Error('Unauthorized to access the resource');
                err.status = 401;
                return next(err);            
            }
        } else {
            let err = new Error('Cannot find a item with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=>next(err));
}

exports.isSellerForOffer = (req, res, next) => {
    Item.findById(req.params.id)
    .then(item => {
        if(item) {
            if(item.sellerId != req.session.user){
                return next();
            }else if (item.sellerId == req.session.user){
                let err = new Error('You cannot make offer to your own item!');
                err.status = 401;
                return next(err);            
            }
        } else {
            let err = new Error('Cannot find a item with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=>next(err));
}