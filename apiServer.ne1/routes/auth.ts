import reportJob from "../controllers/reportController";
import {sendEmail, notifyUser} from "../controllers/contactController";
import heartBeat from "../controllers/heartBeatController";
import { updateAbout, getAboutInfo } from "../controllers/aboutController";
import { sendMessage, receiveMessage } from '../controllers/messagesController';
import { 
  login, 
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

router.post("/login", login);
router.post("/signup", signup);
router.post("/updateUser", updateUser);
router.put("/updateProfile", upload.single('profile_picture'), updateProfile);
router.post("/reportJob", reportJob)
router.get("/members/chat/:seller_id", getSeller);
router.get("/allusers/:id", getAllUsers);
router.get("/getUserProfile/:id", getUserProfile);
router.get("/getAllUserInfo", getAllUserInfo);
router.get("/countUsers", countUsers);
router.post("/send", sendMessage);
router.post("/send/notify/", notifyUser);
router.get("/receive/:senderID/:receiverID", receiveMessage);

router.get("/getAllJobs", getAllJobs);
router.post("/createJob", upload.single('thumbnail'), createJob);
router.get("/searchJobs/:jobCategory/:search", searchJobs);
router.post("/updateServices", upload.single('thumbnail'), updateServices)
router.post("/deleteServices", upload.single('thumbnail'), deleteServices)
router.post("/makePayment", makePayment)
router.get('/getCategories', getCategories);
// router.get('/countCategories',countCategories);
router.get("/jobDetails/:jobID", jobDetails);
router.get('/countJobs',countJobs);
router.get('/countInvoices', countInvoices);
router.get('/countInvoiceDates', countInvoiceDates);

router.post('/createService', upload.single('thumbnail'), createService);
router.post("/rateFreelancer", rateFreelancers)
router.post("/getRatings", getRatings)
router.post("/getFreelancerRatingsProgress", getFreelancerRatingsProgress)
router.post("/getFreelancerRatings", getFreelancerRatings)
router.post("/getAllRatings", getAllRatings)
router.post("/updateRatings", updateRatings)

router.post("/updateAbout", updateAbout);
router.get("/getAboutUs",getAboutInfo);
router.get("/members/chat/:seller_id", getSeller);
router.get('/getAllServices', getAllServices);
router.get('/countServices',countServices);
router.get('/countJobsInCategory',countJobsInCategory);

router.post("/sendEmail", sendEmail);
// Check if the server is up every 5 seconds
router.get('/heartbeat', heartBeat);

export const authRoutes = router