const bcrypt = require('bcrypt')
import { NextResponse } from 'next/server'

import { User } from '@models/userModel';
import { connectToDB } from '@utils/databaseConnection';

export async function POST(request:Request): Promise<NextResponse>{
  try {
    await connectToDB(); //Connect to Mongodb Database

      const { email, password } : {email:string, password:string} = await request.json();
  
      console.log('Attempting to log in')
      if (!email) {
        console.log("Enter your email")
        return NextResponse.json({error: "Form Violation! Enter your email"})
      }
      if (!password) {
        console.log("Enter your password")
        return NextResponse.json({error: "Form Violation! Enter your password"})
      }

      //Check if user exists based on given email
      const user = await User.findOne({ email });
      
      //If user doesn't exist, return error
      if (!user) {
        console.log('Incorrect Email')
        return new NextResponse(
          //Response Body
          JSON.stringify({ error: 'Incorrect email' }),
          //Extras
          { 
            status: 404, 
            headers: { 'Content-Type': 'application/json' } 
          });
      }

      //If user does exist, compare and Decrypt password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      
      //If invalid password, return error
      if (!isPasswordValid) {
        console.log('Incorrect password')
        return new NextResponse(
          //Response body
          JSON.stringify({error: "Incorrect password"}),
          {
            status: 404,
            headers: { 'Content-Type': 'application/json'}
          })
      }
      // remove the user password for security
      user.password = undefined as any; 
  
      // request.session.user = user
      // if(!request.session.user){
      //   return NextResponse.json({ error: "That was an issue creating a session for you", status: false });
      // }
      // console.log('Stored session in session User', request.session.user)
      
      
      //Let everyone know that the user is active
      await User.findOneAndUpdate({email}, {$set:{is_active: true}})
      
      
      //Return the user object
      return NextResponse.json({ status: 200 });
      
  } catch (error:any) {
    console.error('An unexpected error occurred in your query:', error.message);
    return NextResponse.json({ status: 500, error: 'Failed' });
  }
}
