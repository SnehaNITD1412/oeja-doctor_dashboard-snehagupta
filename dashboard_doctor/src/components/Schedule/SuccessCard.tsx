import React from "react";
import "./SuccessCard.css";

const SuccessCard = () => {
  return (
    <div className="card">
      <div className="card__border"></div>

      <div className="card_title__container">
        <span className="card_title">Keys to Success</span>
        <p className="card_paragraph">Best way to be success in your life.</p>
      </div>

      <hr className="line" />

      <ul className="card__list">
        <li className="card__list_item">
          <span className="check">
            <svg className="check_svg" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
              <path
                clipRule="evenodd"
                fillRule="evenodd"
                d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z"
              ></path>
            </svg>
          </span>
          <span className="list_text">Set Clear Goals</span>
        </li>

        <li className="card__list_item">
          <span className="check">
            <svg className="check_svg" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
              <path
                clipRule="evenodd"
                fillRule="evenodd"
                d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z"
              ></path>
            </svg>
          </span>
          <span className="list_text">Stay Organized</span>
        </li>

        <li className="card__list_item">
          <span className="check">
            <svg className="check_svg" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
              <path
                clipRule="evenodd"
                fillRule="evenodd"
                d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z"
              ></path>
            </svg>
          </span>
          <span className="list_text">Continuous Learning</span>
        </li>

        <li className="card__list_item">
          <span className="check">
            <svg className="check_svg" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
              <path
                clipRule="evenodd"
                fillRule="evenodd"
                d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z"
              ></path>
            </svg>
          </span>
          <span className="list_text">Time Management</span>
        </li>

        <li className="card__list_item">
          <span className="check">
            <svg className="check_svg" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
              <path
                clipRule="evenodd"
                fillRule="evenodd"
                d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z"
              ></path>
            </svg>
          </span>
          <span className="list_text">Maintain a Positive Attitude</span>
        </li>
      </ul>

      <button className="button">Get Your Success</button>
    </div>
  );
};

export default SuccessCard;
