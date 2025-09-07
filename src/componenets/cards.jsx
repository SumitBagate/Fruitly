import React from 'react';
import './Card.css';

const Card = ({ image, name, calories, sugar, fiber }) => {
  return (
    <div className="card">
      <img src={image} alt={name} />
      <div className="card-content">
        <h2>{name}</h2>
        <p>Calories: {calories}</p>
        <p>Sugar: {sugar}g</p>
        <p>Fiber: {fiber}g</p>
      </div>
    </div>
  );
};

export default Card;
