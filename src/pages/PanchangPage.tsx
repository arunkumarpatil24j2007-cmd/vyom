import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar, Sun, Moon, Clock, Compass, MapPin,
  Sparkles, AlertCircle, CheckCircle2, ChevronRight, Shield
} from 'lucide-react';
import { getActiveProfile } from '@/lib/storage/guestStore';
import { calculatePanchang } from '@/lib/astrology/calculations/panchangCalculator';
import SolarArcPanchang from '@/components/visual/SolarArcPanchang';

const CITIES = [
  { name: 'New Delhi, India', lat: 28.6139, lng: 77.209, tzOffset: 5.5 },
  { name: 'Mumbai, India', lat: 19.076, lng: 72.8777, tzOffset: 5.5 },
  { name: 'Bengaluru, India', lat: 12.9716, lng: 77.5946, tzOffset: 5.5 },
  { name: 'London, UK', lat: 51.5074, lng: -0.1278, tzOffset: 0.0 },
  { name: 'New York, USA', lat: 40.7128, lng: -74.006, tzOffset: -5.0 },
  { name: 'Dubai, UAE', lat: 25.2048, lng: 55.2708, tzOffset: 4.0 },
  { name: 'Singapore', lat: 1.3521, lng: 103.8198, tzOffset: 8.0 },
];

export default function PanchangPage() {
  const userProfile = getActiveProfile();
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [selectedCityName, setSelectedCityName] = useState(
    userProfile?.birthPlace || CITIES[0].name
  );

  const activeCity = useMemo(() => {
    return (
      CITIES.find((c) => c.name === selectedCityName) || {
        name: selectedCityName,
        lat: userProfile?.latitude ?? 28.6139,
        lng: userProfile?.longitude ?? 77.209,
        tzOffset: 5.5,
      }
    );
  }, [selectedCityName, userProfile]);

  const panchang = useMemo(() => {
    const targetDate = new Date(selectedDate);
    // Adjust time to midday for standard daily calendar ephemeris
    targetDate.setHours(12, 0, 0, 0);

    return calculatePanchang({
      date: targetDate,
      latitude: activeCity.lat,
      longitude: activeCity.lng,
      timezoneOffsetHours: activeCity.tzOffset,
    });
  }, [selectedDate, activeCity]);

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in pb-12 max-w-5xl mx-auto">
      {/* ═══ Top Header ═══ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E8DCCB]/60">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#FF4B19] mb-1">
            <Compass size={14} />
            <span>Astronomical Vedic Calendar</span>
          </div>
          <h1
            className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#09132E]"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Daily Panchang & Ephemeris
          </h1>
          <p className="text-xs md:text-sm text-[#4A5468] mt-1">
            Calculated for {activeCity.name} on {panchang.date} ({panchang.weekday}).
          </p>
        </div>

        <Link
          to={`/astrologer?q=${encodeURIComponent(`What are the most auspicious timings and muhurtas for ${selectedDate} in ${activeCity.name}?`)}`}
          className="btn-pill-orange text-xs !py-2.5 !px-4 self-start sm:self-auto"
        >
          <Sparkles size={14} />
          <span>Consult on Muhurat</span>
        </Link>
      </div>

      {/* ═══ Date & Location Filter Bar ═══ */}
      <div className="p-3 rounded-3xl bg-[#FAF2E8] border border-[#E8DCCB] flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Calendar size={15} className="text-[#FF4B19]" />
          <span className="font-bold text-[#09132E]">Date:</span>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-1.5 rounded-full bg-white border border-[#E8DCCB] text-[#09132E] font-semibold text-xs focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2">
          <MapPin size={15} className="text-[#08745B]" />
          <span className="font-bold text-[#09132E]">Location:</span>
          <select
            value={selectedCityName}
            onChange={(e) => setSelectedCityName(e.target.value)}
            className="px-3 py-1.5 rounded-full bg-white border border-[#E8DCCB] text-[#09132E] font-semibold text-xs focus:outline-hidden"
          >
            {CITIES.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ═══ The Five Limbs of Panchang (Pancha-Anga) ═══ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* 1. Tithi */}
        <div className="card-cream p-4 rounded-2xl border border-[#E8DCCB] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-[10px] font-bold uppercase text-[#FF4B19]">
            <span>1. Tithi</span>
            <Moon size={12} />
          </div>
          <h3 className="font-extrabold text-[#09132E] text-sm">{panchang.tithi.name}</h3>
          <p className="text-[11px] text-[#7A8294]">{panchang.tithi.paksha} Paksha</p>
          <div className="w-full bg-[#E8DCCB] h-1.5 rounded-full overflow-hidden mt-2">
            <div
              className="bg-[#FF4B19] h-full rounded-full"
              style={{ width: `${panchang.tithi.progressPercent}%` }}
            />
          </div>
        </div>

        {/* 2. Nakshatra */}
        <div className="card-cream p-4 rounded-2xl border border-[#E8DCCB] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-[10px] font-bold uppercase text-[#08745B]">
            <span>2. Nakshatra</span>
            <Sparkles size={12} />
          </div>
          <h3 className="font-extrabold text-[#09132E] text-sm">{panchang.nakshatra.name}</h3>
          <p className="text-[11px] text-[#7A8294]">
            Pada {panchang.nakshatra.pada} • Lord {panchang.nakshatra.lord}
          </p>
        </div>

        {/* 3. Yoga */}
        <div className="card-cream p-4 rounded-2xl border border-[#E8DCCB] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-[10px] font-bold uppercase text-[#2563EB]">
            <span>3. Yoga</span>
            <Sun size={12} />
          </div>
          <h3 className="font-extrabold text-[#09132E] text-sm">{panchang.yoga.name}</h3>
          <p className="text-[11px] text-[#7A8294]">Yoga #{panchang.yoga.index + 1} of 27</p>
        </div>

        {/* 4. Karana */}
        <div className="card-cream p-4 rounded-2xl border border-[#E8DCCB] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-[10px] font-bold uppercase text-[#F7A928]">
            <span>4. Karana</span>
            <Shield size={12} />
          </div>
          <h3 className="font-extrabold text-[#09132E] text-sm">{panchang.karana.name}</h3>
          <p className="text-[11px] text-[#7A8294]">
            {panchang.karana.isBhadra ? (
              <span className="text-[#E32636] font-bold">Vishti (Bhadra Active)</span>
            ) : (
              'Auspicious Half-Tithi'
            )}
          </p>
        </div>

        {/* 5. Vara (Weekday) */}
        <div className="card-cream p-4 rounded-2xl border border-[#E8DCCB] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-[10px] font-bold uppercase text-[#7779E8]">
            <span>5. Vara</span>
            <Clock size={12} />
          </div>
          <h3 className="font-extrabold text-[#09132E] text-sm">{panchang.weekday}</h3>
          <p className="text-[11px] text-[#7A8294]">Solar Day Cycle</p>
        </div>
      </div>

      {/* ═══ Visual Diurnal Solar Arc & Auspicious Muhurta Ribbon ═══ */}
      <SolarArcPanchang
        sunrise={panchang.solarTimes.sunrise}
        sunset={panchang.solarTimes.sunset}
        rahuKaal={panchang.solarTimes.rahuKaal}
        abhijitMuhurat={panchang.solarTimes.abhijitMuhurat}
        cityName={activeCity.name}
        dateStr={`${panchang.date} (${panchang.weekday})`}
      />

      {/* ═══ Solar & Inauspicious Muhurta Windows ═══ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Solar Timings & Auspicious Periods */}
        <div className="card-cream p-6 rounded-[28px] border border-[#E8DCCB] space-y-4">
          <h3 className="text-sm font-extrabold text-[#09132E] flex items-center gap-2">
            <Sun size={16} className="text-[#FF4B19]" />
            <span>Solar Windows & Abhijit Muhurta</span>
          </h3>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-2xl bg-[#FFF8EF] border border-[#E8DCCB]">
              <span className="text-[10px] text-[#7A8294] block">Sunrise</span>
              <span className="font-extrabold text-[#09132E] text-sm">{panchang.solarTimes.sunrise}</span>
            </div>
            <div className="p-3 rounded-2xl bg-[#FFF8EF] border border-[#E8DCCB]">
              <span className="text-[10px] text-[#7A8294] block">Sunset</span>
              <span className="font-extrabold text-[#09132E] text-sm">{panchang.solarTimes.sunset}</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#08745B]/10 border border-[#08745B]/20 text-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-[#08745B]">Abhijit Muhurta (Vijay Muhurta)</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#08745B] text-white">Highly Auspicious</span>
            </div>
            <p className="text-base font-extrabold text-[#09132E]">{panchang.solarTimes.abhijitMuhurat}</p>
            <p className="text-[11px] text-[#4A5468]">
              Midday solar window traditionally consecrated for launching important ventures and contracts.
            </p>
          </div>
        </div>

        {/* Inauspicious Kaal Windows */}
        <div className="card-cream p-6 rounded-[28px] border border-[#E8DCCB] space-y-4">
          <h3 className="text-sm font-extrabold text-[#09132E] flex items-center gap-2">
            <Shield size={16} className="text-[#E32636]" />
            <span>Inauspicious Kaal Windows (Avoid Starting Major Tasks)</span>
          </h3>

          <div className="space-y-2.5 text-xs">
            <div className="p-3.5 rounded-2xl bg-[#E32636]/10 border border-[#E32636]/20 flex justify-between items-center">
              <div>
                <span className="font-bold text-[#E32636] block">Rahu Kaal</span>
                <span className="text-[11px] text-[#4A5468]">Solar segment governed by Rahu</span>
              </div>
              <span className="font-extrabold text-[#09132E] text-sm">{panchang.solarTimes.rahuKaal}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#FAF2E8] border border-[#E8DCCB] flex justify-between items-center">
              <div>
                <span className="font-bold text-[#09132E] block">Yamaganda Kaal</span>
                <span className="text-[11px] text-[#7A8294]">Governed by Jupiter's son Yamaganda</span>
              </div>
              <span className="font-bold text-[#09132E]">{panchang.solarTimes.yamaganda}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#FAF2E8] border border-[#E8DCCB] flex justify-between items-center">
              <div>
                <span className="font-bold text-[#09132E] block">Gulika Kaal</span>
                <span className="text-[11px] text-[#7A8294]">Governed by Saturn's son Gulika</span>
              </div>
              <span className="font-bold text-[#09132E]">{panchang.solarTimes.gulikaKaal}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
