import React from 'react';

const Terms = () => {
  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-blue-900 mb-8">Terms and Conditions</h1>
        
        <div className="bg-white rounded-xl shadow-sm p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold text-blue-900 mb-4">Booking Terms</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Advance payment of 20% is required to confirm booking</li>
              <li>Cancellation charges apply as per our refund policy</li>
              <li>Valid ID proof is mandatory for all bookings</li>
              <li>Additional charges apply for extra hours/kilometers</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-blue-900 mb-4">Service Area</h2>
            <p className="text-gray-600">
              Our services are currently available only within the state of Assam, India. 
              Any booking outside this region will be automatically rejected.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-blue-900 mb-4">Payment Terms</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>All prices are in Indian Rupees (INR)</li>
              <li>GST and other applicable taxes will be charged extra</li>
              <li>Toll and parking charges are not included in the fare</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-blue-900 mb-4">Liability</h2>
            <p className="text-gray-600">
              Jatri Wheels is not liable for any loss or damage to personal belongings 
              during the journey. Passengers are responsible for their personal safety 
              and belongings.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Terms;