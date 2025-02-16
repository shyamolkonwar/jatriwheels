import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Car, Phone, Menu, X } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed w-full bg-white shadow-md z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Car className="h-6 w-6 md:h-8 md:w-8 text-blue-900" />
            <span className="text-xl md:text-2xl font-bold text-blue-900">Jatri Wheels</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-blue-900 hover:text-green-500">
              Home
            </Link>
            <Link to="/about" className="text-blue-900 hover:text-green-500">
              About Us
            </Link>
            <Link to="/contact" className="text-blue-900 hover:text-green-500">
              Contact
            </Link>
            <a href="#faq" className="text-blue-900 hover:text-green-500">FAQs</a>
          </nav>

          {/* CTA and Contact */}
          <div className="flex items-center space-x-2 md:space-x-4">
            <a href="tel:+1234567890" className="hidden md:flex items-center text-blue-900">
              <Phone className="h-5 w-5 mr-2" />
              <span>+916901675772</span>
            </a>
            <Link 
              to="/book" 
              className="bg-green-500 text-white px-4 py-1.5 md:px-6 md:py-2 text-sm md:text-base rounded-full hover:bg-green-600 transition-colors"
            >
              Book a Ride
            </Link>
            <button 
              className="md:hidden p-1"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6 text-blue-900" />
              ) : (
                <Menu className="h-6 w-6 text-blue-900" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <nav className="bg-white border-t py-4 px-2 space-y-3">
              <Link 
                to="/" 
                className="block px-4 py-2 text-blue-900 hover:bg-gray-50 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/about" 
                className="block px-4 py-2 text-blue-900 hover:bg-gray-50 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                About Us
              </Link>
              <Link 
                to="/contact" 
                className="block px-4 py-2 text-blue-900 hover:bg-gray-50 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              <Link 
                to="/faqs" 
                className="block px-4 py-2 text-blue-900 hover:bg-gray-50 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                FAQs
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;