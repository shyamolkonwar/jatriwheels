import React from 'react';

const Refund = () => {
  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-blue-900 mb-8">Refund Policy</h1>
        
        <div className="bg-white rounded-xl shadow-sm p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold text-blue-900 mb-4">Cancellation Charges</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>More than 24 hours before journey: Full refund</li>
              <li>12-24 hours before journey: 80% refund</li>
              <li>6-12 hours before journey: 50% refund</li>
              <li>Less than 6 hours: No refund</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-blue-900 mb-4">Refund Process</h2>
            <p className="text-gray-600">
              Refunds will be processed within 5-7 working days after approval. 
              The amount will be credited to the original payment method used for booking.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-blue-900 mb-4">Special Circumstances</h2>
            <p className="text-gray-600">
              Full refund will be provided in case of service cancellation from our side 
              due to unavoidable circumstances like vehicle breakdown or driver unavailability.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-blue-900 mb-4">Contact for Refunds</h2>
            <p className="text-gray-600">
              For any refund related queries, please contact our support team at 
              support@jatriwheels.com or call us at +91 1234567890
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Refund;