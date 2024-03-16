const {v4: uuidv4} = require('uuid');

const items = [
{
    id: 'f7d6b959-ee86-4b4b-9aa0-fd7ffd417ca1',
    title: 'ASHELY LINEN COMFY SOFA BED 84 INCHES CHARCOAL GRAY',
    seller: 'Logan Holmes',
    condition: 'Like New',
    price: 999.99,
    details: 'Length: 84 inches, Depth: 36 inches, Height: 30 inches, Frame Material: Solid hardwood, Fabric: Linen blend, Color: Charcoal Gray, Type: High-density foam, Removable and reversible.',
    image: '../images/furniture_sample.jpg',
    totalOffers: 1,
    active: true
},
{
    id: '799dc341-068d-4e86-a09a-e8957d8bb6f3',
    title: 'ELEGANT LEATHER SECTIONAL SOFA',
    seller: 'Sophia Rodriguez',
    condition: 'New',
    price: 1499.99,
    details: 'Length: 120 inches, Depth: 90 inches, Height: 35 inches, Material: Genuine leather, Color: Espresso Brown, Configuration: L-shaped, Features: Adjustable headrests, Chrome legs.',
    image: '../images/leather_sectional.jpg',
    totalOffers: 3,
    active: true
},
{
    id: '42b7a903-ac92-404a-8350-d955458711ea',
    title: 'MODERN GLASS DINING TABLE SET',
    seller: 'Cameron Johnson',
    condition: 'Good Condition',
    price: 699.99,
    details: 'Table Dimensions: 60 inches x 36 inches, Chair Dimensions: 18 inches x 20 inches x 40 inches, Material: Tempered glass, Metal frame, Color: Clear glass, Features: Stylish design, Seats 4.',
    image: '../images/dining_table_set.jpg',
    totalOffers: 5,
    active: true
},
{
    id: '99f30e74-cc7d-4957-a2c0-a4c7ba42a32a',
    title: 'VINTAGE OAK BOOKSHELF',
    seller: 'Olivia Thompson',
    condition: 'Good Condition',
    price: 299.99,
    details: 'Dimensions: 72 inches x 36 inches x 12 inches, Material: Solid oak, Finish: Vintage distressed, Features: Adjustable shelves, Sturdy construction.',
    image: '../images/bookshelf_oak.jpg',
    totalOffers: 2,
    active: true
},
{
    id: '83035477-3857-4b51-9468-c443d62cee97',
    title: 'COMFORTABLE KING-SIZE BED',
    seller: 'Ethan Wright',
    condition: 'Like New',
    price: 899.99,
    details: 'Dimensions: 80 inches x 76 inches, Material: Upholstered fabric, Color: Beige, Mattress Type: Memory foam, Features: Padded headboard, Wooden legs.',
    image: '../images/king_size_bed.jpg',
    totalOffers: 4,
    active: true
},
{
    id: '467ed481-ca06-4b5b-ae54-b30809fb9a14',
    title: 'COZY SWIVEL RECLINER CHAIR',
    seller: 'Ava Garcia',
    condition: 'Aged Vintage/Antique',
    price: 349.99,
    details: 'Dimensions: 32 inches x 30 inches x 40 inches, Material: Microfiber upholstery, Color: Gray, Features: Swivel and reclining mechanism, Padded armrests.',
    image: '../images/recliner_chair.jpg',
    totalOffers: 1,
    active: true
}
];

exports.find = function(){
    return items;
}

exports.findById = (id) => {
    return items.find(item => item.id === id);
}

exports.deleteById = (id) => {
    let index = items.findIndex(item => item.id === id);
    if(index !== -1){
        items.splice(index, 1);
        return true;
    }else{
        return false;
    }
}

exports.save = (item) => {
    item.id = uuidv4();
    items.push(item);
}

exports.updateById = (id, newItem) => {
    let item = items.find(item => item.id === id);
    console.log(item.price);
    console.log(newItem.price);
    if(item){
        item.condition = newItem.condition;
        item.title = newItem.title;
        item.price = Number(newItem.price);
        item.details = newItem.details;
        console.log(item.price);

        if(newItem.image){
            item.image = newItem.image;
        }
        
        return true;
    } else{ return false }
}

exports.searchByInput = (input) => {
    let result = items.filter(item => //each item of the items data array - filters and only returns items with matching conditions
        Object.values(item).some(value => //each values of the item object
            value
            .toString() //.toString to accomplish datatype comparison
            .toLowerCase() //.toLowercase for case insensitivity
            .includes(input.toLowerCase()))); 
    console.log(result);
    return result;
}