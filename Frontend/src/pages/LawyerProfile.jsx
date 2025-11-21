import { useParams, useLocation } from 'react-router-dom';
import { Star, Phone, Mail, MapPin, Award, Calendar, Shield, MessageCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import DashboardHeader from '../components/layout/DashboardHeader';

export default function LawyerProfile() {
  const { id } = useParams();
  const { user } = useAuth();
  const location = useLocation();
  
  // Check if user came from dashboard
  const cameFromDashboard = user && location.pathname.startsWith('/dashboard/lawyer/');

  // Mock data - replace with API call based on id
  const lawyer = {
    id: 1,
    name: "Christopher McLane",
    fullName: "Christopher Michael McLane",
    title: "Family Attorney",
    location: "Golden, CO",
    rating: 5.0,
    reviews: 69,
    phone: "(303) 731-5402",
    email: "chris@mountainfamilylaw.com",
    website: "mountainfamilylaw.com",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
    yearsLicensed: 16,
    freeConsultation: true,
    virtualConsultation: true,
    about: "I handle all aspects of family/domestic relations law in Colorado, including divorce, allocation of parental responsibilities (custody), adoptions, pre-nuptial agreements, child support, appeals. I help families throughout Colorado navigate through the stress and anxiety encountered in difficult domestic relations cases.",
    practiceAreas: [
      { name: "Adoption", percentage: 20, years: 17 },
      { name: "Child custody", percentage: 20, years: 17 },
      { name: "Child support", percentage: 20, years: 17 },
      { name: "Divorce and separation", percentage: 20, years: 17 },
      { name: "Family", percentage: 20, years: 17 }
    ],
    awards: ["AV Preeminent", "Client's Choice", "Platinum"],
    hourlyRate: "$425",
    address: "P.O. Box 17431, Golden, CO, 80402",
    education: [
      { school: "Roger Williams University, Ralph R. Papitto School of Law", degree: "JD - Juris Doctor", year: "2006" },
      { school: "Southern Illinois University, Carbondale", degree: "BS - Bachelor of Science", year: "2003" }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {cameFromDashboard && <DashboardHeader />}
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-shrink-0">
              <img
                src={lawyer.image}
                alt={lawyer.name}
                className="w-32 h-32 rounded-lg object-cover border border-gray-200 shadow-sm"
              />
            </div>
            
            <div className="flex-1">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{lawyer.name}</h1>
                  <p className="text-xl text-blue-600 mb-2">{lawyer.title}</p>
                  <div className="flex items-center gap-2 text-gray-600 mb-4">
                    <MapPin className="w-4 h-4" />
                    <span>{lawyer.location}</span>
                  </div>
                  
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                      <span className="ml-2 text-lg font-semibold">{lawyer.rating}</span>
                      <span className="ml-1 text-gray-600">({lawyer.reviews} reviews)</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="px-4 py-2 bg-green-50 text-green-700 rounded-md text-sm font-medium border border-green-200">
                      Licensed {lawyer.yearsLicensed} years
                    </span>
                    {lawyer.freeConsultation && (
                      <span className="px-4 py-2 bg-blue-50 text-blue-700 rounded-md text-sm font-medium border border-blue-200">
                        Free Consultation
                      </span>
                    )}
                    {lawyer.virtualConsultation && (
                      <span className="px-4 py-2 bg-purple-50 text-purple-700 rounded-md text-sm font-medium border border-purple-200">
                        Virtual Available
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <button className="flex items-center justify-center gap-3 bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-md font-medium">
                    <Phone className="w-5 h-5" />
                    {lawyer.phone}
                  </button>
                  <button className="flex items-center justify-center gap-3 bg-green-600 text-white px-8 py-4 rounded-lg hover:bg-green-700 transition-all duration-200 shadow-sm hover:shadow-md font-medium">
                    <MessageCircle className="w-5 h-5" />
                    Send Message
                  </button>
                  <button className="flex items-center justify-center gap-3 border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium">
                    Visit Website
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* About */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-100">About</h2>
              <p className="text-gray-700 leading-relaxed text-lg">{lawyer.about}</p>
            </div>

            {/* Practice Areas */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-100">Practice Areas</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {lawyer.practiceAreas.map((area, index) => (
                  <div key={index} className="p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 text-lg">{area.name}</h3>
                      <span className="text-2xl font-bold text-blue-600">{area.percentage}%</span>
                    </div>
                    <p className="text-gray-600">{area.years} years experience</p>
                    <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${area.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Resume */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-100">Professional Resume</h2>
              
              {/* AVVO Rating */}
              <div className="mb-8">
                <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl">
                  <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-2xl">10.0</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">AVVO RATING</h3>
                    <p className="text-orange-700 font-semibold text-lg">10.0 (Superb)</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-8">
                  {/* Work Experience */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <div className="w-2 h-6 bg-blue-600 rounded"></div>
                      Work Experience
                    </h3>
                    <div className="border-l-4 border-blue-200 pl-6">
                      <div className="relative">
                        <div className="absolute -left-8 w-4 h-4 bg-blue-600 rounded-full"></div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-gray-900 text-lg">Owner</h4>
                          <p className="text-blue-600 font-medium">Family Law Center of the Rockies</p>
                          <p className="text-gray-600">2006 - Present</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Education */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <div className="w-2 h-6 bg-green-600 rounded"></div>
                      Education
                    </h3>
                    <div className="space-y-3">
                      <div className="p-4 bg-gray-50 border-l-4 border-green-500 rounded-r-lg">
                        <h4 className="font-semibold text-gray-900">Roger Williams University</h4>
                        <p className="text-gray-600">JD - Juris Doctor</p>
                        <p className="text-gray-500 text-sm">2006</p>
                      </div>
                      <div className="p-4 bg-gray-50 border-l-4 border-green-500 rounded-r-lg">
                        <h4 className="font-semibold text-gray-900">University of Denver</h4>
                        <p className="text-gray-600">JD - Juris Doctor</p>
                        <p className="text-gray-500 text-sm">2006</p>
                      </div>
                      <div className="p-4 bg-gray-50 border-l-4 border-green-500 rounded-r-lg">
                        <h4 className="font-semibold text-gray-900">Southern Illinois University</h4>
                        <p className="text-gray-600">BS - Bachelor of Science</p>
                        <p className="text-gray-500 text-sm">2003</p>
                      </div>
                    </div>
                  </div>

                  {/* Languages */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <div className="w-2 h-6 bg-purple-600 rounded"></div>
                      Languages
                    </h3>
                    <span className="px-4 py-2 bg-purple-50 text-purple-700 rounded-lg font-medium border border-purple-200">
                      English
                    </span>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-8">
                  {/* Honors and Awards */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <div className="w-2 h-6 bg-yellow-600 rounded"></div>
                      Honors & Awards
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <Award className="w-6 h-6 text-yellow-600" />
                        <div>
                          <h4 className="font-semibold text-gray-900">Client Champion Platinum</h4>
                          <p className="text-gray-600 text-sm">Martindale-Hubbell • 2022</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <Award className="w-6 h-6 text-yellow-600" />
                        <div>
                          <h4 className="font-semibold text-gray-900">AV Peer Review Rating</h4>
                          <p className="text-gray-600 text-sm">Martindale-Hubbell • 2022</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <Award className="w-6 h-6 text-yellow-600" />
                        <div>
                          <h4 className="font-semibold text-gray-900">Client Champion Award</h4>
                          <p className="text-gray-600 text-sm">Martindale-Hubbell • 2021</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Professional Associations */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <div className="w-2 h-6 bg-indigo-600 rounded"></div>
                      Professional Associations
                    </h3>
                    <div className="space-y-3">
                      <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
                        <h4 className="font-semibold text-gray-900">7th Judicial District Bar Association</h4>
                        <p className="text-gray-600 text-sm">Member • 2017 - Present</p>
                      </div>
                      <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
                        <h4 className="font-semibold text-gray-900">Southwestern Colorado Bar Association</h4>
                        <p className="text-gray-600 text-sm">Member • 2017 - Present</p>
                      </div>
                      <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
                        <h4 className="font-semibold text-gray-900">Heart of the Rockies Bar Association</h4>
                        <p className="text-gray-600 text-sm">Member • 2017 - Present</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Publications & Speaking - Full Width */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Publications */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <div className="w-2 h-6 bg-red-600 rounded"></div>
                      Publications
                    </h3>
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <h4 className="font-semibold text-gray-900">Top 100 Attorneys Magazine</h4>
                      <p className="text-gray-600">Feature Article</p>
                      <p className="text-gray-500 text-sm">2022</p>
                    </div>
                  </div>

                  {/* Speaking Engagements */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <div className="w-2 h-6 bg-teal-600 rounded"></div>
                      Speaking Engagements
                    </h3>
                    <div className="space-y-3">
                      <div className="p-3 bg-teal-50 border border-teal-200 rounded-lg">
                        <h4 className="font-semibold text-gray-900 text-sm">Stepparent Adoption in Colorado</h4>
                        <p className="text-gray-600 text-sm">Legal Resource Day • 2021</p>
                      </div>
                      <div className="p-3 bg-teal-50 border border-teal-200 rounded-lg">
                        <h4 className="font-semibold text-gray-900 text-sm">Getting Custody: Parents and Non-Parents</h4>
                        <p className="text-gray-600 text-sm">Legal Resource Day • 2021</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Client Reviews</h2>
              <div className="space-y-6">
                <div className="border-b border-gray-200 pb-6">
                  <div className="flex items-center mb-2">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="ml-2 text-sm text-gray-600">May 16, 2023</span>
                  </div>
                  <p className="text-gray-700 mb-2">"Chris McLane as my attorney was awesome. So I wanted to take a second and say that Chris was hands down the best of the best. He won my case and got my kids for me!"</p>
                  <p className="text-sm text-gray-500">- anonymous</p>
                </div>
                <div className="border-b border-gray-200 pb-6">
                  <div className="flex items-center mb-2">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="ml-2 text-sm text-gray-600">April 12, 2023</span>
                  </div>
                  <p className="text-gray-700 mb-2">"Chris was my lawyer through my 1.5 year divorce process which was extremely difficult. He was so kind and patient with me and always had my best interest in mind."</p>
                  <p className="text-sm text-gray-500">- anonymous</p>
                </div>
              </div>
            </div>

            {/* Attorney Endorsements */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Attorney Endorsements</h2>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>Received (12)</span>
                  <span>Given (28)</span>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="border-b border-gray-200 pb-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 font-semibold text-sm">MJ</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900">Myles Johnson</h4>
                        <span className="text-sm text-gray-500">Family Attorney</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">Nov 27 • Relationship: Opposing Counsel on matter</p>
                      <p className="text-gray-700 italic">"Chris is a true professional. From my experience with Chris, he gets right to the meat of the issue and focuses on solutions rather than litigating the litigation unnecessarily. I endorse this lawyer."</p>
                    </div>
                  </div>
                </div>
                
                <div className="border-b border-gray-200 pb-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-green-600 font-semibold text-sm">ET</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900">Elizabeth Tharakan</h4>
                        <span className="text-sm text-gray-500">Family Attorney</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">Jul 31 • Relationship: Worked for lawyer</p>
                      <p className="text-gray-700 italic">"Chris hired me at Family Law Center of the Rockies. He was an excellent boss who let me learn my own way and make my own mistakes, while providing gentle guidance on how to win points with the judges. He was patient and easygoing."</p>
                    </div>
                  </div>
                </div>
                
                <div className="border-b border-gray-200 pb-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-purple-600 font-semibold text-sm">RA</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900">Rahul Aggarwal</h4>
                        <span className="text-sm text-gray-500">Attorney</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">Feb 28 • Relationship: Fellow lawyer in community</p>
                      <p className="text-gray-700 italic">"An excellent lawyer who treats clients with patience, care, understanding, and utmost professionalism - an even better person and I wholeheartedly recommend for future services."</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <button className="mt-4 text-blue-600 hover:text-blue-700 font-medium text-sm">
                View more endorsements
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700">{lawyer.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700">{lawyer.email}</span>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                  <span className="text-gray-700">{lawyer.address}</span>
                </div>
              </div>
            </div>

            {/* Rates */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Rates</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Hourly Rate:</span>
                  <span className="font-semibold">{lawyer.hourlyRate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Free Consultation:</span>
                  <span className="font-semibold text-green-600">30 minutes</span>
                </div>
              </div>
            </div>

            {/* Awards */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Awards & Recognition</h3>
              <div className="space-y-2">
                {lawyer.awards.map((award, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-yellow-500" />
                    <span className="text-gray-700">{award}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center gap-3 p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
                  <Calendar className="w-4 h-4" />
                  <span className="font-medium">Schedule Consultation</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors">
                  <MessageCircle className="w-4 h-4" />
                  <span className="font-medium">Send Message</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">
                  <Shield className="w-4 h-4" />
                  <span className="font-medium">Request Quote</span>
                </button>
              </div>
            </div>

            {/* Office Hours */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Office Hours</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Monday - Friday</span>
                  <span className="font-medium">9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Saturday</span>
                  <span className="font-medium">10:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sunday</span>
                  <span className="font-medium text-red-600">Closed</span>
                </div>
              </div>
            </div>

            {/* Case Types */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Case Types Handled</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Divorce Cases</span>
                  <span className="font-medium text-green-600">150+</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Custody Cases</span>
                  <span className="font-medium text-green-600">89+</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Adoptions</span>
                  <span className="font-medium text-green-600">45+</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Child Support</span>
                  <span className="font-medium text-green-600">120+</span>
                </div>
              </div>
            </div>

            {/* Payment Options */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Payment Options</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">Credit Cards Accepted</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">Payment Plans Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">Contingency Fee Options</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">Free Initial Consultation</span>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Won custody case</p>
                    <p className="text-xs text-gray-500">2 days ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Published article</p>
                    <p className="text-xs text-gray-500">1 week ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Speaking engagement</p>
                    <p className="text-xs text-gray-500">2 weeks ago</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Similar Lawyers */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Similar Lawyers</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <img src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face" alt="" className="w-10 h-10 rounded-lg object-cover" />
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm">Sarah Johnson</h4>
                    <p className="text-xs text-gray-600">Family Law • 4.9★</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face" alt="" className="w-10 h-10 rounded-lg object-cover" />
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm">Michael Chen</h4>
                    <p className="text-xs text-gray-600">Family Law • 4.8★</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face" alt="" className="w-10 h-10 rounded-lg object-cover" />
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm">Emily Rodriguez</h4>
                    <p className="text-xs text-gray-600">Family Law • 4.9★</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}