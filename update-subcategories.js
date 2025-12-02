// Update SubCategories in Database
// This script helps you add subCategory field to funds that are missing it
// Run this with: node update-subcategories.js

const { MongoClient } = require('mongodb');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'your-mongodb-connection-string';

// Mapping rules to auto-detect subcategory from fund name
const EQUITY_SUBCATEGORY_PATTERNS = {
  'Large Cap': [
    /large\s*cap/i,
    /largecap/i,
    /blue\s*chip/i,
    /top\s*100/i,
    /nifty\s*50/i,
    /sensex/i,
  ],
  'Mid Cap': [/mid\s*cap/i, /midcap/i, /nifty\s*midcap/i],
  'Small Cap': [
    /small\s*cap/i,
    /smallcap/i,
    /micro\s*cap/i,
    /nifty\s*smallcap/i,
  ],
  'Multi Cap': [/multi\s*cap/i, /multicap/i, /diversified/i],
  'Flexi Cap': [/flexi\s*cap/i, /flexicap/i],
  Focused: [/focused/i, /focus/i],
  'Dividend Yield': [/dividend/i, /income/i],
  Value: [/value/i],
  Contra: [/contra/i],
};

const COMMODITY_SUBCATEGORY_PATTERNS = {
  Gold: [/gold/i, /\bgold\b/i],
  Silver: [/silver/i],
  'Multi Commodity': [/commodity/i, /commodities/i],
};

function detectSubCategory(fundName, category) {
  const patterns =
    category.toLowerCase() === 'equity'
      ? EQUITY_SUBCATEGORY_PATTERNS
      : COMMODITY_SUBCATEGORY_PATTERNS;

  for (const [subcategory, regexList] of Object.entries(patterns)) {
    for (const regex of regexList) {
      if (regex.test(fundName)) {
        return subcategory;
      }
    }
  }

  return null;
}

async function updateSubCategories() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB\n');

    const db = client.db();
    const fundsCollection = db.collection('funds');

    // Find funds missing subCategory
    const fundsToUpdate = await fundsCollection
      .find({
        $or: [
          { category: { $regex: /^equity$/i } },
          { category: { $regex: /^commodity$/i } },
        ],
        $or: [
          { subCategory: { $exists: false } },
          { subCategory: null },
          { subCategory: '' },
        ],
        isActive: { $ne: false },
      })
      .toArray();

    console.log(`Found ${fundsToUpdate.length} funds missing subCategory\n`);

    if (fundsToUpdate.length === 0) {
      console.log('✅ All funds already have subCategory field!');
      return;
    }

    console.log('═══════════════════════════════════════');
    console.log('🔍 AUTO-DETECTING SUBCATEGORIES');
    console.log('═══════════════════════════════════════\n');

    let updated = 0;
    let couldNotDetect = [];

    for (const fund of fundsToUpdate) {
      const detectedSubCategory = detectSubCategory(fund.name, fund.category);

      if (detectedSubCategory) {
        console.log(`✅ ${fund.name}`);
        console.log(
          `   Category: ${fund.category} → SubCategory: ${detectedSubCategory}\n`
        );

        // Update the database
        await fundsCollection.updateOne(
          { _id: fund._id },
          { $set: { subCategory: detectedSubCategory } }
        );

        updated++;
      } else {
        console.log(`⚠️  Could not detect: ${fund.name} (${fund.category})`);
        couldNotDetect.push({
          name: fund.name,
          category: fund.category,
          id: fund._id,
        });
      }
    }

    console.log('\n═══════════════════════════════════════');
    console.log('📊 SUMMARY');
    console.log('═══════════════════════════════════════\n');

    console.log(`✅ Updated: ${updated} funds`);
    console.log(`⚠️  Could not detect: ${couldNotDetect.length} funds\n`);

    if (couldNotDetect.length > 0) {
      console.log('Funds that need manual categorization:');
      couldNotDetect.forEach((fund) => {
        console.log(`  - ${fund.name} (${fund.category})`);
        console.log(`    ID: ${fund.id}`);
      });

      console.log('\n💡 To manually update these funds, run:');
      console.log('db.funds.updateOne(');
      console.log('  { _id: ObjectId("FUND_ID_HERE") },');
      console.log('  { $set: { subCategory: "Large Cap" } }');
      console.log(');\n');
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
  } finally {
    await client.close();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

// Show usage instructions
console.log('═══════════════════════════════════════');
console.log('📝 SUBCATEGORY UPDATE SCRIPT');
console.log('═══════════════════════════════════════\n');
console.log('This script will:');
console.log('1. Find funds missing subCategory field');
console.log('2. Auto-detect subcategory from fund name');
console.log('3. Update the database\n');
console.log('Press Ctrl+C to cancel, or wait 3 seconds...\n');

setTimeout(() => {
  updateSubCategories();
}, 3000);
