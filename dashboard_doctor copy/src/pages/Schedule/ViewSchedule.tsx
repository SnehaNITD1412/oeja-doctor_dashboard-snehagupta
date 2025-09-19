import React, { useState, useEffect } from 'react';
import { FiCalendar, FiClock, FiUser, FiCheck, FiX, FiAlertCircle } from 'react-icons/fi';

interface Appointment {
  id: string;
  patientName: string;
  patientId: string;
  date: string;
  time: string;
  status: 'Upcoming' | 'Approved' | 'Rejected' | 'Completed';
  reason: string;
  patientImage?: string;
}

const dummyData: Appointment[] = [
  {
    id: 'A001',
    patientName: 'John Doe',
    patientId: 'P1001',
    date: 'today',
    time: '10:00 AM',
    status: 'Upcoming',
    reason: 'Routine checkup',
    patientImage: 'https://randomuser.me/api/portraits/men/1.jpg',
  },
  {
    id: 'A002',
    patientName: 'Jane Smith',
    patientId: 'P1002',
    date: 'today',
    time: '11:30 AM',
    status: 'Upcoming',
    reason: 'Follow-up visit',
    patientImage: 'https://randomuser.me/api/portraits/women/2.jpg',
  },
  {
    id: 'A003',
    patientName: 'Alice Johnson',
    patientId: 'P1003',
    date: '2025-07-27',
    time: '01:00 PM',
    status: 'Upcoming',
    reason: 'Annual physical',
    patientImage: 'https://randomuser.me/api/portraits/women/3.jpg',
  },
  {
    id: 'A004',
    patientName: 'Robert Brown',
    patientId: 'P1004',
    date: '2025-07-27',
    time: '02:15 PM',
    status: 'Approved',
    reason: 'Vaccination',
    patientImage: 'https://randomuser.me/api/portraits/men/4.jpg',
  },
];

const ViewSchedule: React.FC<{ selectedDate: string }> = ({ selectedDate }) => {
  const [appointments, setAppointments] = useState<Appointment[]>(dummyData);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');
  const [filterStatus, setFilterStatus] = useState<'all' | Appointment['status']>('all');

  const handleApprove = (id: string) => {
    setAppointments(prev =>
      prev.map(appt => (appt.id === id ? { ...appt, status: 'Approved' } : appt))
    );
  };

  const handleReject = (id: string) => {
    setAppointments(prev =>
      prev.map(appt => (appt.id === id ? { ...appt, status: 'Rejected' } : appt))
    );
  };

  const handleComplete = (id: string) => {
    setAppointments(prev =>
      prev.map(appt => (appt.id === id ? { ...appt, status: 'Completed' } : appt))
    );
  };

  const filteredAppointments = appointments.filter(appt => {
    const dateMatch = appt.date === selectedDate;
    const statusMatch = filterStatus === 'all' || appt.status === filterStatus;
    return dateMatch && statusMatch;
  });

  const formatDate = (dateStr: string) => {
    if (dateStr === 'today') return 'Today';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Appointments for {formatDate(selectedDate)}
        </h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-500'}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-500'}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Statuses</option>
            <option value="Upcoming">Upcoming</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      {filteredAppointments.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAppointments.map(appt => (
              <div key={appt.id} className="border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="p-5">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex-shrink-0">
                      <img className="h-12 w-12 rounded-full object-cover" src={appt.patientImage} alt={appt.patientName} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{appt.patientName}</h3>
                      <p className="text-sm text-gray-500">ID: {appt.patientId}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <FiCalendar className="mr-2 text-gray-400" />
                      <span>{formatDate(appt.date)}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <FiClock className="mr-2 text-gray-400" />
                      <span>{appt.time}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <FiAlertCircle className="mr-2 text-gray-400" />
                      <span>{appt.reason}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex items-center">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      appt.status === 'Upcoming' ? 'bg-blue-100 text-blue-800' :
                      appt.status === 'Approved' ? 'bg-green-100 text-green-800' :
                      appt.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {appt.status}
                    </span>
                  </div>
                </div>
                
                <div className="bg-gray-50 px-5 py-3 flex justify-between border-t">
                  {appt.status === 'Upcoming' && (
                    <>
                      <button
                        onClick={() => handleReject(appt.id)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium flex items-center"
                      >
                        <FiX className="mr-1" /> Reject
                      </button>
                      <button
                        onClick={() => handleApprove(appt.id)}
                        className="text-green-600 hover:text-green-800 text-sm font-medium flex items-center"
                      >
                        <FiCheck className="mr-1" /> Approve
                      </button>
                    </>
                  )}
                  {appt.status === 'Approved' && (
                    <button
                      onClick={() => handleComplete(appt.id)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                    >
                      <FiCheck className="mr-1" /> Mark Complete
                    </button>
                  )}
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAppointments.map(appt => (
                  <tr key={appt.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img className="h-10 w-10 rounded-full" src={appt.patientImage} alt={appt.patientName} />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{appt.patientName}</div>
                          <div className="text-sm text-gray-500">ID: {appt.patientId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{appt.time}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{appt.reason}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        appt.status === 'Upcoming' ? 'bg-blue-100 text-blue-800' :
                        appt.status === 'Approved' ? 'bg-green-100 text-green-800' :
                        appt.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {appt.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        {appt.status === 'Upcoming' && (
                          <>
                            <button
                              onClick={() => handleReject(appt.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Reject
                            </button>
                            <button
                              onClick={() => handleApprove(appt.id)}
                              className="text-green-600 hover:text-green-900"
                            >
                              Approve
                            </button>
                          </>
                        )}
                        {appt.status === 'Approved' && (
                          <button
                            onClick={() => handleComplete(appt.id)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Complete
                          </button>
                        )}
                        <button className="text-blue-600 hover:text-blue-900">
                          Details
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      ) : (
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">No appointments found</h3>
          <p className="mt-1 text-gray-500">
            {filterStatus === 'all' 
              ? `No appointments scheduled for ${formatDate(selectedDate)}`
              : `No ${filterStatus.toLowerCase()} appointments for ${formatDate(selectedDate)}`}
          </p>
        </div>
      )}
    </div>
  );
};

export default ViewSchedule;