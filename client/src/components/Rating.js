import React from 'react';

export default function Rating({ rating }) {
  let ratingInt = parseInt(rating);
  let ratingDecimal = rating - ratingInt;

  let allStars = Math.ceil(rating);
  let emptyStars = 5 - allStars;

  let ratingEl = [];
  let id = 0;

  // Generate full stars
  for (let i = 0; i < ratingInt; i++) {
    ratingEl.push(
      <svg viewBox="0 0 24 24" width={16} key={id++}>
        <path
          d="M12.0006 18.26L4.94715 22.2082L6.52248 14.2799L0.587891 8.7918L8.61493 7.84006L12.0006 0.5L15.3862 7.84006L23.4132 8.7918L17.4787 14.2799L19.054 22.2082L12.0006 18.26Z"
          fill="currentColor"
        ></path>
      </svg>
    );
  }

  //Check if there is a half start
  if (ratingDecimal !== 0)
    ratingEl.push(
      <svg viewBox="0 0 24 24" width={16} key={id++}>
        <path
          d="M12.0006 15.968L16.2473 18.3451L15.2988 13.5717L18.8719 10.2674L14.039 9.69434L12.0006 5.27502V15.968ZM12.0006 18.26L4.94715 22.2082L6.52248 14.2799L0.587891 8.7918L8.61493 7.84006L12.0006 0.5L15.3862 7.84006L23.4132 8.7918L17.4787 14.2799L19.054 22.2082L12.0006 18.26Z"
          fill="currentColor"
        ></path>
      </svg>
    );

  // Generate empty stars
  for (let i = 0; i < emptyStars; i++) {
    ratingEl.push(
      <svg viewBox="0 0 24 24" width={16} key={id++}>
        <path
          d="M12.0006 18.26L4.94715 22.2082L6.52248 14.2799L0.587891 8.7918L8.61493 7.84006L12.0006 0.5L15.3862 7.84006L23.4132 8.7918L17.4787 14.2799L19.054 22.2082L12.0006 18.26ZM12.0006 15.968L16.2473 18.3451L15.2988 13.5717L18.8719 10.2674L14.039 9.69434L12.0006 5.27502L9.96214 9.69434L5.12921 10.2674L8.70231 13.5717L7.75383 18.3451L12.0006 15.968Z"
          fill="currentColor"
        ></path>
      </svg>
    );
  }

  return (
    <div>
      <span className={`star-rating ${rating === 0 ? 'empty' : ''}`}>{ratingEl}</span>
      {rating > 0 && rating}
    </div>
  );
}
