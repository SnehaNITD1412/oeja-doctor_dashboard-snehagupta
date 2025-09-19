import React, { useState } from "react";

const AddSchedule: React.FC = () => {
  const [day, setDay] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [location, setLocation] = useState("Online");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const schedule = { day, startTime, endTime, location };
    console.log("Schedule Submitted:", schedule);
    // Add your API call or logic here
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      

      {/* Schedule Form */}
      <div className="bg-white p-6 rounded-md shadow-md border">
        <h3 className="text-2xl font-bold mb-4">Add Doctor Availability</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Day selection */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">Select Day</label>
            <select
              className="w-full border p-2 rounded"
              value={day}
              onChange={(e) => setDay(e.target.value)}
              required
            >
              <option value="">-- Select Day --</option>
              {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(
                (day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                )
              )}
            </select>
          </div>

          {/* Start Time */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">Start Time</label>
            <input
              type="time"
              className="w-full border p-2 rounded"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
          </div>

          {/* End Time */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">End Time</label>
            <input
              type="time"
              className="w-full border p-2 rounded"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
            />
          </div>

          {/* Location (optional for now) */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">Location Type</label>
            <select
              className="w-full border p-2 rounded"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            >
              <option value="Online">Online</option>
              <option value="Clinic">Clinic</option>
              <option value="Hospital">Hospital</option>
            </select>
          </div>

          {/* Submit */}
          <div className="text-right">
            <button
              type="submit"
              className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
            >
              Save Schedule
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSchedule;
