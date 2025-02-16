import React from 'react';
import { Car, Facebook, Twitter, Instagram, Mail, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-blue-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        {/* CTA Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Ready to Travel with Jatri Wheels?</h2>
          <button className="bg-green-500 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-green-600 transition-colors">
            Book Your Ride Now
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Logo and About */}
          <div className="col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <Car className="h-8 w-8" />
              <span className="text-2xl font-bold">Jatri Wheels</span>
            </div>
            <p className="text-gray-300">
              Your trusted partner for comfortable and reliable transportation solutions.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white">About Us</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Services</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">FAQs</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Contact</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="space-y-2">
              <p className="flex items-center">
                <Phone className="h-5 w-5 mr-2" />
                +91 6901 675 772
              </p>
              <p className="flex items-center">
                <Mail className="h-5 w-5 mr-2" />
                info@jatriwheels.in
              </p>
            </div>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-green-500">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="hover:text-green-500">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="hover:text-green-500">
                <Instagram className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-8 mt-8 text-center text-gray-300">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p>&copy; 2024 Jatri Wheels. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="hover:text-white">Privacy Policy</a>
              <a href="#" className="hover:text-white">Terms & Conditions</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;