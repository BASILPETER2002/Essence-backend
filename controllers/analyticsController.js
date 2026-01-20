const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Get admin analytics data
// @route   GET /api/analytics
// @access  Private/Admin
const getAnalytics = async (req, res) => {
    try {
        // 1. Total Orders
        const totalOrders = await Order.countDocuments();

        // 2. Total Revenue (exclude cancelled orders)
        const totalRevenueAgg = await Order.aggregate([
            { $match: { status: { $ne: 'Cancelled' } } },
            { $group: { _id: null, total: { $sum: '$totalPrice' } } }
        ]);
        const totalRevenue = totalRevenueAgg[0]?.total || 0;

        // 3. Orders Today
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const ordersToday = await Order.countDocuments({
            createdAt: { $gte: startOfDay }
        });

        // 4. Low Stock Products (<= 5 items)
        const lowStockProducts = await Product.find({ stock: { $lte: 5 } })
            .select('name stock category image');

        // 5. Top Selling Products
        const topProducts = await Order.aggregate([
            { $unwind: '$orderItems' }, // Deconstruct order items array
            {
                $group: {
                    _id: '$orderItems.product', // Group by product ID
                    name: { $first: '$orderItems.name' }, // Get product name
                    totalSold: { $sum: '$orderItems.quantity' } // Sum quantities
                    // Note: 'qty' vs 'quantity' depends on your Order model schema. 
                    // We normalized to 'quantity' in previous steps.
                }
            },
            { $sort: { totalSold: -1 } }, // Sort descending
            { $limit: 5 } // Top 5
        ]);

        res.json({
            totalOrders,
            totalRevenue,
            ordersToday,
            lowStockProducts,
            topProducts
        });
    } catch (error) {
        console.error('Analytics Error:', error);
        res.status(500).json({ message: 'Failed to fetch analytics data' });
    }
};

module.exports = { getAnalytics };
