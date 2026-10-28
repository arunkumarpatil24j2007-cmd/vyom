import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import ReportIssueModal from './ReportIssueModal';

export default function GlobalReportButton() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      {/* Floating Corner Button */}
      <aside aria-label="Report issue" className="fixed bottom-5 right-5 z-40">
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="group flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-[#FAF2E8]/95 border border-[#D4C4B0] text-[#09132E] hover:border-[#09132E] hover:bg-white shadow-lg backdrop-blur-md transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
          title="Report an error or issue"
        >
          <div className="w-5 h-5 rounded-full bg-[#FF4B19]/15 text-[#FF4B19] flex items-center justify-center group-hover:bg-[#FF4B19] group-hover:text-white transition-colors">
            <AlertCircle size={13} className="shrink-0" />
          </div>
          <span className="text-xs font-bold tracking-tight text-[#09132E] pr-1">
            Report Issue
          </span>
        </button>
      </aside>

      {/* Pop-up Modal */}
      <ReportIssueModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
