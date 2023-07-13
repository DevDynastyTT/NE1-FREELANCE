import { JobDetails, JobsType } from "../types";

import Jobs from "../models/jobsModel";
import JobCategories from "../models/jobCategoriesModel";
import Services from "../models/serviceModel";
import Users from "../models/userModel";
import Invoice from "../models/invoiceModel";
import CreditCard from "../models/creditCardModel";
import userProfiles from "../models/userProfileModel";
import { ObjectId } from 'mongodb';

import crypto from 'crypto'; //Used for random characters
import moment from 'moment'; //User for dates
import template from './invoiceTemplate';
import nodemailer from 'nodemailer';
import bcrypt from 'bcrypt';
import mongoose from "mongoose";

const AWS = require('aws-sdk');

// Configure Wasabi credentials
AWS.config.update({
  accessKeyId: process.env.WASABI_ACCESS_KEY_ID,
  secretAccessKey: process.env.WASABI_SECRET_ACCESS_KEY_ID,
});

// Create a new instance of the S3 client
const s3 = new AWS.S3({
  endpoint: process.env.SECRET_ENDPOINT,
});
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
          localField: 'freeLancerID',
          foreignField: '_id',
          as: 'jobs',
        },
      },
      { '$unwind': '$jobs'},
      {
        $project: {
          "_id": 1,
          "freeLancerID": 1,
          "username": "$jobs.username",
          "title": 1,
          "description": 1,
          "thumbnail": 1,
          "price": 1,
          "category": 1,
        }
      }
    ]);

    if (jobs.length == 0)  return response.status(404).json({ error: "There are currently no jobs available :(" });

    const job_list = await Promise.all(jobs.map(async (job) => ({
      ...job,
      thumbnail: await getImages(job.thumbnail),
    })));
    
    const reversedJobList:JobsType[] = []
  
    for(let i = job_list.length - 1; i>= 0; i--){
      reversedJobList.push(job_list[i])
    }

    return response.status(200).json({ reversedJobList });

    } catch (error) {
      console.log(`Error retrieving jobs: ${error.message}`);
      return response.status(500).json({error: 'Internal Server Error'});
    }
};






const getImages = async (fileName:string): Promise<string> => {
  
  try {
    const bucketName = 'ne1-freelance'; // Replace with your Wasabi bucket name

    // Generate a pre-signed URL for the profile picture
    const params = {
      Bucket: bucketName,
      Key: fileName,
      Expires: 3600, // URL expiration time in seconds (e.g., 1 hour)
    };

    const signedUrl = await s3.getSignedUrlPromise('getObject', params);
    // Return the pre-signed URL in the response
    return signedUrl
  } catch (error) {
    console.error(error.message);
    return fileName
  }
}


const searchJobs = async (request, response) => {
  const { jobCategory, search } = request.params;

  try {
    // Query to find jobs that match the search criteria
    const jobQuery:any = {
      $or: [
        { title: { $regex: search, $options: "i" } }, // Case-insensitive search for title
        { description: { $regex: search, $options: "i" } }, // Case-insensitive search for description
        { category: { $regex: search, $options: "m" } },

      ],
    };

    // If jobCategory is provided, add category search condition to the query
    if (jobCategory && jobCategory !== 'undefined') {
      jobQuery.category = jobCategory;
    }

    // Find the matching jobs
    const jobs = await Jobs.find(jobQuery);

    if (jobs.length === 0 && jobCategory == 'undefined') {
      return response.status(404).json({ error: `No results found for '${search}'` });
    }else if(jobs.length === 0 && jobCategory != 'undefined'){
      return response.status(404).json({ error: `No results found for '${search}' in  [${jobCategory}] category` });
    }

    // Fetch job categories for category filtering
    let jobCategoryFilter:any = null;
    if (jobCategory && jobCategory !== 'undefined') {
      jobCategoryFilter = await JobCategories.findOne({ name: jobCategory });
      if (!jobCategoryFilter) {
        return response.status(400).json({ error: "Violation! Job Category does not exist" });
      }
    }

    // Format the response
    const jobList = await Promise.all(
      jobs.map(async (job) => {
        const jobData:any = job.toObject();
        jobData.thumbnail = await getImages(jobData.thumbnail);
        const freeLancerUserName:any = await Users.find({ _id: jobData.freeLancerID });
        jobData.username = freeLancerUserName[0].username;
        return jobData;      })
    );

    if (jobCategoryFilter) {
      // If jobCategory is provided, return the filtered jobs in the category
      const jobsInCategory = jobList.filter((job) => job.category === jobCategoryFilter?.name);
      
      return response.status(200).json({ job_list: jobsInCategory });
    } else {
      // If no jobCategory is provided, return all the matched jobs
      
      for (const job of jobList) {
        const freeLancerUserName:any = await Users.find({ _id: job.freeLancerID });
        job.username = freeLancerUserName[0].username;
      }
      return response.status(200).json({ job_list: jobList });
    }
  } catch (error) {
    console.error(error.message);
    return response.status(500).json({ error: "Internal Server Error" });
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
    console.error(error.message)
    return response.status(500).json({error: 'Internal Server Error'});

  }
}
const jobDetails = async (request, response) => {
  const { jobID } = request.params;

  try {
    const jobDetails = await Jobs.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(jobID) } },
      {
        $lookup: {
          from: 'users',
          localField: 'freeLancerID',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $lookup: {
          from: 'userprofiles',
          localField: 'freeLancerID',
          foreignField: 'userID',
          as: 'profile',
        },
      },
      {
        $project: {
          _id: 1,
          freeLancerID: { $toString: '$freeLancerID' },
          title: 1,
          description: 1,
          thumbnail: 1,
          price: 1,
          category: 1,
          username: { $arrayElemAt: ['$user.username', 0] },
          userBio: { $ifNull: [{ $arrayElemAt: ['$profile.bio', 0] }, ''] },
          profilePicture: { $ifNull: [{ $arrayElemAt: ['$profile.profilePicture', 0] }, ''] },
        },
      },
    ]);

    if (jobDetails.length === 0) {
      console.log("No job found with ID: " + jobID);
      return response.status(404).json({ error: "No job found with ID: " + jobID });
    }

    const jobDetail = [jobDetails[0]];
    jobDetail[0].thumbnail = await getImages(jobDetail[0].thumbnail);
    jobDetail[0].profilePicture = await getImages(jobDetail[0].profilePicture);

    return response.status(200).json({ jobDetails: jobDetail });
  } catch (error) {
    console.log(`Error retrieving job details: ${error.message}`);
    return response.status(500).json({ error: 'Internal Server Error' });
  }
};




const getSeller = async(request, response) => {
  const seller_id = request.params;
 
  // const seller = {seller_id: job.freeLancerID}
  // console.log(seller);

}
const createJob = async (request, response) => {
  try {
    const {freeLancerID, title, description, price, category} = request.body
    let thumbnail = '';
    const bucketName = 'ne1-freelance'; // Replace with your Wasabi bucket name

    if (request.file) {
      const fileContent = request.file.buffer;
      const fileName = Date.now() + '-' + request.file.originalname;

      // Upload the file to Wasabi
      const params = {
        Bucket: bucketName,
        Key: fileName,
        Body: fileContent,
      };
      await s3.upload(params).promise();
      thumbnail = fileName;
      console.log('File uploaded successfully');
      // do something with the file
    } else {
      console.log('No file uploaded\n');
      // handle the case where no file was uploaded
    }

    await Jobs.create({
      freeLancerID,
      title,
      description,
      thumbnail,
      price,
      category,
    });

   
    return response.status(200).json({ message: 'Created job successfully' });
  } catch (error) {
    console.log(error.message);
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

    try{
      const services = await Services.create({ thumbnail, title, description });
        if (!services) {
          console.error('There was a problem creating the service');
          return response.status(500).json({ error: 'There was a problem creating the service' });
        }
        console.log(`${title} Service Added`);
        return response.status(201).json({ message: `${title} Service Added Successfully` });
    }catch(error){
      console.log(error.message);
      return response.status(500).json({ error: 'Internal Server Error' });
    }
   
};

const getAllServices = async (req, res, next) => {
  try {
    const serviceInfo = await Services.find();
    res.json({serviceInfo});
  } catch (error) {
    console.error(error.message);
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
  
          const findCard = await CreditCard.findOne({userID: info._id})
          if(!findCard){
            const creditCard = await CreditCard.create({
              userID: new ObjectId(info._id),
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
          console.error('Error sending invoice:', error.message);
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
  console.error('Error counting jobs: ',error.message);
  response.status(500).json({error: 'Internal Server Error'});
}
};

const countServices = async(request, response) => {
  try{
  const service_count = await Services.countDocuments();
  console.log('Total number of services: ',service_count);
  response.json(service_count);
}catch(error){
  console.log('Error counting services: ',error.message);
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
    console.error("Error counting jobs:", error.message);
    response.status(500).json({ error: "Internal Server Error" });
  }
};

const countCategories = async (request, response) => {
  try {
    const catCount = await JobCategories.countDocuments();
    console.log('Total number of categories: ', catCount);
    response.json(catCount);
  } catch (error) {
    console.log('Error counting categories: ', error.message);
    response.status(500).json({ error: "Internal Server Error" });
  }
};

const countInvoices = async (request, response) => {
  try {
    const invoiceCount = await Invoice.countDocuments();
    console.log('Total number of invoices: ', invoiceCount);
    response.json(invoiceCount);
  } catch (error) {
    console.log('Error counting categories: ', error.message);
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
    console.log('Error counting invoices:', error.message);
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
    console.error(error.message);
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
    console.error('Error deleting service:', error.message);

    // Send an error response
    response.status(500).json({ error: 'Internal Server Error' });
  }
};

export {
  getAllJobs,
  searchJobs,
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