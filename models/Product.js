const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        enum: ['Honey', 'Spices', 'Instant Mushrooms', 'Other']
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    weight: {
        type: String, // e.g., "500g", "1kg"
        required: true
    },
    stock: {
        type: Number,
        required: true,
        default: 0
    },
    images: [{
        type: String // URL paths
    }],
    status: {
        type: String,
        enum: ['Available', 'Out of Stock', 'Hidden'],
        default: 'Available'
    },
    isInstant: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

// Pre-save hook to auto-update status based on stock
// Pre-save hook to auto-update status based on stock
productSchema.pre('save', function (next) {
    if (this.stock <= 0) {
        this.status = 'Out of Stock';
    } else if (this.status === 'Out of Stock' && this.stock > 0) {
        this.status = 'Available';
    }
    next();
});

module.exports = mongoose.model('Product', productSchema);
