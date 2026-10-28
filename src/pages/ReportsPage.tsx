import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText, Download, Trash2, Compass, Sparkles,
  Calendar, Check, User, ArrowRight, ShieldCheck
} from 'lucide-react';
import {
  getSavedReports,
  deleteSavedReport,
  subscribeToGuestStore,
  getActiveProfile,
  type UserBirthDetails,
} from '@/lib/storage/guestStore';
import type { SavedReport } from '@/types';

export default function ReportsPage() {
  const [reports, setReports] = useState<SavedReport[]>(() => getSavedReports());
  const [profile, setProfile] = useState<UserBirthDetails | null>(() => getActiveProfile());
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  useEffect(() => {
    function refresh() {
      setReports(getSavedReports());
      setProfile(getActiveProfile());
    }
    refresh();
    const unsubscribe = subscribeToGuestStore(refresh);
    return unsubscribe;
  }, []);

  const handleDownload = (rep: SavedReport) => {
    const content = [
      `============================================================`,
      `VYOM VEDIC ASTROLOGICAL DOSSIER`,
      `Title: ${rep.title}`,
      `Category: ${rep.category.toUpperCase()}`,
      `Native: ${rep.chartName || profile?.name || 'Guest'}`,
      `Date Generated: ${rep.date}`,
      `Ephemeris Standard: Sidereal Zodiac • Lahiri Ayanamsha (23°51')`,
      `============================================================\n`,
      `CONSULTATION SUMMARY:`,
      rep.summary,
      `\n------------------------------------------------------------`,
      `Calculated with Sidereal Astronomical Precision by Vyom Vedic Sanctuary.`,
      `Grounding: Brihat Parashara Hora Shastra, Phaladeepika, Saravali.`,
      `============================================================`,
    ].join('\n');

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vyom_report_${rep.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setDownloadSuccess(rep.id);
    setTimeout(() => setDownloadSuccess(null), 2000);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this consultation report from your session?')) {
      deleteSavedReport(id);
    }
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in pb-12 max-w-5xl mx-auto">
      {/* ═══ Top Header ═══ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E8DCCB]/60">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#FF4B19] mb-1">
            <FileText size={14} />
            <span>Session Dossiers & Saved Reports</span>
          </div>
          <h1
            className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#09132E]"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Astrological Reports
          </h1>
          <p className="text-xs md:text-sm text-[#4A5468] mt-1">
            {profile
              ? `Generated reports bound to ${profile.name}'s current session.`
              : 'Reports generated from your consultations and chart interpretations.'}
          </p>
        </div>

        <Link
          to="/astrologer"
          className="btn-pill-orange text-xs !py-2.5 !px-4 self-start sm:self-auto"
        >
          <Sparkles size={14} />
          <span>New Consultation</span>
        </Link>
      </div>

      {/* ═══ Empty State if No Saved Reports ═══ */}
      {reports.length === 0 && (
        <div className="card-cream p-8 md:p-12 border border-[#E8DCCB] text-center space-y-4 max-w-2xl mx-auto rounded-[32px]">
          <div className="w-16 h-16 rounded-full bg-[#FF4B19]/10 text-[#FF4B19] flex items-center justify-center mx-auto">
            <FileText size={32} />
          </div>
          <h2 className="text-xl md:text-2xl font-extrabold text-[#09132E]">
            No Reports Generated Yet
          </h2>
          <p className="text-xs md:text-sm text-[#4A5468] leading-relaxed max-w-md mx-auto">
            Vyom does not display dummy reports or fabricated historical records. Any consultation you conduct with the Astrologer will be automatically archived here.
          </p>
          <div className="pt-2">
            <Link
              to="/astrologer"
              className="btn-pill-orange text-xs md:text-sm !py-3 !px-7 inline-flex items-center gap-2"
            >
              <Sparkles size={16} />
              <span>Start First Consultation</span>
            </Link>
          </div>
        </div>
      )}

      {/* ═══ Active Reports Grid ═══ */}
      {reports.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-[#7A8294] px-1">
            <span>Showing {reports.length} report{reports.length > 1 ? 's' : ''}</span>
            <span>Stored locally in private session</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reports.map((rep) => (
              <div
                key={rep.id}
                className="card-cream p-6 rounded-[28px] border border-[#E8DCCB] shadow-sm flex flex-col justify-between space-y-4 hover:border-[#FF4B19]/40 transition-all"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF4B19] bg-[#FF4B19]/10 px-2.5 py-0.5 rounded-full border border-[#FF4B19]/20">
                      {rep.category}
                    </span>
                    <span className="text-[11px] text-[#7A8294] font-medium flex items-center gap-1">
                      <Calendar size={12} />
                      <span>{rep.date}</span>
                    </span>
                  </div>

                  <h3 className="font-extrabold text-base text-[#09132E] leading-snug">
                    {rep.title}
                  </h3>

                  <p className="text-xs text-[#4A5468] line-clamp-3 leading-relaxed">
                    {rep.summary}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#E8DCCB]/60 flex items-center justify-between">
                  <button
                    onClick={() => handleDelete(rep.id)}
                    className="p-2 rounded-full text-[#7A8294] hover:text-[#E32636] hover:bg-[#E32636]/10 transition-colors cursor-pointer"
                    title="Delete report"
                  >
                    <Trash2 size={15} />
                  </button>

                  <button
                    onClick={() => handleDownload(rep)}
                    className="btn-pill-cream text-xs !py-1.5 !px-3.5 flex items-center gap-1.5 cursor-pointer"
                  >
                    {downloadSuccess === rep.id ? (
                      <>
                        <Check size={13} className="text-[#08745B]" />
                        <span>Exported</span>
                      </>
                    ) : (
                      <>
                        <Download size={13} />
                        <span>Export Report</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
