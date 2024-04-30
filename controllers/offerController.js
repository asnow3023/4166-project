const ObjectID = require('mongodb');
const model = require('../models/offer');
const itemModel = require('../models/item');
const userModel = require('../models/user');
const offer = require('../models/offer');
const item = require('../models/item');

//post new offers and update item offer quantity
exports.new = (req, res, next) => {
    let offer = new model(req.body);
    let itemId = req.params.id;

    //update offer model with user and item id, user's name and item's title
    offer.userId = req.session.user;
    offer.itemId = req.params.id;
    
    itemModel.findById(itemId)
    .then((item) => {
        if(item){
            //update item document
            return itemModel.updateOne(
                {_id: itemId},
                {
                    $max: {highestOffer: offer.amount},
                    $inc: {totalOffers: 1}
                }
            )
        }
        else{
            let err = new Error('Item not Found!');
            err.status = 404;
            next(err);
        }
    })
    .then((updatedResult) => {
        //save offer as a document after update is successfully implemented
        if(updatedResult.modifiedCount > 0) {
            return offer.save();
        } else{
            next(err);  
        }
    })
    .then(() => {
        //redirect to the item details view
        req.flash('success',  'Offer posted successfully');
        res.redirect('/items/' + itemId);
    })
    .catch((err) => {
        if(err.name === 'ValidationError') {
            err.status = 400;
            req.flash('error',  'Error posting offer to the item');
        }
        next(err);
    })
}


//view all offers for the item
exports.view = (req, res, next) => {
    let itemId = req.params.id

    itemModel.findById(itemId)
    .then((item) => {
        if(item){
            model.find({itemId:itemId})
            .then((offers) => {

            const promises = [];

            //find all user names for each offer placed on one item
            offers.forEach((offer) => {
                const promise = userModel.findById(offer.userId)
                .then((foundUser) => {
                    offer.username = String(foundUser.firstName + " " +  foundUser.lastName);
                })
                .catch((err) => {
                    console.log(err.name);
                    next(err);
                });

                //push to promises
                promises.push(promise);
            });
            Promise.all(promises)
                    .then(() => {
                        //sends the list of items and offers to a newly rendered profile page
                        res.render('../views/offers/offer', { cssFile: '/styles/offer.css', item, offers}); 
                    })
                    .catch(err=>next(err))
            })      
        }
    })
    .catch((err)=>{
        console.log(err.name);
        next(err)
    })
    
}

//accept offer
exports.accept = (req, res, next) => {
    let itemId = req.params.id;
    let offerId = req.params.offerId;

    item.findByIdAndUpdate(itemId,{active:false})
    .then(async (item) => {
        if(item){
            try{
                const offers = await model.find({ itemId: itemId }); // find all offers for the itemId

                offers.forEach(async (offer) => {
                    if(offer.id === offerId){
                        await model.findByIdAndUpdate(offer.id, { status: 'accepted' });
                    } else {
                        await model.findByIdAndUpdate(offer.id, { status: 'rejected' });
                    }
                })

                // Redirect to offers view
                req.flash('success', 'Offer accepted successfully');
                res.redirect('/items/' + itemId + '/offers');

            }catch(err){
                next(err)
            }
        } else {
            const err = new Error('Cannot find item with id ' + id);
            err.status = 404;
            req.flash('error', 'Error editing the item');
            next(err);
        }
    })
    .catch(err=>next(err));



    // .then((item) => {
    //     if (item){
    //         model.find({itemId:itemId}) // find all offers for the itemId
    //         .then((offers) => {
    //             offers.forEach((offer) => {
    //                 if(offer.id == offerId){ //if current offer id is equal to selected offerId
    //                     //update the status of the offer from pending to accepted
    //                     model.findByIdAndUpdate(offer.id, {status:'accepted'})
    //                 } else {
    //                     //update the status of the rest of the offers on this item from pending to rejected
    //                     model.findByIdAndUpdate(offer.id, {status:'rejected'})
    //                 }
    //             })

    //             //redirect to offers view
    //             req.flash('success',  'Offer accepted successfully');
    //             res.redirect('/items/'+ itemId + '/offers');
    //         })
    //     }else{
    //         let err = new Error('Cannot find item with id ' + id);
    //         err.status = 404;
    //         req.flash('error',  'Error editing the item');
    //         next(err);
    //     }
    // })
    // .catch(err=>next(err));
}