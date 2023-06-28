import axios from "axios";
import React, { useState, useEffect, FormEvent } from "react";
import StarRating from "react-star-ratings";
import { rateFreelancer, updateRatings } from "../utils/APIRoutes";

export default function RatingForm(
  { formType, jobID, clientID, freeLancerID }: 
  { formType:string, 
    jobID:string, 
    clientID:string, 
    freeLancerID:string}) {

  const [stars, setStars] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>();
  const [message, setMessage] = useState<string>()

  async function rateJob(event:FormEvent<HTMLFormElement>) {
    event.preventDefault()

    try {
      const response = await axios.post(rateFreelancer, {
        jobID, clientID, freeLancerID, 
        ratings: stars, 
        feedback
      });

      const data = response.data

      if(data.error) {
        setMessage(data.error)
        alert(data.error)
        return
      }

      alert(data.message);
      setStars(0);
      setFeedback("");
      window.location.reload()

    } catch (error) {
      alert("Failed to Rate rating. Please try again later.");
      console.error(error);
    }
  }

  async function update(event:FormEvent<HTMLFormElement>) {
    event.preventDefault()

    try {
      const response = await axios.post(updateRatings, {
        jobID, clientID, freeLancerID, 
        ratings: stars, 
        feedback
      });

      const data = response.data

      if(data.error) {
        setMessage(data.error)
        alert(data.error)
        return
      }

      alert(data.message);
      setStars(0);
      setFeedback("");
    window.location.reload()

    } catch (error) {
      alert("Failed to submit rating. Please try again later.");
      console.error(error);
    }
  }



   return (
    <>
    {formType == "insert" ? (
      <form className="rating-form" onSubmit={rateJob}>
      <h3>Leave a rating</h3>

      <div>
        <StarRating
          rating={stars}
          starRatedColor="gold"
          starHoverColor="gold"
          starEmptyColor="lightgrey"
          starDimension="30px"
          starSpacing="2px"
          changeRating={(newRating) => setStars(newRating)}
        />
      </div>

      <div>
        <textarea className="form-control"
          value={feedback}
          onChange={(event) => setFeedback(event.target.value)}
          placeholder="Leave a comment"
          style={{backgroundColor: "white", color: "black"}}
        ></textarea>
      </div>

      <button type="submit" className="form-control" style={{marginTop: "5%"}}>Rate</button>
    </form>
    ): (
      <form className="rating-form" onSubmit={update}>
        <h3>Leave a rating</h3>

        <div>
          <StarRating
            rating={stars}
            starRatedColor="gold"
            starHoverColor="gold"
            starEmptyColor="lightgrey"
            starDimension="30px"
            starSpacing="2px"
            changeRating={(newRating) => setStars(newRating)}
          />
        </div>

        <div>
          <textarea  className="form-control"
            value={feedback}
            onChange={(event) => setFeedback(event.target.value)}
            placeholder="Leave a comment"
            style={{backgroundColor: "white", color: "black"}}
          ></textarea>
        </div>


        <button className="form-control" type="submit" style={{marginTop: "5%"}}>Update</button>
    </form>
    )}
    </>
   )

}
