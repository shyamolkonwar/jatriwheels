import React from 'react';
import { Plus, Minus } from 'lucide-react';

const FAQ = () => {
  const faqs = [
    {
      question: "What is the booking process?",
      answer: "Simply enter your pickup and drop-off locations, select date and time, write passengers details and luggage details and confirm your booking."
    },
    {
      question: "What are your service areas?",
      answer: "We currently operate exclusively within Northeast, covering all major cities and tourist destinations in the all states."
    },
    {
      question: "What about the payment?",
      answer: "After confirming your booking, our agent will message you on whatsapp or call you regarding the payment you have to pay, also you're allowed to negogiate the pricing."
    },
    {
      question: "How to pay the payment?",
      answer: "You can pay the full payment with UPI given by our agent or you can pay the payment offline directly to the car driver."
    },
    {
      question: "Are there any hidden charges?",
      answer: "No, after negogiating the pricing we won't charge you a single penny. However, toll taxes, parking fees, and interstate taxes (if applicable) are extra."
    },
    {
      question: "What documents are required for booking?",
      answer: "A valid government-issued ID proof is mandatory for all bookings. This can be Aadhar Card, Driving License, or Passport. You have to show it to the agent in the whatsapp."
    }
  ];

  return (
    <section className="py-16 bg-gray-50" id="faqs">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-blue-900 text-center mb-12">
          Frequently Asked Questions
        </h2>
        
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <details key={index} className="group bg-white rounded-xl shadow-sm">
              <summary className="flex items-center justify-between cursor-pointer p-6">
                <h3 className="text-lg font-semibold text-blue-900">{faq.question}</h3>
                <span className="text-green-500">
                  <Plus className="h-5 w-5 group-open:hidden" />
                  <Minus className="h-5 w-5 hidden group-open:block" />
                </span>
              </summary>
              <p className="px-6 pb-6 text-gray-600">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;