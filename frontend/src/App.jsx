import { useState } from 'react'
import {
  LayoutDashboard,
  Camera,
  BarChart2,
  BellRing,
  Settings,
  Users,
  Flame,
  Wind,
  ShieldAlert,
  Video,
  AlertTriangle,
  Info,
  CheckCircle2,
  Activity,
  ChevronRight,
} from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

// ─── Data ────────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard' },
  { icon: Camera,          label: 'Cameras'   },
  { icon: BarChart2,       label: 'Analytics' },
  { icon: BellRing,        label: 'Alerts'    },
  { icon: Settings,        label: 'Settings'  },
]

const METRIC_CARDS = [
  {
    icon:   Users,
    label:  'Total Footfall',
    sub:    'YOLOv10 Tracking',
    value:  '12,450',
    delta:  '+3.2% vs yesterday',
    color:  'text-emerald-400',
    bg:     'bg-emerald-400/10',
    border: 'border-emerald-400/20',
  },
  {
    icon:   Flame,
    label:  'Garbhagriha Density',
    sub:    'CSRNet Estimation',
    value:  '85%',
    delta:  '⚠ High — monitor closely',
    color:  'text-orange-400',
    bg:     'bg-orange-400/10',
    border: 'border-orange-400/20',
  },
  {
    icon:   Wind,
    label:  'Flow Rate',
    sub:    'Optical Flow Analysis',
    value:  '45 /min',
    delta:  'Stable movement',
    color:  'text-sky-400',
    bg:     'bg-sky-400/10',
    border: 'border-sky-400/20',
  },
  {
    icon:   ShieldAlert,
    label:  'Critical Alerts',
    sub:    'Last 30 minutes',
    value:  '04',
    delta:  '2 unacknowledged',
    color:  'text-red-400',
    bg:     'bg-red-400/10',
    border: 'border-red-400/20',
  },
]

const FOOTFALL_DATA = [
  { time: '8 AM',  footfall: 120  },
  { time: '9 AM',  footfall: 340  },
  { time: '10 AM', footfall: 680  },
  { time: '11 AM', footfall: 1100 },
  { time: '12 PM', footfall: 1800 },
  { time: '1 PM',  footfall: 2400 },
  { time: '2 PM',  footfall: 2100 },
  { time: '3 PM',  footfall: 1600 },
  { time: '4 PM',  footfall: 1950 },
  { time: '5 PM',  footfall: 2800 },
  { time: '6 PM',  footfall: 3200 },
  { time: '7 PM',  footfall: 2600 },
]

const CAMERAS = [
  {
    id:          1,
    title:       'Camera 1 — Entry Gate',
    model:       'YOLOv10 Tracking',
    status:      'Live',
    count:       '38 persons detected',
    color:       'text-emerald-400',
    dot:         'bg-emerald-400',
    videoSrc:    '/yolo_output.mp4',
    fallbackSrc: '/yolo_fallback.jpg',
    warning:     false,
  },
  {
    id:          2,
    title:       'Camera 2 — Main Hall / Garbhagriha',
    model:       'CSRNet Heatmap',
    status:      'Live',
    count:       'Density: 85% — High',
    color:       'text-orange-400',
    dot:         'bg-orange-400',
    videoSrc:    '/heatmap_output.mp4',
    fallbackSrc: '/heatmap_fallback.jpg',
    warning:     true,
  },
]

const LOGS = [
  {
    type:    'warning',
    icon:    AlertTriangle,
    color:   'text-orange-400',
    bg:      'bg-orange-400/10',
    time:    '14:32:05',
    message: 'High density detected in Garbhagriha (89%). Approaching critical threshold.',
  },
  {
    type:    'alert',
    icon:    ShieldAlert,
    color:   'text-red-400',
    bg:      'bg-red-400/10',
    time:    '14:30:48',
    message: 'Optical flow detected counter-movement near Gate 2. Possible crowd surge.',
  },
  {
    type:    'info',
    icon:    Info,
    color:   'text-sky-400',
    bg:      'bg-sky-400/10',
    time:    '14:28:11',
    message: 'Normal flow resumed at Exit A. Density dropped to 42%.',
  },
  {
    type:    'alert',
    icon:    ShieldAlert,
    color:   'text-red-400',
    bg:      'bg-red-400/10',
    time:    '14:25:33',
    message: 'Crowd count exceeded 500 at Entry Gate. Alert dispatched to authorities.',
  },
  {
    type:    'info',
    icon:    CheckCircle2,
    color:   'text-emerald-400',
    bg:      'bg-emerald-400/10',
    time:    '14:20:00',
    message: 'System health check passed. All camera feeds operational.',
  },
]

// ─── Dhwaja (Temple Flag) SVG ─────────────────────────────────────────────────

function Dhwaja() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-orange-500 mr-2 shrink-0"
    >
      <path
        d="M4 2V22M4 4L20 9L10 12L20 17L4 20"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// ─── Placeholder for non-Dashboard tabs ──────────────────────────────────────

function TabPlaceholder({ tab }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center p-10">
      <div className="w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
        <Activity className="w-8 h-8 text-orange-400" />
      </div>
      <h2 className="text-xl font-bold text-white">{tab} Module</h2>
      <p className="text-slate-400 text-sm max-w-xs">
        Syncing with edge devices... This module will be available in the next release.
      </p>
      <div className="flex items-center gap-2 mt-2">
        <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
        <span className="text-xs text-orange-400 font-medium">Connecting to AI pipeline</span>
      </div>
    </div>
  )
}

// ─── Custom Tooltip for Chart ─────────────────────────────────────────────────

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 shadow-xl">
      <p className="text-xs text-slate-400 mb-1">{label}</p>
      <p className="text-sm font-bold text-orange-400">
        {payload[0].value.toLocaleString()} people
      </p>
    </div>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Sidebar({ activeNav, setActiveNav }) {
  return (
    <aside className="hidden md:flex flex-col w-20 lg:w-60 bg-slate-900 border-r border-slate-700/50 shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-slate-700/50">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-orange-500/20 border border-orange-500/30 shrink-0">
          <Activity className="w-5 h-5 text-orange-400" />
        </div>
        <div className="hidden lg:block overflow-hidden">
          <p className="text-sm font-bold text-white leading-tight">Deoghar CMS</p>
          <p className="text-xs text-slate-400 truncate">Command Center</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {NAV_ITEMS.map(({ icon: Icon, label }) => {
          const isActive = activeNav === label
          return (
            <button
              key={label}
              onClick={() => setActiveNav(label)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150
                ${isActive
                  ? 'border-l-4 border-orange-500 bg-slate-800 text-orange-400 pl-2'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800 border-l-4 border-transparent'
                }`}
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span className="hidden lg:block">{label}</span>
              {isActive && <ChevronRight className="w-4 h-4 ml-auto hidden lg:block text-orange-500/60" />}
            </button>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-slate-700/50">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center shrink-0">
            <span className="text-xs font-bold text-white">AC</span>
          </div>
          <div className="hidden lg:block">
            <p className="text-xs font-semibold text-white">Amit Chanchal</p>
            <p className="text-xs text-slate-500">AI Lead</p>
          </div>
        </div>
      </div>
    </aside>
  )
}

function MetricCard({ icon: Icon, label, sub, value, delta, color, bg, border }) {
  return (
    <div className={`bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-5 border-t-2 border-orange-500/50 border-x border-b ${border} flex flex-col gap-4 shadow-lg`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{label}</p>
          <p className="text-xs text-slate-500 mt-0.5">{sub}</p>
        </div>
        <div className={`${bg} p-2 rounded-lg`}>
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
      </div>
      <div>
        <p className={`text-3xl font-bold ${color}`}>{value}</p>
        <p className="text-xs text-slate-500 mt-1">{delta}</p>
      </div>
    </div>
  )
}

function CameraFeed({ title, model, status, count, color, dot, videoSrc, fallbackSrc, warning }) {
  return (
    <div className={`bg-slate-800 rounded-xl border overflow-hidden flex flex-col transition-all duration-300
      ${warning
        ? 'border-red-500/60 shadow-[0_0_20px_rgba(239,68,68,0.2)]'
        : 'border-slate-700/50'
      }`}
    >
      {/* Feed header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700/50">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${dot} animate-pulse`} />
          <span className="text-sm font-semibold text-white">{title}</span>
          {warning && (
            <span className="text-xs font-bold text-red-400 bg-red-400/10 border border-red-400/25 px-2 py-0.5 rounded-full ml-1">
              HIGH DENSITY
            </span>
          )}
        </div>
        <span className="text-xs font-medium text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full border border-emerald-400/20">
          {status}
        </span>
      </div>

      {/* Video feed */}
      <div className="relative bg-slate-900 aspect-video">
        <video
          className="w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          onError={(e) => {
            e.target.style.display = 'none'
            document.getElementById(`fallback-${videoSrc}`).style.display = 'flex'
          }}
        >
          <source src={videoSrc} type="video/mp4" />
        </video>

        {/* Fallback — only shown if video fails to load */}
        <div
          id={`fallback-${videoSrc}`}
          className="absolute inset-0 flex-col items-center justify-center gap-3 bg-slate-900"
          style={{ display: 'none' }}
        >
          <div
            className="absolute inset-0 opacity-5 pointer-events-none"
            style={{
              backgroundImage:
                'linear-gradient(#94a3b8 1px, transparent 1px), linear-gradient(90deg, #94a3b8 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />
          <Video className="w-12 h-12 text-slate-600 relative z-10" />
          <p className="text-slate-500 text-sm relative z-10">Camera feed unavailable</p>
          <p className="text-xs text-slate-600 relative z-10">
            <code className="text-slate-500">{videoSrc}</code> not found in public/
          </p>
        </div>

        {/* Warning overlay glow on Camera 2 */}
        {warning && (
          <div className="absolute inset-0 pointer-events-none border-2 border-red-500/40 rounded-none" />
        )}
      </div>

      {/* Feed footer */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-slate-700/50">
        <span className="text-xs text-slate-400">{model}</span>
        <span className={`text-xs font-semibold ${color}`}>{count}</span>
      </div>
    </div>
  )
}

function LogRow({ icon: Icon, color, bg, time, message, type }) {
  const typeLabel = { warning: 'WARNING', alert: 'ALERT', info: 'INFO' }
  return (
    <div className="flex items-start gap-3 py-3 border-b border-slate-700/30 last:border-0">
      <div className={`${bg} p-1.5 rounded-md mt-0.5 shrink-0`}>
        <Icon className={`w-3.5 h-3.5 ${color}`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className={`text-xs font-bold ${color}`}>[{typeLabel[type]}]</span>
          <span className="text-xs text-slate-500">{time}</span>
        </div>
        <p className="text-sm text-slate-300 leading-snug">{message}</p>
      </div>
    </div>
  )
}

// ─── Main App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [activeNav, setActiveNav] = useState('Dashboard')

  return (
    <div className="flex h-screen bg-slate-950 text-white overflow-hidden">
      <Sidebar activeNav={activeNav} setActiveNav={setActiveNav} />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Top Header */}
        <header className="flex items-center justify-between px-6 py-4 bg-slate-900 border-b border-slate-700/50 shrink-0">
          <div className="flex items-center">
            <Dhwaja />
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight">
                Deoghar CMS — Live Command Center
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                ShanghaiTech Part B · Stage 2 MAE: 89.35 · MSE: 13,409.86
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {/* System status badge */}
            <div className="flex items-center gap-2 bg-orange-500/10 border border-orange-500/25 rounded-full px-3 py-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500" />
              </span>
              <span className="text-xs font-semibold text-orange-400">System Active</span>
            </div>
            {/* Alert bell */}
            <button className="relative p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors border border-slate-700/50">
              <BellRing className="w-4 h-4 text-slate-400" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
          </div>
        </header>

        {/* Scrollable body */}
        {activeNav === 'Dashboard' ? (
        <main className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* Row 1 — Metric Cards */}
          <section>
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
              Live Metrics
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {METRIC_CARDS.map((card) => (
                <MetricCard key={card.label} {...card} />
              ))}
            </div>
          </section>

          {/* Row 2 — Crowd Analytics Chart */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                  Crowd Analytics
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">Footfall over time — today</p>
              </div>
              <span className="text-xs text-orange-400 bg-orange-400/10 border border-orange-400/20 px-2 py-1 rounded-full">
                Live · Auto-refresh
              </span>
            </div>

            <div className="bg-slate-800 rounded-xl border border-slate-700/50 p-5">
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={FOOTFALL_DATA} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="footfallGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#f97316" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0}   />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis
                    dataKey="time"
                    tick={{ fill: '#64748b', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: '#64748b', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => v >= 1000 ? `${v / 1000}k` : v}
                  />
                  <Tooltip content={<ChartTooltip />} cursor={{ stroke: '#334155', strokeWidth: 1 }} />
                  <Area
                    type="monotone"
                    dataKey="footfall"
                    stroke="#f97316"
                    strokeWidth={2.5}
                    fill="url(#footfallGradient)"
                    dot={false}
                    activeDot={{ r: 5, fill: '#f97316', stroke: '#0f172a', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* Row 3 — Camera Grid */}
          <section>
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
              Camera Feeds
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {CAMERAS.map((cam) => (
                <CameraFeed key={cam.id} {...cam} />
              ))}
            </div>
          </section>

          {/* Row 4 — Alerts & Logs */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                System Logs & Alerts
              </h2>
              <button className="text-xs text-orange-400 hover:text-orange-300 transition-colors">
                View all →
              </button>
            </div>
            <div className="bg-slate-800 rounded-xl border border-slate-700/50 px-5 py-2">
              {LOGS.map((log, i) => (
                <LogRow key={i} {...log} />
              ))}
            </div>
          </section>

        </main>
        ) : (
          <TabPlaceholder tab={activeNav} />
        )}
      </div>
    </div>
  )
}
