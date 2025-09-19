import React from 'react';

interface Prescription {
  id: number;
  patientId: string;
  prescription: string;
  notes?: string;
  feedback?: string;
}

const dummyPrescriptions: Prescription[] = [
  {
    id: 1,
    patientId: 'P1001',
    prescription: 'Paracetamol 500mg, 3 times a day',
    notes: 'Take after food',
    feedback: 'Feeling better',
  },
  {
    id: 2,
    patientId: 'P1002',
    prescription: 'Amoxicillin 250mg, 2 times a day',
    notes: 'Complete 5-day course',
    feedback: 'No fever now',
  },
];

const ViewPrescriptions: React.FC = () => {
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">All Prescriptions</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 shadow-md">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="px-4 py-2 border">ID</th>
              <th className="px-4 py-2 border">Patient ID</th>
              <th className="px-4 py-2 border">Prescription</th>
              <th className="px-4 py-2 border">Doctor Notes</th>
              <th className="px-4 py-2 border">Feedback</th>
            </tr>
          </thead>
          <tbody>
            {dummyPrescriptions.map((prescription) => (
              <tr key={prescription.id} className="border-t">
                <td className="px-4 py-2 border">{prescription.id}</td>
                <td className="px-4 py-2 border">{prescription.patientId}</td>
                <td className="px-4 py-2 border">{prescription.prescription}</td>
                <td className="px-4 py-2 border">{prescription.notes || '-'}</td>
                <td className="px-4 py-2 border">{prescription.feedback || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewPrescriptions;
