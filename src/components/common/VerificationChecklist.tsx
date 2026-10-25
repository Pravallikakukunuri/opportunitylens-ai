import React, { useState } from 'react';
import { CheckCircle2, Circle, ShieldCheck, ExternalLink, HelpCircle, AlertTriangle } from 'lucide-react';

interface VerificationChecklistProps {
  companyName?: string;
  initialChecked?: Record<string, boolean>;
  onChecklistChange?: (checked: Record<string, boolean>) => void;
  readOnly?: boolean;
}

export const VerificationChecklist: React.FC<VerificationChecklistProps> = ({
  companyName = 'the employer',
  initialChecked = {},
  onChecklistChange,
  readOnly = false,
}) => {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>(initialChecked);
  const [prevInitialChecked, setPrevInitialChecked] = useState(initialChecked);

  if (initialChecked !== prevInitialChecked) {
    setPrevInitialChecked(initialChecked);
    setCheckedItems(initialChecked);
  }

  const checklist = [
    {
      id: 'check-fee',
      text: 'Confirmed Zero Upfront Fees: Recruiter has not demanded any registration, processing, uniform, or laptop security deposit.',
      critical: true,
    },
    {
      id: 'check-email',
      text: 'Verified Official Email Domain: Sender writes from an authenticated company domain (e.g., name@company.com), NOT a free @gmail.com or @yahoo.com address.',
      critical: true,
    },
    {
      id: 'check-career-portal',
      text: `Cross-Referenced Careers Page: Looked up the job opening directly on ${companyName}'s official website or official LinkedIn jobs page.`,
      critical: false,
    },
    {
      id: 'check-recruiter',
      text: 'Recruiter Verified: Found the HR recruiter or hiring manager on LinkedIn with verifiable tenure and connections.',
      critical: false,
    },
    {
      id: 'check-interview',
      text: 'Legitimate Interview Process: Conducted live video or in-person technical interviews rather than instant text-only selection.',
      critical: false,
    },
  ];

  const toggleCheck = (id: string) => {
    if (readOnly) return;
    const updated = { ...checkedItems, [id]: !checkedItems[id] };
    setCheckedItems(updated);
    if (onChecklistChange) {
      onChecklistChange(updated);
    }
  };

  const completedCount = Object.values(checkedItems).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / checklist.length) * 100);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-indigo-50 text-indigo-700 rounded-xl">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-sm">Fresher Safety & Verification Protocol</h4>
            <p className="text-xs text-slate-500">Conduct these 5 manual checks before replying, accepting, or sending IDs</p>
          </div>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full">
          {completedCount} / {checklist.length} Completed
        </span>
      </div>

      {/* Prominent Legal / Verification Warning Disclaimer */}
      <div className="p-3 bg-amber-50/80 border border-amber-200/90 rounded-xl text-xs text-amber-950 flex items-start gap-2">
        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="font-bold text-amber-900">User Due Diligence Notice: </strong>
          Checking these boxes records your personal manual review progress. <em>A user-selected checkbox is NOT independent proof, automated verification, or legal certification that a company is legitimate.</em>
        </p>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
        <div
          className={`h-full transition-all duration-300 rounded-full ${
            progressPercent === 100 ? 'bg-emerald-500' : 'bg-indigo-600'
          }`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Checklist items */}
      <div className="space-y-2.5">
        {checklist.map((item) => {
          const isDone = !!checkedItems[item.id];
          return (
            <div
              key={item.id}
              onClick={() => toggleCheck(item.id)}
              className={`flex items-start gap-3 p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                isDone
                  ? 'bg-emerald-50/50 border-emerald-200 text-slate-800'
                  : 'bg-slate-50 border-slate-200/80 hover:bg-slate-100/60 text-slate-600'
              }`}
            >
              <button
                type="button"
                className="mt-0.5 shrink-0 focus:outline-hidden cursor-pointer"
                aria-label={isDone ? 'Mark unverified' : 'Mark verified'}
              >
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-400" />
                )}
              </button>
              <div className="flex-1">
                <span className={isDone ? 'font-medium text-slate-900' : ''}>{item.text}</span>
                {item.critical && (
                  <span className="ml-2 inline-block px-1.5 py-0.2 rounded text-[10px] font-bold uppercase tracking-wider bg-rose-100 text-rose-700">
                    Mandatory Rule
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* External reference link */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span className="flex items-center gap-1">
          <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
          Verify Corporate Registration independently:
        </span>
        <a
          href="https://www.mca.gov.in/content/mca/global/en/mca/master-data/MDS.html"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-700 font-semibold hover:underline"
        >
          MCA Master Data Portal
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
};
