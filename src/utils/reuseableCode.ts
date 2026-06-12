import axios from "axios"
import { SessionType } from './types';



function getUserSession(): SessionType | undefined {
  const checkSession = sessionStorage.getItem('user');

  if (checkSession) {
    try {
      const parsedSession = JSON.parse(checkSession);
      return parsedSession;
    } catch (error) {
      console.error('Error parsing session:', error);
      return undefined;
    }
  } else {
    if (window.location.pathname === '/auth/messages') {
      alert('Login to view this page');
      window.location.href = '/auth/login';
    }
    return undefined;
  }
}


async function fetchCategories(setJobCategories:any, getCategories:any) {

  try{

      const response = await axios.get(getCategories)
      const data = response.data

      if(response.status !== 200){
        console.error(data.error)
        return
      }
      setJobCategories(data.categories)
  
  }catch(error){
      console.log(`ERROR FETCHING CATEGORIES:\n ${error}`)
  }
}


export {
  getUserSession,
  fetchCategories,
};
