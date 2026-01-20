const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Product = require('./models/Product');

dotenv.config();

const seedData = async () => {
    try {
        const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/essence';
        await mongoose.connect(uri);
        console.log('MongoDB Connected');

        // Seed Admin
        const adminExists = await User.findOne({ email: 'admin@essence.com' });
        if (!adminExists) {
            await User.create({
                name: 'Admin User',
                email: 'admin@essence.com',
                password: 'admin123',
                role: 'admin'
            });
            console.log('Admin user created');
        } else {
            console.log('Admin user already exists');
        }

        // Seed Products
        await Product.deleteMany({}); // Clear existing products
        console.log('Old products removed');

        const products = [
            {
                name: 'Wild Forest Honey',
                category: 'Honey',
                price: 550,
                description: 'Raw, unfiltered honey collected from deep forests of Wayanad. This honey is rich in antioxidants and enzymes.',
                stock: 15,
                weight: '500g',
                images: ['/assets/products/honey.jpg'],
                isInstant: false
            },
            {
                name: 'Premium Cardamom',
                category: 'Spices',
                price: 850,
                description: 'Handpicked green cardamom pods with intense aroma.',
                stock: 10,
                weight: '250g',
                images: ['/assets/products/cardamom.jpg'],
                isInstant: false
            },
            {
                name: 'Black Pepper',
                category: 'Spices',
                price: 400,
                description: 'Export quality black pepper corns from Kerala. Known for their strong aroma and perfect spiciness.',
                stock: 25,
                weight: '250g',
                images: ['/assets/products/pepper.jpg'],
                isInstant: false
            }
        ];

        await Product.insertMany(products);
        console.log('Products Seeded Successfully');

        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

seedData();
