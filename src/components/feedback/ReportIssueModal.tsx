import React, { useState, useEffect } from 'react';
import {
  AlertCircle,
  X,
  Send,
  CheckCircle2,
  Loader2,
  Bug,
  Layout,
  Calculator,
  MessageSquare,
  HelpCircle
} from 'lucide-react';

interface ReportIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ReportIssueModal({ isOpen, onClose }: ReportIssueModalProps) {
  const [category, setCategory] = useState('Calculation Discrepancy');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');
  const [currentUrl, setCurrentUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.href);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const categories = [
    { label: 'Calculation Discrepancy', icon: Calculator },
    { label: 'Visual / Layout Glitch', icon: Layout },
    { label: 'AI Astrologer Feedback', icon: MessageSquare },
    { label: 'Broken Feature / Crash', icon: Bug },
    { label: 'Other Inquiry', icon: HelpCircle }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      setErrorMessage('Please provide a brief description of the issue.');
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);

    const payload = {
      timestamp: new Date().toISOString(),
      category,
      description: description.trim(),
      email: email.trim() || 'Anonymous',
      pageUrl: currentUrl || window.location.href,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown',
      screenResolution: typeof window !== 'undefined' ? `${window.innerWidth}x${window.innerHeight}` : 'Unknown'
    };

    try {
      const response = await fetch('/api/feedback/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setDescription('');
        setEmail('');
        onClose();
      }, 2500);
    } catch (err) {
      console.error('Failed submitting report:', err);
      // Even if network fails, we display success if saved or indicate error
      setErrorMessage('Unable to transmit report right now. Please try again shortly.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#09132E]/60 backdrop-blur-sm animate-fade-in">
      <div
        className="relative w-full max-w-lg rounded-3xl bg-[#FAF2E8] border border-[#E8DCCB] shadow-2xl overflow-hidden p-6 md:p-8 text-[#09132E]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={submitting}
          className="absolute top-5 right-5 p-2 rounded-full text-[#64748B] hover:text-[#09132E] hover:bg-[#EDE3D4] transition-all cursor-pointer"
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        {submitted ? (
          <div className="py-10 text-center space-y-4 animate-fade-in">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="text-xl font-extrabold text-[#09132E]">Report Logged Successfully</h3>
            <p className="text-sm text-[#4A5468] max-w-sm mx-auto">
              Your feedback has been recorded and synchronized directly to our review sheet. Thank you for helping refine Vyom.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EDE3D4] border border-[#D4C4B0] text-xs font-semibold text-[#8C3A00] mb-2">
                <AlertCircle size={14} className="text-[#FF4B19]" />
                <span>Issue & Quality Reporter</span>
              </div>
              <h2 className="text-xl md:text-2xl font-extrabold text-[#09132E]" style={{ fontFamily: 'var(--font-heading)' }}>
                Report an Error or Issue
              </h2>
              <p className="text-xs text-[#4A5468] mt-1">
                Found a calculation mismatch, visual bug, or unexpected behavior? Let us know and it will be sent directly to our Google Sheet.
              </p>
            </div>

            {/* Category Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#64748B] mb-2">
                Issue Category
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {categories.map((c) => {
                  const Icon = c.icon;
                  const isSelected = category === c.label;
                  return (
                    <button
                      key={c.label}
                      type="button"
                      onClick={() => setCategory(c.label)}
                      className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer text-left ${
                        isSelected
                          ? 'bg-[#09132E] text-white border-[#09132E] shadow-2xs'
                          : 'bg-white text-[#4A5468] border-[#E8DCCB] hover:bg-[#EDE3D4] hover:text-[#09132E]'
                      }`}
                    >
                      <Icon size={14} className={isSelected ? 'text-[#F7A928]' : 'text-[#64748B]'} />
                      <span className="truncate">{c.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#64748B] mb-1.5">
                Description of the Error <span className="text-[#FF4B19]">*</span>
              </label>
              <textarea
                rows={4}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Please describe what happened, what you expected, or any specific values that looked incorrect..."
                className="w-full px-4 py-3 rounded-2xl bg-white border border-[#D4C4B0] text-xs text-[#09132E] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#F7A928] focus:border-transparent transition-all resize-none"
              />
            </div>

            {/* Contact Email (Optional) */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#64748B] mb-1.5">
                Your Email (Optional, if you would like updates)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#D4C4B0] text-xs text-[#09132E] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#F7A928] focus:border-transparent transition-all"
              />
            </div>

            {/* Page Context Badge */}
            <div className="p-2.5 rounded-xl bg-[#EDE3D4]/80 border border-[#D4C4B0] flex items-center justify-between text-[11px] text-[#64748B]">
              <span className="font-semibold text-[#09132E]">Current Page:</span>
              <span className="font-mono truncate max-w-[280px]">{currentUrl}</span>
            </div>

            {errorMessage && (
              <p className="text-xs font-semibold text-rose-600 bg-rose-50 p-2.5 rounded-xl border border-rose-200">
                {errorMessage}
              </p>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="px-4 py-2.5 rounded-full text-xs font-semibold text-[#4A5468] hover:text-[#09132E] hover:bg-[#EDE3D4] transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || !description.trim()}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#09132E] text-white hover:bg-[#FF4B19] text-xs font-bold shadow-xs transition-all disabled:opacity-40 cursor-pointer"
              >
                {submitting ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Transmitting to Sheet...</span>
                  </>
                ) : (
                  <>
                    <Send size={14} />
                    <span>Submit Report</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
