"use client";
import { useState, useEffect, useRef } from 'react';
import { useAuth, useClerk, useUser } from '@clerk/nextjs';
import { supabase } from '../lib/supabase';

const GPU_TIERS = [
  { match: /rtx\s*4090/i,         score: 10000 },
  { match: /rtx\s*4080/i,         score: 9200 },
  { match: /rx\s*7900\s*xtx/i,    score: 9100 },
  { match: /rtx\s*4070\s*ti/i,    score: 8400 },
  { match: /rx\s*7900\s*xt/i,     score: 8200 },
  { match: /rtx\s*4070/i,         score: 7800 },
  { match: /rtx\s*3090\s*ti/i,    score: 7600 },
  { match: /rtx\s*3090/i,         score: 7400 },
  { match: /rx\s*7800\s*xt/i,     score: 7200 },
  { match: /rtx\s*3080\s*ti/i,    score: 7100 },
  { match: /rtx\s*3080/i,         score: 6800 },
  { match: /rx\s*6900\s*xt/i,     score: 6700 },
  { match: /rtx\s*4060\s*ti/i,    score: 6500 },
  { match: /rx\s*7700\s*xt/i,     score: 6300 },
  { match: /rtx\s*3070\s*ti/i,    score: 6200 },
  { match: /rtx\s*3070/i,         score: 6000 },
  { match: /rx\s*6800\s*xt/i,     score: 5900 },
  { match: /rx\s*6800/i,          score: 5700 },
  { match: /rtx\s*4060/i,         score: 5500 },
  { match: /rtx\s*3060\s*ti/i,    score: 5300 },
  { match: /rx\s*6700\s*xt/i,     score: 5100 },
  { match: /rtx\s*3060/i,         score: 4800 },
  { match: /rx\s*6600\s*xt/i,     score: 4600 },
  { match: /rx\s*6600/i,          score: 4400 },
  { match: /rtx\s*2080\s*ti/i,    score: 4300 },
  { match: /rtx\s*2080/i,         score: 4100 },
  { match: /rtx\s*3050/i,         score: 3900 },
  { match: /rtx\s*2070/i,         score: 3800 },
  { match: /rx\s*6500\s*xt/i,     score: 3600 },
  { match: /rtx\s*2060\s*super/i, score: 3400 },
  { match: /rtx\s*2060/i,         score: 3500 },
  { match: /rx\s*5700\s*xt/i,     score: 3400 },
  { match: /rx\s*5700/i,          score: 3200 },
  { match: /gtx\s*1080\s*ti/i,    score: 3100 },
  { match: /gtx\s*1080/i,         score: 2800 },
  { match: /rx\s*5600\s*xt/i,     score: 2700 },
  { match: /gtx\s*1070\s*ti/i,    score: 2600 },
  { match: /gtx\s*1070/i,         score: 2400 },
  { match: /gtx\s*1660\s*ti/i,    score: 2500 },
  { match: /gtx\s*1660\s*super/i, score: 2400 },
  { match: /gtx\s*1660/i,         score: 2200 },
  { match: /rx\s*5500\s*xt/i,     score: 2300 },
  { match: /gtx\s*1060/i,         score: 1900 },
  { match: /rx\s*580/i,           score: 1800 },
  { match: /rx\s*570/i,           score: 1600 },
  { match: /gtx\s*1050\s*ti/i,    score: 1400 },
  { match: /gtx\s*1050/i,         score: 1200 },
  { match: /rx\s*560/i,           score: 1100 },
  { match: /gtx\s*980\s*ti/i,     score: 2000 },
  { match: /gtx\s*980/i,          score: 1700 },
  { match: /gtx\s*970/i,          score: 1500 },
  { match: /gtx\s*960/i,          score: 1000 },
  { match: /intel\s*(arc|uhd|hd|iris)/i, score: 600 },
  { match: /amd\s*(vega|radeon\s*rx\s*[3-4])/i, score: 700 },
];

const CPU_TIERS = [
  { match: /ryzen\s*9\s*9[0-9]{3}/i,   score: 9500 },
  { match: /ryzen\s*7\s*9[0-9]{3}/i,   score: 8500 },
  { match: /ryzen\s*9\s*7[0-9]{3}x3/i, score: 9200 },
  { match: /ryzen\s*9\s*7[0-9]{3}/i,   score: 8800 },
  { match: /ryzen\s*7\s*7[0-9]{3}x3/i, score: 8200 },
  { match: /ryzen\s*7\s*7[0-9]{3}/i,   score: 7800 },
  { match: /ryzen\s*5\s*7[0-9]{3}x3/i, score: 7200 },
  { match: /ryzen\s*5\s*7[0-9]{3}/i,   score: 6800 },
  { match: /i9-1[34][0-9]{3}k/i,       score: 9000 },
  { match: /i9-1[34][0-9]{3}/i,        score: 8600 },
  { match: /i7-1[34][0-9]{3}k/i,       score: 8000 },
  { match: /i7-1[34][0-9]{3}/i,        score: 7500 },
  { match: /i5-1[34][0-9]{3}k/i,       score: 7000 },
  { match: /i5-1[34][0-9]{3}/i,        score: 6500 },
  { match: /i9-12[0-9]{3}k/i,          score: 8200 },
  { match: /i9-12[0-9]{3}/i,           score: 7800 },
  { match: /i7-12[0-9]{3}k/i,          score: 7400 },
  { match: /i7-12[0-9]{3}/i,           score: 7000 },
  { match: /i5-12[0-9]{3}k/i,          score: 6600 },
  { match: /i5-12[0-9]{3}/i,           score: 6200 },
  { match: /ryzen\s*9\s*5[0-9]{3}x3/i, score: 8000 },
  { match: /ryzen\s*9\s*5[0-9]{3}/i,   score: 7600 },
  { match: /ryzen\s*7\s*5[0-9]{3}x3/i, score: 7200 },
  { match: /ryzen\s*7\s*5[0-9]{3}/i,   score: 6800 },
  { match: /ryzen\s*5\s*5[0-9]{3}x/i,  score: 6400 },
  { match: /ryzen\s*5\s*5[0-9]{3}/i,   score: 5800 },
  { match: /i9-1[01][0-9]{3}k/i,       score: 7000 },
  { match: /i9-1[01][0-9]{3}/i,        score: 6600 },
  { match: /i7-1[01][0-9]{3}k/i,       score: 6400 },
  { match: /i7-1[01][0-9]{3}/i,        score: 6000 },
  { match: /i5-1[01][0-9]{3}k/i,       score: 5600 },
  { match: /i5-1[01][0-9]{3}/i,        score: 5200 },
  { match: /ryzen\s*9\s*3[0-9]{3}/i,   score: 6200 },
  { match: /ryzen\s*7\s*3[0-9]{3}/i,   score: 5600 },
  { match: /ryzen\s*5\s*3[0-9]{3}x/i,  score: 5000 },
  { match: /ryzen\s*5\s*3[0-9]{3}/i,   score: 4600 },
  { match: /i9-9[0-9]{3}k/i,           score: 5800 },
  { match: /i7-[89][0-9]{3}k/i,        score: 5200 },
  { match: /i7-[89][0-9]{3}/i,         score: 4800 },
  { match: /i5-[89][0-9]{3}k/i,        score: 4600 },
  { match: /i5-[89][0-9]{3}/i,         score: 4200 },
  { match: /ryzen\s*7\s*[12][0-9]{3}/i, score: 4000 },
  { match: /ryzen\s*5\s*[12][0-9]{3}/i, score: 3400 },
  { match: /ryzen\s*3\s*[0-9]{4}/i,    score: 2800 },
  { match: /i7-[67][0-9]{3}/i,         score: 3800 },
  { match: /i5-[67][0-9]{3}/i,         score: 3200 },
  { match: /i3-[0-9]{4}/i,             score: 2200 },
];

const RAM_SCORES  = { 4:200, 8:600, 16:1200, 32:1800, 64:2400, 128:3000 };
const CORE_SCORES = { 2:100, 4:400, 6:700, 8:1000, 10:1200, 12:1400, 16:1700, 20:2000, 24:2300, 32:2600 };

function scoreGPU(s) { for (const t of GPU_TIERS) { if (t.match.test(s)) return t.score; } return 500; }
function scoreCPU(s) { for (const t of CPU_TIERS) { if (t.match.test(s)) return t.score; } return 800; }
function scoreRAM(gb) {
  const keys = Object.keys(RAM_SCORES).map(Number).sort((a,b)=>a-b);
  for (let i=keys.length-1;i>=0;i--) { if (gb>=keys[i]) return RAM_SCORES[keys[i]]; } return 100;
}
function scoreCores(n) {
  const keys = Object.keys(CORE_SCORES).map(Number).sort((a,b)=>a-b);
  for (let i=keys.length-1;i>=0;i--) { if (n>=keys[i]) return CORE_SCORES[keys[i]]; } return 100;
}
function getRank(score) {
  if (score>=20000) return { rank:'SILICON OVERLORD',   color:'#ff4444' };
  if (score>=16000) return { rank:'RIG OF THE GODS',    color:'#ff8800' };
  if (score>=12000) return { rank:'ABSOLUTE UNIT',      color:'#ffff00' };
  if (score>=9000)  return { rank:'CERTIFIED BEAST',    color:'#00ff00' };
  if (score>=6000)  return { rank:'BLAZING FAST',       color:'#00ff00' };
  if (score>=4000)  return { rank:'SOLID BUILD',        color:'#009900' };
  if (score>=2000)  return { rank:'DAILY DRIVER',       color:'#006600' };
  return                   { rank:'NEEDS AN UPGRADE',   color:'#ff4444' };
}
function getGPUFromWebGL() {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return '';
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    if (!ext) return '';
    return gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) || '';
  } catch { return ''; }
}

const BENCH_STAGES = [
  'READING CPU CORES...','QUERYING GPU VIA WEBGL...','CHECKING SYSTEM MEMORY...',
  'DETECTING PLATFORM...','CALCULATING SCORE...','RANKING YOUR RIG...',
];

const containerStyle = { maxWidth:'1400px', margin:'0 auto', padding:'0 20px', width:'100%', boxSizing:'border-box' };

export default function Home() {
  const { isSignedIn } = useAuth();
  const { signOut } = useClerk();
  const { user } = useUser();

  const [scrollImages, setScrollImages] = useState([]);
  const [recentBuilds, setRecentBuilds] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [leaderboard, setLeaderboard]   = useState([]);

  const [benchState, setBenchState]         = useState('idle');
  const [benchProgress, setBenchProgress]   = useState(0);
  const [benchStage, setBenchStage]         = useState('');
  const [benchResult, setBenchResult]       = useState(null);
  const [cpuInput, setCpuInput]             = useState('');
  const [gpuInput, setGpuInput]             = useState('');
  const [ramInput, setRamInput]             = useState('');
  const [detectedSpecs, setDetectedSpecs]   = useState(null);
  const [submitting, setSubmitting]         = useState(false);
  const [submitted, setSubmitted]           = useState(false);

  const trackRef  = useRef(null);
  const offsetRef = useRef(0);
  const rafRef    = useRef(null);
  const pausedRef = useRef(false);

  useEffect(() => { fetchBuilds(); fetchLeaderboard(); }, []);

  useEffect(() => {
    if (!trackRef.current) return;
    const step = () => {
      if (!pausedRef.current && trackRef.current) {
        offsetRef.current -= 1.2;
        const half = trackRef.current.scrollWidth / 2;
        if (Math.abs(offsetRef.current) >= half) offsetRef.current = 0;
        trackRef.current.style.transform = `translateX(${offsetRef.current}px)`;
      }
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [scrollImages]);

  const fetchBuilds = async () => {
    const { data } = await supabase.from('builds').select('id,title,author,created_at,parts,description').order('created_at',{ascending:false}).limit(20);
    if (data?.length) {
      setRecentBuilds(data.slice(0,4));
      const photos = [];
      data.forEach(b => {
        try {
          const p = b.parts ? JSON.parse(b.parts) : {};
          if (p.photos?.length) p.photos.forEach(x => { if(x) photos.push(x); });
          else if (p.photo) photos.push(p.photo);
        } catch {}
      });
      if (photos.length >= 3) setScrollImages(photos);
    }
    setLoading(false);
  };

  const fetchLeaderboard = async () => {
    const { data } = await supabase.from('benchmark_scores').select('*').order('score',{ascending:false}).limit(20);
    setLeaderboard(data || []);
  };

  const startBenchmark = () => {
    const gpu   = getGPUFromWebGL();
    const cores = navigator.hardwareConcurrency || 4;
    const ram   = navigator.deviceMemory || 4;
    const platform = navigator.platform || 'Unknown';
    setDetectedSpecs({ gpu, cores, ram, platform });
    setGpuInput(gpu);
    setRamInput(String(ram));
    setCpuInput('');
    setBenchState('collecting');
    setBenchResult(null);
    setSubmitted(false);
  };

  const runBenchmark = () => {
    if (!cpuInput.trim()) { alert('Please enter your CPU name.'); return; }
    if (!gpuInput.trim()) { alert('Please enter your GPU name.'); return; }
    const ramVal = parseInt(ramInput) || detectedSpecs.ram;
    setBenchState('running');
    setBenchProgress(0);
    setBenchStage(BENCH_STAGES[0]);
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 4 + 1;
      const si = Math.min(Math.floor((progress/100)*BENCH_STAGES.length), BENCH_STAGES.length-1);
      setBenchStage(BENCH_STAGES[si]);
      setBenchProgress(Math.min(progress,100));
      if (progress >= 100) {
        clearInterval(interval);
        const gpuScore  = scoreGPU(gpuInput);
        const cpuScore  = scoreCPU(cpuInput);
        const ramScore  = scoreRAM(ramVal);
        const coreScore = scoreCores(detectedSpecs.cores);
        const total     = gpuScore + cpuScore + ramScore + coreScore;
        const { rank, color } = getRank(total);
        setBenchResult({ total, rank, color, gpuScore, cpuScore, ramScore, coreScore });
        setBenchState('done');
      }
    }, 80);
  };

  const submitScore = async () => {
    if (!isSignedIn) { alert('Sign in to save your score to the leaderboard.'); return; }
    setSubmitting(true);
    const username = user.username || user.firstName || user.emailAddresses?.[0]?.emailAddress?.split('@')[0] || 'Unknown';
    await supabase.from('benchmark_scores').upsert(
      { user_id: user.id, username, cpu: cpuInput.trim(), gpu: gpuInput.trim(), cores: detectedSpecs.cores, ram_gb: parseInt(ramInput)||detectedSpecs.ram, platform: detectedSpecs.platform, score: benchResult.total },
      { onConflict: 'user_id' }
    );
    setSubmitting(false);
    setSubmitted(true);
    fetchLeaderboard();
  };

  const loopImages = [...scrollImages, ...scrollImages];

  const iStyle = {
    backgroundColor:'#0d0d0d', border:'1px solid #00ff00', color:'#00ff00',
    padding:'8px 12px', fontSize:'13px', fontFamily:'"Courier New", monospace',
    width:'100%', boxSizing:'border-box', marginTop:'4px',
  };
  const lStyle = { fontSize:'11px', color:'#006600', letterSpacing:'1px', display:'block', marginTop:'12px' };

  return (
    <main style={{ backgroundColor:'#0a0a0a', minHeight:'100vh', fontFamily:'"Courier New", Courier, monospace', color:'#00ff00' }}>
      <style>{`
        @keyframes skelPulse{0%,100%{opacity:0.15}50%{opacity:0.35}}
        .skel-card{flex-shrink:0;width:280px;height:190px;border:1px solid #002200;background:#0d0d0d;position:relative;overflow:hidden;animation:skelPulse 1.6s ease-in-out infinite}
        .skel-card::after{content:'';position:absolute;inset:0;background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,255,0,0.04) 2px,rgba(0,255,0,0.04) 4px)}
        .skel-label{position:absolute;bottom:10px;left:12px;width:60%;height:10px;background:#003300;border-radius:2px}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        .reel-fade-in{animation:fadeIn 0.6s ease-in forwards}
        .build-card{border:1px solid #003300;background:#0d0d0d;padding:14px 16px;display:flex;gap:14px;align-items:center;cursor:pointer;transition:border-color 0.2s;text-decoration:none}
        .build-card:hover{border-color:#00ff00}
        .skel-build{border:1px solid #002200;background:#0d0d0d;padding:14px 16px;display:flex;gap:14px;align-items:center;animation:skelPulse 1.6s ease-in-out infinite}
        .skel-thumb{width:70px;height:55px;background:#003300;flex-shrink:0}
        .skel-line{height:10px;background:#003300;border-radius:2px;margin-bottom:6px}
        @keyframes glowPulse{0%,100%{text-shadow:0 0 8px currentColor}50%{text-shadow:0 0 24px currentColor,0 0 48px currentColor}}
        .bench-result{animation:glowPulse 1.5s ease-in-out infinite}
        .lb-row:hover{background:#0d0d0d}
      `}</style>

      {/* NAV */}
      <nav style={{ backgroundColor:'#111', borderBottom:'2px solid #00ff00', padding:'10px 20px', position:'sticky', top:0, zIndex:100 }}>
        <div style={{ maxWidth:'1400px', margin:'0 auto', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'10px' }}>
          <div style={{ fontSize:'22px', fontWeight:'bold', letterSpacing:'2px' }}>&#9608; GAMER&apos;S CONCLAVE</div>
          <div style={{ display:'flex', gap:'12px', fontSize:'13px', flexWrap:'wrap', alignItems:'center' }}>
            <a href="/builds" style={{ color:'#00ff00', textDecoration:'none' }}>[ BUILDS ]</a>
            <a href="/games"  style={{ color:'#00ff00', textDecoration:'none' }}>[ FLASH GAMES ]</a>
            <a href="/doom"   style={{ color:'#ff4444', textDecoration:'none' }}>[ DOOM ]</a>
            <a href="/vote"   style={{ color:'#00ff00', textDecoration:'none' }}>[ VOTE ]</a>
            <a href="/ideas"  style={{ color:'#00ff00', textDecoration:'none' }}>[ IDEAS ]</a>
            <a href="/donate" style={{ color:'#ffff00', textDecoration:'none' }}>[ DONATE ]</a>
            {isSignedIn
              ? <button onClick={() => signOut({ redirectUrl:'/' })} style={{ background:'none', border:'1px solid #ff4444', color:'#ff4444', fontFamily:'"Courier New", monospace', fontSize:'13px', cursor:'pointer', padding:'2px 8px' }}>[ SIGN OUT ]</button>
              : <a href="/sign-in" style={{ color:'#00ff00', textDecoration:'none' }}>[ SIGN IN ]</a>
            }
          </div>
        </div>
      </nav>

      {/* HERO */}
      <div style={{ borderBottom:'1px solid #003300' }}>
        <div style={{ maxWidth:'1400px', margin:'0 auto', textAlign:'center', padding:'60px 20px' }}>
          <h1 style={{ fontSize:'clamp(28px,4vw,56px)', fontWeight:'bold', letterSpacing:'4px', margin:'0 0 10px', textShadow:'0 0 10px #00ff00' }}>GAMER&apos;S CONCLAVE</h1>
          <div style={{ fontSize:'16px', color:'#009900', marginBottom:'30px' }}>// share your build. show your rig. join the community. //</div>
          <a href="/builds" style={{ textDecoration:'none' }}>
            <button style={{ backgroundColor:'#00ff00', color:'#000', border:'none', padding:'14px 36px', fontSize:'16px', fontFamily:'"Courier New", monospace', fontWeight:'bold', cursor:'pointer', letterSpacing:'2px' }}>[ POST YOUR BUILD ]</button>
          </a>
        </div>
      </div>

      {/* SCROLL REEL */}
      <div style={{ borderBottom:'1px solid #003300', borderTop:'1px solid #003300', backgroundColor:'#050505', padding:'20px 0' }}>
        <div style={{ fontSize:'11px', color:'#004400', textAlign:'center', marginBottom:'14px', letterSpacing:'2px' }}>&#9608;&#9608; COMMUNITY RIGS — HOVER TO PAUSE &#9608;&#9608;</div>
        <div style={{ overflow:'hidden', width:'100%' }} onMouseEnter={()=>{pausedRef.current=true}} onMouseLeave={()=>{pausedRef.current=false}}>
          {loading && <div style={{ display:'flex', gap:'12px', padding:'0 12px' }}>{Array.from({length:8}).map((_,i)=><div key={i} className="skel-card" style={{animationDelay:`${i*0.15}s`}}><div className="skel-label"/></div>)}</div>}
          {!loading && scrollImages.length>0 && (
            <div ref={trackRef} className="reel-fade-in" style={{ display:'flex', gap:'12px', width:'max-content', willChange:'transform' }}>
              {loopImages.map((src,i)=>(
                <div key={i} style={{ flexShrink:0, width:'320px', height:'210px', border:'1px solid #002200', overflow:'hidden', position:'relative' }}>
                  <img src={src} alt="rig" style={{ width:'100%', height:'100%', objectFit:'cover', display:'block', filter:'brightness(0.88)' }} onError={e=>{e.currentTarget.parentElement.style.display='none'}}/>
                  <div style={{ position:'absolute', top:0, left:0, right:0, bottom:0, pointerEvents:'none', backgroundImage:'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.12) 2px,rgba(0,0,0,0.12) 4px)' }}/>
                </div>
              ))}
            </div>
          )}
          {!loading && scrollImages.length===0 && <div style={{ textAlign:'center', color:'#004400', fontSize:'13px', padding:'40px', letterSpacing:'1px' }}>&gt; NO BUILDS YET — BE THE FIRST TO POST YOUR RIG_</div>}
        </div>
      </div>

      {/* BENCHMARK + LEADERBOARD */}
      <div style={{ borderBottom:'1px solid #003300' }}>
        <div style={{ maxWidth:'1400px', margin:'0 auto', padding:'40px 20px' }}>
          <div style={{ fontSize:'11px', color:'#006600' }}>&#9608;&#9608; DIAGNOSTICS &#9608;&#9608;</div>
          <h2 style={{ fontSize:'28px', margin:'5px 0 24px', letterSpacing:'2px' }}>PC BENCHMARK</h2>

          <div style={{ display:'grid', gridTemplateColumns:'minmax(300px,560px) 1fr', gap:'32px', alignItems:'start' }}>

            {/* BENCHMARK TOOL */}
            <div style={{ border:'1px solid #00ff00', backgroundColor:'#0d0d0d' }}>
              <div style={{ backgroundColor:'#111', borderBottom:'1px solid #003300', padding:'10px 16px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span style={{ fontSize:'13px', fontWeight:'bold', letterSpacing:'2px' }}>&#9608; PC BENCHMARK v2.0</span>
                <span style={{ fontSize:'11px', color:'#006600' }}>BY GAMER&apos;S CONCLAVE</span>
              </div>
              <div style={{ padding:'24px' }}>

                {benchState==='idle' && (
                  <div style={{ textAlign:'center' }}>
                    <div style={{ fontSize:'11px', color:'#006600', marginBottom:'16px', lineHeight:'1.8' }}>
                      DETECTS YOUR GPU, CPU CORES &amp; RAM<br/>
                      <span style={{ color:'#004400' }}>VERIFY &amp; CORRECT SPECS BEFORE SCORING</span>
                    </div>
                    <pre style={{ color:'#004400', fontSize:'10px', lineHeight:'1.4', margin:'0 0 20px', display:'inline-block' }}>{`    .--.
   |o_o |
   |:_/ |
  //   \\ \\
 (|     | )
/'\\_   _/\`\\
\\___)=(___/
  TUX AWAITS`}</pre><br/>
                    <button onClick={startBenchmark}
                      style={{ backgroundColor:'#00ff00', color:'#000', border:'none', padding:'10px 28px', fontSize:'13px', fontFamily:'"Courier New", monospace', fontWeight:'bold', cursor:'pointer', letterSpacing:'2px' }}
                      onMouseEnter={e=>e.currentTarget.style.backgroundColor='#00cc00'}
                      onMouseLeave={e=>e.currentTarget.style.backgroundColor='#00ff00'}>
                      [ RUN BENCHMARK ]
                    </button>
                  </div>
                )}

                {benchState==='collecting' && (
                  <div>
                    <div style={{ fontSize:'11px', color:'#ff4444', marginBottom:'16px', lineHeight:'1.8' }}>
                      ⚠ BROWSERS HAVE LIMITED HARDWARE ACCESS<br/>
                      <span style={{ color:'#006600' }}>VERIFY EACH FIELD — CORRECT IF WRONG</span>
                    </div>

                    <label style={lStyle}>YOUR CPU <span style={{ color:'#004400' }}>(cannot be auto-detected)</span></label>
                    <input style={iStyle} value={cpuInput} onChange={e=>setCpuInput(e.target.value)} placeholder="e.g. Ryzen 7 5800X3D or i7-13700K"/>

                    <label style={lStyle}>YOUR GPU <span style={{ color:'#004400' }}>(auto-detected — correct if wrong)</span></label>
                    <input style={iStyle} value={gpuInput} onChange={e=>setGpuInput(e.target.value)} placeholder="e.g. RTX 3090 or RX 6800 XT"/>

                    <label style={lStyle}>RAM IN GB <span style={{ color:'#004400' }}>(browser caps at 8GB — enter actual)</span></label>
                    <input style={{ ...iStyle, width:'140px' }} value={ramInput} onChange={e=>setRamInput(e.target.value)} placeholder="e.g. 64" type="number" min="1" max="512"/>

                    <div style={{ fontSize:'11px', color:'#004400', marginTop:'8px' }}>
                      CPU CORES DETECTED: <span style={{ color:'#006600' }}>{detectedSpecs?.cores}</span> &nbsp;·&nbsp;
                      PLATFORM: <span style={{ color:'#006600' }}>{detectedSpecs?.platform}</span>
                    </div>

                    <div style={{ display:'flex', gap:'10px', marginTop:'20px' }}>
                      <button onClick={runBenchmark}
                        style={{ flex:1, backgroundColor:'#00ff00', color:'#000', border:'none', padding:'10px', fontSize:'13px', fontFamily:'"Courier New", monospace', fontWeight:'bold', cursor:'pointer', letterSpacing:'2px' }}>
                        [ CALCULATE SCORE ]
                      </button>
                      <button onClick={()=>setBenchState('idle')}
                        style={{ backgroundColor:'#111', color:'#ff4444', border:'1px solid #ff4444', padding:'10px 14px', fontSize:'12px', fontFamily:'"Courier New", monospace', cursor:'pointer' }}>
                        CANCEL
                      </button>
                    </div>
                  </div>
                )}

                {benchState==='running' && (
                  <div>
                    <div style={{ fontSize:'12px', color:'#00ff00', marginBottom:'12px', letterSpacing:'1px' }}>{benchStage}</div>
                    <div style={{ backgroundColor:'#050505', border:'1px solid #003300', height:'22px', marginBottom:'8px', position:'relative', overflow:'hidden' }}>
                      <div style={{ height:'100%', width:`${benchProgress}%`, backgroundColor: benchProgress<40?'#004400':benchProgress<75?'#00aa00':'#00ff00', transition:'width 0.08s linear' }}/>
                      <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', fontSize:'11px', color:'#00ff00', whiteSpace:'nowrap' }}>{Math.floor(benchProgress)}%</div>
                    </div>
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'6px', marginTop:'16px' }}>
                      {BENCH_STAGES.map((stage,i)=>{
                        const cur=Math.floor((benchProgress/100)*BENCH_STAGES.length);
                        return <div key={i} style={{ fontSize:'10px', color:i<=cur?'#006600':'#002200', letterSpacing:'1px' }}>{i<=cur?'▓':'░'} {stage}</div>;
                      })}
                    </div>
                  </div>
                )}

                {benchState==='done' && benchResult && (
                  <div style={{ textAlign:'center' }}>
                    <pre style={{ color:'#00ff00', fontSize:'10px', lineHeight:'1.4', margin:'0 0 12px', display:'inline-block', textShadow:'0 0 8px #00ff00' }}>{`    .--.
   |o_o |
   |:_/ |
  //   \\ \\
 (|     | )
/'\\_   _/\`\\
\\___)=(___/`}</pre>
                    <div className="bench-result" style={{ fontSize:'22px', fontWeight:'bold', letterSpacing:'3px', color:benchResult.color, marginBottom:'6px' }}>{benchResult.rank}</div>
                    <div style={{ fontSize:'28px', fontWeight:'bold', color:'#00ff00', marginBottom:'16px' }}>{benchResult.total.toLocaleString()} pts</div>

                    <div style={{ textAlign:'left', border:'1px solid #003300', padding:'12px', backgroundColor:'#050505', marginBottom:'16px' }}>
                      <div style={{ fontSize:'10px', color:'#006600', letterSpacing:'1px', marginBottom:'8px' }}>SCORE BREAKDOWN</div>
                      {[
                        { label:'GPU',   value:benchResult.gpuScore,  detail:gpuInput },
                        { label:'CPU',   value:benchResult.cpuScore,  detail:cpuInput },
                        { label:'RAM',   value:benchResult.ramScore,  detail:`${ramInput}GB` },
                        { label:'CORES', value:benchResult.coreScore, detail:`${detectedSpecs.cores} threads` },
                      ].map(row=>(
                        <div key={row.label} style={{ display:'flex', justifyContent:'space-between', fontSize:'12px', marginBottom:'4px' }}>
                          <span style={{ color:'#006600' }}>{row.label}: <span style={{ color:'#009900' }}>{row.detail}</span></span>
                          <span style={{ color:'#00ff00' }}>+{row.value.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>

                    <div style={{ display:'flex', gap:'10px', justifyContent:'center', flexWrap:'wrap' }}>
                      {!submitted ? (
                        <button onClick={submitScore} disabled={submitting}
                          style={{ backgroundColor:submitting?'#006600':'#00ff00', color:'#000', border:'none', padding:'8px 20px', fontSize:'12px', fontFamily:'"Courier New", monospace', fontWeight:'bold', cursor:submitting?'not-allowed':'pointer', letterSpacing:'1px' }}>
                          {submitting?'[ SAVING... ]':isSignedIn?'[ SAVE TO LEADERBOARD ]':'[ SIGN IN TO SAVE ]'}
                        </button>
                      ) : (
                        <div style={{ fontSize:'12px', color:'#00ff00', border:'1px solid #003300', padding:'8px 16px' }}>✓ SCORE SAVED</div>
                      )}
                      <button onClick={()=>{setBenchState('idle');setCpuInput('');setGpuInput('');setRamInput('');setBenchResult(null);setSubmitted(false);}}
                        style={{ backgroundColor:'#111', color:'#00ff00', border:'1px solid #00ff00', padding:'8px 16px', fontSize:'12px', fontFamily:'"Courier New", monospace', cursor:'pointer' }}>
                        [ RUN AGAIN ]
                      </button>
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* LEADERBOARD */}
            <div style={{ border:'1px solid #00ff00', backgroundColor:'#0d0d0d' }}>
              <div style={{ backgroundColor:'#111', borderBottom:'1px solid #003300', padding:'10px 16px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span style={{ fontSize:'13px', fontWeight:'bold', letterSpacing:'2px' }}>&#9608; LEADERBOARD</span>
                <span style={{ fontSize:'11px', color:'#006600' }}>TOP 20 RIGS</span>
              </div>
              {leaderboard.length===0 ? (
                <div style={{ padding:'30px', color:'#006600', fontSize:'13px', textAlign:'center' }}>&gt; NO SCORES YET — BE THE FIRST_</div>
              ) : (
                <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'12px' }}>
                  <thead>
                    <tr style={{ borderBottom:'1px solid #003300' }}>
                      {['#','USER','CPU','GPU','SCORE'].map(h=>(
                        <th key={h} style={{ padding:'8px 12px', color:'#006600', fontWeight:'normal', textAlign:h==='SCORE'?'right':'left', letterSpacing:'1px', fontSize:'10px' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboard.map((row,i)=>{
                      const {rank,color}=getRank(row.score);
                      const medal=i===0?'🥇':i===1?'🥈':i===2?'🥉':`${i+1}`;
                      return (
                        <tr key={row.id} className="lb-row" style={{ borderBottom:'1px solid #001100' }}>
                          <td style={{ padding:'8px 12px', color:i<3?'#ffff00':'#006600', fontWeight:i<3?'bold':'normal' }}>{medal}</td>
                          <td style={{ padding:'8px 12px', color:'#00ff00' }}>{row.username}</td>
                          <td style={{ padding:'8px 12px', color:'#009900', maxWidth:'120px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{row.cpu}</td>
                          <td style={{ padding:'8px 12px', color:'#009900', maxWidth:'140px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{row.gpu.replace(/.*?((?:RTX|RX|GTX|Arc)\s*\S+).*/i,'$1')||row.gpu.slice(0,20)}</td>
                          <td style={{ padding:'8px 12px', color, textAlign:'right', fontWeight:'bold' }}>{row.score.toLocaleString()}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* PC OF THE WEEK */}
      <div style={{ borderBottom:'1px solid #003300' }}>
        <div style={{ maxWidth:'1400px', margin:'0 auto', padding:'40px 20px' }}>
          <div style={{ fontSize:'11px', color:'#006600' }}>&#9608;&#9608; FEATURED &#9608;&#9608;</div>
          <h2 style={{ fontSize:'28px', margin:'5px 0 20px', letterSpacing:'2px' }}>PC OF THE WEEK</h2>
          <div style={{ border:'1px solid #00ff00', padding:'24px', maxWidth:'500px', backgroundColor:'#0d0d0d' }}>
            <div style={{ fontSize:'18px', fontWeight:'bold', marginBottom:'10px' }}>&gt; SLOT EMPTY — BE THE FIRST!</div>
            <div style={{ fontSize:'13px', color:'#009900' }}>No builds submitted yet. Post yours and get voted in.</div>
          </div>
        </div>
      </div>

      {/* RECENT BUILDS */}
      <div style={{ borderBottom:'1px solid #003300' }}>
        <div style={{ maxWidth:'1400px', margin:'0 auto', padding:'40px 20px' }}>
          <div style={{ fontSize:'11px', color:'#006600' }}>&#9608;&#9608; LATEST &#9608;&#9608;</div>
          <h2 style={{ fontSize:'28px', margin:'5px 0 20px', letterSpacing:'2px' }}>RECENT BUILDS</h2>
          {loading && (
            <div style={{ display:'flex', flexDirection:'column', gap:'12px', maxWidth:'700px' }}>
              {Array.from({length:3}).map((_,i)=>(
                <div key={i} className="skel-build" style={{ animationDelay:`${i*0.2}s` }}>
                  <div className="skel-thumb"/>
                  <div style={{ flex:1 }}>
                    <div className="skel-line" style={{ width:'50%' }}/>
                    <div className="skel-line" style={{ width:'30%' }}/>
                    <div className="skel-line" style={{ width:'70%' }}/>
                  </div>
                </div>
              ))}
            </div>
          )}
          {!loading && recentBuilds.length===0 && <div style={{ color:'#006600', fontSize:'14px' }}>&gt; No builds yet. Be the first to post._</div>}
          {!loading && recentBuilds.length>0 && (
            <div style={{ display:'flex', flexDirection:'column', gap:'12px', maxWidth:'700px', animation:'fadeIn 0.6s ease-in' }}>
              {recentBuilds.map(build=>{
                let parts={};
                try { parts=build.parts?JSON.parse(build.parts):{}; } catch {}
                const photo=parts.photos?.[0]||parts.photo||null;
                return (
                  <a key={build.id} href="/builds" className="build-card" style={{ color:'inherit' }}>
                    {photo && <img src={photo} alt={build.title} style={{ width:'80px', height:'60px', objectFit:'cover', border:'1px solid #003300', flexShrink:0 }}/>}
                    <div>
                      <div style={{ fontSize:'16px', fontWeight:'bold', letterSpacing:'1px', marginBottom:'4px', color:'#00ff00' }}>&gt; {build.title}</div>
                      <div style={{ fontSize:'12px', color:'#006600' }}>by {build.author} · {new Date(build.created_at).toLocaleDateString()}</div>
                      {parts.cpu && <div style={{ fontSize:'12px', color:'#009900', marginTop:'3px' }}>{parts.cpu}{parts.gpu?` · ${parts.gpu}`:''}</div>}
                    </div>
                  </a>
                );
              })}
              <a href="/builds" style={{ fontSize:'13px', color:'#009900', textDecoration:'none', letterSpacing:'1px' }}>&gt; VIEW ALL BUILDS →</a>
            </div>
          )}
        </div>
      </div>

      <footer style={{ borderTop:'2px solid #00ff00', backgroundColor:'#111' }}>
        <div style={{ maxWidth:'1400px', margin:'0 auto', padding:'20px', textAlign:'center', fontSize:'12px', color:'#006600' }}>
          <a href="/donate" style={{ color:'#ffff00', textDecoration:'none', marginRight:'20px' }}>[ DONATE ]</a>
          <span>GAMER&apos;S CONCLAVE &copy; 2025 — BUILT FOR PASSION, NOT PROFIT</span>
        </div>
      </footer>
    </main>
  );
}