/***************USER ROUTES***************/
export const loginRoute = `/api/auth/login`
export const logoutRoute = `/api/auth/logout`
export const signupRoute = `/api/auth/signup`
export const allUsersRoute = `/api/auth/allusers`
export const getAllUserInfo = `/api/auth/getAllUserInfo`
export const getReceiver = `/api/auth/getReceiver`
export const sendMessageRoute = `/api/auth/messages/send`
export const notifyUserRoute = `/api/auth/messages/send/notify`
export const searchUsers = `/api/auth/messages/searchUsers`
export const receiveMessageRoute = `/api/auth/messages/receive`
export const getRecentChats = `/api/auth/messages/recentChats`
export const updateUser = `/api/auth/updateUser`
export const updateProfile = `/api/auth/updateProfile`
export const getUserProfile = `/api/auth/getUserProfile`
export const countUsers = `/api/auth/countUsers`

/***************JOB ROUTES***************/
export const getAllJobs = `/api/auth/getAllJobs`
export const searchJobs = `/api/auth/searchJobs`
export const searchJobsByCategory = `/api/auth/searchJobs`
export const reportJob = `/api/auth/reportJob`
export const makePayment = `/api/auth/makePayment`
export const jobDetails = `/api/auth/jobDetails`
export const createJob = `/api/auth/createJob`
export const countJobs = `/api/auth/countJobs`
export const getCategories = `/api/auth/getCategories`
export const countCategories = `/api/auth/countCategories`
export const countJobsInCategory = `/api/auth/countJobsInCategory`
export const rateFreelancer = `/api/auth/rateFreelancer`
export const updateRatings = `/api/auth/updateRatings`
export const getRatings = `/api/auth/getRatings`
export const getAllRatings = `/api/auth/getAllRatings`
export const getFreelancerRatings = `/api/auth/getFreelancerRatings`
export const getFreelancerRatingsProgress = `/api/auth/getFreelancerRatingsProgress`

/***************CONTACT ROUTES***************/
export const sendEmailRoute = `/api/auth/sendEmail`

/***************ABOUT US ROUTES***************/
export const getAboutInfo = `/api/auth/getAboutUs`

/***************ADMIN ROUTES***************/
export const createService = `/api/auth/createService`
export const countServices = `/api/auth/countServices`
export const getAllServices = `/api/auth/getAllServices`
export const updateAbout = `/api/auth/updateAbout`
export const updateService = `/api/auth/updateServices`
export const deleteService = `/api/auth/deleteServices`
export const countInvoices = `/api/auth/countInvoices`
export const countInvoiceDates = `/api/auth/countInvoiceDates`

/***************HEARTBEAT***************/
export const heartBeat = `/api/auth/heartbeat`
