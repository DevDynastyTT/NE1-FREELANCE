const User = require("../models/userModel");
const userProfile = require("../models/userProfileModel");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { ObjectId } = require('mongodb')


// Handle termination events
process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

// Graceful shutdown function
function gracefulShutdown() {
  // Perform necessary cleanup actions
  // For example, update is_active to false for all users
  User.updateMany({}, { is_active: false })
    .then(() => {
      console.log('Server terminated gracefully. is_active set to false for all users.');
      process.exit(0); // Terminate the process
    })
    .catch((error) => {
      console.error('Error updating users:', error);
      process.exit(1); // Terminate the process with an error code
    });
}

//Login page
module.exports.login = async (request, response) => {
  try {
    const { email, password } = request.body;

    console.log('Attempting to log in')
    if (email == '') {
      console.log("Enter your email")
      return response.json({error: "Form Violation! Enter your email"})
    }
    if (password == '') {
      console.log("Enter your password")
      return response.json({error: "Form Violation! Enter your password"})
    }

    const user = await User.findOne({ email });
    if (!user)
      return response.json({ error: "Incorrect email or password", status: false });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return response.json({ error: "Incorrect email or password", status: false });
    
    user.password = undefined; //remove the user password for security
    
    request.session.user = user
    console.log('Stored session in session User')
    await User.findOneAndUpdate({email}, {$set:{is_active: true}})
    return response.json({ status: true, user });
  } catch (ex) {
    (ex);
  }
};
//Navbar
let count = 1
let logout = 0
module.exports.logOut = async (request, response) => {
  const user_id = request.body.id
  try {
    request.session.destroy((error)=> {
      if(error) console.log(error)
      else console.log('Session Termindated')
    })
    const logout = await User.findOneAndUpdate({_id: ObjectId(user_id)}, {$set: {is_active: false}}, {new: true})
    if(!logout){
      console.log("error logging out")
      return response.json({error: "Error logging out"})
    }
    
      console.log('User logged out successfully')
    return response.json({message: "User logged out successfully"})
  } catch (ex) {
    (ex);
  }
};

module.exports.userSession = async (request, response) => {
  const user = request.session.user
  console.log(user?.username || user)
  return user ? response.json({ status: true, user}) : response.json({ status: false, error: "User has no session"}) 
}

//Signup page
module.exports.register = async (request, response) => {
  try {
    const { username, email, password } = request.body;
    if (email == '') {
      console.log("Enter your email")
      return response.json({error: "Enter your email"})
    }
    if (username == '') {
      console.log("Enter your username")
      return response.json({error: "Enter your username"})
    }
    if (password == '') {
      console.log("Enter your password")
      return response.json({error: "Enter your password"})
    }
    const emailCheck = await User.findOne({ email });
    if (emailCheck)
      return response.json({ error: "Email already used", status: false });
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword)
    const user = await User.create({
      email,
      username,
      password: hashedPassword,
    });
    delete user.password;
    
    // Insert the user's ID into the profiles table.
    const profile = await userProfile.create({
      user_id: user.id,
      profile_picture: null
    });

    await User.findOneAndUpdate({email}, { $set: {is_active: true} })
    request.session.user = user
    request.session.profile = profile
    return response.json({ status: true, user, profile });
  } catch (ex) {
    (ex);
  }
};





//Profile page
module.exports.updateUser = async (request, response) => {
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
module.exports.updateProfile = async (request, response) => {
  const { userID, bio } = request.body;
  let update1 = false;
  let update2 = false;
  let profile_picture = '';

 
  if (request.file) {
    profile_picture = request.file.filename.toString('base64')
    console.log(profile_picture)
    console.log(request.file)
    // do something with the file
  } else {
    console.log('No file uploaded\n');
    // handle the case where no file was uploaded
  }
  console.log('Attempting to update profile');

  if(!userID) {
    console.log('You are not authorized to perform this action')
    return response.status(401).json({error: 'You are not authorized to perform this action'})
    }  
    console.log(`userID: ${userID}`);

  if(bio == 'undefined' && profile_picture == 'undefined') {
    console.log('You need to upload something')
    return response.status(403).json({error: 'You need to upload something'})
  }
  console.log(`bio: ${bio}`);
  console.log(`Profile Picture: ${profile_picture}`);

  try {
    if (profile_picture != 'undefined' && profile_picture != '') {
      console.log('Updating profile picture')
      const updatePicture = await userProfile.updateOne(
        { user_id: userID },
        { $set: { profile_picture } }
      );
      console.log('Updated picture successfully');
      update1 = true
    }

    if (bio != 'undefined' && bio != '') {
      const updateBio = await userProfile.updateOne(
        { user_id: userID },
        { $set: { bio } }
      );
      console.log('Updated bio successfully');
      update2 = true
    }
    if(update1 == true || update2 == true)
      response.status(200).json({ message: 'Profile updated successfully' })
    else
      response.status(500).json({ error: 'An unexpected error occurred. Try again.' })
  } catch (err) {
    console.error(`${err}\nUPDATE PROFILE ERROR!!`);
    return response.status(500).json({ error: 'Internal server error' });
  }
};
//Profile page
module.exports.getUserProfile = async (request, response) => {
  try {
    const userID = request.params.id;
    console.log(userID, " is id")
    // Find the profile and user data for the specified user ID.
    const profile = await userProfile.aggregate([
      { $match: { 
          user_id: ObjectId(userID) 
        } 
      },
      { $lookup: { 
          from: 'users', 
          localField: 'user_id', 
          foreignField: '_id', 
          as: 'user' 
        } 
      },
      { $unwind: '$user' },
      { $project: { 
          _id: '$user._id', 
          username: '$user.username', 
          profile_picture: 1, 
          bio: 1 
        } 
      },
    ]);

    console.log(profile, " is profile")
    if (profile.length === 0) {
      console.log("Profile not found")
      return response.status(404).json({ error: 'Profile not found' });
    }

    // Format the response data.
    const user_profile = {
      id: profile[0]._id,
      user_id: userID,
      profile_picture: profile[0].profile_picture,
      name: profile[0].username,
      bio: profile[0].bio,
    };

    user_profile.bio == undefined ? user_profile.bio = 'undefined' : null
    user_profile.profile_picture == undefined ? user_profile.profile_picture = 'undefined' : null

    console.log(user_profile)
    return response.status(200).json({ message: 'Profile fetched successfully', user_profile });
  } catch (ex) {
    (ex);
  }
};
//Message page
module.exports.getAllUsers = async (request, response) => {
  try {
    const users = await User.find(
      { _id: 
        { 
          $ne: request.params.id
        } 
    })
    users.forEach(user => {
      user.profile_picture == undefined ? users.profile_picture = 'undefined' : null
    })
    return response.json({users});
  } catch (ex) {
    (ex);
  }
};
//Message page
module.exports.getAllUserInfo = async (request, response) => {
  try {
    const userInfo = await User.find();
    response.json(userInfo);
  } catch (ex) {
    (ex);
  }
};
//Admin user info page
module.exports.countUsers = async(request, response) => {
  try{
  const user_count = await User.countDocuments();
  console.log('Total number of users: ',user_count);
  response.json(user_count);
}catch(error){
  console.log('Error counting users: ', error);
  response.status(500).json({ error: "Internal Server Error" });
}
};
