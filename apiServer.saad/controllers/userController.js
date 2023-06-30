const User = require("../models/userModel");
const bcrypt = require("bcrypt");


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

/**
 * Logs in a user.
 *
 * @param {Object} request - The request object.
 * @param {Object} response - The response object.
 * @return {Object} The logged-in user object.
 */
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
    const userObj = user?.toObject();
    delete userObj?.password;

    // Set user as active
    await User.updateOne({ email }, { $set: { is_active: true } });

    // Return logged-in user object
    return response.json({ user: userObj });

  } catch (error) {
    // Log and return error message
    console.error(error.message);
    return response.status(500).json({ error: "An error occurred" });
  }
};

module.exports = {
  login
};

//Signup page
module.exports.register = async (request, response) => {
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
    const userObject = savedUser.toObject();

    // Remove the password field from the plain JavaScript object
    delete userObject.password;
    console.log('Created User', userObject.username);

    request.session.user = savedUser;
    return response.status(200).json({user: userObject });
   
  } catch (error) {
    console.log(error.message);
    return response.status(500).json({error:error.message})
  }
};
