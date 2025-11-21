import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 

/**
 * Sub-components (Icons & Logo)
 */

function LegalCityLogo() {
  const navigate = useNavigate();
  
  return (
    <div 
      className="flex items-center gap-2 cursor-pointer"
      onClick={() => navigate('/')}
    >
      <div className="bg-white rounded-lg px-3 py-1.5 shadow-sm">
        <span className="text-[#0284C7] font-bold text-lg tracking-tight">Legal</span>
      </div>
      <span className="text-white font-bold text-lg tracking-tight">City</span>
    </div>
  );
}

function StarIcon() {
  return (
    <svg width="20" height="19" viewBox="0 0 20 19" fill="none">
      <path d="M10 15.27L16.18 19L14.54 11.97L20 7.24L12.81 6.63L10 0L7.19 6.63L0 7.24L5.46 11.97L3.82 19L10 15.27Z" fill="#FDCF00"/>
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg width="8" height="12" viewBox="0 0 8 12" fill="none" className="flex-shrink-0 mt-[2px]">
      <path d="M4 0C1.78857 0 0 1.878 0 4.2C0 7.35 4 12 4 12C4 12 8 7.35 8 4.2C8 1.878 6.21143 0 4 0ZM4 5.7C3.21143 5.7 2.57143 5.028 2.57143 4.2C2.57143 3.372 3.21143 2.7 4 2.7C4.78857 2.7 5.42857 3.372 5.42857 4.2C5.42857 5.028 4.78857 5.7 4 5.7Z" fill="#5A5A5A"/>
    </svg>
  );
}

/**
 * Layout Components
 */

function Header({ currentLanguage, setCurrentLanguage, translations }) {
  const navigate = useNavigate();
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  const languages = [
    { code: 'EN', name: 'English' },
    { code: 'ES', name: 'Español' },
    { code: 'FR', name: 'Français' },
    { code: 'DE', name: 'Deutsch' }
  ];

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleSignupClick = () => {
    navigate('/register');
  };

  const handleLawyerDirectoryClick = () => {
    navigate('/lawyers');
  };

  const handleLanguageSelect = (language) => {
    setCurrentLanguage(language.code);
    setShowLanguageMenu(false);
  };

  return (
    <header className="w-full bg-gradient-to-b from-[#0071BC] to-[#00D2FF] flex items-center h-16" style={{ height: 64 }}>
      <div className="w-full max-w-[1440px] mx-auto flex items-center justify-between px-4 lg:px-[144px]">
        <div className="flex items-center gap-6">
          <LegalCityLogo />
          <button 
            onClick={handleLawyerDirectoryClick}
            className="hidden md:flex items-center text-white text-sm gap-2 hover:opacity-90 transition-opacity"
          >
            <span>{translations[currentLanguage].lawyerDirectory}</span>
            <svg width="8" height="7" viewBox="0 0 8 7" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0.491211 0.34375L3.99121 5.34375L7.49121 0.34375" stroke="white" strokeWidth="1.2"/>
            </svg>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={handleLoginClick}
            className="flex items-center gap-2 h-[38px] px-4 rounded-[20px] bg-transparent border border-white/30 hover:bg-white/10 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="7" cy="4" r="3" stroke="white" strokeWidth="1.5"/>
              <path d="M2 12c0-2.5 2.5-4 5-4s5 1.5 5 4" stroke="white" strokeWidth="1.5"/>
            </svg>
            <span className="text-white text-sm">{translations[currentLanguage].login}</span>
          </button>

          <div className="relative">
            <button 
              onClick={() => setShowLanguageMenu(!showLanguageMenu)}
              className="flex items-center gap-2 h-[38px] px-3 rounded-[20px] bg-transparent border border-white/30 hover:bg-white/10 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="8" cy="8" r="6" stroke="white" strokeWidth="1.5"/>
                <path d="M2 8h12M8 2c1.5 0 3 2.5 3 6s-1.5 6-3 6-3-2.5-3-6 1.5-6 3-6z" stroke="white" strokeWidth="1.5"/>
              </svg>
              <span className="text-white text-sm">{currentLanguage}</span>
              <svg className={`w-3 h-3 text-white transition-transform ${showLanguageMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {showLanguageMenu && (
              <div className="absolute top-full right-0 mt-1 bg-white rounded-lg border border-gray-200 shadow-lg z-10 min-w-[120px]">
                {languages.map((language) => (
                  <button
                    key={language.code}
                    onClick={() => handleLanguageSelect(language)}
                    className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors ${
                      currentLanguage === language.code ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                    }`}
                  >
                    {language.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button 
            onClick={handleSignupClick}
            className="h-[38px] px-6 rounded-[20px] bg-white text-black text-sm font-medium hover:bg-gray-100 transition-colors"
          >
{translations[currentLanguage].signup}
          </button>
        </div>
      </div>
    </header>
  );
}

function HeroSection({ currentLanguage, translations }) {
  const navigate = useNavigate();
  const [searchData, setSearchData] = useState({
    lawyer: '',
    specialty: '',
    location: ''
  });

  const handleInputChange = (field, value) => {
    setSearchData(prev => ({ ...prev, [field]: value }));
  };

  const handleSearch = () => {
    const queryParams = new URLSearchParams();
    if (searchData.lawyer) queryParams.append('lawyer', searchData.lawyer);
    if (searchData.specialty) queryParams.append('specialty', searchData.specialty);
    if (searchData.location) queryParams.append('location', searchData.location);
    
    navigate(`/lawyers?${queryParams.toString()}`);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <section className="relative w-full h-[500px] sm:h-[600px] bg-gray-900">
      <img
        src="https://api.builder.io/api/v1/image/assets/TEMP/d12735386b9fab735739b6b5424336fcff2f69c9?width=2880"
        alt="Lawyer and client shaking hands"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-[rgba(90,90,90,0.20)]" />

      <div className="relative h-full flex items-center justify-center px-4 sm:px-6">
        <div className="w-full max-w-[400px]">
          <h1 className="text-white text-xl sm:text-2xl font-semibold mb-6 sm:mb-[30px]">
            {translations[currentLanguage].findLawyer}
          </h1>

          <div className="flex flex-col gap-4 sm:gap-[24px]">
            <div className="h-[41px] rounded-[8px] border border-white/20 bg-gradient-to-r from-white/40 to-white/10 backdrop-blur-md px-4 flex items-center">
              <input
                type="text"
                placeholder={translations[currentLanguage].practiceNameLawyer}
                value={searchData.lawyer}
                onChange={(e) => handleInputChange('lawyer', e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full bg-transparent placeholder-[#F5F5F5] text-[#F5F5F5] text-sm focus:outline-none"
              />
            </div>

            <div className="h-[41px] rounded-[8px] border border-white/20 bg-gradient-to-r from-white/40 to-white/10 backdrop-blur-md px-4 flex items-center">
              <input
                type="text"
                placeholder={translations[currentLanguage].specialty}
                value={searchData.specialty}
                onChange={(e) => handleInputChange('specialty', e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full bg-transparent placeholder-[#F5F5F5] text-[#F5F5F5] text-sm focus:outline-none"
              />
            </div>

            <div className="h-[41px] rounded-[8px] border border-white/20 bg-gradient-to-r from-white/40 to-white/10 backdrop-blur-md px-4 flex items-center">
              <input
                type="text"
                placeholder={translations[currentLanguage].cityStateZip}
                value={searchData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full bg-transparent placeholder-[#F5F5F5] text-[#F5F5F5] text-sm focus:outline-none"
              />
            </div>

            <button
              onClick={handleSearch}
              className="h-[41px] rounded-[8px] bg-gradient-to-r from-[#0071BC] to-[#00D2FF] text-white font-medium hover:opacity-90 transition-opacity"
            >
{translations[currentLanguage].searchLawyers}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function LawyerCard({
  category,
  name,
  rating,
  location,
  image,
  practiceAreas,
  successTitle,
  successAuthor,
  successDate,
  successDescription,
}) {
  return (
    <div className="w-full max-w-[364px] h-[412px] flex-shrink-0 bg-white rounded-md overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="h-full flex flex-col">
        <div className="bg-gradient-to-b from-[#0071BC] to-[#00D2FF] bg-clip-text text-transparent text-base font-semibold mb-[16px]">
          {category}
        </div>

        <div className="bg-[#F5F5F5] border border-[#5A5A5A]/30 h-[218px] mb-[16px] p-4 flex gap-4">
          <img
            src={image}
            alt={name}
            className="w-[100px] h-[136px] object-cover flex-shrink-0"
          />

          <div className="flex-1 flex flex-col">
            <h3 className="text-2xl font-semibold bg-gradient-to-b from-[#0071BC] to-[#00D2FF] bg-clip-text text-transparent mb-[6px]">
              {name}
            </h3>

            <div className="flex gap-[2px] mb-[17px]">
              {[...Array(5)].map((_, i) => (
                <StarIcon key={i} />
              ))}
            </div>

            <div className="text-sm text-black mb-[13px]">
              Legal Rating {rating.toFixed(1)}
            </div>

            <div className="mt-auto">
              <div className="text-[#5A5A5A] text-sm font-medium uppercase tracking-[2.73px] mb-[4px]">
                Location
              </div>
              <div className="flex items-start gap-2">
                <LocationIcon />
                <div className="text-[#5A5A5A] text-[10px]">
                  {location}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#F5F5F5] border border-[#5A5A5A]/30 flex-1 p-2">
          <div className="text-[#5A5A5A] text-sm font-medium uppercase tracking-[2.73px] mb-[5px]">
            Practice Areas
          </div>
          <div className="text-sm text-black mb-[10px]">
            {practiceAreas}
          </div>

          <div className="text-sm font-semibold text-black mb-[6px]">
            {successTitle}
          </div>

          <div className="flex gap-[2px] mb-[6px]">
            {[...Array(5)].map((_, i) => (
              <StarIcon key={i} />
            ))}
          </div>

          <div className="flex items-center gap-2 text-[#5A5A5A] text-[10px] mb-[10px]">
            <span>{successAuthor}</span>
            <span>{successDate}</span>
          </div>

          <div className="text-[#5A5A5A] text-[10px] leading-relaxed line-clamp-3">
            {successDescription}
          </div>
        </div>
      </div>
    </div>
  );
}

function LawyerCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [cardsPerSlide, setCardsPerSlide] = useState(3);

  const lawyers = [
    {
      category: "Business",
      name: "Nedime Acikli",
      rating: 10.0,
      location: "1 Station Road, London E17 8AA",
      image: "https://api.builder.io/api/v1/image/assets/TEMP/d70964b5007735e60786db4890aeb2c95f7fafc9?width=200",
      practiceAreas: "Business, Libel & Slander",
      successTitle: "Success",
      successAuthor: "By Ronald Richards",
      successDate: "October 24, 2018",
      successDescription: "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.",
    },
    {
      category: "Business",
      name: "Melek Arican",
      rating: 10.0,
      location: "22 Church Lane, Birmingham B3 2NN",
      image: "https://api.builder.io/api/v1/image/assets/TEMP/c933ad1de266b833da3ba3476e8ecd6c5b16255a?width=200",
      practiceAreas: "Business, Libel & Slander",
      successTitle: "Success",
      successAuthor: "By Ralph Edwards",
      successDate: "July 14, 2015",
      successDescription: "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.",
    },
    {
      category: "Business",
      name: "Nika Monhart",
      rating: 10.0,
      location: "36 North Street, Chichester PO19 1LY",
      image: "https://api.builder.io/api/v1/image/assets/TEMP/7e2d9d9504fa1c07abac9fdc18602c4b3ced9a78?width=200",
      practiceAreas: "Business, Libel & Slander",
      successTitle: "Success",
      successAuthor: "By Jane Cooper",
      successDate: "March 6, 2018",
      successDescription: "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.",
    },
    {
      category: "Business",
      name: "Ronald Richards",
      rating: 10.0,
      location: "1 Station Road, London E17 8AA",
      image: "https://api.builder.io/api/v1/image/assets/TEMP/cc67d9df49bf011597965946ac09a3d887c8dd83?width=200",
      practiceAreas: "Business, Libel & Slander",
      successTitle: "Success",
      successAuthor: "By Ronald Richards",
      successDate: "October 24, 2018",
      successDescription: "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.",
    },
    {
      category: "Business",
      name: "Darlene Robertson",
      rating: 10.0,
      location: "1 Station Road, London E17 8AA",
      image: "https://api.builder.io/api/v1/image/assets/TEMP/cc67d9df49bf011597965946ac09a3d887c8dd83?width=200",
      practiceAreas: "Business, Libel & Slander",
      successTitle: "Success",
      successAuthor: "By Ronald Richards",
      successDate: "October 24, 2018",
      successDescription: "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.",
    },
  ];

  useEffect(() => {
    const updateCardsPerSlide = () => {
      if (window.innerWidth < 768) {
        setCardsPerSlide(1);
      } else if (window.innerWidth < 1024) {
        setCardsPerSlide(2);
      } else {
        setCardsPerSlide(3);
      }
    };

    updateCardsPerSlide();
    window.addEventListener('resize', updateCardsPerSlide);
    return () => window.removeEventListener('resize', updateCardsPerSlide);
  }, []);

  const totalSlides = Math.ceil(lawyers.length / cardsPerSlide);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <section className="w-full bg-[#E3E3E3] py-8 lg:py-[34px] relative min-h-[480px] flex items-center">
      <div className="w-full max-w-[1440px] mx-auto px-6 lg:px-[154px]">
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out gap-5"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {Array.from({ length: totalSlides }).map((_, slideIndex) => (
              <div key={slideIndex} className="min-w-full flex flex-col md:flex-row justify-center items-center md:items-start gap-5">
                {lawyers.slice(slideIndex * cardsPerSlide, slideIndex * cardsPerSlide + cardsPerSlide).map((lawyer, index) => (
                  <LawyerCard key={index} {...lawyer} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={prevSlide}
        className="hidden lg:flex absolute left-0 lg:left-[48px] top-1/2 -translate-y-1/2 w-[60px] lg:w-[120px] h-full lg:h-[480px] items-center justify-center hover:bg-black/5 transition-colors"
        aria-label="Previous slide"
      >
        <svg width="14" height="24" viewBox="0 0 14 24" fill="none">
          <path d="M13 2L3 12L13 22" stroke="#5A5A5A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      <button
        onClick={nextSlide}
        className="hidden lg:flex absolute right-0 lg:right-[48px] top-1/2 -translate-y-1/2 w-[60px] lg:w-[120px] h-full lg:h-[480px] items-center justify-center hover:bg-black/5 transition-colors"
        aria-label="Next slide"
      >
        <svg width="14" height="24" viewBox="0 0 14 24" fill="none">
          <path d="M1 22L11 12L1 2" stroke="#5A5A5A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      <div className="absolute bottom-4 lg:bottom-8 left-1/2 -translate-x-1/2 flex gap-4">
        {Array.from({ length: totalSlides }).map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-[10px] h-[10px] rounded-full transition-all ${
              index === currentSlide ? "bg-[#5A5A5A]" : "bg-[#5A5A5A]/20"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}

/**
 * Main Page Component
 */

export default function UserInterface() {
  const [currentLanguage, setCurrentLanguage] = useState('EN');

  const translations = {
    EN: {
      findLawyer: 'Find Lawyer',
      practiceNameLawyer: 'Practice name / Lawyer',
      specialty: 'Specialty',
      cityStateZip: 'City, State or Zip',
      searchLawyers: 'Search Lawyers',
      topFeaturesLawyers: 'Top Features lawyers near you',
      lawyerDirectory: 'Lawyer Directory',
      login: 'Login',
      signup: 'Signup'
    },
    ES: {
      findLawyer: 'Encontrar Abogado',
      practiceNameLawyer: 'Nombre del bufete / Abogado',
      specialty: 'Especialidad',
      cityStateZip: 'Ciudad, Estado o Código Postal',
      searchLawyers: 'Buscar Abogados',
      topFeaturesLawyers: 'Los mejores abogados cerca de ti',
      lawyerDirectory: 'Directorio de Abogados',
      login: 'Iniciar Sesión',
      signup: 'Registrarse'
    },
    FR: {
      findLawyer: 'Trouver un Avocat',
      practiceNameLawyer: 'Nom du cabinet / Avocat',
      specialty: 'Spécialité',
      cityStateZip: 'Ville, État ou Code Postal',
      searchLawyers: 'Rechercher des Avocats',
      topFeaturesLawyers: 'Les meilleurs avocats près de chez vous',
      lawyerDirectory: 'Annuaire des Avocats',
      login: 'Connexion',
      signup: 'S\'inscrire'
    },
    DE: {
      findLawyer: 'Anwalt Finden',
      practiceNameLawyer: 'Kanzleiname / Anwalt',
      specialty: 'Fachgebiet',
      cityStateZip: 'Stadt, Bundesland oder PLZ',
      searchLawyers: 'Anwälte Suchen',
      topFeaturesLawyers: 'Top Anwälte in Ihrer Nähe',
      lawyerDirectory: 'Anwaltsverzeichnis',
      login: 'Anmelden',
      signup: 'Registrieren'
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Header currentLanguage={currentLanguage} setCurrentLanguage={setCurrentLanguage} translations={translations} />
      <HeroSection currentLanguage={currentLanguage} translations={translations} />

      <div className="bg-white py-6 sm:py-8">
        <h2 className="text-xl sm:text-2xl font-semibold text-black text-center px-4">
          {translations[currentLanguage].topFeaturesLawyers}
        </h2>
      </div>

      <LawyerCarousel />
    </div>
  );
}