import React, { useState, useEffect } from "react";
import StarRating from "react-star-ratings";
import axios from "axios";

export default function StarRatingComponent() {
  const [averageRating, setAverageRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);

  useEffect(() => {
    async function fetchRatings() {
      try {
        const response = await axios.get("/api/freelancers/ratings");
        const { averageRating, totalRatings } = response.data;
        setAverageRating(averageRating);
        setTotalRatings(totalRatings);
      } catch (error) {
        console.log(error);
      }
    }

    fetchRatings();
  }, []);

  return (
    <div>
      <StarRating
        rating={averageRating}
        starRatedColor="gold"
        starHoverColor="gold"
        starEmptyColor="lightgray"
        starDimension="30px"
        starSpacing="2px"
      />
      <span>{totalRatings} ratings</span>
    </div>
  );
}
