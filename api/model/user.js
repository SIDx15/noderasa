const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const orderSchema = new Schema({
    orderID : String,
    name: String,
    date: Date,
    status: Boolean,
    zipCode: Number,
    
    holdType: Number,
    email: String
});

// UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('Order', orderSchema);