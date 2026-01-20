const Razorpay = require('razorpay');

let razorpay;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_SECRET) {
    razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_SECRET
    });
} else {
    console.warn("⚠️ Razorpay keys not found. Payment integration will be disabled.");
}

// @desc    Create Razorpay Order
// @route   POST /api/payments/create
// @access  Private
const createPaymentOrder = async (req, res) => {
    const { amount } = req.body;

    if (!razorpay) {
        return res.status(503).json({ message: "Payment service is currently unavailable (Missing Configuration)" });
    }

    try {
        const options = {
            amount: amount * 100, // Amount in paise
            currency: 'INR',
            receipt: `rcpt_${Date.now()}`
        };

        const order = await razorpay.orders.create(options);
        res.json(order);
    } catch (error) {
        console.error('Razorpay Error:', error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createPaymentOrder };
