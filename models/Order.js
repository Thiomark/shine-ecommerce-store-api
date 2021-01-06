const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({

    firstName: {
        type: String,
        required: [true, 'Please add a first name'],
    },
    lastName: {
        type: String,
        required: [true, 'Please add a last name'],
    },
    address: {
        type: String,
        required: [true, 'Please add the adress'],
    },
    houseNumber: {
        type: String,
    },
    town: {
        type: String,
        required: [true, 'Please add the town'],
    },
    province: {
        type: String,
        required: [true, 'Please add the provice'],
    },
    phoneNumber: {
        type: String,
        required: [true, 'Please add the phone number']
    },
    zipcode: {
        type: String,
        required: [true, 'Please add a zip code'],
    },
    notes: {
        type: String,
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
    },
    item: {
        type: [Object],
        required: [true, 'Please add items'],
    },
    shipping: {
        type: String,
        required: [true, 'Please add the shiping'],
    },
    toatlAmount: {
        type: Number,
        required: [true, 'Please add the total amount'],
    },
    orderNumber: {
        type: Number,
    },
    estimatedDelivery: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
  },
);

//Create product slug from the name

OrderSchema.pre('save', function(next) {
    const timestamp = new Date().valueOf().toString();
    const start = (timestamp.length - 7)
    const dt = new Date();
    const estimatedDelivery = dt.setDate(dt.getDate() + 7)
    this.estimatedDelivery = new Date(estimatedDelivery)
    this.orderNumber = timestamp.substring(start, timestamp.length)
    next();
});

module.exports = mongoose.model('Order', OrderSchema);
