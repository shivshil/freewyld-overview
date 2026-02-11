import { useState, useEffect } from "react";

const fmt = (n) => {
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(0)}K`;
  return `$${n.toFixed(0)}`;
};

const pct = (n) => `${(n * 100).toFixed(1)}%`;

const Slider = ({ label, value, onChange, min, max, step, format = "dollar", note }) => {
  const display = format === "pct" ? `${(value * 100).toFixed(0)}%` : format === "x" ? `${value.toFixed(1)}x` : fmt(value);
  return (
    <div className="mb-4">
      <div className="flex justify-between items-baseline mb-1">
        <span className="text-sm font-medium text-gray-300">{label}</span>
        <span className="text-sm font-bold text-white">{display}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(parseFloat(e.target.value))}
        className="w-full h-2 rounded-lg appearance-none cursor-pointer" style={{background:`linear-gradient(to right,#6366f1 ${((value-min)/(max-min))*100}%,#374151 ${((value-min)/(max-min))*100}%)`}} />
      {note && <p className="text-xs text-gray-500 mt-1">{note}</p>}
    </div>
  );
};

const ResultCard = ({ label, value, sub, highlight }) => (
  <div className={`rounded-xl p-4 ${highlight ? "bg-indigo-900 border border-indigo-500" : "bg-gray-800 border border-gray-700"}`}>
    <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">{label}</p>
    <p className={`text-2xl font-bold ${highlight ? "text-indigo-300" : "text-white"}`}>{value}</p>
    {sub && <p className="text-xs text-gray-500 mt-1">{sub}</p>}
  </div>
);

const EVBar = ({ label, low, high, maxVal, color }) => {
  const lPct = (low / maxVal) * 100;
  const wPct = ((high - low) / maxVal) * 100;
  return (
    <div className="mb-3">
      <div className="flex justify-between text-xs text-gray-400 mb-1">
        <span>{label}</span>
        <span>{fmt(low)} - {fmt(high)}</span>
      </div>
      <div className="w-full bg-gray-800 rounded-full h-5 overflow-hidden">
        <div className="h-full rounded-full flex items-center justify-end pr-2" style={{marginLeft:`${lPct}%`, width:`${Math.max(wPct,3)}%`, background:color}}>
        </div>
      </div>
    </div>
  );
};

const Divider = () => <div className="border-t border-gray-700 my-6" />;

const presets = {
  newclient: { name: "New Client Calculator", pre: 1000000, post: 2000000, margin: 0.28, propCount: 6, ownedPct: 0.70, lowMult: 4, highMult: 6, fee: 0.06 },
  utah: { name: "Utah Operator", pre: 1370000, post: 2600000, margin: 0.30, propCount: 8, ownedPct: 0.75, lowMult: 4, highMult: 6, fee: 0.06 },
  michigan: { name: "Michigan Operator", pre: 1200000, post: 4000000, margin: 0.30, propCount: 12, ownedPct: 0.80, lowMult: 5, highMult: 7, fee: 0.06 },
};

export default function EVCalculator() {
  const [mode, setMode] = useState("newclient");
  const [pre, setPre] = useState(1000000);
  const [post, setPost] = useState(2000000);
  const [margin, setMargin] = useState(0.28);
  const [propCount, setPropCount] = useState(6);
  const [ownedPct, setOwnedPct] = useState(0.70);
  const [lowMult, setLowMult] = useState(4);
  const [highMult, setHighMult] = useState(6);
  const [fee, setFee] = useState(0.06);

  const loadPreset = (key) => {
    const p = presets[key];
    setMode(key); setPre(p.pre); setPost(p.post); setMargin(p.margin);
    setPropCount(p.propCount); setOwnedPct(p.ownedPct);
    setLowMult(p.lowMult); setHighMult(p.highMult); setFee(p.fee);
  };

  // Calculations
  const lift = post - pre;
  const liftPct = pre > 0 ? lift / pre : 0;
  const preEBITDA = pre * margin;
  const postEBITDA = post * margin;
  const incrementalEBITDA = lift * 0.70; // 70% flow-through on incremental rev (costs largely fixed)
  const adjPostEBITDA = preEBITDA + incrementalEBITDA;

  const preEV_low = preEBITDA * lowMult;
  const preEV_high = preEBITDA * highMult;
  const postEV_low = adjPostEBITDA * lowMult;
  const postEV_high = adjPostEBITDA * highMult;

  const evLift_low = postEV_low - preEV_low;
  const evLift_high = postEV_high - preEV_high;

  const annualFee = lift * fee;
  const roiLow = annualFee > 0 ? evLift_low / annualFee : 0;
  const roiHigh = annualFee > 0 ? evLift_high / annualFee : 0;

  const maxBar = Math.max(postEV_high, 1);

  // Multiple band analysis
  const preRevBand = pre < 1500000 ? "Micro" : pre < 3000000 ? "Small" : pre < 10000000 ? "Mid-Market" : "Institutional";
  const postRevBand = post < 1500000 ? "Micro" : post < 3000000 ? "Small" : post < 10000000 ? "Mid-Market" : "Institutional";
  const bandJump = preRevBand !== postRevBand;

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4 md:p-8" style={{fontFamily:"Inter, system-ui, sans-serif"}}>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-lg">F</div>
            <div>
              <h1 className="text-xl font-bold">Enterprise Value Calculator</h1>
              <p className="text-xs text-gray-400">Freewyld Foundry Revenue Audit Add-On</p>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-3">
            For Jasper's revenue audit report. Shows clients the EV impact of Freewyld's revenue optimization, not just the top-line lift. Inputs map to what's already collected in the GHL revenue audit form.
          </p>
        </div>

        {/* Preset Buttons */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {Object.entries(presets).map(([key, p]) => (
            <button key={key} onClick={() => loadPreset(key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${mode === key ? "bg-indigo-600 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"}`}>
              {p.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Inputs */}
          <div>
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Revenue Audit Inputs</h2>
            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
              <Slider label="Pre-Freewyld Annual Bookings (GBV)" value={pre} onChange={setPre} min={200000} max={15000000} step={50000} note="From Jasper's current revenue field" />
              <Slider label="Post-Freewyld Annual Bookings (GBV)" value={post} onChange={v => setPost(Math.max(v, pre))} min={200000} max={15000000} step={50000} note="From Jasper's projected revenue field" />
              <div className="bg-gray-800 rounded-lg p-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-400">Net New Revenue (Uplift)</span>
                  <span className="text-sm font-bold text-emerald-400">{fmt(lift)} ({(liftPct * 100).toFixed(0)}%)</span>
                </div>
              </div>
              <Slider label="Est. EBITDA Margin" value={margin} onChange={setMargin} min={0.10} max={0.45} step={0.01} format="pct" note="25-35% typical for well-run owned STR portfolios" />
              <Slider label="Property Count" value={propCount} onChange={setPropCount} min={2} max={60} step={1} format="x" note="Used for per-property economics" />
              <Slider label="% Properties Owned (vs. Leased)" value={ownedPct} onChange={setOwnedPct} min={0} max={1} step={0.05} format="pct" note="Owned = higher margin, higher multiple" />

              <Divider />
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Valuation Assumptions</h3>
              <Slider label="Low-End EBITDA Multiple" value={lowMult} onChange={setLowMult} min={2} max={12} step={0.5} format="x" note="3-5x for single-market, 5-7x multi-market" />
              <Slider label="High-End EBITDA Multiple" value={highMult} onChange={v => setHighMult(Math.max(v, lowMult))} min={2} max={15} step={0.5} format="x" />
              <Slider label="Freewyld Fee (% of incremental rev)" value={fee} onChange={setFee} min={0.03} max={0.12} step={0.005} format="pct" note="~6% assumed from case study data" />
            </div>
          </div>

          {/* Right: Results */}
          <div>
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Enterprise Value Impact</h2>
            
            {/* Top Cards */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <ResultCard label="Pre-Freewyld EV" value={`${fmt(preEV_low)} - ${fmt(preEV_high)}`} sub={`On ${fmt(preEBITDA)} EBITDA`} />
              <ResultCard label="Post-Freewyld EV" value={`${fmt(postEV_low)} - ${fmt(postEV_high)}`} sub={`On ${fmt(adjPostEBITDA)} adj. EBITDA`} highlight />
            </div>

            {/* EV Lift */}
            <div className="bg-gradient-to-r from-indigo-950 to-emerald-950 rounded-2xl p-6 border border-indigo-800 mb-4">
              <p className="text-xs uppercase tracking-wider text-indigo-300 mb-1">Enterprise Value Created</p>
              <p className="text-3xl font-bold text-white mb-1">{fmt(evLift_low)} - {fmt(evLift_high)}</p>
              <p className="text-sm text-gray-400">
                Annual Freewyld fee: {fmt(annualFee)} &rarr; <span className="text-emerald-400 font-semibold">{roiLow.toFixed(0)}x - {roiHigh.toFixed(0)}x return on fee</span>
              </p>
              {bandJump && (
                <div className="mt-3 bg-emerald-900 bg-opacity-40 rounded-lg p-3 border border-emerald-700">
                  <p className="text-xs text-emerald-300 font-semibold">MULTIPLE BAND JUMP DETECTED</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Revenue moved from <span className="text-white">{preRevBand}</span> to <span className="text-white">{postRevBand}</span> tier. This triggers higher buyer interest and potentially higher multiples beyond the linear calculation shown.
                  </p>
                </div>
              )}
            </div>

            {/* Visual Bars */}
            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 mb-4">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">EV Range Comparison</h3>
              <EVBar label="Pre-Freewyld EV" low={preEV_low} high={preEV_high} maxVal={maxBar} color="linear-gradient(to right, #4b5563, #6b7280)" />
              <EVBar label="Post-Freewyld EV" low={postEV_low} high={postEV_high} maxVal={maxBar} color="linear-gradient(to right, #4f46e5, #818cf8)" />
              <EVBar label="EV Created by Freewyld" low={evLift_low} high={evLift_high} maxVal={maxBar} color="linear-gradient(to right, #059669, #34d399)" />
            </div>

            {/* Unit Economics */}
            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 mb-4">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Per-Property Economics</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Avg GBV / Property</p>
                  <p className="font-bold">{fmt(post / Math.max(propCount, 1))}</p>
                </div>
                <div>
                  <p className="text-gray-500">Avg EBITDA / Property</p>
                  <p className="font-bold">{fmt(adjPostEBITDA / Math.max(propCount, 1))}</p>
                </div>
                <div>
                  <p className="text-gray-500">Avg EV / Property (mid)</p>
                  <p className="font-bold">{fmt((postEV_low + postEV_high) / 2 / Math.max(propCount, 1))}</p>
                </div>
                <div>
                  <p className="text-gray-500">Incremental Rev / Property</p>
                  <p className="font-bold text-emerald-400">{fmt(lift / Math.max(propCount, 1))}</p>
                </div>
              </div>
            </div>

            {/* What Jasper Tells the Client */}
            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Talk Track for Revenue Audit</h3>
              <div className="text-sm text-gray-300 space-y-2">
                <p>
                  "Your portfolio went from <span className="text-white font-semibold">{fmt(pre)}</span> to <span className="text-white font-semibold">{fmt(post)}</span> in gross bookings, a <span className="text-emerald-400 font-semibold">{(liftPct * 100).toFixed(0)}%</span> lift."
                </p>
                <p>
                  "That's not just revenue. At industry-standard margins for {ownedPct > 0.5 ? "owner-operators" : "lease-based operators"}, your estimated enterprise value moved from <span className="text-white font-semibold">{fmt((preEV_low+preEV_high)/2)}</span> to <span className="text-indigo-300 font-semibold">{fmt((postEV_low+postEV_high)/2)}</span>."
                </p>
                <p>
                  "You're paying us roughly <span className="text-white font-semibold">{fmt(annualFee)}/year</span>. We created <span className="text-emerald-400 font-semibold">{fmt((evLift_low+evLift_high)/2)}</span> in enterprise value. That's a <span className="text-emerald-400 font-semibold">{((roiLow+roiHigh)/2).toFixed(0)}x</span> return."
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Example Section */}
        <Divider />
        <h2 className="text-lg font-bold mb-6">Client Case Studies</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Utah */}
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-orange-600 flex items-center justify-center text-xs font-bold">UT</div>
              <div>
                <h3 className="font-bold">Utah Operator</h3>
                <p className="text-xs text-gray-500">STR Portfolio, Owner/Master-Leaser</p>
              </div>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b border-gray-800 pb-2">
                <span className="text-gray-400">Pre-Freewyld GBV</span>
                <span className="font-semibold">$1.37M</span>
              </div>
              <div className="flex justify-between border-b border-gray-800 pb-2">
                <span className="text-gray-400">Post-Freewyld GBV</span>
                <span className="font-semibold text-indigo-300">$2.60M</span>
              </div>
              <div className="flex justify-between border-b border-gray-800 pb-2">
                <span className="text-gray-400">Revenue Lift</span>
                <span className="font-semibold text-emerald-400">+90% ($1.23M)</span>
              </div>
              <div className="flex justify-between border-b border-gray-800 pb-2">
                <span className="text-gray-400">Est. EBITDA (30% margin)</span>
                <span className="font-semibold">$411K pre &rarr; $780K+ post</span>
              </div>
              <div className="flex justify-between border-b border-gray-800 pb-2">
                <span className="text-gray-400">EV Range (4-6x)</span>
                <span className="font-semibold">$1.6M pre &rarr; $3.1-4.7M post</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">EV Created</span>
                <span className="font-bold text-emerald-400">$1.5M - $2.6M</span>
              </div>
              <div className="bg-gray-800 rounded-lg p-3 mt-2">
                <p className="text-xs text-gray-400">At ~$74K/yr Freewyld fee, that's a <span className="text-emerald-400 font-bold">20-35x return</span> on the management fee in enterprise value created. The client moved from "lifestyle business" to "transactable asset."</p>
              </div>
            </div>
          </div>

          {/* Michigan */}
          <div className="bg-gray-900 rounded-2xl p-6 border border-indigo-700">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold">MI</div>
              <div>
                <h3 className="font-bold">Michigan Operator</h3>
                <p className="text-xs text-gray-500">Top 1% STR Portfolio, Owner/Master-Leaser</p>
              </div>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b border-gray-800 pb-2">
                <span className="text-gray-400">Pre-Freewyld GBV</span>
                <span className="font-semibold">$1.20M</span>
              </div>
              <div className="flex justify-between border-b border-gray-800 pb-2">
                <span className="text-gray-400">Post-Freewyld GBV</span>
                <span className="font-semibold text-indigo-300">$4.00M</span>
              </div>
              <div className="flex justify-between border-b border-gray-800 pb-2">
                <span className="text-gray-400">Revenue Lift</span>
                <span className="font-semibold text-emerald-400">+233% ($2.80M)</span>
              </div>
              <div className="flex justify-between border-b border-gray-800 pb-2">
                <span className="text-gray-400">Est. EBITDA (30% margin)</span>
                <span className="font-semibold">$360K pre &rarr; $1.2M+ post</span>
              </div>
              <div className="flex justify-between border-b border-gray-800 pb-2">
                <span className="text-gray-400">EV Range (5-7x)</span>
                <span className="font-semibold">$1.8M pre &rarr; $6.0-8.4M post</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">EV Created</span>
                <span className="font-bold text-emerald-400">$4.2M - $6.6M</span>
              </div>
              <div className="bg-indigo-900 bg-opacity-40 rounded-lg p-3 mt-2 border border-indigo-700">
                <p className="text-xs text-emerald-300 font-semibold mb-1">MULTIPLE BAND JUMP</p>
                <p className="text-xs text-gray-400">At ~$168K/yr fee, that's a <span className="text-emerald-400 font-bold">25-39x return</span> on the fee. This client crossed from "too small to sell" into "interesting to regional PE and rollup buyers." The 233% lift didn't just grow revenue. It changed the category of buyer who picks up the phone.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center text-xs text-gray-600 pb-8">
          Assumptions: Incremental revenue flows through at ~70% margin (operating costs largely fixed per night). EBITDA multiples based on PE diligence comps for single/multi-market STR operators. Actual EV requires audited financials, debt structure, property-level data, and market-specific cap rates. For Jasper's revenue audit report only.
        </div>
      </div>
    </div>
  );
}
