//Mongo database
const user = {
    name: "Aaron",
    email: "aaron@gmail.com",
    password: "password"
}

//Get from request body
const password = "aaron1@gmail.com"

User.find({password})