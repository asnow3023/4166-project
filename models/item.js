const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itemSchema = new Schema({
    title: {type: String, required: [true, 'title is required']},
    sellerId: {type: String, required: true},
    seller: {type: String, required: true},
    condition: {type: String, required: [true, 'You must select the item condition'], 
                enum: ['New', 'Like New', 'Good Condition', 'Aged Vintage/Antique', 'Needs Repair/Refurbishment']},
    price: {type: Number, required: [true, 'price is required'], min: [0.01, 'Price must be greater than 0.01']},
    details: {type: String, required: [true, 'details are required']},
    image: {type: String, required: [true, 'You must upload an image']},
    totalOffers: {type: Number, default: 0},
    highestOffer: {type: Number, default: 0},
    active: {type: Boolean, default: true}
});

module.exports = mongoose.model('Items', itemSchema);