//comment this when deploying

//Uncomment this whenever deploying publicly
// export const host = "https://ne1freelance.onrender.com"
export const host = process.env.SERVER_HOST || "localhost:3000"

export const heartBeat = `${host}/api/heartbeat`

export const loginRoute = `${host}/api/auth/login`
export const registerRoute = `${host}/api/auth/register`
export const logoutRoute = `${host}/api/auth/logout`
export const userSession = `${host}/api/auth/userSession`
export const allUsersRoute = `${host}/api/auth/allusers`
export const getAllUserInfo = `${host}/api/auth/getAllUserInfo`
export const sendMessageRoute = `${host}/api/messages/addmsg`
export const receiveMessageRoute = `${host}/api/messages/getmsg`
export const uploadDocumentMessageRoute = `${host}/api/messages/uploadDocument`
export const setAvatarRoute = `${host}/api/auth/setavatar`
export const updateUser = `${host}/api/auth/updateUser`
export const updateProfile = `${host}/api/auth/updateProfile`
export const getUserProfile = `${host}/api/auth/getUserProfile`
export const countUsers = `${host}/api/auth/countUsers`

export const reportJob = `${host}/api/auth/reportJob`
export const addMsgWithDocument = `${host}/api/auth/addMsgWithDocument`
export const makePayment = `${host}/api/auth/makePayment`
export const countInvoices = `${host}/api/auth/countInvoices`
export const countInvoiceDates = `${host}/api/auth/countInvoiceDates`
export const sendEmailRoute = `${host}/api/auth/sendEmail`

export const getAllJobs = `${host}/api/auth/getAllJobs`
export const searchJobs = `${host}/api/auth/searchJobs`
export const searchResults = `${host}/api/auth/searchResults`
export const jobDetails = `${host}/api/auth/jobDetails`
export const createJob = `${host}/api/auth/createJob`
export const countJobs = `${host}/api/auth/countJobs`
export const getCategories = `${host}/api/auth/getCategories`
export const countCategories = `${host}/api/auth/countCategories`
export const countJobsInCategory = `${host}/api/auth/countJobsInCategory`
export const createService = `${host}/api/auth/createService`
export const countServices = `${host}/api/auth/countServices`
export const getAllServices = `${host}/api/auth/getAllServices`
export const rateFreelancer = `${host}/api/auth/rateFreelancer`
export const updateRatings = `${host}/api/auth/updateRatings`
export const getRatings = `${host}/api/auth/getRatings`
export const getAllRatings = `${host}/api/auth/getAllRatings`
export const getFreelancerRatings = `${host}/api/auth/getFreelancerRatings`
export const getFreelancerRatingsProgress = `${host}/api/auth/getFreelancerRatingsProgress`
export const getAboutInfo = `${host}/api/auth/getAboutUs`
export const updateAbout =`${host}/api/auth/updateAbout`
//ADMIN
export const updateService = `${host}/api/auth/updateServices`
export const deleteService = `${host}/api/auth/deleteServices`