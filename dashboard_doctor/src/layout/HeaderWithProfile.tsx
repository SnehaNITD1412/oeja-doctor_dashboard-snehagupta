// src/components/layout/HeaderWithProfile.tsx
import  { useState } from "react";

const HeaderWithProfile = () => {
  const [isActive, setIsActive] = useState(false);

  return (
    <div className="min-h-screen font-sans">
      {/* Hero Section */}
      <div
        className="min-h-[80vh] bg-cover bg-center flex justify-center items-center pt-[100px] px-5"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('/images/doctor/bg-image.webp')",
        }}
      >
        <div className="flex flex-wrap justify-between items-center w-full max-w-6xl mx-auto">
          {/* Greeting Text */}
          <div className="flex-1 min-w-[300px] p-5">
            <h1 className="text-4xl font-bold text-white leading-snug">
              Hello, Dr.{" "}
              <span className="text-white animate-pulse drop-shadow-glow">
                Priya Sharma
              </span>
            </h1>
            <p className="text-white text-xl mt-2">
              Cardiologist • 10+ years experience
            </p>
          </div>

          {/* Profile Image */}
          <div
            className={`p-2 flex justify-center transform transition-transform duration-300 ${
              isActive ? "scale-105" : ""
            }`}
            onMouseEnter={() => setIsActive(true)}
            onMouseLeave={() => setIsActive(false)}
          >
            <div className="w-[280px] h-[280px] rounded-full bg-gradient-to-br from-fuchsia-500 to-cyan-400 blur-sm flex items-center justify-center shadow-2xl animate-spin-slow">
              <div className="w-[270px] h-[270px] bg-[#121212] rounded-full flex items-center justify-center overflow-hidden">
                <div className="w-[260px] h-[260px] rounded-full shadow-lg overflow-hidden">
                  <img
                    src="/images/doctor/doctor.jpg"
                    alt="Dr. Priya Sharma"
                    className="w-full h-full object-cover rounded-full"
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

export default HeaderWithProfile;
