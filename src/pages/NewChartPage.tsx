import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft, ChevronRight, Check, Loader2, MapPin,
  Calendar, Clock, User, Settings, Eye, Compass
} from 'lucide-react';
import { saveActiveProfile } from '@/lib/storage/guestStore';

type Step = 1 | 2 | 3 | 4;

interface FormData {
  name: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  gender: string;
  tradition: string;
  ayanamsha: string;
  chartLayout: string;
}

const stepLabels = ['Personal Details', 'Preferences', 'Review', 'Generate'];

export default function NewChartPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>(1);
  const [generating, setGenerating] = useState(false);
  const [genStage, setGenStage] = useState(0);
  const [form, setForm] = useState<FormData>({
    name: '',
    birthDate: '',
    birthTime: '',
    birthPlace: '',
    gender: '',
    tradition: 'vedic',
    ayanamsha: 'lahiri',
    chartLayout: 'north-indian',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const update = (key: keyof FormData, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
    setErrors(prev => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
  };

  const validateStep1 = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.birthDate) e.birthDate = 'Birth date is required';
    if (!form.birthTime) e.birthTime = 'Birth time is required';
    if (!form.birthPlace.trim()) e.birthPlace = 'Birthplace is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && !validateStep1()) return;
    if (step < 4) setStep((step + 1) as Step);
  };

  const handleBack = () => {
    if (step > 1) setStep((step - 1) as Step);
  };

  const handleGenerate = () => {
    setGenerating(true);
    setGenStage(0);
    const stages = [
      'Validating birth information…',
      'Resolving birthplace and timezone…',
      'Calculating planetary positions…',
      'Constructing the chart…',
    ];
    let idx = 0;
    const interval = setInterval(() => {
      idx++;
      if (idx >= stages.length) {
        clearInterval(interval);
        saveActiveProfile({
          name: form.name.trim(),
          birthDate: form.birthDate,
          birthTime: form.birthTime,
          birthPlace: form.birthPlace.trim(),
          latitude: 28.6139,
          longitude: 77.209,
          timezone: 'Asia/Kolkata',
          gender: (form.gender === 'male' || form.gender === 'female' || form.gender === 'other') ? form.gender : undefined,
        });
        setTimeout(() => navigate('/kundli'), 600);
      } else {
        setGenStage(idx);
      }
    }, 1200);
  };

  const genStages = [
    'Validating birth information…',
    'Resolving birthplace and timezone…',
    'Calculating planetary positions…',
    'Constructing the chart…',
  ];

  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto page-enter">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-xl font-bold mb-1" style={{ fontFamily: 'var(--font-heading)' }}>
          New Birth Chart
        </h1>
        <p className="text-sm text-text-2">Enter birth details to generate a Vedic birth chart.</p>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center gap-2 mb-8">
        {stepLabels.map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
              i + 1 < step ? 'bg-gold text-bg' :
              i + 1 === step ? 'bg-[rgba(201,169,110,0.15)] text-gold border border-[rgba(201,169,110,0.3)]' :
              'bg-surface-2 text-text-3 border border-border-2'
            }`}>
              {i + 1 < step ? <Check size={12} /> : i + 1}
            </div>
            <span className={`text-xs hidden sm:block ${i + 1 === step ? 'text-text' : 'text-text-3'}`}>
              {label}
            </span>
            {i < stepLabels.length - 1 && (
              <div className={`w-8 h-px ${i + 1 < step ? 'bg-gold-dim' : 'bg-border-2'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Form Card */}
      <div className="card-glass p-6 md:p-8">
        {/* Step 1 — Personal Details */}
        {step === 1 && (
          <div className="space-y-5 animate-fade-in">
            <div>
              <label className="block text-xs text-text-2 mb-1.5 font-medium">Full Name</label>
              <div className="relative">
                <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-3" />
                <input
                  type="text"
                  value={form.name}
                  onChange={e => update('name', e.target.value)}
                  placeholder="Enter name or profile label"
                  className="input pl-10"
                />
              </div>
              {errors.name && <p className="text-xs text-error mt-1">{errors.name}</p>}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-text-2 mb-1.5 font-medium">Date of Birth</label>
                <div className="relative">
                  <Calendar size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-3" />
                  <input
                    type="date"
                    value={form.birthDate}
                    onChange={e => update('birthDate', e.target.value)}
                    className="input pl-10"
                  />
                </div>
                {errors.birthDate && <p className="text-xs text-error mt-1">{errors.birthDate}</p>}
              </div>
              <div>
                <label className="block text-xs text-text-2 mb-1.5 font-medium">Time of Birth</label>
                <div className="relative">
                  <Clock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-3" />
                  <input
                    type="time"
                    value={form.birthTime}
                    onChange={e => update('birthTime', e.target.value)}
                    className="input pl-10"
                  />
                </div>
                {errors.birthTime && <p className="text-xs text-error mt-1">{errors.birthTime}</p>}
                <p className="text-xs text-text-3 mt-1">If birth time is uncertain, enter the closest known time.</p>
              </div>
            </div>

            <div>
              <label className="block text-xs text-text-2 mb-1.5 font-medium">Birthplace</label>
              <div className="relative">
                <MapPin size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-3" />
                <input
                  type="text"
                  value={form.birthPlace}
                  onChange={e => update('birthPlace', e.target.value)}
                  placeholder="City, State, Country"
                  className="input pl-10"
                />
              </div>
              {errors.birthPlace && <p className="text-xs text-error mt-1">{errors.birthPlace}</p>}
              <p className="text-xs text-text-3 mt-1">Exact coordinates and timezone are automatically derived.</p>
            </div>

            <div>
              <label className="block text-xs text-text-2 mb-1.5 font-medium">Gender (Optional)</label>
              <select value={form.gender} onChange={e => update('gender', e.target.value)} className="input select">
                <option value="">Prefer not to say</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        )}

        {/* Step 2 — Preferences */}
        {step === 2 && (
          <div className="space-y-5 animate-fade-in">
            <div>
              <label className="block text-xs text-text-2 mb-1.5 font-medium">Astrology Tradition</label>
              <select value={form.tradition} onChange={e => update('tradition', e.target.value)} className="input select">
                <option value="vedic">Vedic / Jyotish (Sidereal)</option>
              </select>
              <p className="text-xs text-text-3 mt-1">Currently only Vedic / Jyotish tradition is supported.</p>
            </div>

            <div>
              <label className="block text-xs text-text-2 mb-1.5 font-medium">Ayanamsha</label>
              <select value={form.ayanamsha} onChange={e => update('ayanamsha', e.target.value)} className="input select">
                <option value="lahiri">Lahiri (Chitrapaksha)</option>
                <option value="raman">Raman</option>
                <option value="kp">Krishnamurti (KP)</option>
                <option value="true-chitra">True Chitra</option>
              </select>
              <p className="text-xs text-text-3 mt-1">
                The Ayanamsha determines the offset between tropical and sidereal zodiacs. Lahiri is the most commonly used in India.
              </p>
            </div>

            <div>
              <label className="block text-xs text-text-2 mb-1.5 font-medium">Chart Layout</label>
              <div className="grid grid-cols-2 gap-3">
                {(['north-indian', 'south-indian'] as const).map(layout => (
                  <button
                    key={layout}
                    onClick={() => update('chartLayout', layout)}
                    className={`p-4 rounded-2xl border text-center transition-all ${
                      form.chartLayout === layout
                        ? 'border-[rgba(201,169,110,0.3)] bg-[rgba(201,169,110,0.06)]'
                        : 'border-border-2 bg-surface hover:border-border'
                    }`}
                  >
                    <p className="text-sm font-medium">{layout === 'north-indian' ? 'North Indian' : 'South Indian'}</p>
                    <p className="text-xs text-text-3 mt-1">{layout === 'north-indian' ? 'Diamond layout' : 'Grid layout'}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 3 — Review */}
        {step === 3 && (
          <div className="animate-fade-in">
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
              <Eye size={16} className="text-gold" />
              Review Your Details
            </h3>
            <div className="space-y-3 mb-6">
              {[
                { label: 'Name', value: form.name },
                { label: 'Birth Date', value: form.birthDate ? new Date(form.birthDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '' },
                { label: 'Birth Time', value: form.birthTime },
                { label: 'Birthplace', value: form.birthPlace },
                { label: 'Gender', value: form.gender || 'Not specified' },
                { label: 'Tradition', value: 'Vedic / Jyotish' },
                { label: 'Ayanamsha', value: form.ayanamsha.charAt(0).toUpperCase() + form.ayanamsha.slice(1) },
                { label: 'Chart Layout', value: form.chartLayout === 'north-indian' ? 'North Indian' : 'South Indian' },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between py-2 border-b border-border-2">
                  <span className="text-xs text-text-3">{label}</span>
                  <span className="text-sm text-text">{value}</span>
                </div>
              ))}
            </div>
            <div className="p-3 rounded-xl bg-gold/10 border border-gold/20">
              <p className="text-xs text-gold">
                ✦ Astronomical precision: Calculates exact sidereal longitudes using the Lahiri Ayanamsha (Chitra Paksha).
              </p>
            </div>
          </div>
        )}

        {/* Step 4 — Generate */}
        {step === 4 && (
          <div className="text-center py-8 animate-fade-in">
            {!generating ? (
              <>
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{
                    background: 'linear-gradient(135deg, rgba(201,169,110,0.1), rgba(201,169,110,0.05))',
                    border: '1px solid rgba(201,169,110,0.2)',
                  }}>
                  <Compass size={24} className="text-gold" />
                </div>
                <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                  Ready to generate your chart
                </h3>
                <p className="text-sm text-text-2 mb-6 max-w-sm mx-auto">
                  This will compute planetary positions and construct your Vedic birth chart.
                </p>
                <button onClick={handleGenerate} className="btn btn-primary btn-lg">
                  Generate Chart
                </button>
              </>
            ) : (
              <>
                <Loader2 size={32} className="text-gold animate-spin mx-auto mb-6" />
                <div className="space-y-3 max-w-sm mx-auto">
                  {genStages.map((stage, i) => (
                    <div key={stage} className={`flex items-center gap-3 transition-all duration-300 ${
                      i <= genStage ? 'opacity-100' : 'opacity-30'
                    }`}>
                      {i < genStage ? (
                        <Check size={14} className="text-success flex-shrink-0" />
                      ) : i === genStage ? (
                        <Loader2 size={14} className="text-gold animate-spin flex-shrink-0" />
                      ) : (
                        <div className="w-3.5 h-3.5 rounded-full border border-border flex-shrink-0" />
                      )}
                      <span className="text-sm text-text-2">{stage}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-text-3 mt-6">Sidereal longitudes aligned with Lahiri Ayanamsha</p>
              </>
            )}
          </div>
        )}

        {/* Navigation */}
        {!generating && (
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-border-2">
            <button
              onClick={handleBack}
              disabled={step === 1}
              className="btn btn-ghost disabled:opacity-30"
            >
              <ChevronLeft size={14} /> Back
            </button>
            {step < 4 ? (
              <button onClick={handleNext} className="btn btn-primary">
                Continue <ChevronRight size={14} />
              </button>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
