import {NextRouter } from 'next/router';

export type Jobs = {
  _id: string;
  userID: string;
  username: string;
  title: string;
  description: string;
  thumbnail: string;
  price: number;
  category: string;

}

export type JobCategory = {
    name: string;
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
  password: string;
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



export type RootLayoutProps = {
  router: NextRouter;
  children: React.ReactNode;
}