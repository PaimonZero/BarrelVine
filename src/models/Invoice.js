const mongoose = require('mongoose');

// Declare the Schema of the Mongo model
var invoiceSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        products: [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product',
                },
                quantity: { type: Number, required: true },
                price: { type: Number, required: true },
            },
        ],
        coupon: { type: mongoose.Schema.Types.ObjectId, ref: 'Coupon' },
        totalAmount: { type: Number, required: true },
        deliveryStatus: {
            type: String,
            enum: ['pending', 'shipped', 'completed', 'cancelled'],
            default: 'pending',
        },
        paymentStatus: {
            type: String,
            enum: ['pending', 'paid', 'failed'],
            default: 'pending',
        },
        paymentMethod: {
            type: String,
            enum: ['cash', 'bankTransfer'],
            default: 'cash',
        },
        shippingAddress: {
            name: { type: String, required: true },
            phone: { type: String, required: true },
            address: { type: String, required: true },
        },

        // VNPay integration fields
        vnpTxnRef: {
            type: String,
            unique: true,
            sparse: true,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

//Export the model
module.exports = mongoose.model('Invoice', invoiceSchema);
