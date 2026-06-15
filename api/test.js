const { MongoClient, ServerApiVersion } = require('mongodb');
const dotenv = require('dotenv');
dotenv.config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    const db = client.db('Unit_1321');
    const cols = await db.listCollections().toArray();
    console.log("Collections in Unit_1321:", cols.map(c => c.name));
    
    for (const c of cols) {
      if (c.name.toLowerCase() === 'stocks') {
        const doc = await db.collection(c.name).findOne({});
        console.log(`First doc in ${c.name}:`, doc);
      }
    }
  } finally {
    await client.close();
  }
}
run().catch(console.dir);
