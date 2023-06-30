import { JobDetails, JobsType } from "../types";

const Jobs = require("../models/jobsModel.ts");
const JobCategories = require("../models/jobCategoriesModel");
const Users = require("../models/userModel");
const Services = require("../models/serviceModel")
const Invoice = require("../models/invoiceModel")
const CreditCard = require("../models/creditCardModel")
const { ObjectId } = require('mongodb')

const crypto = require('crypto'); //Used for random characters
const moment = require('moment'); //User for dates
const template = require('./invoiceTemplate')
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');


async function checkTransactionIdExists(transaction_id) {
  const existingInvoice = await Invoice.findOne({ transaction_id });
  return !!existingInvoice;
}

function generateTransactionId() {
  const year = moment().format('YYYY');
  const randomChars = crypto.randomBytes(3).toString('hex').toUpperCase();
  return year + randomChars;
}

// Hashing function using bcrypt
const hash = async (value) => {
  const saltRounds = 10; // Number of salt rounds for bcrypt
  const hashedValue = await bcrypt.hash(value, saltRounds);
  return hashedValue;
};


const getAllJobs = async (request, response) => {
  try {
    const jobs = await Jobs.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'user_id',
          foreignField: '_id',
          as: 'user',
        },
      },
    ]);

    const job_list:JobsType[] = [];
    const reversedJobList:JobsType[] = []
    jobs.forEach(job => {
      const str1 = job.category.replace("{ name: '", "")
      const str2 = str1.replace("' }", "")
      job_list.push({
        _id: job._id,
        freeLancerID: job.user_id,
        username: job.user[0].username,
        title: job.title,
        description: job.description,
        thumbnail: job.thumbnail,
        price: job.price,
        category: str2,
      });
    });

    for(let i = job_list.length - 1; i>= 0; i--){
      reversedJobList.push(job_list[i])
    }

    if (job_list.length > 0) {
      return response.status(200).json({ reversedJobList });
    }
    else{
      return response.json({ error: "There are currently no jobs available :(" });
    }

    } catch (err) {
      console.log(`Error retrieving jobs: ${err}`);
      return response.status(500).json({error: 'Internal Server Error'});
    }
};


const searchJobs = async (request, response) => {
  const { jobCategory, search } = request.body;

  try {
    // Get the jobs and users
    const jobs = await Jobs.find({
      $or: [
        { title: { $regex: search, $options: "m" } },
        { description: { $regex: search, $options: "m" } },
        { category: { $regex: search, $options: "m" } },
      ],
    });

    if (jobCategory.length > 0) {
      const jobCategories = await JobCategories.find({
        name: jobCategory,
      });
      if (jobCategories.length > 0) {
        const jobCategoryId = jobCategories[0]._id;
        const jobsInCategory = await Jobs.find({
          category: jobCategoryId,
        });
        response.status(200).json({jobCategory});
      } else {
        response.status(400).json({ error: "There are currently no jobs available in this category :(" });
      }
    } else {
      response.status(200).json(jobs);
    }
  } catch (err) {
    console.log(err);
    response.status(500).json({error: 'Internal Server Error'});
  }
};

const searchResults = async (request, response) => {
  try {
    // Get the query parameters
    const {term, category} = request.body;
    
    const query:any = {
      $or: [
        { title: { $regex: term, $options: "m" } },
        { description: { $regex: term, $options: "m" } },
        { category: { $regex: term, $options: "m" } },
      ]
    };
    // If a category is specified, add it to the query
    if (category) {
      query.category = category;
    }

    // Find the jobs that match the query
    const jobs = await Jobs.find(query);

    // If no jobs are found, return an error message
    if (jobs.length === 0) return response.status(404).json({error: "No jobs found for " + term,category});
    const job_list:JobsType[] = []
    // Convert the jobs to a JSON object
    const jobList = jobs.map(job => ({
      _id: job._id,
      freeLancerID: job.user_id,
      username: JobCategories.findOne({_id: job.category}).username,
      title: job.title,
      description: job.description,
      thumbnail: job.thumbnail,
      price: job.price,
      category: job.category,
    }));

    job_list.push(jobList)
    job_list.forEach(job=> console.log(job));
    // Return the job list to the client
    response.status(200).json({job_list});

  } catch (err) {
    console.log('CATCH ERROR:\n', err);
    response.status(500).json({
      error: "An error occurred",
      err,
    });
  }
};

const getCategories = async(request, response) => {
  try{
      const categories = await JobCategories.find({}, {
        // select only the name field
        _id: false,
        name: true
      });
      return response.status(200).json({categories})

  }catch(error){
    console.log('An error occurred while fetching categories', error)
    return response.status(500).json({error: 'Internal Server Error'});

  }
}
const jobDetails = async(request, response) => {

  const { jobID } = request.params;

  const job = await Jobs.findOne({ _id: jobID });

  if (!job) {
    console.log("No job found with ID: " + jobID);
    return response.status(404).json({ error: "No job found with ID: " + jobID });
  }

  const user = await Users.findOne({ _id: job.user_id });

  if (!user) {
    console.log("No user found with ID: " + job.user_id);
    return response.status(404).json({ error: "No user found with ID: " + job.user_id });
  }

  const jobDetails:JobsType[] = []
  const jobDetails_list:JobDetails = {
    _id: job._id,
    freeLancerID: job.user_id,
    title: job.title,
    description: job.description,
    thumbnail: job.thumbnail,
    price: job.price,
    category: job.category,
    username: user.username,
    userBio: user.bio,
    profilePicture: user.profile_picture,
  };

  jobDetails.push(jobDetails_list)


  return response.status(200).json({jobDetails});
};

const getSeller = async(request, response) => {
  const seller_id = request.params;
 
  // const seller = {seller_id: job.user_id}
  // console.log(seller);

}
const createJob = async (request, response) => {
  try {
    const {user_id, title, description, price, category} = request.body
    let thumbnail = '';
    if (request.file) {
      thumbnail = request.file.filename
      console.log(thumbnail + ' is thumbnail')
      // do something with the file
    } else {
      console.log('No file uploaded\n');
      // handle the case where no file was uploaded
    }

    console.log('user id:', user_id, '\ntitle:', title, 'description:', description, 'price:', price, 'category:', category, 'thumbnail:', thumbnail)
    const job = await Jobs.create({
      user_id,
      title,
      description,
      thumbnail,
      price,
      category,
    });

    return response.status(200).json({ message: 'Created job successfully' });
  } catch (error) {
    console.log('An error occurred while creating job', error);
    return response.status(500).json({ error: 'Internal Server Error' });
  }
};

const createService = async(request, response) => {
  const title = request.body.title;
  const description = request.body.description;
  let thumbnail='';

  if (request.file) {
    thumbnail = request.file.filename
    // do something with the file
  } else {
    console.log('No file uploaded');
    // handle the case where no file was uploaded
  }

  if (!title || !description || !thumbnail) {
    return response.status(400).json({ error: 'Missing required field' });
  }

  Services.create({ thumbnail, title, description }, (err, service) => {
    if (err) {
      console.error(err);
      return response.status(500).json({ error: 'Internal server error' });
    }
    console.log(`${title} Service Added`);
    return response.status(201).json({ message: `${title} Service Added Successfully` });
  });
};

const getAllServices = async (req, res, next) => {
  try {
    const serviceInfo = await Services.find();
    res.json({serviceInfo});
  } catch (ex) {
    next(ex);
  }
};

const makePayment = async (request, response) => {
        const { 
          client_id, 
          clientEmail, 
          freelancer_id, 
          jobFee, 
          totalFee,
          serviceFee, 
          firstName, 
          lastName, 
          securityCode, 
          expiryDate, 
          cardNumber
        } = request.body;
        const username = firstName + " " + lastName
        
        const errors = {
          cardNumberError: '',
          expiryDateError: '',
          securityCodeError: '',
          firstNameError: '',
          lastNameError: '',
        };
        const dateFormatRegex = /^\d{2}\/\d{2}\/\d{2}$/;
        const nameRegex = /^[A-Za-z]+$/;
        const cvvRegex = /^[0-9]{3,4}$/;

        if (!client_id) return response.json({ error: "You aren't authorized to make this transaction" });
        
        if (!cardNumber || !expiryDate || !securityCode || !firstName || !lastName) 
            return response.json({error: "Do not leave any fields blank."});
          
        
          const formattedCardNumber = cardNumber.replace(/\s/g, "");
          if (isNaN(formattedCardNumber) || formattedCardNumber.length !== 16) {
            errors.cardNumberError = "Enter a valid card number!";
          }
          
        
        if (!dateFormatRegex.test(expiryDate)) {
          errors.expiryDateError = "Invalid Date Format!";
        }
        
        if (isNaN(securityCode)) {
          errors.securityCodeError = "Invalid Format!";
        } else if (!cvvRegex.test(securityCode)) {
          errors.securityCodeError = "Invalid CVV!";
        }
        
        if (!nameRegex.test(firstName)) {
          errors.firstNameError = "Invalid First Name";
        }
        
        if (!nameRegex.test(lastName)) {
          errors.lastNameError = "Invalid Last Name";
        }
        
        if (Object.keys(errors).length > 0) {
          return response.json(errors);
        }
        
        // Rest of your code...


      if(Object.keys(errors).length === 0){
  
        
        try {
          const serverEmail = process.env.NODEMAILER_API_SERVER_EMAIL;
          const serverEmailPassword = process.env.NODEMAILER_API_SERVER_EMAIL_PASSWORD;
          const nodemailerService = process.env.NODEMAILER_API_SERVICE_TYPE;

          const hashedCardNumber = await hash(cardNumber);
          const hashedExpiryDate = await hash(expiryDate);
          const hashedSecurityCode = await hash(securityCode);
          const info = await Users.findOne({ email: clientEmail });

          if (!info) {
            console.log("You aren't authorized to do this action");
            return response.status(401).json({ error: "You aren't authorized to do this action" });
          }
  
          let transaction_id = generateTransactionId();
  
          while (await checkTransactionIdExists(transaction_id)) {
            transaction_id = generateTransactionId();
          }
  
          const invoice = await Invoice.create({
            client_id,
            freelancer_id,
            transaction_id,
          });
  
          if(!invoice){
            console.log('There a problem generating your invoice')
            return response.status(500).json({ error: 'There a problem generating your invoice' });
          }
  
          const findCard = await CreditCard.findOne({user_id: info._id})
          if(!findCard){
            const creditCard = await CreditCard.create({
              user_id: ObjectId(info._id),
              cardNumber: hashedCardNumber,
              expiryDate: hashedExpiryDate,
              securityCode: hashedSecurityCode,
              firstName: firstName,
              lastName: lastName,
            });
  
            if(!creditCard){
              console.log('There was a problem storing your credit card')
              return response.json({error: "There was a problem storing your credit card"})
            }
          }
       
          // Create a transporter using your email provider's configuration
          const transporter = nodemailer.createTransport({
            // Replace with your email provider's configuration
            service: nodemailerService,
            auth: {
              user: serverEmail,
              pass: serverEmailPassword,
            },
          });
      
          // Define the email options
          const emailTemplate = {
            from: serverEmail,
            to: clientEmail,
            subject: `Your order #${transaction_id} has been processed` ,
            html: template(username, jobFee, serviceFee, transaction_id, totalFee)
          };
          // Send the email
          await transporter.sendMail(emailTemplate);
      
          console.log('Invoice sent successfully');
      
          return response.status(200).json(
            { message: 'Payment successful. Please check your email for an invoice' });
        } catch (error) {
          console.error('Error sending invoice:', error);
          return response
            .status(400)
            .json({ error: 'There was an error while processing your transaction' });
        }

      }

};

//Admin section
const countJobs = async(request, response) => {
  try{
  const job_count = await Jobs.countDocuments();
  console.log('Total number of jobs: ',job_count);
  response.json(job_count);
}catch(error){
  console.log('Error counting jobs: ',error);
  response.status(500).json({error: 'Internal Server Error'});
}
};

const countServices = async(request, response) => {
  try{
  const service_count = await Services.countDocuments();
  console.log('Total number of services: ',service_count);
  response.json(service_count);
}catch(error){
  console.log('Error counting services: ',error);
  response.status(500).json({ error: "Internal Server Error" });
}
};

const countJobsInCategory = async (request, response) => {
  try {
    const categoryCounts = await Jobs.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
    ]);

    const categories = categoryCounts.map((item) => item._id);
    const counts = categoryCounts.map((item) => item.count);

    response.json({ categories, counts });
  } catch (error) {
    console.error("Error counting jobs:", error);
    response.status(500).json({ error: "Internal Server Error" });
  }
};

const countCategories = async (request, response) => {
  try {
    const catCount = await JobCategories.countDocuments();
    console.log('Total number of categories: ', catCount);
    response.json(catCount);
  } catch (error) {
    console.log('Error counting categories: ', error);
    response.status(500).json({ error: "Internal Server Error" });
  }
};

const countInvoices = async (request, response) => {
  try {
    const invoiceCount = await Invoice.countDocuments();
    console.log('Total number of invoices: ', invoiceCount);
    response.json(invoiceCount);
  } catch (error) {
    console.log('Error counting categories: ', error);
    response.status(500).json({ error: "Internal Server Error" });
  }
};

const countInvoiceDates = async (request, response) => {
  try {
    const invoiceCounts = await Invoice.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
            day: { $dayOfMonth: '$date' },
          },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          date: {
            $dateFromParts: {
              year: '$_id.year',
              month: '$_id.month',
              day: '$_id.day',
            },
          },
          count: 1,
        },
      },
    ]);

    console.log('Invoice counts:', invoiceCounts);
    response.json(invoiceCounts);
  } catch (error) {
    console.log('Error counting invoices:', error);
    response.status(500).json({ error: 'Internal Server Error' });
  }
};

const updateServices = async (request, response) => {
  const { chosenTitle, updatedTitle, description } = request.body;
  let thumbnail = '';

  if (request.file) {
    console.log('Thumbnail Uploaded');
    thumbnail = request.file.filename;
  }
  console.log(chosenTitle, updatedTitle, thumbnail)

  const query = { title: chosenTitle };
  let update:any = ''
  if(!thumbnail) update = { $set: {title: updatedTitle, description} }; // Update with new values
  else update = { $set: {title: updatedTitle, description, thumbnail: thumbnail} };
  const options = { new: true };

  try {
    const updatedJob = await Services.findOneAndUpdate(query, update, options);
    response.json({message: `Updated ${chosenTitle} Successfully`, updatedJob});
  } catch (error) {
    console.error(error);
    // response.status(500).json({ error: 'Internal Server Error' });
  }
};


const deleteServices = async (request, response) => {
  const title = request.body.chosenTitle;

  console.log('Deleting', title, "...")
  try {
    // Perform the deletion operation based on the provided title and description
    const del = await Services.deleteOne({ title });
    del ? console.log("deleted", title) : 'Error deleting', title
    // Send a success response
    response.status(200).json({ message: 'Service deleted successfully.' });
  } catch (error) {
    // Handle any errors that occurred during deletion
    console.error('Error deleting service:', error);

    // Send an error response
    response.status(500).json({ error: 'Internal Server Error' });
  }
};

export {
  getAllJobs,
  searchJobs,
  searchResults,
  getCategories,
  jobDetails,
  getSeller,
  createJob,
  createService,
  getAllServices,
  makePayment,
  countJobs,
  countServices,
  countJobsInCategory,
  countCategories,
  countInvoices,
  countInvoiceDates,
  updateServices,
  deleteServices
}