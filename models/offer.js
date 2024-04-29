const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const offerSchema =  new Schema({
    userId: {type: String, required: true},
    itemId: {type: String, required: true},
    amount: {type: Number, required: true, min: [0.01, 'Price must be greater than or equal to 0.01']},
    status: {type: String, enum: ['pending', 'rejected', 'accepted'], default: 'pending'}
});

module.exports = mongoose.model('Offers', offerSchema);
