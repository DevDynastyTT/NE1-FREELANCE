import mongoose from 'mongoose';

async function main() {
  await mongoose.connect(process.env.MONGODB_URI!, { dbName: process.env.MONGODB_DBNAME });
  const db = mongoose.connection.db!;

  const user = await db.collection('users').findOne({ email: 'gamingwithazzard@gmail.com' });
  console.log('\n=== USER ===');
  console.log(JSON.stringify({ ...user, password: '[HIDDEN]', resetToken: user?.resetToken ?? null }, null, 2));

  if (user) {
    const profile = await db.collection('userprofiles').findOne({ userID: user._id });
    console.log('\n=== PROFILE ===');
    console.log(JSON.stringify(profile, null, 2));

    const jobs = await db.collection('jobs').find({ freeLancerID: user._id }).toArray();
    console.log(`\n=== JOBS OWNED (${jobs.length}) ===`);
    jobs.forEach(j => console.log(` - [${j._id}] ${j.title} $${j.price}`));

    const ratings = await db.collection('ratings').find({ userID: user._id.toString() }).toArray();
    console.log(`\n=== RATINGS GIVEN (${ratings.length}) ===`);
    ratings.forEach(r => console.log(` - ${r.ratings}★  ${r.feedback}`));
  }

  const totalJobs = await db.collection('jobs').countDocuments();
  const totalUsers = await db.collection('users').countDocuments();
  console.log(`\n=== DB SUMMARY ===`);
  console.log(` Total users: ${totalUsers}`);
  console.log(` Total jobs:  ${totalJobs}`);

  console.log('\n=== SEED JOB FREELANCER IDs ===');
  const seedJobs = await db.collection('jobs').find({}, { projection: { title: 1, freeLancerID: 1, price: 1 } }).toArray();
  seedJobs.forEach(j => console.log(` [${j._id}] ${j.title} — freelancer: ${j.freeLancerID}`));

  await mongoose.disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
