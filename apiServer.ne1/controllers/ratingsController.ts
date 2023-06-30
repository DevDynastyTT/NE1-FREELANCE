import Ratings from '../models/ratingsModel';
import User from '../models/userModel';
import mongoose from 'mongoose';
import ObjectId from 'mongoose';
const rateFreelancers = async(request, response) => {
    const { clientID, jobID, freeLancerID,
       ratings, feedback } = request.body;
  console.log(request.body)
    try{
        await Ratings.create({
            jobID,
            freeLancerID, 
            userID: clientID, 
            ratings, 
            feedback
        })
        return response.json({message: "Thank you for your feedback :D"})
    }catch(error){
        console.log(error + "\n\nERROR Rating freelancer")
        return response.json({error: "Internal Server Error"})
    }
}

const getFreelancerRatings = async (request, response) => {
  const { jobID, freeLancerID } = request.body;
  try {
    const freeLancerRatings = await Ratings.aggregate([
      {
        $match: { jobID, freeLancerID }
      },
      {
        $group: {
          _id: null,
          totalRatings: { $sum: "$ratings" }
        }
      }
    ]);

    if (freeLancerRatings.length > 0) {
      const sumOfRatings = freeLancerRatings[0].totalRatings;
      return response.json({ freeLancerRatings: sumOfRatings });
    } else {
      console.log("No ratings found for the freelancer");
      return response.json({ freeLancerRatings: 0 });
    }
  } catch (error) {
    console.log(error + "\n\nERROR getting ratings");
    return response.json({ error: "Internal Server Error" });
  }
};

const getFreelancerRatingsProgress = async (request, response) => {
  const { jobID, freeLancerID } = request.body;

  try {
    const freeLancerRatings = await Ratings.aggregate([
      {
        $match: {
          jobID: jobID,
          freeLancerID: freeLancerID,
        },
      },
      {
        $group: {
          _id: "$ratings",
          count: { $sum: 1 },
        },
      },
    ]);

    if (freeLancerRatings.length > 0) {
      const ratingCountsObject = {};
      freeLancerRatings.forEach((ratingCount) => {
        ratingCountsObject[ratingCount._id] = ratingCount.count;
      });
      console.log(ratingCountsObject)

      return response.json({ freeLancerRatings: ratingCountsObject });
    } else {
      console.log("No ratings found for the freelancer");
      return response.json({ freeLancerRatings: {} });
    }
  } catch (error) {
    console.log(error + "\n\nERROR getting ratings");
    return response.json({ error: "Internal Server Error" });
  }
};

//Ratings from the current user
const getRatings = async(request, response) => {

    const { jobID, freeLancerID, clientID } = request.body
    try{
        const totalRatings:any = await Ratings.aggregate([
        //stage1
        {
            $match: {
                jobID: jobID,
                freeLancerID:  freeLancerID,
                userID:  clientID
            }
        },

        ])
        console.log(totalRatings.ratings, "\nTotal ratings")
        return response.json({totalRatings})

    }catch(error){
        console.log(error + "\n\nERROR getting ratings")
        return response.json({error: "Internal Server Error"})
    }
}

const getAllRatings = async (request, response) => {
  const { jobID, freeLancerID } = request.body;
  try {
    await Ratings.aggregate([
      {
        $match: {
          "jobID": jobID,
          "freeLancerID": freeLancerID,
        }
      },
      {
        $addFields: {
          userID: { $toObjectId: '$userID' }
        }
      },
      {
        $lookup: {
          from: 'users', // name of the users collection
          localField: 'userID',
          foreignField: '_id',
          as: 'users',
        },
      },
      {
        $unwind: '$users',
      },
      {
        $project: {
          _id: 0,
          username: '$users.username',
          feedback: 1,
          ratings: 1
        },
      },
    ])
    .then((results) => {
      console.log(results);
      return response.json({ allRatings: results });

    })
  } catch (error) {
    console.log(error + '\n\nERROR getting ratings');
    return response.json({ error: 'Internal Server Error' });
  }
};


const updateRatings = async (request, response) => {
  const { jobID, freeLancerID, clientID, ratings, feedback } = request.body;
  console.log('Updating Ratings')
  try {
    const updatedRating = await Ratings.findOneAndUpdate(
      {
        jobID: jobID,
        freeLancerID: freeLancerID,
        userID: clientID,
      },
      {
        $set: {
          ratings,
          feedback,
        },
      },
      { new: true } // Return the updated document
    );

    if (!updatedRating) {
      return response.json({ error: "Rating not found" });
    }

    return response.json({ updatedRating, message: 'Thank you for your new feedback!' });
  } catch (error) {
    console.log(error + "\n\nERROR updating ratings");
    return response.json({ error: "Internal Server Error" });
  }
};

export {
  rateFreelancers,
  getFreelancerRatings,
  getFreelancerRatingsProgress,
  getRatings,
  getAllRatings,
  updateRatings
}