import '../../static/css/jobs/jobDetails.css'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import StarRating from "react-star-ratings";
import {jobDetails, getRatings, getAllRatings, getFreelancerRatings, getFreelancerRatingsProgress}  from '../utils/APIRoutes'
import GlobalNavbar from "../GlobalNavbar";
import RatingForm from '../RatingsForm';
import ReportForm from './ReportForm';
export default function JobDetails({currentUser, setCurrentUser}){

    const navigate = useNavigate();
    const { jobID } = useParams();
    
    let [jobs, setJobs] = useState([])
    const [stars, setStars] = useState(0);
    let [formType, setFormType] = useState('insert')

    let [message, setMessage] = useState('Searching for available jobs')
    let [averageRating, setAverageRating] = useState(0)
    let [averageRatingProgress, setAverageRatingProgress] = useState(0)
    let [userRatings, setUserRatings] = useState([])
    let [freeLancerRatings, setFreeLancerRatings] = useState(0)
    let [freeLancerRatingsProgress, setFreeLancerRatingsProgress] = useState(0)
    let [allRatings, setAllRatings] = useState([])
    let [isSearching, setIsSearching] = useState(false)
    let [reportForm, setReportForm] = useState(false)
    let jobInfo = []
    let [jobFee, setJobFee] = useState(0)
    let [totalFee, setTotalFee] = useState(0)
    const serviceFee = 2.50 //charges applied for buisness to make money
    let [isLoading, setIsLoading] = useState(false)
    const ratingCounts = {
      5: freeLancerRatingsProgress['5'] || 0, // Number of 5-star ratings
      4: freeLancerRatingsProgress['4'] || 0, // Number of 4-star ratings
      3: freeLancerRatingsProgress['3'] || 0, // Number of 3-star ratings
      2: freeLancerRatingsProgress['2'] || 0,  // Number of 2-star ratings
      1: freeLancerRatingsProgress['1'] || 0   // Number of 1-star ratings
    };
    const totalRatings = Object.values(ratingCounts).reduce((sum, count) => sum + count, 0);
    const starPercentages = {};
    for (const [star, count] of Object.entries(ratingCounts)) {
      const percentage = (count / totalRatings) * 100;
      starPercentages[star] = Math.round(percentage);
    }
    
  
    
      function fetchRatings() {
        axios
          .post(getRatings, {
            jobID: jobs[0].job_id,
            freeLancerID: jobs[0].seller_id,
            clientID: currentUser._id,
          })
          .then((response) => {
            const data = response.data;
    
            if (data.error) {
              console.error(data.error);
              setMessage(data.error);
              return;
            }
    
            setUserRatings(data.totalRatings);
            console.log('User current rating', data.totalRatings);
          })
          .catch((error) => {
            console.log(error);
            setMessage(error);
          });
      }

      function fetchFreelancerRatingsProgress() {
        axios
          .post(getFreelancerRatingsProgress, {
            jobID: jobs[0].job_id,
            freeLancerID: jobs[0].seller_id,
          })
          .then(response => {
            const data = response.data;
            if (data.error) {
              console.error(data.error);
              setMessage(data.error);
              return;
            }
            setFreeLancerRatingsProgress(data.freeLancerRatings);
            setAverageRatingProgress(Math.min(data.freeLancerRatings / 5, 5));
            console.log(data.freeLancerRatings);
          })
          .catch(error => {
            console.log(error);
            setMessage(error);
          });
      }
      
    
      function fetchAllRatings() {
        axios
          .post(getAllRatings, { jobID: jobs[0].job_id,
            freeLancerID: jobs[0].seller_id})
          .then((response) => {
            const data = response.data;
    
            if (data.error) {
              console.error(data.error);
              setMessage(data.error);
              alert(data.error)
              return;
            }
    
            setAllRatings(data.allRatings);
            console.log('ALL RATINGS!!')
            console.log(data.allRatings);
          })
          .catch((error) => {
            console.log(error);
            setMessage(error);
          });
      }

      function fetchFreelancerRatings(){
        axios
          .post(getFreelancerRatings, {
            jobID: jobs[0].job_id,
            freeLancerID: jobs[0].seller_id,
          })
          .then(response => {
            const data = response.data;
            if (data.error) {
              console.error(data.error)
              setMessage(data.error)
              return
            }
            setFreeLancerRatings(data.freeLancerRatings)
            setAverageRating(Math.min(data.freeLancerRatings / 5, 5))
            console.log(data.freeLancerRatings)
          })
      }

      function fetchJob() {
        console.log('Fetching Jobs');
    
        axios
          .get(`${jobDetails}/${jobID}`)
          .then((response) => {
            const data = response.data;
    
            if (data.error) {
              console.log(data.error);
              setMessage(data.error);
              return;
            }
    
            setMessage(data.message);
            setJobs(data.jobDetails);
            setJobFee(data.jobDetails[0].price);
            setTotalFee(serviceFee + data.jobDetails[0].price);

            console.log(data.jobDetails);
          })
          .catch((error) => {
            console.log('Error Fetching Jobs: ' + error);
            setMessage(error);
          });
      }

      function renderReportForm(){
        if(reportForm){
          setReportForm(false)
          console.log('report Form is ', reportForm)
        }else if(!reportForm){
          setReportForm(true)
          console.log('report Form is ', reportForm)
        }
      }
    
      useEffect(() => {
        fetchJob();
      }, []);
    
      useEffect(() => {
        if (jobs.length > 0) {
          fetchRatings();
          fetchAllRatings();
          fetchFreelancerRatings()
          fetchFreelancerRatingsProgress()
          
        }
      }, [jobs]);

      useEffect(()=> {
        //jobInfo will be sent the reportForm
        if (jobs.length > 0 && reportForm) {
          jobInfo.push({
            job_id: jobs[0].job_id,
            job_title: jobs[0].title,
            user_id: currentUser._id,
            freelancer_id: jobs[0].seller_id,
          })
        }
      }, [jobs, reportForm])
return(
    <>
        <GlobalNavbar currentUser={currentUser} setCurrentUser={setCurrentUser}/>
            <br />
            {jobs ? (
              <main className="jobsDetails-main-container">

                {jobs && (
                    jobs.map((job, index) => {
                        return(

                            <div className="card" key ={index++}>
                                <section className="job">
                                    <div className="job-title-container">
                                        <h1>{job.title}</h1>

                                        <div className="flex-wrapper">
                                          <div className="freelancer-profile-picture-container">
                                            {jobs[0].profile_picture == null ? (
                                                    <img id="title-profile-picture" src={`http://localhost:3000/images/default.jpeg`} alt="thumbnail" />
                                                ): (
                                                    <img id="title-profile-picture" src={`http://localhost:3000/images/${jobs[0].profile_picture}`} alt="thumbnail" />
                                                )}
                                          </div>
                                      
                                            <span className="userRating">
                                            <span id='username'>{job.username}</span>
                                                <span id='pipe'>|</span> 
                                                <span className="starRatings">
                                                    <StarRating
                                                      rating={averageRating}
                                                      starRatedColor="gold"
                                                      starEmptyColor="lightgrey"
                                                      starDimension="30px"
                                                      starSpacing="2px"
                                                    />
                                                  {averageRating} ({freeLancerRatings})
                                                </span>

                                              
                                            </span>
                                        
                                        </div>
                                    </div>

                                    <br />

                                    <div className="thumbnail-container">
                                        <div className="paper">
                                            <img id="job-thumbnail" src={`http://localhost:3000/images/${job.thumbnail}`} alt="thumbnail" />

                                        </div>
                                    </div>      
                                    <br/>
                                    <div className="ratings-list">
                                    {currentUser && userRatings && userRatings.length == 0 ? (
                                        <RatingForm jobID={jobs[0].job_id} clientID={currentUser._id} freeLancerID={jobs[0].seller_id} formType={formType}/>
                                        ) : (
                                            
                                                <div className="yourReview">
                                                <h3>Your Review</h3>
                                                <div>
                                                    <StarRating
                                                      rating={userRatings[0].ratings}
                                                      starRatedColor="gold"
                                                      starEmptyColor="lightgrey"
                                                      starDimension="30px"
                                                      starSpacing="2px"
                                                    />
                                                </div>
                                                <p className="feedback">{userRatings[0].feedback}</p>
                                                <button className="form-control editReview-btn" onClick={() => {
                                                  setFormType('update')
                                                  setUserRatings([])
                                                }}>
                                                    Edit your review
                                                </button>
                                                </div>
                                        )}
                                        <br/><br/>
                                        <h2>Reviews</h2>
                                                  {allRatings && allRatings.length > 0 ? (
                                                    <>
                                                    <div className="rating-section">
                                                    <div className="star-rating">
                                                      <div className="stars">5 stars</div>
                                                      <div className="progress-bar">
                                                        <div className="progress" style={{ width: `${starPercentages[5]}%` }}></div>
                                                      </div>
                                                      <div className="count">{ratingCounts[5]}</div>
                                                    </div>

                                                    <div className="star-rating">
                                                      <div className="stars">4 stars</div>
                                                      <div className="progress-bar">
                                                        <div className="progress" style={{ width: `${starPercentages[4]}%` }}></div>
                                                      </div>
                                                      <div className="count">{ratingCounts[4]}</div>
                                                    </div>

                                                    <div className="star-rating">
                                                      <div className="stars">3 stars</div>
                                                      <div className="progress-bar">
                                                        <div className="progress" style={{ width: `${starPercentages[3]}%` }}></div>
                                                      </div>
                                                      <div className="count">{ratingCounts[3]}</div>
                                                    </div>

                                                    <div className="star-rating">
                                                      <div className="stars">2 stars</div>
                                                      <div className="progress-bar">
                                                        <div className="progress" style={{ width: `${starPercentages[2]}%` }}></div>
                                                      </div>
                                                      <div className="count">{ratingCounts[2]}</div>
                                                    </div>

                                                    <div className="star-rating">
                                                      <div className="stars">1 stars</div>
                                                      <div className="progress-bar">
                                                        <div className="progress" style={{ width: `${starPercentages[1]}%` }}></div>
                                                      </div>
                                                      <div className="count">{ratingCounts[1]}</div>
                                                    </div>

                                                    {/* Repeat the above structure for other star levels */}
                                                    {/* Replace "5" with the respective star level */}
                                                  </div>

                                                      {allRatings.map((rating, index) =>(
                                                          <div className="ratings-card" key={index++}>
                                                              <span><b>{rating.username}</b></span>
                                                            <StarRating
                                                                rating={rating.ratings}
                                                                starRatedColor="gold"
                                                                starEmptyColor="lightgrey"
                                                                starDimension="30px"
                                                                starSpacing="2px"
                                                              />
                                                          <p className="feedback-list">{rating.feedback}</p>
                                                          </div>
                                                      ))} 
                                                    </>
                                                  ): <p>User has no reviews</p>}
                                                  
                                    </div>
                                </section>

                              {jobs[0].seller_id !== currentUser._id && (                        
                                <>
                                  {currentUser ? (
                                    <>
                                      <section className="payment-details">

                                        <div className="job-title">

                                          <div className="job-thumbnail">
                                            <img src={`http://localhost:3000/images/${jobs[0].thumbnail}`} alt="" />
                                          </div>
                                      
                                          <p>{jobs[0].title}</p>
                                        </div>

                                        <div className="prices">

                                          <div className="job-fee">
                                              <p className="cost">${jobFee.toFixed(2)}</p>
                                            </div>

                                          <div className="job-description">
                                            <p>{jobs[0].description}</p>
                                          </div>
                                        </div>
                                        <button type="button" className="form-control continue"
                                        onClick={()=> setReportForm(true)}>Report</button>
                                        <button type="submit" className="form-control continue"
                                        onClick={()=> navigate(`/members/checkout/${jobs[0].job_id}`)}>Continue -&gt;</button>
                                      </section>

                                      {reportForm && <ReportForm showForm={true} setReportForm={setReportForm} jobInfo={jobInfo}/> }
                                    </>
                                    
                                  ) : (
                                    <button className='form-control' disabled style={{backgroundColor: "grey", color: "white"}}>Log in to contact {jobs[0].username}</button>
                                  )}
                                </>
                              )}

                            </div>
                            
                        )
                    })




                )}

                </main>
            ): <h1>Loading Please Wait...</h1>}
           
          
    </>
)
}