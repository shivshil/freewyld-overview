import { useState } from "react";
import EVCalculator from "./EVCalculator.jsx";
import BuildList from "./BuildList.jsx";

const sections = [
  "The Two Entities",
  "Revenue Streams",
  "Client Journey",
  "Daily Operations",
  "Team & Roles",
  "AI Opportunity Map",
  "Key Numbers",
  "STR Enterprise Value Calculator",
  "AI Build List",
];

// ─── Reusable Components ───────────────────────────────────────

function FlowArrow({ label, color = "#64748b", dashed = false }) {
  return (
    <div className="flex flex-col items-center my-1">
      <div
        className="w-0.5 h-6"
        style={{
          background: dashed
            ? `repeating-linear-gradient(to bottom, ${color} 0px, ${color} 4px, transparent 4px, transparent 8px)`
            : color,
        }}
      />
      {label && (
        <span className="text-xs px-2 py-0.5 rounded" style={{ color, background: `${color}11` }}>
          {label}
        </span>
      )}
      <div
        className="w-0 h-0"
        style={{
          borderLeft: "5px solid transparent",
          borderRight: "5px solid transparent",
          borderTop: `6px solid ${color}`,
        }}
      />
    </div>
  );
}

function Card({ title, children, accent = "#3b82f6", icon, badge, small = false }) {
  return (
    <div
      className="rounded-lg border relative overflow-hidden"
      style={{
        borderColor: `${accent}30`,
        background: `linear-gradient(135deg, ${accent}08, ${accent}03)`,
      }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-0.5"
        style={{ background: accent }}
      />
      <div className={small ? "p-3" : "p-4"}>
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            {icon && <span className="text-lg">{icon}</span>}
            <h3
              className={`font-semibold ${small ? "text-sm" : "text-base"}`}
              style={{ color: accent }}
            >
              {title}
            </h3>
          </div>
          {badge && (
            <span
              className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ background: `${accent}15`, color: accent }}
            >
              {badge}
            </span>
          )}
        </div>
        <div className="text-sm text-gray-300 leading-relaxed">{children}</div>
      </div>
    </div>
  );
}

function AITag({ children }) {
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-900/40 text-emerald-400 border border-emerald-800/50">
      <span>⚡</span> {children}
    </span>
  );
}

function Metric({ label, value, sub }) {
  return (
    <div className="text-center">
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="text-xs text-gray-400 mt-0.5">{label}</div>
      {sub && <div className="text-xs text-gray-500 mt-0.5">{sub}</div>}
    </div>
  );
}

function ConnectorLine({ from, to, color = "#475569" }) {
  return (
    <div
      className="absolute border-l-2 border-b-2 rounded-bl-lg"
      style={{ borderColor: color }}
    />
  );
}

// ─── Section Components ────────────────────────────────────────

function TwoEntities() {
  return (
    <div className="space-y-6">
      <p className="text-gray-400 text-sm leading-relaxed">
        Freewyld operates as <strong className="text-white">two distinct but symbiotic businesses</strong> under one umbrella. Understanding this duality is foundational — the hospitality brand proves the methodology that the agency sells.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl border border-amber-800/40 bg-gradient-to-br from-amber-950/30 to-amber-950/10 p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-amber-900/50 flex items-center justify-center text-xl">🏕️</div>
            <div>
              <h3 className="text-lg font-bold text-amber-400">Freewyld</h3>
              <span className="text-xs text-amber-600">Hospitality Brand</span>
            </div>
          </div>
          <div className="space-y-3 text-sm text-gray-300">
            <p>Experiential cabin company in <strong className="text-white">Idyllwild, California</strong>. They own and operate the properties themselves.</p>
            <div className="bg-black/30 rounded-lg p-3 space-y-1">
              <div className="flex justify-between"><span className="text-gray-400">RevPAR</span><span className="text-amber-400 font-semibold">$190</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Market avg</span><span className="text-gray-500">$97</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Occupancy</span><span className="text-amber-400 font-semibold">77%</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Market avg</span><span className="text-gray-500">40%</span></div>
            </div>
            <p className="text-amber-500/80 text-xs italic">Nearly 2x market performance = credibility engine for the agency</p>
            <div className="border-t border-amber-900/30 pt-2 mt-2">
              <p className="text-xs text-gray-500"><strong className="text-gray-400">Expansion:</strong> Phase 2 = 15 more cabins in Idyllwild + scouting Sedona, AZ. Capital-intensive.</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-blue-800/40 bg-gradient-to-br from-blue-950/30 to-blue-950/10 p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-blue-900/50 flex items-center justify-center text-xl">📊</div>
            <div>
              <h3 className="text-lg font-bold text-blue-400">Freewyld Foundry</h3>
              <span className="text-xs text-blue-600">Revenue Management Agency</span>
            </div>
          </div>
          <div className="space-y-3 text-sm text-gray-300">
            <p>Revenue management service for <strong className="text-white">top 1% of STR operators</strong>. This is the core business you're building AI for.</p>
            <div className="bg-black/30 rounded-lg p-3 space-y-1">
              <div className="flex justify-between"><span className="text-gray-400">Managed revenue</span><span className="text-blue-400 font-semibold">$126M+/yr</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Clients</span><span className="text-blue-400 font-semibold">55+</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Listings</span><span className="text-blue-400 font-semibold">Thousands</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Own revenue (est.)</span><span className="text-blue-400 font-semibold">~$25M/yr</span></div>
            </div>
            <p className="text-blue-500/80 text-xs italic">The $25M = Foundry's cut. They manage $126M total for clients.</p>
            <div className="border-t border-blue-900/30 pt-2 mt-2">
              <p className="text-xs text-gray-500"><strong className="text-gray-400">10-Year BHAG:</strong> $1.2 BILLION revenue under management</p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-gray-700/50 bg-gray-900/50 p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-amber-400">🏕️</span>
          <span className="text-gray-500 mx-1">→</span>
          <span className="text-xs text-gray-400">proves methodology</span>
          <span className="text-gray-500 mx-1">→</span>
          <span className="text-blue-400">📊</span>
          <span className="text-gray-500 mx-1">→</span>
          <span className="text-xs text-gray-400">sells to operators</span>
          <span className="text-gray-500 mx-1">→</span>
          <span className="text-green-400">💰</span>
        </div>
        <p className="text-xs text-gray-500">The Freewyld cabins aren't a side project — they're the proof-of-concept that closes RPM deals. "We don't just advise, we operate." The performance guarantee ("we'll increase your revenue or you don't pay") is credible because they beat the market 2x with their own properties.</p>
      </div>
    </div>
  );
}

function RevenueStreams() {
  const streams = [
    {
      name: "RPM Service",
      icon: "📊",
      color: "#3b82f6",
      revenue: "Core ($$$)",
      desc: "Revenue & Pricing Management — they take over daily pricing, strategy, and optimization for operators doing $1M+/year in bookings.",
      details: ["Minimum: $1M annual booking revenue", "Ideal client: owners/master-leasers (not pure PMs)", "Fee: unpublished — likely % of revenue or incremental revenue", "Performance guarantee: increase revenue or you don't pay", "Results: 10-20% typical, up to 233% in case studies"],
      ai: "Primary AI target. Automating data workflows, audit reports, and pricing recommendations directly increases manager capacity."
    },
    {
      name: "Cashflow Mastery",
      icon: "📚",
      color: "#f59e0b",
      revenue: "Course ($$)",
      desc: "DIY pricing course for operators below the $1M RPM threshold. Teaches the methodology so they can do it themselves — until they grow into RPM clients.",
      details: ["Target: sub-$1M operators", "Pricing: gated/unpublished", "Content: STR pricing fundamentals, tool setup, strategy basics"],
      ai: "Future opportunity. AI could personalize course recommendations or create a lightweight pricing assistant for this tier."
    },
    {
      name: "Foundry Mastermind",
      icon: "🤝",
      color: "#8b5cf6",
      revenue: "Community ($$)",
      desc: "Paid community for scaling STR entrepreneurs. Launched 2024-2025. Members get access to Eric, Jasper, and Kaye plus peer group.",
      details: ["Application-only", "Pricing: gated", "5+ year members documented (from legacy 'Overnight Success' program)", "Feeds RPM pipeline: grow your portfolio → cross $1M → become RPM client"],
      ai: "Low priority for AI. Community value is human connection and access."
    },
    {
      name: "Partner Program",
      icon: "🏗️",
      color: "#06b6d4",
      revenue: "Expansion ($$)",
      desc: "Freewyld partners with real estate developers/landowners as the 'flag' (brand) and operating arm. Capital-light hospitality expansion modeled on Marriott.",
      details: ["Developer brings property, Freewyld brings brand + operations", "Revenue share model", "Expands Freewyld cabin footprint without capital risk"],
      ai: "Minimal AI relevance currently."
    },
    {
      name: "Podcast & Content",
      icon: "🎙️",
      color: "#ec4899",
      revenue: "Funnel ($)",
      desc: "'Get Paid For Your Pad' — 1.9M+ downloads, 690+ episodes, 2x/week. Hosted by Jasper, Eric, and Kaye. Powers the entire sales funnel.",
      details: ["10K+ newsletter subscribers", "Monday = 'RevUp' pricing education (Jasper)", "Friday = guest interviews + strategy (Kaye/Eric)", "Every episode ends with RPM CTA", "Acast ad revenue (programmatic)"],
      ai: "AI can help with show notes, content repurposing, and newsletter automation. But Kaye already uses Claude for this."
    },
  ];

  return (
    <div className="space-y-6">
      <p className="text-gray-400 text-sm leading-relaxed">
        Five revenue streams that <strong className="text-white">feed each other in a flywheel</strong>. The podcast educates → Cashflow Mastery trains sub-$1M operators → they grow into RPM clients → their success stories become podcast content → new leads enter the funnel.
      </p>

      <div className="space-y-3">
        {streams.map((s, i) => (
          <StreamCard key={i} stream={s} />
        ))}
      </div>

      <div className="rounded-lg border border-emerald-800/40 bg-emerald-950/20 p-4">
        <div className="flex items-center gap-2 mb-2">
          <AITag>Future 6th Stream</AITag>
        </div>
        <p className="text-sm text-gray-300">
          If the pricing methodology gets encoded in AI → <strong className="text-white">SaaS pricing tool for ANY STR operator</strong> (not just $1M+). TAM explodes from hundreds of potential clients to millions. Different business model (software vs. agency), same foundation. This is the long-term play.
        </p>
      </div>

      <div className="rounded-lg bg-gray-900/50 border border-gray-700/50 p-4">
        <h4 className="text-sm font-semibold text-gray-300 mb-3">The Flywheel</h4>
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="bg-pink-900/30 text-pink-400 px-2 py-1 rounded">🎙️ Podcast</span>
          <span className="text-gray-600">→</span>
          <span className="bg-amber-900/30 text-amber-400 px-2 py-1 rounded">📚 Course</span>
          <span className="text-gray-600">→</span>
          <span className="bg-purple-900/30 text-purple-400 px-2 py-1 rounded">🤝 Mastermind</span>
          <span className="text-gray-600">→</span>
          <span className="bg-blue-900/30 text-blue-400 px-2 py-1 rounded">📊 RPM ($1M+)</span>
          <span className="text-gray-600">→</span>
          <span className="bg-green-900/30 text-green-400 px-2 py-1 rounded">📈 Case Study</span>
          <span className="text-gray-600">→</span>
          <span className="bg-pink-900/30 text-pink-400 px-2 py-1 rounded">🎙️ Podcast</span>
        </div>
      </div>
    </div>
  );
}

function StreamCard({ stream }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="rounded-lg border cursor-pointer transition-all"
      style={{ borderColor: `${stream.color}25`, background: `${stream.color}05` }}
      onClick={() => setOpen(!open)}
    >
      <div className="p-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xl">{stream.icon}</span>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-white">{stream.name}</span>
              <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: `${stream.color}15`, color: stream.color }}>{stream.revenue}</span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{stream.desc}</p>
          </div>
        </div>
        <span className="text-gray-600 text-xs">{open ? "▲" : "▼"}</span>
      </div>
      {open && (
        <div className="px-3 pb-3 border-t" style={{ borderColor: `${stream.color}15` }}>
          <ul className="mt-2 space-y-1">
            {stream.details.map((d, i) => (
              <li key={i} className="text-xs text-gray-400 flex items-start gap-1.5">
                <span className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0" style={{ background: stream.color }} />
                {d}
              </li>
            ))}
          </ul>
          {stream.ai && (
            <div className="mt-2 p-2 rounded bg-emerald-950/30 border border-emerald-900/30">
              <div className="flex items-center gap-1 mb-1"><AITag>AI Relevance</AITag></div>
              <p className="text-xs text-gray-400">{stream.ai}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ClientJourney() {
  const stages = [
    {
      stage: "AWARENESS",
      color: "#ec4899",
      icon: "🎙️",
      channels: "Podcast (1.9M downloads), Newsletter (10K+), VRMA conferences, Word-of-mouth, Book",
      what: "Operator hears about Freewyld through content or industry events. Learns pricing language (RevPAR, MPI, pacing).",
      volume: "Tens of thousands",
      ai: null,
    },
    {
      stage: "EDUCATION",
      color: "#f59e0b",
      icon: "📚",
      channels: "RevUp Monday episodes, Cashflow Mastery course, Blog, Workshops",
      what: "Sub-$1M operators learn methodology, implement basics themselves. Podcast teaches enough to show them what they're missing.",
      volume: "Thousands",
      ai: null,
    },
    {
      stage: "QUALIFICATION",
      color: "#06b6d4",
      icon: "🔍",
      channels: "Free Revenue Report at freewyldfoundry.com/report",
      what: "Operator applies for free audit. Must hit $1M+ bookings. Eric does qualifying touch (CEO call). Jasper pulls data from their pricing tool and analyzes.",
      volume: "~40/month (Jasper's manual capacity)",
      ai: "🔥 BOTTLENECK. Jasper manually does every audit. Automating data pull + analysis = major unlock.",
    },
    {
      stage: "PRESENTATION",
      color: "#8b5cf6",
      icon: "📊",
      channels: "Revenue Report delivery call",
      what: "Jasper presents findings: typically 10-20% upside potential. Shows specific gaps in pricing strategy. Extends offer to qualified prospects.",
      volume: "Majority of audits show opportunity",
      ai: "🔥 Auto-generating the report with AI means Jasper reviews instead of builds from scratch.",
    },
    {
      stage: "ONBOARDING",
      color: "#3b82f6",
      icon: "🤝",
      channels: "RPM Service kickoff",
      what: "Rev manager assigned. Gets access to client's pricing tool (PriceLabs, Wheelhouse, Beyond). Builds comp sets, develops strategy, starts daily management.",
      volume: "55+ active clients",
      ai: "Template automation, comp set generation, and initial strategy scaffolding could accelerate onboarding.",
    },
    {
      stage: "ONGOING SERVICE",
      color: "#10b981",
      icon: "📈",
      channels: "Every listing, every day",
      what: "Daily pricing adjustments, weekly pacing reviews, monthly performance reports, quarterly strategy calls. This is where the revenue lift happens.",
      volume: "Thousands of listings, daily",
      ai: "🔥 PRIMARY TARGET. Automating data downloads, Excel processing, and anomaly detection = managers handle 12-15 clients vs 10.",
    },
    {
      stage: "EXPANSION",
      color: "#f97316",
      icon: "🔄",
      channels: "Case studies, podcast episodes, referrals",
      what: "Successful clients become case studies. Their stories air on the podcast. They refer other operators. The flywheel spins.",
      volume: "Featured: Utah (+90%), Florida (+64%), Michigan (+233%)",
      ai: "Auto-generating case study data from client performance metrics.",
    },
  ];

  return (
    <div className="space-y-4">
      <p className="text-gray-400 text-sm leading-relaxed">
        The journey from "who is Freewyld?" to "we manage your revenue daily." Red fire icons mark where <strong className="text-white">AI creates the most leverage</strong>.
      </p>

      <div className="space-y-1">
        {stages.map((s, i) => (
          <div key={i}>
            <div className="rounded-lg border p-3" style={{ borderColor: `${s.color}25`, background: `${s.color}05` }}>
              <div className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm" style={{ background: `${s.color}20` }}>
                    {s.icon}
                  </div>
                  <span className="text-xs font-bold mt-1" style={{ color: s.color }}>{i + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm" style={{ color: s.color }}>{s.stage}</span>
                    {s.ai && <AITag>AI Lever</AITag>}
                  </div>
                  <p className="text-xs text-gray-300 mt-1">{s.what}</p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs">
                    <span className="text-gray-500"><strong className="text-gray-400">Channels:</strong> {s.channels}</span>
                    <span className="text-gray-500"><strong className="text-gray-400">Volume:</strong> {s.volume}</span>
                  </div>
                  {s.ai && <p className="text-xs text-emerald-400/80 mt-1.5">{s.ai}</p>}
                </div>
              </div>
            </div>
            {i < stages.length - 1 && <FlowArrow color={s.color} />}
          </div>
        ))}
      </div>
    </div>
  );
}

function DailyOps() {
  return (
    <div className="space-y-6">
      <p className="text-gray-400 text-sm leading-relaxed">
        This is the engine room — what a revenue manager actually does every day. Understanding this is critical because <strong className="text-white">this is exactly what you're automating</strong>.
      </p>

      <div className="rounded-xl border border-gray-700/50 bg-gray-900/40 p-4">
        <h4 className="text-sm font-semibold text-white mb-3">A Revenue Manager's Week</h4>
        
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-orange-900/30 text-orange-400">DAILY</span>
              <span className="text-xs text-gray-500">30-60 min per manager</span>
            </div>
            <div className="grid gap-2">
              {[
                { task: "Log into each client's pricing tool", tools: "PriceLabs, Wheelhouse, Beyond", ai: true, pain: "10 clients × different logins" },
                { task: "Review new bookings from overnight", tools: "PMS data, OTA dashboards", ai: true, pain: "Looking for anomalies, setting errors" },
                { task: "Check for unbookable nights & gaps", tools: "Calendar views", ai: true, pain: "Manual calendar scanning" },
                { task: "Adjust last-minute inventory pricing", tools: "Pricing tool overrides", ai: true, pain: "Judgment call on each listing" },
                { task: "Monitor rate positioning vs comp set", tools: "Market data, AirDNA, etc.", ai: true, pain: "~40 properties to check" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 bg-black/30 rounded p-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-200">{item.task}</p>
                    <p className="text-xs text-gray-600">{item.pain}</p>
                  </div>
                  {item.ai && <AITag>Automate</AITag>}
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-900/30 text-blue-400">WEEKLY</span>
              <span className="text-xs text-gray-500">2-3 hours per manager</span>
            </div>
            <div className="grid gap-2">
              {[
                { task: "Download ~40 Excel reports per manager", ai: true, pain: "The grind. Manual export from each tool per client." },
                { task: "Pacing analysis using Market Penetration Index (MPI)", ai: true, pain: "Compare forward occupancy to market. Core KPI." },
                { task: "Adjust prices based on demand signals", ai: false, pain: "Requires human judgment — for now" },
                { task: "Portfolio-level performance tracking", ai: true, pain: "Aggregating across clients and listings" },
                { task: "Protect peak demand minimum night stays", ai: true, pain: "Holiday/event strategy enforcement" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 bg-black/30 rounded p-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-200">{item.task}</p>
                    <p className="text-xs text-gray-600">{item.pain}</p>
                  </div>
                  {item.ai && <AITag>Automate</AITag>}
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-purple-900/30 text-purple-400">MONTHLY</span>
            </div>
            <div className="grid gap-2">
              {[
                { task: "Client performance reports", ai: true, pain: "Data compilation across all listings per client" },
                { task: "Strategy calls with clients", ai: false, pain: "Human relationship — core value delivery" },
                { task: "Market comp set analysis updates", ai: true, pain: "New listings, seasonal shifts, market changes" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 bg-black/30 rounded p-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-200">{item.task}</p>
                    <p className="text-xs text-gray-600">{item.pain}</p>
                  </div>
                  {item.ai ? <AITag>Automate</AITag> : <span className="text-xs px-2 py-0.5 rounded-full bg-gray-800 text-gray-500">Human</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-red-800/30 bg-red-950/15 p-4">
        <h4 className="text-sm font-semibold text-red-400 mb-2">⚠️ The Excel Grind (Target #1)</h4>
        <p className="text-xs text-gray-300 leading-relaxed">
          Each revenue manager downloads roughly <strong className="text-white">40 Excel spreadsheets per week</strong> across their 10 clients (~4 properties each). These come from different pricing tools, PMSes, and OTA dashboards. The downloads → organization → analysis cycle burns <strong className="text-white">2.5-5 hours/week per manager</strong>. This is pure mechanical work with zero judgment required. Automating this alone gets each manager from 10 to 12-15 clients.
        </p>
      </div>

      <div className="rounded-lg border border-gray-700/40 bg-gray-900/40 p-4">
        <h4 className="text-sm font-semibold text-gray-300 mb-2">The Consulting Layer (Beyond Pricing)</h4>
        <p className="text-xs text-gray-400 leading-relaxed">
          Rev managers don't just set prices. They also consult on marketing & messaging optimization, listing copy and photos, minimum night stay strategy, comp set selection, OTA strategy (Airbnb vs VRBO vs Booking.com), and seasonal positioning. This consulting layer is high-value, human-judgment work that AI augments but doesn't replace.
        </p>
      </div>
    </div>
  );
}

function TeamRoles() {
  const team = [
    {
      name: "Eric Moeller",
      role: "CEO",
      color: "#3b82f6",
      focus: "Vision, scaling, strategic planning, sales qualification",
      notes: "Runs the business on Scaling Up / 7 Strata framework. First touch on sales calls. Publicly AI-positive. Your primary client contact.",
      aiRelevance: "High — shapes priorities, allocates resources, approves what ships"
    },
    {
      name: "Jasper Ribbers",
      role: "Head of Revenue Management",
      color: "#f59e0b",
      focus: "Pricing methodology, revenue audits, team training, podcast (RevUp)",
      notes: "Equity trading + econometrics (Groningen) background. The quantitative brain. Manually does all revenue audits (~40/month). Wrote the book. Hiring Revenue Growth Strategists.",
      aiRelevance: "Critical — his methodology IS what you're encoding. His bottleneck (audits) is your automation target."
    },
    {
      name: "Kaye Putnam",
      role: "CMO / Head of Marketing",
      color: "#ec4899",
      focus: "Marketing, content, podcast interviews, brand, website",
      notes: "Rebuilt entire website with Claude in one week. Has her own podcast background. All-in on AI/vibe-coding. Your Wednesday collaborator.",
      aiRelevance: "High — already using AI tools. Marketing automation scope. Direct working relationship."
    },
    {
      name: "Miles",
      role: "Revenue Manager + AI Champion",
      color: "#10b981",
      focus: "Client portfolio management + 20% allocated to AI tools",
      notes: "Basic technical knowledge, 'getting obsessed with AI.' Your inside champion on the rev manager team. Can validate if AI tools actually fit the workflow.",
      aiRelevance: "Your testing partner. If Miles can use it, any rev manager can."
    },
    {
      name: "~10 Revenue Managers",
      role: "RPM Team",
      color: "#64748b",
      focus: "Daily pricing management for 10 clients each (~40 properties per manager)",
      notes: "Varying technical skill levels. The people whose workflows you're automating. Their buy-in determines adoption.",
      aiRelevance: "End users. Every tool you build needs to serve them without adding complexity."
    },
    {
      name: "Ilias",
      role: "Full-Stack Engineer (External)",
      color: "#8b5cf6",
      focus: "Technical implementation across Shiv's clients",
      notes: "Shared resource — works across both Eric and Ryan's projects. Has multiple commitments. Finite capacity requires careful allocation.",
      aiRelevance: "Builds what you design. Protect his time. Spec thoroughly before assigning."
    },
  ];

  return (
    <div className="space-y-4">
      <p className="text-gray-400 text-sm leading-relaxed">
        Who does what, and how they relate to your AI work. The team is small but specialized.
      </p>

      <div className="space-y-3">
        {team.map((t, i) => (
          <div key={i} className="rounded-lg border p-3" style={{ borderColor: `${t.color}25`, background: `${t.color}05` }}>
            <div className="flex items-start justify-between mb-1.5">
              <div>
                <span className="font-semibold text-sm text-white">{t.name}</span>
                <span className="text-xs ml-2 px-1.5 py-0.5 rounded" style={{ background: `${t.color}15`, color: t.color }}>{t.role}</span>
              </div>
            </div>
            <p className="text-xs text-gray-400 mb-1"><strong className="text-gray-300">Focus:</strong> {t.focus}</p>
            <p className="text-xs text-gray-500 mb-1.5">{t.notes}</p>
            <div className="flex items-center gap-1">
              <AITag>{t.aiRelevance}</AITag>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AIOpportunityMap() {
  const opportunities = [
    {
      priority: 1,
      name: "Excel Data Workflow Automation",
      target: "Revenue Managers",
      impact: "Capacity: 10 → 12-15 clients per manager",
      difficulty: "Medium",
      color: "#ef4444",
      timeline: "Weeks 1-4",
      what: "Auto-download, organize, and pre-analyze the ~40 Excel sheets each manager processes weekly. Pull from PriceLabs, Wheelhouse, Beyond, PMSes, OTAs. Normalize data into a single dashboard view.",
      metric: "Hours saved per manager per week (target: 2.5-5 hrs)",
      risk: "Each client uses different tools, different configurations. Must handle variance.",
      unlocks: "Direct margin improvement: same headcount serves 25-50% more clients"
    },
    {
      priority: 2,
      name: "Revenue Audit Automation",
      target: "Jasper (sales bottleneck)",
      impact: "Sales pipeline: unclog from ~40/month",
      difficulty: "Medium-High",
      color: "#f59e0b",
      timeline: "Weeks 3-8",
      what: "Automate the 'Snapshot' process: pull prospect's data from their pricing tool → analyze against Jasper's methodology → generate revenue report with upside estimate. Jasper reviews & presents instead of building from scratch.",
      metric: "Audits per month (current: ~40, target: 100+)",
      risk: "The performance guarantee means this can't hallucinate upside. Must be accurate against historical data. Jasper's credibility is on the line.",
      unlocks: "Sales capacity scales independently of Jasper's calendar"
    },
    {
      priority: 3,
      name: "Seasonality Pricing Agent",
      target: "Revenue Managers + Clients",
      impact: "Revenue optimization at scale",
      difficulty: "High",
      color: "#8b5cf6",
      timeline: "Months 2-4+",
      what: "Agent that adjusts prices based on encoded rules: MPI thresholds, pickup pacing, holiday overrides, event detection, comp set movement. Jasper's 5-mistake checklist becomes the rule engine.",
      metric: "RevPAR improvement, ADR lift, booking window optimization",
      risk: "The 'every listing, every day' promise means this must be reliable. Bad pricing = client churn + guarantee payouts. Must have human oversight.",
      unlocks: "Foundation for SaaS pricing tool (the 6th revenue stream)"
    },
  ];

  const checklist = [
    "Max prices capping upside",
    "Unbookable nights killing demand",
    "Weak minimum strategies missing peak revenue",
    "Restrictive stays reducing ADR",
    "Ignoring pacing leaving money on the table",
  ];

  return (
    <div className="space-y-6">
      <p className="text-gray-400 text-sm leading-relaxed">
        Three AI priorities in order of implementation. Each builds on the last. The guiding principle: <strong className="text-white">ship measurable solutions that directly impact client capacity and revenue</strong>. Not platforms. Not ecosystems. Concrete tools.
      </p>

      <div className="space-y-4">
        {opportunities.map((o, i) => (
          <div key={i} className="rounded-xl border p-4" style={{ borderColor: `${o.color}30`, background: `${o.color}05` }}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm" style={{ background: `${o.color}20`, color: o.color }}>
                  P{o.priority}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">{o.name}</h4>
                  <span className="text-xs text-gray-500">{o.timeline}</span>
                </div>
              </div>
              <span className="text-xs px-2 py-0.5 rounded" style={{ background: `${o.color}15`, color: o.color }}>
                {o.difficulty}
              </span>
            </div>

            <p className="text-xs text-gray-300 mb-3">{o.what}</p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <div className="bg-black/30 rounded p-2">
                <span className="text-gray-500 block mb-0.5">Target</span>
                <span className="text-gray-300">{o.target}</span>
              </div>
              <div className="bg-black/30 rounded p-2">
                <span className="text-gray-500 block mb-0.5">Impact</span>
                <span className="text-gray-300">{o.impact}</span>
              </div>
              <div className="bg-black/30 rounded p-2">
                <span className="text-gray-500 block mb-0.5">KPI</span>
                <span className="text-gray-300">{o.metric}</span>
              </div>
            </div>

            <div className="mt-2 p-2 rounded bg-red-950/20 border border-red-900/20">
              <span className="text-xs font-semibold text-red-400">⚠️ Risk: </span>
              <span className="text-xs text-gray-400">{o.risk}</span>
            </div>

            <div className="mt-2 p-2 rounded bg-emerald-950/20 border border-emerald-900/20">
              <span className="text-xs font-semibold text-emerald-400">✓ Unlocks: </span>
              <span className="text-xs text-gray-400">{o.unlocks}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-amber-800/30 bg-amber-950/15 p-4">
        <h4 className="text-sm font-semibold text-amber-400 mb-2">Jasper's 5-Mistake Checklist (Ep 692)</h4>
        <p className="text-xs text-gray-400 mb-2">This is literally your audit automation spec. Every revenue report should check for:</p>
        <div className="space-y-1.5">
          {checklist.map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-xs">
              <span className="w-5 h-5 rounded flex items-center justify-center bg-amber-900/30 text-amber-400 font-bold text-xs">{i + 1}</span>
              <span className="text-gray-300">{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-gray-700/40 bg-gray-900/30 p-4">
        <h4 className="text-sm font-semibold text-gray-300 mb-2">🛡️ Critical Guardrails</h4>
        <div className="space-y-2 text-xs text-gray-400">
          <p><strong className="text-white">Performance guarantee:</strong> "We'll increase your revenue or you don't pay." AI tools must deliver actual results, not just efficiency. Bad recommendations trigger refunds.</p>
          <p><strong className="text-white">"Every listing, every day":</strong> This is their brand promise. AI can't be set-and-forget — that's what they sell AGAINST (pricing tools alone). Human oversight is part of the value prop.</p>
          <p><strong className="text-white">Client diversity:</strong> Each client uses different pricing tools, PMSes, OTAs, and has different property types. No one-size-fits-all automation.</p>
          <p><strong className="text-white">Public narrative:</strong> Eric is telling his podcast audience that AI removes repeatable work so humans can focus on reasoning. The tools will be discussed on-air. Build explainably.</p>
        </div>
      </div>
    </div>
  );
}

function KeyNumbers() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Metric value="$126M+" label="Annual Bookings Managed" />
        <Metric value="55+" label="Active Clients" />
        <Metric value="~$25M" label="Foundry Own Revenue (est.)" />
        <Metric value="$1.2B" label="10-Year BHAG" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Metric value="~10" label="Revenue Managers" />
        <Metric value="~40" label="Properties per Manager" />
        <Metric value="10" label="Clients per Manager" />
        <Metric value="12-15" label="Target w/ AI" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Metric value="40%" label="Current Profit Margin" />
        <Metric value="50-60%" label="Target Margin w/ AI" />
        <Metric value="$5M" label="New Revenue This Year" />
        <Metric value="$6K/mo" label="Your Engagement" />
      </div>

      <div className="rounded-xl border border-gray-700/50 bg-gray-900/40 p-4">
        <h4 className="text-sm font-semibold text-white mb-3">Podcast & Content Engine</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Metric value="1.9M+" label="Podcast Downloads" />
          <Metric value="690+" label="Total Episodes" />
          <Metric value="2x/wk" label="Publishing Cadence" />
          <Metric value="10K+" label="Newsletter Subs" />
        </div>
      </div>

      <div className="rounded-xl border border-gray-700/50 bg-gray-900/40 p-4">
        <h4 className="text-sm font-semibold text-white mb-3">RPM Service Performance</h4>
        <div className="space-y-2">
          {[
            { label: "Typical result", value: "10-20% revenue increase", color: "#3b82f6" },
            { label: "Utah case study", value: "$1.37M → $2.6M (+90%)", color: "#10b981" },
            { label: "Florida case study", value: "$1M → $1.6M (+64%)", color: "#10b981" },
            { label: "Michigan case study", value: "$1.2M → $4M (+233%)", color: "#10b981" },
            { label: "Client threshold", value: "$1M+ annual bookings", color: "#f59e0b" },
            { label: "World Cup booking", value: "$1,718/night (2BR, Philly)", color: "#8b5cf6" },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between text-xs bg-black/30 rounded px-3 py-2">
              <span className="text-gray-400">{item.label}</span>
              <span className="font-semibold" style={{ color: item.color }}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-amber-800/30 bg-amber-950/15 p-4">
        <h4 className="text-sm font-semibold text-amber-400 mb-2">The Math That Matters for AI</h4>
        <div className="space-y-2 text-xs text-gray-300 leading-relaxed">
          <p><strong className="text-white">Manager capacity unlock:</strong> 10 managers × (12-15 clients vs 10) = 20-50 more clients at current headcount. If avg client = $2.3M managed revenue, that's $46-115M additional AUM with zero new hires.</p>
          <p><strong className="text-white">Audit bottleneck unlock:</strong> Jasper at 40/month → 100+/month. If 30% convert, that's 18 new clients/month vs 12. At ~$25K/yr per client (est.), that's $150K/month in new recurring revenue.</p>
          <p><strong className="text-white">Margin improvement:</strong> 40% → 55% on $25M = $3.75M additional profit on the same revenue base.</p>
        </div>
      </div>

      <div className="rounded-lg border border-gray-700/40 bg-gray-900/30 p-4">
        <h4 className="text-sm font-semibold text-gray-300 mb-2">Operating System</h4>
        <p className="text-xs text-gray-400">Running <strong className="text-white">Verne Harnish's Scaling Up framework</strong>: 7 Strata strategic plan, quarterly Rocks, weekly huddles, one-page strategic plan, BHAGs. This means Eric thinks in 90-day execution cycles. Align your deliverables to their Rocks cadence.</p>
      </div>
    </div>
  );
}

// ─── Main App ──────────────────────────────────────────────────

export default function FreewyldOverview() {
  const [activeSection, setActiveSection] = useState(0);

  const renderSection = () => {
    switch (activeSection) {
      case 0: return <TwoEntities />;
      case 1: return <RevenueStreams />;
      case 2: return <ClientJourney />;
      case 3: return <DailyOps />;
      case 4: return <TeamRoles />;
      case 5: return <AIOpportunityMap />;
      case 6: return <KeyNumbers />;
      case 7: return <EVCalculator />;
      case 8: return <BuildList />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-gray-600">BUSINESS INTELLIGENCE</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            Freewyld Foundry
            <span className="text-blue-400 ml-2 text-lg font-normal">Complete Overview</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Everything you need to know — from business model to daily operations to AI opportunities.
          </p>
        </div>

        {/* Navigation */}
        <div className="flex flex-wrap gap-1.5 mb-6 sticky top-0 bg-gray-950/95 backdrop-blur-sm py-2 z-10">
          {sections.map((s, i) => (
            <button
              key={i}
              onClick={() => setActiveSection(i)}
              className={`text-xs px-3 py-1.5 rounded-full transition-all font-medium ${
                activeSection === i
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800/60 text-gray-400 hover:bg-gray-700/60 hover:text-gray-300"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Section Title */}
        <div className="mb-4">
          <h2 className="text-lg font-bold text-white">{sections[activeSection]}</h2>
        </div>

        {/* Content */}
        {renderSection()}

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-gray-800/50 text-xs text-gray-600">
          <p>Compiled from: website analysis, podcast catalog (690+ episodes), project transcripts, LinkedIn research, Acast data, Google reviews, VRMA conference intel. Last updated Feb 2026.</p>
        </div>
      </div>
    </div>
  );
}
