
const mongoose = require('mongoose');


const orderSchema = new mongoose.Schema({
  orderID: {
    type: Number,
    required: true,
  },
  customer: {
    type: String,
    required: true,
  },
  orderDate: {
    type: Date,
    required: true,
  },
  itemName: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  unitPrice: {
    type: Number,
    required: true,
  },
}, {timestamps: true});







const Order = mongoose.model('orders', orderSchema);

module.exports = Order;


