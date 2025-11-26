// Direct MongoDB test to verify funds exist
const { MongoClient } = require('mongodb');

async function testDatabase() {
  const uri = 'mongodb://localhost:27017';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('\n✅ Connected to MongoDB');

    const db = client.db('mutual_funds_db');
    const fundsCollection = db.collection('funds');

    const count = await fundsCollection.countDocuments();
    console.log(`\n📊 Total funds in database: ${count}`);

    if (count > 0) {
      console.log('\n📋 Sample funds:');
      const samples = await fundsCollection.find({}).limit(5).toArray();
      samples.forEach((fund) => {
        console.log(`   • ${fund.name}`);
        console.log(
          `     Category: ${fund.category} | NAV: ₹${fund.currentNav}`
        );
      });

      // Count by category
      const categories = await fundsCollection
        .aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }])
        .toArray();

      console.log('\n📈 By Category:');
      categories.forEach((cat) => {
        console.log(`   ${cat._id}: ${cat.count} funds`);
      });
    } else {
      console.log('\n⚠️  Database is empty! Run: node seed-complete-funds.js');
    }
  } catch (error) {
    console.error('\n❌ Error:', error.message);
  } finally {
    await client.close();
  }
}

testDatabase();
