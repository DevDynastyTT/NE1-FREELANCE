export type JobsType = {
  _id: string;
  freeLancerID: string;
  username: string;
  title: string;
  description: string;
  thumbnail: string;
  price: number;
  category: string;
}

export type JobDetails = JobsType & {
  profilePicture?: string;
  userBio?: string;
}

export type JobCategory = {
  name: string;
}

export type Ratings = {
  jobID: string;
  freeLancerID: string;
  userID: string;
  ratings: number;
  feedback?: string;
  date: Date | string;
}

export type AllRatings = Ratings & {
  username: string;
}

export type Services = {
  title: string;
  description: string;
  thumbnail: string;
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

export type RecentChatsType = {
  userID: string;
  sender?: string;
  newMessage?: string;
  username: string;
  email: string;
  isStaff: boolean;
  isActive: boolean;
  dateJoined: string;
}

export type Profile = {
  userID: string;
  bio?: string;
  profilePicture?: string;
  creditCard?: number;
}

export type MessagesType = {
  content: string;
  file?: string | { name: string; url: string };
  sender: string;
  receiver: string;
  isSender: boolean;
  sentAt: string;
}
