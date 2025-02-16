import React, { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { supabase } from '../lib/supabase';

const Testimonials = () => {
  interface Testimonial {
    name: string;
    role: string;
    content: string;
    review_stars: number;
  }

  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    const fetchTestimonials = async () => {
      const { data, error } = await supabase
        .from('testimonials')
        .select('name, role, content, review_stars');

      if (error) {
        console.error('Error fetching testimonials:', error);
      } else {
        setTestimonials(data);
      }
    };

    fetchTestimonials();
  }, []);

  return (
    <section className="py-16 bg-white" id="testimonials">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-blue-900 text-center mb-12">
          What Our Customers Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="mb-4">
                <h3 className="font-semibold text-blue-900">{testimonial.name}</h3>
                <p className="text-gray-600 text-sm">{testimonial.role}</p>
                <div className="flex text-yellow-400 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 fill-current ${
                        i < testimonial.review_stars ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-gray-600">{testimonial.content}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
