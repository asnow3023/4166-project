const model = require('../models/item');

//handles two types of requests: to items page OR with a search parameter(query)
exports.handleReq = (req, res, next) => {
    const searchInput = req.query.search;

    let items;
    if(searchInput){ // if search input exists
        const results = model.searchByInput(searchInput);

            // whether results exist or does not exist, items would be passed and will be checked with its length in view ejs 
            items = results;
            items.sort((a,b) => a.price - b.price);
            res.render('view/items', {cssFile: '/styles/items.css', items});

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
    let item = model.findById(id);
    if(item){
        res.render('view/item', { cssFile: '/styles/item.css', item });
    }else{
        let err = new Error('Cannot find item with id ' + id);
        err.status = 404;
        next(err);
    }
};

//render new listing page
exports.new = (req, res) => {
    res.render('view/new', { cssFile: '/styles/new.css' });
};

//initiate delete function
exports.delete = (req, res, next) => {
    let id = req.params.id;
    if(model.deleteById(id)){
        res.redirect('./');
    }else{
        let err = new Error('Cannot find the item with id ' + id);
        err.status;
        next(err);
    }
};

//create and store new listing
exports.create = (req,res) => {
    let item = req.body;
    item.image = '../images/' + req.file.filename;
    item.totalOffers = 0;
    model.save(item);
    res.redirect('./items');
};

//renders edit page by the item found by id
exports.edit = (req, res, next) => {
    let id = req.params.id;
    let item = model.findById(id);
    if(item){
        res.render('view/edit', {cssFile: '/styles/edit.css', item});
    } else{
        let err = new Error('Cannot find item with id ' + id);
        err.status = 404;
        next(err);
    }
};

//update the edited listing
exports.update = (req, res, next) => {
    let item = req.body;
    let id = req.params.id;
    //if user uploaded a image instead of leaving it blank
    if(req.file != undefined){
        item.image = '../images/' + req.file.filename;
    }else{
        item.image = null;
    }

    if (model.updateById(id, item)){
        res.redirect('./'+ id);
    }else{
        let err = new Error('Cannot find item with id ' + id);
        err.status = 404;
        next(err);
    }
};
