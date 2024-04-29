const model = require('../models/user');
const itemModel = require('../models/item');
const offerModel = require('../models/offer');
const { item } = require('./itemController');

exports.new = (req, res, next) => {
    res.render('../views/user/new', { cssFile: '/styles/user.css' });
}

exports.create = (req, res, next) => {
    let user = new model(req.body);
    console.log(req.body);
    user.save()
    .then(()=>{
        req.flash('success',  'You have successfully signed up!');
        console.log('successfully signed up');
        res.redirect('/users/login');
    })
    .catch(err=> {
        //mongoerror duplicate value error status code
        if(err.code === 11000){
            req.flash('error',  'Email already exists');
            res.redirect('/users/new');
        }
        if(err.name === 'ValidationError') {
            err.status = 400;
            next(err);
        }
    });
}

exports.getLogin = (req, res, next) => {
    res.render('../views/user/login' , { cssFile: '/styles/user.css'});
}

exports.login = (req, res, next) => {
    let email = req.body.email;
    let password = req.body.password;

    model.findOne({email: email})
    .then(user=>{
        if(user){ //if user exists
            user.comparePassword(password)
            .then(result => {
                if(result) { //if password matches
                    req.flash('success',  'You have successfully logged in!');
                    req.session.user = user._id;
                    res.redirect('/users/profile');
                }else{ //hashed password does not match
                    req.flash('error',  'Wrong password');
                    res.redirect('/users/login');
                }
            })
        }else{
            req.flash('error',  'Wrong email');
            res.redirect('/users/login');
        }
    })
    .catch(err=>next(err));
}

exports.profile = (req, res, next) => {
    let userId = req.session.user;

    //find the list of items created by the user
    itemModel.find({sellerId: userId})
    .then(items => {
        //find the list of offers created by the user
        offerModel.find({userId: userId})
        .then(offers => {

            const promises = [];

            offers.forEach((offer) => {
                const promise = itemModel.findById(offer.itemId)
                .then((foundItem) => {
                    offer.title = foundItem.title;
                })
                .catch((err) => {
                    next(err);
                });

                //push to promises
                promises.push(promise);
            });

            //wait on promises
            Promise.all(promises)
                .then(() => {
                    //sends the list of items and offers to a newly rendered profile page
                    res.render('../views/user/profile', { cssFile: '/styles/profile.css', items, offers}); 
                })
                .catch(err=>next(err))
        })
        .catch((err) => {
            next(err);
        });
    })
    .catch((err) => {
        next(err);
    });
}

exports.logout = (req, res, next)=>{
    req.session.destroy(err=>{
        if(err) {
           return next(err);
        } else{
            res.redirect('/');  
    }});
   
 };