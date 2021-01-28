import React from 'react';

const Rating = ({ value, text, color }) => {
  let stars = [];
  for (let i = 0; i < 5; i += 1) {
    stars.push(
      <span key={i}>
        <i
          style={{ color }}
          className={
            value >= 1 + i
              ? 'fas fa-star'
              : value >= 0.5 + i
              ? 'fas fa-star-half-alt'
              : 'far fa-star'
          }
        ></i>
      </span>
    );
  }
  return (
    <div className='rating'>
      {stars}
      <span>{text && text}</span>
    </div>
  );
};

export default Rating;
