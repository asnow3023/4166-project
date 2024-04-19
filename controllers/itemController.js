const model = require('../models/item');
const userModel = require('../models/user');

//handles two types of requests: to items page OR with a search parameter(query)
exports.handleReq = (req, res, next) => {
    const searchInput = req.query.search;

    let items;
    if(searchInput){ // if search input exists

        // create regex term  with case insensitive option
        const regexTerm = new RegExp(searchInput, "i");
        
        // filter all items that fields contain the regexTerm
        const filter = {
            $and : [
                {active: true}    
            ,{
                $or: [
                    { title: {$regex: regexTerm} },
                    { seller: {$regex: regexTerm} },
                    { condition: {$regex: regexTerm} },
                    { details: {$regex: regexTerm} },
                ]}
            ]
        }

        // whether results exist or does not exist, items would be passed and will be checked with its length in view ejs 
        model.find(filter)
        .then(items => {
            items.sort((a,b) => a.price - b.price);
            res.render('view/items', {cssFile: '/styles/items.css', items});
        })
        .catch(err => next(err));

    } else if(!searchInput){ // no search input - items
        items = model.find()
        .then(items => {
            items.sort((a,b) => a.price - b.price);
            res.render('view/items', {cssFile: '/styles/items.css', items});
        })
        .catch(err=> next(err));
    }
}

//item details
exports.item = (req, res, next) => {
    let id = req.params.id;

    model.findById(id)
    .then(item =>{
        if(item){
            res.render('view/item', { cssFile: '/styles/item.css', item });

        }else{
            let err = new Error('Cannot find item with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=>next(err));
};

//render new listing page
exports.new = (req, res) => {
    res.render('view/new', { cssFile: '/styles/new.css' });
};

//initiate delete function
exports.delete = (req, res, next) => {
    let id = req.params.id;

    model.findByIdAndDelete(id, {useFindAndModify: false, runValidators: true})
    .then(item => {
        if(item){
            req.flash('success',  'Item deleted successfully');
            res.redirect('/items');
        }else{
            let err = new Error('Cannot find a story with id ' + id);
            err.status = 404;
            req.flash('error',  'Error deleting the item');
            next(err);
        }
    })
};

//create and store new listing
exports.create = (req,res,next) => {
    let item = new model(req.body);
    item.sellerId = req.session.user;

    userModel.findById(item.sellerId)
    .then((user) => {
        console.log(user);
        if(user){
            let fullName = user.firstName + " " + user.lastName;
            item.seller = fullName;
            item.image = '../images/' + req.file.filename;

            return item.save();
        } else {
            let err = new Error('User not Found!');
            err.status = 404;
            next(err);
        }
    })
    .then(() => {
        req.flash('success',  'Item added to the list successfully');
        res.redirect('./items');
    })
    .catch(err=> {
        if(err.name === 'ValidationError') {
            err.status = 400;
            req.flash('error',  'Error adding the item to the list');
        }
        next(err);
    });
};

//renders edit page by the item found by id
exports.edit = (req, res, next) => {
    let id = req.params.id;
    
    model.findById(id)
    .then(item => {
        if(item){
            res.render('view/edit', {cssFile: '/styles/edit.css', item});
        } else{
            let err = new Error('Cannot find item with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=>next(err));
};

//update the edited listing
exports.update = (req, res, next) => {
    let item = req.body;
    let id = req.params.id;
    
    //if user uploaded a image instead of leaving it blank
    if(req.file != undefined){
        item.image = '../images/' + req.file.filename;
    }

    model.findByIdAndUpdate(id, item, {useFindAndModify: false, runValidators:true})
    .then(item => {
        if (item){
            req.flash('success',  'Successfully edited the item!');
            res.redirect('./'+ id);
        }else{
            let err = new Error('Cannot find item with id ' + id);
            err.status = 404;
            req.flash('error',  'Error editing the item');
            next(err);
        }
    })
    .catch(err=> {
        if(err.name === 'ValidationError') {
            err.status = 400;
            req.flash('error',  'Error editing the item');
        }
        next(err);
    });
};
