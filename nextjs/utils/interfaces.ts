import {NextRouter } from 'next/router';


export interface Jobs {
  _id: string;
  userID: string;
  username: string;
  title: string;
  description: string;
  thumbnail: string;
  price: number;
  category: string;

}

export interface JobCategory {
    name: string;
}

export interface Services {
  title: string,
  description: string,
  thumbnail: string,
} 

export interface User {
  _id: string;
  username: string;
  email: string;
  password: string;
  isStaff: boolean;
  isActive: boolean;
  dateJoined: string;
}

export interface Profile {
  _id: string;
  userID: string;
  bio: string;
  profilePicture: string;
  creditCard: number;
}



export interface RootLayoutProps {
  router: NextRouter;
  children: React.ReactNode;
}