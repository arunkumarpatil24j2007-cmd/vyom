import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Sparkles, ArrowRight, Eye, EyeOff, Lock, Mail,
  User, Calendar, Clock, MapPin, CheckCircle2
} from 'lucide-react';
import { saveActiveProfile } from '@/lib/storage/guestStore';

export default function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const isSignup = location.pathname.includes('signup');
  const isOnboarding = location.pathname.includes('onboarding');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [birthDate, setBirthDate] = useState('1994-04-14');
  const [birthTime, setBirthTime] = useState('06:30');
  const [birthPlace, setBirthPlace] = useState('New Delhi, India');
  const [birthTimeAccuracy, setBirthTimeAccuracy] = useState('exact');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignup) {
      navigate('/onboarding');
    } else {
      navigate('/dashboard');
    }
  };

  const handleOnboardingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (fullName.trim()) {
      saveActiveProfile({
        name: fullName.trim(),
        birthDate,
        birthTime: birthTimeAccuracy === 'unknown' ? '' : birthTime,
        birthTimePrecision: birthTimeAccuracy as 'exact' | 'approximate' | 'unknown',
        birthPlace,
        latitude: 28.6139,
        longitude: 77.209,
        timezone: 'Asia/Kolkata',
      });
    }
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#FEF6EB] text-[#09132E] flex flex-col justify-between p-6 md:p-12">
      {/* Top Brand Link */}
      <div className="w-full max-w-md mx-auto flex items-center justify-between mb-4">
        <Link to="/" className="text-2xl font-extrabold text-[#09132E]">
          Vyom
        </Link>
        <Link to="/" className="text-xs font-bold text-[#FF4B19] hover:underline">
          &larr; Back to Home
        </Link>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-md mx-auto card-cream p-8 md:p-10 border border-[#E8DCCB] shadow-xl space-y-6">
        {isOnboarding ? (
          /* Onboarding Form */
          <form onSubmit={handleOnboardingSubmit} className="space-y-5">
            <div className="space-y-1 text-center">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#FF4B19]">Step 2 of 2</span>
              <h2 className="text-2xl font-extrabold text-[#09132E]" style={{ fontFamily: 'var(--font-heading)' }}>
                Your Birth Coordinates
              </h2>
              <p className="text-xs text-[#4A5468]">
                Required for high-precision astronomical ephemeris and Lagna calculation.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-[#09132E]">Full Name</label>
                <div className="relative">
                  <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7A8294]" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="input-card pl-10 text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#09132E]">Birth Date</label>
                  <input
                    type="date"
                    required
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="input-card text-xs font-semibold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-[#09132E]">Birth Time</label>
                  <input
                    type="time"
                    required
                    value={birthTime}
                    onChange={(e) => setBirthTime(e.target.value)}
                    className="input-card text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#09132E]">Birth Place (City, Country)</label>
                <div className="relative">
                  <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7A8294]" />
                  <input
                    type="text"
                    required
                    value={birthPlace}
                    onChange={(e) => setBirthPlace(e.target.value)}
                    className="input-card pl-10 text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#09132E]">Time Precision</label>
                <select
                  value={birthTimeAccuracy}
                  onChange={(e) => setBirthTimeAccuracy(e.target.value)}
                  className="input-card text-xs font-semibold"
                >
                  <option value="exact">Exact (Birth Certificate / Hospital record)</option>
                  <option value="approximate">Approximate (Within ±30 minutes)</option>
                  <option value="unknown">Unknown (Moon-sign based reading)</option>
                </select>
              </div>
            </div>

            <button type="submit" className="btn-pill-orange w-full text-xs font-bold py-3 mt-2">
              <span>Generate My Kundli & Open Vyom</span>
              <ArrowRight size={14} />
            </button>
          </form>
        ) : (
          /* Sign In / Sign Up Form */
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1 text-center">
              <h2 className="text-2xl font-extrabold text-[#09132E]" style={{ fontFamily: 'var(--font-heading)' }}>
                {isSignup ? 'Create your Vyom account' : 'Welcome back to Vyom'}
              </h2>
              <p className="text-xs text-[#4A5468]">
                {isSignup ? 'Begin your journey into ancient astrological intelligence.' : 'Enter your credentials to access your saved charts and consultations.'}
              </p>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-[#09132E]">Email Address</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7A8294]" />
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-card pl-10 text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#09132E]">Password</label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7A8294]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-card pl-10 pr-10 text-xs font-semibold"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#7A8294]"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
            </div>

            <button type="submit" className="btn-pill-orange w-full text-xs font-bold py-3 mt-2">
              <span>{isSignup ? 'Continue to Birth Profile' : 'Sign In to Workspace'}</span>
              <ArrowRight size={14} />
            </button>

            <div className="pt-2 text-center text-xs text-[#7A8294]">
              {isSignup ? (
                <span>
                  Already have an account?{' '}
                  <Link to="/login" className="font-bold text-[#FF4B19] hover:underline">
                    Sign In
                  </Link>
                </span>
              ) : (
                <span>
                  Don't have an account yet?{' '}
                  <Link to="/signup" className="font-bold text-[#FF4B19] hover:underline">
                    Create Account
                  </Link>
                </span>
              )}
            </div>
          </form>
        )}
      </div>

      <div className="text-center text-[11px] text-[#7A8294]">
        © 2025 Vyom. All rights reserved.
      </div>
    </div>
  );
}
