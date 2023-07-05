import axios from "axios"
import { Dispatch, SetStateAction } from "react"
import { JobsType, SessionType } from './types';

async function fetchJobs(
  getAllJobs: string, 
  setJobs: Dispatch<SetStateAction<JobsType[]>>, 
  setMessage: Dispatch<SetStateAction<string>>): Promise<void> {

      axios.get(getAllJobs).then(response => {
        const data = response.data
        if(response.status !== 200){
          setMessage(data.error)
          return
        }
        console.log(data.reversedJobList)
        setJobs(data.reversedJobList)
      })
      .catch(error => {
        console.log('Error Fetching Jobs: ' + error)
      })
      // setJobs(data.reversedJobList)

}

function getUserSession(setSession: Dispatch<SetStateAction<SessionType | undefined>>):void{
  const checkSession = sessionStorage.getItem('user');
  if (checkSession) {
      try {
          const parsedSession = JSON.parse(checkSession);
          setSession(parsedSession);
      } catch (error) {
          console.error('Error parsing session:', error);
      }
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
  fetchJobs,
  getUserSession,
  fetchCategories,
};
