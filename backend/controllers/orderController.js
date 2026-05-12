import Order from '../models/Order.js';
import mongoose from 'mongoose';

// Generate unique 4-digit code
const generateOrderCode = async () => {
  let code;
  let exists = true;
  while (exists) {
    code = Math.floor(1000 + Math.random() * 9000).toString();
    const order = await Order.findOne({ orderCode: code });
    if (!order) exists = false;
  }
  return code;
};

// Create order (now accepts userId + userEmail)
export const createOrder = async (req, res) => {
  try {
    const { items, totalAmount, userId, userEmail } = req.body;
    const orderCode = await generateOrderCode();

    const order = new Order({
      orderCode,
      items,
      totalAmount,
      userId: userId || null,
      userEmail: userEmail || null,
      status: 'Pending',
    });

    await order.save();
    res.status(201).json({ orderCode, order });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get orders by userId (for My Orders panel)
export const getOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get order by code
export const getOrderByCode = async (req, res) => {
  try {
    const { code } = req.params;
    const order = await Order.findOne({ orderCode: code }).populate('items.productId');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Complete order (admin POS — marks as Completed + records payment)
export const completeOrder = async (req, res) => {
  try {
    const { code } = req.params;
    const { paymentMethod } = req.body;

    if (!['UPI', 'Cash'].includes(paymentMethod)) {
      return res.status(400).json({ message: 'Invalid payment method' });
    }

    const order = await Order.findOne({ orderCode: code });
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (order.status === 'Completed' || order.status === 'Delivered') {
      return res.status(400).json({ message: 'Order is already completed' });
    }

    // Reduce stock for each product
    for (const item of order.items) {
      const product = await mongoose.model('Product').findById(item.productId);
      if (product) {
        product.stock = Math.max(0, product.stock - item.quantity);
        await product.save();
      }
    }

    order.status = 'Completed';
    order.paymentMethod = paymentMethod;
    await order.save();

    res.status(200).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Mark order as Delivered (counter staff action)
export const markDelivered = async (req, res) => {
  try {
    const { code } = req.params;
    const order = await Order.findOne({ orderCode: code });
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (order.status === 'Delivered') {
      return res.status(400).json({ message: 'Order already delivered' });
    }

    order.status = 'Delivered';
    await order.save();

    res.status(200).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all orders (for admin/ledger)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).populate('items.productId');
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
