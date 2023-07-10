import User from '../models/userModel';
import userProfile from "../models/userProfileModel";
import { SessionType } from '../types';
import bcrypt from "bcrypt";
const { ObjectId } = require('mongodb');
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
// Handle termination events
process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

/**
 * Performs a graceful shutdown of the server.
 * Updates the 'is_active' field to false for all users.
 * Terminates the process afterwards.
 */
function gracefulShutdown() {
    User.updateMany({}, { is_active: false })
      .then(() => {
        console.log('Server terminated gracefully. is_active set to false for all users.');
        process.exit(0);
      })
      .catch((error) => {
        console.error('Error updating users:', error);
        process.exit(1);
      });
  }
  
// Login User
const login = async (request, response) => {
    try {
      // Extract email and password from request body
      const { email, password } = request.body;
  
      // Check if email is provided
      if (!email) {
        return response.status(400).json({ error: "Form Violation! Enter your email" });
      }
  
      // Check if password is provided
      if (!password) {
        return response.status(400).json({ error: "Form Violation! Enter your password" });
      }
  
      // Find user by email
      const user = await User.findOne({ email });
  
      // Check if user exists
      if (!user) {
        return response.status(400).json({ error: "Invalid Email" });
      }
  
      // Check if password is valid
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return response.status(400).json({ error: "Invalid Password" });
      }
  
      // Set user in session
      request.session.user = user;
  
      // Check if session user is set
      if (!request.session.user) {
        return response.status(500).json({ error: "An error occurred creating a session" });
      }
  
      // Remove password from user object
      const userObj:SessionType = user.toObject();
      delete userObj?.password;
  
      // Set user as active
      await User.updateOne({ email }, { $set: { isActive: true } });
  
      // Return logged-in user object
      return response.json({ user: userObj });
  
    } catch (error) {
      // Log and return error message
      console.error(error.message);
      return response.status(500).json({ error: "An error occurred" });
    }
  };
  
//Signup User
const signup = async (request, response) => {
try {
    console.log('Registering User')
    const { username, email, password } = request.body;
    if (!email) {
    console.log("Enter your email")
    return response.status(400).json({error: "Enter your email"})
    }
    if (!username) {
    console.log("Enter your username")
    return response.status(400).json({error: "Enter your username"})
    }
    if (!password) {
    console.log("Enter your password")
    return response.status(400).json({error: "Enter your password"})
    }

    const emailCheck = await User.findOne({ email });

    if (emailCheck) return response.status(409).json({ error: "Email already used"});
    
    console.log('Creating User...')
    const hashedPassword = await bcrypt.hash(password, 10);

    
    const user = new User({
      email,
      username,
      password: hashedPassword,
    });

    const savedUser = await user.save();
        // Convert the Mongoose document to a plain JavaScript object
    const userObject:SessionType = savedUser.toObject();

    const userprofile = new userProfile({
      userID: user?._id,
      profilePicture: 'default.png',
      bio: 'undefined'
    })

    await userprofile.save();

    // Remove the password field from the plain JavaScript object
    delete userObject?.password;
    console.log('Created User', userObject.username);

    request.session.user = savedUser;
    return response.status(200).json({user: userObject });
    
} catch (error) {
    console.log(error.message);
    return response.status(500).json({error:error.message})
}
};

//Profile page
const updateUser = async (request, response) => {
  const { userID, username, email, password} = request.body;

  console.log(`User ID: ${userID}, Username: ${username}, Email: ${email}, Password: ${password}`)
  try {
    // Find the user by ID
    const user = await User.findById(userID);
    if (!user) {
      return response.status(404).json({ error: 'User not found' });
    }

    // Update the user's fields
    user.username = username || user.username;
    user.email = email || user.email;
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    // Save the updated user
    await user.save();

    // Return the updated user object
    console.log('User account updated')
    return response.json({ error: 'Profile updated', user });
  } catch (ex) {
    console.log(ex);
    return response.status(500).json({ error: 'Internal Server Error' });
  }
};
//Profile page
const updateProfile = async (request, response) => {
  const { userID, bio } = request.body;
  let update1 = false;
  let update2 = false;
  let profilePicture = '';
  const bucketName = 'ne1-freelance'; // Replace with your Wasabi bucket name

  try {
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

      profilePicture = fileName;
      console.log('File uploaded successfully');
    } else {
      console.log('No file uploaded');
      // handle the case where no file was uploaded
    }

    console.log('Attempting to update profile');

    if (!userID) {
      console.log('You are not authorized to perform this action');
      return response.status(401).json({ error: 'You are not authorized to perform this action' });
    }
    if (bio == 'undefined' && profilePicture == 'undefined') {
      console.log('You need to upload something');
      return response.status(403).json({ error: 'You need to upload something' });
    }

    if (profilePicture !== 'undefined' && profilePicture !== '') {
      console.log('Updating profile picture');

      await userProfile.updateOne({ userID }, { $set: { profilePicture } });
      console.log('Updated picture successfully');
      update1 = true;
    }

    if (bio !== 'undefined' && bio !== '') {
      await userProfile.updateOne({ userID }, { $set: { bio } });
      console.log('Updated bio successfully');
      update2 = true;
    }

    if (update1 || update2) {
      // Generate pre-signed URL for the profile picture
      const signedUrl = await s3.getSignedUrlPromise('getObject', {
        Bucket: bucketName,
        Key: profilePicture,
        Expires: 3600, // URL expiration time in seconds
      });

      return response.status(200).json({ message: 'Profile updated successfully', signedUrl });
    } else {
      return response.status(500).json({ error: 'An unexpected error occurred. Try again.' });
    }
  } catch (err) {
    console.error(`${err}\nUPDATE PROFILE ERROR!!`);
    return response.status(500).json({ error: 'Internal server error' });
  }
};

//Profile page
const getUserProfile = async (request, response) => {
  try {
    const { id } = request.params;
    // Find the profile and user data for the specified user ID.
    const profile = await userProfile.aggregate([
      { $match: { userID: id } },
      {
        $lookup: {
          from: 'users',
          localField: 'userID',
          foreignField: '_id',
          as: 'profile',
        },
      },
      {
        $project: {
          profilePicture: 1,
          bio: 1,
        },
      },
    ]);

    if (profile.length === 0) {
      console.log("Profile not found");
      return response.status(404).json({ error: 'Profile not found' });
    }

    const matchedUserProfile = await User.findById({_id: id});

    const profilePictureURL = await getProfilePictureURL(profile[0]?.profilePicture);

    // Format the response data.
    const user_profile = {
      _id: profile[0]._id,
      userID: id,
      profilePicture: profilePictureURL,
      username: matchedUserProfile?.username,
      bio: profile[0].bio,
    };

    // Check if the properties are undefined and assign 'undefined' if necessary.
    user_profile.bio ??= 'undefined';
    user_profile.profilePicture ??= 'undefined';
    
    return response.status(200).json({ message: 'Profile fetched successfully', user_profile });
  } catch (error) {
    console.error(error);
    return response.status(500).json({ error: 'Internal Server Error' });
  }
};


const getProfilePictureURL = async (fileName:string): Promise<string> => {
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
    console.error(error);
    return 'undefined'
  }
}
//Message page
const getAllUsers = async (request, response) => {
  try {
    const users: { profilePicture?: string }[] = await User.find(
      { _id: { $ne: request.params.id } }
    );
    
    const updatedUsers = users.map(user => ({
      ...user,
      profilePicture: user.profilePicture || 'undefined'
    }));
    
    return response.json({ users: updatedUsers });
    
  } catch (ex) {
    (ex);
  }
};
//Message page
const getAllUserInfo = async (request, response) => {
  try {
    const userInfo = await User.find().lean();

    if(!userInfo){
      console.log('Users not found');
      return response.status(404).json({ error: 'Users not found' });
    }
    return response.status(200).json({userInfo});
  } catch (error) {
    console.error(error.message);
    return response.status(500).json({ error: 'Internal Server Error' });
  }
};
//Admin user info page
const countUsers = async(request, response) => {
  try{
  const user_count = await User.countDocuments();
  console.log('Total number of users: ',user_count);
  response.json(user_count);
}catch(error){
  console.log('Error counting users: ', error);
  response.status(500).json({ error: "Internal Server Error" });
}
};

export {
  login,
  signup,
  updateUser,
  updateProfile,
  getUserProfile,
  getAllUsers,
  getAllUserInfo,
  countUsers
}