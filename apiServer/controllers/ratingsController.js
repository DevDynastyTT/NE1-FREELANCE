const Ratings = require('../models/ratingsModel')
const User = require('../models/userModel');

const { ObjectId } = require('mongodb')

module.exports.rateFreelancers = async(request, response) => {
    const { jobID, freeLancerID, clientID,  ratings, feedback } = request.body;
    
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

module.exports.getFreelancerRatings = async (request, response) => {
  const { jobID, freeLancerID } = request.body;
  console.log('FreelancerID:', freeLancerID)
  console.log('jobID:', jobID)
  try {
    const freeLancerRatings = await Ratings.aggregate([
      {
        $match: {
          jobID: ObjectId(jobID),
          freeLancerID: ObjectId(freeLancerID)
        }
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

module.exports.getFreelancerRatingsProgress = async (request, response) => {
  const { jobID, freeLancerID } = request.body;

  try {
    const freeLancerRatings = await Ratings.aggregate([
      {
        $match: {
          jobID: ObjectId(jobID),
          freeLancerID: ObjectId(freeLancerID),
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


module.exports.getRatings = async(request, response) => {

    const { jobID, freeLancerID, clientID } = request.body
    // console.log(jobID, ' is jobID', freeLancerID, ' is freelancerID', clientID, ' is clientID')
    console.log(clientID, ' is clientID')
    try{
        const totalRatings = await Ratings.aggregate([
        //stage1
        {
            $match: {
                "jobID": ObjectId(jobID),
                "freeLancerID": ObjectId(freeLancerID),
                "userID": ObjectId(clientID)
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

module.exports.getAllRatings = async (request, response) => {
  const { jobID, freeLancerID } = request.body;
  try {
    await Ratings.aggregate([
      {
        $match: {
          "jobID": ObjectId(jobID),
          "freeLancerID": ObjectId(freeLancerID),
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
      // results will contain an array of objects with the "username" field
      // const usernames = results.map((result) => result.username);
      // console.log(results);
      return response.json({ allRatings: results });

    })
  } catch (error) {
    console.log(error + '\n\nERROR getting ratings');
    return response.json({ error: 'Internal Server Error' });
  }
};

module.exports.updateRatings = async (request, response) => {
  const { jobID, freeLancerID, clientID, ratings, feedback } = request.body;
  console.log('Updating Ratings')
  try {
    const updatedRating = await Ratings.findOneAndUpdate(
      {
        jobID: ObjectId(jobID),
        freeLancerID: ObjectId(freeLancerID),
        userID: ObjectId(clientID),
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
