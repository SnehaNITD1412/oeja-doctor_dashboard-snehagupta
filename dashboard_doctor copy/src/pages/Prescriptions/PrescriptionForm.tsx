import React, { useState } from 'react';

interface PrescriptionData {
  patientId: string;
  prescription: string;
  notes?: string;
  feedback?: string;
}

interface Props {
  onSubmit: (data: PrescriptionData) => void;
}

const PrescriptionForm: React.FC<Props> = ({ onSubmit }) => {
  const [patientId, setPatientId] = useState('');
  const [prescription, setPrescription] = useState('');
  const [notes, setNotes] = useState('');
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!patientId.trim() || !prescription.trim()) {
      setError('Patient ID and Prescription are required fields.');
      return;
    }

    onSubmit({ patientId, prescription, notes, feedback });

    setPatientId('');
    setPrescription('');
    setNotes('');
    setFeedback('');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mb-8">
      <h2 className="text-2xl font-bold mb-4">Prescription Form</h2>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <form onSubmit={handleSubmit}>
        {/* Patient ID */}
        <div className="mb-4">
          <label htmlFor="patientId" className="block text-sm font-medium text-gray-700 mb-1">
            Patient ID <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="patientId"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            placeholder="Example: P1001"
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            required
          />
        </div>

        {/* Prescription */}
        <div className="mb-4">
          <label htmlFor="prescription" className="block text-sm font-medium text-gray-700 mb-1">
            Prescription <span className="text-red-500">*</span>
          </label>
          <textarea
            id="prescription"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            rows={4}
            placeholder="Enter the prescription here..."
            value={prescription}
            onChange={(e) => setPrescription(e.target.value)}
            required
          />
        </div>

        {/* Doctor Notes */}
        <div className="mb-4">
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
            Doctor Notes (Optional)
          </label>
          <textarea
            id="notes"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            rows={3}
            placeholder="Enter any additional notes here..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        {/* Feedback */}
        <div className="mb-4">
          <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-1">
            Feedback (Optional)
          </label>
          <textarea
            id="feedback"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            rows={3}
            placeholder="Enter feedback for the patient..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Save Prescription
        </button>
      </form>
    </div>
  );
};

export default PrescriptionForm;
