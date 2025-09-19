// src/data/dummyData.ts
export interface Message {
    id: string;
    sender: 'Doctor' | 'Patient';
    text: string;
    timestamp: string;
}

export interface PatientThread {
    patientId: string;
    patientName: string;
    messages: Message[];
}

export const dummyData: PatientThread[] = [
    {
        patientId: 'P1001',
        patientName: 'John Doe',
        messages: [
            { id: '1', sender: 'Patient', text: 'Hello, Doctor!', timestamp: '2023-10-01T10:00:00Z' },
            { id: '2', sender: 'Doctor', text: 'Hi John, how can I help you?', timestamp: '2023-10-01T10:05:00Z' },
        ],
    },
    {
        patientId: 'P1002',
        patientName: 'Jane Smith',
        messages: [
            { id: '3', sender: 'Patient', text: 'I have a question about my medication.', timestamp: '2023-10-02T11:00:00Z' },
            { id: '4', sender: 'Doctor', text: 'Sure, what would you like to know?', timestamp: '2023-10-02T11:10:00Z' },
        ],
    },
    // Add more patient threads as needed
];
