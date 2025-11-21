import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

// Sample lawyer data
const sampleLawyers = [
  {
    id: 1,
    name: "Darlene Robertson",
    location: "1 Station Road, London E17 8AA",
    rating: 5,
    reviewCount: 15,
    reviewScore: 10.0,
    yearsLicensed: 12,
    practiceAreas: ["Business", "Libel & Slander"],
    description: "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniamconsequat sunt nostrud amet.",
    imageUrl: "https://api.builder.io/api/v1/image/assets/TEMP/2c1f45f0ac91f9fe81539c1d2c023ddad9fd6e65?width=200",
    category: "Business",
  },
  {
    id: 2,
    name: "Devon Lane",
    location: "1 Station Road, London E17 8AA",
    rating: 5,
    reviewCount: 15,
    reviewScore: 10.0,
    yearsLicensed: 12,
    practiceAreas: ["Business", "Libel & Slander"],
    description: "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniamconsequat sunt nostrud amet.",
    imageUrl: "https://api.builder.io/api/v1/image/assets/TEMP/3d658576d4c8b59e3e68d0db8291daa35c59c295?width=200",
    category: "Business",
  },
  {
    id: 3,
    name: "Leslie Alexander",
    location: "1 Station Road, London E17 8AA",
    rating: 5,
    reviewCount: 15,
    reviewScore: 10.0,
    yearsLicensed: 12,
    practiceAreas: ["Business", "Libel & Slander"],
    description: "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniamconsequat sunt nostrud amet.",
    imageUrl: "https://api.builder.io/api/v1/image/assets/TEMP/126e4ac44d850304860f52b5fe05bdc9a59f8ec6?width=200",
    category: "Business",
  },
  {
    id: 4,
    name: "Brooklyn Simmons",
    location: "1 Station Road, London E17 8AA",
    rating: 5,
    reviewCount: 15,
    reviewScore: 10.0,
    yearsLicensed: 12,
    practiceAreas: ["Business", "Libel & Slander"],
    description: "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniamconsequat sunt nostrud amet.",
    imageUrl: "https://api.builder.io/api/v1/image/assets/TEMP/3449fc7a6ddaa658bdac5de239f849e319482913?width=200",
    category: "Business",
  },
];

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  // Check if user came from dashboard
  const cameFromDashboard = location.state?.from === 'dashboard';

  const handleBackNavigation = () => {
    if (user && cameFromDashboard) {
      navigate('/userdashboard');
    } else {
      navigate('/');
    }
  };

  return (
    <header className="w-full h-16 bg-gradient-to-b from-blue-600 to-cyan-400 flex items-center justify-between px-4 lg:px-36">
      <div className="flex items-center flex-shrink-0">
        <div 
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate('/')}
        >
          <div className="bg-white rounded-lg px-3 py-1.5 shadow-sm">
            <span className="text-[#0284C7] font-bold text-lg tracking-tight">Legal</span>
          </div>
          <span className="text-white font-bold text-lg tracking-tight">City</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Admin Panel - Only show for admin users */}
        {user && (user.role === 'admin' || user.is_admin) && (
          <button 
            onClick={() => navigate('/admin-dashboard')}
            className="text-white hover:opacity-90 transition-opacity text-sm"
          >
            Admin Panel
          </button>
        )}

        {user ? (
          <>
            <button 
              onClick={handleBackNavigation}
              className="flex items-center justify-center h-9 px-4 md:px-7 rounded-full bg-white/20 text-white text-sm font-normal hover:bg-white/30 transition-colors"
            >
              {cameFromDashboard ? 'Back to Dashboard' : 'Back to Home'}
            </button>
            <button 
              onClick={() => {
                localStorage.removeItem('token');
                window.location.href = '/';
              }}
              className="flex items-center justify-center h-9 px-4 md:px-7 rounded-full bg-white text-black text-sm font-normal hover:bg-gray-100 transition-colors"
            >
              Logout
            </button>
          </>
        ) : (
          <button 
            onClick={() => navigate('/')}
            className="flex items-center justify-center h-9 px-4 md:px-7 rounded-full bg-white text-black text-sm font-normal hover:bg-gray-100 transition-colors"
          >
            Back to Home
          </button>
        )}
      </div>
    </header>
  );
}

function LawyerCard({
  id,
  name,
  location,
  rating,
  reviewCount,
  reviewScore,
  yearsLicensed,
  practiceAreas,
  description,
  imageUrl,
  category,
}) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleViewProfile = () => {
    navigate(`/lawyer/${id}`);
  };

  const handleChatWithLawyer = () => {
    if (!user) {
      // Store lawyer info for after login
      localStorage.setItem('pendingChat', JSON.stringify({
        partner_id: id,
        partner_type: 'lawyer',
        partner_name: name
      }));
      // Show login prompt using toast
      toast.error('Please login to chat with lawyers');
      navigate('/login');
    } else {
      // User is logged in, start chat
      localStorage.setItem('chatPartner', JSON.stringify({
        partner_id: id,
        partner_type: 'lawyer',
        partner_name: name
      }));
      navigate('/messages');
    }
  };

  return (
    <div className="w-full">
      <div className="gradient-text font-semibold text-base mb-2">
        {category}
      </div>
      <div 
        className="bg-gray-200/20 p-6 min-h-64 cursor-pointer hover:bg-gray-200/30 transition-colors duration-200"
        onClick={handleViewProfile}
      >
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-2">
          <img
            src={imageUrl}
            alt={name}
            className="w-full sm:w-24 h-48 sm:h-32 object-cover flex-shrink-0"
          />

          <div className="flex-1 sm:pl-2">
            <h3 className="text-2xl font-semibold gradient-text leading-7 hover:opacity-80 transition-opacity">
              {name}
            </h3>

            <div className="mt-1">
              <p className="text-sm font-medium uppercase tracking-widest text-gray-600 leading-4">
                Location
              </p>
              <div className="flex items-start gap-2 mt-0.5">
                <svg
                  className="w-2 h-3 text-gray-600 mt-1 flex-shrink-0"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                <p className="text-xs text-gray-600 leading-3">{location}</p>
              </div>
            </div>

            <div className="flex gap-1 mt-2">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className="w-5 h-5"
                  viewBox="0 0 20 19"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10 15.27L16.18 19L14.54 11.97L20 7.24L12.81 6.63L10 0L7.19 6.63L0 7.24L5.46 11.97L3.82 19L10 15.27Z"
                    fill="#FDCF00"
                  />
                </svg>
              ))}
            </div>

            <div className="mt-1">
              <p className="text-sm text-black leading-4">
                {reviewCount} Legal Reviews {reviewScore}
              </p>
              <p className="text-xs text-gray-600 mt-1 leading-3">
                Licensed for {yearsLicensed} years
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5">
          <p className="text-sm font-medium uppercase tracking-widest text-gray-600 leading-4">
            Practice Areas
          </p>
          <p className="text-sm text-black mt-1 leading-4">{practiceAreas.join(", ")}</p>
        </div>

        <div className="mt-4 flex justify-between items-start">
          <p className="text-xs text-gray-600 leading-4 flex-1 mr-4">
            {description}
          </p>
          <div className="flex space-x-2 flex-shrink-0">
            {user && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleChatWithLawyer();
                }}
                className="px-4 py-2 bg-[#00a884] text-white text-sm rounded-lg hover:bg-[#008f72] transition-colors flex items-center space-x-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span>Chat</span>
              </button>
            )}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                handleViewProfile();
              }}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-400 text-white text-sm rounded-lg hover:opacity-90 transition-opacity"
            >
              View Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChevronDown({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6 9L12 15L18 9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LawyerDirectory() {
  const [lawyers, setLawyers] = useState(sampleLawyers);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLawyers();
  }, []);

  const fetchLawyers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/lawyers');
      setLawyers(response.data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load lawyers');
      // Fallback to sample data if API fails
      setLawyers(sampleLawyers);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <div className="relative w-full h-70 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://api.builder.io/api/v1/image/assets/TEMP/a6d5caf31a055d5031a22064e43af9838d8c0b72?width=2880"
            alt=""
            className="w-full h-240 object-cover -translate-y-120"
          />
        </div>
        <div className="absolute inset-0 bg-gray-600/20"></div>
        <svg
          className="absolute top-0 left-1/2 -translate-x-1/2 w-160 h-70 fill-gray-600/20"
          width="645"
          height="280"
          viewBox="0 0 645 280"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M525.5 0H4C6.4 2 8.33333 6.16667 9 8C13 16.8 5.66667 24.6667 1.5 27.5V29.5C3.9 32.3 1.5 37 0 39V41.5L2.5 44.5H15C24.6 47.7 24.6667 54.8333 23.5 58H26.5L48.5 124.5L46.5 126.5C48.9 128.5 50.1667 132.333 50.5 134C52.9 140.8 41.8333 147.5 36 150L36.5 151C37.7 150.6 38 151.167 38 151.5C37.6 154.3 39.5 156 40.5 156.5C45.3 156.5 48.1667 161.5 49 164C59.8 162.8 65.1667 172.167 66.5 177C69.7 188.2 63.5 194.667 60 196.5C61.2 200.9 60.1667 204 59.5 205C135.9 201 171.667 221 180 231.5C210 246 220 267 224.5 279.5H644.5V201C607.7 167.4 629.167 105.667 644.5 79L525.5 0Z"
            fill="#5A5A5A"
            fillOpacity="0.2"
          />
        </svg>

        <h1 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center hero-title font-semibold uppercase px-4">
          Find
          <br />
          Lawyers
        </h1>
      </div>

      {/* Main Content */}
      <div className="max-w-screen-xl mx-auto px-4 lg:px-36 py-6">
        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-3 mb-10">
          <button className="h-10 px-4 rounded-lg border border-gray-600 flex items-center gap-2 hover:bg-gray-50 transition-colors">
            <svg
              className="w-5 h-5 stroke-gray-600"
              width="19"
              height="19"
              viewBox="0 0 19 19"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.61816 10.5156L7.51172 10.3799L7.51074 10.3789C7.51024 10.3783 7.50973 10.3772 7.50879 10.376C7.50664 10.3732 7.50327 10.3687 7.49902 10.3633C7.49052 10.3524 7.47753 10.3357 7.46094 10.3145C7.42778 10.272 7.37927 10.2094 7.31641 10.1289C7.18995 9.96708 7.00584 9.73252 6.77832 9.44141C6.32313 8.85899 5.69081 8.05021 4.9834 7.14551L0.646484 1.60352C0.298688 1.15354 0.6152 0.5 1.19629 0.5H17.8037C18.3848 0.5 18.7013 1.15354 18.3535 1.60352C17.1472 3.14178 15.4342 5.3362 14.0225 7.14551C13.3165 8.05026 12.6856 8.85894 12.2314 9.44141C12.0045 9.73248 11.8215 9.96703 11.6953 10.1289C11.6322 10.2098 11.5829 10.2729 11.5498 10.3154C11.5335 10.3363 11.5212 10.3524 11.5127 10.3633C11.5085 10.3686 11.5051 10.3732 11.5029 10.376C11.5019 10.3774 11.5005 10.3782 11.5 10.3789V10.3799L11.3936 10.5156V17.8125C11.3936 18.1868 11.0832 18.4999 10.7002 18.5H8.31152C7.92863 18.4997 7.61816 18.1868 7.61816 17.8125V10.5156Z"
                stroke="#5A5A5A"
              />
            </svg>
            <span className="text-xs text-gray-600">All Filters</span>
          </button>

          <button className="h-10 px-4 rounded-lg border border-gray-600 flex items-center gap-2 hover:bg-gray-50 transition-colors">
            <span className="text-xs text-gray-600">Years Licensed</span>
            <ChevronDown className="w-3 h-3 text-gray-600" />
          </button>

          <button className="h-10 px-4 rounded-lg border border-gray-600 flex items-center gap-2 hover:bg-gray-50 transition-colors">
            <span className="text-xs text-gray-600">Practice Area</span>
            <ChevronDown className="w-3 h-3 text-gray-600" />
          </button>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading lawyers...</p>
          </div>
        ) : (
          /* Lawyer Cards */
          <div className="space-y-6">
            {lawyers.map((lawyer) => (
              <LawyerCard key={lawyer.id} {...lawyer} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default LawyerDirectory;