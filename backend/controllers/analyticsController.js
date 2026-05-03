import Order from '../models/Order.js';
import Product from '../models/Product.js';

export const getAnalyticsSummary = async (req, res) => {
  try {
    const orders = await Order.find({ status: 'Completed' });
    
    const totalSales = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const numberOfOrders = orders.length;
    
    let upiSales = 0;
    let cashSales = 0;
    
    orders.forEach(order => {
      if (order.paymentMethod === 'UPI') upiSales += order.totalAmount;
      if (order.paymentMethod === 'Cash') cashSales += order.totalAmount;
    });

    // We can also aggregate to get daily stats or most sold products
    const productStats = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        if (!productStats[item.productId]) {
          productStats[item.productId] = { name: item.name || 'Unknown', quantity: 0 };
        }
        productStats[item.productId].quantity += item.quantity;
      });
    });

    const mostSoldProducts = Object.values(productStats).sort((a, b) => b.quantity - a.quantity).slice(0, 5);

    res.status(200).json({
      totalSales,
      numberOfOrders,
      salesByPaymentMethod: {
        UPI: upiSales,
        Cash: cashSales
      },
      mostSoldProducts,
      orders
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const clearAllData = async (req, res) => {
  try {
    // Delete all orders and products
    await Order.deleteMany({});
    await Product.deleteMany({});
    res.status(200).json({ message: 'All data cleared successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
