const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itemSchema = new Schema({
    title: {type: String, required: [true, 'Title field cannot be empty']},
    seller: {type: String, required: [true, 'Seller field cannot be empty']},
    condition: {type: String, required: [true, 'You must select the item condition'], 
                enum: ['New', 'Like New', 'Good Condition', 'Aged Vintage/Antique', 'Needs Repair/Refurbishment']},
    price: {type: Number, required: [true, 'Price cannot be empty'], min: [0.01, 'Price must be greater than 0.01']},
    details: {type: String, required: [true, 'Item details cannot be empty']},
    image: {type: String, required: [true, 'You must upload an image']},
    totalOffers: {type: Number, default: 0},
    active: {type: Boolean, default: true}
});

module.exports = mongoose.model('Items', itemSchema);