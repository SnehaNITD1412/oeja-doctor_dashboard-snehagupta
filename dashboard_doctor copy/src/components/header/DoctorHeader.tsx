// src/components/layout/DoctorHeader.tsx
import React, { useState } from "react";
import doctorImg from "../../assets/doctor.jpg"; // make sure path is correct
import "./DoctorHeader.css"; // Create this file if needed

const DoctorHeader = () => {
  const [isActive, setIsActive] = useState(false);

  return (
    <div className="header-wrapper">
      <nav className="navbar">
        <div className="navbar-content">
          <h1 className="nav-brand">OeJa SwasthSetu</h1>
          <button className="animated-button">
            <span className="text">Logout</span>
            <span className="circle"></span>
          </button>
        </div>
      </nav>

      <div className="hero-section">
        <div className="hero-content">
          <div className="greeting">
            <h1 className="doctor-heading">
              Welcome Dr.&nbsp;
              <span className="glow-name">Priya Sharma</span>
            </h1>
            <p>Cardiologist • 10+ years experience</p>
          </div>

          <div
            className={`profile-pic-container ${isActive ? "active" : ""}`}
            onMouseEnter={() => setIsActive(true)}
            onMouseLeave={() => setIsActive(false)}
          >
            <div className="spinner">
              <div className="spinner1">
                <div className="profile-pic">
                  <img
                    src={doctorImg}
                    alt="Portrait of Dr. Priya Sharma"
                    className="doctor-photo"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorHeader;
