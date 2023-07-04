import { ObjectId } from "mongodb";

export type JobsType = {
  _id: ObjectId;
  freeLancerID: string;
  username: string;
  title: string;
  description: string;
  thumbnail: string;
  price: number;
  category: string;
}

//Extend Jobs and create more variables
export type JobDetails = JobsType & {
  profilePicture?: string;
  userBio?:string;
}

export type JobCategory = {
    name: string;
}

export type Ratings = {
  jobID: string,
  freeLancerID: string,
  userID:string,
  ratings: number,
  feedback: string,
  date: string
}

export type AllRatings = Ratings & {
  username: string;
}

export type Services = {
  title: string,
  description: string,
  thumbnail: string,
} 



export type SessionType = {
  _id: string;
  username: string;
  email: string;
  password?: string;
  isStaff: boolean;
  isActive: boolean;
  dateJoined: string;
}



export type Profile = {
  _id: string;
  userID: string;
  bio: string;
  profilePicture: string;
  creditCard: number;
}
