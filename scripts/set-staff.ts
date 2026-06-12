import mongoose from 'mongoose';

async function main() {
  await mongoose.connect(process.env.MONGODB_URI!, { dbName: process.env.MONGODB_DBNAME });
  const result = await mongoose.connection.db!.collection('users').updateOne(
    { email: 'gamingwithhazzard@gmail.com' },
    { $set: { isStaff: true, isActive: true } }
  );
  console.log('matchedCount:', result.matchedCount);
  console.log('modifiedCount:', result.modifiedCount);
  await mongoose.disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
