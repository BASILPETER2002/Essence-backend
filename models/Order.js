const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false // Can be guest initially
    },
    customerDetails: { // For guest checkout or extra info
        name: String,
        phone: String,
        address: String
    },
    orderItems: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        name: String,
        quantity: {
            type: Number,
            required: true
        },
        price: {
            type: Number,
            required: true
        }
    }],
    totalPrice: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Packed', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Pending'
    },
    paymentMethod: {
        type: String,
        enum: ['COD', 'WhatsApp', 'Online'],
        default: 'WhatsApp'
    },
    isPaid: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
