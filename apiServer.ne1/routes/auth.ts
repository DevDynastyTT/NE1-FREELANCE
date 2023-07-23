import reportJob from "../controllers/reportController";
import {sendEmail, notifyUser} from "../controllers/contactController";
import heartBeat from "../controllers/heartBeatController";
import { updateAbout, getAboutInfo } from "../controllers/aboutController";
import { sendMessage, receiveMessage, searchUsers, getReceiver, recentChats } from '../controllers/messagesController';
import { 
  login, 
  logout,
  signup, 
  updateUser, 
  updateProfile, 
  getUserProfile, 
  getAllUsers, 
  getAllUserInfo, 
  countUsers } from "../controllers/userController";

import { 
  getAllJobs, 
  searchJobs, 
  jobDetails, 
  createJob, 
  getCategories, 
  getSeller, 
  createService, 
  getAllServices, 
  makePayment, 
  countJobs, 
  countServices, 
  countCategories, 
  countJobsInCategory, 
  countInvoices, 
  countInvoiceDates, 
  updateServices, 
  deleteServices } from '../controllers/jobController';
 
import { 
  rateFreelancers, 
  getRatings, 
  getFreelancerRatings, 
  getFreelancerRatingsProgress, 
  getAllRatings, 
  updateRatings } from "../controllers/ratingsController";


import multer from 'multer';
const router = require("express").Router();
// Multer storage configuration
const upload = multer({
  storage: multer.memoryStorage(), // Store files in memory instead of disk
});
// Authentication Routes
router.post("/login", login);
router.put("/logout/:id", logout);
router.post("/signup", signup);
router.post("/updateUser", updateUser);
router.put("/updateProfile", upload.single('profile_picture'), updateProfile);
router.get("/getUserProfile/:id", getUserProfile);
router.get("/getAllUserInfo", getAllUserInfo);
router.get('/getReceiver/:id', getReceiver)
router.get("/countUsers", countUsers);
router.get('/recentChats/:id', recentChats)
router.post("/send", upload.single('file'), sendMessage);
router.post("/send/notify/", notifyUser);
router.get("/receive/:senderID/:receiverID", receiveMessage);
router.get("/searchUsers/:keyword", searchUsers);

// Job Routes
router.get("/getAllJobs", getAllJobs);
router.post("/createJob", upload.single('thumbnail'), createJob);
router.get("/searchJobs/:jobCategory/:search", searchJobs);
router.post("/updateServices", upload.single('thumbnail'), updateServices)
router.post("/deleteServices", upload.single('thumbnail'), deleteServices)
router.post("/makePayment", makePayment)
router.get('/getCategories', getCategories);
router.get("/jobDetails/:jobID", jobDetails);
router.get('/countJobs',countJobs);
router.get('/countInvoices', countInvoices);
router.get('/countInvoiceDates', countInvoiceDates);

// Service Routes (Admin)
router.post('/createService', upload.single('thumbnail'), createService);
router.get('/getAllServices', getAllServices);
router.get('/countServices',countServices);
router.get('/countJobsInCategory',countJobsInCategory);

// Rating Routes
router.post("/rateFreelancer", rateFreelancers)
router.post("/getRatings", getRatings)
router.post("/getFreelancerRatingsProgress", getFreelancerRatingsProgress)
router.post("/getFreelancerRatings", getFreelancerRatings)
router.post("/getAllRatings", getAllRatings)
router.post("/updateRatings", updateRatings)

// Contact Routes
router.post("/sendEmail", sendEmail);

// About Us Routes
router.post("/updateAbout", updateAbout);
router.get("/getAboutUs", getAboutInfo);

// Miscellaneous Routes
router.get('/heartbeat', heartBeat);

export const authRoutes = router;
