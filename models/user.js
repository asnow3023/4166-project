const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const userSchema = new Schema({
    firstName: {type:String, required: [true, 'First name cannot be empty']},
    lastName: {type:String, required: [true, 'Last name cannot be empty']},
    email: {type:String, required: [true, 'Email cannot be left empty'], unique: [true, 'This email address has been used']},
    password: {type:String, required: [true, 'Password cannot be left empty']}
});

//before save method when called
userSchema.pre('save', function(next){
    let user = this;
    if(!user.isModified('password'))
        return next();
    bcrypt.hash(user.password, 10)
    .then(hash => {
        user.password = hash;
        next();
    })
    .catch(err=>next(err));
});

userSchema.methods.comparePassword = function(LoginPassowrd) {
    return bcrypt.compare(LoginPassowrd, this.password);
}

module.exports = mongoose.model('User', userSchema);