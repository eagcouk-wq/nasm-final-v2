import React, { useState, useEffect, useRef, useCallback } from 'react';

// --- 內建圖示組件 ---
const Icons = {
  Camera: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3z"/><circle cx="12" cy="13" r="3"/></svg>,
  Activity: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  AlertCircle: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  ChevronRight: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>,
  Play: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>,
  Pause: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>,
  RefreshCw: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>,
  ChevronDown: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>,
  CheckCircle: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
  Video: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>,
  SwitchCamera: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 19H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h5"/><path d="M13 5h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-5"/><path d="M12 12h.01"/></svg>,
  Eye: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  Dumbbell: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6.5 6.5 11 11"/><path d="m21 21-1-1"/><path d="m3 3 1 1"/><path d="m18 22 4-4"/><path d="m2 6 4-4"/><path d="m3 10 7-7"/><path d="m14 21 7-7"/></svg>,
  Upload: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
  Trash: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
  ClipboardList: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/></svg>,
  TrendingUp: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  ShieldAlert: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  Maximize: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/></svg>,
  Minimize: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3v3a2 2 0 0 1-2 2H3"/><path d="M21 8h-3a2 2 0 0 1-2-2V3"/><path d="M3 16h3a2 2 0 0 1 2 2v3"/><path d="M16 21v-3a2 2 0 0 1 2-2h3"/></svg>
};

/**
 * NASM OHSA Logic & Data Structure
 */
const OHSA_DATA = {
  checkpoints: [
    // --- Anterior (前面) ---
    { id: 'feet_turn_out', label: '腳掌外旋', subLabel: 'Feet Turn Out', viewType: 'anterior', riskLevel: 'Medium', overactive: ['比目魚肌', '腓腸肌外側', '股二頭肌短頭'], underactive: ['腓腸肌內側', '半腱肌/半膜肌', '股薄肌/縫匠肌'] },
    { id: 'knees_move_in', label: '膝蓋內扣', subLabel: 'Knees Move In', viewType: 'anterior', riskLevel: 'High', overactive: ['內收肌群', '闊筋膜張肌', '股外側肌'], underactive: ['臀中肌/臀小肌', '股內側肌', '脛後肌'] },
    { id: 'knees_move_out', label: '膝蓋外開', subLabel: 'Knees Move Out', viewType: 'anterior', riskLevel: 'Low', overactive: ['梨狀肌', '股二頭肌長頭', '臀大肌'], underactive: ['內收肌群', '半腱肌/半膜肌', '臀大肌'] },
    // --- Lateral (側面) ---
    { id: 'lphc_lean', label: '過度前傾', subLabel: 'Excessive Lean', viewType: 'lateral', riskLevel: 'Medium', overactive: ['小腿肌群', '髖屈肌群', '腹部肌群'], underactive: ['脛前肌', '臀大肌', '豎脊肌'] },
    { id: 'lphc_arch', label: '下背拱起', subLabel: 'Low Back Arches', viewType: 'lateral', riskLevel: 'High', overactive: ['髖屈肌群', '豎脊肌', '背闊肌'], underactive: ['臀大肌', '膕旁肌', '核心穩定肌群'] },
    { id: 'lphc_round', label: '下背圓背', subLabel: 'Low Back Rounds', viewType: 'lateral', riskLevel: 'High', overactive: ['膕旁肌', '腹外斜肌'], underactive: ['豎脊肌', '髖屈肌群', '核心穩定肌群'] },
    { id: 'arms_fall', label: '手臂前落', subLabel: 'Arms Fall Forward', viewType: 'lateral', riskLevel: 'Medium', overactive: ['背闊肌', '胸大肌/胸小肌', '大圓肌'], underactive: ['中/下斜方肌', '菱形肌', '旋轉肌袖'] },
    // --- Posterior (後面) ---
    { id: 'feet_flatten', label: '足弓塌陷/外翻', subLabel: 'Feet Flatten', viewType: 'posterior', riskLevel: 'Medium', overactive: ['腓骨肌群', '腓腸肌外側', '股二頭肌'], underactive: ['脛前肌', '脛後肌', '臀中肌'] },
    { id: 'heels_rise', label: '腳跟離地', subLabel: 'Heels Rise', viewType: 'posterior', riskLevel: 'Low', overactive: ['比目魚肌'], underactive: ['脛前肌'] },
    { id: 'asymmetric_shift', label: '重心偏移', subLabel: 'Asymmetrical Shift', viewType: 'posterior', riskLevel: 'High', overactive: ['內收肌群 (同側)', '闊筋膜張肌 (同側)', '梨狀肌 (對側)'], underactive: ['臀中肌 (同側)', '臀大肌 (對側)'] },
    { id: 'shoulder_elevation', label: '肩膀聳起', subLabel: 'Shoulder Elevation', viewType: 'posterior', riskLevel: 'Medium', overactive: ['上斜方肌', '提肩胛肌', '胸鎖乳突肌'], underactive: ['中/下斜方肌'] }
  ]
};

// Muscle Map Component
const MuscleMap = ({ activeIssues }) => {
  const overactiveSet = new Set();
  const underactiveSet = new Set();
  
  activeIssues.forEach(issueId => {
    const issue = OHSA_DATA.checkpoints.find(c => c.id === issueId);
    if (issue) {
      issue.overactive.forEach(m => overactiveSet.add(m));
      issue.underactive.forEach(m => underactiveSet.add(m));
    }
  });

  const isOveractive = (k) => Array.from(overactiveSet).some(m => m.includes(k));
  const isUnderactive = (k) => Array.from(underactiveSet).some(m => m.includes(k));
  const getColor = (k) => isOveractive(k) ? "#EF4444" : isUnderactive(k) ? "#3B82F6" : "#E2E8F0";

  return (
    <div className="relative w-full aspect-[1/2] max-h-[500px] bg-white rounded-3xl border border-slate-100 shadow-sm flex items-center justify-center overflow-hidden p-6">
       <svg viewBox="0 0 200 400" className="h-full w-auto drop-shadow-md">
        <path d="M100,20 C115,20 125,35 125,50 C125,65 115,80 100,80 C85,80 75,65 75,50 C75,35 85,20 100,20 Z" fill="#E2E8F0" />
        <path d="M75,60 Q50,70 40,90 L160,90 Q150,70 125,60" fill={getColor('斜方肌')} />
        <path d="M80,90 L120,90 L110,130 L90,130 Z" fill={getColor('胸')} />
        <path d="M80,130 L60,110 L60,180 L80,170 Z" fill={getColor('背闊')} />
        <path d="M120,130 L140,110 L140,180 L120,170 Z" fill={getColor('背闊')} />
        <path d="M85,130 L115,130 L115,180 L85,180 Z" fill={getColor('腹')} />
        <path d="M95,130 L105,130 L105,180 L95,180 Z" fill={getColor('豎脊')} />
        <path d="M60,180 L140,180 L130,220 L70,220 Z" fill={getColor('髖屈')} />
        <path d="M90,220 L110,220 L105,280 L95,280 Z" fill={getColor('內收')} />
        <path d="M70,220 L90,220 L95,280 L65,280 Z" fill={getColor('股外側')} />
        <path d="M110,220 L130,220 L135,280 L105,280 Z" fill={getColor('股外側')} />
        <path d="M65,290 L95,290 L90,360 L70,360 Z" fill={getColor('腓腸')} />
        <path d="M105,290 L135,290 L130,360 L110,360 Z" fill={getColor('腓腸')} />
      </svg>
      <div className="absolute bottom-4 left-4 right-4 flex justify-center gap-3 text-[10px] md:text-xs bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-lg border border-slate-100">
        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 bg-red-500 rounded-full shadow-sm"></div>過度活躍 (SMR)</div>
        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 bg-blue-500 rounded-full shadow-sm"></div>使用不足 (啟動)</div>
      </div>
    </div>
  );
};

export default function NASMFitnessApp() {
  const [step, setStep] = useState(1); 
  const [isScanning, setIsScanning] = useState(false);
  const [useRealCamera, setUseRealCamera] = useState(false);
  const [videoSrc, setVideoSrc] = useState(null);
  const [currentView, setCurrentView] = useState('anterior'); 
  const [detectedIssues, setDetectedIssues] = useState([]);
  
  // Tracking & Quality States
  const [repCount, setRepCount] = useState(0);
  const targetReps = 5;
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [scanStatus, setScanStatus] = useState('ideal');
  
  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);
  const scrollRef = useRef(null);
  
  // Inject Tailwind (for visual styling)
  useEffect(() => {
    if (!document.getElementById('tailwind-script')) {
      const script = document.createElement('script');
      script.id = 'tailwind-script';
      script.src = "https://cdn.tailwindcss.com";
      document.head.appendChild(script);
    }
  }, []);

  // Camera Setup
  useEffect(() => {
    let stream = null;
    const startCamera = async () => {
      if (useRealCamera && !videoSrc && videoRef.current) {
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'environment' }
          });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (err) {
          alert("無法啟動相機"); setUseRealCamera(false);
        }
      }
    };
    if (useRealCamera) startCamera();
    else if (videoRef.current && videoRef.current.srcObject) {
       const tracks = videoRef.current.srcObject.getTracks();
       tracks.forEach(t => t.stop());
       videoRef.current.srcObject = null;
    }
    return () => { if (stream) stream.getTracks().forEach(t => t.stop()); };
  }, [useRealCamera, videoSrc]);

  // Video Playback Control
  useEffect(() => {
    if (videoSrc && videoRef.current) {
      if (isScanning) {
        videoRef.current.play().catch(e => console.log("Video Playback Error", e));
      } else {
        videoRef.current.pause();
      }
    }
  }, [isScanning, videoSrc]);

  // Draw Overlay Function
  const drawOverlay = useCallback((depth, status) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    ctx.lineCap = 'round';

    // Feedback Color Logic
    let strokeColor = '#10B981'; // Green (Ideal)
    let alertMsg = '';
    
    if (status === 'too_far') {
        strokeColor = '#F59E0B'; // Yellow
        alertMsg = '請靠近一點';
    } else if (status === 'too_close') {
        strokeColor = '#EF4444'; // Red
        alertMsg = '請後退一點';
    }

    // Draw Guide Box
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = status === 'ideal' ? 2 : 4;
    const margin = 40;
    const cl = 30; // corner length
    
    ctx.beginPath();
    ctx.moveTo(margin, margin+cl); ctx.lineTo(margin, margin); ctx.lineTo(margin+cl, margin);
    ctx.moveTo(w-margin-cl, margin); ctx.lineTo(w-margin, margin); ctx.lineTo(w-margin, margin+cl);
    ctx.moveTo(margin, h-margin-cl); ctx.lineTo(margin, h-margin); ctx.lineTo(margin+cl, h-margin);
    ctx.moveTo(w-margin-cl, h-margin); ctx.lineTo(w-margin, h-margin); ctx.lineTo(w-margin, h-margin-cl);
    ctx.stroke();

    // Alert Text on Canvas
    if (alertMsg) {
        ctx.font = 'bold 20px Arial';
        ctx.fillStyle = strokeColor;
        ctx.textAlign = 'center';
        ctx.fillText(alertMsg, w/2, h/2);
        
        // Draw Warning Icon
        ctx.beginPath();
        ctx.arc(w/2, h/2 - 40, 20, 0, Math.PI*2);
        ctx.stroke();
        ctx.fillText("!", w/2, h/2 - 34);
    }

    // Skeleton Simulation
    if (status === 'ideal') {
        const hipY = h * 0.5 + (depth * 50);
        const kneeY = h * 0.7 + (depth * 20);
        const points = [
            {x: w*0.5, y: h*0.25, color: '#10B981'}, 
            {x: w*0.5, y: h*0.35, color: '#10B981'}, 
            {x: w*0.4, y: hipY, color: '#FBBF24'}, 
            {x: w*0.6, y: hipY, color: '#FBBF24'}, 
            {x: w*0.35, y: kneeY, color: '#EF4444'}, 
            {x: w*0.65, y: kneeY, color: '#EF4444'}, 
        ];

        points.forEach(p => {
            ctx.beginPath(); ctx.arc(p.x, p.y, 4, 0, Math.PI*2);
            ctx.fillStyle = p.color; ctx.fill();
            ctx.strokeStyle = 'white'; ctx.lineWidth = 1; ctx.stroke();
        });
        
        ctx.strokeStyle = 'rgba(255,255,255,0.5)';
        ctx.beginPath();
        ctx.moveTo(points[2].x, points[2].y); ctx.lineTo(points[4].x, points[4].y);
        ctx.moveTo(points[3].x, points[3].y); ctx.lineTo(points[5].x, points[5].y);
        ctx.stroke();
    }
  }, []);

  // --- Core Tracking Logic ---
  useEffect(() => {
    let interval;
    
    if (isScanning) {
      interval = setInterval(() => {
        // 1. Simulate Motion Data
        const time = Date.now() / 1000;
        const depth = (Math.sin(time * 2) + 1) / 2; 

        // 2. Simulate Quality Checks (Randomly generate status for demo)
        let currentStatus = 'ideal';
        if (Math.random() > 0.98) currentStatus = 'too_far';
        else if (Math.random() > 0.98) currentStatus = 'too_close';
        
        setScanStatus(currentStatus);

        // 3. Count Reps (Logic moved to effect to avoid closure issues)
        if (currentStatus === 'ideal' && depth < 0.05 && Math.random() > 0.9) {
             setRepCount(prev => {
                 const newCount = prev + 1;
                 return newCount;
             });
        }

        drawOverlay(depth, currentStatus);
      }, 50);
    } else {
      drawOverlay(0, 'ideal');
    }
    return () => clearInterval(interval);
  }, [isScanning, drawOverlay]);

  // Monitor Rep Count for Completion
  useEffect(() => {
    if (repCount >= targetReps && isScanning) {
      setIsScanning(false);
      setUseRealCamera(false);
      setShowCompletionModal(true);
    }
  }, [repCount, isScanning]);

  const handleFileUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setVideoSrc(URL.createObjectURL(file));
      setUseRealCamera(false);
      setIsScanning(false);
      setRepCount(0);
      setScanStatus('ideal');
    }
  };

  const toggleIssue = (id) => {
    setDetectedIssues(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const currentCheckpoints = OHSA_DATA.checkpoints.filter(cp => cp.viewType === currentView);
  
  const calculateScore = () => {
      const baseScore = 100;
      const penalty = detectedIssues.reduce((acc, curr) => {
          const item = OHSA_DATA.checkpoints.find(c => c.id === curr);
          const riskScore = item?.riskLevel === 'High' ? 15 : item?.riskLevel === 'Medium' ? 10 : 5;
          return acc + riskScore;
      }, 0);
      return Math.max(0, baseScore - penalty);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-40">
      <input type="file" accept="video/*" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-b border-slate-200/60 safe-top">
        <div className="max-w-md mx-auto px-5 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500 p-1.5 rounded-xl text-white shadow-md">
               <Icons.Activity />
            </div>
            <div>
               <h1 className="text-lg font-bold text-slate-800 leading-none">NASM Pro</h1>
               <span className="text-[10px] font-medium text-slate-400">AI Motion Lab</span>
            </div>
          </div>
          {step === 2 && (
             <button onClick={() => { setStep(1); setRepCount(0); }} className="text-xs font-bold text-slate-500 bg-slate-100 px-4 py-2 rounded-full hover:bg-slate-200">
                重測
             </button>
          )}
        </div>
      </header>

      {/* Completion Modal */}
      {showCompletionModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in p-4">
            <div className="bg-white rounded-3xl p-8 w-full max-w-sm text-center shadow-2xl scale-100 animate-bounce-in">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-600">
                    <Icons.CheckCircle />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">分析完成</h3>
                <p className="text-slate-500 mb-6">已成功捕捉 {targetReps} 次完整動作，AI 已生成詳細生物力學報告。</p>
                <button 
                    onClick={() => { setShowCompletionModal(false); setStep(2); if(scrollRef.current) scrollRef.current.scrollTop = 0; }}
                    className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-200 transition-all"
                >
                    查看詳細報告
                </button>
            </div>
        </div>
      )}

      <main className="max-w-md mx-auto pt-24 px-5 space-y-8" ref={scrollRef}>
        
        {/* Step 1: Capture UI */}
        {step === 1 && (
          <div className="animate-fade-in space-y-6">
            
            <div className="bg-white p-1.5 rounded-2xl flex shadow-sm border border-slate-100">
              {['anterior', 'lateral', 'posterior'].map(view => (
                <button
                  key={view}
                  onClick={() => setCurrentView(view)}
                  className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all capitalize ${currentView === view ? 'bg-slate-800 text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'}`}
                >
                  {view}
                </button>
              ))}
            </div>

            <div className="relative w-full aspect-[4/5] bg-slate-900 rounded-[2rem] overflow-hidden shadow-2xl ring-4 ring-white group transform transition-all">
              <video 
                ref={videoRef} 
                src={videoSrc || undefined} 
                loop 
                playsInline 
                muted 
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${useRealCamera || videoSrc ? 'opacity-100' : 'opacity-0'}`}
              />
              <canvas ref={canvasRef} width={300} height={400} className="absolute inset-0 w-full h-full object-cover z-10 opacity-90" />
              
              {/* HUD */}
              {isScanning && (
                <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/60 to-transparent z-20">
                    <div className="flex justify-between items-center mb-2">
                        <span className={`text-white font-mono text-xs font-bold flex items-center gap-2 px-2 py-1 rounded ${scanStatus !== 'ideal' ? 'bg-red-500' : 'bg-black/40'}`}>
                            <span className={`w-2 h-2 rounded-full ${scanStatus === 'ideal' ? 'bg-red-500 animate-pulse' : 'bg-white'}`}></span> 
                            {scanStatus === 'too_far' ? '太遠 (TOO FAR)' : scanStatus === 'too_close' ? '太近 (TOO CLOSE)' : '追蹤中 (TRACKING)'}
                        </span>
                        <div className="flex flex-col items-end">
                            <span className="text-emerald-400 font-mono text-2xl font-bold leading-none">{repCount}<span className="text-sm text-white/80">/{targetReps}</span></span>
                            <span className="text-[10px] text-white/60 uppercase">Reps Completed</span>
                        </div>
                    </div>
                    {/* Rep Progress Bar */}
                    <div className="flex gap-1 mt-1">
                        {[...Array(targetReps)].map((_, i) => (
                            <div key={i} className={`h-1.5 flex-1 rounded-full ${i < repCount ? 'bg-emerald-500' : 'bg-white/20'}`}></div>
                        ))}
                    </div>
                </div>
              )}

              {/* Empty State */}
              {!isScanning && !useRealCamera && !videoSrc && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 bg-gradient-to-b from-transparent via-black/40 to-black/80">
                  <div className="grid grid-cols-2 gap-4 w-full">
                     <button onClick={() => setUseRealCamera(true)} className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 p-4 rounded-2xl flex flex-col items-center gap-2 text-white active:scale-95">
                       <Icons.Camera /><span className="text-xs font-bold">開啟相機</span>
                     </button>
                     <button onClick={() => fileInputRef.current?.click()} className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 p-4 rounded-2xl flex flex-col items-center gap-2 text-white active:scale-95">
                       <Icons.Upload /><span className="text-xs font-bold">上傳影片</span>
                     </button>
                  </div>
                  <p className="text-white/60 text-[10px] mt-6 font-medium">請將學員全身置於綠色框線範圍內</p>
                </div>
              )}
              
              {videoSrc && !isScanning && (
                 <button onClick={() => {setVideoSrc(null); setRepCount(0);}} className="absolute bottom-4 right-4 z-30 w-10 h-10 bg-black/50 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center text-white">
                    <Icons.Trash />
                 </button>
              )}
              {useRealCamera && (
                <button onClick={() => setUseRealCamera(!useRealCamera)} className="absolute bottom-4 right-4 z-30 w-10 h-10 bg-white/20 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white">
                    <Icons.SwitchCamera />
                </button>
              )}
            </div>

            <div className="space-y-4">
               <div className="flex items-end justify-between px-1">
                  <h3 className="text-base font-bold text-slate-800">手動校正標記</h3>
                  <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded-lg">AI 輔助校正</span>
               </div>
               <div className="grid grid-cols-1 gap-3">
                 {currentCheckpoints.map(cp => {
                   const isActive = detectedIssues.includes(cp.id);
                   return (
                     <button key={cp.id} onClick={() => toggleIssue(cp.id)} className={`group relative p-4 rounded-2xl border-2 text-left transition-all active:scale-[0.98] ${isActive ? 'bg-red-50 border-red-500 shadow-sm' : 'bg-white border-transparent shadow-sm hover:border-slate-200'}`}>
                        <div className="flex justify-between items-center">
                           <div>
                              <div className={`text-sm font-bold mb-0.5 ${isActive ? 'text-red-700' : 'text-slate-700'}`}>{cp.label}</div>
                              <div className={`text-xs font-medium ${isActive ? 'text-red-400' : 'text-slate-400'}`}>{cp.subLabel}</div>
                           </div>
                           <div className={`w-6 h-6 rounded-full flex items-center justify-center ${isActive ? 'bg-red-500 text-white' : 'bg-slate-100 text-slate-300'}`}>
                             {isActive ? <Icons.AlertCircle /> : <div className="w-2 h-2 rounded-full bg-slate-300"></div>}
                           </div>
                        </div>
                     </button>
                   );
                 })}
               </div>
            </div>
          </div>
        )}

        {/* Step 2: Advanced Clinical Report */}
        {step === 2 && (
          <div className="animate-fade-in space-y-8 pb-10">
             
             {/* 1. Score Dashboard */}
             <div className="bg-slate-800 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-slate-200 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
                <div className="relative z-10 flex flex-col items-center">
                    <div className="text-sm font-medium text-slate-300 uppercase tracking-widest mb-4">Movement Health Score</div>
                    <div className="relative w-40 h-40 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-slate-700" />
                            <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="10" fill="transparent" strokeDasharray={440} strokeDashoffset={440 - (440 * calculateScore() / 100)} className={`${calculateScore() > 80 ? 'text-emerald-400' : calculateScore() > 60 ? 'text-yellow-400' : 'text-red-400'} transition-all duration-1000`} />
                        </svg>
                        <span className="absolute text-5xl font-bold tracking-tighter">{calculateScore()}</span>
                    </div>
                    <div className="mt-4 flex gap-8">
                         <div className="text-center">
                            <div className="text-2xl font-bold text-red-400">{detectedIssues.length}</div>
                            <div className="text-[10px] text-slate-400 font-bold uppercase">代償總數</div>
                         </div>
                         <div className="text-center">
                            <div className="text-2xl font-bold text-emerald-400">{detectedIssues.length > 2 ? 'High' : 'Low'}</div>
                            <div className="text-[10px] text-slate-400 font-bold uppercase">受傷風險</div>
                         </div>
                    </div>
                </div>
             </div>

             {/* 2. Joint Angles & Tempo (New Feature) */}
             <div>
                <h3 className="text-sm font-bold text-slate-800 mb-4 px-1 flex items-center gap-2">
                   <Icons.Maximize /> 關節數據與節奏分析
                </h3>
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="grid grid-cols-3 text-center border-b border-slate-100 bg-slate-50">
                        <div className="py-3 text-xs font-bold text-slate-500">測量項目</div>
                        <div className="py-3 text-xs font-bold text-slate-500">測量值</div>
                        <div className="py-3 text-xs font-bold text-slate-500">標準值</div>
                    </div>
                    <div className="grid grid-cols-3 text-center py-3 border-b border-slate-50">
                        <div className="text-xs font-medium text-slate-700">膝蓋內扣角度</div>
                        <div className={`text-sm font-bold ${detectedIssues.includes('knees_move_in') ? 'text-red-500' : 'text-emerald-500'}`}>
                            {detectedIssues.includes('knees_move_in') ? '12°' : '3°'}
                        </div>
                        <div className="text-xs text-slate-400">&lt; 5°</div>
                    </div>
                    <div className="grid grid-cols-3 text-center py-3 border-b border-slate-50">
                        <div className="text-xs font-medium text-slate-700">軀幹前傾角度</div>
                        <div className={`text-sm font-bold ${detectedIssues.includes('lphc_lean') ? 'text-red-500' : 'text-emerald-500'}`}>
                            {detectedIssues.includes('lphc_lean') ? '48°' : '20°'}
                        </div>
                        <div className="text-xs text-slate-400">Parallel</div>
                    </div>
                    <div className="grid grid-cols-3 text-center py-3 bg-emerald-50/50">
                        <div className="text-xs font-medium text-slate-700">動作節奏</div>
                        <div className="text-sm font-bold text-emerald-600">2-0-2</div>
                        <div className="text-xs text-slate-400">Tempo</div>
                    </div>
                </div>
             </div>

             {/* 3. Kinetic Chain Breakdown */}
             <div>
                <h3 className="text-sm font-bold text-slate-800 mb-4 px-1 flex items-center gap-2">
                   <Icons.ShieldAlert /> 動力鏈風險評估
                </h3>
                <div className="grid grid-cols-2 gap-3">
                   <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                      <div className="text-xs text-slate-400 font-bold uppercase mb-1">Foot/Ankle</div>
                      <div className="text-sm font-bold text-slate-700">{detectedIssues.some(i => i.includes('feet') || i.includes('heels')) ? <span className="text-red-500">Unstable (不穩)</span> : <span className="text-emerald-500">Stable (穩定)</span>}</div>
                   </div>
                   <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                      <div className="text-xs text-slate-400 font-bold uppercase mb-1">Knee</div>
                      <div className="text-sm font-bold text-slate-700">{detectedIssues.some(i => i.includes('knee')) ? <span className="text-red-500">Valgus (內扣)</span> : <span className="text-emerald-500">Aligned (中立)</span>}</div>
                   </div>
                   <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                      <div className="text-xs text-slate-400 font-bold uppercase mb-1">LPHC</div>
                      <div className="text-sm font-bold text-slate-700">{detectedIssues.some(i => i.includes('lphc')) ? <span className="text-red-500">Compensated (代償)</span> : <span className="text-emerald-500">Neutral (中立)</span>}</div>
                   </div>
                   <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                      <div className="text-xs text-slate-400 font-bold uppercase mb-1">Shoulder</div>
                      <div className="text-sm font-bold text-slate-700">{detectedIssues.some(i => i.includes('arms') || i.includes('shoulder')) ? <span className="text-red-500">Elevated (聳肩)</span> : <span className="text-emerald-500">Mobile (靈活)</span>}</div>
                   </div>
                </div>
             </div>

             {/* 4. Muscle Imbalance Visual */}
             <div>
                <h3 className="text-sm font-bold text-slate-800 mb-4 px-1 flex items-center gap-2">
                   <Icons.Activity /> 肌肉失衡圖譜
                </h3>
                <MuscleMap activeIssues={detectedIssues} />
             </div>

             {/* 5. Detailed Corrective Plan */}
             <div>
                <h3 className="text-sm font-bold text-slate-800 mb-4 px-1 flex items-center gap-2">
                   <Icons.ClipboardList /> 矯正性訓練處方 (CES)
                </h3>
                <div className="space-y-6">
                   {/* Phase 1: Inhibit/Lengthen */}
                   <div className="relative pl-8 border-l-2 border-red-200">
                      <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-red-500 ring-4 ring-white"></div>
                      <h4 className="font-bold text-slate-800 text-sm mb-2">Phase 1: 抑制與伸展 (Inhibit & Lengthen)</h4>
                      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                         <p className="text-xs text-slate-400 mb-2">針對過度活躍肌肉進行 SMR (30s) 與靜態伸展 (30s)</p>
                         <div className="flex flex-wrap gap-2">
                             {Array.from(new Set(detectedIssues.flatMap(id => OHSA_DATA.checkpoints.find(c => c.id === id)?.overactive || []))).slice(0,4).map(m => (
                                 <span key={m} className="px-3 py-1 bg-red-50 text-red-600 text-xs font-bold rounded-lg">{m.split(' ')[0]}</span>
                             ))}
                         </div>
                      </div>
                   </div>

                   {/* Phase 2: Activate */}
                   <div className="relative pl-8 border-l-2 border-blue-200">
                      <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-500 ring-4 ring-white"></div>
                      <h4 className="font-bold text-slate-800 text-sm mb-2">Phase 2: 獨立肌群強化 (Activate)</h4>
                      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                         <p className="text-xs text-slate-400 mb-2">低負重高次數 (12-20 reps) 強化無力肌群</p>
                         <div className="flex flex-wrap gap-2">
                             {Array.from(new Set(detectedIssues.flatMap(id => OHSA_DATA.checkpoints.find(c => c.id === id)?.underactive || []))).slice(0,4).map(m => (
                                 <span key={m} className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-lg">{m.split(' ')[0]}</span>
                             ))}
                         </div>
                      </div>
                   </div>

                   {/* Phase 3: Integrate */}
                   <div className="relative pl-8 border-l-2 border-emerald-200">
                      <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-emerald-500 ring-4 ring-white"></div>
                      <h4 className="font-bold text-slate-800 text-sm mb-2">Phase 3: 動態整合 (Integrate)</h4>
                      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                         <div className="flex items-center gap-3 mb-2">
                            <Icons.Dumbbell />
                            <span className="text-sm font-bold text-slate-700">建議動作</span>
                         </div>
                         <ul className="text-xs text-slate-500 space-y-1 ml-6 list-disc">
                            <li>藥球單腳羅馬尼亞硬舉 (Ball RDL)</li>
                            <li>登階平衡 + 肩推 (Step-up to Press)</li>
                            <li>弓箭步旋轉 (Lunge with Rotation)</li>
                         </ul>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        )}
      </main>

      {/* Floating Footer Action */}
      <div className="fixed bottom-0 left-0 right-0 px-5 pb-8 pt-4 bg-gradient-to-t from-white via-white/95 to-transparent z-40 safe-bottom">
         <div className="max-w-md mx-auto">
            {step === 1 ? (
               <button 
                  onClick={() => setIsScanning(!isScanning)}
                  disabled={isScanning && scanStatus !== 'ideal'} 
                  className={`w-full h-16 rounded-2xl font-bold text-lg shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-3 ${isScanning ? 'bg-slate-800 text-white' : 'bg-emerald-500 text-white shadow-emerald-200 hover:bg-emerald-600'}`}
               >
                  {isScanning ? (
                      <span className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                          {scanStatus === 'ideal' ? `分析動作中... ${repCount}/${targetReps}` : '請調整距離...'}
                      </span>
                  ) : (
                      <><Icons.Play /> 開始智能分析 (目標: {targetReps}次)</>
                  )}
               </button>
            ) : (
                <button 
                  onClick={() => {window.print()}} 
                  className="w-full bg-slate-800 text-white h-16 rounded-2xl font-bold text-lg shadow-xl shadow-slate-200 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
               >
                  <Icons.ClipboardList /> 匯出完整報告
               </button>
            )}
         </div>
      </div>
    </div>
  );
}