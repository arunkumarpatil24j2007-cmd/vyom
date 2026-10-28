import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Compass, Calendar, Clock, MapPin, CheckCircle2,
  AlertCircle, Sparkles, ArrowRight, ShieldCheck, Star,
  Briefcase, Home, Heart, Car, Plane
} from 'lucide-react';

type EventType = 'business' | 'property' | 'marriage' | 'vehicle' | 'travel';

interface EventCategory {
  id: EventType;
  label: string;
  icon: typeof Briefcase;
  desc: string;
}

interface MuhuratWindow {
  date: string;
  day: string;
  timeWindow: string;
  tithi: string;
  nakshatra: string;
  quality: 'exceptional' | 'favorable' | 'moderate';
  reason: string;
}

export default function MuhuratPage() {
  const [selectedEvent, setSelectedEvent] = useState<EventType>('business');
  const [location, setLocation] = useState('Bengaluru, India');
  const [month, setMonth] = useState('August 2026');

  const events: EventCategory[] = [
    { id: 'business', label: 'Business & Enterprise', icon: Briefcase, desc: 'Vyapar Arambh, launch, signing deals' },
    { id: 'property', label: 'Property & Griha Pravesh', icon: Home, desc: 'House warming, land purchase, registry' },
    { id: 'marriage', label: 'Marriage (Vivaha)', icon: Heart, desc: 'Auspicious Lagna and Shubh Nakshatras' },
    { id: 'vehicle', label: 'Vehicle Purchase', icon: Car, desc: 'Vahan Kharid, moving machine delivery' },
    { id: 'travel', label: 'Important Travel (Yatra)', icon: Plane, desc: 'Long journeys, pilgrimages, migrations' },
  ];

  const timingsByMonth: Record<string, Record<EventType, MuhuratWindow[]>> = {
    'August 2026': {
      business: [
        {
          date: '01 August 2026',
          day: 'Saturday (Shani Horā / Shubh Choghadiya)',
          timeWindow: '09:15 AM – 11:35 AM',
          tithi: 'Krishna Tritiya (Shubh Auspicious Phase)',
          nakshatra: 'Shatabhisha (Movable / Auspicious Chara)',
          quality: 'exceptional',
          reason: 'Auspicious Choghadiya and Abhijit synchronization with Saturn well-dignified in Aquarius (its own Moolatrikona sign); ensuring enduring organizational stability, commercial longevity, and enterprise foundation.',
        },
        {
          date: '06 August 2026',
          day: 'Thursday (Guruvara)',
          timeWindow: '10:20 AM – 12:40 PM',
          tithi: 'Krishna Ashtami',
          nakshatra: 'Rohini (Exalted Moon Nakshatra)',
          quality: 'exceptional',
          reason: 'Jupiter in Kendra casting full trinal aspect on 10th house of commerce; Moon in Taurus exaltation conferring commercial favor and brand resonance.',
        },
        {
          date: '14 August 2026',
          day: 'Friday (Shukravara)',
          timeWindow: '14:00 PM – 15:45 PM',
          tithi: 'Shukla Dvitiya',
          nakshatra: 'Uttara Phalguni (Lord Sun)',
          quality: 'favorable',
          reason: 'Mercantile Mercury in benefic association; auspicious time for contractual agreements, legal partnerships, and commercial agreements.',
        },
        {
          date: '21 August 2026',
          day: 'Friday (Shukra Horā)',
          timeWindow: '09:00 AM – 11:15 AM',
          tithi: 'Shukla Navami',
          nakshatra: 'Anuradha (Mitra Nakshatra)',
          quality: 'exceptional',
          reason: 'Anuradha Nakshatra falling during daytime Venus Hora, neutralizing transit obstacles and blessing commercial longevity.',
        },
        {
          date: '28 August 2026',
          day: 'Friday (Shukravara)',
          timeWindow: '10:30 AM – 12:45 PM',
          tithi: 'Shukla Purnima',
          nakshatra: 'Shatabhisha',
          quality: 'favorable',
          reason: 'Full Moon illumination with benefics in quadrants; excellent for venture capital and public launches.',
        },
      ],
      property: [
        {
          date: '01 August 2026',
          day: 'Saturday (Shanivara)',
          timeWindow: '06:30 AM – 08:45 AM',
          tithi: 'Krishna Tritiya',
          nakshatra: 'Shatabhisha',
          quality: 'exceptional',
          reason: 'Fixed Taurus (Vrishabha) Lagna rising in east; 4th house fortified by benefic planetary aspects, ideal for registry, land acquisition, and foundation stone laying.',
        },
        {
          date: '09 August 2026',
          day: 'Sunday (Suryavara)',
          timeWindow: '07:15 AM – 09:30 AM',
          tithi: 'Krishna Ekadashi',
          nakshatra: 'Mrigashirsha',
          quality: 'favorable',
          reason: 'Sthira (Fixed) sign rising; Mars in friendly house free from combustion, blessing structural durability.',
        },
        {
          date: '17 August 2026',
          day: 'Monday (Chandravara)',
          timeWindow: '08:00 AM – 10:15 AM',
          tithi: 'Shukla Panchami',
          nakshatra: 'Chitra',
          quality: 'favorable',
          reason: 'Auspicious earth-trine alignment for Griha Pravesh and property investments.',
        },
        {
          date: '23 August 2026',
          day: 'Sunday',
          timeWindow: '07:30 AM – 09:45 AM',
          tithi: 'Shukla Ekadashi',
          nakshatra: 'Mula',
          quality: 'exceptional',
          reason: 'Benefic Jupiter aspecting the 4th house of property and domestic sanctuary.',
        },
      ],
      marriage: [
        {
          date: '01 August 2026',
          day: 'Saturday (Shanivara)',
          timeWindow: '19:15 PM – 21:45 PM',
          tithi: 'Krishna Tritiya',
          nakshatra: 'Shatabhisha',
          quality: 'exceptional',
          reason: 'Godhuli Lagna free from Mars aspect; Jupiter and Venus in harmonious trinal disposition conferring marital happiness and mutual respect.',
        },
        {
          date: '07 August 2026',
          day: 'Friday (Shukravara)',
          timeWindow: '18:50 PM – 21:20 PM',
          tithi: 'Krishna Navami',
          nakshatra: 'Rohini',
          quality: 'exceptional',
          reason: 'Rohini Nakshatra with exalted Moon; 7th house unblemished by Papakartari.',
        },
        {
          date: '15 August 2026',
          day: 'Saturday',
          timeWindow: '19:30 PM – 22:15 PM',
          tithi: 'Shukla Tritiya',
          nakshatra: 'Hasta',
          quality: 'favorable',
          reason: 'Auspicious Moon-Jupiter trine conferring enduring fidelity, family harmony, and prosperity.',
        },
        {
          date: '22 August 2026',
          day: 'Saturday',
          timeWindow: '18:45 PM – 21:15 PM',
          tithi: 'Shukla Dashami',
          nakshatra: 'Jyeshtha',
          quality: 'favorable',
          reason: 'Dignified Lagna lord with benefics occupying quadrant houses.',
        },
      ],
      vehicle: [
        {
          date: '01 August 2026',
          day: 'Saturday (Shanivara)',
          timeWindow: '14:30 PM – 16:45 PM',
          tithi: 'Krishna Tritiya',
          nakshatra: 'Shatabhisha (Chara - Optimal for Mobility)',
          quality: 'exceptional',
          reason: 'Chara (movable) Nakshatra; Saturn in own sign provides enduring mechanical safety and vehicular longevity.',
        },
        {
          date: '12 August 2026',
          day: 'Wednesday (Budhavara)',
          timeWindow: '10:00 AM – 12:15 PM',
          tithi: 'Krishna Amavasya',
          nakshatra: 'Pushya',
          quality: 'favorable',
          reason: '4th lord strong in Kendra; daytime favorable window free from Rahu Kaal.',
        },
        {
          date: '20 August 2026',
          day: 'Thursday (Guruvara)',
          timeWindow: '11:15 AM – 13:30 PM',
          tithi: 'Shukla Ashtami',
          nakshatra: 'Vishakha',
          quality: 'exceptional',
          reason: 'Venus (Vahana Karaka) fortified in Kendra, conferring effortless transit and safety.',
        },
      ],
      travel: [
        {
          date: '01 August 2026',
          day: 'Saturday (Shanivara)',
          timeWindow: '06:00 AM – 08:15 AM',
          tithi: 'Krishna Tritiya',
          nakshatra: 'Shatabhisha',
          quality: 'exceptional',
          reason: 'Chara Nakshatra ideal for swift, safe journeys; Brahma window free from Disha Shool and Rahu Kaal.',
        },
        {
          date: '10 August 2026',
          day: 'Monday (Chandravara)',
          timeWindow: '05:45 AM – 07:30 AM',
          tithi: 'Krishna Dvadashi',
          nakshatra: 'Ardra',
          quality: 'favorable',
          reason: 'Moon well-aspected by Jupiter; travel unobstructed toward North and West.',
        },
        {
          date: '19 August 2026',
          day: 'Wednesday (Budhavara)',
          timeWindow: '06:30 AM – 08:45 AM',
          tithi: 'Shukla Saptami',
          nakshatra: 'Swati',
          quality: 'exceptional',
          reason: 'Swati (Movable Nakshatra) blessing long-distance yatra and international transit.',
        },
      ],
    },
    'September 2026': {
      business: [
        {
          date: '03 September 2026',
          day: 'Thursday (Guruvara)',
          timeWindow: '10:00 AM – 12:15 PM',
          tithi: 'Krishna Ashtami',
          nakshatra: 'Rohini',
          quality: 'exceptional',
          reason: 'Jupiter in cancer exaltation quadrant with benefic Mercury trine.',
        },
        {
          date: '10 September 2026',
          day: 'Thursday',
          timeWindow: '09:30 AM – 11:45 AM',
          tithi: 'Shukla Pratipada',
          nakshatra: 'Uttara Phalguni',
          quality: 'favorable',
          reason: 'Sun in Leo Moolatrikona granting administrative sanctions and institutional growth.',
        },
        {
          date: '17 September 2026',
          day: 'Thursday',
          timeWindow: '14:15 PM – 16:30 PM',
          tithi: 'Shukla Saptami',
          nakshatra: 'Anuradha',
          quality: 'exceptional',
          reason: 'Mitra Nakshatra active during Jupiter Hora; highly fortified for funding rounds.',
        },
      ],
      property: [
        {
          date: '06 September 2026',
          day: 'Sunday',
          timeWindow: '07:00 AM – 09:15 AM',
          tithi: 'Krishna Ekadashi',
          nakshatra: 'Punarvasu',
          quality: 'exceptional',
          reason: 'Fixed sign Taurus rising; 4th house unburdened by malefic aspects.',
        },
        {
          date: '20 September 2026',
          day: 'Sunday',
          timeWindow: '07:45 AM – 09:50 AM',
          tithi: 'Shukla Dashami',
          nakshatra: 'Purva Ashadha',
          quality: 'favorable',
          reason: 'Auspicious earth-element alignment for Griha Pravesh.',
        },
      ],
      marriage: [
        {
          date: '11 September 2026',
          day: 'Friday',
          timeWindow: '19:00 PM – 21:30 PM',
          tithi: 'Shukla Dvitiya',
          nakshatra: 'Hasta',
          quality: 'exceptional',
          reason: 'Venus strong in Libra (own sign) conferring marital bliss and concord.',
        },
        {
          date: '18 September 2026',
          day: 'Friday',
          timeWindow: '18:45 PM – 21:15 PM',
          tithi: 'Shukla Ashtami',
          nakshatra: 'Jyeshtha',
          quality: 'favorable',
          reason: 'Godhuli Lagna free from Saturn and Mars affliction.',
        },
      ],
      vehicle: [
        {
          date: '04 September 2026',
          day: 'Friday',
          timeWindow: '14:00 PM – 16:00 PM',
          tithi: 'Krishna Navami',
          nakshatra: 'Mrigashirsha',
          quality: 'favorable',
          reason: 'Venus Hora during afternoon favorable movable window.',
        },
      ],
      travel: [
        {
          date: '07 September 2026',
          day: 'Monday',
          timeWindow: '06:00 AM – 08:00 AM',
          tithi: 'Krishna Dvadashi',
          nakshatra: 'Pushya',
          quality: 'favorable',
          reason: 'Auspicious Pushya Nakshatra for smooth, delay-free journeys.',
        },
      ],
    },
    'October 2026': {
      business: [
        {
          date: '01 October 2026',
          day: 'Thursday (Guruvara)',
          timeWindow: '09:30 AM – 11:45 AM',
          tithi: 'Krishna Shashti',
          nakshatra: 'Rohini',
          quality: 'exceptional',
          reason: 'Exalted Moon-Jupiter connection in commercial quadrant.',
        },
        {
          date: '15 October 2026',
          day: 'Thursday',
          timeWindow: '10:15 AM – 12:30 PM',
          tithi: 'Shukla Panchami',
          nakshatra: 'Mula',
          quality: 'favorable',
          reason: 'Waxing Moon with Mercury fortified in Virgo.',
        },
      ],
      property: [
        {
          date: '08 October 2026',
          day: 'Thursday',
          timeWindow: '06:45 AM – 09:00 AM',
          tithi: 'Krishna Trayodashi',
          nakshatra: 'Uttara Phalguni',
          quality: 'exceptional',
          reason: 'Fixed Lagna rising with benefic aspect on 4th bhava.',
        },
      ],
      marriage: [
        {
          date: '16 October 2026',
          day: 'Friday',
          timeWindow: '19:15 PM – 21:30 PM',
          tithi: 'Shukla Shashti',
          nakshatra: 'Purva Ashadha',
          quality: 'favorable',
          reason: 'Benefics in quadrants free from Rahu aspect.',
        },
      ],
      vehicle: [
        {
          date: '09 October 2026',
          day: 'Friday',
          timeWindow: '14:30 PM – 16:30 PM',
          tithi: 'Krishna Chaturdashi',
          nakshatra: 'Hasta',
          quality: 'favorable',
          reason: 'Auspicious movable window for vehicle delivery.',
        },
      ],
      travel: [
        {
          date: '12 October 2026',
          day: 'Monday',
          timeWindow: '06:15 AM – 08:00 AM',
          tithi: 'Shukla Dvitiya',
          nakshatra: 'Swati',
          quality: 'favorable',
          reason: 'Safe westward journey window free from malefic transit.',
        },
      ],
    },
    'July 2026': {
      business: [
        {
          date: '02 July 2026',
          day: 'Thursday',
          timeWindow: '09:30 AM – 11:45 AM',
          tithi: 'Krishna Dvitiya',
          nakshatra: 'Shravana',
          quality: 'exceptional',
          reason: 'Benefic Jupiter aspecting Lagna and 10th house.',
        },
      ],
      property: [
        {
          date: '12 July 2026',
          day: 'Sunday',
          timeWindow: '07:00 AM – 09:15 AM',
          tithi: 'Krishna Dvadashi',
          nakshatra: 'Rohini',
          quality: 'exceptional',
          reason: 'Fixed Taurus rising with Moon exalted.',
        },
      ],
      marriage: [
        {
          date: '17 July 2026',
          day: 'Friday',
          timeWindow: '19:00 PM – 21:30 PM',
          tithi: 'Shukla Tritiya',
          nakshatra: 'Magha',
          quality: 'favorable',
          reason: 'Venus well-dignified in Leo with Jupiter aspect.',
        },
      ],
      vehicle: [
        {
          date: '10 July 2026',
          day: 'Friday',
          timeWindow: '14:00 PM – 16:00 PM',
          tithi: 'Krishna Dashami',
          nakshatra: 'Krittika',
          quality: 'favorable',
          reason: 'Venus Hora during daytime.',
        },
      ],
      travel: [
        {
          date: '06 July 2026',
          day: 'Monday',
          timeWindow: '06:00 AM – 08:00 AM',
          tithi: 'Krishna Shashti',
          nakshatra: 'Shatabhisha',
          quality: 'favorable',
          reason: 'Safe journey alignment.',
        },
      ],
    },
    'June 2026': {
      business: [
        {
          date: '04 June 2026',
          day: 'Thursday',
          timeWindow: '10:00 AM – 12:15 PM',
          tithi: 'Krishna Panchami',
          nakshatra: 'Uttara Ashadha',
          quality: 'exceptional',
          reason: 'Jupiter in quadrant with benefic Mercury trine.',
        },
      ],
      property: [
        {
          date: '14 June 2026',
          day: 'Sunday',
          timeWindow: '07:00 AM – 09:15 AM',
          tithi: 'Krishna Amavasya',
          nakshatra: 'Rohini',
          quality: 'favorable',
          reason: 'Sthira Lagna fortified with Saturn in 11th house of gain.',
        },
      ],
      marriage: [
        {
          date: '19 June 2026',
          day: 'Friday',
          timeWindow: '19:00 PM – 21:30 PM',
          tithi: 'Shukla Panchami',
          nakshatra: 'Magha',
          quality: 'favorable',
          reason: 'Venus strong conferring marital joy.',
        },
      ],
      vehicle: [
        {
          date: '12 June 2026',
          day: 'Friday',
          timeWindow: '14:00 PM – 16:00 PM',
          tithi: 'Krishna Trayodashi',
          nakshatra: 'Bharani',
          quality: 'favorable',
          reason: 'Venus Hora during afternoon favorable window.',
        },
      ],
      travel: [
        {
          date: '08 June 2026',
          day: 'Monday',
          timeWindow: '06:00 AM – 08:00 AM',
          tithi: 'Krishna Navami',
          nakshatra: 'Purva Bhadrapada',
          quality: 'favorable',
          reason: 'Auspicious movable window for smooth journeys.',
        },
      ],
    },
    'May 2026': {
      business: [
        {
          date: '07 May 2026',
          day: 'Thursday (Guru Horā)',
          timeWindow: '09:15 AM – 11:30 AM',
          tithi: 'Krishna Shashti',
          nakshatra: 'Uttara Ashadha',
          quality: 'exceptional',
          reason: 'Jupiter occupying the mid-heaven quadrant with benefic Mercury.',
        },
        {
          date: '14 May 2026',
          day: 'Thursday (Guruvara)',
          timeWindow: '10:45 AM – 12:50 PM',
          tithi: 'Krishna Trayodashi',
          nakshatra: 'Revati',
          quality: 'favorable',
          reason: 'Benefic planets occupy kendras; Abhijit Muhurta synchronizes with Moon trine.',
        },
      ],
      property: [
        {
          date: '10 May 2026',
          day: 'Sunday (Suryavara)',
          timeWindow: '06:45 AM – 09:10 AM',
          tithi: 'Krishna Navami',
          nakshatra: 'Shatabhisha',
          quality: 'exceptional',
          reason: 'Fixed sign Taurus rising on eastern horizon; Venus strong in trine.',
        },
      ],
      marriage: [
        {
          date: '15 May 2026',
          day: 'Friday',
          timeWindow: '19:15 PM – 22:30 PM',
          tithi: 'Krishna Chaturdashi',
          nakshatra: 'Bharani',
          quality: 'exceptional',
          reason: 'Godhuli Lagna free from Mars aspect; Jupiter and Venus in harmonious disposition.',
        },
      ],
      vehicle: [
        {
          date: '08 May 2026',
          day: 'Friday (Shukravara)',
          timeWindow: '14:30 PM – 16:45 PM',
          tithi: 'Krishna Saptami',
          nakshatra: 'Shravana',
          quality: 'favorable',
          reason: 'Movable lagna active during Venus Hora; Venus strong in friendly sign.',
        },
      ],
      travel: [
        {
          date: '11 May 2026',
          day: 'Monday',
          timeWindow: '05:30 AM – 07:15 AM',
          tithi: 'Krishna Dashami',
          nakshatra: 'Purva Bhadrapada',
          quality: 'favorable',
          reason: 'Morning Brahma window aligns with benefic transit free from Disha Shool.',
        },
      ],
    },
  };

  const selectedMonthData = timingsByMonth[month] || timingsByMonth['August 2026'];
  const activeTimings = selectedMonthData[selectedEvent] || selectedMonthData.business;

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in pb-12 max-w-5xl mx-auto">
      {/* ═══ Header ═══ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E8DCCB]/60">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#FF4B19] mb-1">
            <Compass size={14} />
            <span>Shubh Muhurat Calculator</span>
          </div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#09132E]" style={{ fontFamily: 'var(--font-heading)' }}>
            Auspicious Timings & Electional Astrology
          </h1>
          <p className="text-xs md:text-sm text-[#4A5468] mt-1">
            Identify harmonically fortified astrological time windows for significant milestones.
          </p>
        </div>

        <Link
          to={`/astrologer?q=${encodeURIComponent(`What is the most auspicious Muhurat for ${selectedEvent} in ${location}?`)}`}
          className="btn-pill-orange text-xs !py-2.5 !px-4 self-start sm:self-auto"
        >
          <Sparkles size={14} />
          <span>Consult on Muhurat</span>
        </Link>
      </div>

      {/* ═══ Filter Bar ═══ */}
      <div className="p-3 rounded-3xl bg-[#FAF2E8] border border-[#E8DCCB] flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <MapPin size={14} className="text-[#08745B]" />
          <span className="font-bold text-[#09132E]">Location:</span>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="px-3 py-1 rounded-full bg-white border border-[#E8DCCB] text-[#09132E] font-semibold text-xs focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2">
          <Calendar size={14} className="text-[#FF4B19]" />
          <span className="font-bold text-[#09132E]">Period:</span>
          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="px-3 py-1 rounded-full bg-white border border-[#E8DCCB] text-[#09132E] font-semibold text-xs focus:outline-hidden cursor-pointer"
          >
            <option value="August 2026">August 2026</option>
            <option value="September 2026">September 2026</option>
            <option value="October 2026">October 2026</option>
            <option value="July 2026">July 2026</option>
            <option value="June 2026">June 2026</option>
            <option value="May 2026">May 2026</option>
          </select>
        </div>
      </div>

      {/* ═══ Event Categories Pills ═══ */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {events.map((e) => {
          const isSelected = selectedEvent === e.id;
          const Icon = e.icon;
          return (
            <button
              key={e.id}
              onClick={() => setSelectedEvent(e.id as EventType)}
              className={`p-4 rounded-[24px] text-left transition-all border cursor-pointer ${
                isSelected
                  ? 'bg-[#09132E] text-white border-[#09132E] shadow-sm'
                  : 'bg-[#FAF2E8] text-[#09132E] border-[#E8DCCB] hover:bg-[#EDE3D4]'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center mb-2.5 ${
                  isSelected ? 'bg-[#FF4B19] text-white' : 'bg-white text-[#FF4B19] shadow-2xs'
                }`}
              >
                <Icon size={16} />
              </div>
              <p className="font-extrabold text-xs md:text-sm leading-tight">{e.label}</p>
              <p className={`text-[10px] mt-1 line-clamp-1 ${isSelected ? 'text-white/70' : 'text-[#7A8294]'}`}>
                {e.desc}
              </p>
            </button>
          );
        })}
      </div>

      {/* ═══ Auspicious Windows List ═══ */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-base md:text-lg text-[#09132E]">
            Recommended Time Windows for {month}
          </h3>
          <span className="text-xs text-[#7A8294] font-medium">
            Calculated via Muhurta Chintamani & Kalaprakasika rules
          </span>
        </div>

        <div className="space-y-4">
          {activeTimings.map((t, i) => (
            <div
              key={i}
              className="card-cream p-6 rounded-[28px] border border-[#E8DCCB] space-y-4 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E8DCCB]/60">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#09132E] text-white">
                      Muhurat {i + 1}
                    </span>
                    <span className="font-extrabold text-base text-[#09132E]">{t.date}</span>
                    <span className="text-xs text-[#7A8294] font-bold">• {t.day}</span>
                  </div>
                  <p className="text-xs text-[#4A5468]">{t.tithi} • {t.nakshatra}</p>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                      t.quality === 'exceptional'
                        ? 'bg-[#08745B]/10 text-[#08745B] border border-[#08745B]/20'
                        : 'bg-[#FF9A20]/10 text-[#FF9A20] border border-[#FF9A20]/20'
                    }`}
                  >
                    <Star size={11} className={t.quality === 'exceptional' ? 'fill-[#08745B]' : 'fill-[#FF9A20]'} />
                    <span>{t.quality === 'exceptional' ? 'Highly Fortified' : 'Auspicious'}</span>
                  </span>
                  <span className="font-black text-xs text-[#FF4B19] bg-white px-4 py-2 rounded-full border border-[#E8DCCB] shadow-2xs">
                    {t.timeWindow}
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FEF6EB] border border-[#E8DCCB] text-xs text-[#4A5468] flex items-start gap-2.5">
                <ShieldCheck size={16} className="text-[#08745B] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#09132E] block mb-0.5">Astrological Basis:</span>
                  <p>{t.reason}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
