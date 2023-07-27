const host = process.env.NODE_ENV === 'production' ? 'https://ne1freelance.onrender.com' : 'http://localhost:3009';

export const heartBeat = `${host}/api/heartbeat`

/***************USER ROUTES***************/
export const loginRoute = `${host}/api/auth/login`
export const logoutRoute = `${host}/api/auth/logout`
export const signupRoute = `${host}/api/auth/signup`
export const allUsersRoute = `${host}/api/auth/allusers`
export const getAllUserInfo = `${host}/api/auth/getAllUserInfo`
export const getReceiver = `${host}/api/auth/getReceiver`
export const sendMessageRoute = `${host}/api/auth/messages/send`
export const notifyUserRoute = `${host}/api/auth/messages/send/notify`
export const searchUsers = `${host}/api/auth/messages/searchUsers`
export const receiveMessageRoute = `${host}/api/auth/messages/receive`
export const getRecentChats = `${host}/api/auth/messages/recentChats`
export const addMsgWithDocument = `${host}/api/auth/addMsgWithDocument`
export const uploadDocumentMessageRoute = `${host}/api/messages/uploadDocument`
export const setAvatarRoute = `${host}/api/auth/setavatar`
export const updateUser = `${host}/api/auth/updateUser`
export const updateProfile = `${host}/api/auth/updateProfile`
export const getUserProfile = `${host}/api/auth/getUserProfile`
export const getProfilePictureURL = `${host}/api/auth/getProfilePictureURL`
export const countUsers = `${host}/api/auth/countUsers`

/***************JOB ROUTES***************/
export const getAllJobs = `${host}/api/auth/getAllJobs`
export const searchJobs = `${host}/api/auth/searchJobs`
export const searchJobsByCategory = `${host}/api/auth/searchJobs`
export const reportJob = `${host}/api/auth/reportJob`
export const makePayment = `${host}/api/auth/makePayment`
export const jobDetails = `${host}/api/auth/jobDetails`
export const createJob = `${host}/api/auth/createJob`
export const countJobs = `${host}/api/auth/countJobs`
export const getCategories = `${host}/api/auth/getCategories`
export const countCategories = `${host}/api/auth/countCategories`
export const countJobsInCategory = `${host}/api/auth/countJobsInCategory`
export const rateFreelancer = `${host}/api/auth/rateFreelancer`
export const updateRatings = `${host}/api/auth/updateRatings`
export const getRatings = `${host}/api/auth/getRatings`
export const getAllRatings = `${host}/api/auth/getAllRatings`
export const getFreelancerRatings = `${host}/api/auth/getFreelancerRatings`
export const getFreelancerRatingsProgress = `${host}/api/auth/getFreelancerRatingsProgress`

/***************CONTACT ROUTES***************/
export const sendEmailRoute = `${host}/api/auth/sendEmail`

/***************ABOUT US ROUTES***************/
export const getAboutInfo = `${host}/api/auth/getAboutUs`

/***************ADMIN ROUTES***************/
export const createService = `${host}/api/auth/createService`
export const countServices = `${host}/api/auth/countServices`
export const getAllServices = `${host}/api/auth/getAllServices`
export const updateAbout =`${host}/api/auth/updateAbout`
export const updateService = `${host}/api/auth/updateServices`
export const deleteService = `${host}/api/auth/deleteServices`
export const countInvoices = `${host}/api/auth/countInvoices`
export const countInvoiceDates = `${host}/api/auth/countInvoiceDates`