/**
 * Seed script — wipes all collections and inserts realistic demo data.
 * Does NOT create User documents; other collections use consistent
 * placeholder ObjectIds for any user references.
 *
 * Run: npx tsx --env-file=.env.local scripts/seed.ts
 */

import mongoose, { Types } from 'mongoose';
import '../models/userModel';
import '../models/userProfileModel';
import '../models/jobCategoriesModel';
import '../models/jobsModel';
import '../models/ratingsModel';
import '../models/messagesModel';
import '../models/invoiceModel';
import '../models/reportModel';
import '../models/serviceModel';
import '../models/aboutModel';
import '../models/contactModel';
import '../models/creditCardModel';

// ---------------------------------------------------------------------------
// Virtual user IDs — no User documents are created, but every collection that
// references a user uses these IDs consistently so lookups are coherent.
// ---------------------------------------------------------------------------
const USER_A = new Types.ObjectId(); // freelancer "Jordan Blake"
const USER_B = new Types.ObjectId(); // client    "Maya Singh"
const USER_C = new Types.ObjectId(); // freelancer "Carlos Rivas"

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const log = (msg: string) => console.log(`\x1b[36m→\x1b[0m ${msg}`);
const ok  = (msg: string) => console.log(`\x1b[32m✔\x1b[0m ${msg}`);

async function connect() {
  const uri  = process.env.MONGODB_URI;
  const db   = process.env.MONGODB_DBNAME;
  if (!uri || !db) throw new Error('MONGODB_URI or MONGODB_DBNAME missing from env');
  await mongoose.connect(uri, { dbName: db });
  ok('Connected to MongoDB');
}

function model(name: string) {
  return mongoose.model(name);
}

// ---------------------------------------------------------------------------
// 1. Wipe
// ---------------------------------------------------------------------------
async function wipe() {
  log('Wiping all collections…');
  for (const name of mongoose.modelNames()) {
    await mongoose.model(name).deleteMany({});
  }
  ok('All collections wiped');
}

// ---------------------------------------------------------------------------
// 2. Job Categories
// ---------------------------------------------------------------------------
async function seedCategories() {
  const names = [
    'Transportation', 'Cleaning', 'Esthetics', 'Design',
    'Photography', 'Tutoring', 'Event Planning', 'Repairs',
  ];
  const docs = await model('JobCategories').insertMany(names.map(name => ({ name })));
  ok(`JobCategories: ${docs.length} inserted`);
  return names;
}

// ---------------------------------------------------------------------------
// 3. About Us
// ---------------------------------------------------------------------------
async function seedAbout() {
  await model('AboutUs').create({
    information: `NE1 Freelance was born out of a simple idea: talented people in Trinidad & Tobago deserve a platform that connects them directly with the clients who need them. We cut out the middleman, offer project-based pricing so there are no hourly surprises, and verify every freelancer so you always know who you're working with. Whether you need a driver for the weekend, a decorator for your next event, or a photographer for a special moment — NE1 Freelance has someone near you ready to help.`,
    update: 1,
  });
  ok('AboutUs: 1 inserted');
}

// ---------------------------------------------------------------------------
// 4. Services (admin-managed homepage categories)
// ---------------------------------------------------------------------------
async function seedServices() {
  const services = [
    {
      title: 'Transportation',
      description: 'Reliable drivers for airport pickups, deliveries, and daily commutes across Trinidad.',
      thumbnail: 'seed-service-transportation.jpg',
    },
    {
      title: 'Cleaning',
      description: 'Professional home and office cleaning services tailored to your schedule.',
      thumbnail: 'seed-service-cleaning.jpg',
    },
    {
      title: 'Esthetics',
      description: 'Makeup artists, nail technicians, and beauty professionals available island-wide.',
      thumbnail: 'seed-service-esthetics.jpg',
    },
    {
      title: 'Design',
      description: 'Graphic designers, UI/UX specialists, and brand identity experts at your fingertips.',
      thumbnail: 'seed-service-design.jpg',
    },
    {
      title: 'Photography',
      description: 'Capture every moment with skilled photographers for events, portraits, and products.',
      thumbnail: 'seed-service-photography.jpg',
    },
    {
      title: 'Repairs',
      description: 'Plumbers, electricians, and handymen ready for household and commercial repairs.',
      thumbnail: 'seed-service-repairs.jpg',
    },
  ];
  const docs = await model('Services').insertMany(services);
  ok(`Services: ${docs.length} inserted`);
}

// ---------------------------------------------------------------------------
// 5. Jobs
// ---------------------------------------------------------------------------
async function seedJobs(categories: string[]) {
  const [Transportation, Cleaning, Esthetics, Design, Photography, Tutoring, EventPlanning, Repairs] = categories;

  const jobs = [
    {
      freeLancerID: USER_A,
      title: 'Airport & Corporate Transfers',
      description: 'Professional, punctual transfers to and from Piarco International Airport. AC vehicle, luggage assistance, and real-time flight tracking included. Available 24/7 for early-morning and late-night flights.',
      thumbnail: 'seed-job-transfer.jpg',
      price: 150,
      category: Transportation,
    },
    {
      freeLancerID: USER_C,
      title: 'Daily Commute & Errands Driver',
      description: 'Flexible daily driver service for Port of Spain, San Fernando, and surrounding areas. Pay per trip or book a weekly package. Comfortable, insured vehicle with courteous service.',
      thumbnail: 'seed-job-driver.jpg',
      price: 80,
      category: Transportation,
    },
    {
      freeLancerID: USER_A,
      title: 'Deep Home Cleaning — Full House',
      description: 'Thorough top-to-bottom cleaning of your home. Includes kitchen, bathrooms, bedrooms, and common areas. Eco-friendly products used on request. Bring your own supplies or use ours (small fee applies).',
      thumbnail: 'seed-job-cleaning.jpg',
      price: 200,
      category: Cleaning,
    },
    {
      freeLancerID: USER_C,
      title: 'Post-Event & Office Clean-Up',
      description: 'Rapid clean-up after parties, corporate events, or office moves. Team of 2–4 available. Rubbish removal, mopping, wiping surfaces, and restoring the space to its original state.',
      thumbnail: 'seed-job-office-clean.jpg',
      price: 350,
      category: Cleaning,
    },
    {
      freeLancerID: USER_A,
      title: 'Bridal Makeup & Hair Styling',
      description: 'Full bridal glam package: foundation, contouring, lashes, and hairstyling. Trial session included. Available for weddings, engagement shoots, and proms. Products from top international brands.',
      thumbnail: 'seed-job-bridal-makeup.jpg',
      price: 400,
      category: Esthetics,
    },
    {
      freeLancerID: USER_C,
      title: 'Gel Manicure & Pedicure (Home Visit)',
      description: 'Professional nail technician comes to your home. Gel polish, nail art, and cuticle care included. Bring your own colour or choose from our 80-shade kit. Sessions last approximately 1.5 hours.',
      thumbnail: 'seed-job-nails.jpg',
      price: 120,
      category: Esthetics,
    },
    {
      freeLancerID: USER_A,
      title: 'Logo & Brand Identity Design',
      description: 'Full brand identity package: logo in multiple formats (SVG, PNG, PDF), colour palette, typography guide, and business card design. 3 initial concepts, unlimited revisions until satisfied.',
      thumbnail: 'seed-job-logo.jpg',
      price: 500,
      category: Design,
    },
    {
      freeLancerID: USER_C,
      title: 'Social Media Graphics Pack',
      description: 'Monthly social media content pack: 12 custom post designs, 4 story templates, and 1 cover image. Delivered as editable Canva or Adobe files. Branded to your business colours and fonts.',
      thumbnail: 'seed-job-social.jpg',
      price: 180,
      category: Design,
    },
    {
      freeLancerID: USER_A,
      title: 'Event & Wedding Photography',
      description: 'Full-day event coverage (up to 8 hours). Candid and posed shots, gallery of 300+ edited high-resolution images delivered within 7 days. Second shooter available for an additional fee.',
      thumbnail: 'seed-job-event-photo.jpg',
      price: 450,
      category: Photography,
    },
    {
      freeLancerID: USER_C,
      title: 'Product & E-Commerce Photography',
      description: 'Studio-quality product photos on white or lifestyle backgrounds. Up to 10 products per session, 3 angles each. Colour-corrected and web-optimised. Perfect for Shopify, Instagram, and Amazon listings.',
      thumbnail: 'seed-job-product-photo.jpg',
      price: 250,
      category: Photography,
    },
    {
      freeLancerID: USER_A,
      title: 'CXC & CAPE Mathematics Tutoring',
      description: 'Experienced Mathematics tutor with 95% pass rate. One-on-one sessions at your home or online. Past paper practice, exam technique coaching, and personalised study plan included. Form 4 & 5 specialists.',
      thumbnail: 'seed-job-tutor.jpg',
      price: 50,
      category: Tutoring,
    },
    {
      freeLancerID: USER_C,
      title: 'Plumbing — Leak Repairs & Installations',
      description: 'Licensed plumber for residential and light commercial work. Pipe leak repairs, tap replacements, shower installations, and tank connections. Emergency call-out available. Parts sourced at cost price.',
      thumbnail: 'seed-job-plumbing.jpg',
      price: 120,
      category: Repairs,
    },
  ];

  const docs = await model('Jobs').insertMany(jobs);
  ok(`Jobs: ${docs.length} inserted`);
  return docs as (typeof jobs[0] & { _id: Types.ObjectId })[];
}

// ---------------------------------------------------------------------------
// 6. User Profiles
// ---------------------------------------------------------------------------
async function seedProfiles() {
  const profiles = [
    {
      userID: USER_A,
      profilePicture: 'seed-profile-a.jpg',
      bio: 'Multi-skilled freelancer based in Port of Spain. I handle transportation, cleaning, and beauty services with a professional, client-first attitude. 5+ years experience. Available weekdays and weekends.',
    },
    {
      userID: USER_B,
      profilePicture: 'seed-profile-b.jpg',
      bio: 'Entrepreneur and regular NE1 Freelance client. I hire for events, design projects, and office logistics. Prompt payer, clear briefings, always leave honest reviews.',
    },
    {
      userID: USER_C,
      profilePicture: 'seed-profile-c.jpg',
      bio: 'Creative professional specialising in photography, graphic design, and digital marketing. Based in San Fernando. Portfolio available on request. Quick turnaround, competitive rates.',
    },
  ];
  const docs = await model('userProfiles').insertMany(profiles);
  ok(`UserProfiles: ${docs.length} inserted`);
}

// ---------------------------------------------------------------------------
// 7. Ratings
// ---------------------------------------------------------------------------
async function seedRatings(jobs: { _id: Types.ObjectId; freeLancerID: Types.ObjectId; category: string }[]) {
  const feedbacks = [
    { ratings: 5, feedback: 'Absolutely brilliant — on time, polite, and went above and beyond. Will definitely book again.' },
    { ratings: 5, feedback: 'Outstanding quality. My expectations were completely exceeded. Highly recommend!' },
    { ratings: 4, feedback: 'Great service overall. Minor delay at the start but communication was excellent throughout.' },
    { ratings: 4, feedback: 'Very professional and tidy work. A small detail was missed but fixed immediately when mentioned.' },
    { ratings: 5, feedback: 'Best in the business. Already booked a second session.' },
    { ratings: 3, feedback: 'Decent work but not quite what I envisioned. Communication could be better.' },
    { ratings: 5, feedback: 'Incredibly talented. The final product was even better than the brief.' },
    { ratings: 4, feedback: 'Good value for money. Delivered on time and was easy to work with.' },
    { ratings: 2, feedback: 'Service was adequate but I expected more given the price. Room for improvement.' },
    { ratings: 5, feedback: 'Professional, efficient, and friendly. My go-to freelancer from now on.' },
  ];

  const ratings = feedbacks.map((fb, index) => {
    const job = jobs[index % jobs.length];
    return {
      jobID: job._id.toString(),
      freeLancerID: job.freeLancerID.toString(),
      userID: USER_B.toString(),
      ratings: fb.ratings,
      feedback: fb.feedback,
    };
  });

  const docs = await model('Ratings').insertMany(ratings);
  ok(`Ratings: ${docs.length} inserted`);
}

// ---------------------------------------------------------------------------
// 8. Report Jobs
// ---------------------------------------------------------------------------
async function seedReports(jobs: { _id: Types.ObjectId; title: string; freeLancerID: Types.ObjectId }[]) {
  const reports = [
    {
      jobID: jobs[0]._id.toString(),
      jobTitle: jobs[0].title,
      userID: USER_B.toString(),
      freelancerID: jobs[0].freeLancerID.toString(),
      reason: 'The freelancer did not show up for the agreed session and has not responded to messages for 48 hours.',
      reportCategory: 'No-show / Unresponsive',
    },
    {
      jobID: jobs[3]._id.toString(),
      jobTitle: jobs[3].title,
      userID: USER_B.toString(),
      freelancerID: jobs[3].freeLancerID.toString(),
      reason: 'The price charged at completion was significantly higher than the listed rate without prior agreement.',
      reportCategory: 'Pricing Dispute',
    },
  ];

  const docs = await model('ReportJob').insertMany(reports);
  ok(`ReportJob: ${docs.length} inserted`);
}

// ---------------------------------------------------------------------------
// 9. Messages
// ---------------------------------------------------------------------------
async function seedMessages() {
  const chatID = new Types.ObjectId();
  const thread = [
    { sender: 'Maya Singh',   senderID: USER_B, receiver: 'Jordan Blake', receiverID: USER_A, content: 'Hi Jordan! I saw your airport transfer listing. Is Saturday 5am available?' },
    { sender: 'Jordan Blake', senderID: USER_A, receiver: 'Maya Singh',   receiverID: USER_B, content: 'Hi Maya! Yes, 5am Saturday works perfectly. Where is the pickup?' },
    { sender: 'Maya Singh',   senderID: USER_B, receiver: 'Jordan Blake', receiverID: USER_A, content: 'Cascade, Port of Spain. We need to be at Piarco by 7am.' },
    { sender: 'Jordan Blake', senderID: USER_A, receiver: 'Maya Singh',   receiverID: USER_B, content: 'Perfect, that gives us plenty of time. I will confirm 30 minutes before arrival. Payment on completion is fine.' },
    { sender: 'Maya Singh',   senderID: USER_B, receiver: 'Jordan Blake', receiverID: USER_A, content: 'Great! Can you handle 3 large suitcases?' },
    { sender: 'Jordan Blake', senderID: USER_A, receiver: 'Maya Singh',   receiverID: USER_B, content: 'Absolutely — I drive an SUV so that is no problem at all.' },
    { sender: 'Maya Singh',   senderID: USER_B, receiver: 'Jordan Blake', receiverID: USER_A, content: 'Wonderful. Booking confirmed. Thank you!' },
    { sender: 'Jordan Blake', senderID: USER_A, receiver: 'Maya Singh',   receiverID: USER_B, content: 'See you Saturday! Feel free to message if anything changes.' },
  ];

  const messages = thread.map(msg => ({ chatID, ...msg, file: null }));
  const docs = await model('Messages').insertMany(messages);
  ok(`Messages: ${docs.length} inserted`);
}

// ---------------------------------------------------------------------------
// 10. Invoices
// ---------------------------------------------------------------------------
async function seedInvoices(jobs: { _id: Types.ObjectId; freeLancerID: Types.ObjectId }[]) {
  const invoices = [
    { clientID: USER_B, freeLancerID: jobs[0].freeLancerID, transactionID: 'TXN-20260101-0001', paymentDetails: 'Paid' },
    { clientID: USER_B, freeLancerID: jobs[2].freeLancerID, transactionID: 'TXN-20260210-0002', paymentDetails: 'Paid' },
    { clientID: USER_B, freeLancerID: jobs[6].freeLancerID, transactionID: 'TXN-20260315-0003', paymentDetails: 'Paid' },
    { clientID: USER_B, freeLancerID: jobs[8].freeLancerID, transactionID: 'TXN-20260401-0004', paymentDetails: 'Paid' },
  ];

  const docs = await model('Invoice').insertMany(invoices);
  ok(`Invoices: ${docs.length} inserted`);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  console.log('\n\x1b[1mNE1 Freelance — Seed Script\x1b[0m\n');
  try {
    await connect();
    await wipe();

    const categories = await seedCategories();
    await seedAbout();
    await seedServices();
    const jobs = await seedJobs(categories);
    await seedProfiles();
    await seedRatings(jobs as never);
    await seedReports(jobs as never);
    await seedMessages();
    await seedInvoices(jobs as never);

    console.log('\n\x1b[32m\x1b[1mSeed complete!\x1b[0m\n');
    console.log('Virtual user IDs (no User documents — reference only):');
    console.log(`  USER_A (Jordan Blake / freelancer): ${USER_A}`);
    console.log(`  USER_B (Maya Singh   / client):     ${USER_B}`);
    console.log(`  USER_C (Carlos Rivas / freelancer): ${USER_C}\n`);
    console.log('Note: Job/service thumbnails are placeholder filenames — images will not render until real files are uploaded to Wasabi S3.\n');
  } catch (err) {
    console.error('\x1b[31mSeed failed:\x1b[0m', err);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

main();
