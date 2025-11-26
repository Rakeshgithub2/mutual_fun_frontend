/**
 * Test News Fetch System
 *
 * This script tests the news fetching functionality:
 * 1. Connects to MongoDB
 * 2. Deletes old news articles
 * 3. Fetches 20 fresh articles
 * 4. Stores them in database
 * 5. Shows statistics
 */

const { MongoClient } = require('mongodb');
const newsService = require('./mutual-funds-backend/services/newsService');

const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/mutual_funds';

async function testNewsFetch() {
  console.log('\n🧪 ============================================');
  console.log('🧪 TESTING NEWS FETCH SYSTEM');
  console.log('🧪 ============================================\n');

  let client;

  try {
    // Connect to MongoDB
    console.log('📊 Connecting to MongoDB...');
    client = await MongoClient.connect(MONGODB_URI);
    const db = client.db();

    // Make getDb available
    require('./mutual-funds-backend/config/database').getDb = () => db;

    console.log('✅ MongoDB connected\n');

    // Check current news count
    const newsCollection = db.collection('news');
    const currentNews = await newsCollection.findOne({ _id: 'latest_news' });

    if (currentNews) {
      console.log(
        `📰 Current news in database: ${
          currentNews.articles?.length || 0
        } articles`
      );
      console.log(`📅 Last updated: ${currentNews.lastUpdated || 'Never'}\n`);
    } else {
      console.log('📰 No news in database yet\n');
    }

    // Fetch fresh news
    console.log('🔄 Triggering news fetch...\n');
    const articles = await newsService.fetchAndStoreNews();

    // Check updated news count
    const updatedNews = await newsCollection.findOne({ _id: 'latest_news' });

    console.log('\n📊 ============================================');
    console.log('📊 FETCH RESULTS');
    console.log('📊 ============================================');
    console.log(`✅ Total articles fetched: ${articles.length}`);
    console.log(
      `✅ Articles in database: ${updatedNews.articles?.length || 0}`
    );
    console.log(`✅ Last updated: ${updatedNews.lastUpdated}`);
    console.log(`✅ Source: ${updatedNews.source}`);

    // Show article categories
    const categories = {};
    articles.forEach((article) => {
      categories[article.category] = (categories[article.category] || 0) + 1;
    });

    console.log('\n📂 Articles by Category:');
    Object.entries(categories).forEach(([category, count]) => {
      console.log(`   ${category}: ${count} articles`);
    });

    // Show sample articles
    console.log('\n📰 Sample Articles:');
    articles.slice(0, 5).forEach((article, i) => {
      console.log(`   ${i + 1}. [${article.category}] ${article.title}`);
    });

    console.log('\n✅ ============================================');
    console.log('✅ NEWS FETCH TEST COMPLETED SUCCESSFULLY!');
    console.log('✅ ============================================\n');
  } catch (error) {
    console.error('\n❌ ============================================');
    console.error('❌ TEST FAILED:', error.message);
    console.error('❌ ============================================\n');
    console.error(error);
  } finally {
    if (client) {
      await client.close();
      console.log('👋 MongoDB connection closed\n');
    }
  }
}

// Run the test
testNewsFetch().catch(console.error);
