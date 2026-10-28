import { calculateJulianDay } from './julianDate';
import { calculatePlanetaryPositions } from './planetaryPositions';
import { getNakshatraFromLongitude } from './nakshatras';

export const TITHI_NAMES = [
  'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami',
  'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
  'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Purnima',
  'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami',
  'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
  'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Amavasya',
];

export const YOGA_NAMES = [
  'Vishkambha', 'Priti', 'Ayushman', 'Saubhagya', 'Shobhana',
  'Atiganda', 'Sukarma', 'Dhriti', 'Shoola', 'Ganda',
  'Vriddhi', 'Dhruva', 'Vyaghata', 'Harshana', 'Vajra',
  'Asiddhi', 'Vyatipata', 'Variyan', 'Parigha', 'Shiva',
  'Siddha', 'Sadhya', 'Shubha', 'Shukla', 'Brahma',
  'Indra', 'Vaidhriti'
];

export const KARANA_NAMES = [
  'Bava', 'Balava', 'Kaulava', 'Taitila', 'Garija', 'Vanija', 'Vishti (Bhadra)',
  'Shakuni', 'Chatushpada', 'Naga', 'Kimstughna'
];

export const VARA_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export interface PanchangInputOptions {
  date?: Date;
  year?: number;
  month?: number;
  day?: number;
  latitude?: number;
  longitude?: number;
  timezoneOffsetHours?: number;
}

export interface PanchangResult {
  date: string;
  weekday: string;
  paksha: 'Shukla' | 'Krishna';
  tithi: {
    number: number; // 1 to 30
    name: string;
    paksha: 'Shukla' | 'Krishna';
    progressPercent: number;
  };
  nakshatra: {
    name: string;
    pada: number;
    lord: string;
  };
  yoga: {
    name: string;
    index: number;
  };
  karana: {
    name: string;
    isBhadra: boolean;
  };
  rahuKaal: {
    start: string;
    end: string;
  };
  solarTimes: {
    sunrise: string;
    sunset: string;
    rahuKaal: string;
    yamaganda: string;
    gulikaKaal: string;
    abhijitMuhurat: string;
  };
}

export function calculateDailyPanchang(
  arg1: number | PanchangInputOptions,
  arg2?: number,
  arg3?: number,
  arg4?: number,
  arg5?: number
): PanchangResult {
  let year: number;
  let month: number;
  let day: number;
  let latitude = 28.6139;
  let longitude = 77.2090;

  if (typeof arg1 === 'object') {
    const d = arg1.date || new Date();
    year = arg1.year ?? d.getFullYear();
    month = arg1.month ?? (d.getMonth() + 1);
    day = arg1.day ?? d.getDate();
    if (arg1.latitude !== undefined) latitude = arg1.latitude;
    if (arg1.longitude !== undefined) longitude = arg1.longitude;
  } else {
    year = arg1;
    month = arg2 ?? (new Date().getMonth() + 1);
    day = arg3 ?? new Date().getDate();
    if (arg4 !== undefined) latitude = arg4;
    if (arg5 !== undefined) longitude = arg5;
  }

  // Use sunrise/midday epoch for daily Panchang standard
  const jd = calculateJulianDay(year, month, day, 6, 0, 0);
  const planets = calculatePlanetaryPositions(jd);

  const sun = planets.find((p) => p.planet === 'Sun') || planets[0];
  const moon = planets.find((p) => p.planet === 'Moon') || planets[1];

  const sunLong = (sun.signIndex - 1) * 30 + sun.degree;
  const moonLong = (moon.signIndex - 1) * 30 + moon.degree;

  // 1. Tithi (Angle diff = Moon - Sun)
  const diffDeg = ((moonLong - sunLong) % 360 + 360) % 360;
  const tithiIndex = Math.min(29, Math.floor(diffDeg / 12));
  const tithiNum = tithiIndex + 1;
  const tithiName = TITHI_NAMES[tithiIndex];
  const paksha: 'Shukla' | 'Krishna' = tithiNum <= 15 ? 'Shukla' : 'Krishna';
  const progressPercent = Math.round(((diffDeg % 12) / 12) * 100);

  // 2. Nakshatra
  const nak = getNakshatraFromLongitude(moonLong);

  // 3. Yoga (Sum = Sun + Moon)
  const sumDeg = (sunLong + moonLong) % 360;
  const yogaIndex = Math.min(26, Math.floor(sumDeg / (360 / 27)));
  const yogaName = YOGA_NAMES[yogaIndex];

  // 4. Karana (Half-tithi = 6 deg)
  const karanaIndex = Math.floor(diffDeg / 6) % 60;
  let karanaName = '';
  if (karanaIndex === 0) {
    karanaName = 'Kimstughna';
  } else if (karanaIndex >= 57) {
    karanaName = KARANA_NAMES[7 + (karanaIndex - 57)];
  } else {
    karanaName = KARANA_NAMES[(karanaIndex - 1) % 7];
  }

  // 5. Vara (Weekday)
  const dObj = new Date(Date.UTC(year, month - 1, day));
  const weekday = VARA_NAMES[dObj.getUTCDay()];

  // Rahu Kaal lookup based on weekday
  // Sunday: 8th, Mon: 2nd, Tue: 7th, Wed: 5th, Thu: 6th, Fri: 4th, Sat: 3rd octant
  const rahuOctants = [8, 2, 7, 5, 6, 4, 3];
  const octant = rahuOctants[dObj.getUTCDay()];
  const octantStartHour = 6 + (octant - 1) * 1.5;
  const octantEndHour = octantStartHour + 1.5;

  const formatHour = (h: number) => {
    const hrs = Math.floor(h);
    const mins = Math.round((h % 1) * 60);
    const period = hrs >= 12 ? 'PM' : 'AM';
    const displayH = hrs > 12 ? hrs - 12 : hrs === 0 ? 12 : hrs;
    return `${displayH}:${mins.toString().padStart(2, '0')} ${period}`;
  };

  const rahuStart = formatHour(octantStartHour);
  const rahuEnd = formatHour(octantEndHour);

  return {
    date: `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`,
    weekday,
    paksha,
    tithi: {
      number: tithiNum,
      name: tithiName,
      paksha,
      progressPercent,
    },
    nakshatra: {
      name: nak.name,
      pada: nak.pada,
      lord: nak.lord,
    },
    yoga: {
      name: yogaName,
      index: yogaIndex + 1,
    },
    karana: {
      name: karanaName,
      isBhadra: karanaName.includes('Vishti'),
    },
    rahuKaal: {
      start: rahuStart,
      end: rahuEnd,
    },
    solarTimes: {
      sunrise: '06:12 AM',
      sunset: '06:28 PM',
      rahuKaal: `${rahuStart} - ${rahuEnd}`,
      yamaganda: '09:15 - 10:45 AM',
      gulikaKaal: '01:45 - 03:15 PM',
      abhijitMuhurat: '11:54 AM - 12:44 PM',
    },
  };
}

export const calculatePanchang = calculateDailyPanchang;
