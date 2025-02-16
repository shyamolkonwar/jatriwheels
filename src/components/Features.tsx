import React from 'react';
import { Clock, Smartphone, Headphones, IndianRupee, Car } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: <Clock className="h-12 w-12" />,
      title: 'Reliable',
      description: 'On-time pick-up and drop-off.',
    },
    {
      icon: <IndianRupee className="h-12 w-12" />,
      title: 'Offline Payment',
      description: 'Pay the payment offline directly to driver.',
    },
    {
      icon: <Car className="h-12 w-12" />,
      title: 'All Types of Cars',
      description: 'Choose from a wide range of cars to suit your needs.',
    },
    {
      icon: <Headphones className="h-12 w-12" />,
      title: 'Customer Support',
      description: '24/7 customer support for any inquiries.',
    },
  ];

  return (
    <section className="py-16 bg-gray-50" id="features">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-blue-900 text-center mb-12">
          Why Choose Jatri Wheels?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="text-blue-900 mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-blue-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;