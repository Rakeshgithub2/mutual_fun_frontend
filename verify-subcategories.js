// Verify Database SubCategories
// Run this with: node verify-subcategories.js

const { MongoClient } = require('mongodb');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'your-mongodb-connection-string';

async function verifySubCategories() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB\n');

    const db = client.db();
    const fundsCollection = db.collection('funds');

    // Count total funds
    const totalFunds = await fundsCollection.countDocuments({
      isActive: { $ne: false },
    });
    console.log(`📊 Total Active Funds: ${totalFunds}\n`);

    // Check Equity funds and subcategories
    console.log('═══════════════════════════════════════');
    console.log('📈 EQUITY FUNDS BREAKDOWN');
    console.log('═══════════════════════════════════════');

    const equityTotal = await fundsCollection.countDocuments({
      category: { $regex: /^equity$/i },
      isActive: { $ne: false },
    });
    console.log(`\nTotal Equity Funds: ${equityTotal}`);

    const equitySubcategories = await fundsCollection
      .aggregate([
        {
          $match: {
            category: { $regex: /^equity$/i },
            isActive: { $ne: false },
          },
        },
        { $group: { _id: '$subCategory', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ])
      .toArray();

    console.log('\nEquity Subcategories:');
    equitySubcategories.forEach((sub) => {
      const name = sub._id || '(No SubCategory)';
      console.log(`  ├─ ${name}: ${sub.count} funds`);
    });

    // Check Commodity funds and subcategories
    console.log('\n═══════════════════════════════════════');
    console.log('💎 COMMODITY FUNDS BREAKDOWN');
    console.log('═══════════════════════════════════════');

    const commodityTotal = await fundsCollection.countDocuments({
      category: { $regex: /^commodity$/i },
      isActive: { $ne: false },
    });
    console.log(`\nTotal Commodity Funds: ${commodityTotal}`);

    const commoditySubcategories = await fundsCollection
      .aggregate([
        {
          $match: {
            category: { $regex: /^commodity$/i },
            isActive: { $ne: false },
          },
        },
        { $group: { _id: '$subCategory', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ])
      .toArray();

    console.log('\nCommodity Subcategories:');
    commoditySubcategories.forEach((sub) => {
      const name = sub._id || '(No SubCategory)';
      console.log(`  ├─ ${name}: ${sub.count} funds`);
    });

    // Check for funds missing subCategory
    console.log('\n═══════════════════════════════════════');
    console.log('⚠️  FUNDS MISSING SUBCATEGORY');
    console.log('═══════════════════════════════════════\n');

    const missingEquitySubcategory = await fundsCollection.countDocuments({
      category: { $regex: /^equity$/i },
      $or: [
        { subCategory: { $exists: false } },
        { subCategory: null },
        { subCategory: '' },
      ],
      isActive: { $ne: false },
    });

    const missingCommoditySubcategory = await fundsCollection.countDocuments({
      category: { $regex: /^commodity$/i },
      $or: [
        { subCategory: { $exists: false } },
        { subCategory: null },
        { subCategory: '' },
      ],
      isActive: { $ne: false },
    });

    if (missingEquitySubcategory > 0) {
      console.log(
        `⚠️  ${missingEquitySubcategory} Equity funds are missing subCategory field`
      );

      // Show examples
      const examples = await fundsCollection
        .find({
          category: { $regex: /^equity$/i },
          $or: [
            { subCategory: { $exists: false } },
            { subCategory: null },
            { subCategory: '' },
          ],
          isActive: { $ne: false },
        })
        .limit(5)
        .toArray();

      console.log('\nExamples:');
      examples.forEach((fund) => {
        console.log(`  - ${fund.name} (ID: ${fund._id})`);
      });
    }

    if (missingCommoditySubcategory > 0) {
      console.log(
        `\n⚠️  ${missingCommoditySubcategory} Commodity funds are missing subCategory field`
      );

      // Show examples
      const examples = await fundsCollection
        .find({
          category: { $regex: /^commodity$/i },
          $or: [
            { subCategory: { $exists: false } },
            { subCategory: null },
            { subCategory: '' },
          ],
          isActive: { $ne: false },
        })
        .limit(5)
        .toArray();

      console.log('\nExamples:');
      examples.forEach((fund) => {
        console.log(`  - ${fund.name} (ID: ${fund._id})`);
      });
    }

    if (missingEquitySubcategory === 0 && missingCommoditySubcategory === 0) {
      console.log('✅ All funds have subCategory field populated!');
    }

    // Recommendations
    console.log('\n═══════════════════════════════════════');
    console.log('💡 RECOMMENDATIONS');
    console.log('═══════════════════════════════════════\n');

    console.log('Expected Equity Subcategories:');
    console.log('  ✓ Large Cap');
    console.log('  ✓ Mid Cap');
    console.log('  ✓ Small Cap');
    console.log('  ✓ Multi Cap');
    console.log('  ✓ Flexi Cap (optional)');

    console.log('\nExpected Commodity Subcategories:');
    console.log('  ✓ Gold');
    console.log('  ✓ Silver');

    console.log('\n═══════════════════════════════════════\n');
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.close();
    console.log('🔌 Disconnected from MongoDB');
  }
}

verifySubCategories();
