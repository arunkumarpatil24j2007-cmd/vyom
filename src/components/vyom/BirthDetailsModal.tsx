import React, { useState, useEffect } from 'react';
import { X, Sparkles, MapPin, Calendar, Clock, User, Trash2, Check } from 'lucide-react';
import {
  getActiveProfile,
  saveActiveProfile,
  clearAllGuestData,
  type UserBirthDetails,
} from '@/lib/storage/guestStore';
import { calculateNatalChart } from '@/lib/astrology/calculations/chartEngine';
import { saveCalculatedChart } from '@/lib/storage/guestStore';

interface BirthDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProfileUpdated?: (profile: UserBirthDetails) => void;
}

const CITY_PRESETS = [
  { name: 'New Delhi, India', lat: 28.6139, lng: 77.209, tz: 'Asia/Kolkata' },
  { name: 'Mumbai, India', lat: 19.076, lng: 72.8777, tz: 'Asia/Kolkata' },
  { name: 'Bengaluru, India', lat: 12.9716, lng: 77.5946, tz: 'Asia/Kolkata' },
  { name: 'London, UK', lat: 51.5074, lng: -0.1278, tz: 'Europe/London' },
  { name: 'New York, USA', lat: 40.7128, lng: -74.006, tz: 'America/New_York' },
  { name: 'San Francisco, USA', lat: 37.7749, lng: -122.4194, tz: 'America/Los_Angeles' },
  { name: 'Dubai, UAE', lat: 25.2048, lng: 55.2708, tz: 'Asia/Dubai' },
  { name: 'Singapore', lat: 1.3521, lng: 103.8198, tz: 'Asia/Singapore' },
];

export default function BirthDetailsModal({
  isOpen,
  onClose,
  onProfileUpdated,
}: BirthDetailsModalProps) {
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('1994-04-14');
  const [birthTime, setBirthTime] = useState('06:30');
  const [birthTimePrecision, setBirthTimePrecision] = useState<'exact' | 'approximate' | 'unknown'>('exact');
  const [birthPlace, setBirthPlace] = useState('New Delhi, India');
  const [latitude, setLatitude] = useState(28.6139);
  const [longitude, setLongitude] = useState(77.209);
  const [timezone, setTimezone] = useState('Asia/Kolkata');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('male');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const existing = getActiveProfile();
    if (existing) {
      setName(existing.name);
      setBirthDate(existing.birthDate);
      setBirthTime(existing.birthTime || '12:00');
      setBirthTimePrecision(existing.birthTimePrecision || 'exact');
      setBirthPlace(existing.birthPlace);
      setLatitude(existing.latitude);
      setLongitude(existing.longitude);
      setTimezone(existing.timezone);
      if (existing.gender) setGender(existing.gender);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelectPreset = (preset: typeof CITY_PRESETS[0]) => {
    setBirthPlace(preset.name);
    setLatitude(preset.lat);
    setLongitude(preset.lng);
    setTimezone(preset.tz);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const saved = saveActiveProfile({
      name: name.trim(),
      birthDate,
      birthTime: birthTimePrecision === 'unknown' ? '' : birthTime,
      birthTimePrecision,
      birthPlace,
      latitude,
      longitude,
      timezone,
      gender,
    });

    // Immediately calculate and cache the natal chart
    try {
      const calculatedChart = calculateNatalChart({
        name: saved.name,
        birthDate: saved.birthDate,
        birthTime: saved.birthTime,
        birthTimePrecision: saved.birthTimePrecision,
        birthPlace: saved.birthPlace,
        latitude: saved.latitude,
        longitude: saved.longitude,
        timezone: saved.timezone,
      });
      saveCalculatedChart(calculatedChart);
    } catch (err) {
      console.error('Error calculating chart on profile save:', err);
    }

    setSavedSuccess(true);
    onProfileUpdated?.(saved);

    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  const handleWipeData = () => {
    if (window.confirm('Are you sure you want to completely erase all saved birth details, charts, and reports from this browser?')) {
      clearAllGuestData();
      setName('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
      <div className="bg-[#FAF2E8] max-w-lg w-full rounded-[32px] p-6 md:p-8 border border-[#E8DCCB] shadow-2xl relative space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E8DCCB]/80">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-full bg-[#FF4B19]/15 text-[#FF4B19] flex items-center justify-center">
              <Sparkles size={16} />
            </span>
            <div>
              <h3 className="font-extrabold text-lg text-[#09132E]" style={{ fontFamily: 'var(--font-heading)' }}>
                Your Cosmic Profile
              </h3>
              <p className="text-[11px] text-[#7A8294]">
                Calculated via Sidereal Lahiri Ephemeris
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#EDE3D4] text-[#09132E] flex items-center justify-center hover:bg-[#E2D4C0] transition-colors"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          {/* Full Name */}
          <div>
            <label className="block font-bold text-[#09132E] mb-1.5 uppercase tracking-wider text-[10px]">
              Full Name / Identity
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-2.5 rounded-2xl bg-white border border-[#E8DCCB] text-[#09132E] focus:outline-hidden focus:ring-2 focus:ring-[#FF4B19]/30 text-xs font-medium"
              />
              <User size={14} className="absolute right-3.5 top-3 text-[#7A8294]" />
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#09132E] mb-1.5 uppercase tracking-wider text-[10px]">
                Date of Birth
              </label>
              <div className="relative">
                <input
                  type="date"
                  required
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-white border border-[#E8DCCB] text-[#09132E] focus:outline-hidden focus:ring-2 focus:ring-[#FF4B19]/30 text-xs font-medium"
                />
                <Calendar size={14} className="absolute right-3.5 top-3 text-[#7A8294] pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block font-bold text-[#09132E] mb-1.5 uppercase tracking-wider text-[10px]">
                Exact Birth Time (24h)
              </label>
              <div className="relative">
                <input
                  type="time"
                  required={birthTimePrecision !== 'unknown'}
                  disabled={birthTimePrecision === 'unknown'}
                  value={birthTime}
                  onChange={(e) => setBirthTime(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-white border border-[#E8DCCB] text-[#09132E] focus:outline-hidden focus:ring-2 focus:ring-[#FF4B19]/30 text-xs font-medium disabled:opacity-50"
                />
                <Clock size={14} className="absolute right-3.5 top-3 text-[#7A8294] pointer-events-none" />
              </div>
              <select
                value={birthTimePrecision}
                onChange={(e) => setBirthTimePrecision(e.target.value as 'exact' | 'approximate' | 'unknown')}
                aria-label="Birth time accuracy"
                className="mt-2 w-full px-4 py-2 rounded-2xl bg-white border border-[#E8DCCB] text-[#09132E] text-[11px] font-medium"
              >
                <option value="exact">Exact (birth certificate / hospital record)</option>
                <option value="approximate">Approximate (within ±30 minutes)</option>
                <option value="unknown">I don't know my birth time</option>
              </select>
            </div>
          </div>

          {/* Location Presets */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-bold text-[#09132E] uppercase tracking-wider text-[10px]">
                Birth Location
              </label>
              <span className="text-[10px] text-[#7A8294]">Quick Presets</span>
            </div>
            <div className="flex flex-wrap gap-1.5 mb-2.5">
              {CITY_PRESETS.slice(0, 5).map((p) => (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => handleSelectPreset(p)}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-semibold transition-all ${
                    birthPlace === p.name
                      ? 'bg-[#09132E] text-white shadow-xs'
                      : 'bg-[#EDE3D4] text-[#4A5468] hover:bg-[#E2D4C0]'
                  }`}
                >
                  {p.name.split(',')[0]}
                </button>
              ))}
            </div>

            <div className="relative">
              <input
                type="text"
                required
                value={birthPlace}
                onChange={(e) => setBirthPlace(e.target.value)}
                placeholder="City, Country"
                className="w-full px-4 py-2.5 rounded-2xl bg-white border border-[#E8DCCB] text-[#09132E] focus:outline-hidden focus:ring-2 focus:ring-[#FF4B19]/30 text-xs font-medium"
              />
              <MapPin size={14} className="absolute right-3.5 top-3 text-[#7A8294]" />
            </div>
          </div>

          {/* Coordinates & Timezone Details */}
          <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-[#EDE3D4]/50 border border-[#E8DCCB] text-[11px]">
            <div>
              <span className="block text-[#7A8294] text-[9px] uppercase font-bold">Latitude</span>
              <span className="font-bold text-[#09132E]">{latitude}° N</span>
            </div>
            <div>
              <span className="block text-[#7A8294] text-[9px] uppercase font-bold">Longitude</span>
              <span className="font-bold text-[#09132E]">{longitude}° E</span>
            </div>
            <div>
              <span className="block text-[#7A8294] text-[9px] uppercase font-bold">Timezone</span>
              <span className="font-bold text-[#09132E] truncate block">{timezone}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleWipeData}
              className="flex items-center gap-1.5 px-3 py-2 rounded-full text-[11px] font-semibold text-[#E32636] hover:bg-[#E32636]/10 transition-colors"
            >
              <Trash2 size={13} />
              <span>Wipe Data</span>
            </button>

            <button
              type="submit"
              disabled={savedSuccess}
              className="btn-pill-orange !py-2.5 !px-6 text-xs flex items-center gap-1.5"
            >
              {savedSuccess ? (
                <>
                  <Check size={14} />
                  <span>Chart Calculated!</span>
                </>
              ) : (
                <>
                  <Sparkles size={14} />
                  <span>Save & Compute Chart</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
