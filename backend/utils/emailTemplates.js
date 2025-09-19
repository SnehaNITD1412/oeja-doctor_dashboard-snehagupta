// File: utils/emailTemplates.js

exports.appointmentApproved = (appointment, meetLink) => `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <h2 style="color: #28a745;">Appointment Approved! 🎉</h2>
    
    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>Appointment Details</h3>
        <p><strong>Date:</strong> ${new Date(appointment.date).toLocaleDateString()}</p>
        <p><strong>Time:</strong> ${appointment.startTime} - ${appointment.endTime}</p>
        <p><strong>Patient:</strong> ${appointment.patientName || appointment.patientId}</p>
        <p><strong>Problem:</strong> ${appointment.problem || 'General consultation'}</p>
    </div>
    
    <div style="background: #e7f3ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>Meeting Link</h3>
        <p>Click the button below to join your consultation:</p>
        <a href="${meetLink}" style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Join Meeting</a>
        <p style="margin-top: 10px; font-size: 14px; color: #666;">Or copy this link: ${meetLink}</p>
    </div>
    
    <p>Please join the meeting 5 minutes before your scheduled time.</p>
    <p>If you have any questions, please contact your doctor.</p>
</div>
`;

exports.appointmentRejected = (appointment, reason) => `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <h2 style="color: #dc3545;">Appointment Update</h2>
    
    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>Appointment Details</h3>
        <p><strong>Date:</strong> ${new Date(appointment.date).toLocaleDateString()}</p>
        <p><strong>Time:</strong> ${appointment.startTime} - ${appointment.endTime}</p>
        <p><strong>Status:</strong> <span style="color: #dc3545;">Rejected</span></p>
    </div>
    
    <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>Reason for Rejection</h3>
        <p>${reason}</p>
    </div>
    
    <p>We apologize for any inconvenience. Please contact your doctor to reschedule or discuss alternative arrangements.</p>
</div>
`;

exports.newPrescription = (prescription, patientName) => `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <h2 style="color: #17a2b8;">New Prescription Available 📋</h2>
    
    <p>Hello ${patientName || 'there'},</p>
    
    <p>Your doctor has prescribed new medications. Please review the details below:</p>
    
    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>Medications</h3>
        ${prescription.medicines.map(med => `
            <div style="border-left: 3px solid #17a2b8; padding-left: 15px; margin: 10px 0;">
                <p><strong>${med.name}</strong> - ${med.dosageMg}mg</p>
                <p>Dose: ${med.dose}</p>
                <p>Timings: ${Object.entries(med.timings).filter(([k,v]) => v).map(([k,v]) => k).join(', ')}</p>
                <p>Duration: ${med.days} days</p>
            </div>
        `).join('')}
    </div>
    
    ${prescription.advice ? `
    <div style="background: #d4edda; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>Doctor's Advice</h3>
        <p>${prescription.advice}</p>
    </div>
    ` : ''}
    
    <p>Please follow the prescription as directed and contact your doctor if you have any questions.</p>
</div>
`;

exports.newReport = (report, patientName) => `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <h2 style="color: #6f42c1;">New Report Available 📊</h2>
    
    <p>Hello ${patientName || 'there'},</p>
    
    <p>Your doctor has uploaded a new medical report. Here are the details:</p>
    
    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>Report Details</h3>
        <p><strong>Type:</strong> ${report.type}</p>
        <p><strong>Title:</strong> ${report.title}</p>
        ${report.notes ? `<p><strong>Doctor's Notes:</strong> ${report.notes}</p>` : ''}
        <p><strong>Date:</strong> ${new Date(report.createdAt).toLocaleDateString()}</p>
    </div>
    
    <p>Please review the report and contact your doctor if you have any questions.</p>
</div>
`;
