import reportJob from "../controllers/reportController";
import sendEmail from "../controllers/contactController";
import heartBeat from "../controllers/heartBeatController";
import { updateAbout, getAboutInfo } from "../controllers/aboutController";

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
  searchResults, 
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
import path from 'path';
const router = require("express").Router();


const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const destinationPath = path.join(__dirname, '../../nextjs/public/images');
    cb(null, destinationPath);
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

router.post("/login", login);
router.post("/signup", signup);
router.post("/updateUser", updateUser);
router.post("/updateProfile", upload.single('profile_picture'), updateProfile);
router.post("/reportJob", reportJob)
router.get("/members/chat/:seller_id", getSeller);
router.get("/allusers/:id", getAllUsers);
router.get("/getUserProfile/:id", getUserProfile);
router.get("/getAllUserInfo", getAllUserInfo);
router.get("/countUsers", countUsers);

router.post("/createJob", upload.single('thumbnail'), createJob);
router.post("/searchJobs", searchJobs);
router.post("/searchResults", searchResults);

router.post("/updateServices", upload.single('thumbnail'), updateServices)
router.post("/deleteServices", upload.single('thumbnail'), deleteServices)
router.post("/makePayment", makePayment)
router.get('/getCategories', getCategories);
// router.get('/countCategories',countCategories);
router.get("/jobDetails/:jobID", jobDetails);
router.get("/getAllJobs", getAllJobs);
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

module.exports = router;