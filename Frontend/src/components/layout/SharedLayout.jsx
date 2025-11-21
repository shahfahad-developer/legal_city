import React, { useState, useEffect } from 'react';
import { Menu, Search } from 'lucide-react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Sidebar Component
const Sidebar = ({ isOpen, onClose, isCollapsed, onToggleCollapse }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const menuItems = [
    { icon: "https://api.builder.io/api/v1/image/assets/TEMP/2f0c8c8d7635b366b2eac869a4a83753ba829af6?width=48", label: "Blog", path: "/blog" },
    { icon: "https://api.builder.io/api/v1/image/assets/TEMP/b83955cda14e3150d58c5f8856dba1c32c93d36b?width=48", label: "Messages", path: "/messages" },
    { icon: "https://api.builder.io/api/v1/image/assets/TEMP/20095a265d253a905d31653e5e034766d50fa558?width=48", label: "Directory", path: "/directory" },
    { icon: "https://api.builder.io/api/v1/image/assets/TEMP/ba389f49632462ccea957de8f25e8777312f1cd0?width=48", label: "Forms", path: "/forms" },
    { icon: "https://api.builder.io/api/v1/image/assets/TEMP/bb774d091421c903ce99f30442b09d93b75ffe4c?width=48", label: "Social Media", path: "/social-media" },
    { icon: "https://api.builder.io/api/v1/image/assets/TEMP/306d0dbe1e5279e83e68f14a3d3c39ccf7c3423d?width=48", label: "Tasks", path: "/tasks" },
    { icon: "https://api.builder.io/api/v1/image/assets/TEMP/47af2071e8596ee04273031ffb542a2464c3d308?width=48", label: "Cases", path: "/cases" },
    { icon: "https://api.builder.io/api/v1/image/assets/TEMP/826016113f370b690da4babb177cb0b88e914e40?width=48", label: "Dashboard", path: "/dashboard" },
    { icon: "https://api.builder.io/api/v1/image/assets/TEMP/5b5a6fc781806b0cd27fa7b3705b3a262f336d25?width=48", label: "Accounting", path: "/accounting" },
    { icon: "https://api.builder.io/api/v1/image/assets/TEMP/8546f8527778902e9559a1f7e78de6c757aecf92?width=48", label: "Profile", path: "/profile" },
    { icon: "https://api.builder.io/api/v1/image/assets/TEMP/46434e229fe79898dedcc285339ffa760ab1ba45?width=48", label: "Calendar", path: "/calendar" },
    { icon: "https://api.builder.io/api/v1/image/assets/TEMP/4982b7bc2ac67a6ced3ca7e854eb56e2849377fc?width=48", label: "Q&A", path: "/qa" },
    { icon: "https://api.builder.io/api/v1/image/assets/TEMP/9cfca6b6a2172379467f583891bf9be19de991a7?width=48", label: "Find a Lawyer", path: "/find-lawyer" },
    { icon: "https://api.builder.io/api/v1/image/assets/TEMP/3b54c1b27312a1fd5eeb7d42cc13ccd8530ce889?width=48", label: "Refer", path: "/refer" },
    { icon: "https://api.builder.io/api/v1/image/assets/TEMP/8ee49bdf701fc8b9667fd0ce61796ac43b4fb529?width=48", label: "Settings", path: "/settings" },
  ];
  
  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.clear();
    
    // Navigate to logout page
    navigate('/logout');
  };

  return (
    <aside className={`fixed left-0 top-0 h-screen bg-white border-r border-gray-300 overflow-y-auto z-20 transition-all duration-300 ${
      isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
    } ${isCollapsed ? 'w-16' : 'w-64'}`}>
      <div className="flex flex-col h-full">
        <div className={`${isCollapsed ? 'px-2' : 'px-9'} pt-16 pb-8 transition-all duration-300`}>
          {!isCollapsed && (
            <svg className="w-48 h-16" viewBox="0 0 188 63" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_1277_1254)">
                <text fill="#0078C0" xmlSpace="preserve" style={{whiteSpace: 'pre'}} fontFamily="Inter" fontSize="8.72545" fontWeight="600" letterSpacing="0.39em">
                  <tspan x="5.44126" y="60.4463">"LEGAL FOR THE PEOPLE"</tspan>
                </text>
                <path d="M5.10702 21.6474C5.10702 15.6374 7.86608 10.201 12.3247 6.28038C16.7324 2.39662 22.8015 0 29.4978 0H98.86C112.329 0 123.251 9.693 123.251 21.6474C123.251 33.6019 112.329 43.2949 98.86 43.2949H29.4978C24.1323 43.2949 19.1693 41.7504 15.1431 39.1448C11.5236 39.4234 11.4389 40.2387 0 43.2949C6.13266 34.8473 5.10702 34.2942 5.10702 21.6474Z" fill="#0078C0"/>
                <path d="M127.352 20.2626C127.352 13.1301 132.904 8.31641 140.104 8.31641C145.334 8.31641 148.381 11.0531 150.064 13.9618L145.694 16.0389C144.69 14.1707 142.541 12.6795 140.104 12.6795C135.735 12.6795 132.581 15.8996 132.581 20.2626C132.581 24.6257 135.735 27.8458 140.104 27.8458C142.541 27.8458 144.69 26.3546 145.694 24.4864L150.064 26.5307C148.381 29.4067 145.334 32.2089 140.104 32.2089C132.904 32.2089 127.352 27.3624 127.352 20.2626Z" fill="#0078C0"/>
                <path d="M151.68 10.6364C151.68 9.18207 152.896 8.03906 154.367 8.03906C155.871 8.03906 157.088 9.18207 157.088 10.6364C157.088 12.0908 155.871 13.2666 154.367 13.2666C152.896 13.2666 151.68 12.0908 151.68 10.6364ZM152.108 31.7963V15.0692H156.66V31.7963H152.108Z" fill="#0078C0"/>
                <path d="M161.209 27.6043V18.9109H158.344V15.0681H161.209V10.4961H165.761V15.0681H169.27V18.9109H165.761V26.4244C165.761 27.4978 166.333 28.2925 167.337 28.2925C168.015 28.2925 168.664 28.0508 168.914 27.7723L169.88 31.1316C169.202 31.7216 167.981 32.205 166.083 32.205C162.896 32.2091 161.209 30.6154 161.209 27.6043Z" fill="#0078C0"/>
                <path d="M171.563 34.3949C171.957 34.5669 172.567 34.6735 172.995 34.6735C174.178 34.6735 174.966 34.3621 175.394 33.4608L176.038 32.0064L169.016 15.0703H173.89L178.403 26.7052L182.955 15.0703H187.829L179.696 34.5342C178.407 37.6846 176.115 38.5162 173.139 38.5859C172.639 38.5859 171.457 38.4835 170.919 38.3073L171.563 34.3949Z" fill="#0078C0"/>
                <path d="M24.4844 31.5107V8.85547H29.5066V27.2664H39.4155V31.5107H24.4844Z" fill="white"/>
                <path d="M40.332 23.2902C40.332 18.5379 43.9854 14.6992 49.1178 14.6992C54.2121 14.6992 57.6196 18.3658 57.6196 23.6999V24.72H45.0068C45.3246 26.7233 47.0114 28.3866 49.8892 28.3866C51.3301 28.3866 53.2967 27.8089 54.3859 26.7888L56.3863 29.6402C54.6995 31.1355 52.0294 31.918 49.3933 31.918C44.2312 31.918 40.332 28.5546 40.332 23.2902ZM49.1178 18.2307C46.3418 18.2307 45.1466 20.0988 44.9729 21.7293H53.3348C53.1907 20.1684 52.0676 18.2307 49.1178 18.2307Z" fill="white"/>
                <path d="M59.6242 35.7237L61.6246 32.6307C62.9935 34.0564 64.8244 34.634 66.9308 34.634C69.0753 34.634 71.6394 33.7491 71.6394 30.4225V28.8289C70.3044 30.4594 68.4777 31.3771 66.3714 31.3771C62.1544 31.3771 58.8867 28.5216 58.8867 23.0565C58.8867 17.6897 62.0823 14.7031 66.3714 14.7031C68.4099 14.7031 70.2705 15.5184 71.6394 17.2186V15.1128H76.1022V30.4307C76.1022 36.6455 71.1139 38.1736 66.9308 38.1736C64.0488 38.1695 61.7645 37.5222 59.6242 35.7237ZM71.6394 25.703V20.369C70.8681 19.3161 69.2491 18.5336 67.8081 18.5336C65.244 18.5336 63.4852 20.2297 63.4852 23.0483C63.4852 25.8669 65.2398 27.567 67.8081 27.567C69.2491 27.5711 70.8638 26.7559 71.6394 25.703Z" fill="white"/>
                <path d="M89.8377 31.5126V29.7797C88.6764 31.1398 86.676 31.9182 84.4636 31.9182C81.7597 31.9182 78.5938 30.1525 78.5938 26.4818C78.5938 22.6103 81.7554 21.1846 84.4636 21.1846C86.748 21.1846 88.7145 21.8975 89.8377 23.188V21.115C89.8377 19.4517 88.3628 18.366 86.1123 18.366C84.3195 18.366 82.6327 19.0461 81.2299 20.2997L79.4711 17.2763C81.5435 15.4778 84.2136 14.6953 86.8836 14.6953C90.7828 14.6953 94.3344 16.1906 94.3344 20.9101V31.5085H89.8377V31.5126ZM89.8377 27.5715V25.5354C89.1002 24.585 87.6931 24.077 86.2522 24.077C84.4933 24.077 83.0523 24.9946 83.0523 26.5555C83.0523 28.1164 84.4933 29.0013 86.2522 29.0013C87.6974 28.9972 89.1002 28.522 89.8377 27.5715Z" fill="white"/>
              </g>
              <defs>
                <clipPath id="clip0_1277_1254">
                  <rect width="187.824" height="62.2416" fill="white"/>
                </clipPath>
              </defs>
            </svg>
          )}
          <button
            onClick={onToggleCollapse}
            className="hidden lg:block absolute top-4 right-2 p-1 hover:bg-gray-100 rounded"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isCollapsed ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7"} />
            </svg>
          </button>
        </div>

        <nav className={`flex-1 ${isCollapsed ? 'px-2' : 'px-9'} flex flex-col gap-8 transition-all duration-300`}>
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className={`flex items-center gap-4 transition-colors ${
                isCollapsed ? 'justify-center' : ''
              } ${
                location.pathname === item.path 
                  ? 'text-blue-600 bg-blue-50 px-3 py-2 rounded-lg' 
                  : 'text-gray-800 hover:text-blue-600'
              }`}
              title={isCollapsed ? item.label : ''}
            >
              <img src={item.icon} alt="" className="w-6 h-6 flex-shrink-0" />
              {!isCollapsed && (
                <span className="font-medium text-base leading-6 opacity-85">{item.label}</span>
              )}
            </Link>
          ))}
          
          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className={`flex items-center gap-4 text-gray-800 hover:text-red-600 transition-colors ${
              isCollapsed ? 'justify-center' : ''
            }`}
            title={isCollapsed ? 'Log out' : ''}
          >
            <img src="https://api.builder.io/api/v1/image/assets/TEMP/3404b0bea32bbdc337855770f00f9e9c4329cc1f?width=48" alt="" className="w-6 h-6 flex-shrink-0" />
            {!isCollapsed && (
              <span className="font-medium text-base leading-6 opacity-85">Log out</span>
            )}
          </button>
        </nav>
      </div>
    </aside>
  );
};

// Header Component
const Header = ({ onMenuClick, sidebarWidth }) => {
  return (
    <header className={`fixed top-0 left-0 right-0 h-24 bg-white z-10 flex items-center justify-between px-4 md:px-8 transition-all duration-300`} style={{ left: `${sidebarWidth}px` }}>
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 bg-white rounded-lg shadow-md"
      >
        <Menu className="w-6 h-6" />
      </button>
      
      <h1 className="text-blue-900 font-semibold text-xl md:text-3xl leading-none tracking-tight">
        Welcome Back, Veel
      </h1>

      <div className="hidden md:flex items-center gap-2 px-5 h-10 rounded-full border border-gray-300 w-full max-w-sm">
        <Search className="w-5 h-5 text-gray-500" />
        <input
          type="text"
          placeholder="Search"
          className="flex-1 bg-transparent border-none outline-none text-sm text-gray-500 placeholder:text-gray-500"
        />
      </div>
    </header>
  );
};

// Footer Component
const Footer = ({ sidebarWidth = 0 }) => {
  const footerSections = [
    {
      title: "Browse Our Site",
      links: [
        "Find a Lawyer",
        "Review Your Lawyer",
        "Legal Advice",
        "Recently Answered Questions",
        "Browse Practice Areas",
        "Avvo Stories Blog",
      ],
    },
    {
      title: "Popular Locations",
      links: [
        "New York City Lawyers",
        "Los Angeles Lawyers",
        "Chicago Lawyers",
        "Houston Lawyers",
        "Washington, DC Lawyers",
        "Philadelphia Lawyers",
        "Phoenix Lawyers",
        "San Antonio Lawyers",
        "San Diego Lawyers",
      ],
    },
    {
      title: "Popular Practice Areas",
      links: [
        "Bankruptcy & Debt Lawyers",
        "Business Lawyers",
        "Criminal Defense Lawyers",
        "DUI & DWI Lawyers",
        "Estate Planning Lawyers",
        "Car Accident Lawyers",
        "Divorce & Separation Lawyers",
        "Intellectual Property Lawyers",
        "Speeding & Traffic Lawyers",
      ],
    },
    {
      title: "About",
      links: ["About Avvo", "Careers", "Support", "Avvo Rating Explained"],
    },
  ];

  return (
    <footer className="bg-gray-800 text-white py-10 transition-all duration-300" style={{ marginLeft: `${sidebarWidth}px` }}>
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-24 mb-8">
          {footerSections.map((section, index) => (
            <div key={index} className="flex flex-col gap-3">
              <h3 className="font-bold text-base leading-6">{section.title}</h3>
              <ul className="flex flex-col">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href="/"
                      className="text-gray-300 text-sm leading-relaxed hover:text-white transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-8 pt-8 border-t border-gray-600">
          <div className="flex flex-wrap items-center gap-1.5 text-sm">
            <a href="/" className="text-gray-300 hover:text-white pr-2 border-r border-gray-300">
              Terms of Use
            </a>
            <a href="/" className="text-gray-300 hover:text-white px-2 border-r border-gray-300">
              Privacy Policy
            </a>
            <a href="/" className="text-gray-300 hover:text-white px-2 border-r border-gray-300">
              Do Not Sell or Share My Personal Information
            </a>
            <a href="/" className="text-gray-300 hover:text-white px-2 border-r border-gray-300">
              Community Guidelines
            </a>
            <a href="/" className="text-gray-300 hover:text-white px-2">
              Sitemap
            </a>
          </div>

          <p className="text-gray-300 text-sm">© Avvo Inc. All Rights Reserved 2023</p>
        </div>
      </div>
    </footer>
  );
};

// Main Shared Layout Component
const SharedLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const sidebarWidth = sidebarCollapsed ? 64 : 256;

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-[#F1F9FF]">
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-10"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Header 
        onMenuClick={() => setSidebarOpen(!sidebarOpen)} 
        sidebarWidth={typeof window !== 'undefined' && window.innerWidth >= 1024 ? sidebarWidth : 0}
      />

      <main className="pt-24 min-h-screen transition-all duration-300" style={{ marginLeft: typeof window !== 'undefined' && window.innerWidth >= 1024 ? `${sidebarWidth}px` : '0' }}>
        <Outlet />
      </main>

      <Footer sidebarWidth={typeof window !== 'undefined' && window.innerWidth >= 1024 ? sidebarWidth : 0} />
    </div>
  );
};

export default SharedLayout;