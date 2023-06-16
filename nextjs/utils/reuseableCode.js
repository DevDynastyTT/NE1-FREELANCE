import axios from "axios"

function fetchJobs(getAllJobs, setJobs, setMessage){

      axios.get(getAllJobs)
      .then(response => {
        const data = response.data
        if(data.error){
          setMessage(data.error)
          return
        }
        // console.log(data.reversedJobList)
        setJobs(data.reversedJobList)
      })
      .catch(error => {
        console.log('Error Fetching Jobs: ' + error)
      })
      // setJobs(data.reversedJobList)

}

async function fetchCategories(setJobCategories, getCategories) {

  try{

      const response = await axios.get(getCategories)
      const data = response.data

      if(!data.categories){
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
  fetchCategories,
};
