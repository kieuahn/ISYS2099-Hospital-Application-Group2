import React, { useState, useEffect } from 'react';
import api from "../../utils/api" // Ensure this is your API setup file

const PaymentReport = () => {
  const [paymentReport, setPaymentReport] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPaymentReport = async () => {
      try {
        const response = await api.get('/staff/payment-report');
        setPaymentReport(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching payment report.');
        setLoading(false);
      }
    };

    fetchPaymentReport();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Patient Payment Report</h1>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Patient ID</th>
              <th className="px-4 py-2 text-left">Patient Name</th>
              <th className="px-4 py-2 text-left">Total Payment</th>
            </tr>
          </thead>
            <tbody>
            {paymentReport.map((report) => (
                <tr key={report.patient_id} className="border-t border-gray-200 hover:bg-gray-50">
                <td className="px-4 py-2">{report.patient_id}</td>
                <td className="px-4 py-2">{report.patient_name}</td>
                <td className="px-4 py-2">${Number(report.total_payment || 0).toFixed(2)}</td>
                </tr>
            ))}
            </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentReport;