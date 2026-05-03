import { useState } from 'react';
import { motion } from 'motion/react';
import { Play, Pause, Instagram, Youtube, Mail, Sparkles, Zap, TrendingUp, Eye, Heart, MessageCircle, Calendar, Clock, User, CheckCircle, ArrowRight, Star, Moon, Sun } from 'lucide-react';
// @ts-ignore: allow importing image assets
import profileImage from '../imports/image-3.png';
import { Toaster, toast } from 'sonner';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

interface Video {
  id: string;
  title: string;
  creator: string;
  videoUrl: string;
  views?: string;
  platform: 'instagram' | 'youtube';
}

export default function App() {
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [projectDetails, setProjectDetails] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [theme, setTheme] = useState<'white' | 'black'>('white');
  const API_BASE_URL = (((import.meta as any).env?.VITE_API_BASE_URL) || '/api').replace(/\/$/, '');

  const timeSlots = [
    '10:00 AM', '11:00 AM', '12:00 PM', '02:00 PM',
    '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM'
  ];

  const portfolioVideos: Video[] = [
    { id: '1', title: 'Viral Reel Edit', creator: 'Jhansi Way', videoUrl: 'https://www.instagram.com/p/DGbO4NpSWle/embed', views: '18.2M', platform: 'instagram' },
    { id: '2', title: 'High Energy Content', creator: 'Aditya TTP', videoUrl: 'https://www.instagram.com/p/DQo47I2iEOY/embed', views: '15.7M', platform: 'instagram' },
    { id: '3', title: 'Educational Banger', creator: 'Vidhan TTP', videoUrl: 'https://www.instagram.com/p/DQeeeS0CH9-/embed', views: '12.4M', platform: 'instagram' },
    { id: '4', title: 'Story Arc Edit', creator: 'Vidhan TTP', videoUrl: 'https://www.instagram.com/p/DQHTeoLiN5l/embed', views: '9.8M', platform: 'instagram' },
    { id: '5', title: 'Trending Format', creator: 'Sleepy', videoUrl: 'https://www.instagram.com/p/DPE4wb_gAeE/embed', views: '21.3M', platform: 'instagram' },
    { id: '6', title: 'Quick Cut Magic', creator: 'Sleepy', videoUrl: 'https://www.instagram.com/p/DPRtSsTAF2P/embed', views: '14.1M', platform: 'instagram' },
    { id: '7', title: 'Premium Polish', creator: 'Sleepy', videoUrl: 'https://www.instagram.com/p/DQo7l9ggIrt/embed', views: '11.5M', platform: 'instagram' },
    { id: '8', title: 'Long Form Series', creator: 'The Top Percentile', videoUrl: 'https://www.youtube.com/embed/BTBjd2IsPCs', views: '8.9M', platform: 'youtube' },
    { id: '9', title: 'YouTube Deep Dive', creator: 'Ask Life With Anmol', videoUrl: 'https://www.youtube.com/embed/Nrap3wNH7_Y', views: '6.3M', platform: 'youtube' }
  ];

  const handleBookMeeting = async () => {
    console.log('handleBookMeeting invoked', { selectedDate, selectedTime, clientName, clientEmail });
    if (!selectedDate || !selectedTime || !clientName || !clientEmail) {
      toast.error('Please fill in all the fields first 👀');
      return;
    }

    const formattedDate = selectedDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const formattedTimestamp = new Date(selectedDate);
    const timeParts = selectedTime.match(/^(\d{2}):(\d{2})\s(AM|PM)$/);
    if (timeParts) {
      let hours = Number(timeParts[1]);
      const minutes = Number(timeParts[2]);
      const period = timeParts[3];
      if (period === 'PM' && hours !== 12) hours += 12;
      if (period === 'AM' && hours === 12) hours = 0;
      formattedTimestamp.setHours(hours, minutes, 0, 0);
    }

    const bookingText = [
      `Meeting date: ${formattedDate}`,
      `Meeting time: ${selectedTime}`,
      projectDetails || 'We can discuss the details on the call'
    ].join('\n\n');

    try {
      const createResp = await fetch(`${API_BASE_URL}/clients`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: clientName,
          email: clientEmail,
          timestamp: formattedTimestamp.toISOString(),
          text: bookingText
        })
      });

      if (!createResp.ok) {
        const data = await createResp.json().catch(() => null);
        const message = data?.detail || 'Something went wrong while saving the booking.';
        const duplicateDetected = createResp.status === 409 || /already exists|duplicate/i.test(message);

        if (!duplicateDetected) {
          throw new Error(message);
        }

        toast('This client already exists. Booking was already saved in the backend.');
      } else {
        await createResp.json().catch(() => null);
      }

      toast.success('Booking saved in the backend');
      setBookingSuccess(true);
      setTimeout(() => {
        setBookingSuccess(false);
        setSelectedDate(undefined);
        setSelectedTime('');
        setClientName('');
        setClientEmail('');
        setProjectDetails('');
      }, 3000);
    } catch (error: any) {
      console.error('Failed to save booking:', error);
      const message = error?.name === 'TypeError' && error?.message === 'Failed to fetch'
        ? 'Network request failed. If this is a browser CORS error, the backend must allow your frontend origin.'
        : (error?.message || 'Oops! Something went wrong. Please try again or email me directly at nikhmdia@gmail.com');
      toast.error(message);
    }
  };

  return (
        <div className={`min-h-screen overflow-x-hidden overflow-y-auto relative transition-colors duration-500 ${
          theme === 'white' ? 'bg-amber-50 text-zinc-900' : 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white'
        }`}>
        {/* Theme Toggle Button */}
        <motion.button
          onClick={() => setTheme(theme === 'white' ? 'black' : 'white')}
          whileHover={{ scale: 1.1, rotate: 15 }}
          whileTap={{ scale: 0.9 }}
          className={`fixed top-4 right-4 sm:top-6 sm:right-6 z-50 w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center shadow-2xl transition-all ${
            theme === 'white'
              ? 'bg-gradient-to-br from-zinc-900 to-zinc-700 text-white'
              : 'bg-gradient-to-br from-amber-200 to-yellow-300 text-zinc-900'
          }`}
          style={{
            clipPath: 'polygon(10% 0%, 90% 0%, 100% 10%, 100% 90%, 90% 100%, 10% 100%, 0% 90%, 0% 10%)',
            transform: 'rotate(-3deg)'
          }}
        >
          {theme === 'white' ? (
            <Moon className="w-6 h-6 sm:w-8 sm:h-8" />
          ) : (
            <Sun className="w-6 h-6 sm:w-8 sm:h-8" />
          )}
        </motion.button>

      {/* Paper texture overlay */}
      <div className="fixed inset-0 opacity-40 pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMSIvPjwvc3ZnPg==')]"></div>

      {/* Tape pieces scattered */}
      <div className="fixed top-12 left-20 w-32 h-8 bg-yellow-200/40 -rotate-12 pointer-events-none" style={{ boxShadow: 'inset 0 0 20px rgba(0,0,0,0.1)' }}></div>
      <div className="fixed top-40 right-32 w-24 h-8 bg-yellow-200/40 rotate-6 pointer-events-none" style={{ boxShadow: 'inset 0 0 20px rgba(0,0,0,0.1)' }}></div>
      <div className="fixed bottom-32 left-40 w-28 h-8 bg-yellow-200/40 rotate-12 pointer-events-none" style={{ boxShadow: 'inset 0 0 20px rgba(0,0,0,0.1)' }}></div>

      {/* Hand-drawn scribbles floating around */}
      <svg className="fixed top-20 right-20 opacity-20 pointer-events-none" width="100" height="100">
        <path d="M20,50 Q30,20 50,30 T80,40 Q85,60 70,70 T40,80 Q15,75 20,50 Z" fill="none" stroke="#f97316" strokeWidth="3" />
      </svg>
      <svg className="fixed bottom-40 left-20 opacity-20 pointer-events-none" width="80" height="80">
        <path d="M10,10 L70,70 M70,10 L10,70 M40,10 L40,70 M10,40 L70,40" stroke="#ec4899" strokeWidth="2" />
      </svg>

      {/* Hero Section - Collage Style */}
      <section className="relative min-h-screen flex items-center px-4 sm:px-6 py-12 sm:py-20">
        <div className="max-w-7xl mx-auto w-full relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Left side */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Hand-torn paper badge */}
              <div className="inline-block mb-8 relative">
                <div className="px-6 py-3 bg-white relative" style={{
                  clipPath: 'polygon(2% 8%, 8% 2%, 18% 5%, 28% 1%, 38% 3%, 48% 0%, 58% 2%, 68% 1%, 78% 4%, 88% 2%, 95% 6%, 98% 15%, 99% 25%, 97% 35%, 99% 45%, 98% 55%, 96% 65%, 98% 75%, 96% 85%, 93% 92%, 85% 96%, 75% 98%, 65% 97%, 55% 99%, 45% 98%, 35% 96%, 25% 98%, 15% 96%, 8% 93%, 3% 85%, 1% 75%, 2% 65%, 0% 55%, 1% 45%, 3% 35%, 1% 25%, 3% 15%)',
                  boxShadow: '3px 3px 8px rgba(0,0,0,0.15)',
                  transform: 'rotate(-2deg)'
                }}>
                  <span className="text-sm font-bold text-purple-700" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
                    ✨ VIDEO EDITOR & CREATIVE ✨
                  </span>
                </div>
                {/* Hand-drawn arrow pointing to badge */}
                <svg className="absolute -right-16 top-0" width="60" height="60">
                  <path d="M5,30 Q20,15 40,25" stroke="#f97316" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                  <path d="M40,25 L35,20 M40,25 L35,30" stroke="#f97316" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                  <text x="45" y="50" className="text-xs fill-orange-600" style={{ fontFamily: 'Comic Sans MS, cursive' }}>that's me!</text>
                </svg>
              </div>

              {/* Main title with highlighter effect */}
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl mb-6 leading-none">
                <span className={`block text-xl sm:text-2xl md:text-3xl mb-3 ${theme === 'white' ? 'text-zinc-500' : 'text-purple-300'}`} style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
                  hey there, i'm
                </span>
                <span className="block font-black relative inline-block">
                  <span className="relative z-10">NIKHIL</span>
                  {/* Highlighter mark */}
                  <div className="absolute inset-0 bg-yellow-300 -skew-x-12 -z-0 opacity-60" style={{ top: '20%', height: '60%' }}></div>
                  {/* Hand-drawn circle */}
                  <svg className="absolute -inset-6 w-full h-full pointer-events-none" viewBox="0 0 200 100">
                    <ellipse cx="100" cy="50" rx="90" ry="42" stroke="#f97316" strokeWidth="3" fill="none" strokeDasharray="3,5" opacity="0.4" transform="rotate(-5 100 50)"/>
                  </svg>
                </span>
              </h1>

              {/* Text with marker underlines */}
              <div className="space-y-5 mb-8 sm:mb-12">
                <p className="text-xl sm:text-2xl md:text-3xl relative inline-block" style={{ fontFamily: 'Georgia, serif' }}>
                  i turn footage into{' '}
                  <span className="font-black relative inline-block text-orange-600">
                    scroll-stoppers
                    {/* Multiple messy underlines */}
                    <svg className="absolute -bottom-2 left-0 w-full" height="16" viewBox="0 0 200 16">
                      <path d="M5,8 Q50,4 100,9 T195,7" stroke="#f97316" strokeWidth="3" fill="none" strokeLinecap="round"/>
                      <path d="M5,12 Q50,8 100,13 T195,11" stroke="#f97316" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.7"/>
                      <path d="M5,6 Q50,10 100,5 T195,9" stroke="#f97316" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.5"/>
                    </svg>
                  </span>
                </p>

                <div className="relative inline-block">
                  <p className={`text-base sm:text-lg leading-relaxed max-w-lg ${theme === 'white' ? 'text-zinc-700' : 'text-purple-100'}`}>
                    premiere pro wizard • after effects nerd • helped creators rack up{' '}
                    <span className={`font-bold relative ${theme === 'white' ? 'text-pink-600' : 'text-pink-400'}`}>
                      350M+ views
                      {/* Highlight mark */}
                      <div className={`absolute inset-0 opacity-50 -z-10 ${theme === 'white' ? 'bg-pink-200' : 'bg-pink-500'}`} style={{ transform: 'skewX(-10deg)' }}></div>
                    </span>
                    {' '}across instagram & youtube
                  </p>
                  {/* Doodle star */}
                  <div className="absolute -right-8 -top-4 text-3xl animate-spin" style={{ animationDuration: '10s' }}>⭐</div>
                </div>
              </div>

              {/* Post-it note style buttons */}
              <div className="flex flex-wrap gap-5">
                <a
                  href="#work"
                  className="group relative px-8 py-4 bg-gradient-to-br from-yellow-200 to-yellow-300 font-black text-zinc-900 shadow-lg hover:shadow-xl transition-all transform hover:-rotate-2 hover:scale-105"
                  style={{
                    clipPath: 'polygon(0% 5%, 5% 0%, 95% 0%, 100% 5%, 100% 95%, 95% 100%, 5% 100%, 0% 95%)',
                  }}
                >
                  <span className="flex items-center gap-2">
                    👀 Watch My Work
                  </span>
                  {/* Pencil sketch lines */}
                  <div className="absolute inset-0 opacity-20 pointer-events-none">
                    <svg width="100%" height="100%">
                      <line x1="10%" y1="20%" x2="90%" y2="20%" stroke="#000" strokeWidth="0.5"/>
                      <line x1="10%" y1="40%" x2="90%" y2="40%" stroke="#000" strokeWidth="0.5"/>
                      <line x1="10%" y1="60%" x2="90%" y2="60%" stroke="#000" strokeWidth="0.5"/>
                    </svg>
                  </div>
                </a>

                <a
                  href="#booking"
                  className="px-8 py-4 bg-gradient-to-br from-blue-200 to-blue-300 font-black text-zinc-900 shadow-lg hover:shadow-xl transition-all transform hover:rotate-2 hover:scale-105"
                  style={{
                    clipPath: 'polygon(0% 5%, 5% 0%, 95% 0%, 100% 5%, 100% 95%, 95% 100%, 5% 100%, 0% 95%)',
                  }}
                >
                  📞 Book a Call
                </a>
              </div>

              {/* Stats with stamp effects */}
              <div className="grid grid-cols-3 gap-3 sm:gap-6 mt-8 sm:mt-16 pt-6 sm:pt-8 border-t-4 border-dashed border-zinc-400">
                {[
                  { icon: '🔥', value: '350M+', label: 'Total Views', color: 'from-red-400 to-orange-400' },
                  { icon: '📈', value: '500K+', label: 'Followers', color: 'from-pink-400 to-purple-400' },
                  { icon: '⚡', value: '200+', label: 'Videos', color: 'from-blue-400 to-cyan-400' }
                ].map((stat, i) => (
                  <div key={i} className="relative transform hover:scale-110 transition-transform" style={{ transform: `rotate(${i % 2 === 0 ? '-3deg' : '3deg'})` }}>
                    {/* Stamp effect */}
                    <div className={`p-2 sm:p-4 bg-gradient-to-br ${stat.color} opacity-80 relative`}
                      style={{
                        clipPath: 'polygon(10% 0%, 90% 0%, 100% 10%, 100% 90%, 90% 100%, 10% 100%, 0% 90%, 0% 10%)',
                        boxShadow: '2px 2px 4px rgba(0,0,0,0.2)'
                      }}>
                      <div className="text-xl sm:text-2xl md:text-3xl mb-1 text-center">{stat.icon}</div>
                      <div className="text-lg sm:text-xl md:text-2xl font-black text-white text-center">{stat.value}</div>
                      <div className="text-[10px] sm:text-xs text-white/90 uppercase text-center font-bold">{stat.label}</div>
                      {/* Stamp texture */}
                      <div className="absolute inset-0 opacity-20">
                        <svg width="100%" height="100%">
                          <circle cx="50%" cy="50%" r="40%" stroke="white" strokeWidth="1" fill="none" strokeDasharray="2,2"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right side - Polaroid style photo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative max-w-md mx-auto transform hover:rotate-2 transition-transform" style={{ transform: 'rotate(-3deg)' }}>
                {/* Polaroid frame */}
                <div className="bg-white p-4 pb-16 shadow-2xl relative">
                  {/* Photo */}
                  <div className="aspect-[3/4] overflow-hidden bg-zinc-200 relative">
                    <img
                      src={profileImage}
                      alt="Nikhil"
                      className="w-full h-full object-cover"
                    />

                    {/* Film grain overlay */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9IjAuOSIgbnVtT2N0YXZlcz0iNCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWx0ZXI9InVybCgjYSkiIG9wYWNpdHk9IjAuNSIvPjwvc3ZnPg==')]"></div>
                  </div>

                  {/* Handwritten caption */}
                  <div className="absolute bottom-4 left-4 right-4 text-center">
                    <p className="text-lg text-zinc-700" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
                      making magic happen ✨
                    </p>
                  </div>

                  {/* Tape pieces on polaroid */}
                  <div className="absolute -top-2 left-12 w-16 h-6 bg-yellow-200/60 -rotate-6" style={{ boxShadow: 'inset 0 0 10px rgba(0,0,0,0.1)' }}></div>
                  <div className="absolute -top-2 right-12 w-16 h-6 bg-yellow-200/60 rotate-6" style={{ boxShadow: 'inset 0 0 10px rgba(0,0,0,0.1)' }}></div>
                </div>

                {/* Stickers scattered around polaroid */}
                <div className="absolute -top-8 -left-8 bg-yellow-400 text-black px-4 py-2 font-black transform -rotate-12 shadow-lg" style={{ clipPath: 'polygon(10% 0%, 90% 0%, 100% 10%, 100% 90%, 90% 100%, 10% 100%, 0% 90%, 0% 10%)' }}>
                  3+ YEARS
                </div>
                <div className="absolute -top-6 -right-6 bg-pink-500 text-white px-4 py-2 font-black transform rotate-12 shadow-lg" style={{ clipPath: 'polygon(10% 0%, 90% 0%, 100% 10%, 100% 90%, 90% 100%, 10% 100%, 0% 90%, 0% 10%)' }}>
                  350M+
                </div>
                <div className="absolute -bottom-6 -right-8 bg-purple-500 text-white px-4 py-2 font-black transform -rotate-6 shadow-lg" style={{ clipPath: 'polygon(10% 0%, 90% 0%, 100% 10%, 100% 90%, 90% 100%, 10% 100%, 0% 90%, 0% 10%)' }}>
                  VIEWS
                </div>

                {/* Hand-drawn doodles around */}
                <svg className="absolute -bottom-16 -left-12" width="100" height="100">
                  <path d="M20,20 Q40,10 60,25 T90,40" stroke="#f97316" strokeWidth="3" fill="none" strokeLinecap="round"/>
                  <circle cx="85" cy="38" r="5" fill="#f97316"/>
                </svg>

                <svg className="absolute -top-12 right-0" width="80" height="80">
                  <path d="M10,40 L30,20 L50,35 L70,15" stroke="#ec4899" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                  <circle cx="70" cy="15" r="4" fill="none" stroke="#ec4899" strokeWidth="2"/>
                </svg>

                {/* Floating emojis */}
                <div className="absolute -top-12 left-12 text-4xl animate-bounce" style={{ animationDuration: '3s' }}>💫</div>
                <div className="absolute -bottom-8 right-16 text-3xl animate-bounce" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }}>🎬</div>
                <div className="absolute top-1/2 -right-12 text-3xl animate-bounce" style={{ animationDuration: '2.8s', animationDelay: '1s' }}>✂️</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Portfolio Section - Sketchbook Style */}
      <section id="work" className={`relative px-4 sm:px-6 py-12 sm:py-24 transition-colors duration-500 ${
        theme === 'white' ? 'bg-white' : 'bg-gradient-to-br from-slate-800 to-slate-900'
      }`}>
        {/* Torn paper edge at top */}
        <div className={`absolute top-0 left-0 right-0 h-8 transition-colors duration-500 ${
          theme === 'white' ? 'bg-amber-50' : 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900'
        }`} style={{
          clipPath: 'polygon(0 0, 2% 100%, 4% 60%, 6% 100%, 8% 40%, 10% 100%, 12% 70%, 14% 100%, 16% 50%, 18% 100%, 20% 80%, 22% 100%, 24% 60%, 26% 100%, 28% 40%, 30% 100%, 32% 70%, 34% 100%, 36% 50%, 38% 100%, 40% 80%, 42% 100%, 44% 60%, 46% 100%, 48% 40%, 50% 100%, 52% 70%, 54% 100%, 56% 50%, 58% 100%, 60% 80%, 62% 100%, 64% 60%, 66% 100%, 68% 40%, 70% 100%, 72% 70%, 74% 100%, 76% 50%, 78% 100%, 80% 80%, 82% 100%, 84% 60%, 86% 100%, 88% 40%, 90% 100%, 92% 70%, 94% 100%, 96% 50%, 98% 100%, 100% 0)'
        }}></div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Section header - Notebook style */}
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative inline-block mb-8"
            >
              {/* Title with highlighter */}
              <h2 className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-4 relative inline-block ${theme === 'white' ? 'text-zinc-900' : 'text-purple-100'}`}>
                <span className="relative z-10">VIRAL EDITS</span>
                {/* Yellow highlighter */}
                <div className={`absolute inset-0 opacity-40 -z-10 -skew-x-6 ${theme === 'white' ? 'bg-yellow-300' : 'bg-yellow-500'}`} style={{ top: '25%', height: '50%' }}></div>
              </h2>

              {/* Hand-drawn box around title */}
              <svg className="absolute -inset-8 w-full h-full pointer-events-none" viewBox="0 0 300 100">
                <rect x="10" y="10" width="280" height="80" stroke={theme === 'white' ? '#f97316' : '#fb923c'} strokeWidth="3" fill="none" strokeDasharray="8,4" rx="5"/>
                <rect x="15" y="15" width="270" height="70" stroke={theme === 'white' ? '#ec4899' : '#f472b6'} strokeWidth="2" fill="none" strokeDasharray="5,3" rx="5" opacity="0.5"/>
              </svg>
            </motion.div>

            <p className={`text-xl mb-2 ${theme === 'white' ? 'text-zinc-700' : 'text-purple-200'}`}>reels & videos that actually performed 📊</p>

            {/* Hand-drawn arrow */}
            <svg className="mx-auto" width="100" height="60">
              <path d="M50,10 Q55,35 50,50 M50,50 L45,43 M50,50 L55,43" stroke="#f97316" strokeWidth="3" fill="none" strokeLinecap="round"/>
            </svg>
          </div>

          {/* Video grid - Scrapbook style */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {portfolioVideos.map((video, index) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                onClick={() => {
                  setCurrentVideo(video);
                  setShowVideoModal(true);
                }}
                className="group relative cursor-pointer transform hover:scale-105 transition-all"
                style={{ transform: `rotate(${index % 3 === 0 ? '-2deg' : index % 3 === 1 ? '2deg' : '-1deg'})` }}
              >
                {/* Tape piece on top */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-20 h-6 bg-yellow-200/70 -rotate-3 z-20" style={{ boxShadow: 'inset 0 0 10px rgba(0,0,0,0.1)' }}></div>

                {/* Card with torn edges */}
                <div className={`p-3 shadow-xl relative ${theme === 'white' ? 'bg-white' : 'bg-slate-800 border-2 border-purple-500/30'}`}
                  style={{
                    clipPath: 'polygon(0% 2%, 2% 0%, 8% 1%, 12% 0%, 18% 1%, 22% 0%, 28% 2%, 32% 0%, 38% 1%, 42% 0%, 48% 1%, 52% 0%, 58% 2%, 62% 0%, 68% 1%, 72% 0%, 78% 1%, 82% 0%, 88% 2%, 92% 0%, 98% 1%, 100% 2%, 100% 98%, 98% 100%, 92% 99%, 88% 100%, 82% 99%, 78% 100%, 72% 98%, 68% 100%, 62% 99%, 58% 100%, 52% 99%, 48% 100%, 42% 98%, 38% 100%, 32% 99%, 28% 100%, 22% 99%, 18% 100%, 12% 98%, 8% 100%, 2% 99%, 0% 98%)'
                  }}>

                  {/* Platform badge - sticker style */}
                  <div className="absolute top-5 right-5 z-10">
                    <div className={`w-12 h-12 flex items-center justify-center transform -rotate-12 shadow-lg ${
                      video.platform === 'instagram'
                        ? 'bg-gradient-to-br from-purple-500 to-pink-500'
                        : 'bg-red-600'
                    }`} style={{ clipPath: 'polygon(10% 0%, 90% 0%, 100% 10%, 100% 90%, 90% 100%, 10% 100%, 0% 90%, 0% 10%)' }}>
                      {video.platform === 'instagram' ? (
                        <Instagram className="w-6 h-6 text-white" />
                      ) : (
                        <Youtube className="w-6 h-6 text-white" />
                      )}
                    </div>
                  </div>


                  {/* Video thumbnail area - ARTISTIC VERSION */}
                  <div className="aspect-[9/16] overflow-hidden relative">
                    {/* Multiple artistic frame layers */}

                    {/* Layer 1: Film strip effect (alternating styles) */}
                    {index % 3 === 0 && (
                      <div className="absolute inset-0 bg-white">
                        {/* Film perforations on sides */}
                        <div className="absolute left-0 top-0 bottom-0 w-3 flex flex-col justify-around bg-zinc-800">
                          {[...Array(12)].map((_, i) => (
                            <div key={i} className="w-2 h-2 bg-white mx-auto" style={{ clipPath: 'polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)' }}></div>
                          ))}
                        </div>
                        <div className="absolute right-0 top-0 bottom-0 w-3 flex flex-col justify-around bg-zinc-800">
                          {[...Array(12)].map((_, i) => (
                            <div key={i} className="w-2 h-2 bg-white mx-auto" style={{ clipPath: 'polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)' }}></div>
                          ))}
                        </div>
                        {/* Film content area */}
                        <div className="absolute inset-y-0 left-3 right-3 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
                          {/* Film grain */}
                          <div className="absolute inset-0 opacity-30 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9IjAuOSIgbnVtT2N0YXZlcz0iNCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWx0ZXI9InVybCgjYSkiIG9wYWNpdHk9IjAuNSIvPjwvc3ZnPg==')]"></div>
                          {/* Color tint */}
                          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 via-pink-500/20 to-purple-500/20"></div>
                        </div>
                      </div>
                    )}

                    {/* Layer 2: Instant camera/Polaroid style */}
                    {index % 3 === 1 && (
                      <div className="absolute inset-0 bg-yellow-50">
                        {/* Polaroid border */}
                        <div className="absolute inset-2 bg-white shadow-inner">
                          {/* Photo area */}
                          <div className="absolute top-2 left-2 right-2 bottom-16 bg-gradient-to-br from-zinc-900 to-zinc-800">
                            {/* Vintage photo effect */}
                            <div className="absolute inset-0 bg-gradient-to-br from-orange-400/20 via-transparent to-blue-500/10"></div>
                            {/* Faded corners */}
                            <div className="absolute inset-0" style={{
                              background: 'radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.3) 100%)'
                            }}></div>
                          </div>
                          {/* Caption area */}
                          <div className="absolute bottom-2 left-2 right-2 h-12 flex items-center justify-center">
                            <p className="text-xs text-zinc-600" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
                              {video.title} ✨
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Layer 3: Hand-drawn sketch frame */}
                    {index % 3 === 2 && (
                      <div className="absolute inset-0 bg-white">
                        {/* Sketchy border */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
                          {/* Multiple hand-drawn rectangles */}
                          <rect x="8" y="8" width="calc(100% - 16)" height="calc(100% - 16)"
                            stroke="#f97316" strokeWidth="3" fill="none" strokeDasharray="5,3" />
                          <rect x="12" y="12" width="calc(100% - 24)" height="calc(100% - 24)"
                            stroke="#ec4899" strokeWidth="2" fill="none" strokeDasharray="3,4" opacity="0.6"/>
                          <rect x="6" y="6" width="calc(100% - 12)" height="calc(100% - 12)"
                            stroke="#8b5cf6" strokeWidth="2" fill="none" strokeDasharray="4,2" opacity="0.4"/>
                        </svg>
                        {/* Content area with paint texture */}
                        <div className="absolute inset-5 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
                          {/* Paint brush strokes effect */}
                          <div className="absolute inset-0 opacity-20">
                            <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-orange-500 to-transparent transform -skew-y-3"></div>
                            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-purple-500 to-transparent transform skew-y-2"></div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Washi tape corners (varying positions) */}
                    <div className="absolute -top-1 left-8 w-12 h-4 bg-pink-300/60 -rotate-45 z-10" style={{ boxShadow: 'inset 0 0 5px rgba(0,0,0,0.1)' }}></div>
                    <div className="absolute -top-1 right-8 w-12 h-4 bg-blue-300/60 rotate-45 z-10" style={{ boxShadow: 'inset 0 0 5px rgba(0,0,0,0.1)' }}></div>

                    {/* Paint splatter overlay */}
                    <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-yellow-400/40 blur-sm"></div>
                    <div className="absolute bottom-8 left-4 w-6 h-6 rounded-full bg-pink-400/40 blur-sm"></div>
                    <div className="absolute top-1/2 left-6 w-4 h-4 rounded-full bg-cyan-400/40 blur-sm"></div>

                    {/* Handwritten frame number */}
                    <div className="absolute bottom-2 right-2 text-xs text-white/50 font-black" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
                      #{index + 1}
                    </div>

                    {/* Play button with artistic overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 backdrop-blur-sm z-20">
                      <div className="relative">
                        {/* Hand-drawn play symbol */}
                        <svg className="absolute -inset-12" width="140" height="140">
                          {/* Sketchy circles around */}
                          <circle cx="70" cy="70" r="50" stroke="#fff" strokeWidth="3" fill="none" strokeDasharray="3,4" opacity="0.8"/>
                          <circle cx="70" cy="70" r="55" stroke="#fff" strokeWidth="2" fill="none" strokeDasharray="4,3" opacity="0.5"/>
                          <circle cx="70" cy="70" r="45" stroke="#fff" strokeWidth="2.5" fill="none" strokeDasharray="2,3" opacity="0.6"/>
                          {/* Scribble spiral */}
                          <path d="M70,20 Q85,35 85,50 Q85,65 70,70 Q55,75 45,60 Q35,45 45,30"
                            stroke="#fbbf24" strokeWidth="2" fill="none" opacity="0.4"/>
                        </svg>

                        {/* Play button with stamp effect */}
                        <div className="w-24 h-24 bg-white flex items-center justify-center transform group-hover:scale-110 transition-transform relative"
                          style={{ clipPath: 'polygon(15% 5%, 85% 5%, 95% 15%, 95% 85%, 85% 95%, 15% 95%, 5% 85%, 5% 15%)' }}>
                          <Play className="w-10 h-10 text-black ml-1" fill="black" />
                          {/* Stamp texture */}
                          <div className="absolute inset-0 opacity-10">
                            <svg width="100%" height="100%">
                              <circle cx="50%" cy="50%" r="35%" stroke="black" strokeWidth="1" fill="none" strokeDasharray="1,1"/>
                            </svg>
                          </div>
                        </div>

                        {/* "PLAY" text doodle */}
                        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-white font-black text-sm"
                          style={{ fontFamily: 'Comic Sans MS, cursive' }}>
                          WATCH →
                        </div>
                      </div>
                    </div>

                    {/* Bottom info with artistic treatment */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/95 to-transparent z-10">
                      {/* Creator name with highlight */}
                      <div className="relative inline-block mb-1">
                        <div className="text-xs text-white mb-1" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
                          {video.creator}
                        </div>
                        {/* Mini highlighter mark */}
                        <div className="absolute inset-0 bg-yellow-400/20 -skew-x-12 -z-10"></div>
                      </div>

                      {/* Title with underline doodle */}
                      <h3 className="font-bold text-lg text-white mb-2 relative inline-block">
                        {video.title}
                        {/* Scribble underline */}
                        <svg className="absolute -bottom-1 left-0 w-full" height="4" viewBox="0 0 100 4">
                          <path d="M0,2 Q25,1 50,2.5 T100,2" stroke="rgba(251,146,60,0.6)" strokeWidth="1.5" fill="none"/>
                        </svg>
                      </h3>

                      {/* Engagement with hand-drawn icons */}
                      <div className="flex items-center gap-4 text-xs text-gray-400">
                        <div className="flex items-center gap-1">
                          <span className="text-base">❤️</span>
                          <span>{(parseInt(video.views || '0') * 0.05).toFixed(1)}M</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-base">💬</span>
                          <span>{(parseInt(video.views || '0') * 0.01).toFixed(0)}K</span>
                        </div>
                      </div>
                    </div>

                    {/* Random artistic elements per video */}
                    {index === 0 && (
                      <div className="absolute top-3 left-3 text-2xl opacity-80">🌟</div>
                    )}
                    {index === 1 && (
                      <div className="absolute bottom-20 right-3 text-xl opacity-80">✨</div>
                    )}
                    {index === 2 && (
                      <div className="absolute top-1/3 right-3 text-xl opacity-80">🔥</div>
                    )}
                    {index === 4 && (
                      <div className="absolute top-1/4 left-3 text-2xl opacity-80">⚡</div>
                    )}
                  </div>

                  {/* Hand-written note at bottom - with artistic elements */}
                  <div className="mt-3 text-center relative">
                    {/* Speech bubble style */}
                    <div className="inline-block px-4 py-2 bg-yellow-100 relative transform -rotate-1"
                      style={{ clipPath: 'polygon(5% 0%, 95% 0%, 100% 5%, 100% 85%, 90% 95%, 85% 100%, 75% 95%, 70% 100%, 65% 95%, 60% 100%, 55% 95%, 50% 100%, 15% 100%, 5% 95%, 0% 85%, 0% 5%)' }}>
                      <p className="text-sm text-zinc-700 font-bold" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
                        {index % 3 === 0 ? '🔥 THIS WAS FIRE!' : index % 3 === 1 ? '✨ LOVED THIS ONE!' : '🚀 TOTAL BANGER!'}
                      </p>
                      {/* Hand-drawn underline */}
                      <svg className="absolute bottom-1 left-4 right-4" height="3">
                        <path d="M0,1 Q50,2 100,1" stroke="#f97316" strokeWidth="1.5" fill="none" strokeLinecap="round" vectorEffect="non-scaling-stroke"/>
                      </svg>
                    </div>

                    {/* Random doodle stars */}
                    {index % 2 === 0 && (
                      <div className="absolute -right-4 -top-2 text-yellow-500 text-lg">★</div>
                    )}
                  </div>
                </div>

                {/* Random doodles and decorations around cards */}
                {index % 3 === 0 && (
                  <>
                    <svg className="absolute -bottom-8 -right-8" width="60" height="60">
                      <path d="M10,30 Q20,15 40,25 L50,40" stroke="#f97316" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                      <circle cx="48" cy="38" r="4" fill="#f97316"/>
                    </svg>
                    {/* Paper clip doodle */}
                    <svg className="absolute -top-6 -right-4" width="40" height="60">
                      <path d="M15,10 Q10,10 10,15 L10,45 Q10,50 15,50 Q20,50 20,45 L20,20"
                        stroke="#64748b" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                    </svg>
                  </>
                )}
                {index % 3 === 1 && (
                  <>
                    {/* Squiggle decoration */}
                    <svg className="absolute -top-6 -left-6" width="50" height="50">
                      <path d="M10,25 Q15,15 25,20 T40,25" stroke="#ec4899" strokeWidth="2" fill="none" strokeLinecap="round"/>
                    </svg>
                    {/* Small sticky note corner */}
                    <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-yellow-300 transform rotate-45 shadow-md opacity-80"></div>
                  </>
                )}
                {index % 3 === 2 && (
                  <>
                    {/* Star burst doodle */}
                    <svg className="absolute -bottom-6 -left-6" width="50" height="50">
                      <path d="M25,5 L28,20 L40,20 L30,28 L35,42 L25,33 L15,42 L20,28 L10,20 L22,20 Z"
                        stroke="#f59e0b" strokeWidth="2" fill="none" strokeDasharray="2,2"/>
                    </svg>
                    {/* Doodle arrow */}
                    <svg className="absolute -top-8 right-0" width="60" height="40">
                      <path d="M10,30 Q30,15 50,25 M50,25 L45,20 M50,25 L45,30"
                        stroke="#8b5cf6" strokeWidth="2" fill="none" strokeLinecap="round"/>
                    </svg>
                  </>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Section - Notebook Page Style */}
      <section id="booking" className={`relative px-4 sm:px-6 py-12 sm:py-24 transition-colors duration-500 ${
        theme === 'white' ? 'bg-gradient-to-br from-blue-50 to-purple-50' : 'bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-900'
      }`}>
        {/* Notebook lines in background */}
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
          backgroundImage: 'repeating-linear-gradient(transparent, transparent 35px, #94a3b8 35px, #94a3b8 36px)',
        }}></div>

        {/* Red margin line */}
        <div className="absolute left-24 top-0 bottom-0 w-1 bg-red-400 opacity-30"></div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            {/* Title with doodles */}
            <div className="relative inline-block mb-6">
              <h2 className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black relative ${theme === 'white' ? 'text-zinc-900' : 'text-purple-100'}`}>
                <span className="relative z-10">BOOK A CALL</span>
                {/* Highlighter marks */}
                <div className={`absolute inset-0 opacity-40 -skew-x-6 -z-10 ${theme === 'white' ? 'bg-cyan-300' : 'bg-cyan-500'}`} style={{ top: '30%', height: '40%' }}></div>
              </h2>

              {/* Hand-drawn stars around */}
              <div className="absolute -top-6 -left-6 text-4xl">⭐</div>
              <div className="absolute -top-4 -right-8 text-3xl">✨</div>
            </div>

            <p className={`text-lg sm:text-xl md:text-2xl mb-4 ${theme === 'white' ? 'text-zinc-700' : 'text-purple-200'}`} style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
              let's chat about your project over google meet ☕
            </p>

            {/* Hand-drawn underline */}
            <svg className="mx-auto" width="300" height="20">
              <path d="M10,10 Q80,5 150,12 T290,8" stroke={theme === 'white' ? '#f97316' : '#fb923c'} strokeWidth="3" fill="none" strokeLinecap="round"/>
            </svg>
          </div>

          {bookingSuccess ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              className={`max-w-md mx-auto text-center p-12 shadow-2xl transform rotate-2 ${
                theme === 'white' ? 'bg-white' : 'bg-slate-800 border-4 border-green-500'
              }`}
              style={{
                clipPath: 'polygon(2% 0%, 98% 0%, 100% 2%, 100% 98%, 98% 100%, 2% 100%, 0% 98%, 0% 2%)'
              }}
            >
              <div className="text-6xl mb-6">🎉</div>
              <h3 className={`text-4xl font-black mb-4 ${theme === 'white' ? 'text-green-600' : 'text-green-400'}`} style={{ fontFamily: 'Comic Sans MS, cursive' }}>
                YAY! GOT IT!
              </h3>
              <p className={`text-lg ${theme === 'white' ? 'text-zinc-700' : 'text-purple-100'}`}>
                i'll send you the google meet link asap.<br/>check your email! 📧
              </p>
              {/* Confetti doodles */}
              <div className="absolute -top-4 -left-4 text-3xl">🎊</div>
              <div className="absolute -top-6 -right-6 text-3xl">🎈</div>
              <div className="absolute -bottom-4 left-8 text-2xl">✨</div>
            </motion.div>
          ) : (
            <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
              {/* Calendar - Paper card style */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className={`p-8 shadow-2xl transform hover:rotate-1 transition-transform ${
                  theme === 'white' ? 'bg-white' : 'bg-slate-800 border-2 border-indigo-500/40'
                }`}
                style={{
                  clipPath: 'polygon(1% 0%, 99% 0%, 100% 1%, 100% 99%, 99% 100%, 1% 100%, 0% 99%, 0% 1%)'
                }}
              >
                {/* Tape at top */}
                <div className="absolute -top-3 left-12 w-24 h-6 bg-yellow-200/70 -rotate-6" style={{ boxShadow: 'inset 0 0 10px rgba(0,0,0,0.1)' }}></div>
                <div className="absolute -top-3 right-12 w-24 h-6 bg-yellow-200/70 rotate-6" style={{ boxShadow: 'inset 0 0 10px rgba(0,0,0,0.1)' }}></div>

                <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                  <div className="text-2xl sm:text-3xl md:text-4xl">📆</div>
                  <h3 className={`text-xl sm:text-2xl md:text-3xl font-black ${theme === 'white' ? 'text-zinc-900' : 'text-purple-100'}`} style={{ fontFamily: 'Comic Sans MS, cursive' }}>pick a date!</h3>
                </div>

                <div className="calendar-wrapper">
                  <style>{`
                    .calendar-wrapper .rdp {
                      --rdp-cell-size: 45px;
                      --rdp-accent-color: ${theme === 'white' ? '#3b82f6' : '#a78bfa'};
                      --rdp-background-color: ${theme === 'white' ? '#dbeafe' : '#6366f1'};
                      margin: 0;
                    }
                    .calendar-wrapper .rdp-months {
                      justify-content: center;
                    }
                    .calendar-wrapper .rdp-month {
                      color: ${theme === 'white' ? '#18181b' : '#e9d5ff'};
                    }
                    .calendar-wrapper .rdp-caption {
                      color: ${theme === 'white' ? '#18181b' : '#e9d5ff'};
                      font-weight: 700;
                      font-size: 1.1rem;
                      margin-bottom: 1rem;
                    }
                    .calendar-wrapper .rdp-head_cell {
                      color: ${theme === 'white' ? '#71717a' : '#c4b5fd'};
                      font-weight: 600;
                      font-size: 0.875rem;
                      text-transform: uppercase;
                    }
                    .calendar-wrapper .rdp-day {
                      color: ${theme === 'white' ? '#18181b' : '#e9d5ff'};
                      font-weight: 500;
                      border-radius: 8px;
                      transition: all 0.2s;
                    }
                    .calendar-wrapper .rdp-day:hover:not(.rdp-day_disabled) {
                      background-color: ${theme === 'white' ? '#fef3c7' : '#7c3aed'} !important;
                      transform: scale(1.1);
                    }
                    .calendar-wrapper .rdp-day_selected {
                      background: ${theme === 'white' ? 'linear-gradient(to right, #2563eb, #06b6d4)' : 'linear-gradient(to right, #8b5cf6, #ec4899)'} !important;
                      color: white !important;
                      font-weight: 700;
                    }
                    .calendar-wrapper .rdp-day_today {
                      color: ${theme === 'white' ? '#ea580c' : '#fbbf24'} !important;
                      font-weight: 700;
                      border: 2px solid ${theme === 'white' ? '#ea580c' : '#fbbf24'};
                    }
                    .calendar-wrapper .rdp-day_disabled {
                      color: ${theme === 'white' ? '#d4d4d8' : '#6b7280'};
                      opacity: 0.5;
                    }
                    .calendar-wrapper .rdp-button {
                      border: none;
                      background: transparent;
                      cursor: pointer;
                    }
                    .calendar-wrapper .rdp-button:disabled {
                      cursor: not-allowed;
                    }
                  `}</style>
                  <DayPicker
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={{ before: new Date() }}
                  />
                </div>

                {selectedDate && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mt-6 p-4 border-2 border-dashed transform -rotate-1 ${
                      theme === 'white'
                        ? 'bg-yellow-100 border-yellow-500'
                        : 'bg-purple-900/50 border-purple-400'
                    }`}
                  >
                    <div className={`text-sm font-bold ${theme === 'white' ? 'text-zinc-600' : 'text-purple-200'}`}>Selected Date:</div>
                    <div className={`text-lg font-black ${theme === 'white' ? 'text-zinc-900' : 'text-purple-50'}`}>
                      {selectedDate.toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  </motion.div>
                )}
              </motion.div>

              {/* Details form - Notepad style */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                {/* Time slots */}
                <div className={`p-6 shadow-xl ${theme === 'white' ? 'bg-white' : 'bg-slate-800 border-2 border-purple-500/40'}`} style={{
                  clipPath: 'polygon(0% 3%, 3% 0%, 97% 0%, 100% 3%, 100% 97%, 97% 100%, 3% 100%, 0% 97%)'
                }}>
                  <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <div className="text-2xl sm:text-3xl">⏰</div>
                    <h3 className={`text-lg sm:text-xl md:text-2xl font-black ${theme === 'white' ? 'text-zinc-900' : 'text-purple-100'}`} style={{ fontFamily: 'Comic Sans MS, cursive' }}>time slot</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {timeSlots.map((time, i) => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`px-4 py-3 font-bold transition-all transform hover:scale-105 ${
                          selectedTime === time
                            ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                            : theme === 'white'
                              ? 'bg-blue-100 text-zinc-800 hover:bg-blue-200'
                              : 'bg-slate-700 text-purple-100 hover:bg-slate-600 border border-purple-500/50'
                        }`}
                        style={{
                          clipPath: 'polygon(5% 0%, 95% 0%, 100% 5%, 100% 95%, 95% 100%, 5% 100%, 0% 95%, 0% 5%)',
                          transform: selectedTime === time ? 'rotate(-1deg)' : `rotate(${i % 2 === 0 ? '1deg' : '-1deg'})`
                        }}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Your details */}
                <div className={`p-6 shadow-xl ${theme === 'white' ? 'bg-white' : 'bg-slate-800 border-2 border-purple-500/40'}`} style={{
                  clipPath: 'polygon(0% 2%, 2% 0%, 98% 0%, 100% 2%, 100% 98%, 98% 100%, 2% 100%, 0% 98%)'
                }}>
                  <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <div className="text-2xl sm:text-3xl">✍️</div>
                    <h3 className={`text-lg sm:text-xl md:text-2xl font-black ${theme === 'white' ? 'text-zinc-900' : 'text-purple-100'}`} style={{ fontFamily: 'Comic Sans MS, cursive' }}>your details</h3>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className={`block text-sm font-bold mb-2 ${theme === 'white' ? 'text-zinc-700' : 'text-purple-200'}`}>Your Name</label>
                      <input
                        type="text"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        placeholder="nikhil sharma..."
                        className={`w-full px-5 py-4 border-2 focus:outline-none focus:border-blue-500 transition-colors font-bold ${
                          theme === 'white'
                            ? 'bg-yellow-50 border-zinc-300 text-zinc-900 placeholder-zinc-400'
                            : 'bg-slate-700 border-purple-500/50 text-white placeholder-purple-300'
                        }`}
                        style={{ clipPath: 'polygon(0% 5%, 5% 0%, 95% 0%, 100% 5%, 100% 95%, 95% 100%, 5% 100%, 0% 95%)' }}
                      />
                    </div>

                    <div>
                      <label className={`block text-sm font-bold mb-2 ${theme === 'white' ? 'text-zinc-700' : 'text-purple-200'}`}>Your Email</label>
                      <input
                        type="email"
                        value={clientEmail}
                        onChange={(e) => setClientEmail(e.target.value)}
                        placeholder="nikhil@email.com..."
                        className={`w-full px-5 py-4 border-2 focus:outline-none focus:border-blue-500 transition-colors font-bold ${
                          theme === 'white'
                            ? 'bg-blue-50 border-zinc-300 text-zinc-900 placeholder-zinc-400'
                            : 'bg-slate-700 border-purple-500/50 text-white placeholder-purple-300'
                        }`}
                        style={{ clipPath: 'polygon(0% 5%, 5% 0%, 95% 0%, 100% 5%, 100% 95%, 95% 100%, 5% 100%, 0% 95%)' }}
                      />
                    </div>

                    <div>
                      <label className={`block text-sm font-bold mb-2 ${theme === 'white' ? 'text-zinc-700' : 'text-purple-200'}`}>Tell me about your project</label>
                      <textarea
                        value={projectDetails}
                        onChange={(e) => setProjectDetails(e.target.value)}
                        placeholder="i need help with..."
                        rows={3}
                        className={`w-full px-5 py-4 border-2 focus:outline-none focus:border-blue-500 transition-colors resize-none font-bold ${
                          theme === 'white'
                            ? 'bg-pink-50 border-zinc-300 text-zinc-900 placeholder-zinc-400'
                            : 'bg-slate-700 border-purple-500/50 text-white placeholder-purple-300'
                        }`}
                        style={{ clipPath: 'polygon(0% 3%, 3% 0%, 97% 0%, 100% 3%, 100% 97%, 97% 100%, 3% 100%, 0% 97%)' }}
                      />
                    </div>
                  </div>
                </div>

                {/* Submit button - Big stamp style */}
                <button
                  type="button"
                  onClick={handleBookMeeting}
                  className="w-full px-6 sm:px-8 py-4 sm:py-6 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 text-white font-black text-lg sm:text-xl md:text-2xl tracking-wide transition-all transform hover:scale-105 hover:rotate-1 shadow-2xl"
                  style={{
                    clipPath: 'polygon(5% 0%, 95% 0%, 100% 5%, 100% 95%, 95% 100%, 5% 100%, 0% 95%, 0% 5%)',
                    fontFamily: 'Comic Sans MS, cursive'
                  }}
                >
                  🚀 BOOK THE CALL! 🚀
                </button>

                <p className={`text-sm text-center ${theme === 'white' ? 'text-zinc-600' : 'text-purple-300'}`} style={{ fontFamily: 'Comic Sans MS, cursive' }}>
                  i'll email you the google meet link! 📧✨
                </p>
              </motion.div>
            </div>
          )}
        </div>
      </section>

      {/* Skills Section - Collage Style */}
      <section className={`relative px-4 sm:px-6 py-12 sm:py-24 transition-colors duration-500 ${
        theme === 'white' ? 'bg-white' : 'bg-gradient-to-br from-slate-900 to-slate-800'
      }`}>
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-20">
            {/* Toolkit */}
            <div>
              <h2 className={`text-3xl sm:text-4xl md:text-5xl font-black mb-6 sm:mb-8 relative inline-block ${theme === 'white' ? 'text-zinc-900' : 'text-purple-100'}`}>
                <span className="relative z-10">MY TOOLKIT</span>
                {/* Paint splash */}
                <div className="absolute -inset-4 bg-gradient-to-r from-orange-400 to-pink-400 opacity-30 blur-2xl -z-10 rounded-full"></div>
                {/* Highlighter */}
                <div className={`absolute inset-0 opacity-30 -skew-x-12 -z-10 ${theme === 'white' ? 'bg-yellow-300' : 'bg-yellow-500'}`} style={{ top: '30%', height: '40%' }}></div>
              </h2>

              <div className="space-y-6">
                {[
                  { name: 'Premiere Pro', desc: 'my main weapon 🗡️', level: 95, color: 'from-purple-400 to-blue-400' },
                  { name: 'After Effects', desc: 'motion magic ✨', level: 85, color: 'from-blue-400 to-cyan-400' },
                  { name: 'Color Grading', desc: 'mood setter 🎨', level: 90, color: 'from-pink-400 to-purple-400' },
                  { name: 'Sound Design', desc: 'secret sauce 🎵', level: 80, color: 'from-orange-400 to-red-400' },
                  { name: 'Motion Graphics', desc: 'eye candy 🍬', level: 75, color: 'from-green-400 to-teal-400' }
                ].map((skill, i) => (
                  <div key={skill.name} className={`group p-5 shadow-lg transform hover:scale-105 transition-all ${
                    theme === 'white' ? 'bg-white' : 'bg-slate-800 border-2 border-purple-500/40'
                  }`}
                    style={{
                      clipPath: 'polygon(1% 0%, 99% 0%, 100% 1%, 100% 99%, 99% 100%, 1% 100%, 0% 99%, 0% 1%)',
                      transform: `rotate(${i % 2 === 0 ? '-1deg' : '1deg'})`
                    }}>
                    <div className="flex justify-between mb-3">
                      <div>
                        <div className={`font-black text-xl ${theme === 'white' ? 'text-zinc-900' : 'text-purple-100'}`}>{skill.name}</div>
                        <div className={`text-sm ${theme === 'white' ? 'text-zinc-600' : 'text-purple-300'}`} style={{ fontFamily: 'Comic Sans MS, cursive' }}>{skill.desc}</div>
                      </div>
                      <div className={`text-3xl font-black bg-gradient-to-r ${skill.color} bg-clip-text text-transparent`}>
                        {skill.level}%
                      </div>
                    </div>
                    <div className={`h-4 overflow-hidden relative ${theme === 'white' ? 'bg-zinc-200' : 'bg-slate-700'}`} style={{ clipPath: 'polygon(0% 20%, 20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%)' }}>
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className={`h-full bg-gradient-to-r ${skill.color}`}
                      ></motion.div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Creator squad - Polaroid wall */}
            <div>
              <h2 className={`text-3xl sm:text-4xl md:text-5xl font-black mb-6 sm:mb-8 relative inline-block ${theme === 'white' ? 'text-zinc-900' : 'text-purple-100'}`}>
                <span className="relative z-10">CREATOR SQUAD</span>
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-400 to-purple-400 opacity-30 blur-2xl -z-10 rounded-full"></div>
                <div className={`absolute inset-0 opacity-30 skew-x-12 -z-10 ${theme === 'white' ? 'bg-cyan-300' : 'bg-cyan-500'}`} style={{ top: '30%', height: '40%' }}></div>
              </h2>

              <div className="space-y-5">
                {[
                  { name: 'Jhansi Way', handle: '@thejhansiway', emoji: '🔥' },
                  { name: 'Kinshuk Jain', handle: '@kinshukjain_tv', emoji: '⚡' },
                  { name: 'Mr. Bhasad', handle: '@Mr.Bhasad', emoji: '🚀' },
                  { name: 'The Top Percentile', handle: '@the_top_percentile', emoji: '📚' },
                  { name: 'Ask Life With Anmol', handle: 'asklifewithanmol', emoji: '🎯' },
                  { name: 'Adi Sridhar', handle: '@adisridhar', emoji: '✨' }
                ].map((creator, i) => (
                  <div
                    key={creator.name}
                    className={`group p-6 shadow-lg hover:shadow-2xl transition-all cursor-pointer transform hover:scale-105 ${
                      theme === 'white' ? 'bg-white' : 'bg-slate-800 border-2 border-purple-500/40'
                    }`}
                    style={{
                      clipPath: 'polygon(2% 0%, 98% 0%, 100% 2%, 100% 98%, 98% 100%, 2% 100%, 0% 98%, 0% 2%)',
                      transform: `rotate(${i % 2 === 0 ? '1deg' : '-1deg'})`
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-4xl">{creator.emoji}</div>
                      <div className="flex-1">
                        <div className={`font-black text-xl ${theme === 'white' ? 'text-zinc-900' : 'text-purple-100'}`}>{creator.name}</div>
                        <div className={`text-sm ${theme === 'white' ? 'text-zinc-600' : 'text-purple-300'}`} style={{ fontFamily: 'Comic Sans MS, cursive' }}>{creator.handle}</div>
                      </div>
                      <Instagram className="w-6 h-6 text-pink-500" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact - Creative Collage Style */}
      <section className={`relative px-4 sm:px-6 py-16 sm:py-24 md:py-32 overflow-hidden transition-colors duration-500 ${
        theme === 'white' ? 'bg-gradient-to-br from-orange-100 via-pink-50 to-purple-100' : 'bg-gradient-to-br from-purple-950 via-fuchsia-950 to-slate-950'
      }`}>
        {/* Glowing background elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-br from-orange-500 to-pink-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-64 h-64 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-full blur-3xl"></div>
        </div>

        {/* Hand-drawn background doodles */}
        <div className={`absolute inset-0 ${theme === 'white' ? 'opacity-30' : 'opacity-20'}`}>
          <svg className="absolute top-20 left-20" width="150" height="150">
            <path d="M20,75 Q40,20 80,40 T140,75 Q120,130 80,110 T20,75 Z" stroke="#f97316" strokeWidth="3" fill="none" strokeDasharray="5,3"/>
          </svg>
          <svg className="absolute bottom-20 right-20" width="150" height="150">
            <circle cx="75" cy="75" r="60" stroke="#ec4899" strokeWidth="3" fill="none" strokeDasharray="4,4"/>
            <circle cx="75" cy="75" r="40" stroke="#8b5cf6" strokeWidth="2" fill="none" strokeDasharray="3,3"/>
          </svg>
          <svg className="absolute top-1/2 left-1/3" width="100" height="100">
            <path d="M10,50 L30,20 L50,40 L70,10 L90,30" stroke="#3b82f6" strokeWidth="2" fill="none" strokeDasharray="3,2"/>
          </svg>

          {/* More scattered doodles */}
          <svg className="absolute top-40 right-40" width="80" height="80">
            <path d="M40,10 L50,30 L70,25 L55,45 L65,65 L40,55 L15,65 L25,45 L10,25 L30,30 Z" stroke="#fbbf24" strokeWidth="2.5" fill="none"/>
          </svg>
          <svg className="absolute bottom-40 left-60" width="100" height="100">
            <path d="M10,50 Q30,20 50,50 T90,50" stroke="#06b6d4" strokeWidth="3" fill="none" strokeDasharray="6,4"/>
          </svg>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            {/* Main heading - Handwritten style */}
            <div className="relative inline-block mb-8 sm:mb-12">
              <div className="relative">
                <h2 className={`text-3xl sm:text-4xl md:text-6xl lg:text-8xl font-black leading-tight relative ${
                  theme === 'white' ? 'text-zinc-900' : 'text-white'
                }`} style={{ fontFamily: 'Comic Sans MS, cursive' }}>
                  <span className="block mb-2">got a project?</span>
                  <span className="block relative inline-block">
                    <span className="relative z-10">let's vibe</span>
                    {/* Highlighter marks */}
                    <div className="absolute inset-0 bg-orange-400 opacity-40 -skew-x-6 -z-10" style={{ top: '25%', height: '55%' }}></div>
                    <div className="absolute inset-0 bg-pink-400 opacity-30 skew-x-6 -z-10" style={{ top: '35%', height: '45%', left: '10%' }}></div>
                  </span>
                  <span className="block text-2xl sm:text-3xl md:text-5xl lg:text-6xl mt-2">& create 🎨</span>
                </h2>

                {/* Hand-drawn doodles around text */}
                <svg className="absolute -top-8 -right-12" width="120" height="120">
                  <path d="M20,60 Q40,20 80,40 Q100,60 80,80 Q60,100 40,80 Q20,60 40,40"
                    stroke={theme === 'white' ? '#f97316' : '#fb923c'} strokeWidth="3" fill="none" strokeDasharray="5,4"/>
                </svg>

                <svg className="absolute -bottom-8 -left-12" width="100" height="100">
                  <path d="M10,50 L30,20 L50,40 L70,15 L90,35"
                    stroke={theme === 'white' ? '#ec4899' : '#f472b6'} strokeWidth="3" fill="none" strokeLinecap="round"/>
                  <circle cx="88" cy="33" r="5" fill={theme === 'white' ? '#ec4899' : '#f472b6'}/>
                </svg>

                {/* Sparkle stars */}
                <div className="absolute -top-4 left-1/4 text-4xl">✨</div>
                <div className="absolute -bottom-6 right-1/4 text-3xl">⭐</div>
              </div>
            </div>

            {/* Handwritten note */}
            <div className="relative inline-block mb-12">
              {/* Glow behind card */}
              <div className={`absolute -inset-2 bg-gradient-to-r from-cyan-500 to-blue-500 blur-xl ${
                theme === 'white' ? 'opacity-20' : 'opacity-30'
              }`}></div>

              <div className={`relative backdrop-blur-xl px-8 py-6 shadow-2xl transform rotate-1 ${
                theme === 'white'
                  ? 'bg-white border-4 border-cyan-500'
                  : 'bg-zinc-900/80 border-2 border-white/20'
              }`}>
                <p className={`text-2xl leading-relaxed ${theme === 'white' ? 'text-zinc-900' : 'text-white'}`} style={{ fontFamily: 'Comic Sans MS, cursive' }}>
                  whether it's <span className="relative inline-block">
                    <span className={`relative z-10 ${theme === 'white' ? 'text-zinc-900' : 'text-white'}`}>instagram reels,</span>
                    <span className="absolute inset-0 bg-pink-500 opacity-40 -skew-x-6"></span>
                  </span>{' '}
                  <span className="relative inline-block">
                    <span className={`relative z-10 ${theme === 'white' ? 'text-zinc-900' : 'text-white'}`}>youtube videos,</span>
                    <span className="absolute inset-0 bg-cyan-500 opacity-40 skew-x-6"></span>
                  </span>{' '}
                  or something <span className={`relative inline-block font-black ${theme === 'white' ? 'text-purple-600' : 'text-purple-400'}`}>
                    completely wild
                    <svg className="absolute -bottom-2 left-0 w-full" height="8">
                      <path d="M0,4 Q50,1 100,5 T200,4" stroke={theme === 'white' ? '#7c3aed' : '#c084fc'} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                    </svg>
                  </span>
                  —i'm down to collab! 🤝
                </p>
              </div>
              {/* Paper clips */}
              <div className={`absolute -top-4 left-8 w-8 h-12 rounded-full ${
                theme === 'white' ? 'border-zinc-600' : 'border-zinc-400'
              }`} style={{ borderWidth: '3px', boxShadow: theme === 'white' ? '0 0 10px rgba(82, 82, 91, 0.3)' : '0 0 10px rgba(156, 163, 175, 0.5)' }}></div>
              <div className={`absolute -top-4 right-8 w-8 h-12 rounded-full ${
                theme === 'white' ? 'border-zinc-600' : 'border-zinc-400'
              }`} style={{ borderWidth: '3px', boxShadow: theme === 'white' ? '0 0 10px rgba(82, 82, 91, 0.3)' : '0 0 10px rgba(156, 163, 175, 0.5)' }}></div>
            </div>
          </motion.div>

          {/* Contact options - Mixed media cards */}
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-12 md:mb-16">
            {/* Email - sticky note */}
            <motion.a
              href="mailto:nikhmdia@gmail.com"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="group relative block"
            >
              {/* Glow */}
              <div className={`absolute -inset-2 bg-gradient-to-br from-yellow-500 to-orange-500 blur-xl opacity-50 group-hover:opacity-70 transition-opacity`}></div>

              <div className={`relative bg-gradient-to-br from-yellow-400 to-orange-500 p-8 shadow-2xl transform hover:scale-105 transition-all ${
                theme === 'white' ? 'border-4 border-orange-700' : 'border-2 border-yellow-300/50'
              }`} style={{
                clipPath: 'polygon(0% 5%, 5% 0%, 95% 0%, 100% 5%, 100% 95%, 95% 100%, 5% 100%, 0% 95%)',
                transform: 'rotate(-2deg)'
              }}>
                {/* Tape at top */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-6 bg-yellow-200/60 shadow-inner backdrop-blur-sm"></div>

                <div className="text-6xl mb-4">📧</div>
                <div className="text-sm font-black text-zinc-900 mb-2" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
                  DROP ME AN EMAIL
                </div>
                <div className="font-black text-lg text-zinc-900 mb-4">nikhmdia@gmail.com</div>

                {/* Hand-drawn arrow */}
                <svg className="mx-auto" width="100" height="30">
                  <path d="M10,15 L80,15 M80,15 L70,10 M80,15 L70,20" stroke="#dc2626" strokeWidth="3" fill="none" strokeLinecap="round"/>
                </svg>
              </div>
            </motion.a>

            {/* Instagram - Polaroid */}
            <motion.a
              href="https://instagram.com/nimbuuz.mov"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="group relative block"
            >
              {/* Pink/purple glow */}
              <div className="absolute -inset-2 bg-gradient-to-br from-pink-500 to-purple-500 blur-xl opacity-50 group-hover:opacity-70 transition-opacity"></div>

              <div className={`relative p-6 pb-12 shadow-2xl transform hover:scale-105 transition-all ${
                theme === 'white'
                  ? 'bg-white border-4 border-pink-600'
                  : 'bg-zinc-900 border-2 border-pink-500/30'
              }`} style={{ transform: 'rotate(2deg)' }}>
                {/* Polaroid photo area */}
                <div className="bg-gradient-to-br from-purple-500 to-pink-500 aspect-square flex items-center justify-center mb-4 shadow-lg">
                  <div className="text-8xl">📱</div>
                </div>

                {/* Caption area */}
                <div className="text-center">
                  <div className={`text-sm font-black mb-1 ${theme === 'white' ? 'text-gray-700' : 'text-gray-400'}`} style={{ fontFamily: 'Comic Sans MS, cursive' }}>
                    HIT ME UP ON IG
                  </div>
                  <div className={`font-black text-lg ${theme === 'white' ? 'text-zinc-900' : 'text-white'}`}>@nimbuuz.mov</div>
                </div>

                {/* Tape pieces */}
                <div className={`absolute -top-2 left-8 w-16 h-6 bg-pink-400/60 -rotate-12 backdrop-blur-sm`} style={{ boxShadow: theme === 'white' ? '0 0 8px rgba(236, 72, 153, 0.3)' : '0 0 10px rgba(236, 72, 153, 0.5)' }}></div>
                <div className={`absolute -top-2 right-8 w-16 h-6 bg-pink-400/60 rotate-12 backdrop-blur-sm`} style={{ boxShadow: theme === 'white' ? '0 0 8px rgba(236, 72, 153, 0.3)' : '0 0 10px rgba(236, 72, 153, 0.5)' }}></div>
              </div>
            </motion.a>

            {/* Phone - index card */}
            <motion.a
              href="tel:+919891698051"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="group relative block"
            >
              {/* Blue/cyan glow */}
              <div className="absolute -inset-2 bg-gradient-to-br from-blue-500 to-cyan-500 blur-xl opacity-50 group-hover:opacity-70 transition-opacity"></div>

              <div className={`relative p-8 shadow-2xl border-l-4 border-blue-500 transform hover:scale-105 transition-all ${
                theme === 'white'
                  ? 'bg-blue-50 border-4 border-blue-600'
                  : 'bg-zinc-900 border-2 border-blue-500/30'
              }`} style={{
                clipPath: 'polygon(0% 0%, 100% 0%, 100% 95%, 95% 100%, 0% 100%)',
                transform: 'rotate(-1deg)'
              }}>
                {/* Hole punch circles */}
                <div className={`absolute left-2 top-1/4 w-4 h-4 rounded-full border-2 shadow-lg ${
                  theme === 'white'
                    ? 'bg-blue-600 border-blue-700 shadow-blue-300'
                    : 'bg-blue-500 border-blue-300 shadow-blue-500/50'
                }`}></div>
                <div className={`absolute left-2 top-1/2 w-4 h-4 rounded-full border-2 shadow-lg ${
                  theme === 'white'
                    ? 'bg-blue-600 border-blue-700 shadow-blue-300'
                    : 'bg-blue-500 border-blue-300 shadow-blue-500/50'
                }`}></div>
                <div className={`absolute left-2 top-3/4 w-4 h-4 rounded-full border-2 shadow-lg ${
                  theme === 'white'
                    ? 'bg-blue-600 border-blue-700 shadow-blue-300'
                    : 'bg-blue-500 border-blue-300 shadow-blue-500/50'
                }`}></div>

                <div className="text-6xl mb-4">📞</div>
                <div className={`text-sm font-black mb-2 ${theme === 'white' ? 'text-gray-800' : 'text-gray-400'}`} style={{ fontFamily: 'Comic Sans MS, cursive' }}>
                  CALL / WHATSAPP
                </div>
                <div className={`font-black text-lg mb-2 ${theme === 'white' ? 'text-zinc-900' : 'text-white'}`}>+91 9891698051</div>

                {/* Handwritten note */}
                <div className={`text-xs italic mt-4 ${theme === 'white' ? 'text-gray-600' : 'text-gray-400'}`} style={{ fontFamily: 'Comic Sans MS, cursive' }}>
                  (available 10am-8pm IST)
                </div>
              </div>
            </motion.a>
          </div>

          {/* Big CTA */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-center relative"
          >
            {/* Action burst background */}
            <div className="relative inline-block">
              {/* Multiple glowing layers */}
              <div className={`absolute -inset-20 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 blur-3xl animate-pulse ${
                theme === 'white' ? 'opacity-25' : 'opacity-40'
              }`}></div>

              {/* Starburst shape */}
              <svg className="absolute -inset-16 w-[calc(100%+8rem)] h-[calc(100%+8rem)] -z-10" viewBox="0 0 200 200">
                <path d="M100,10 L110,80 L180,70 L130,100 L180,130 L110,120 L100,190 L90,120 L20,130 L70,100 L20,70 L90,80 Z"
                  fill="url(#starGradient)" opacity={theme === 'white' ? '0.5' : '0.8'}/>
                <defs>
                  <linearGradient id="starGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#fbbf24', stopOpacity: 1 }} />
                    <stop offset="50%" style={{ stopColor: '#f97316', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#ec4899', stopOpacity: 1 }} />
                  </linearGradient>
                </defs>
              </svg>

              <a
                href="mailto:nikhmdia@gmail.com"
                className="inline-block px-8 sm:px-12 md:px-16 py-4 sm:py-6 md:py-8 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 text-white font-black text-xl sm:text-2xl md:text-3xl lg:text-4xl shadow-2xl hover:shadow-3xl transition-all transform hover:scale-110 border-4 border-white relative overflow-hidden group"
                style={{
                  clipPath: 'polygon(5% 0%, 95% 0%, 100% 5%, 100% 95%, 95% 100%, 5% 100%, 0% 95%, 0% 5%)',
                  fontFamily: 'Comic Sans MS, cursive',
                  boxShadow: theme === 'white'
                    ? '0 20px 40px rgba(249, 115, 22, 0.4), 0 10px 20px rgba(236, 72, 153, 0.3)'
                    : '0 0 40px rgba(249, 115, 22, 0.6), 0 0 80px rgba(236, 72, 153, 0.4)'
                }}
              >
                <span className="relative z-10 flex items-center gap-2 sm:gap-3 md:gap-4 drop-shadow-2xl">
                  <span className="text-2xl sm:text-3xl md:text-4xl">🚀</span>
                  LET'S DO THIS!
                  <span className="text-2xl sm:text-3xl md:text-4xl">✨</span>
                </span>

                {/* Animated background */}
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </a>

              {/* Comic book action words */}
              <div className={`absolute -top-12 -left-12 text-2xl font-black transform -rotate-12 ${
                theme === 'white'
                  ? 'text-orange-600 drop-shadow-lg'
                  : 'text-orange-400 drop-shadow-[0_0_10px_rgba(251,146,60,0.8)]'
              }`} style={{ fontFamily: 'Comic Sans MS, cursive' }}>
                POW!
              </div>
              <div className={`absolute -bottom-12 -right-12 text-2xl font-black transform rotate-12 ${
                theme === 'white'
                  ? 'text-pink-600 drop-shadow-lg'
                  : 'text-pink-400 drop-shadow-[0_0_10px_rgba(236,72,153,0.8)]'
              }`} style={{ fontFamily: 'Comic Sans MS, cursive' }}>
                BOOM!
              </div>
            </div>

            {/* Bottom note */}
            <div className="mt-8 sm:mt-12 relative inline-block">
              {/* Glow behind note */}
              <div className={`absolute -inset-2 bg-gradient-to-r from-cyan-500 to-blue-500 blur-lg ${
                theme === 'white' ? 'opacity-20' : 'opacity-30'
              }`}></div>

              <div className={`relative backdrop-blur-xl px-8 py-4 shadow-2xl border-2 border-dashed transform -rotate-1 ${
                theme === 'white'
                  ? 'bg-white/90 border-cyan-400'
                  : 'bg-zinc-900/80 border-white/30'
              }`}>
                <p className={`text-sm ${theme === 'white' ? 'text-zinc-900' : 'text-white'}`} style={{ fontFamily: 'Comic Sans MS, cursive' }}>
                  <span className={`font-black ${theme === 'white' ? 'text-cyan-600' : 'text-cyan-400'}`}>P.S.</span> usually reply within 24 hours! ⚡
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer - Artistic Collage Style */}
      <footer className={`px-4 sm:px-6 py-12 sm:py-16 md:py-20 relative overflow-hidden transition-colors duration-500 ${
        theme === 'white' ? 'bg-gradient-to-br from-amber-100 to-orange-100' : 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900'
      }`}>
        {/* Decorative background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className={`absolute top-10 left-10 w-40 h-40 rounded-full ${
            theme === 'white' ? 'bg-orange-400' : 'bg-orange-500'
          } blur-3xl`}></div>
          <div className={`absolute bottom-10 right-10 w-40 h-40 rounded-full ${
            theme === 'white' ? 'bg-pink-400' : 'bg-pink-500'
          } blur-3xl`}></div>
          <div className={`absolute top-1/2 left-1/3 w-32 h-32 rounded-full ${
            theme === 'white' ? 'bg-purple-400' : 'bg-purple-500'
          } blur-3xl`}></div>
        </div>

        {/* Hand-drawn doodles scattered */}
        <div className={`absolute inset-0 ${theme === 'white' ? 'opacity-20' : 'opacity-15'}`}>
          <svg className="absolute top-8 left-16" width="80" height="80">
            <circle cx="40" cy="40" r="30" stroke={theme === 'white' ? '#f97316' : 'white'} strokeWidth="2.5" fill="none" strokeDasharray="4,3"/>
            <path d="M20,40 L60,40 M40,20 L40,60" stroke={theme === 'white' ? '#f97316' : 'white'} strokeWidth="2" strokeDasharray="3,2"/>
          </svg>

          <svg className="absolute top-12 right-24" width="100" height="100">
            <path d="M10,50 Q30,10 50,30 T90,50" stroke={theme === 'white' ? '#ec4899' : 'white'} strokeWidth="3" fill="none" strokeLinecap="round"/>
            <circle cx="88" cy="48" r="6" fill={theme === 'white' ? '#ec4899' : 'white'}/>
          </svg>

          <svg className="absolute bottom-16 left-1/4" width="90" height="90">
            <path d="M45,10 L55,35 L80,35 L60,50 L70,75 L45,60 L20,75 L30,50 L10,35 L35,35 Z"
              stroke={theme === 'white' ? '#8b5cf6' : 'white'} strokeWidth="2.5" fill="none" strokeDasharray="3,2"/>
          </svg>

          <svg className="absolute bottom-8 right-16" width="70" height="70">
            <rect x="10" y="10" width="50" height="50" stroke={theme === 'white' ? '#06b6d4' : 'white'}
              strokeWidth="2" fill="none" strokeDasharray="5,3" transform="rotate(15 35 35)"/>
          </svg>

          <svg className="absolute top-1/2 right-1/3" width="60" height="60">
            <path d="M30,10 L30,50 M10,30 L50,30" stroke={theme === 'white' ? '#fbbf24' : 'white'} strokeWidth="3" strokeLinecap="round"/>
          </svg>
        </div>

        {/* Decorative tape strips */}
        <div className="absolute top-0 left-20 w-32 h-8 bg-yellow-200/40 -rotate-12 shadow-lg"
          style={{ boxShadow: 'inset 0 0 15px rgba(0,0,0,0.1)' }}></div>
        <div className="absolute top-0 right-32 w-28 h-8 bg-pink-200/40 rotate-6 shadow-lg"
          style={{ boxShadow: 'inset 0 0 15px rgba(0,0,0,0.1)' }}></div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Main footer content */}
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 md:gap-12 mb-8 sm:mb-12">
            {/* Column 1 - Brand */}
            <div className="relative">
              <div className={`inline-block p-6 shadow-xl transform -rotate-2 ${
                theme === 'white' ? 'bg-white border-4 border-orange-500' : 'bg-slate-800 border-4 border-orange-400'
              }`} style={{
                clipPath: 'polygon(2% 0%, 98% 0%, 100% 2%, 100% 98%, 98% 100%, 2% 100%, 0% 98%, 0% 2%)'
              }}>
                <h3 className={`text-2xl sm:text-3xl font-black mb-2 ${theme === 'white' ? 'text-zinc-900' : 'text-white'}`}
                  style={{ fontFamily: 'Comic Sans MS, cursive' }}>
                  NIKHIL
                </h3>
                <p className={`text-xs sm:text-sm ${theme === 'white' ? 'text-zinc-700' : 'text-gray-400'}`}
                  style={{ fontFamily: 'Comic Sans MS, cursive' }}>
                  turning raw footage into<br/>
                  <span className={`font-black ${theme === 'white' ? 'text-orange-600' : 'text-orange-400'}`}>scroll-stopping magic</span> ✨
                </p>
                {/* Sticker effect */}
                <div className="absolute -top-3 -right-3 w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-xl shadow-lg">
                  🎬
                </div>
              </div>
            </div>

            {/* Column 2 - Quick Links */}
            <div className="relative">
              <div className={`p-6 shadow-lg transform rotate-1 ${
                theme === 'white' ? 'bg-gradient-to-br from-pink-100 to-purple-100' : 'bg-gradient-to-br from-pink-500/20 to-purple-500/20 border-2 border-pink-500/40'
              }`} style={{
                clipPath: 'polygon(0% 5%, 5% 0%, 95% 0%, 100% 5%, 100% 95%, 95% 100%, 5% 100%, 0% 95%)'
              }}>
                <h4 className={`text-lg sm:text-xl font-black mb-3 sm:mb-4 ${theme === 'white' ? 'text-zinc-900' : 'text-white'}`}
                  style={{ fontFamily: 'Comic Sans MS, cursive' }}>
                  QUICK LINKS 🔗
                </h4>
                <div className="space-y-2">
                  {[
                    { label: 'my work', href: '#work', emoji: '🎥' },
                    { label: 'book a call', href: '#booking', emoji: '📞' },
                    { label: 'email me', href: 'mailto:nikhmdia@gmail.com', emoji: '📧' }
                  ].map((link, i) => (
                    <a
                      key={i}
                      href={link.href}
                      className={`flex items-center gap-2 font-bold transition-all hover:translate-x-2 ${
                        theme === 'white' ? 'text-zinc-700 hover:text-orange-600' : 'text-gray-300 hover:text-orange-400'
                      }`}
                      style={{ fontFamily: 'Comic Sans MS, cursive' }}
                    >
                      <span>{link.emoji}</span>
                      <span>{link.label}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Column 3 - Social */}
            <div className="relative">
              <div className={`p-6 shadow-lg transform -rotate-1 ${
                theme === 'white' ? 'bg-gradient-to-br from-blue-100 to-cyan-100' : 'bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-2 border-cyan-500/40'
              }`} style={{
                clipPath: 'polygon(5% 0%, 95% 0%, 100% 5%, 100% 95%, 95% 100%, 5% 100%, 0% 95%, 0% 5%)'
              }}>
                <h4 className={`text-lg sm:text-xl font-black mb-3 sm:mb-4 ${theme === 'white' ? 'text-zinc-900' : 'text-white'}`}
                  style={{ fontFamily: 'Comic Sans MS, cursive' }}>
                  CONNECT 🤝
                </h4>
                <div className="flex gap-4">
                  <a
                    href="https://instagram.com/nimbuuz.mov"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center transform hover:scale-110 transition-all shadow-lg ${
                      theme === 'white' ? 'bg-gradient-to-br from-pink-500 to-purple-600' : 'bg-gradient-to-br from-pink-500 to-purple-500'
                    }`}
                    style={{ clipPath: 'polygon(10% 0%, 90% 0%, 100% 10%, 100% 90%, 90% 100%, 10% 100%, 0% 90%, 0% 10%)' }}
                  >
                    <Instagram className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                  </a>
                  <a
                    href="mailto:nikhmdia@gmail.com"
                    className={`w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center transform hover:scale-110 transition-all shadow-lg ${
                      theme === 'white' ? 'bg-gradient-to-br from-orange-500 to-red-600' : 'bg-gradient-to-br from-orange-500 to-red-500'
                    }`}
                    style={{ clipPath: 'polygon(10% 0%, 90% 0%, 100% 10%, 100% 90%, 90% 100%, 10% 100%, 0% 90%, 0% 10%)' }}
                  >
                    <Mail className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className={`pt-6 sm:pt-8 border-t-4 border-dashed ${
            theme === 'white' ? 'border-orange-300' : 'border-zinc-700'
          }`}>
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6">
              {/* Copyright */}
              <div className={`relative inline-block text-xs sm:text-sm ${theme === 'white' ? 'text-zinc-700' : 'text-gray-400'}`}
                style={{ fontFamily: 'Comic Sans MS, cursive' }}>
                <span className="relative z-10">© 2026 nikhil yadav • video editor ✂️✨</span>
                <svg className="absolute -bottom-2 left-0 w-full" height="6">
                  <path d="M0,3 Q50,1 100,4 T200,3" stroke={theme === 'white' ? '#f97316' : '#fb923c'}
                    strokeWidth="1.5" fill="none" opacity="0.5" strokeLinecap="round"/>
                </svg>
              </div>

              {/* Made with love */}
              <div className={`flex items-center gap-2 text-xs sm:text-sm ${theme === 'white' ? 'text-zinc-700' : 'text-gray-400'}`}
                style={{ fontFamily: 'Comic Sans MS, cursive' }}>
                <span>made with</span>
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity, repeatDelay: 1 }}
                  className="text-2xl"
                >
                  ❤️
                </motion.span>
                <span>& wayyyy too much coffee</span>
                <motion.span
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 0.5 }}
                  className="text-xl"
                >
                  ☕
                </motion.span>
              </div>
            </div>
          </div>

          {/* Scattered stickers */}
          <div className="absolute -bottom-4 left-20 w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center text-3xl transform -rotate-12 shadow-lg">
            ⭐
          </div>
          <div className="absolute -bottom-6 right-32 w-14 h-14 bg-pink-500 transform rotate-12 shadow-lg flex items-center justify-center text-2xl"
            style={{ clipPath: 'polygon(10% 0%, 90% 0%, 100% 10%, 100% 90%, 90% 100%, 10% 100%, 0% 90%, 0% 10%)' }}>
            ✨
          </div>
        </div>
      </footer>

      {/* Video Modal */}
      {showVideoModal && currentVideo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-2 sm:p-4 md:p-6"
          onClick={() => setShowVideoModal(false)}
        >
          <div className="relative w-full max-w-6xl" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setShowVideoModal(false)}
              className="absolute -top-12 sm:-top-16 right-0 w-10 h-10 sm:w-14 sm:h-14 bg-red-500 text-white font-black text-xl sm:text-2xl hover:bg-red-600 transition-all transform hover:rotate-90"
              style={{ clipPath: 'polygon(10% 0%, 90% 0%, 100% 10%, 100% 90%, 90% 100%, 10% 100%, 0% 90%, 0% 10%)' }}
            >
              ✕
            </button>

            <div
              className={`relative overflow-hidden shadow-2xl ${
                theme === 'white' ? 'bg-zinc-900' : 'bg-slate-900 border-4 border-purple-500'
              }`}
              style={{
                aspectRatio: currentVideo.platform === 'instagram' ? '9/16' : '16/9',
                maxHeight: '85vh',
                margin: '0 auto',
                clipPath: 'polygon(1% 0%, 99% 0%, 100% 1%, 100% 99%, 99% 100%, 1% 100%, 0% 99%, 0% 1%)'
              }}
            >
              {currentVideo.platform === 'instagram' ? (
                <iframe
                  src={currentVideo.videoUrl}
                  className="w-full h-full"
                  frameBorder="0"
                  scrolling="no"
                  allow="encrypted-media"
                />
              ) : (
                <iframe
                  src={currentVideo.videoUrl}
                  className="w-full h-full"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                />
              )}
            </div>

            <div className="mt-4 sm:mt-6 md:mt-8 text-center">
              <div className={`inline-block px-3 sm:px-4 py-2 mb-3 sm:mb-4 ${
                theme === 'white' ? 'bg-white' : 'bg-slate-800 border-2 border-purple-500'
              }`} style={{
                clipPath: 'polygon(5% 0%, 95% 0%, 100% 5%, 100% 95%, 95% 100%, 5% 100%, 0% 95%, 0% 5%)'
              }}>
                <span className={`text-xs sm:text-sm ${theme === 'white' ? 'text-zinc-600' : 'text-purple-200'}`} style={{ fontFamily: 'Comic Sans MS, cursive' }}>
                  {currentVideo.platform === 'instagram' ? '📷 Instagram' : '🎥 YouTube'} • {currentVideo.creator}
                </span>
              </div>
              <h3 className={`text-2xl sm:text-3xl md:text-4xl font-black mb-2 ${theme === 'white' ? 'text-white' : 'text-purple-100'}`}>{currentVideo.title}</h3>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
