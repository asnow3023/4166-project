const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itemSchema = new Schema({
    title: {type: String, required: true},
    seller: {type: String, required: true},
    condition: {type: String, required: true, enum: ['New', 'Like New', 'Good Condition', 'Aged Vintage/Antique', 'Needs Repair/Refurbishment']},
    price: {type: Number, required: true, min: 0.01},
    details: {type: String, required: true},
    image: {type: String, required: true},
    totalOffers: {type: Number, default: 0},
    isActive: {type: Boolean, default: true}
});

module.exports = mongoose.model('Items', itemSchema);