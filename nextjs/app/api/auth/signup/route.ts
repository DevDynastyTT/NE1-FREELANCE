const bcrypt = require('bcrypt')
import { NextResponse } from "next/server"

import { User } from "@models/userModel"
import { userProfile } from "@models/userProfileModel"
import { connectToDB } from "@utils/databaseConnection"

export async function POST(request: Request): Promise<NextResponse>{
    try{
        //Connect to Mongodb 
        await connectToDB() 

        const 
        { username, email, password } : 
        {username: string, email: string, password: string} = await request.json();

        //Input validations
        if (!email) {
          console.log("Enter your email")
          return new NextResponse(
            //Request body
            JSON.stringify({error: "Enter your email"}),
            {
                status: 404,
                headers: {'Content-Type': 'application/json'}
            })
        }
        if (!username) {
          console.log("Enter your username")
          return new NextResponse(
            //Request body
            JSON.stringify({error: "Enter your username"}),
            {
                status: 404,
                headers: {'Content-Type': 'application/json'}
            })
        }
        if (!password) {
          console.log("Enter your password")
          return new NextResponse(
            //Request body
            JSON.stringify({error: "Enter your password"}),
            {
                status: 404,
                headers: {'Content-Type': 'application/json'}
            })
        }

        //Check if email has already been taken once the user has been successfully validated
        const emailCheck = await User.findOne({ email });

        //If email already exists, return error
        if (emailCheck){
            console.error(email, ' already exists')
            return new NextResponse(
            //Request body
            JSON.stringify({ error: "Email already exists"}),
            {
                status: 404,
                headers: {'Content-Type': 'application/json'}
            })
        }

        //Encrypt password
        const hashedPassword = await bcrypt.hash(password, 10);
        //Create a new user with the hashed password
        const user = await User.create({
          email,
          username,
          password: hashedPassword,
        });

        //Delete the user password property for security
        user ? delete user?.password : null;
        
        // Insert the user's ID into the profiles table.
        const profile = await userProfile.create({
          user_id: user.id,
          profile_picture: null
        });
    
        //Let everyone know that the user is active
        await User.findOneAndUpdate({email}, { $set: {is_active: true} })
        // request.session.user = user
        // request.session.profile = profile
        console.log('Registration Successful')
        return new NextResponse(
            // Request body
            JSON.stringify({ message: "Registration Successful"}),
            {
                status: 200,
                headers: {'Content-Type': 'application/json'}
            })
    } catch(error:any) {
        console.log(error)
        return new NextResponse(
            JSON.stringify({ error: 'Internal Server Error'}),
            {
                status: 500,
                headers: {'Content-Type': 'application/json'}
            }
        )
    }
}

//For E2E Testing Purposes
export async function DELETE(request: Request): Promise<NextResponse> {
    try{
        await connectToDB()

        const { searchParams } = new URL(request.url)

        const email = searchParams.get('email')

        //Find user with email
        console.log('Deleting', email, ', please wait...')
        const user = await User.findOne({ email }).exec();
        if(!user){
            console.error('User not found')
            return new NextResponse(
                JSON.stringify({ error: 'User not found'}),
                    {
                        status: 404,
                        headers: {'Content-Type': 'application/json'}
                    }
            )
        }
        const deleteUser = await User.findOneAndDelete({ email }).exec();

        const _userProfile = await userProfile.findOneAndDelete({ user_id: user._id }).exec();

        if(!deleteUser || !_userProfile){
            console.log('There was an issue deleting the user data')
            return new NextResponse(
                JSON.stringify({error: 'There was an issue deleting your user data'}),
                    {
                        status: 404,
                        headers: {'Content-Type': 'application/json'}
                    }
            )
        }

        console.log('User Deleted')
        return new NextResponse(
                JSON.stringify({message: "Deleted User and Their Profile"}),
                    {
                        status: 200,
                        headers: {'Content-Type': 'application/json'}
                    }
                )
    }catch(error){
        console.log(error)
        return new NextResponse(JSON.stringify(
            { error: 'Internal Server Error'}),
                {
                    status: 404,
                    headers: {'Content-Type': 'application/json'}
                }
            )
    }
}