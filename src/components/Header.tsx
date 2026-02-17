import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const openAdminDashboard = () => {
    window.open('/admin', '_blank');
  };

  // Handle navigation - if on homepage, scroll to section; if on other page, navigate to homepage first
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    
    if (location.pathname === '/') {
      // On homepage, just scroll to section
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // On other pages, navigate to homepage with hash
      navigate('/#' + sectionId);
    }
    setMobileMenuOpen(false);
  };

  const handleHomeClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
    }
    setMobileMenuOpen(false);
  };

  const handleDonatePageClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    navigate('/donate');
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 w-full
         ${
        isScrolled
          ? "py-2 sm:py-3 bg-white/95 backdrop-blur-lg shadow-lg border-b border-blue-100/50"
          : "py-4 sm:py-6 bg-gradient-to-b from-black/20 to-transparent"
      }
        `
      }
    >
      <div className="container mx-auto flex justify-between items-center px-4 max-w-7xl">
        <a href="#" className="flex items-center space-x-2 bg-white p-1 rounded-[50px]" onClick={handleHomeClick}>
          <img
            className="w-[60px] sm:w-[80px] md:w-[100px] lg:w-[120px] transition-all duration-300 rounded-md"
            src="/img/parivattanE.png"
            alt="Parivattan Logo"
          />
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-4 lg:space-x-8 items-center">
          <a 
            href="/" 
            onClick={handleHomeClick}
            className={`nav-item lg:text-lg xl:text-xl font-medium transition-colors cursor-pointer ${isScrolled ? 'text-slate-700 hover:text-blue-600' : 'text-white hover:text-blue-200'}`}
          >
            Home
          </a>
          <a 
            href="/#mission" 
            onClick={(e) => handleNavClick(e, 'mission')}
            className={`nav-item lg:text-lg xl:text-xl font-medium transition-colors cursor-pointer ${isScrolled ? 'text-slate-700 hover:text-blue-600' : 'text-white hover:text-blue-200'}`}
          >
            About
          </a>
          <a 
            href="/donate" 
            onClick={handleDonatePageClick}
            className={`nav-item lg:text-lg xl:text-xl font-medium transition-colors cursor-pointer ${isScrolled ? 'text-slate-700 hover:text-blue-600' : 'text-white hover:text-blue-200'}`}
          >
            Donation
          </a>
          <a 
            href="/#contact" 
            onClick={(e) => handleNavClick(e, 'contact')}
            className={`nav-item lg:text-lg xl:text-xl font-medium transition-colors cursor-pointer ${isScrolled ? 'text-slate-700 hover:text-blue-600' : 'text-white hover:text-blue-200'}`}
          >
            Contact
          </a>
          <a 
            href="/donate" 
            onClick={handleDonatePageClick}
            className="ml-4 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-full hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Donate Now
          </a>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className={`md:hidden p-2 rounded-lg transition-colors ${isScrolled ? 'text-slate-800 hover:bg-blue-50' : 'text-white hover:bg-white/10'}`}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`md:hidden fixed inset-0 bg-white z-40 transform transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="container mx-auto px-4 py-4 h-full overflow-y-auto">
          <div className="flex justify-between items-center mb-8">
            <a href="/" onClick={handleHomeClick} className="flex items-center space-x-2">
              <img
                className="w-[60px] sm:w-[80px]"
                src="/img/parivattanE.png"
                alt="Parivattan Logo"
              />
            </a>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-800 p-2 hover:bg-blue-50 rounded-lg transition-colors"
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
          </div>
          <nav className="flex flex-col space-y-2">
            <a
              href="/"
              onClick={handleHomeClick}
              className="text-lg sm:text-xl py-3 px-4 text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all font-medium"
            >
              Home
            </a>
            <a
              href="/#mission"
              onClick={(e) => handleNavClick(e, 'mission')}
              className="text-lg sm:text-xl py-3 px-4 text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all font-medium"
            >
              About
            </a>
            <a
              href="/donate"
              onClick={handleDonatePageClick}
              className="text-lg sm:text-xl py-3 px-4 text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all font-medium"
            >
              Donation
            </a>
            <a
              href="/#contact"
              onClick={(e) => handleNavClick(e, 'contact')}
              className="text-lg sm:text-xl py-3 px-4 text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all font-medium"
            >
              Contact
            </a>
            <a
              href="/donate"
              onClick={handleDonatePageClick}
              className="mt-4 py-4 px-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl text-center hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg"
            >
              Donate Now
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
