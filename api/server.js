const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let connected = false;

async function ensureConnection() {
  if (!connected) {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    connected = true;
  }
}

app.get('/api/products', async (req, res) => {
  try {
    await ensureConnection();
    const products = await client.db('Warehouses').collection('products').find({}).toArray();
    res.json(products);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

app.get('/api/units', async (req, res) => {
  try {
    await ensureConnection();
    const units = await client.db('Units').collection('units_metadata').find({}).toArray();
    res.json(units);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Failed to fetch units' });
  }
});

app.get('/api/units/:unitId/stock', async (req, res) => {
  try {
    await ensureConnection();
    const unitId = req.params.unitId;
    const dbName = `Unit_${unitId}`;
    const stocks = await client.db(dbName).collection('stocks').find({}).toArray();
    res.json(stocks);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Failed to fetch unit stock' });
  }
});

app.get('/api/orders', async (req, res) => {
  try {
    const email = req.query.email;
    if (!email) {
      return res.json([]);
    }

    await ensureConnection();
    
    // Get all units to know which databases to query
    const units = await client.db('Units').collection('units_metadata').find({}).toArray();
    
    let allOrders = [];
    
    for (const u of units) {
      if (u.unitId) {
        const dbName = `Unit_${u.unitId}`;
        const reservations = await client.db(dbName).collection('reservation').find({ customerEmail: email }).toArray();
        
        reservations.forEach(r => {
          // Normalize the data to match frontend expectations
          allOrders.push({
            _id: r._id,
            pickupCode: r.orderId,
            name: r.customerName,
            houseName: r.houseName,
            email: r.customerEmail,
            items: r.products,
            totalAmount: r.totalAmount,
            status: r.status,
            createdAt: r.createdAt,
            unitName: u.name // Track where the order was placed
          });
        });
      }
    }
    
    // Sort by newest first
    allOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json(allOrders);
  } catch (error) {
    console.error('Fetch orders error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

app.post('/api/orders/pickup', async (req, res) => {
  try {
    await ensureConnection();
    const { items, unitId, totalAmount, name, houseName, email } = req.body;
    const userId = req.headers['x-auth-uid'] || 'guest';
    
    // Generate 5-digit code
    const pickupCode = Math.floor(10000 + Math.random() * 90000).toString();

    const order = {
      userId,
      email: email || '',
      name,
      houseName,
      items,
      unitId,
      totalAmount,
      pickupCode,
      status: 'Pending',
      createdAt: new Date()
    };

    // Save to centralized Warehouses -> orders (REMOVED AS PER REQUEST)
    // await client.db('Warehouses').collection('orders').insertOne(order);

    // Save to specific Unit db -> reservation
    const dbUnit = client.db(`Unit_${unitId}`);
    const reservation = {
      orderId: pickupCode,
      customerEmail: email || '',
      customerName: name,
      houseName: houseName,
      products: items,
      totalAmount: totalAmount,
      status: 'Pending',
      createdAt: new Date()
    };
    await dbUnit.collection('reservation').insertOne(reservation);

    // Decrease stock for each purchased item
    for (const item of items) {
      if (item.productId && item.quantity) {
        await dbUnit.collection('stocks').updateOne(
          { productId: item.productId },
          { $inc: { quantity: -item.quantity } }
        );
      }
    }

    res.json({ pickupCode, message: 'Order placed successfully' });
  } catch (error) {
    console.error('Order error:', error);
    res.status(500).json({ message: 'Booking failed' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Minimal API Server running on port ${PORT}`);
});
