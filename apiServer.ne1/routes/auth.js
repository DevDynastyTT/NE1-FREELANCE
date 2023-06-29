const {
  login,
  register,
  logOut,
  userSession,
  updateUser,
  updateProfile,
  getUserProfile,
  getAllUsers,
  getAllUserInfo,
  countUsers
} = require("../controllers/userController");

const {
  reportJob
} = require("../controllers/reportController")

const {
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
  deleteServices
} = require('../controllers/jobController')

const {
  updateAbout,
  getAboutInfo
} = require("../controllers/aboutController");

const {
  rateFreelancers,
  getRatings, 
  getFreelancerRatings,
  getFreelancerRatingsProgress,
  getAllRatings,
  updateRatings
} = require("../controllers/ratingsController")

const{
  sendEmail
} = require("../controllers/contactController")

const {
  heartBeat
} = require("../controllers/heartBeatController")

const multer = require('multer')
const path = require('path');
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
router.post("/register", register);
router.post("/logout", logOut);
router.get("/userSession", userSession)
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
router.get('/countCategories',countCategories);
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
//Check if the server is up every 5 seconds
router.get('/heartbeat', heartBeat);

module.exports = router;