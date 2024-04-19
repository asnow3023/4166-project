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