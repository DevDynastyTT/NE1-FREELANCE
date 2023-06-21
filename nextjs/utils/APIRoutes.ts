//comment this when deploying
// export const host = "http://localhost:3002"

//Uncomment this whenever deploying publicly
// export const host = "https://ne1freelance.onrender.com"

export const heartBeat = `/api/heartbeat`

export const loginRoute = `/api/auth/login`
export const registerRoute = `/api/auth/register`
export const logoutRoute = `/api/auth/logout`
export const userSession = `/api/auth/userSession`
export const allUsersRoute = `/api/auth/allusers`
export const getAllUserInfo = `/api/auth/getAllUserInfo`
export const sendMessageRoute = `/api/messages/addmsg`
export const receiveMessageRoute = `/api/messages/getmsg`
export const uploadDocumentMessageRoute = `/api/messages/uploadDocument`
export const setAvatarRoute = `/api/auth/setavatar`
export const updateUser = `/api/auth/updateUser`
export const updateProfile = `/api/auth/updateProfile`
export const getUserProfile = `/api/auth/getUserProfile`
export const countUsers = `/api/auth/countUsers`

export const reportJob = `/api/auth/reportJob`
export const addMsgWithDocument = `/api/auth/addMsgWithDocument`
export const makePayment = `/api/auth/makePayment`
export const countInvoices = `/api/auth/countInvoices`
export const countInvoiceDates = `/api/auth/countInvoiceDates`
export const sendEmailRoute = `/api/auth/sendEmail`

export const getAllJobs = `/api/auth/getAllJobs`
export const searchJobs = `/api/auth/searchJobs`
export const searchResults = `/api/auth/searchResults`
export const jobDetails = `/api/auth/jobDetails`
export const createJob = `/api/auth/createJob`
export const countJobs = `/api/auth/countJobs`
export const getCategories = `/api/auth/getCategories`
export const countCategories = `/api/auth/countCategories`
export const countJobsInCategory = `/api/auth/countJobsInCategory`
export const createService = `/api/auth/createService`
export const countServices = `/api/auth/countServices`
export const getAllServices = `/api/auth/getAllServices`
export const rateFreelancer = `/api/auth/rateFreelancer`
export const updateRatings = `/api/auth/updateRatings`
export const getRatings = `/api/auth/getRatings`
export const getAllRatings = `/api/auth/getAllRatings`
export const getFreelancerRatings = `/api/auth/getFreelancerRatings`
export const getFreelancerRatingsProgress = `/api/auth/getFreelancerRatingsProgress`
export const getAboutInfo = `/api/auth/getAboutUs`
export const updateAbout =`/api/auth/updateAbout`
//ADMIN
export const updateService = `/api/auth/updateServices`
export const deleteService = `/api/auth/deleteServices`