import React, { useState } from "react";

const ReportSection = () => {
  const patientReports: Record<string, any[]> = {
    P1001: [
      {
        type: "X-Ray",
        date: "2023-10-15",
        fileName: "xray_report.pdf",
        notes: "No abnormalities detected in chest X-ray. Lung fields are clear.",
        viewed: false,
      },
      {
        type: "Blood Test",
        date: "2023-09-28",
        fileName: "blood_test_results.pdf",
        notes: "Hemoglobin levels normal. Slightly elevated white blood cell count.",
        viewed: false,
      },
      {
        type: "ECG",
        date: "2023-08-10",
        fileName: "ecg_report.pdf",
        notes: "Sinus rhythm with occasional PACs observed.",
        viewed: true,
      },
    ],
    P1002: [
      {
        type: "MRI Scan",
        date: "2023-11-02",
        fileName: "mri_brain.pdf",
        notes: "No signs of lesions or abnormalities. All structures appear normal.",
        viewed: false,
      },
    ],
    P1003: [
      {
        type: "Ultrasound",
        date: "2023-10-30",
        fileName: "abd_ultrasound.pdf",
        notes: "Gallbladder shows no stones. Liver slightly enlarged but otherwise normal.",
        viewed: false,
      },
      {
        type: "Blood Test",
        date: "2023-10-25",
        fileName: "lipid_panel.pdf",
        notes: "Cholesterol levels slightly elevated. Recommended dietary changes.",
        viewed: true,
      },
    ],
  };

  const [patientId, setPatientId] = useState("");
  const [reports, setReports] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleSearch = () => {
    setIsSearching(true);
    if (patientId.trim() === "") {
      setError("Please enter a patient ID");
      setReports([]);
      setIsSearching(false);
      return;
    }

    if (!/^P\d{4}$/.test(patientId)) {
      setError("Patient ID must be in format P followed by 4 digits (e.g. P1001)");
      setReports([]);
      setIsSearching(false);
      return;
    }

    setError(null);
    setTimeout(() => {
      if (patientReports[patientId]) {
        setReports(patientReports[patientId]);
      } else {
        setError("No reports found for this patient ID");
        setReports([]);
      }
      setIsSearching(false);
    }, 500);
  };

  const handleView = (fileName: string) => {
    alert(`Viewing report: ${fileName}`);
  };

  const handleDownload = (fileName: string) => {
    alert(`Downloading report: ${fileName}`);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) {
      alert("Please select a file first");
      return;
    }
    alert(`Uploading file: ${selectedFile.name} for patient ${patientId}`);
    // Here you would typically upload to your backend
    setSelectedFile(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Patient Reports Dashboard</h1>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="patientId" className="block text-sm font-medium text-gray-700 mb-1">
              Enter Patient ID
            </label>
            <input
              type="text"
              id="patientId"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Example: P1001"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          </div>
          <div className="flex items-end">
            <button
              onClick={handleSearch}
              disabled={isSearching}
              className={`px-6 py-2 rounded-md text-white font-medium ${
                isSearching ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
              } transition-colors`}
            >
              {isSearching ? "Searching..." : "Search Reports"}
            </button>
          </div>
        </div>
      </div>

      {reports.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Reports for Patient: <span className="text-blue-600">{patientId}</span>
          </h2>

          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
            {reports.map((report, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200"
              >
                <div className={`px-6 py-4 ${report.viewed ? "bg-gray-50" : "bg-blue-50"}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{report.type} Report</h3>
                      <p className="text-sm text-gray-600">{formatDate(report.date)}</p>
                    </div>
                    {!report.viewed && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        New
                      </span>
                    )}
                  </div>
                </div>

                <div className="px-6 py-4">
                  <div className="mb-4">
                    <p className="text-sm text-gray-500">File Name</p>
                    <p className="font-medium">{report.fileName}</p>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-500">Doctor Notes</p>
                    <p className="text-gray-700">{report.notes}</p>
                  </div>

                  <div className="flex gap-3 mt-5">
                    <button
                      onClick={() => handleView(report.fileName)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      View Report
                    </button>
                    <button
                      onClick={() => handleDownload(report.fileName)}
                      className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm font-medium"
                    >
                      Download
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Upload New Report Section */}
          <div className="mt-8 bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
            <div className="px-6 py-4 bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-800">Upload New Report</h3>
            </div>
            
            <div className="px-6 py-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                {selectedFile ? (
                  <div className="mb-4">
                    <p className="font-medium text-gray-700">{selectedFile.name}</p>
                    <p className="text-sm text-gray-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                ) : (
                  <>
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    <p className="mt-2 text-sm text-gray-600">Drag and drop files here or</p>
                  </>
                )}
                
                <label className="mt-2 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium cursor-pointer">
                  Browse Files
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    accept=".pdf,.jpg,.png"
                  />
                </label>
                
                <p className="mt-2 text-xs text-gray-500">Supported formats: PDF, JPG, PNG (Max 25MB)</p>
              </div>
              
              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleUpload}
                  disabled={!selectedFile}
                  className={`px-4 py-2 rounded-md text-white font-medium ${
                    !selectedFile ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
                  } transition-colors`}
                >
                  Upload
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {reports.length === 0 && !error && (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <img
            src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/9bc00fae-b4c7-477e-800f-745009afb8d8.png"
            alt="Illustration of a doctor reviewing medical records"
            className="mx-auto mb-4 rounded-lg"
          />
          <h3 className="text-lg font-medium text-gray-800 mb-2">Search for patient reports</h3>
          <p className="text-gray-600">
            Enter a patient ID in the format P followed by 4 digits (e.g. P1001) to view their test reports.
          </p>
        </div>
      )}
    </div>
  );
};

export default ReportSection;