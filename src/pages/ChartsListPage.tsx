import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BarChart3, Plus, Search, Filter, Calendar, MapPin,
  Clock, ArrowRight, Trash2, Copy, Sparkles, ChevronRight,
  Compass, Eye, User
} from 'lucide-react';
import NorthIndianChart from '@/components/charts/NorthIndianChart';
import { demoProfiles, demoChart } from '@/data/demo';

export default function ChartsListPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('all');

  const charts: Array<{
    id: string;
    profile: any;
    chartData: any;
    tags: string[];
    notes: string;
    lastViewed: string;
  }> = [
    {
      id: 'chart-1',
      profile: demoProfiles[0],
      chartData: demoChart,
      tags: ['Natal', 'Career', 'Primary'],
      notes: 'Strong 10th house Rahu, Jupiter exalted in 12th.',
      lastViewed: 'Today, 2:30 PM',
    },
    {
      id: 'chart-2',
      profile: demoProfiles[1],
      chartData: {
        ...demoChart,
        id: 'chart-2',
        ascendant: { sign: 'Taurus', signIndex: 2, degree: 8.12, nakshatra: 'Krittika', pada: 4 },
        moonSign: 'Scorpio',
        moonNakshatra: 'Anuradha',
      },
      tags: ['Natal', 'Compatibility'],
      notes: 'Moon debilitated in 7th house, Venus in Pisces exalted.',
      lastViewed: 'Yesterday',
    },
    {
      id: 'chart-3',
      profile: {
        id: 'profile-3',
        name: 'Vedic Enterprise Launch',
        birthDate: '2023-11-27',
        birthTime: '11:15',
        birthPlace: 'Mumbai, India',
        latitude: 19.0760,
        longitude: 72.8777,
        timezone: 'Asia/Kolkata',
        gender: 'other',
        createdAt: '2023-11-27T11:15:00Z',
        updatedAt: '2023-11-27T11:15:00Z',
      },
      chartData: {
        ...demoChart,
        id: 'chart-3',
        ascendant: { sign: 'Capricorn', signIndex: 10, degree: 21.45, nakshatra: 'Shravana', pada: 2 },
        moonSign: 'Taurus',
        moonNakshatra: 'Rohini',
      },
      tags: ['Muhurta', 'Business'],
      notes: 'Auspicious muhurta chart with exalted Moon in Rohini.',
      lastViewed: '3 days ago',
    },
  ];

  const filteredCharts = charts.filter(c => {
    const matchesSearch = c.profile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.profile.birthPlace.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.notes.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = selectedTag === 'all' || c.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-gold uppercase mb-1">
            <Compass size={14} />
            <span>Kundli Archive</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-text" style={{ fontFamily: 'var(--font-heading)' }}>
            Calculated Charts
          </h1>
          <p className="text-sm text-text-3 mt-1">
            Manage your personal horoscopes, consultation records, and muhurta charts
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/app/compatibility"
            className="btn btn-secondary text-xs sm:text-sm"
          >
            Matchmaking
          </Link>
          <Link
            to="/app/new-chart"
            className="btn btn-primary text-xs sm:text-sm"
          >
            <Plus size={16} />
            <span>New Chart</span>
          </Link>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="glass-card p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-3" />
          <input
            type="text"
            placeholder="Search by name, place, notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-10 py-2 text-sm w-full"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <span className="text-xs text-text-3 flex items-center gap-1 pl-1">
            <Filter size={12} /> Filter:
          </span>
          {['all', 'Natal', 'Career', 'Muhurta', 'Compatibility'].map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedTag === tag
                  ? 'bg-gold/15 text-gold border border-gold/30'
                  : 'bg-surface-2 text-text-3 hover:text-text hover:bg-surface-3'
              }`}
            >
              {tag === 'all' ? 'All Charts' : tag}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCharts.map((item) => (
          <div
            key={item.id}
            className="glass-card rounded-2xl p-5 border border-border hover:border-gold/30 transition-all duration-300 group flex flex-col justify-between"
          >
            <div>
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold">
                    <User size={18} />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-text group-hover:text-gold-light transition-colors">
                      {item.profile.name}
                    </h3>
                    <p className="text-xs text-text-3 flex items-center gap-1.5 mt-0.5">
                      <Calendar size={12} /> {item.profile.birthDate} at {item.profile.birthTime}
                    </p>
                  </div>
                </div>
              </div>

              {/* Chart Snapshot / Mini Kundli preview */}
              <div className="bg-surface-1/60 rounded-xl p-3 border border-border/50 mb-4 flex items-center gap-4">
                <div className="w-24 h-24 flex-shrink-0 flex items-center justify-center">
                  <NorthIndianChart chart={item.chartData} className="w-24 h-24 pointer-events-none" />
                </div>
                <div className="space-y-1.5 text-xs text-text-2 flex-1">
                  <div className="flex justify-between">
                    <span className="text-text-3">Lagna:</span>
                    <span className="font-medium text-gold">{item.chartData.ascendant.sign} ({item.chartData.ascendant.nakshatra})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-3">Moon Sign:</span>
                    <span className="font-medium text-text">{item.chartData.moonSign}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-3">Nakshatra:</span>
                    <span className="font-medium text-text">{item.chartData.moonNakshatra}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-text-3 truncate">
                    <MapPin size={10} className="flex-shrink-0" />
                    <span className="truncate">{item.profile.birthPlace}</span>
                  </div>
                </div>
              </div>

              {/* Tags & notes */}
              <div className="space-y-2 mb-4">
                <div className="flex flex-wrap gap-1.5">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-surface-2 text-text-3 border border-border"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-text-3 line-clamp-2 italic">
                  "{item.notes}"
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-border flex items-center justify-between gap-2">
              <span className="text-[11px] text-text-3">
                {item.lastViewed}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate('/app/astrologer')}
                  className="p-2 rounded-lg bg-surface-2 hover:bg-gold/15 text-text-3 hover:text-gold transition-colors text-xs flex items-center gap-1"
                  title="Consult on this chart"
                >
                  <Sparkles size={14} />
                  <span className="hidden sm:inline">Consult</span>
                </button>
                <Link
                  to={`/app/chart/${item.id}`}
                  className="btn btn-primary !py-1.5 !px-3 text-xs flex items-center gap-1"
                >
                  <span>Analyse</span>
                  <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
