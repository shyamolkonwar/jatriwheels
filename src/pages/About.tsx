import React from 'react';

const About = () => {
  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-blue-900 mb-8">About Jatri Wheels</h1>
        
        <div className="bg-white rounded-xl shadow-sm p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold text-blue-900 mb-4">Our Story</h2>
            <p className="text-gray-600">
              Founded in 2024, Jatri Wheels emerged from a vision to transform the transportation landscape in Assam. 
              We recognized the need for a reliable, professional car rental service that could cater to both locals 
              and tourists exploring the beautiful state of Assam.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-blue-900 mb-4">Our Mission</h2>
            <p className="text-gray-600">
              To provide safe, comfortable, and affordable transportation solutions while delivering exceptional 
              customer service. We aim to make every journey memorable and hassle-free for our customers.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-blue-900 mb-4">Why Choose Us?</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Professional and experienced drivers</li>
              <li>Well-maintained premium fleet</li>
              <li>24/7 customer support</li>
              <li>Transparent pricing with no hidden charges</li>
              <li>Extensive coverage across Assam</li>
              <li>Flexible booking options</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-blue-900 mb-4">Our Commitment</h2>
            <p className="text-gray-600">
              We are committed to maintaining the highest standards of service quality and safety. 
              Our vehicles undergo regular maintenance, and our drivers are thoroughly vetted and trained 
              to ensure your safety and comfort.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default About;