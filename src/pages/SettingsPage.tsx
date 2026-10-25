import React, { useState, useEffect } from 'react';
import type { AppSettings } from '../types';
import { checkAiBackendStatus, type AIStatusResponse } from '../services/aiService';
import {
  Sparkles,
  Sliders,
  Database,
  Save,
  Check,
  RotateCcw,
  Info,
  Lock,
  RefreshCw,
  Cpu,
  Key,
  AlertCircle,
} from 'lucide-react';

interface SettingsPageProps {
  settings: AppSettings;
  onSaveSettings: (settings: AppSettings) => void;
  onResetData: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  settings,
  onSaveSettings,
  onResetData,
}) => {
  const [formData, setFormData] = useState<AppSettings>(settings);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [aiStatus, setAiStatus] = useState<AIStatusResponse | null>(null);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [lastChecked, setLastChecked] = useState<string | null>(null);
  const [statusFeedback, setStatusFeedback] = useState<string | null>(null);

  const applyStatusResult = (status: AIStatusResponse) => {
    setAiStatus(status);
    const timeStr = new Date().toLocaleTimeString();
    setLastChecked(timeStr);
    if (status.status === 'error') {
      setStatusFeedback(status.message);
    } else if (status.configured) {
      setStatusFeedback(status.message || `Gemini AI backend active and ready (${timeStr}).`);
    } else {
      setStatusFeedback(
        status.message || `Operating in deterministic rule-based fallback mode (${timeStr}).`
      );
    }
  };

  const fetchStatus = async () => {
    setCheckingStatus(true);
    const startTime = Date.now();
    try {
      const status = await checkAiBackendStatus();
      const elapsed = Date.now() - startTime;
      if (elapsed < 400) {
        await new Promise((resolve) => setTimeout(resolve, 400 - elapsed));
      }
      applyStatusResult(status);
    } catch (err) {
      const timeStr = new Date().toLocaleTimeString();
      setLastChecked(timeStr);
      setStatusFeedback(
        `Error querying AI status: ${err instanceof Error ? err.message : 'Unknown error'}`
      );
    } finally {
      setCheckingStatus(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    checkAiBackendStatus()
      .then((status) => {
        if (!mounted) return;
        applyStatusResult(status);
      })
      .catch((err) => {
        if (!mounted) return;
        const timeStr = new Date().toLocaleTimeString();
        setLastChecked(timeStr);
        setStatusFeedback(
          `Error querying AI status: ${err instanceof Error ? err.message : 'Unknown error'}`
        );
      })
      .finally(() => {
        if (mounted) setCheckingStatus(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">
              System Architecture & Transparency
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 font-['Plus_Jakarta_Sans']">
            Settings & AI Model Transparency
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Inspect dual-mode intelligence architecture, backend connection status, and responsible AI safeguards.
          </p>
        </div>

        {savedSuccess && (
          <span className="text-xs text-emerald-600 font-bold flex items-center gap-1 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Settings Saved!</span>
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Genuine AI Integration & Transparency Status Box */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-indigo-50 text-indigo-700 rounded-xl">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm font-['Plus_Jakarta_Sans'] flex items-center gap-2">
                  <span>AI Architecture & Model Transparency</span>
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                    Dual-Engine Ready
                  </span>
                </h3>
                <p className="text-xs text-slate-500">
                  OpportunityLens AI implements genuine backend AI integration with transparent deterministic fallback
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={fetchStatus}
                disabled={checkingStatus}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                  checkingStatus
                    ? 'bg-indigo-50 text-indigo-700 border-indigo-200 cursor-not-allowed opacity-90'
                    : 'text-slate-700 bg-slate-50 hover:bg-slate-100 active:bg-slate-200 border-slate-200 cursor-pointer shadow-2xs'
                }`}
                title="Query backend endpoint /api/ai-status"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${
                    checkingStatus ? 'animate-spin text-indigo-600' : 'text-slate-500'
                  }`}
                />
                <span>{checkingStatus ? 'Checking...' : 'Check Status'}</span>
              </button>

              {aiStatus?.status === 'error' ? (
                <span className="text-xs font-bold px-3 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded-full flex items-center gap-1.5 shadow-2xs">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                  Backend Offline / Error
                </span>
              ) : aiStatus?.authenticated ? (
                <span className="text-xs font-bold px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full flex items-center gap-1.5 shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Gemini Authenticated
                </span>
              ) : aiStatus?.keyDetected ? (
                <span className="text-xs font-bold px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full flex items-center gap-1.5 shadow-2xs">
                  <Key className="w-3.5 h-3.5 text-amber-600" />
                  Key Detected (Fallback Active)
                </span>
              ) : (
                <span className="text-xs font-bold px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full flex items-center gap-1.5 shadow-2xs">
                  <Cpu className="w-3.5 h-3.5 text-indigo-600" />
                  Rule Engine Fallback
                </span>
              )}
            </div>
          </div>

          {/* Real-time Status Diagnostic Banner */}
          {(statusFeedback || aiStatus?.message) && (
            <div
              className={`p-3 rounded-xl border text-xs transition-all animate-in fade-in duration-200 flex items-start gap-2.5 ${
                aiStatus?.status === 'error'
                  ? 'bg-rose-50 border-rose-200 text-rose-950'
                  : aiStatus?.authenticated
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                  : aiStatus?.keyDetected
                  ? 'bg-amber-50 border-amber-200 text-amber-950'
                  : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
            >
              {aiStatus?.status === 'error' ? (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              ) : aiStatus?.authenticated ? (
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : aiStatus?.keyDetected ? (
                <Key className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              ) : (
                <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold">
                    {aiStatus?.status === 'error'
                      ? 'Backend Connection Status: Error'
                      : aiStatus?.authenticated
                      ? `Backend Status: Connected & Authenticated (${aiStatus.provider} - ${aiStatus.model})`
                      : aiStatus?.keyDetected
                      ? 'Backend Status: Key Detected in .env (Verification Required)'
                      : 'Backend Status: Active (Rule Engine Fallback)'}
                  </span>
                  {lastChecked && (
                    <span className="text-[10px] font-mono text-slate-500 shrink-0">
                      Verified at {lastChecked}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                  {statusFeedback || aiStatus?.message}
                </p>
              </div>
            </div>
          )}

          {/* Architecture Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Real AI Endpoint Card */}
            <div className="p-4 rounded-xl border border-indigo-200 bg-gradient-to-br from-indigo-50/50 to-white space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-indigo-950 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  Provider 1: Google Gemini AI
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    aiStatus?.status === 'error'
                      ? 'bg-rose-100 text-rose-800'
                      : aiStatus?.authenticated
                      ? 'bg-emerald-100 text-emerald-800'
                      : aiStatus?.keyDetected
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {aiStatus?.status === 'error'
                    ? 'Connection Error'
                    : aiStatus?.authenticated
                    ? 'Active & Authenticated'
                    : aiStatus?.keyDetected
                    ? 'Key Detected'
                    : 'Standby / Unset'}
                </span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Uses <strong>{aiStatus?.model || 'Gemini 2.5 Flash'}</strong> via the secure backend endpoint <code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-950">/api/ai-analyze</code> to perform semantic requirement extraction and contextual scam warning analysis.
              </p>
              <div className="p-2.5 bg-white rounded-lg border border-indigo-100 text-[11px] text-slate-600 space-y-1">
                <div className="font-semibold text-slate-800 flex items-center gap-1">
                  <Key className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Backend Secret Isolation:</span>
                </div>
                <p className="text-slate-500 text-[10px]">
                  Keys are read on the server via <code className="font-mono text-indigo-900">process.env.GEMINI_API_KEY</code>. No secret is ever bundled into client JavaScript.
                </p>
              </div>
            </div>

            {/* Deterministic Rule Engine Card */}
            <div className="p-4 rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-slate-700" />
                  Provider 2: Deterministic Heuristic Engine
                </span>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  Always Available
                </span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Operates 100% locally in browser memory using regular expressions, keyword tokenization, and mathematical weighting formulas. Provides instantaneous offline fallback with zero latency.
              </p>
              <div className="p-2.5 bg-white rounded-lg border border-slate-200 text-[11px] text-slate-600 space-y-1">
                <div className="font-semibold text-slate-800 flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-slate-600" />
                  <span>Mathematical Integrity:</span>
                </div>
                <p className="text-slate-500 text-[10px]">
                  Final scores always use deterministic arithmetic formulas regardless of whether requirements were extracted by AI or heuristic dictionary.
                </p>
              </div>
            </div>
          </div>

          {/* How to enable live Gemini instructions */}
          {!aiStatus?.configured && (
            <div className="p-3.5 bg-amber-50/70 border border-amber-200/90 rounded-xl text-xs text-amber-950 space-y-1.5">
              <div className="font-bold text-amber-900 flex items-center gap-1.5">
                <Info className="w-4 h-4 text-amber-700" />
                <span>How to Enable Live Gemini AI Extraction:</span>
              </div>
              <p className="text-slate-700 text-[11px] leading-relaxed">
                To activate live Gemini API calls, copy <code className="bg-amber-100 px-1 py-0.5 rounded text-amber-900 font-mono">.env.example</code> to <code className="bg-amber-100 px-1 py-0.5 rounded text-amber-900 font-mono">.env</code> in the project root and add your API key (<code className="font-mono">GEMINI_API_KEY=your_key</code>). The backend server will automatically route NLP extractions through Gemini 1.5 Flash.
              </p>
            </div>
          )}
        </div>

        {/* Risk Sensitivity Settings */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-50 text-indigo-700 rounded-xl">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm font-['Plus_Jakarta_Sans']">
                Scam Detection Sensitivity
              </h3>
              <p className="text-xs text-slate-500">
                Configure how strictly OpportunityLens flags informal channels and ambiguous compensation
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                id: 'conservative',
                title: 'High Caution (Strict)',
                desc: 'Increases penalties for informal WhatsApp/Telegram outreach and vague job descriptions.',
              },
              {
                id: 'balanced',
                title: 'Balanced (Recommended)',
                desc: 'Standard threshold. Penalizes explicit payment demands, upfront KYC collection, and scam keywords.',
              },
              {
                id: 'lenient',
                title: 'Lenient',
                desc: 'Permits informal startup listings unless explicit payment demands or Telegram redirection occur.',
              },
            ].map((s) => (
              <div
                key={s.id}
                onClick={() =>
                  setFormData({ ...formData, riskSensitivity: s.id as AppSettings['riskSensitivity'] })
                }
                className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all ${
                  formData.riskSensitivity === s.id
                    ? 'bg-indigo-50/50 border-indigo-500 ring-1 ring-indigo-500 text-indigo-950 shadow-xs'
                    : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="font-bold mb-1">{s.title}</div>
                <p className="text-slate-500 text-[11px] leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>

          {/* Banner toggle */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-800 block">Show Scam Alert Ticker</span>
              <span className="text-[11px] text-slate-400">
                Displays active safety alerts for student job-seekers on the dashboard
              </span>
            </div>
            <input
              type="checkbox"
              checked={formData.enableScamAlertsBanner}
              onChange={(e) => setFormData({ ...formData, enableScamAlertsBanner: e.target.checked })}
              className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Ethical AI & Disclaimer Card */}
        <div className="bg-amber-50/70 border border-amber-200/90 rounded-2xl p-5 text-xs text-amber-950 space-y-2.5 shadow-xs">
          <div className="flex items-center gap-2 font-bold text-amber-900">
            <Info className="w-4 h-4 text-amber-700" />
            <span>Employment Safety & Educational Purpose Disclaimer</span>
          </div>
          <p className="text-slate-700 leading-relaxed">
            OpportunityLens AI is engineered to assist student due diligence. <strong>No text-analysis engine can conclusively certify that an employer is legitimate or fraudulent based on text alone.</strong>
            Scammers can copy-paste authentic job postings, and legitimate early-stage startups can write informal listings.
            Always conduct independent verification on official government business registries (such as the Ministry of Corporate Affairs) and verified corporate career portals.
          </p>
        </div>

        {/* Save Settings Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition-all cursor-pointer shadow-indigo-500/20"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        </div>
      </form>

      {/* Data Management Section */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-slate-100 text-slate-700 rounded-xl">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm font-['Plus_Jakarta_Sans']">
              Local Data & Cache Control
            </h3>
            <p className="text-xs text-slate-500">
              Manage saved opportunities, student skill passports, and checklist records in browser storage
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div>
            <div className="font-bold text-slate-900">Reset to Default Sample Dataset</div>
            <p className="text-slate-500 text-[11px] mt-0.5">
              Restores the default seed opportunities, high-risk scam example, and Pravallika student profile.
            </p>
          </div>
          <button
            type="button"
            onClick={onResetData}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors cursor-pointer shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};
