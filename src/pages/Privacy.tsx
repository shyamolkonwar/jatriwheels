import React from 'react';

const Privacy = () => {
  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-blue-900 mb-8">Privacy Policy</h1>
        
        <div className="bg-white rounded-xl shadow-sm p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold text-blue-900 mb-4">Information We Collect</h2>
            <p className="text-gray-600">
              We collect information you provide directly to us, including name, email address, 
              phone number, and location data necessary for our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-blue-900 mb-4">How We Use Your Information</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>To provide and maintain our services</li>
              <li>To process your bookings and payments</li>
              <li>To communicate with you about our services</li>
              <li>To improve our services and customer experience</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-blue-900 mb-4">Data Security</h2>
            <p className="text-gray-600">
              We implement appropriate security measures to protect your personal information 
              against unauthorized access, alteration, disclosure, or destruction.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-blue-900 mb-4">Contact Us</h2>
            <p className="text-gray-600">
              If you have any questions about our Privacy Policy, please contact us at 
              privacy@jatriwheels.com
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Privacy;