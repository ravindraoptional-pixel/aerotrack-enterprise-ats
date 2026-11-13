import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Kanban, Users, Briefcase, BarChart3, Search, Plus, Sparkles, Mail, Phone, MapPin,
  ChevronRight, ChevronDown, X, Star, Copy, Check, Download, RotateCcw, ExternalLink,
  FileText, Clock, Award, Building2, CheckCircle2, AlertCircle, GripVertical, ArrowUpDown,
  Globe, TrendingUp, Send, Trash2, Menu, Filter, Layers, ShieldCheck, Compass
} from 'lucide-react';

const STORAGE_KEYS = { JOBS: 'aerotrack_ats_jobs_v1', CANDIDATES: 'aerotrack_ats_candidates_v1' };

const PIPELINE_STAGES = [
  { id: 'Applied', label: 'Applied', dotColor: 'bg-slate-400', badgeBg: 'bg-slate-100 text-slate-700 border-slate-200' },
  { id: 'Screening', label: 'Screening', dotColor: 'bg-sky-500', badgeBg: 'bg-sky-50 text-sky-700 border-sky-200' },
  { id: 'Interview', label: 'Interview', dotColor: 'bg-indigo-500', badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  { id: 'Offer', label: 'Offer', dotColor: 'bg-amber-500', badgeBg: 'bg-amber-50 text-amber-700 border-amber-200' },
  { id: 'Hired', label: 'Hired', dotColor: 'bg-[#19C3A6]', badgeBg: 'bg-teal-50 text-teal-800 border-teal-200' },
];

const INITIAL_JOBS = [
  { id: 'job-1', title: 'Senior Full-Stack Engineer', department: 'Flight Telemetry & Cloud', location: 'Remote / Hybrid (Seattle, WA)', type: 'Full-Time', status: 'Active', salaryRange: '$175,000 – $215,000', createdAt: '2026-10-14', description: 'Architect and scale real-time ground control and vehicle telemetry web applications.', requiredSkills: ['React', 'TypeScript', 'Node.js', 'WebSockets', 'PostgreSQL', 'AWS', 'Docker'] },
  { id: 'job-2', title: 'AI/ML Perception Engineer', department: 'Autonomous Guidance', location: 'Bengaluru / Hybrid', type: 'Full-Time', status: 'Active', salaryRange: '$160,000 – $205,000', createdAt: '2026-10-18', description: 'Design, train, and deploy real-time computer vision and sensor-fusion models for autonomous aerial navigation.', requiredSkills: ['Python', 'PyTorch', 'Computer Vision', 'C++', 'TensorRT', 'Sensor Fusion', 'ROS2'] },
  { id: 'job-3', title: 'Staff Product Designer', department: 'Mission Control UX', location: 'San Francisco, CA / Remote', type: 'Full-Time', status: 'Active', salaryRange: '$165,000 – $195,000', createdAt: '2026-10-22', description: 'Lead end-to-end HMI design for high-stakes telemetry consoles and fleet command centers.', requiredSkills: ['Figma', 'Design Systems', 'Data Visualization', 'Prototyping', 'User Research', 'HMI'] },
  { id: 'job-4', title: 'Enterprise Account Executive', department: 'Commercial & Defense Sales', location: 'Washington, D.C.', type: 'Full-Time', status: 'Active', salaryRange: '$150,000 Base + $150,000 OTE', createdAt: '2026-10-27', description: 'Drive enterprise and government adoption of autonomous airspace software platform.', requiredSkills: ['Enterprise SaaS', 'Defense Contracting', 'MEDDIC', 'Executive Negotiation', 'Pipeline Strategy'] },
];

const INITIAL_CANDIDATES = [
  { id: 'cand-1', name: 'Elena Rostova', email: 'elena.rostova@example.io', phone: '+1 (206) 555-0148', location: 'Seattle, WA', currentRole: 'Principal Frontend & Telemetry Engineer', experienceYears: 8, skills: ['React', 'TypeScript', 'WebSockets', 'Node.js', 'WebGL', 'AWS'], jobId: 'job-1', stage: 'Offer', matchScore: 95, matchSummary: 'Exceptional alignment with 8 years building real-time WebSocket telemetry interfaces in React and TypeScript.', source: 'Direct Sourcing', appliedDate: '2026-10-20', scorecard: { technical: 5, problemSolving: 5, communication: 5, culture: 4 }, notes: [{ id: 'n-1', author: 'Marcus Vance (VP Eng)', text: 'Outstanding live architecture session.', timestamp: '2026-11-04 14:20' }] },
  { id: 'cand-2', name: 'Arjun Mehta', email: 'arjun.mehta@example.in', phone: '+91 98450 11294', location: 'Bengaluru, India', currentRole: 'Senior Computer Vision Scientist', experienceYears: 6, skills: ['Python', 'PyTorch', 'Computer Vision', 'TensorRT', 'C++', 'SLAM'], jobId: 'job-2', stage: 'Interview', matchScore: 92, matchSummary: 'Strong production background deploying quantized PyTorch and TensorRT vision models on edge avionics hardware.', source: 'LinkedIn Recruiter', appliedDate: '2026-10-24', scorecard: { technical: 5, problemSolving: 4, communication: 5, culture: 5 }, notes: [{ id: 'n-2', author: 'Dr. Priya Nair (Autonomy Lead)', text: 'Passed technical screening with top marks.', timestamp: '2026-11-02 11:05' }] },
  { id: 'cand-3', name: 'Maya Lin-Kowalski', email: 'maya.lk@example.design', phone: '+1 (415) 555-0192', location: 'San Francisco, CA', currentRole: 'Staff Systems & Data Designer', experienceYears: 9, skills: ['Figma', 'Design Systems', 'Data Visualization', 'Prototyping', 'HMI', 'React'], jobId: 'job-3', stage: 'Hired', matchScore: 97, matchSummary: 'Rare blend of mission-critical HMI ergonomics and complex telemetry data visualization.', source: 'Employee Referral', appliedDate: '2026-10-16', scorecard: { technical: 5, problemSolving: 5, communication: 5, culture: 5 }, notes: [{ id: 'n-3', author: 'Claire Sterling (Head of Design)', text: 'Signed offer! Starting Nov 30.', timestamp: '2026-11-10 16:45' }] },
  { id: 'cand-4', name: 'Devon Brooks', email: 'dbrooks.aero@example.com', phone: '+1 (703) 555-0174', location: 'Arlington, VA', currentRole: 'Senior Federal & Aerospace Account Director', experienceYears: 10, skills: ['Enterprise SaaS', 'Defense Contracting', 'MEDDIC', 'Executive Negotiation', 'GovCloud'], jobId: 'job-4', stage: 'Interview', matchScore: 89, matchSummary: 'Proven track record closing $4M+ ARR across aerospace primes using MEDDIC.', source: 'Career Portal', appliedDate: '2026-10-29', scorecard: { technical: 4, problemSolving: 4, communication: 5, culture: 5 }, notes: [{ id: 'n-4', author: 'Sarah Jenkins (CRO)', text: 'Strong executive presence and Tier-1 relationships.', timestamp: '2026-11-06 09:30' }] },
  { id: 'cand-5', name: 'Lucas Lindqvist', email: 'lucas.lindqvist@example.se', phone: '+46 70 555 8310', location: 'Remote (Austin, TX)', currentRole: 'Full-Stack Distributed Systems Engineer', experienceYears: 5, skills: ['TypeScript', 'React', 'PostgreSQL', 'Docker', 'Node.js', 'GraphQL'], jobId: 'job-1', stage: 'Screening', matchScore: 84, matchSummary: 'Solid full-stack TypeScript, Node.js, and PostgreSQL fundamentals.', source: 'Career Portal', appliedDate: '2026-11-03', scorecard: { technical: 4, problemSolving: 4, communication: 4, culture: 4 }, notes: [] },
  { id: 'cand-6', name: 'Nadia Al-Mansoor', email: 'nadia.almansoor@example.ai', phone: '+1 (650) 555-0133', location: 'Bengaluru / Remote', currentRole: 'Robotics Perception & Sensor Fusion Engineer', experienceYears: 5, skills: ['Python', 'C++', 'Sensor Fusion', 'ROS2', 'PyTorch', 'LiDAR'], jobId: 'job-2', stage: 'Screening', matchScore: 88, matchSummary: 'Hands-on multi-sensor LiDAR/IMU fusion and ROS2 autonomy experience.', source: 'Direct Sourcing', appliedDate: '2026-11-05', scorecard: { technical: 4, problemSolving: 5, communication: 4, culture: 4 }, notes: [] },
  { id: 'cand-7', name: 'Julian Mercer', email: 'j.mercer@example.co', phone: '+1 (312) 555-0161', location: 'Chicago, IL', currentRole: 'Senior Product Designer', experienceYears: 6, skills: ['Figma', 'Prototyping', 'User Research', 'Design Systems', 'SaaS UX'], jobId: 'job-3', stage: 'Applied', matchScore: 76, matchSummary: 'Strong B2B SaaS design systems and user research portfolio.', source: 'Career Portal', appliedDate: '2026-11-09', scorecard: { technical: 0, problemSolving: 0, communication: 0, culture: 0 }, notes: [] },
  { id: 'cand-8', name: 'Chloe Moreau', email: 'chloe.moreau@example.io', phone: '+1 (202) 555-0185', location: 'Washington, D.C.', currentRole: 'Enterprise Account Executive', experienceYears: 4, skills: ['Enterprise SaaS', 'Pipeline Strategy', 'Salesforce', 'Outbound'], jobId: 'job-4', stage: 'Applied', matchScore: 68, matchSummary: 'Consistent mid-market and enterprise SaaS quota attainment.', source: 'LinkedIn Recruiter', appliedDate: '2026-11-11', scorecard: { technical: 0, problemSolving: 0, communication: 0, culture: 0 }, notes: [] },
  { id: 'cand-9', name: 'Kenji Takahashi', email: 'kenji.t@example.dev', phone: '+1 (425) 555-0119', location: 'Seattle, WA', currentRole: 'Cloud & Backend Software Engineer', experienceYears: 7, skills: ['Node.js', 'AWS', 'PostgreSQL', 'Docker', 'Go', 'Kubernetes'], jobId: 'job-1', stage: 'Applied', matchScore: 81, matchSummary: 'Deep cloud infrastructure, AWS, and PostgreSQL reliability engineering.', source: 'Career Portal', appliedDate: '2026-11-12', scorecard: { technical: 0, problemSolving: 0, communication: 0, culture: 0 }, notes: [] },
];

function MatchScoreBadge({ score, size = 'sm' }) {
  let colorClasses = 'bg-amber-50 text-amber-800 border-amber-200';
  let dotClasses = 'bg-amber-500';
  if (score >= 85) { colorClasses = 'bg-teal-50 text-teal-800 border-[#19C3A6]/40'; dotClasses = 'bg-[#19C3A6]'; }
  else if (score >= 70) { colorClasses = 'bg-emerald-50 text-emerald-800 border-emerald-200'; dotClasses = 'bg-emerald-500'; }
  return (
    <span className={`inline-flex items-center gap-1.5 font-semibold tabular-nums border rounded-full ${colorClasses} ${size === 'lg' ? 'px-3 py-1 text-sm' : 'px-2 py-0.5 text-xs'}`} title="AI Job Fit Match Score">
      <span className={`w-1.5 h-1.5 rounded-full ${dotClasses}`} />
      {score}% Match
    </span>
  );
}

function StagePill({ stage }) {
  const stageObj = PIPELINE_STAGES.find((s) => s.id === stage) || PIPELINE_STAGES[0];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${stageObj.badgeBg}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${stageObj.dotColor}`} />
      {stageObj.label}
    </span>
  );
}

export default function App() {
  const [jobs, setJobs] = useState(() => {
    try { const saved = localStorage.getItem(STORAGE_KEYS.JOBS); return saved ? JSON.parse(saved) : INITIAL_JOBS; } catch { return INITIAL_JOBS; }
  });
  const [candidates, setCandidates] = useState(() => {
    try { const saved = localStorage.getItem(STORAGE_KEYS.CANDIDATES); return saved ? JSON.parse(saved) : INITIAL_CANDIDATES; } catch { return INITIAL_CANDIDATES; }
  });
  const [activeTab, setActiveTab] = useState('Pipeline');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJobFilter, setSelectedJobFilter] = useState('ALL');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const toastTimerRef = useRef(null);

  useEffect(() => { try { localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(jobs)); } catch {} }, [jobs]);
  useEffect(() => { try { localStorage.setItem(STORAGE_KEYS.CANDIDATES, JSON.stringify(candidates)); } catch {} }, [candidates]);

  const showToast = (message, type = 'success') => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ message, type });
    toastTimerRef.current = setTimeout(() => setToast(null), 3400);
  };

  const filteredCandidates = useMemo(() => {
    return candidates.filter((cand) => {
      if (selectedJobFilter !== 'ALL' && cand.jobId !== selectedJobFilter) return false;
      if (!searchQuery.trim()) return true;
      const blob = [cand.name, cand.currentRole, cand.location, cand.email, cand.stage, cand.source, ...(cand.skills || [])].join(' ').toLowerCase();
      return blob.includes(searchQuery.toLowerCase());
    });
  }, [candidates, selectedJobFilter, searchQuery]);

  const handleMoveStage = (candidateId, newStage) => {
    setCandidates((prev) => prev.map((c) => (c.id === candidateId ? { ...c, stage: newStage } : c)));
    showToast(`Moved to ${newStage}`, 'success');
  };

  const navItems = [
    { id: 'Pipeline', label: 'Pipeline', icon: Kanban, badge: filteredCandidates.length },
    { id: 'Candidates', label: 'Candidates', icon: Users, badge: null },
    { id: 'Jobs', label: 'Jobs', icon: Briefcase, badge: jobs.filter((j) => j.status === 'Active').length },
    { id: 'Analytics', label: 'Analytics', icon: BarChart3, badge: null },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex font-sans antialiased">
      {mobileMenuOpen && <div onClick={() => setMobileMenuOpen(false)} className="fixed inset-0 z-30 bg-slate-950/60 md:hidden" />}
      <aside className={`fixed md:static inset-y-0 left-0 z-40 w-64 bg-[#0F1B2D] text-white flex flex-col justify-between shrink-0 transition-transform duration-200 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div>
          <div className="h-16 px-5 flex items-center justify-between border-b border-slate-800/90">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#19C3A6] flex items-center justify-center text-[#0F1B2D] shadow-sm">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold tracking-wider text-sm uppercase block leading-none">AeroTrack</span>
                <span className="text-[10px] font-medium tracking-widest uppercase text-[#19C3A6] block mt-0.5">Talent Telemetry</span>
              </div>
            </div>
            <button onClick={() => setMobileMenuOpen(false)} className="md:hidden text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
          </div>
          <nav className="p-3.5 space-y-1">
            <p className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-slate-400">Workspace</p>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button key={item.id} type="button" onClick={() => { setActiveTab(item.id); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all relative cursor-pointer ${isActive ? 'bg-[#17263D] text-white shadow-xs' : 'text-slate-300 hover:text-white hover:bg-white/5'}`}>
                  {isActive && <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r bg-[#19C3A6]" />}
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#19C3A6]' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== null && (
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold tabular-nums ${isActive ? 'bg-[#19C3A6]/20 text-[#19C3A6]' : 'bg-slate-800 text-slate-300'}`}>{item.badge}</span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
        <div className="p-3.5 border-t border-slate-800/90">
          <p className="text-[10px] text-slate-500 text-center">AeroTrack Enterprise ATS · Demo</p>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-20 bg-white border-b border-slate-200 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-1 min-w-[260px] max-w-2xl">
            <button type="button" onClick={() => setMobileMenuOpen(true)} className="md:hidden p-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50">
              <Menu className="w-4 h-4" />
            </button>
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search candidates..."
                className="w-full pl-9 pr-8 py-2 rounded-lg border border-slate-300 bg-[#F8FAFC] focus:bg-white text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#19C3A6] focus:ring-2 focus:ring-[#19C3A6]/20 transition-all" />
              {searchQuery && (
                <button type="button" onClick={() => setSearchQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <select value={selectedJobFilter} onChange={(e) => setSelectedJobFilter(e.target.value)}
              className="pl-3 pr-8 py-2 rounded-lg border border-slate-300 bg-white text-xs font-medium text-slate-700 focus:outline-none focus:border-[#19C3A6] appearance-none cursor-pointer">
              <option value="ALL">All Requisitions ({jobs.length})</option>
              {jobs.map((j) => <option key={j.id} value={j.id}>{j.title}</option>)}
            </select>
          </div>
        </header>

        <div className="px-4 sm:px-6 pt-5 pb-3">
          <h1 className="text-lg font-bold tracking-tight text-[#0F1B2D]">
            {activeTab === 'Pipeline' && 'Candidate Acquisition Pipeline'}
            {activeTab === 'Candidates' && 'Talent Directory'}
            {activeTab === 'Jobs' && 'Job Requisitions'}
            {activeTab === 'Analytics' && 'Recruitment Funnel & Telemetry'}
          </h1>
          <p className="text-xs text-slate-500">Tracking {filteredCandidates.length} candidates across {jobs.length} requisitions</p>
        </div>

        <main className="flex-1 px-4 sm:px-6 pb-8">
          {activeTab === 'Pipeline' && (
            <div className="overflow-x-auto pb-4">
              <div className="grid grid-cols-5 gap-4 min-w-[1180px]">
                {PIPELINE_STAGES.map((stage) => {
                  const stageCandidates = filteredCandidates.filter((c) => c.stage === stage.id);
                  return (
                    <div key={stage.id} className="flex flex-col rounded-xl border bg-slate-100/80 border-slate-200/90">
                      <div className="px-3.5 py-3 border-b border-slate-200/80 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${stage.dotColor}`} />
                          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">{stage.label}</h3>
                          <span className="px-2 py-0.5 rounded-full bg-white border border-slate-200 text-[11px] font-bold text-slate-700 tabular-nums">{stageCandidates.length}</span>
                        </div>
                      </div>
                      <div className="p-2.5 space-y-2.5 flex-1 min-h-[320px]">
                        {stageCandidates.length === 0 ? (
                          <div className="h-20 rounded-lg border border-dashed border-slate-300 flex items-center justify-center text-xs text-slate-400">Drop candidate here</div>
                        ) : (
                          stageCandidates.map((cand) => (
                            <div key={cand.id} className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-sm hover:border-[#19C3A6] transition-all cursor-pointer">
                              <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0">
                                  <h4 className="text-sm font-semibold text-slate-900 truncate">{cand.name}</h4>
                                  <p className="text-xs text-slate-500 truncate mt-0.5">{cand.currentRole}</p>
                                </div>
                                <MatchScoreBadge score={cand.matchScore} />
                              </div>
                              <div className="mt-2.5 flex items-center justify-between gap-2 text-[11px] text-slate-600 bg-[#F8FAFC] px-2.5 py-1.5 rounded-lg border border-slate-100">
                                <span className="truncate font-medium text-slate-700">{jobs.find(j => j.id === cand.jobId)?.title || 'Role'}</span>
                                <span className="shrink-0 font-semibold text-slate-500 tabular-nums">{cand.experienceYears}y</span>
                              </div>
                              <div className="mt-2.5 flex flex-wrap gap-1">
                                {cand.skills.slice(0, 3).map((skill) => (
                                  <span key={skill} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-medium">{skill}</span>
                                ))}
                              </div>
                              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between" onClick={(e) => e.stopPropagation()}>
                                <span className="text-[11px] text-slate-400">{cand.location}</span>
                                <select value={cand.stage} onChange={(e) => handleMoveStage(cand.id, e.target.value)}
                                  className="text-[11px] font-medium text-slate-600 bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5 focus:outline-none focus:border-[#19C3A6] cursor-pointer">
                                  {PIPELINE_STAGES.map((s) => <option key={s.id} value={s.id}>Move → {s.label}</option>)}
                                </select>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'Candidates' && (
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#F8FAFC] border-b border-slate-200 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                      <th className="py-3 px-4">Candidate</th>
                      <th className="py-3 px-4">Role</th>
                      <th className="py-3 px-4">Stage</th>
                      <th className="py-3 px-4">AI Fit</th>
                      <th className="py-3 px-4">Exp</th>
                      <th className="py-3 px-4">Skills</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {filteredCandidates.map((cand) => (
                      <tr key={cand.id} className="hover:bg-slate-50/90">
                        <td className="py-3.5 px-4">
                          <p className="font-semibold text-slate-900">{cand.name}</p>
                          <p className="text-xs text-slate-500">{cand.currentRole}</p>
                        </td>
                        <td className="py-3.5 px-4 text-xs font-medium text-slate-700">{jobs.find(j => j.id === cand.jobId)?.title || '—'}</td>
                        <td className="py-3.5 px-4"><StagePill stage={cand.stage} /></td>
                        <td className="py-3.5 px-4"><MatchScoreBadge score={cand.matchScore} /></td>
                        <td className="py-3.5 px-4 text-xs font-medium text-slate-700 tabular-nums">{cand.experienceYears} yrs</td>
                        <td className="py-3.5 px-4">
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {cand.skills.slice(0, 3).map((sk) => (
                              <span key={sk} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-medium">{sk}</span>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'Jobs' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {jobs.map((job) => {
                const jobCandidates = candidates.filter((c) => c.jobId === job.id);
                return (
                  <div key={job.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-[#14A38B]">{job.department}</span>
                        <h3 className="text-base font-bold text-slate-900 mt-1">{job.title}</h3>
                        <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-slate-400" />{job.location}</p>
                      </div>
                      <span className={`rounded-lg px-2.5 py-1 text-xs font-semibold border ${job.status === 'Active' ? 'bg-teal-50 text-teal-800 border-[#19C3A6]/50' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>{job.status}</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed mt-3 line-clamp-2">{job.description}</p>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {job.requiredSkills.map((sk) => (
                        <span key={sk} className="px-2 py-0.5 rounded-md bg-[#F8FAFC] border border-slate-200 text-slate-700 text-[11px] font-medium">{sk}</span>
                      ))}
                    </div>
                    <div className="pt-3 border-t border-slate-100 mt-4 flex items-center justify-between text-xs">
                      <span><strong className="text-slate-900">{jobCandidates.length}</strong> <span className="text-slate-500">Applicants</span></span>
                      <span className="text-[11px] text-slate-400">Opened {job.createdAt}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'Analytics' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Active Roles</span>
                  <div className="w-8 h-8 rounded-lg bg-[#0F1B2D] text-[#19C3A6] flex items-center justify-center"><Briefcase className="w-4 h-4" /></div>
                </div>
                <p className="text-2xl font-bold text-slate-900 mt-3 tabular-nums">{jobs.filter(j => j.status === 'Active').length}</p>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Total Candidates</span>
                  <div className="w-8 h-8 rounded-lg bg-[#0F1B2D] text-[#19C3A6] flex items-center justify-center"><Users className="w-4 h-4" /></div>
                </div>
                <p className="text-2xl font-bold text-slate-900 mt-3 tabular-nums">{candidates.length}</p>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Avg AI Match</span>
                  <div className="w-8 h-8 rounded-lg bg-[#0F1B2D] text-[#19C3A6] flex items-center justify-center"><Sparkles className="w-4 h-4" /></div>
                </div>
                <p className="text-2xl font-bold text-slate-900 mt-3 tabular-nums">{Math.round(candidates.reduce((a, c) => a + c.matchScore, 0) / (candidates.length || 1))}%</p>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Hired</span>
                  <div className="w-8 h-8 rounded-lg bg-[#0F1B2D] text-[#19C3A6] flex items-center justify-center"><ShieldCheck className="w-4 h-4" /></div>
                </div>
                <p className="text-2xl font-bold text-slate-900 mt-3 tabular-nums">{candidates.filter(c => c.stage === 'Hired').length}</p>
              </div>
            </div>
          )}
        </main>
      </div>

      {toast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-[#0F1B2D] text-white text-xs font-medium shadow-xl border border-slate-700">
          <CheckCircle2 className="w-4 h-4 text-[#19C3A6] shrink-0" />
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}
