import React from 'react';
import PrescriptionForm from './PrescriptionForm';

const AddPrescription: React.FC = () => {
  const handleSubmit = (data: {
    patientId: string;
    prescription: string;
    notes?: string;
    feedback?: string;
  }) => {
    console.log("Prescription Saved:", data);

    // 🔸 Optional: You can show a toast / alert here
    // toast.success("Prescription saved successfully!");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Add Prescription</h2>
      <PrescriptionForm onSubmit={handleSubmit} />
    </div>
  );
};

export default AddPrescription;
