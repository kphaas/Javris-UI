/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Users, 
  FileText, 
  Settings, 
  Activity, 
  Cpu, 
  Network, 
  Lock,
  ChevronRight,
  Terminal,
  Zap,
  HardDrive,
  User as UserIcon,
  Send,
  Database,
  Eye,
  EyeOff,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Moon,
  Sun,
  Calendar,
  Coffee,
  ListTodo,
  Plus,
  X,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Shield,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  AlertCircle,
  AlertOctagon,
  Key,
  Fingerprint,
  History,
  Info,
  Wrench,
  DollarSign,
  TrendingUp,
  ZapOff,
  Bug,
  Search,
  Filter,
  Download,
  Share2,
  Trash2,
  Edit3,
  ExternalLink,
  Maximize2,
  Minimize2,
  RefreshCw,
  MoreVertical,
  MoreHorizontal,
  Bell,
  Mail,
  HelpCircle,
  LogOut,
  ShieldQuestion,
  UserPlus,
  ArrowRightLeft,
  Scan,
  Unlock,
  FileCode,
  Server,
  TerminalSquare,
  Brain,
  Globe,
  Laptop,
  Box
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Node, Agent, AuditLog, Document as JarvisDocument, ScheduledTask, CostEntry, Subscription, ErrorLog, User as JarvisUser, MatrixRoute, SecurityVulnerability, PortStatus, AgentProof, ToolUsage, PolicyViolation } from './types';
import { chatWithJarvis } from './services/gemini';

// --- Mock Data ---
const INITIAL_NODES: Node[] = [
  { 
    id: 'n1', 
    name: 'Brain Core', 
    type: 'Brain', 
    hardware: 'Mac Studio M2 Ultra (192GB)', 
    status: 'online', 
    ip: '100.64.0.1', 
    services: [
      { name: 'Ollama', status: 'online' },
      { name: 'vLLM', status: 'online' },
      { name: 'Postgres', status: 'degraded' },
      { name: 'Redis', status: 'online' }
    ],
    lastSeen: '2026-03-17T13:40:00Z'
  },
  { 
    id: 'n4', 
    name: 'Brain Prime', 
    type: 'Brain', 
    hardware: 'Mac Pro M2 Ultra (384GB)', 
    status: 'online', 
    ip: '100.64.0.4', 
    services: [
      { name: 'DeepSeek-V3', status: 'online' },
      { name: 'VectorDB', status: 'online' },
      { name: 'Training Engine', status: 'online' }
    ],
    lastSeen: '2026-03-17T13:41:00Z'
  },
  { 
    id: 'n7', 
    name: 'Unraid Storage', 
    type: 'Storage', 
    hardware: 'Custom Xeon (128GB, 120TB Array)', 
    status: 'online', 
    ip: '100.64.0.7', 
    services: [
      { name: 'NFS/SMB', status: 'online' },
      { name: 'Plex', status: 'online' },
      { name: 'Docker Host', status: 'online' },
      { name: 'Parity Check', status: 'online' }
    ],
    lastSeen: '2026-03-17T13:42:00Z'
  },
  { 
    id: 'n2', 
    name: 'Gateway', 
    type: 'Gateway', 
    hardware: 'Mac Mini M2 Pro (32GB)', 
    status: 'online', 
    ip: '100.64.0.2', 
    services: [
      { name: 'Nginx', status: 'online' },
      { name: 'Tailscale', status: 'online' },
      { name: 'Policy Engine', status: 'online' }
    ],
    lastSeen: '2026-03-17T13:38:00Z'
  },
  { 
    id: 'n5', 
    name: 'Sandbox', 
    type: 'Sandbox', 
    hardware: 'Docker Cluster (Virtual)', 
    status: 'online', 
    ip: '100.64.0.5', 
    services: [
      { name: 'Code Interpreter', status: 'online' },
      { name: 'Web Browser', status: 'online' },
      { name: 'File System', status: 'online' }
    ],
    lastSeen: '2026-03-17T13:42:40Z'
  },
  { 
    id: 'n3', 
    name: 'Endpoint Alpha', 
    type: 'Endpoint', 
    hardware: 'Mac Mini M2 (16GB)', 
    status: 'online', 
    ip: '100.64.0.3', 
    services: [
      { name: 'React Dashboard', status: 'online' },
      { name: 'TTS/STT', status: 'error' },
      { name: 'Avatar Engine', status: 'online' }
    ],
    lastSeen: '2026-03-17T13:35:00Z'
  },
  { 
    id: 'n6', 
    name: 'Endpoint Beta', 
    type: 'Endpoint', 
    hardware: 'iPad Pro M4 (16GB)', 
    status: 'offline', 
    ip: '100.64.0.6', 
    services: [
      { name: 'Mobile UI', status: 'online' },
      { name: 'Local Cache', status: 'online' }
    ],
    lastSeen: '2026-03-16T22:00:00Z'
  },
];

const INITIAL_ERROR_LOGS: ErrorLog[] = [
  { id: 'e1', timestamp: '2026-03-16 15:45:12', source: 'TTS/STT Service', message: 'Connection timeout while reaching ElevenLabs API', severity: 'high', status: 'open' },
  { id: 'e2', timestamp: '2026-03-16 15:50:05', source: 'Postgres', message: 'High memory pressure detected on Brain node', severity: 'medium', status: 'investigating', assignedAgent: 'FinanceAnalyzer' },
  { id: 'e3', timestamp: '2026-03-16 16:05:22', source: 'vLLM', message: 'CUDA out of memory during long context inference', severity: 'critical', status: 'open' },
];

const INITIAL_USERS: JarvisUser[] = [
  { id: 'u1', name: 'Ken Haas', email: 'kennethphaas@gmail.com', role: 'admin', status: 'active', lastLogin: '2026-03-16 16:20' },
  { id: 'u2', name: 'Ryleigh Haas', email: 'ryleigh@example.com', role: 'user', status: 'active', lastLogin: '2026-03-16 15:30' },
];

const INITIAL_MATRIX_ROUTES: MatrixRoute[] = [
  { id: 'm1', source: 'ResearchBot', destination: 'google.com', policy: 'Web Search Policy', status: 'routed', latency: 145, timestamp: '2026-03-16 16:15:01' },
  { id: 'm2', source: 'HomeAutomator', destination: 'local_hue_bridge', policy: 'Local Network Access', status: 'routed', latency: 12, timestamp: '2026-03-16 16:18:22' },
  { id: 'm3', source: 'FinanceAnalyzer', destination: 'chase.com', policy: 'Financial Data Access', status: 'blocked', latency: 0, timestamp: '2026-03-16 16:20:45' },
];

const INITIAL_SECURITY_VULNERABILITIES: SecurityVulnerability[] = [
  { id: 'v1', severity: 'critical', title: 'Outdated Ollama Version', description: 'Ollama v0.1.26 has a known RCE vulnerability in the API endpoint.', target: 'Brain Node (100.64.0.1)', status: 'open', detectedAt: '2026-03-16 10:00' },
  { id: 'v2', severity: 'high', title: 'Unencrypted Redis Traffic', description: 'Redis is communicating over plaintext on the local mesh.', target: 'Brain Node (100.64.0.1)', status: 'open', detectedAt: '2026-03-16 11:30' },
  { id: 'v3', severity: 'medium', title: 'Exposed SSH Port', description: 'SSH port 22 is open on the Gateway node to the public internet.', target: 'Gateway Node (100.64.0.2)', status: 'patched', detectedAt: '2026-03-16 09:15' },
];

const INITIAL_PORT_STATUS: PortStatus[] = [
  { port: 80, service: 'Nginx', status: 'open', node: 'Gateway' },
  { port: 443, service: 'Nginx (SSL)', status: 'open', node: 'Gateway' },
  { port: 11434, service: 'Ollama API', status: 'open', node: 'Brain' },
  { port: 5432, service: 'Postgres', status: 'filtered', node: 'Brain' },
  { port: 6379, service: 'Redis', status: 'open', node: 'Brain' },
  { port: 22, service: 'SSH', status: 'closed', node: 'Endpoint' },
];

const INITIAL_AGENT_PROOFS: AgentProof[] = [
  { id: 'p1', agentId: 'a1', agentName: 'FinanceAnalyzer', action: 'Modified ROI Calculation Logic', stage: 'Staging', hash: 'sha256:7f8e9d...a1b2', timestamp: '2026-03-16 14:30', changes: 'Updated tax rate from 0.25 to 0.28 in ROI formula.' },
  { id: 'p2', agentId: 'a2', agentName: 'HomeAutomator', action: 'Updated Lighting Schedule', stage: 'Review', hash: 'sha256:3c4d5e...f6g7', timestamp: '2026-03-16 15:45', changes: 'Changed sunset trigger offset to +15 minutes.' },
  { id: 'p3', agentId: 'a3', agentName: 'ResearchBot', action: 'Deployed New Scraper Module', stage: 'Production', hash: 'sha256:1a2b3c...d4e5', timestamp: '2026-03-16 16:00', changes: 'Added support for dynamic JS rendering via Playwright.' },
];

const INITIAL_POLICY_VIOLATIONS: PolicyViolation[] = [
  { id: 'pv1', timestamp: '2026-03-16 15:32:15', type: 'Unauthorized Tool Access', severity: 'high', description: 'Attempted to invoke lights_toggle without sufficient classification.', status: 'logged' },
  { id: 'pv2', timestamp: '2026-03-16 12:45:00', type: 'Rate Limit Exceeded', severity: 'low', description: 'Exceeded 500 requests/min to Google Search API.', status: 'resolved' },
  { id: 'pv3', timestamp: '2026-03-16 14:20:00', type: 'Data Leakage Warning', severity: 'medium', description: 'Potential PII detected in calculate_roi output buffer.', status: 'investigating' },
];

const INITIAL_AGENTS: Agent[] = [
  { 
    id: 'a1', 
    name: 'FinanceAnalyzer', 
    role: 'Financial Analyst', 
    status: 'active', 
    allowedTools: ['read_bank', 'calculate_roi'], 
    classification: 30, 
    model: 'Llama 3 (Local)', 
    lastInvocation: '2026-03-16 14:20',
    health: 98,
    progress: 45,
    cpuUsage: 24,
    memoryUsage: 62,
    estimatedCompletion: '14:45',
    activeTask: 'Analyzing Q1 Revenue',
    vulnerabilities: [
      { id: 'av1', severity: 'medium', title: 'Outdated ROI library (v2.1.0)', description: 'The ROI calculation library has a known precision bug in v2.1.0.', target: 'FinanceAnalyzer Module', status: 'open', detectedAt: '2026-03-15 09:00' },
      { id: 'av2', severity: 'high', title: 'Unencrypted local cache', description: 'Local task cache is stored in plaintext on the Brain node.', target: 'FinanceAnalyzer Storage', status: 'open', detectedAt: '2026-03-15 10:30' }
    ],
    policyViolations: [INITIAL_POLICY_VIOLATIONS[2]],
    securityScore: 72,
    lastSecurityScan: '2026-03-18 04:00'
  },
  { 
    id: 'a2', 
    name: 'HomeAutomator', 
    role: 'Smart Home Controller', 
    status: 'active', 
    allowedTools: ['lights_toggle', 'temp_set'], 
    classification: 20, 
    model: 'Mistral (Local)', 
    lastInvocation: '2026-03-16 15:10',
    health: 100,
    progress: 100,
    cpuUsage: 5,
    memoryUsage: 12,
    activeTask: 'Monitoring Sensors',
    vulnerabilities: [],
    policyViolations: [INITIAL_POLICY_VIOLATIONS[0]],
    securityScore: 95,
    lastSecurityScan: '2026-03-18 03:30'
  },
  { 
    id: 'a3', 
    name: 'ResearchBot', 
    role: 'Web Researcher', 
    status: 'active', 
    allowedTools: ['google_search', 'web_scrape'], 
    classification: 10, 
    model: 'Gemini 3 Flash (Cloud)', 
    lastInvocation: '2026-03-16 12:45',
    health: 85,
    progress: 12,
    cpuUsage: 78,
    memoryUsage: 45,
    estimatedCompletion: '18:30',
    activeTask: 'Scraping Quantum Papers',
    vulnerabilities: [
      { id: 'av3', severity: 'high', title: 'Potential XSS in web_scrape buffer', description: 'Scraped content is not properly sanitized before being passed to the model.', target: 'ResearchBot Scraper', status: 'open', detectedAt: '2026-03-16 11:00' }
    ],
    policyViolations: [INITIAL_POLICY_VIOLATIONS[1]],
    securityScore: 64,
    lastSecurityScan: '2026-03-18 02:15'
  },
];

const INITIAL_TOOL_USAGE: ToolUsage[] = [
  { id: 'tu1', agentId: 'a1', toolName: 'calculate_roi', count: 142, lastUsed: '2026-03-16 14:20', parameters: '{"investment": 50000, "period": "5y"}' },
  { id: 'tu2', agentId: 'a1', toolName: 'read_bank', count: 28, lastUsed: '2026-03-16 14:15', parameters: '{"account": "savings", "limit": 100}' },
  { id: 'tu3', agentId: 'a3', toolName: 'google_search', count: 850, lastUsed: '2026-03-16 12:45', parameters: '{"query": "quantum computing trends 2026"}' },
  { id: 'tu4', agentId: 'a2', toolName: 'lights_toggle', count: 42, lastUsed: '2026-03-16 15:10', parameters: '{"room": "living_room", "state": "on"}' },
];

const INITIAL_LOGS: AuditLog[] = [
  { id: 'l1', timestamp: '2026-03-16 15:30:01', user: 'Ken', action: 'invoke_tool', tool: 'calculate_roi', status: 'allowed', classification: 30 },
  { id: 'l2', timestamp: '2026-03-16 15:32:15', user: 'Ryleigh', action: 'invoke_tool', tool: 'lights_toggle', status: 'denied', classification: 20 },
  { id: 'l3', timestamp: '2026-03-16 15:35:42', user: 'Ken', action: 'ingest_doc', tool: 'unraid_mount', status: 'allowed', classification: 40 },
];

const INITIAL_DOCUMENTS: JarvisDocument[] = [
  { id: 'd1', name: 'tax_return_2025.pdf', classification: 30, stage: 'publish', status: 'completed' },
  { id: 'd2', name: 'project_alpha_spec.docx', classification: 20, stage: 'process', status: 'pending' },
  { id: 'd3', name: 'family_photo_metadata.json', classification: 10, stage: 'ingest', status: 'completed' },
  { id: 'd4', name: 'unraid_config_backup.sh', classification: 40, stage: 'publish', status: 'failed' },
];

const INITIAL_SCHEDULED_TASKS: ScheduledTask[] = [
  { id: 't1', title: 'Deep Research: Quantum Computing Trends', description: 'Analyze 50+ papers and summarize findings.', startTime: '2026-03-17 02:00', status: 'queued', priority: 'high', model: 'Gemini 3 Pro', retryStrategy: 'exponential' },
  { id: 't2', title: 'Unraid Data Scrub & Parity Check', description: 'Full array integrity verification.', startTime: '2026-03-17 03:00', status: 'queued', priority: 'medium', model: 'Llama 3', retryStrategy: 'none' },
  { id: 't3', title: 'Finance Archive Indexing', description: 'OCR and classify 2024 receipts.', startTime: '2026-03-16 23:00', status: 'running', priority: 'medium', model: 'Gemini 3 Flash', retryStrategy: 'aggressive' },
];

const POLICIES = [
  { id: 'p1', name: 'Financial Write Protection', tool: 'finance_write', role: 'admin', classification: 30, mfa: true },
  { id: 'p2', name: 'Child Safety Filter', tool: 'llm_dispatch', role: 'child_*', classification: 10, mfa: false },
  { id: 'p3', name: 'Unraid Archive Access', tool: 'unraid_mount', role: 'admin', classification: 40, mfa: true },
];

const INITIAL_COSTS: CostEntry[] = [
  { id: 'c1', category: 'AI Service', name: 'Claude 3.5 Sonnet API', amount: 42.50, date: '2026-03-15', platform: 'Claude' },
  { id: 'c2', category: 'AI Service', name: 'Perplexity Pro Search', amount: 20.00, date: '2026-03-01', platform: 'Perplexity' },
  { id: 'c3', category: 'AI Service', name: 'Gemini 1.5 Pro API', amount: 15.75, date: '2026-03-14', platform: 'Gemini' },
  { id: 'c4', category: 'Electricity', name: 'Brain (Mac Studio)', amount: 12.40, date: '2026-03-16', platform: 'Infrastructure' },
  { id: 'c5', category: 'Electricity', name: 'Gateway (Mac Mini)', amount: 4.20, date: '2026-03-16', platform: 'Infrastructure' },
  { id: 'c6', category: 'Electricity', name: 'Endpoint (Mac Mini)', amount: 3.80, date: '2026-03-16', platform: 'Infrastructure' },
];

const INITIAL_SUBSCRIPTIONS: Subscription[] = [
  { id: 's1', name: 'Claude Pro', platform: 'Claude', monthlyCost: 20.00, status: 'active', renewalDate: '2026-04-10' },
  { id: 's2', name: 'Perplexity Pro', platform: 'Perplexity', monthlyCost: 20.00, status: 'active', renewalDate: '2026-04-01' },
  { id: 's3', name: 'Gemini Advanced', platform: 'Gemini', monthlyCost: 19.99, status: 'active', renewalDate: '2026-04-15' },
];

const YEARLY_SPENDING_DATA = [
  { month: 'Jan', ai: 150, infra: 30, subs: 60 },
  { month: 'Feb', ai: 180, infra: 32, subs: 60 },
  { month: 'Mar', ai: 210, infra: 35, subs: 60 },
  { month: 'Apr', ai: 190, infra: 33, subs: 60 },
  { month: 'May', ai: 240, infra: 38, subs: 60 },
  { month: 'Jun', ai: 280, infra: 40, subs: 60 },
  { month: 'Jul', ai: 310, infra: 42, subs: 60 },
  { month: 'Aug', ai: 290, infra: 41, subs: 60 },
  { month: 'Sep', ai: 330, infra: 45, subs: 60 },
  { month: 'Oct', ai: 350, infra: 48, subs: 60 },
  { month: 'Nov', ai: 380, infra: 50, subs: 60 },
  { month: 'Dec', ai: 420, infra: 55, subs: 60 },
];

// --- Components ---

const StatusBadge = ({ status, theme = 'light' }: { status: Node['status'], theme?: 'light' | 'dark' }) => {
  const colors = {
    online: theme === 'light' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    offline: theme === 'light' ? 'bg-rose-500/10 text-rose-600 border-rose-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    degraded: theme === 'light' ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-[8px] font-mono uppercase tracking-wider border ${colors[status]}`}>
      {status}
    </span>
  );
};

const getNodeIcon = (type: Node['type']) => {
  switch (type) {
    case 'Brain': return Brain;
    case 'Gateway': return Globe;
    case 'Endpoint': return Laptop;
    case 'Sandbox': return Box;
    case 'Storage': return HardDrive;
    default: return Server;
  }
};

const MeshView = ({ nodes, theme }: { nodes: Node[], theme: 'light' | 'dark' }) => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-serif italic text-3xl">Tailscale Mesh Topology</h3>
          <p className="text-sm opacity-50 mt-1">Real-time mTLS encrypted peer-to-peer network visualization.</p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-mono uppercase font-bold">DERP Relay Active</span>
          </div>
        </div>
      </div>

      <div className={`relative h-[600px] rounded-3xl border overflow-hidden ${
        theme === 'light' ? 'bg-white border-[#141414]/10' : 'bg-[#0A0A0A] border-white/10'
      }`}>
        {/* Grid Background */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ 
          backgroundImage: `radial-gradient(${theme === 'light' ? '#141414' : '#fff'} 1px, transparent 1px)`, 
          backgroundSize: '40px 40px' 
        }} />

        {/* SVG Connections */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <defs>
            <linearGradient id="meshGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.2" />
            </linearGradient>
          </defs>
          {nodes.map((node, i) => (
            nodes.slice(i + 1).map((peer, j) => {
              const x1 = 15 + (i * 20) % 70;
              const y1 = 20 + (i * 15) % 60;
              const x2 = 15 + ((i + j + 1) * 20) % 70;
              const y2 = 20 + ((i + j + 1) * 15) % 60;
              return (
                <g key={`${node.id}-${peer.id}`}>
                  <motion.line
                    x1={`${x1}%`}
                    y1={`${y1}%`}
                    x2={`${x2}%`}
                    y2={`${y2}%`}
                    stroke="url(#meshGradient)"
                    strokeWidth="1"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 2, delay: i * 0.2 }}
                  />
                  <motion.circle
                    r="2"
                    fill="#10b981"
                    animate={{ 
                      cx: [`${x1}%`, `${x2}%`],
                      cy: [`${y1}%`, `${y2}%`],
                      opacity: [0, 1, 0]
                    }}
                    transition={{ 
                      duration: 3, 
                      repeat: Infinity, 
                      delay: (i + j) * 0.5,
                      ease: "linear"
                    }}
                  />
                </g>
              );
            })
          ))}
        </svg>

        {/* Node Points */}
        <div className="absolute inset-0">
          {nodes.map((node, i) => {
            const NodeIcon = getNodeIcon(node.type);
            const x = 15 + (i * 20) % 70;
            const y = 20 + (i * 15) % 60;
            return (
              <motion.div
                key={node.id}
                style={{ left: `${x}%`, top: `${y}%` }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', damping: 12, delay: i * 0.1 }}
                className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
              >
                <div className={`relative p-4 rounded-2xl border transition-all group-hover:scale-110 group-hover:shadow-2xl ${
                  theme === 'light' 
                    ? 'bg-white border-[#141414] shadow-lg' 
                    : 'bg-[#141414] border-white/20 shadow-emerald-500/10'
                }`}>
                  <div className={`p-2 rounded-lg mb-2 ${theme === 'light' ? 'bg-[#141414]/5' : 'bg-emerald-500/10'}`}>
                    <NodeIcon className={`w-5 h-5 ${theme === 'light' ? 'text-[#141414]' : 'text-emerald-500'}`} />
                  </div>
                  <div className="text-center">
                    <h5 className="text-[10px] font-bold tracking-tighter whitespace-nowrap">{node.name}</h5>
                    <p className="text-[8px] font-mono opacity-50">{node.ip}</p>
                  </div>
                  
                  {/* Status Indicator */}
                  <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 ${
                    theme === 'light' ? 'border-white' : 'border-[#141414]'
                  } ${node.status === 'online' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Mesh Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Active Peers', value: nodes.length, icon: Users },
          { label: 'Avg Latency', value: '14ms', icon: Activity },
          { label: 'Encryption', value: 'WireGuard', icon: Lock },
          { label: 'Relay Nodes', value: '2', icon: Globe },
        ].map((stat, i) => (
          <div key={i} className={`p-4 border rounded-xl flex items-center gap-4 ${
            theme === 'light' ? 'bg-white border-[#141414]/10' : 'bg-white/5 border-white/10'
          }`}>
            <div className={`p-2 rounded-lg ${theme === 'light' ? 'bg-[#141414]/5' : 'bg-white/5'}`}>
              <stat.icon className="w-4 h-4 opacity-50" />
            </div>
            <div>
              <p className="text-[8px] font-mono uppercase opacity-50">{stat.label}</p>
              <p className="text-lg font-bold tracking-tighter">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ClassificationBadge = ({ level, theme = 'light' }: { level: number, theme?: 'light' | 'dark' }) => {
  const colors: Record<number, string> = {
    10: theme === 'light' ? 'text-blue-600 border-blue-600/20' : 'text-blue-400 border-blue-400/20',
    20: theme === 'light' ? 'text-emerald-600 border-emerald-600/20' : 'text-emerald-400 border-emerald-400/20',
    30: theme === 'light' ? 'text-amber-600 border-amber-600/20' : 'text-amber-400 border-amber-400/20',
    40: theme === 'light' ? 'text-orange-600 border-orange-600/20' : 'text-orange-400 border-orange-400/20',
    50: theme === 'light' ? 'text-rose-600 border-rose-600/20' : 'text-rose-400 border-rose-400/20',
  };
  return (
    <span className={`px-1.5 py-0.5 border rounded text-[10px] font-mono ${colors[level] || 'text-gray-400'}`}>
      T{level}
    </span>
  );
};

const ResourceGauge = ({ label, value, color, theme }: { label: string, value: number, color: string, theme: 'light' | 'dark' }) => {
  const radius = 14;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-0.5">
      <div className="relative w-9 h-9">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="18"
            cy="18"
            r={radius}
            stroke="currentColor"
            strokeWidth="2.5"
            fill="transparent"
            className={theme === 'light' ? 'text-[#141414]/5' : 'text-white/5'}
          />
          <motion.circle
            cx="18"
            cy="18"
            r={radius}
            stroke="currentColor"
            strokeWidth="2.5"
            fill="transparent"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={color}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-[7px] font-mono font-bold">
          {value}%
        </div>
      </div>
      <span className="text-[7px] font-mono uppercase opacity-40">{label}</span>
    </div>
  );
};

const AgentPerformanceChart = ({ cpu, memory, theme }: { cpu: number, memory: number, theme: 'light' | 'dark' }) => {
  // Generate mock historical data based on current values
  const data = Array.from({ length: 15 }).map((_, i) => ({
    time: `${i}m ago`,
    cpu: Math.max(0, Math.min(100, cpu + (Math.random() - 0.5) * 15)),
    memory: Math.max(0, Math.min(100, memory + (Math.random() - 0.5) * 8)),
  }));

  return (
    <div className="h-28 w-full mt-2">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorMem" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(20,20,20,0.05)'} />
          <XAxis dataKey="time" hide />
          <YAxis hide domain={[0, 100]} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: theme === 'dark' ? '#141414' : '#E4E3E0',
              border: theme === 'dark' ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(20,20,20,0.1)',
              borderRadius: '8px',
              fontSize: '9px',
              fontFamily: 'monospace',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
            }}
            itemStyle={{ padding: '2px 0' }}
            cursor={{ stroke: theme === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(20,20,20,0.2)', strokeWidth: 1 }}
          />
          <Area 
            type="monotone" 
            dataKey="cpu" 
            name="CPU"
            stroke="#3b82f6" 
            fillOpacity={1} 
            fill="url(#colorCpu)" 
            strokeWidth={2}
            isAnimationActive={true}
            animationDuration={1000}
          />
          <Area 
            type="monotone" 
            dataKey="memory" 
            name="RAM"
            stroke="#10b981" 
            fillOpacity={1} 
            fill="url(#colorMem)" 
            strokeWidth={2}
            isAnimationActive={true}
            animationDuration={1200}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

const CodeView = ({ theme }: { theme: 'light' | 'dark' }) => {
  const [selectedFile, setSelectedFile] = useState('agent_orchestrator.ts');
  
  const files = [
    { name: 'agent_orchestrator.ts', size: '12.4 KB', type: 'typescript', lastEdit: '2h ago', content: `/**
 * JARVIS Agent Orchestrator v3.2
 * Handles multi-agent task distribution and mTLS mesh communication.
 */
import { MeshNode, AgentTask } from './mesh_types';
import { SecurityLayer } from './security';

export class Orchestrator {
  private nodes: Map<string, MeshNode> = new Map();
  private taskQueue: AgentTask[] = [];

  constructor(private security: SecurityLayer) {}

  async distributeTask(task: AgentTask) {
    const targetNode = this.findOptimalNode(task.requirements);
    if (!targetNode) throw new Error("No suitable node found");
    
    await this.security.validateTask(task);
    return targetNode.execute(task);
  }

  private findOptimalNode(reqs: any) {
    // Logic for finding node with lowest latency and highest GPU availability
    return Array.from(this.nodes.values())
      .filter(n => n.health > 0.8)
      .sort((a, b) => a.load - b.load)[0];
  }
}` },
    { name: 'unraid_connector.py', size: '4.8 KB', type: 'python', lastEdit: '5h ago', content: `import os
import paramiko
from jarvis_core import Logger

class UnraidMount:
    def __init__(self, host, user, key_path):
        self.client = paramiko.SSHClient()
        self.client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        self.client.connect(host, username=user, key_filename=key_path)

    def mount_share(self, share_name):
        stdin, stdout, stderr = self.client.exec_command(f"mount /mnt/user/{share_name}")
        if stderr.read():
            Logger.error(f"Failed to mount {share_name}")
            return False
        return True` },
    { name: 'security_rules.json', size: '2.1 KB', type: 'json', lastEdit: '1d ago', content: `{
  "governance": {
    "version": "1.4.0",
    "classification_levels": {
      "T10": "Public",
      "T20": "Internal",
      "T30": "Confidential",
      "T40": "Restricted"
    },
    "default_policy": "deny_all",
    "mtls_required": true
  }
}` }
  ];

  const currentFile = files.find(f => f.name === selectedFile) || files[0];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 h-[calc(100vh-160px)]">
      <div className={`lg:col-span-1 border rounded-2xl overflow-hidden flex flex-col ${
        theme === 'light' ? 'bg-white border-[#141414]/10' : 'bg-white/5 border-white/10'
      }`}>
        <div className={`p-4 border-b text-[10px] font-mono uppercase opacity-50 ${
          theme === 'light' ? 'bg-[#141414]/5' : 'bg-white/5'
        }`}>
          Repository Explorer
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {files.map(file => (
            <button
              key={file.name}
              onClick={() => setSelectedFile(file.name)}
              className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                selectedFile === file.name
                  ? (theme === 'light' ? 'bg-[#141414] text-[#E4E3E0]' : 'bg-emerald-500 text-[#0A0A0A]')
                  : (theme === 'light' ? 'hover:bg-[#141414]/5' : 'hover:bg-white/5')
              }`}
            >
              <div className="flex items-center gap-3">
                <FileCode className="w-4 h-4 opacity-50" />
                <div className="text-left">
                  <p className="text-xs font-bold font-mono">{file.name}</p>
                  <p className="text-[8px] opacity-50 uppercase">{file.size} • {file.lastEdit}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
      <div className={`lg:col-span-3 border rounded-2xl overflow-hidden flex flex-col ${
        theme === 'light' ? 'bg-[#141414] text-[#E4E3E0]' : 'bg-[#050505] border-white/10'
      }`}>
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
          <div className="flex items-center gap-3">
            <Terminal className="w-4 h-4 text-emerald-500" />
            <span className="text-xs font-mono">{currentFile.name}</span>
          </div>
          <div className="flex gap-2">
            <div className="w-2 h-2 rounded-full bg-rose-500" />
            <div className="w-2 h-2 rounded-full bg-amber-500" />
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>
        </div>
        <div className="flex-1 p-6 overflow-auto font-mono text-xs leading-relaxed">
          <pre className="opacity-80">
            {currentFile.content}
          </pre>
        </div>
      </div>
    </div>
  );
};

const ArchitectureView = ({ theme }: { theme: 'light' | 'dark' }) => {
  const roadmap = [
    { task: 'Brain Core (Gemini 3 Integration)', status: 'done' },
    { task: 'Tailscale Mesh Topology', status: 'done' },
    { task: 'Multi-Agent Orchestrator', status: 'done' },
    { task: 'Unraid Storage Connector', status: 'done' },
    { task: 'mTLS Security Layer', status: 'process' },
    { task: 'Cross-Node GPU Sharing', status: 'process' },
    { task: 'Autonomous Self-Healing', status: 'left' },
    { task: 'External API Gateway', status: 'left' },
  ];

  return (
    <div className="space-y-8">
      <div className={`p-8 border rounded-3xl relative overflow-hidden ${
        theme === 'light' ? 'bg-white border-[#141414]/10 shadow-sm' : 'bg-white/5 border-white/10'
      }`}>
        <h3 className="font-serif italic text-2xl mb-8">System Architecture v3.0</h3>
        
        {/* Architecture Diagram (SVG/CSS) */}
        <div className="relative h-[400px] flex items-center justify-center">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="w-full h-full border-2 border-dashed border-current rounded-full animate-[spin_60s_linear_infinite]" />
          </div>
          
          <div className="grid grid-cols-3 gap-12 relative z-10">
            {/* Left Column: Input/Storage */}
            <div className="space-y-12 flex flex-col justify-center">
              <div className={`p-4 border rounded-xl text-center space-y-2 ${theme === 'light' ? 'bg-white border-[#141414]' : 'bg-black border-emerald-500/50'}`}>
                <Database className="w-6 h-6 mx-auto text-emerald-500" />
                <p className="text-[10px] font-mono uppercase font-bold">Unraid Storage</p>
                <div className="text-[8px] opacity-50">MOUNTED /mnt/user</div>
              </div>
              <div className={`p-4 border rounded-xl text-center space-y-2 ${theme === 'light' ? 'bg-white border-[#141414]' : 'bg-black border-emerald-500/50'}`}>
                <FileText className="w-6 h-6 mx-auto text-emerald-500" />
                <p className="text-[10px] font-mono uppercase font-bold">Ingestion Pipeline</p>
                <div className="text-[8px] opacity-50">T10 - T40 CLASSIFICATION</div>
              </div>
            </div>

            {/* Center Column: Core */}
            <div className="flex flex-col items-center justify-center relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] border border-emerald-500/20 rounded-full animate-pulse" />
              <div className={`w-32 h-32 rounded-full border-4 flex flex-col items-center justify-center space-y-2 relative z-10 ${
                theme === 'light' ? 'bg-[#141414] text-[#E4E3E0] border-emerald-500' : 'bg-emerald-500 text-[#0A0A0A] border-white'
              }`}>
                <Brain className="w-10 h-10" />
                <p className="text-xs font-bold uppercase tracking-widest">Brain</p>
                <p className="text-[8px] opacity-70">GEMINI 3.1</p>
              </div>
              
              {/* Connection Lines (Visual) */}
              <div className="absolute top-1/2 left-0 w-full h-[1px] bg-emerald-500/20 -translate-y-1/2 -z-10" />
              <div className="absolute top-0 left-1/2 w-[1px] h-full bg-emerald-500/20 -translate-x-1/2 -z-10" />
            </div>

            {/* Right Column: Nodes/Agents */}
            <div className="space-y-12 flex flex-col justify-center">
              <div className={`p-4 border rounded-xl text-center space-y-2 ${theme === 'light' ? 'bg-white border-[#141414]' : 'bg-black border-emerald-500/50'}`}>
                <Network className="w-6 h-6 mx-auto text-emerald-500" />
                <p className="text-[10px] font-mono uppercase font-bold">Tailscale Mesh</p>
                <div className="text-[8px] opacity-50">mTLS ENCRYPTED</div>
              </div>
              <div className={`p-4 border rounded-xl text-center space-y-2 ${theme === 'light' ? 'bg-white border-[#141414]' : 'bg-black border-emerald-500/50'}`}>
                <Users className="w-6 h-6 mx-auto text-emerald-500" />
                <p className="text-[10px] font-mono uppercase font-bold">Agent Fleet</p>
                <div className="text-[8px] opacity-50">AUTONOMOUS WORKERS</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className={`p-6 border rounded-2xl ${theme === 'light' ? 'bg-white border-[#141414]/10' : 'bg-white/5 border-white/10'}`}>
          <h4 className="font-bold tracking-tight mb-6 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            Development Roadmap
          </h4>
          <div className="space-y-4">
            {roadmap.map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                <div className="flex items-center gap-3">
                  {item.status === 'done' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  ) : item.status === 'process' ? (
                    <Activity className="w-4 h-4 text-amber-500 animate-pulse" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-white/20" />
                  )}
                  <span className={`text-sm ${item.status === 'done' ? 'opacity-50 line-through' : ''}`}>{item.task}</span>
                </div>
                <span className={`text-[8px] font-mono uppercase px-1.5 py-0.5 rounded ${
                  item.status === 'done' ? 'bg-emerald-500/10 text-emerald-500' :
                  item.status === 'process' ? 'bg-amber-500/10 text-amber-500' : 'bg-white/10 opacity-30'
                }`}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className={`p-6 border rounded-2xl ${theme === 'light' ? 'bg-white border-[#141414]/10' : 'bg-white/5 border-white/10'}`}>
          <h4 className="font-bold tracking-tight mb-6 flex items-center gap-2">
            <Info className="w-4 h-4 text-blue-500" />
            System Status Summary
          </h4>
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono uppercase opacity-50">
                <span>Infrastructure Completion</span>
                <span>72%</span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-[72%]" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-center">
                <p className="text-2xl font-bold">4/6</p>
                <p className="text-[10px] font-mono uppercase opacity-50">Core Modules</p>
              </div>
              <div className={`p-4 rounded-xl bg-white/5 border border-white/5 text-center`}>
                <p className="text-2xl font-bold text-emerald-500">Active</p>
                <p className="text-[10px] font-mono uppercase opacity-50">Mesh Status</p>
              </div>
            </div>
            <p className="text-xs opacity-50 leading-relaxed italic">
              "System is currently in Phase 6b. Primary focus is hardening the mTLS security layer and implementing cross-node GPU sharing for distributed inference."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [nodes] = useState<Node[]>(INITIAL_NODES);
  const [agents, setAgents] = useState<Agent[]>(INITIAL_AGENTS);
  const [logs] = useState<AuditLog[]>(INITIAL_LOGS);
  const [scheduledTasks, setScheduledTasks] = useState<ScheduledTask[]>(INITIAL_SCHEDULED_TASKS);
  const [costs] = useState<CostEntry[]>(INITIAL_COSTS);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(INITIAL_SUBSCRIPTIONS);
  const [errorLogs, setErrorLogs] = useState<ErrorLog[]>(INITIAL_ERROR_LOGS);
  const [users] = useState<JarvisUser[]>(INITIAL_USERS);
  const [matrixRoutes] = useState<MatrixRoute[]>(INITIAL_MATRIX_ROUTES);
  const [vulnerabilities] = useState<SecurityVulnerability[]>(INITIAL_SECURITY_VULNERABILITIES);
  const [ports] = useState<PortStatus[]>(INITIAL_PORT_STATUS);
  const [agentProofs] = useState<AgentProof[]>(INITIAL_AGENT_PROOFS);
  const [toolUsage] = useState<ToolUsage[]>(INITIAL_TOOL_USAGE);
  const [monthlyBudget, setMonthlyBudget] = useState(500);
  
  // Document Ingestion State
  const [documents, setDocuments] = useState<JarvisDocument[]>(INITIAL_DOCUMENTS);
  const [ingestionClass, setIngestionClass] = useState(10);
  const [isScanning, setIsScanning] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Wizard State
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [selectedAgentForSecurity, setSelectedAgentForSecurity] = useState<Agent | null>(null);
  const [modalTab, setModalTab] = useState<'security' | 'api'>('security');
  const [scanningAgentId, setScanningAgentId] = useState<string | null>(null);

  const handleScanNow = (agentId: string) => {
    setScanningAgentId(agentId);
    // Simulate scan delay
    setTimeout(() => {
      const now = new Date();
      const timestamp = now.toISOString().replace('T', ' ').split('.')[0];
      setAgents(prev => prev.map(a => 
        a.id === agentId ? { ...a, lastSecurityScan: timestamp } : a
      ));
      setScanningAgentId(null);
    }, 2000);
  };
  const [wizardStep, setWizardStep] = useState(1);
  const [newAgentData, setNewAgentData] = useState<Partial<Agent>>({
    name: '',
    role: '',
    status: 'active',
    allowedTools: [],
    classification: 10,
    model: 'Llama 3 (Local)',
  });

  // Chat State
  const [messages, setMessages] = useState<{ role: 'user' | 'model', text: string, mode?: 'realtime' | 'overnight' }[]>([
    { role: 'model', text: "Good afternoon, Ken. All systems are nominal. I've processed 14 new documents from the Unraid staging area. Would you like to review the classification results?" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatMode, setChatMode] = useState<'realtime' | 'overnight'>('realtime');
  const [selectedModel, setSelectedModel] = useState('Gemini 3 Flash');
  const [taskPriority, setTaskPriority] = useState<ScheduledTask['priority']>('medium');
  const [retryStrategy, setRetryStrategy] = useState<ScheduledTask['retryStrategy']>('exponential');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage = input;
    const currentMode = chatMode;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage, mode: currentMode }]);
    
    if (currentMode === 'overnight') {
      setIsTyping(true);
      setTimeout(() => {
        const newTask: ScheduledTask = {
          id: `t${Date.now()}`,
          title: userMessage.slice(0, 30) + (userMessage.length > 30 ? '...' : ''),
          description: userMessage,
          startTime: 'Tonight @ 02:00',
          status: 'queued',
          priority: taskPriority,
          model: selectedModel,
          retryStrategy: retryStrategy
        };
        setScheduledTasks(prev => [newTask, ...prev]);
        setMessages(prev => [...prev, { 
          role: 'model', 
          text: `Task scheduled for overnight execution. I will use ${selectedModel} with a ${retryStrategy} retry strategy at ${taskPriority} priority. You can track progress in the Scheduled Tasks panel.` 
        }]);
        setIsTyping(false);
      }, 1000);
      return;
    }

    setIsTyping(true);
    const response = await chatWithJarvis(userMessage, []);
    setMessages(prev => [...prev, { role: 'model', text: response || 'No response from Brain.' }]);
    setIsTyping(false);
  };

  const handleInitiatePipeline = () => {
    setIsUploading(true);
    setTimeout(() => {
      const newDoc: JarvisDocument = {
        id: `d${Date.now()}`,
        name: `uploaded_doc_${Math.floor(Math.random() * 1000)}.pdf`,
        classification: ingestionClass,
        stage: 'ingest',
        status: 'pending'
      };
      setDocuments(prev => [newDoc, ...prev]);
      setIsUploading(false);
      
      // Simulate pipeline progression
      setTimeout(() => {
        setDocuments(prev => prev.map(d => d.id === newDoc.id ? { ...d, stage: 'process' } : d));
        setTimeout(() => {
          setDocuments(prev => prev.map(d => d.id === newDoc.id ? { ...d, stage: 'publish', status: 'completed' } : d));
        }, 3000);
      }, 2000);
    }, 1500);
  };

  const handleScanUnraid = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      const foundDocs = [
        { id: `u1-${Date.now()}`, name: 'financial_report_2025.pdf', classification: 30, stage: 'ingest', status: 'pending' },
        { id: `u2-${Date.now()}`, name: 'server_logs_unraid.txt', classification: 10, stage: 'ingest', status: 'pending' }
      ] as JarvisDocument[];
      setDocuments(prev => [...foundDocs, ...prev]);
      
      // Auto-process scanned docs
      foundDocs.forEach(doc => {
        setTimeout(() => {
          setDocuments(prev => prev.map(d => d.id === doc.id ? { ...d, stage: 'process' } : d));
          setTimeout(() => {
            setDocuments(prev => prev.map(d => d.id === doc.id ? { ...d, stage: 'publish', status: 'completed' } : d));
          }, 4000);
        }, 2000);
      });
    }, 2000);
  };

  const handleCreateAgent = () => {
    const agent: Agent = {
      ...newAgentData as Agent,
      id: `a${Date.now()}`,
      lastInvocation: 'Never',
    };
    setAgents(prev => [agent, ...prev]);
    setIsWizardOpen(false);
    setWizardStep(1);
    setNewAgentData({
      name: '',
      role: '',
      status: 'active',
      allowedTools: [],
      classification: 10,
      model: 'Llama 3 (Local)',
    });
  };

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'mesh', label: 'Mesh', icon: Network },
    { id: 'chat', label: 'Brain', icon: MessageSquare },
    { id: 'agents', label: 'Agents', icon: Users },
    { id: 'code', label: 'Jarvis Code', icon: FileCode },
    { id: 'architecture', label: 'Architecture', icon: Box },
    { id: 'security', label: 'Security', icon: ShieldAlert },
    { id: 'errors', label: 'Errors', icon: Bug },
    { id: 'governance', label: 'Governance', icon: ShieldCheck },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'cost', label: 'Cost Center', icon: DollarSign },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  return (
    <div className={`flex h-screen font-sans selection:bg-[#141414] selection:text-[#E4E3E0] transition-colors duration-300 ${
      theme === 'light' ? 'bg-[#E4E3E0] text-[#141414]' : 'bg-[#0A0A0A] text-[#E4E3E0]'
    }`}>
      {/* Sidebar */}
      <aside className={`w-64 border-r flex flex-col transition-colors duration-300 ${
        theme === 'light' ? 'border-[#141414]' : 'border-white/10 bg-[#0F0F0F]'
      }`}>
        <div className={`p-6 border-b transition-colors duration-300 ${
          theme === 'light' ? 'border-[#141414]' : 'border-white/10'
        }`}>
          <h1 className="text-2xl font-bold tracking-tighter flex items-center gap-2">
            <Zap className={`w-6 h-6 fill-current ${theme === 'light' ? 'text-[#141414]' : 'text-emerald-500'}`} />
            JARVIS
          </h1>
          <p className="text-[10px] font-mono opacity-50 uppercase mt-1">Private AI Infrastructure v3</p>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 group ${
                activeTab === item.id 
                  ? (theme === 'light' ? 'bg-[#141414] text-[#E4E3E0]' : 'bg-emerald-500 text-[#0A0A0A]')
                  : (theme === 'light' ? 'hover:bg-[#141414]/5' : 'hover:bg-white/5')
              }`}
            >
              <item.icon className="w-4 h-4" />
              <span className="text-sm font-medium">{item.label}</span>
              {activeTab === item.id && (
                <motion.div layoutId="active-nav" className="ml-auto">
                  <ChevronRight className="w-3 h-3" />
                </motion.div>
              )}
            </button>
          ))}
        </nav>

        <div className={`p-6 border-t space-y-4 transition-colors duration-300 ${
          theme === 'light' ? 'border-[#141414]' : 'border-white/10'
        }`}>
          <button 
            onClick={toggleTheme}
            className={`w-full flex items-center justify-between px-4 py-2 rounded-lg border transition-all ${
              theme === 'light' 
                ? 'border-[#141414]/10 hover:bg-[#141414]/5' 
                : 'border-white/10 hover:bg-white/5'
            }`}
          >
            <div className="flex items-center gap-3">
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              <span className="text-sm font-medium">{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
            </div>
            <div className={`w-8 h-4 rounded-full relative transition-colors ${
              theme === 'light' ? 'bg-[#141414]/20' : 'bg-emerald-500/40'
            }`}>
              <motion.div 
                animate={{ x: theme === 'light' ? 2 : 18 }}
                className={`w-3 h-3 rounded-full absolute top-0.5 ${
                  theme === 'light' ? 'bg-[#141414]' : 'bg-emerald-500'
                }`}
              />
            </div>
          </button>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#141414] flex items-center justify-center text-[#E4E3E0]">
              <UserIcon className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold">Ken Haas</p>
              <p className="text-[10px] font-mono opacity-50 uppercase">Admin • Phase 6b</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className={`h-16 border-b flex items-center justify-between px-8 backdrop-blur-sm sticky top-0 z-10 transition-colors ${
          theme === 'light' ? 'border-[#141414] bg-[#E4E3E0]/80' : 'border-white/10 bg-[#0A0A0A]/80'
        }`}>
          <div className="flex items-center gap-4">
            <h2 className="font-serif italic text-lg capitalize">{activeTab}</h2>
            <div className={`h-4 w-[1px] ${theme === 'light' ? 'bg-[#141414]/20' : 'bg-white/20'}`} />
            <div className="flex items-center gap-2">
              <Activity className="w-3 h-3 text-emerald-500" />
              <span className="text-[10px] font-mono uppercase tracking-widest opacity-50">System Nominal</span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-[10px] font-mono opacity-50 uppercase">Cloud Spend (Mar)</p>
              <p className="text-sm font-bold">${costs.reduce((acc, c) => acc + c.amount, 0).toFixed(2)} / ${monthlyBudget.toFixed(2)}</p>
            </div>
            <div className={`w-10 h-10 border flex items-center justify-center rounded transition-colors cursor-pointer ${
              theme === 'light' ? 'border-[#141414] hover:bg-[#141414] hover:text-[#E4E3E0]' : 'border-white/10 hover:bg-white/10'
            }`}>
              <Lock className="w-4 h-4" />
            </div>
          </div>
        </header>

        <div className="p-8">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                {/* Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { label: 'Local Inference', value: '82.4%', icon: Cpu, trend: '+4.2% from last week', color: 'text-emerald-600' },
                    { label: 'Tailscale Mesh', value: `${nodes.length} Nodes`, icon: Network, trend: 'All Encrypted (mTLS)', color: 'text-emerald-600' },
                    { label: 'Active Agents', value: '12', icon: Users, trend: '2 Pending Review', color: 'text-amber-600' },
                  ].map((stat, i) => (
                    <div key={i} className={`p-6 border rounded-xl space-y-2 transition-colors ${
                      theme === 'light' ? 'border-[#141414] bg-white/50' : 'border-white/10 bg-white/5'
                    }`}>
                      <div className="flex items-center justify-between">
                        <p className="text-[10px] font-mono uppercase opacity-50">{stat.label}</p>
                        <stat.icon className="w-4 h-4 opacity-30" />
                      </div>
                      <p className="text-3xl font-bold tracking-tighter">{stat.value}</p>
                      <p className={`text-[10px] font-mono ${stat.color}`}>{stat.trend}</p>
                    </div>
                  ))}
                </div>

                {/* Nodes Table */}
                <section className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif italic text-xl">Node Topology & Health</h3>
                    <button className={`text-[10px] font-mono uppercase border px-3 py-1 rounded transition-all ${
                      theme === 'light' ? 'border-[#141414] hover:bg-[#141414] hover:text-[#E4E3E0]' : 'border-white/10 hover:bg-white/10'
                    }`}>
                      Refresh Cluster
                    </button>
                  </div>
                  <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {nodes.map((node) => {
                      const NodeIcon = getNodeIcon(node.type);
                      return (
                        <div key={node.id} className={`p-4 border rounded-xl transition-all group ${
                          theme === 'light' ? 'border-[#141414] bg-white/50 shadow-sm' : 'border-white/10 bg-white/5'
                        }`}>
                          <div className="flex justify-between items-start mb-4">
                            <div className="min-w-0 flex items-start gap-2">
                              <div className={`p-1.5 rounded-lg ${theme === 'light' ? 'bg-[#141414]/5' : 'bg-white/5'}`}>
                                <NodeIcon className="w-3.5 h-3.5 opacity-60" />
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${node.status === 'online' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-rose-500'}`} />
                                  <h4 className="font-bold tracking-tight text-xs truncate">{node.name}</h4>
                                </div>
                                <p className="text-[8px] font-mono uppercase mt-0.5 opacity-50 truncate">{node.type} • {node.ip}</p>
                              </div>
                            </div>
                            <StatusBadge status={node.status} theme={theme} />
                          </div>
                          
                          <div className="grid grid-cols-3 gap-2">
                            <ResourceGauge label="CPU" value={node.id === 'n1' ? 42 : node.id === 'n4' ? 88 : node.id === 'n2' ? 12 : node.id === 'n7' ? 15 : 8} color="text-blue-500" theme={theme} />
                            <ResourceGauge label="RAM" value={node.id === 'n1' ? 68 : node.id === 'n4' ? 75 : node.id === 'n2' ? 45 : node.id === 'n7' ? 22 : 30} color="text-emerald-500" theme={theme} />
                            <ResourceGauge label="DISK" value={node.id === 'n1' ? 85 : node.id === 'n4' ? 40 : node.id === 'n2' ? 20 : node.id === 'n7' ? 92 : 15} color="text-amber-500" theme={theme} />
                          </div>

                          <div className={`mt-4 pt-3 border-t ${theme === 'light' ? 'border-[#141414]/5' : 'border-white/5'}`}>
                            <div className="flex flex-wrap gap-1">
                              {node.services.slice(0, 4).map(s => (
                                <div key={s.name} className={`flex items-center gap-1 px-1 py-0.5 rounded ${theme === 'light' ? 'bg-[#141414]/5' : 'bg-white/5'}`}>
                                  <div className={`w-1 h-1 rounded-full ${
                                    s.status === 'online' ? 'bg-emerald-500' : 
                                    s.status === 'degraded' ? 'bg-amber-500' : 'bg-rose-500'
                                  }`} />
                                  <span className="text-[7px] font-mono">{s.name}</span>
                                </div>
                              ))}
                              {node.services.length > 4 && <span className="text-[7px] font-mono opacity-30 ml-1">+{node.services.length - 4}</span>}
                            </div>
                          </div>

                          <div className="mt-3 flex items-center justify-between opacity-30 group-hover:opacity-100 transition-opacity">
                            <div className="flex items-center gap-1">
                              <Clock className="w-2.5 h-2.5" />
                              <span className="text-[7px] font-mono uppercase">Seen {new Date(node.lastSeen).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <span className="text-[7px] font-mono truncate max-w-[80px]">{node.hardware}</span>
                          </div>
                        </div>
                      );
                    })}
                    {/* Future Expansion Card */}
                    <div className={`p-4 border border-dashed rounded-xl flex flex-col items-center justify-center gap-2 opacity-30 hover:opacity-100 transition-all cursor-pointer ${
                      theme === 'light' ? 'border-[#141414]/20' : 'border-white/20'
                    }`}>
                      <Plus className="w-6 h-6" />
                      <span className="text-[10px] font-mono uppercase">Add Node</span>
                    </div>
                  </div>
                </section>

                {/* Recent Activity & Audit Log */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <section className="lg:col-span-2 space-y-4">
                    <h3 className="font-serif italic text-xl">Global Activity Feed</h3>
                    <div className={`border rounded-xl overflow-hidden transition-colors ${
                      theme === 'light' ? 'border-[#141414] bg-white/30' : 'border-white/10 bg-white/5'
                    }`}>
                      <div className={`grid grid-cols-4 p-4 border-b text-[10px] font-mono uppercase opacity-50 ${
                        theme === 'light' ? 'border-[#141414] bg-[#141414]/5' : 'border-white/10 bg-white/5'
                      }`}>
                        <div>Timestamp</div>
                        <div>Agent / User</div>
                        <div>Action</div>
                        <div className="text-right">Status</div>
                      </div>
                      {[...logs, ...INITIAL_LOGS].map((log, i) => (
                        <div key={i} className={`grid grid-cols-4 p-4 border-b last:border-0 transition-colors group items-center ${
                          theme === 'light' ? 'border-[#141414] hover:bg-[#141414]/5' : 'border-white/10 hover:bg-white/5'
                        }`}>
                          <div className="text-xs font-mono opacity-50">{log.timestamp.split(' ')[1]}</div>
                          <div className="flex items-center gap-2">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                              theme === 'light' ? 'bg-[#141414] text-[#E4E3E0]' : 'bg-white/10 text-white'
                            }`}>
                              {log.user[0]}
                            </div>
                            <span className="text-sm font-medium">{log.user}</span>
                          </div>
                          <div className="text-xs">
                            <span className="opacity-50">{log.action}</span>
                            <span className="mx-1 opacity-20">→</span>
                            <span className="font-mono text-[10px]">{log.tool}</span>
                          </div>
                          <div className="text-right">
                            <span className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded ${
                              log.status === 'allowed' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
                            }`}>
                              {log.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section className="space-y-4">
                    <h3 className="font-serif italic text-xl">Storage Status</h3>
                    <div className={`p-6 border rounded-2xl space-y-6 ${
                      theme === 'light' ? 'border-[#141414] bg-white/50' : 'border-white/10 bg-white/5'
                    }`}>
                      <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-mono uppercase">
                          <span>Unraid Array</span>
                          <span className="font-bold">72% Full</span>
                        </div>
                        <div className={`h-1.5 rounded-full overflow-hidden ${theme === 'light' ? 'bg-[#141414]/5' : 'bg-white/5'}`}>
                          <div className="h-full bg-amber-500 w-[72%]" />
                        </div>
                        <p className="text-[9px] opacity-50 italic">24TB / 32TB Used • 4 Drives Online</p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-mono uppercase">
                          <span>Vector DB</span>
                          <span className="font-bold">1.2M Embeddings</span>
                        </div>
                        <div className={`h-1.5 rounded-full overflow-hidden ${theme === 'light' ? 'bg-[#141414]/5' : 'bg-white/5'}`}>
                          <div className="h-full bg-blue-500 w-[45%]" />
                        </div>
                        <p className="text-[9px] opacity-50 italic">Postgres + pgvector • 4.2GB Index Size</p>
                      </div>
                      <div className={`p-4 rounded-xl border ${theme === 'light' ? 'bg-[#141414]/5 border-[#141414]/10' : 'bg-white/5 border-white/10'}`}>
                        <div className="flex items-center gap-3">
                          <HardDrive className="w-5 h-5 opacity-50" />
                          <div>
                            <p className="text-[10px] font-mono uppercase opacity-50">Parity Status</p>
                            <p className="text-xs font-bold text-emerald-500 uppercase">Valid • Last Check: 2d ago</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
              </motion.div>
            )}

            {activeTab === 'chat' && (
              <motion.div
                key="chat"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="h-[calc(100vh-12rem)] flex gap-6"
              >
                {/* Main Chat Area */}
                <div className="flex-1 border border-[#141414] rounded-2xl bg-white/50 flex flex-col overflow-hidden shadow-2xl">
                  <div className="p-4 border-b border-[#141414] bg-[#141414]/5 flex items-center justify-between">
                    <div className="flex items-center gap-3 relative">
                      {isTyping && (
                        <motion.div 
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.5, 0.2] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="absolute -inset-2 bg-amber-500/20 rounded-full blur-xl"
                        />
                      )}
                      <div className={`w-3 h-3 rounded-full relative z-10 ${isTyping ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
                      <p className="text-xs font-bold uppercase tracking-widest relative z-10">Brain Session: {isTyping ? 'Thinking...' : 'Active'}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex bg-[#141414]/5 p-1 rounded-lg border border-[#141414]/10">
                        {['Llama 3', 'Gemini 3 Flash', 'Gemini 3 Pro'].map(model => (
                          <button
                            key={model}
                            onClick={() => setSelectedModel(model)}
                            className={`px-3 py-1 rounded-md text-[9px] font-mono uppercase transition-all ${
                              selectedModel === model ? 'bg-[#141414] text-[#E4E3E0]' : 'opacity-50 hover:opacity-100'
                            }`}
                          >
                            {model}
                          </button>
                        ))}
                      </div>
                      <div className="h-4 w-[1px] bg-[#141414]/20" />
                      <span className="text-[10px] font-mono opacity-50">mTLS: Verified</span>
                    </div>
                  </div>
                  
                  <div className="flex-1 p-8 space-y-6 overflow-y-auto font-mono text-sm relative">
                    {/* Data Stream Animation Background */}
                    {isTyping && (
                      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.03]">
                        {[...Array(10)].map((_, i) => (
                          <motion.div
                            key={i}
                            initial={{ y: -100, x: Math.random() * 100 + '%' }}
                            animate={{ y: 1000 }}
                            transition={{ 
                              duration: Math.random() * 5 + 5, 
                              repeat: Infinity, 
                              ease: "linear",
                              delay: Math.random() * 5
                            }}
                            className="absolute w-[1px] h-20 bg-[#141414]"
                          />
                        ))}
                      </div>
                    )}
                    {messages.map((msg, idx) => (
                      <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-8 h-8 rounded border border-[#141414] flex items-center justify-center ${
                          msg.role === 'model' ? 'bg-[#141414] text-[#E4E3E0]' : 'bg-white text-[#141414]'
                        }`}>
                          {msg.role === 'model' ? <Zap className="w-4 h-4" /> : <UserIcon className="w-4 h-4" />}
                        </div>
                        <div className={`flex-1 space-y-2 ${msg.role === 'user' ? 'text-right' : ''}`}>
                          <div className="flex items-center gap-2 opacity-50 text-[10px] uppercase justify-start flex-row">
                            {msg.role === 'model' ? 'JARVIS' : 'KEN'}
                            {msg.mode === 'overnight' && <Moon className="w-3 h-3 text-indigo-500" />}
                          </div>
                          <div className={`p-4 border border-[#141414] rounded-xl inline-block max-w-2xl text-left ${
                            msg.role === 'model' ? 'bg-[#141414]/5' : 'bg-[#141414] text-[#E4E3E0]'
                          }`}>
                            {msg.text}
                          </div>
                        </div>
                      </div>
                    ))}
                    {isTyping && (
                      <div className="flex gap-4">
                        <div className="w-8 h-8 rounded border border-[#141414] flex items-center justify-center bg-[#141414] text-[#E4E3E0]">
                          <Zap className="w-4 h-4" />
                        </div>
                        <div className="flex-1 space-y-2">
                          <p className="opacity-50 text-[10px] uppercase">JARVIS</p>
                          <div className="flex gap-1 p-4">
                            <div className="w-1.5 h-1.5 bg-[#141414] rounded-full animate-bounce" />
                            <div className="w-1.5 h-1.5 bg-[#141414] rounded-full animate-bounce [animation-delay:0.2s]" />
                            <div className="w-1.5 h-1.5 bg-[#141414] rounded-full animate-bounce [animation-delay:0.4s]" />
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>

                  <div className={`p-6 border-t ${theme === 'dark' ? 'border-white/10 bg-[#141414]' : 'border-[#141414] bg-white'} space-y-4`}>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => setChatMode('realtime')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${
                          chatMode === 'realtime' 
                            ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500' 
                            : theme === 'dark' ? 'border-white/10 opacity-50 hover:opacity-100' : 'border-[#141414]/10 opacity-50 hover:opacity-100'
                        }`}
                      >
                        <Zap className="w-4 h-4" />
                        <div className="text-left">
                          <p className="text-[10px] font-bold uppercase leading-none">Real-time</p>
                          <p className="text-[8px] opacity-70">Instant response</p>
                        </div>
                      </button>
                      <button
                        onClick={() => setChatMode('overnight')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${
                          chatMode === 'overnight' 
                            ? 'bg-indigo-500/10 border-indigo-500 text-indigo-500' 
                            : theme === 'dark' ? 'border-white/10 opacity-50 hover:opacity-100' : 'border-[#141414]/10 opacity-50 hover:opacity-100'
                        }`}
                      >
                        <Moon className="w-4 h-4" />
                        <div className="text-left">
                          <p className="text-[10px] font-bold uppercase leading-none">Overnight Agent</p>
                          <p className="text-[8px] opacity-70">Long-running task</p>
                        </div>
                      </button>
                    </div>

                    {chatMode === 'overnight' && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`grid grid-cols-2 gap-4 p-4 ${theme === 'dark' ? 'bg-indigo-500/10 border-indigo-500/30' : 'bg-indigo-500/5 border-indigo-500/20'} border rounded-xl`}
                      >
                        <div className="space-y-2">
                          <p className="text-[9px] font-mono uppercase opacity-50">Task Priority</p>
                          <div className="flex gap-2">
                            {(['low', 'medium', 'high'] as const).map(p => (
                              <button
                                key={p}
                                onClick={() => setTaskPriority(p)}
                                className={`flex-1 py-1 rounded border text-[9px] font-mono uppercase transition-all ${
                                  taskPriority === p ? 'bg-indigo-500 border-indigo-500 text-white' : theme === 'dark' ? 'border-white/10 opacity-50' : 'border-[#141414]/10 opacity-50'
                                }`}
                              >
                                {p}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <p className="text-[9px] font-mono uppercase opacity-50">Retry Strategy</p>
                          <div className="flex gap-2">
                            {(['none', 'exponential', 'aggressive'] as const).map(s => (
                              <button
                                key={s}
                                onClick={() => setRetryStrategy(s)}
                                className={`flex-1 py-1 rounded border text-[9px] font-mono uppercase transition-all ${
                                  retryStrategy === s ? 'bg-indigo-500 border-indigo-500 text-white' : theme === 'dark' ? 'border-white/10 opacity-50' : 'border-[#141414]/10 opacity-50'
                                }`}
                              >
                                {s}
                              </button>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}

                    <form 
                      onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
                      className="relative"
                    >
                      <input 
                        type="text" 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={chatMode === 'realtime' ? "Execute command or query Brain..." : "Describe the overnight task for JARVIS..."}
                        className={`w-full ${theme === 'dark' ? 'bg-white/5 border-white/20 focus:ring-white/10' : 'bg-[#141414]/5 border-[#141414] focus:ring-[#141414]/10'} border rounded-xl px-6 py-4 focus:outline-none focus:ring-2 font-mono text-sm`}
                      />
                      <button 
                        type="submit"
                        className={`absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${
                          chatMode === 'realtime' ? (theme === 'dark' ? 'bg-white text-[#141414]' : 'bg-[#141414] text-[#E4E3E0]') : 'bg-indigo-600 text-white'
                        }`}
                      >
                        <Send className="w-3 h-3" />
                        <span className="text-[10px] font-bold uppercase">{chatMode === 'realtime' ? 'Send' : 'Schedule'}</span>
                      </button>
                    </form>
                  </div>
                </div>

                {/* Scheduled Tasks Sidebar */}
                <div className={`w-80 border ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-[#141414] bg-white/50'} rounded-2xl flex flex-col overflow-hidden shadow-xl`}>
                  <div className={`p-4 border-b ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-[#141414] bg-[#141414]/5'} flex items-center gap-2`}>
                    <ListTodo className="w-4 h-4 opacity-50" />
                    <h4 className="text-[10px] font-bold uppercase tracking-widest">Overnight Queue</h4>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {scheduledTasks.map(task => (
                      <div key={task.id} className={`p-3 border ${theme === 'dark' ? 'border-white/10 bg-white/5 hover:border-white/30' : 'border-[#141414]/10 bg-white hover:border-[#141414]'} rounded-xl space-y-2 group transition-all`}>
                        <div className="flex justify-between items-start">
                          <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase ${
                            task.status === 'running' ? 'bg-indigo-500 text-white animate-pulse' : 
                            task.status === 'completed' ? 'bg-emerald-500 text-white' : theme === 'dark' ? 'bg-white/10' : 'bg-[#141414]/10'
                          }`}>
                            {task.status}
                          </span>
                          <span className="text-[9px] font-mono opacity-50">{task.startTime}</span>
                        </div>
                        <h5 className="text-xs font-bold leading-tight">{task.title}</h5>
                        <p className="text-[10px] opacity-50 line-clamp-2">{task.description}</p>
                        <div className="pt-2 flex justify-between items-center">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-1">
                              <div className={`w-1.5 h-1.5 rounded-full ${
                                task.priority === 'high' ? 'bg-rose-500' : 
                                task.priority === 'medium' ? 'bg-amber-500' : 'bg-blue-500'
                              }`} />
                              <span className="text-[8px] font-mono uppercase opacity-50">{task.priority} Priority</span>
                            </div>
                            <div className="flex items-center gap-2 text-[7px] font-mono uppercase opacity-30">
                              <span>{task.model}</span>
                              <span>•</span>
                              <span>Retry: {task.retryStrategy}</span>
                            </div>
                          </div>
                          <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <ArrowUpRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className={`p-4 border-t ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-[#141414] bg-[#141414]/5'}`}>
                    <div className="flex items-center justify-between text-[10px] font-mono uppercase opacity-50">
                      <span>Next Sync</span>
                      <span>02:00 AM</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'agents' && (
              <motion.div
                key="agents"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-12"
              >
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-serif italic text-2xl">Agent Registry</h3>
                    <p className="text-xs opacity-50 font-mono uppercase mt-1">Governed by Central Policy Gateway</p>
                  </div>
                  <div className="flex gap-4">
                    <div className={`px-4 py-2 border rounded-xl ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-[#141414]/10 bg-white'} flex items-center gap-6`}>
                      <div className="text-center">
                        <p className="text-[8px] font-mono uppercase opacity-50">Avg CPU</p>
                        <p className="text-sm font-bold">35.6%</p>
                      </div>
                      <div className="w-[1px] h-6 bg-current opacity-10" />
                      <div className="text-center">
                        <p className="text-[8px] font-mono uppercase opacity-50">Avg RAM</p>
                        <p className="text-sm font-bold">39.8%</p>
                      </div>
                      <div className="w-[1px] h-6 bg-current opacity-10" />
                      <div className="text-center">
                        <p className="text-[8px] font-mono uppercase opacity-50">Avg Security</p>
                        <p className="text-sm font-bold text-emerald-500">77.0</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setIsWizardOpen(true)}
                      className="bg-[#141414] text-[#E4E3E0] px-6 py-2 rounded-lg text-sm font-bold hover:bg-[#141414]/90 transition-all flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" /> Deploy New Agent
                    </button>
                  </div>
                </div>

                {/* Agent Lifecycle Pipeline */}
                <section className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 opacity-30" />
                      <h4 className="font-serif italic text-xl">Agent Lifecycle Pipeline</h4>
                    </div>
                    <div className="flex items-center gap-4 text-[10px] font-mono uppercase opacity-50">
                      <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500" /> Healthy</div>
                      <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-amber-500" /> Bottleneck</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {[
                      { stage: 'Draft', count: 4, color: 'bg-blue-500', desc: 'Static analysis passed', metric: '98% Success' },
                      { stage: 'Staging', count: 2, color: 'bg-indigo-500', desc: 'Sandbox testing', metric: '1.2h Avg' },
                      { stage: 'Review', count: 1, color: 'bg-amber-500', desc: 'Admin approval', metric: '4.5h Wait' },
                      { stage: 'Active', count: 12, color: 'bg-emerald-500', desc: 'Production live', metric: '99.9% Uptime' },
                      { stage: 'Suspended', count: 0, color: 'bg-rose-500', desc: 'Anomaly detected', metric: '0 Alerts' },
                      { stage: 'Retired', count: 8, color: 'bg-gray-500', desc: 'Keys revoked', metric: '14d Lifespan' },
                    ].map((step, idx) => (
                      <div key={step.stage} className="relative group">
                        <div className={`p-4 border ${theme === 'dark' ? 'border-white/10 bg-white/5 hover:bg-white/10' : 'border-[#141414] bg-white/50 hover:bg-[#141414] hover:text-[#E4E3E0]'} rounded-xl space-y-3 h-full transition-all cursor-default`}>
                          <div className="flex justify-between items-start">
                            <span className="text-[10px] font-mono opacity-50 uppercase">0{idx + 1}</span>
                            <div className={`w-2 h-2 rounded-full ${step.color}`} />
                          </div>
                          <div>
                            <p className="text-2xl font-bold tracking-tighter">{step.count}</p>
                            <p className="text-xs font-bold">{step.stage}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-[9px] font-mono opacity-50 leading-tight group-hover:opacity-100">{step.desc}</p>
                            <p className={`text-[10px] font-bold ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`}>{step.metric}</p>
                          </div>
                        </div>
                        {idx < 5 && (
                          <div className="hidden lg:block absolute -right-2 top-1/2 -translate-y-1/2 z-10">
                            <ChevronRight className="w-4 h-4 opacity-20" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Stage Performance Table */}
                  <div className={`border ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-[#141414] bg-white/30'} rounded-xl overflow-hidden`}>
                    <div className={`grid grid-cols-5 p-3 border-b ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-[#141414] bg-[#141414]/5'} text-[9px] font-mono uppercase opacity-50`}>
                      <div>Lifecycle Phase</div>
                      <div>Primary Metric</div>
                      <div>Throughput</div>
                      <div>Risk Level</div>
                      <div>Governance Check</div>
                    </div>
                    {[
                      { phase: 'Creation (Draft)', metric: 'Generation Integrity', val: '98.2%', throughput: '4.1/day', risk: 'Low', check: 'Static Analysis' },
                      { phase: 'Validation (Staging)', metric: 'Tool Safety Pass', val: '100%', throughput: '2.4/day', risk: 'Medium', check: 'Sandbox Isolation' },
                      { phase: 'Approval (Review)', metric: 'Admin Response', val: '4.5h', throughput: '1.8/day', risk: 'High', check: 'Human-in-the-loop' },
                      { phase: 'Operation (Active)', metric: 'Policy Adherence', val: '99.9%', throughput: '142 calls/hr', risk: 'Low', check: 'Real-time Audit' },
                      { phase: 'Retirement (Retired)', metric: 'Key Revocation', val: 'Instant', throughput: '0.5/day', risk: 'Low', check: 'mTLS Rotation' },
                    ].map((row, i) => (
                      <div key={i} className={`grid grid-cols-5 p-3 border-b ${theme === 'dark' ? 'border-white/10 hover:bg-white/5' : 'border-[#141414] hover:bg-[#141414]/5'} last:border-0 text-xs transition-colors`}>
                        <div className="font-bold">{row.phase}</div>
                        <div className="flex items-center gap-2">
                          <span className="opacity-70">{row.metric}:</span>
                          <span className={`font-mono font-bold ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`}>{row.val}</span>
                        </div>
                        <div className="font-mono opacity-70">{row.throughput}</div>
                        <div>
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                            row.risk === 'Low' ? 'bg-emerald-500/10 text-emerald-500' : 
                            row.risk === 'Medium' ? 'bg-amber-500/10 text-amber-500' : 'bg-rose-500/10 text-rose-500'
                          }`}>
                            {row.risk}
                          </span>
                        </div>
                        <div className="text-[10px] opacity-50 italic">{row.check}</div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Active Agents Grid */}
                <section className="space-y-6">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 opacity-30" />
                    <h4 className="font-serif italic text-xl">Active Agent Registry & Health Monitoring</h4>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {agents.map((agent) => (
                      <div key={agent.id} className={`border ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-[#141414] bg-white/50'} rounded-2xl p-6 space-y-6 hover:shadow-xl transition-all group relative overflow-hidden`}>
                        {/* Health Background Glow */}
                        <div className={`absolute top-0 right-0 w-32 h-32 blur-3xl opacity-10 pointer-events-none ${
                          agent.health > 90 ? 'bg-emerald-500' : agent.health > 70 ? 'bg-amber-500' : 'bg-rose-500'
                        }`} />

                        <div className="flex items-center justify-between relative z-10">
                          <div className={`w-12 h-12 rounded-xl border ${theme === 'dark' ? 'border-white/20 bg-white/10' : 'border-[#141414] bg-[#141414]/5'} flex items-center justify-center group-hover:bg-[#141414] group-hover:text-[#E4E3E0] transition-colors`}>
                            <Users className="w-6 h-6" />
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <StatusBadge status={agent.status === 'active' ? 'online' : 'offline'} theme={theme} />
                            <span className={`text-[10px] font-mono font-bold ${
                              agent.health > 90 ? 'text-emerald-500' : agent.health > 70 ? 'text-amber-500' : 'text-rose-500'
                            }`}>
                              HEALTH: {agent.health}%
                            </span>
                          </div>
                        </div>

                        <div className="relative z-10">
                          <h4 className="font-bold text-lg">{agent.name}</h4>
                          <p className="text-xs opacity-50 font-mono uppercase">{agent.role}</p>
                        </div>

                        {/* Health Dashboard */}
                        <div className={`p-4 rounded-2xl border ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-[#141414]/5 border-[#141414]/10'} space-y-4 relative z-10`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-[10px] font-bold font-mono uppercase opacity-50">
                              <Activity className="w-3 h-3" />
                              Health Dashboard
                            </div>
                            <div className="flex gap-3 text-[8px] font-mono uppercase">
                              <div className="flex items-center gap-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> CPU
                              </div>
                              <div className="flex items-center gap-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> RAM
                              </div>
                            </div>
                          </div>

                          <AgentPerformanceChart cpu={agent.cpuUsage || 0} memory={agent.memoryUsage || 0} theme={theme} />

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <div className="flex justify-between text-[8px] font-mono uppercase opacity-50">
                                <span>CPU Usage</span>
                                <span>{agent.cpuUsage}%</span>
                              </div>
                              <div className={`h-1 rounded-full overflow-hidden ${theme === 'light' ? 'bg-[#141414]/5' : 'bg-white/5'}`}>
                                <div 
                                  className={`h-full transition-all duration-500 ${
                                    (agent.cpuUsage || 0) > 80 ? 'bg-rose-500' : (agent.cpuUsage || 0) > 50 ? 'bg-amber-500' : 'bg-emerald-500'
                                  }`}
                                  style={{ width: `${agent.cpuUsage}%` }}
                                />
                              </div>
                            </div>
                            <div className="space-y-1">
                              <div className="flex justify-between text-[8px] font-mono uppercase opacity-50">
                                <span>Memory</span>
                                <span>{agent.memoryUsage}%</span>
                              </div>
                              <div className={`h-1 rounded-full overflow-hidden ${theme === 'light' ? 'bg-[#141414]/5' : 'bg-white/5'}`}>
                                <div 
                                  className={`h-full transition-all duration-500 ${
                                    (agent.memoryUsage || 0) > 80 ? 'bg-rose-500' : (agent.memoryUsage || 0) > 50 ? 'bg-amber-500' : 'bg-emerald-500'
                                  }`}
                                  style={{ width: `${agent.memoryUsage}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Progress Visualization */}
                        {agent.progress !== undefined && (
                          <div className="space-y-3 relative z-10">
                            <div className="flex justify-between items-end">
                              <div className="space-y-1">
                                <p className="text-[8px] font-mono uppercase opacity-50">Current Operation</p>
                                <p className="text-xs font-bold tracking-tight">{agent.activeTask}</p>
                              </div>
                              <div className="text-right">
                                <span className={`text-lg font-mono font-black ${theme === 'light' ? 'text-[#141414]' : 'text-emerald-500'}`}>
                                  {agent.progress}%
                                </span>
                              </div>
                            </div>
                            
                            <div className={`h-2.5 rounded-full overflow-hidden relative ${theme === 'light' ? 'bg-[#141414]/10' : 'bg-white/10'}`}>
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${agent.progress}%` }}
                                className={`h-full relative ${theme === 'light' ? 'bg-[#141414]' : 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]'}`}
                              >
                                {/* Animated Shine Effect */}
                                <motion.div 
                                  animate={{ x: ['-100%', '200%'] }}
                                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-1/2 skew-x-12"
                                />
                              </motion.div>
                            </div>

                            {agent.estimatedCompletion && (
                              <div className="flex justify-between items-center text-[9px] font-mono uppercase opacity-50">
                                <div className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  <span>ETA: {agent.estimatedCompletion}</span>
                                </div>
                                <span>{agent.progress < 100 ? 'In Progress' : 'Completed'}</span>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Tool Usage Monitoring */}
                        <div className="space-y-3 relative z-10">
                          <p className="text-[10px] font-mono uppercase opacity-50 border-b pb-1 border-current/10">Tool Usage Monitor</p>
                          <div className="space-y-2 max-h-32 overflow-y-auto pr-2 custom-scrollbar">
                            {toolUsage.filter(u => u.agentId === agent.id).map(usage => (
                              <div key={usage.id} className={`p-2 rounded-lg border ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-[#141414]/5 border-[#141414]/10'} space-y-1`}>
                                <div className="flex justify-between items-center">
                                  <span className="text-[10px] font-bold font-mono">{usage.toolName}</span>
                                  <span className="text-[9px] opacity-50 font-mono">{usage.count} calls</span>
                                </div>
                                <div className="text-[8px] opacity-40 font-mono truncate" title={usage.parameters}>
                                  Params: {usage.parameters}
                                </div>
                                <div className="text-[7px] opacity-30 font-mono text-right">
                                  Last: {usage.lastUsed}
                                </div>
                              </div>
                            ))}
                            {toolUsage.filter(u => u.agentId === agent.id).length === 0 && (
                              <p className="text-[10px] opacity-30 italic text-center py-2">No tool telemetry recorded</p>
                            )}
                          </div>
                        </div>

                        <div className={`pt-4 border-t ${theme === 'dark' ? 'border-white/10' : 'border-[#141414]/10'} space-y-4 relative z-10`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <ClassificationBadge level={agent.classification} theme={theme} />
                              <span className="text-[10px] font-mono opacity-50">{agent.model}</span>
                            </div>
                            <div className="flex gap-2">
                              <button className={`p-2 ${theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-[#141414]/5'} rounded-lg transition-colors`}>
                                <Activity className="w-4 h-4" />
                              </button>
                              <button className={`p-2 ${theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-[#141414]/5'} rounded-lg transition-colors`}>
                                <Settings className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {/* Security Overview */}
                          <div className={`p-3 rounded-xl border ${theme === 'dark' ? 'bg-rose-500/5 border-rose-500/20' : 'bg-rose-500/5 border-rose-500/20'} space-y-3`}>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 text-[10px] font-bold font-mono text-rose-500 uppercase">
                                <ShieldAlert className="w-3 h-3" />
                                Security Overview
                              </div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-[8px] font-mono opacity-50 uppercase">Score</span>
                                <div className="relative w-8 h-8">
                                  <svg className="w-full h-full" viewBox="0 0 36 36">
                                    <path
                                      className="stroke-current opacity-10"
                                      strokeWidth="3"
                                      fill="none"
                                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    />
                                    <path
                                      className={`${(agent.securityScore || 0) > 80 ? 'text-emerald-500' : (agent.securityScore || 0) > 50 ? 'text-amber-500' : 'text-rose-500'} stroke-current`}
                                      strokeWidth="3"
                                      strokeDasharray={`${agent.securityScore}, 100`}
                                      strokeLinecap="round"
                                      fill="none"
                                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    />
                                    <text x="18" y="21" className="text-[10px] font-mono font-bold fill-current text-center" textAnchor="middle">{agent.securityScore}</text>
                                  </svg>
                                </div>
                              </div>
                            </div>
                            <div className="space-y-1">
                              <div className="flex justify-between text-[9px] font-mono opacity-70">
                                <span>Allowed Tools</span>
                                <span className="text-emerald-500">{agent.allowedTools.length} Active</span>
                              </div>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {agent.allowedTools.map(tool => (
                                  <span key={tool} className={`text-[8px] font-mono px-1.5 py-0.5 rounded ${theme === 'dark' ? 'bg-white/5' : 'bg-[#141414]/5'}`}>
                                    {tool}
                                  </span>
                                ))}
                              </div>
                            </div>
                            {(agent.vulnerabilities?.length || 0) > 0 && (
                              <div className="flex items-start gap-2 text-[9px] font-mono text-rose-500/80">
                                <AlertTriangle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                                <span>{agent.vulnerabilities?.length} Vulnerabilities Detected</span>
                              </div>
                            )}
                            {(agent.policyViolations?.length || 0) > 0 && (
                              <div className="flex items-start gap-2 text-[9px] font-mono text-amber-500/80">
                                <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                                <span>{agent.policyViolations?.length} Policy Violations</span>
                              </div>
                            )}

                            <div className="pt-2 border-t border-rose-500/10 space-y-2">
                              <div className="flex justify-between items-center text-[9px] font-mono opacity-50 uppercase">
                                <span>Last Security Scan</span>
                                <span>{agent.lastSecurityScan || 'Never'}</span>
                              </div>
                              <div className="flex gap-2">
                                <button 
                                  onClick={() => handleScanNow(agent.id)}
                                  disabled={scanningAgentId === agent.id}
                                  className={`flex-1 py-2 rounded-lg text-[10px] font-bold font-mono uppercase transition-all flex items-center justify-center gap-2 ${
                                    theme === 'dark' 
                                      ? 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20' 
                                      : 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20'
                                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                                >
                                  {scanningAgentId === agent.id ? (
                                    <>
                                      <RefreshCw className="w-3 h-3 animate-spin" />
                                      Scanning...
                                    </>
                                  ) : (
                                    <>
                                      <Scan className="w-3 h-3" />
                                      Scan Now
                                    </>
                                  )}
                                </button>
                                <button 
                                  onClick={() => setSelectedAgentForSecurity(agent)}
                                  className={`flex-1 py-2 rounded-lg text-[10px] font-bold font-mono uppercase transition-all flex items-center justify-center gap-2 ${
                                    theme === 'dark' 
                                      ? 'bg-rose-500/10 text-rose-500 hover:bg-rose-500/20' 
                                      : 'bg-rose-500/10 text-rose-500 hover:bg-rose-500/20'
                                  }`}
                                >
                                  <ShieldAlert className="w-3 h-3" />
                                  Report
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </motion.div>
            )}

            {activeTab === 'governance' && (
              <motion.div
                key="governance"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {POLICIES.map((policy) => (
                    <div key={policy.id} className={`p-6 border rounded-2xl transition-colors ${
                      theme === 'light' ? 'bg-white border-[#141414] shadow-sm' : 'bg-white/5 border-white/10'
                    }`}>
                      <div className="flex justify-between items-start mb-4">
                        <div className={`p-2 rounded-lg ${theme === 'light' ? 'bg-[#141414]/5' : 'bg-white/5'}`}>
                          <Shield className={`w-5 h-5 ${theme === 'light' ? 'text-[#141414]' : 'text-emerald-500'}`} />
                        </div>
                        <ClassificationBadge level={policy.classification} theme={theme} />
                      </div>
                      <h4 className="font-bold tracking-tight">{policy.name}</h4>
                      <div className="mt-4 space-y-2">
                        <div className="flex justify-between text-[10px] font-mono uppercase opacity-50">
                          <span>Target Tool</span>
                          <span className="font-bold">{policy.tool}</span>
                        </div>
                        <div className="flex justify-between text-[10px] font-mono uppercase opacity-50">
                          <span>Required Role</span>
                          <span className="font-bold">{policy.role}</span>
                        </div>
                        <div className="flex justify-between text-[10px] font-mono uppercase opacity-50">
                          <span>MFA Required</span>
                          <span className={policy.mfa ? 'text-emerald-500 font-bold' : ''}>{policy.mfa ? 'YES' : 'NO'}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Matrix Routing Section */}
                <section className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif italic text-2xl">Matrix Routing Engine</h3>
                    <div className="flex gap-2">
                      <div className="flex items-center gap-4 text-[10px] font-mono uppercase opacity-50">
                        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500" /> Routed</div>
                        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-rose-500" /> Blocked</div>
                        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-amber-500" /> Bypassed</div>
                      </div>
                    </div>
                  </div>
                  <div className={`border rounded-xl overflow-hidden transition-colors ${
                    theme === 'light' ? 'bg-white border-[#141414]/10' : 'bg-white/5 border-white/10'
                  }`}>
                    <div className={`grid grid-cols-6 p-4 border-b text-[10px] font-mono uppercase opacity-50 ${
                      theme === 'light' ? 'bg-[#141414]/5 border-[#141414]/10' : 'bg-white/5 border-white/10'
                    }`}>
                      <div>Source</div>
                      <div>Destination</div>
                      <div className="col-span-2">Policy Applied</div>
                      <div>Latency</div>
                      <div className="text-right">Status</div>
                    </div>
                    {matrixRoutes.map(route => (
                      <div key={route.id} className={`grid grid-cols-6 p-4 border-b last:border-0 transition-colors items-center ${
                        theme === 'light' ? 'border-[#141414]/10 hover:bg-[#141414]/5' : 'border-white/10 hover:bg-white/5'
                      }`}>
                        <div className="text-sm font-bold">{route.source}</div>
                        <div className="text-sm opacity-70 font-mono">{route.destination}</div>
                        <div className="col-span-2 text-xs opacity-50 italic">{route.policy}</div>
                        <div className="text-xs font-mono">{route.latency}ms</div>
                        <div className="text-right">
                          <span className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded ${
                            route.status === 'routed' ? 'bg-emerald-500/10 text-emerald-500' : 
                            route.status === 'blocked' ? 'bg-rose-500/10 text-rose-500' : 'bg-amber-500/10 text-amber-500'
                          }`}>
                            {route.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Agent Proof of Action Section */}
                <section className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif italic text-2xl">Agent Proof of Action (Stage Verification)</h3>
                    <div className="flex gap-2">
                      <button className={`px-3 py-1 rounded-full text-[10px] font-mono uppercase border transition-all ${
                        theme === 'light' ? 'border-[#141414]/10 hover:bg-[#141414]/5' : 'border-white/10 hover:bg-white/5'
                      }`}>
                        <Fingerprint className="w-3 h-3 inline mr-1" /> Verify All Hashes
                      </button>
                    </div>
                  </div>
                  <div className={`border rounded-xl overflow-hidden transition-colors ${
                    theme === 'light' ? 'bg-white border-[#141414]/10' : 'bg-white/5 border-white/10'
                  }`}>
                    <div className={`grid grid-cols-6 p-4 border-b text-[10px] font-mono uppercase opacity-50 ${
                      theme === 'light' ? 'bg-[#141414]/5 border-[#141414]/10' : 'bg-white/5 border-white/10'
                    }`}>
                      <div>Agent</div>
                      <div className="col-span-2">Action / Changes</div>
                      <div>Stage</div>
                      <div>Hash (Proof)</div>
                      <div className="text-right">Timestamp</div>
                    </div>
                    {agentProofs.map(proof => (
                      <div key={proof.id} className={`grid grid-cols-6 p-4 border-b last:border-0 transition-colors items-center ${
                        theme === 'light' ? 'border-[#141414]/10 hover:bg-[#141414]/5' : 'border-white/10 hover:bg-white/5'
                      }`}>
                        <div className="flex items-center gap-2">
                          <div className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold ${
                            theme === 'light' ? 'bg-[#141414] text-[#E4E3E0]' : 'bg-emerald-500 text-[#0A0A0A]'
                          }`}>
                            {proof.agentName[0]}
                          </div>
                          <span className="text-sm font-bold">{proof.agentName}</span>
                        </div>
                        <div className="col-span-2">
                          <p className="text-sm font-medium">{proof.action}</p>
                          {proof.changes && <p className="text-[10px] opacity-50 font-mono mt-1 italic">{proof.changes}</p>}
                        </div>
                        <div>
                          <span className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded ${
                            proof.stage === 'Production' ? 'bg-emerald-500/10 text-emerald-500' : 
                            proof.stage === 'Review' ? 'bg-amber-500/10 text-amber-500' : 'bg-blue-500/10 text-blue-500'
                          }`}>
                            {proof.stage}
                          </span>
                        </div>
                        <div className="text-[10px] font-mono opacity-50 truncate pr-4" title={proof.hash}>
                          {proof.hash}
                        </div>
                        <div className="text-right text-[10px] font-mono opacity-50">
                          {proof.timestamp}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </motion.div>
            )}

            {activeTab === 'mesh' && (
              <motion.div
                key="mesh"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <MeshView nodes={nodes} theme={theme} />
              </motion.div>
            )}

            {activeTab === 'documents' && (
              <motion.div
                key="documents"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-serif italic text-3xl">Document Ingestion</h3>
                  <div className="flex gap-2">
                    <button 
                      onClick={handleScanUnraid}
                      disabled={isScanning}
                      className={`border px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
                        isScanning ? 'opacity-50 cursor-not-allowed' : ''
                      } ${
                        theme === 'light' ? 'border-[#141414] hover:bg-[#141414] hover:text-[#E4E3E0]' : 'border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <Database className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} /> 
                      {isScanning ? 'Scanning Storage...' : 'Scan Unraid Storage'}
                    </button>
                  </div>
                </div>

                {/* Upload Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className={`lg:col-span-1 p-6 border rounded-2xl space-y-6 ${
                    theme === 'light' ? 'bg-white border-[#141414]/10' : 'bg-white/5 border-white/10'
                  }`}>
                    <div className="space-y-2">
                      <h4 className="font-bold tracking-tight">Ingest New Document</h4>
                      <p className="text-xs opacity-50">Upload files to the JARVIS processing pipeline.</p>
                    </div>

                    <div className={`border-2 border-dashed rounded-xl p-8 text-center space-y-4 transition-colors cursor-pointer ${
                      theme === 'light' ? 'border-[#141414]/20 hover:border-[#141414]' : 'border-white/10 hover:border-white/30'
                    }`}>
                      <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto">
                        <Plus className="w-6 h-6 text-emerald-500" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-bold">Click or drag to upload</p>
                        <p className="text-[10px] opacity-50 font-mono uppercase">PDF, DOCX, TXT, MD (MAX 50MB)</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-3">
                        <label className="text-[10px] font-mono uppercase opacity-50">Classification Level</label>
                        <div className="grid grid-cols-4 gap-2">
                          {[10, 20, 30, 40].map(level => (
                            <button 
                              key={level}
                              onClick={() => setIngestionClass(level)}
                              className={`py-2 rounded border text-xs font-bold transition-all ${
                                ingestionClass === level
                                  ? (theme === 'light' ? 'bg-[#141414] text-[#E4E3E0] border-[#141414]' : 'bg-emerald-500 text-[#0A0A0A] border-emerald-500')
                                  : (theme === 'light' ? 'border-[#141414]/10 hover:bg-[#141414]/5' : 'border-white/10 hover:bg-white/10')
                              }`}
                            >
                              T{level}
                            </button>
                          ))}
                        </div>
                        <div className={`p-3 rounded-lg border text-[9px] font-mono space-y-1.5 ${
                          theme === 'light' ? 'bg-[#141414]/5 border-[#141414]/10' : 'bg-white/5 border-white/10 opacity-70'
                        }`}>
                          <p className="font-bold uppercase opacity-50 mb-1">Level Key</p>
                          <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500" /> <span>T10: Public / General</span></div>
                          <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-500" /> <span>T20: Internal / Private</span></div>
                          <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-amber-500" /> <span>T30: Confidential / PII</span></div>
                          <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-rose-500" /> <span>T40: Restricted / Secret</span></div>
                        </div>
                      </div>
                      <button 
                        onClick={handleInitiatePipeline}
                        disabled={isUploading}
                        className={`w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                          isUploading ? 'opacity-50 cursor-not-allowed' : ''
                        } ${
                          theme === 'light' ? 'bg-[#141414] text-[#E4E3E0]' : 'bg-emerald-500 text-[#0A0A0A]'
                        }`}
                      >
                        {isUploading ? <Activity className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                        {isUploading ? 'Uploading...' : 'Initiate Pipeline'}
                      </button>
                    </div>
                  </div>

                  <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold tracking-tight">Active Pipeline</h4>
                      <span className="text-[10px] font-mono opacity-50 uppercase">{documents.length} Documents</span>
                    </div>
                    <div className={`border rounded-xl overflow-hidden transition-colors ${
                      theme === 'light' ? 'bg-white/30 border-[#141414]/10' : 'bg-white/5 border-white/10'
                    }`}>
                      <div className={`grid grid-cols-5 p-4 border-b text-[10px] font-mono uppercase opacity-50 ${
                        theme === 'light' ? 'bg-[#141414]/5 border-[#141414]/10' : 'bg-white/5 border-white/10'
                      }`}>
                        <div>Document</div>
                        <div>Class</div>
                        <div>Stage</div>
                        <div>Status</div>
                        <div className="text-right">Actions</div>
                      </div>
                      {documents.map(doc => (
                        <div key={doc.id} className={`grid grid-cols-5 p-4 border-b last:border-0 transition-colors items-center ${
                          theme === 'light' ? 'border-[#141414]/5 hover:bg-[#141414]/5' : 'border-white/10 hover:bg-white/5'
                        }`}>
                          <div className="font-medium flex items-center gap-2 truncate">
                            <FileText className="w-4 h-4 opacity-30" />
                            {doc.name}
                          </div>
                          <div><ClassificationBadge level={doc.classification} theme={theme} /></div>
                          <div className="flex items-center gap-2">
                            <div className={`w-16 h-1 rounded-full overflow-hidden ${theme === 'light' ? 'bg-[#141414]/10' : 'bg-white/10'}`}>
                              <div className={`h-full ${theme === 'light' ? 'bg-[#141414]' : 'bg-emerald-500'} ${
                                doc.stage === 'ingest' ? 'w-1/3' : doc.stage === 'process' ? 'w-2/3' : 'w-full'
                              }`} />
                            </div>
                            <span className="text-[8px] font-mono uppercase opacity-50">{doc.stage}</span>
                          </div>
                          <div>
                            {doc.status === 'completed' ? (
                              <span className={`${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'} flex items-center gap-1 text-[9px] font-bold uppercase`}>
                                <CheckCircle2 className="w-2.5 h-2.5" /> Ready
                              </span>
                            ) : doc.status === 'pending' ? (
                              <span className={`${theme === 'dark' ? 'text-amber-400' : 'text-amber-600'} flex items-center gap-1 text-[9px] font-bold uppercase`}>
                                <Clock className="w-2.5 h-2.5 animate-pulse" /> Processing
                              </span>
                            ) : (
                              <span className={`${theme === 'dark' ? 'text-rose-400' : 'text-rose-600'} flex items-center gap-1 text-[9px] font-bold uppercase`}>
                                <AlertTriangle className="w-2.5 h-2.5" /> Failed
                              </span>
                            )}
                          </div>
                          <div className="flex gap-1 justify-end">
                            <button className={`p-1 rounded transition-colors ${theme === 'light' ? 'hover:bg-[#141414]/10' : 'hover:bg-white/10'}`}><Eye className="w-3.5 h-3.5" /></button>
                            <button className={`p-1 rounded transition-colors ${theme === 'light' ? 'hover:bg-[#141414]/10' : 'hover:bg-white/10'}`}><Settings className="w-3.5 h-3.5" /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'code' && (
              <motion.div
                key="code"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <CodeView theme={theme} />
              </motion.div>
            )}

            {activeTab === 'architecture' && (
              <motion.div
                key="architecture"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <ArchitectureView theme={theme} />
              </motion.div>
            )}

            {activeTab === 'cost' && (
              <motion.div
                key="cost"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                {/* Budget & Target Header */}
                <div className={`p-8 border rounded-3xl transition-all ${
                  theme === 'light' ? 'bg-white border-[#141414]/10 shadow-sm' : 'bg-white/5 border-white/10'
                }`}>
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                      <p className="text-xs font-mono uppercase opacity-50 mb-1">Monthly Spending Target</p>
                      <div className="flex items-baseline gap-3">
                        <h2 className="text-5xl font-bold tracking-tighter">${costs.reduce((acc, c) => acc + c.amount, 0).toFixed(2)}</h2>
                        <span className="text-sm opacity-50 font-mono">/ ${monthlyBudget}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 w-full md:w-64">
                      <div className="flex justify-between w-full text-[10px] font-mono uppercase">
                        <span>Budget Used</span>
                        <span className="font-bold">{((costs.reduce((acc, c) => acc + c.amount, 0) / monthlyBudget) * 100).toFixed(1)}%</span>
                      </div>
                      <div className={`w-full h-2 rounded-full overflow-hidden ${theme === 'light' ? 'bg-[#141414]/5' : 'bg-white/5'}`}>
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(100, (costs.reduce((acc, c) => acc + c.amount, 0) / monthlyBudget) * 100)}%` }}
                          className={`h-full ${
                            (costs.reduce((acc, c) => acc + c.amount, 0) / monthlyBudget) > 0.9 ? 'bg-rose-500' : 'bg-emerald-500'
                          }`}
                        />
                      </div>
                      <button 
                        onClick={() => {
                          const newBudget = prompt('Enter new monthly budget:', monthlyBudget.toString());
                          if (newBudget) setMonthlyBudget(Number(newBudget));
                        }}
                        className={`text-[10px] font-mono uppercase opacity-50 hover:opacity-100 transition-all flex items-center gap-1`}
                      >
                        <Settings className="w-3 h-3" /> Adjust Budget
                      </button>
                    </div>
                  </div>
                </div>

                {/* Spending Trends Chart */}
                <section className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif italic text-2xl">Annual Spending Trends</h3>
                    <div className="flex gap-2">
                      <div className="flex items-center gap-4 text-[10px] font-mono uppercase opacity-50">
                        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500" /> AI API</div>
                        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500" /> Infra</div>
                        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-amber-500" /> Subs</div>
                      </div>
                    </div>
                  </div>
                  <div className={`p-6 border rounded-2xl h-[300px] transition-colors ${
                    theme === 'light' ? 'bg-white border-[#141414]/10' : 'bg-white/5 border-white/10'
                  }`}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={YEARLY_SPENDING_DATA}>
                        <defs>
                          <linearGradient id="colorAi" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorInfra" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'light' ? '#14141410' : '#ffffff10'} />
                        <XAxis 
                          dataKey="month" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fontSize: 10, fontFamily: 'monospace', opacity: 0.5 }} 
                        />
                        <YAxis 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fontSize: 10, fontFamily: 'monospace', opacity: 0.5 }}
                          tickFormatter={(value) => `$${value}`}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: theme === 'light' ? '#fff' : '#141414', 
                            border: 'none', 
                            borderRadius: '12px',
                            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                            fontSize: '12px',
                            fontFamily: 'monospace'
                          }}
                        />
                        <Area type="monotone" dataKey="ai" stroke="#3b82f6" fillOpacity={1} fill="url(#colorAi)" strokeWidth={2} />
                        <Area type="monotone" dataKey="infra" stroke="#10b981" fillOpacity={1} fill="url(#colorInfra)" strokeWidth={2} />
                        <Area type="monotone" dataKey="subs" stroke="#f59e0b" fillOpacity={0} strokeWidth={2} strokeDasharray="5 5" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </section>

                {/* Cost Summary Header */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { label: 'AI API Spending', value: `$${costs.filter(c => c.category === 'AI Service').reduce((acc, c) => acc + c.amount, 0).toFixed(2)}`, icon: Cpu, color: 'text-blue-500' },
                    { label: 'Infrastructure Power', value: `$${costs.filter(c => c.category === 'Electricity').reduce((acc, c) => acc + c.amount, 0).toFixed(2)}`, icon: Zap, color: 'text-amber-500' },
                    { label: 'Active Subscriptions', value: `$${subscriptions.filter(s => s.status === 'active').reduce((acc, s) => acc + s.monthlyCost, 0).toFixed(2)}`, icon: Calendar, color: 'text-emerald-500' },
                  ].map((stat, i) => (
                    <div key={i} className={`p-6 border rounded-2xl transition-colors ${
                      theme === 'light' ? 'bg-white border-[#141414]/10 shadow-sm' : 'bg-white/5 border-white/10'
                    }`}>
                      <div className="flex items-center justify-between mb-4">
                        <div className={`p-2 rounded-lg ${theme === 'light' ? 'bg-[#141414]/5' : 'bg-white/5'}`}>
                          <stat.icon className={`w-5 h-5 ${stat.color}`} />
                        </div>
                        <TrendingUp className="w-4 h-4 opacity-20" />
                      </div>
                      <p className="text-xs font-mono uppercase opacity-50">{stat.label}</p>
                      <h4 className="text-3xl font-bold tracking-tighter mt-1">{stat.value}</h4>
                    </div>
                  ))}
                </div>

                {/* AI Service Breakdown */}
                <section className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif italic text-2xl">AI Service Breakdown</h3>
                    <div className="flex gap-2">
                      <button className={`px-3 py-1 rounded-full text-[10px] font-mono uppercase border transition-all ${
                        theme === 'light' ? 'border-[#141414]/10 hover:bg-[#141414]/5' : 'border-white/10 hover:bg-white/5'
                      }`}>Export CSV</button>
                    </div>
                  </div>
                  <div className={`border rounded-xl overflow-hidden transition-colors ${
                    theme === 'light' ? 'bg-white border-[#141414]/10' : 'bg-white/5 border-white/10'
                  }`}>
                    <div className={`grid grid-cols-4 p-4 border-b text-[10px] font-mono uppercase opacity-50 ${
                      theme === 'light' ? 'bg-[#141414]/5 border-[#141414]/10' : 'bg-white/5 border-white/10'
                    }`}>
                      <div>Platform</div>
                      <div>Resource</div>
                      <div>Date</div>
                      <div className="text-right">Amount</div>
                    </div>
                    {costs.filter(c => c.category === 'AI Service').map(cost => (
                      <div key={cost.id} className={`grid grid-cols-4 p-4 border-b last:border-0 transition-colors items-center ${
                        theme === 'light' ? 'border-[#141414]/10 hover:bg-[#141414]/5' : 'border-white/10 hover:bg-white/5'
                      }`}>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${
                            cost.platform === 'Claude' ? 'bg-orange-500' : 
                            cost.platform === 'Perplexity' ? 'bg-emerald-500' : 'bg-blue-500'
                          }`} />
                          <span className="font-medium">{cost.platform}</span>
                        </div>
                        <div className="text-sm opacity-70">{cost.name}</div>
                        <div className="text-sm opacity-50 font-mono">{cost.date}</div>
                        <div className="text-right font-mono font-bold">${cost.amount.toFixed(2)}</div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Infrastructure & Subscriptions */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Electricity Tracking */}
                  <section className="space-y-4">
                    <h3 className="font-serif italic text-2xl">Node Power Consumption</h3>
                    <div className={`border rounded-xl overflow-hidden transition-colors ${
                      theme === 'light' ? 'bg-white border-[#141414]/10' : 'bg-white/5 border-white/10'
                    }`}>
                      <div className={`grid grid-cols-3 p-4 border-b text-[10px] font-mono uppercase opacity-50 ${
                        theme === 'light' ? 'bg-[#141414]/5 border-[#141414]/10' : 'bg-white/5 border-white/10'
                      }`}>
                        <div>Node</div>
                        <div>Status</div>
                        <div className="text-right">Est. Cost (MTD)</div>
                      </div>
                      {costs.filter(c => c.category === 'Electricity').map(cost => (
                        <div key={cost.id} className={`grid grid-cols-3 p-4 border-b last:border-0 transition-colors items-center ${
                          theme === 'light' ? 'border-[#141414]/10 hover:bg-[#141414]/5' : 'border-white/10 hover:bg-white/5'
                        }`}>
                          <div className="font-medium">{cost.name.split(' ')[0]}</div>
                          <div><StatusBadge status="online" theme={theme} /></div>
                          <div className="text-right font-mono font-bold">${cost.amount.toFixed(2)}</div>
                        </div>
                      ))}
                      <div className={`p-4 flex items-center justify-between text-[10px] font-mono uppercase ${
                        theme === 'light' ? 'bg-[#141414]/5' : 'bg-white/5'
                      }`}>
                        <span className="opacity-50">Total Infrastructure</span>
                        <span className="font-bold">${costs.filter(c => c.category === 'Electricity').reduce((acc, c) => acc + c.amount, 0).toFixed(2)}</span>
                      </div>
                    </div>
                  </section>

                  {/* Monthly Subscriptions */}
                  <section className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-serif italic text-2xl">Monthly Subscriptions</h3>
                      <button 
                        onClick={() => {
                          const name = prompt('Subscription Name:');
                          const platform = prompt('Platform (Claude/Perplexity/Gemini):');
                          const cost = prompt('Monthly Cost:');
                          if (name && platform && cost) {
                            setSubscriptions([...subscriptions, {
                              id: Math.random().toString(36).substr(2, 9),
                              name,
                              platform: platform as any,
                              monthlyCost: Number(cost),
                              status: 'active',
                              renewalDate: '2026-04-01'
                            }]);
                          }
                        }}
                        className={`p-2 rounded-full border transition-all ${
                          theme === 'light' ? 'border-[#141414]/10 hover:bg-[#141414]/5' : 'border-white/10 hover:bg-white/5'
                        }`}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="space-y-3">
                      {subscriptions.map(sub => (
                        <div key={sub.id} className={`p-4 border rounded-xl flex items-center justify-between transition-colors ${
                          theme === 'light' ? 'bg-white border-[#141414]/10 shadow-sm' : 'bg-white/5 border-white/10'
                        }`}>
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              theme === 'light' ? 'bg-[#141414]/5' : 'bg-white/5'
                            }`}>
                              {sub.platform === 'Claude' && <Coffee className="w-5 h-5 text-orange-500" />}
                              {sub.platform === 'Perplexity' && <Activity className="w-5 h-5 text-emerald-500" />}
                              {sub.platform === 'Gemini' && <Zap className="w-5 h-5 text-blue-500" />}
                            </div>
                            <div>
                              <h4 className="font-bold text-sm">{sub.name}</h4>
                              <p className="text-[10px] font-mono opacity-50 uppercase">Renews: {sub.renewalDate}</p>
                            </div>
                          </div>
                          <div className="text-right group relative">
                            <div className="font-mono font-bold text-lg">${sub.monthlyCost.toFixed(2)}</div>
                            <span className="text-[8px] font-mono bg-emerald-500/10 text-emerald-500 px-1.5 py-0.5 rounded uppercase">Active</span>
                            <button 
                              onClick={() => {
                                const newCost = prompt('Update monthly cost:', sub.monthlyCost.toString());
                                if (newCost) {
                                  setSubscriptions(subscriptions.map(s => s.id === sub.id ? { ...s, monthlyCost: Number(newCost) } : s));
                                }
                              }}
                              className="absolute -top-2 -right-2 p-1 bg-white border border-[#141414]/10 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-sm"
                            >
                              <Settings className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              </motion.div>
            )}

            {activeTab === 'security' && (
              <motion.div
                key="security"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                {/* Security Agent Header */}
                <div className={`p-8 border rounded-3xl transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-6 ${
                  theme === 'light' ? 'bg-white border-[#141414]/10 shadow-sm' : 'bg-white/5 border-white/10'
                }`}>
                  <div className="flex items-center gap-6">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                      theme === 'light' ? 'bg-[#141414] text-[#E4E3E0]' : 'bg-emerald-500 text-[#0A0A0A]'
                    }`}>
                      <ShieldAlert className="w-8 h-8" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold tracking-tighter">Sentinel Security Agent</h2>
                      <p className="text-sm opacity-50 font-mono uppercase">Head of Cluster Security & Vulnerability Management</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button className={`px-6 py-3 rounded-2xl text-sm font-bold transition-all flex items-center gap-2 ${
                      theme === 'light' ? 'bg-[#141414] text-[#E4E3E0]' : 'bg-emerald-500 text-[#0A0A0A]'
                    }`}>
                      <Scan className="w-4 h-4" /> Run Full Audit
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Vulnerability Feed */}
                  <section className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-serif italic text-2xl">Active Vulnerabilities</h3>
                      <span className="text-[10px] font-mono uppercase opacity-50">{vulnerabilities.filter(v => v.status === 'open').length} Critical/High Issues</span>
                    </div>
                    <div className="space-y-4">
                      {vulnerabilities.map(vuln => (
                        <div key={vuln.id} className={`p-6 border rounded-2xl transition-all ${
                          theme === 'light' ? 'bg-white border-[#141414]/10 shadow-sm' : 'bg-white/5 border-white/10'
                        }`}>
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg ${
                                vuln.severity === 'critical' ? 'bg-rose-500/10 text-rose-500' :
                                vuln.severity === 'high' ? 'bg-orange-500/10 text-orange-500' : 'bg-amber-500/10 text-amber-500'
                              }`}>
                                <AlertCircle className="w-5 h-5" />
                              </div>
                              <div>
                                <h4 className="font-bold tracking-tight">{vuln.title}</h4>
                                <p className="text-[10px] font-mono uppercase opacity-50">{vuln.target}</p>
                              </div>
                            </div>
                            <span className={`text-[8px] font-mono uppercase px-2 py-1 rounded border ${
                              vuln.status === 'open' ? 'border-rose-500/20 text-rose-500' : 'border-emerald-500/20 text-emerald-500'
                            }`}>
                              {vuln.status}
                            </span>
                          </div>
                          <p className="text-sm opacity-70 mb-4">{vuln.description}</p>
                          <div className="flex items-center justify-between pt-4 border-t border-dashed border-current/10">
                            <span className="text-[10px] font-mono opacity-30 uppercase">Detected: {vuln.detectedAt}</span>
                            <button className={`text-xs font-bold underline ${theme === 'light' ? 'text-[#141414]' : 'text-emerald-500'}`}>
                              Apply Patch
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Port Scanner & Mesh Status */}
                  <section className="space-y-8">
                    <div className="space-y-4">
                      <h3 className="font-serif italic text-2xl">Port Status</h3>
                      <div className={`border rounded-xl overflow-hidden transition-colors ${
                        theme === 'light' ? 'bg-white border-[#141414]/10' : 'bg-white/5 border-white/10'
                      }`}>
                        <div className={`grid grid-cols-3 p-3 border-b text-[10px] font-mono uppercase opacity-50 ${
                          theme === 'light' ? 'bg-[#141414]/5 border-[#141414]/10' : 'bg-white/5 border-white/10'
                        }`}>
                          <div>Port</div>
                          <div>Service</div>
                          <div className="text-right">Status</div>
                        </div>
                        {ports.map((p, i) => (
                          <div key={i} className={`grid grid-cols-3 p-3 border-b last:border-0 transition-colors items-center ${
                            theme === 'light' ? 'border-[#141414]/10 hover:bg-[#141414]/5' : 'border-white/10 hover:bg-white/5'
                          }`}>
                            <div className="text-xs font-mono font-bold">{p.port}</div>
                            <div className="text-[10px] opacity-70 uppercase">{p.service}</div>
                            <div className="text-right">
                              <span className={`text-[8px] font-mono uppercase px-1.5 py-0.5 rounded ${
                                p.status === 'open' ? 'bg-rose-500/10 text-rose-500' : 
                                p.status === 'closed' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                              }`}>
                                {p.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-serif italic text-2xl">Security Mesh</h3>
                      <div className={`p-6 border rounded-2xl space-y-4 ${
                        theme === 'light' ? 'bg-white border-[#141414]/10 shadow-sm' : 'bg-white/5 border-white/10'
                      }`}>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono uppercase opacity-50">mTLS Status</span>
                          <span className="text-xs font-bold text-emerald-500 flex items-center gap-1">
                            <Lock className="w-3 h-3" /> ENFORCED
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono uppercase opacity-50">Tailscale ACLs</span>
                          <span className="text-xs font-bold text-emerald-500 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> VERIFIED
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono uppercase opacity-50">Root CA Rotation</span>
                          <span className="text-xs font-bold opacity-50">14 DAYS REMAINING</span>
                        </div>
                        <button className={`w-full py-2 rounded-xl text-[10px] font-mono uppercase border transition-all ${
                          theme === 'light' ? 'border-[#141414] hover:bg-[#141414] hover:text-[#E4E3E0]' : 'border-white/10 hover:bg-white/10'
                        }`}>
                          Rotate Certificates
                        </button>
                      </div>
                    </div>
                  </section>
                </div>
              </motion.div>
            )}

            {activeTab === 'errors' && (
              <motion.div
                key="errors"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-serif italic text-2xl">System Error Logs</h3>
                  <div className="flex gap-2">
                    <button className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-2 ${
                      theme === 'light' ? 'border-[#141414] hover:bg-[#141414] hover:text-[#E4E3E0]' : 'border-white/10 hover:bg-white/10'
                    }`}>
                      <Wrench className="w-4 h-4" /> Auto-Resolve All
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {errorLogs.map(log => (
                    <div key={log.id} className={`p-6 border rounded-2xl transition-all flex flex-col md:flex-row justify-between gap-6 ${
                      theme === 'light' ? 'bg-white border-[#141414]/10 shadow-sm' : 'bg-white/5 border-white/10'
                    }`}>
                      <div className="flex gap-4 flex-1">
                        <div className={`p-3 rounded-xl h-fit ${
                          log.severity === 'critical' ? 'bg-rose-500/10 text-rose-500' :
                          log.severity === 'high' ? 'bg-orange-500/10 text-orange-500' :
                          log.severity === 'medium' ? 'bg-amber-500/10 text-amber-500' : 'bg-blue-500/10 text-blue-500'
                        }`}>
                          <AlertCircle className="w-6 h-6" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-3">
                            <h4 className="font-bold tracking-tight">{log.source}</h4>
                            <span className={`text-[8px] font-mono uppercase px-1.5 py-0.5 rounded border ${
                              log.severity === 'critical' ? 'border-rose-500/20 text-rose-500 bg-rose-500/5' :
                              log.severity === 'high' ? 'border-orange-500/20 text-orange-500 bg-orange-500/5' : 'border-blue-500/20 text-blue-500 bg-blue-500/5'
                            }`}>
                              {log.severity}
                            </span>
                          </div>
                          <p className="text-sm opacity-70">{log.message}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-[10px] font-mono opacity-40 uppercase">{log.timestamp}</span>
                            <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full ${
                              log.status === 'open' ? 'bg-rose-500/10 text-rose-500' :
                              log.status === 'investigating' ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'
                            }`}>
                              {log.status}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col justify-between items-end gap-4">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono uppercase opacity-30">Assigned Agent:</span>
                          {log.assignedAgent ? (
                            <span className="text-xs font-bold px-2 py-1 rounded bg-emerald-500/10 text-emerald-500">{log.assignedAgent}</span>
                          ) : (
                            <button className={`text-[10px] font-mono uppercase px-2 py-1 rounded border border-dashed transition-all ${
                              theme === 'light' ? 'border-[#141414]/20 hover:border-[#141414]' : 'border-white/20 hover:border-white'
                            }`}>
                              Assign Agent
                            </button>
                          )}
                        </div>
                        <button className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                          theme === 'light' ? 'bg-[#141414] text-[#E4E3E0]' : 'bg-emerald-500 text-[#0A0A0A]'
                        }`}>
                          Solve with Agent
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-12"
              >
                {/* User Management Section */}
                <section className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-serif italic text-2xl">User Management</h3>
                      <p className="text-xs opacity-50 mt-1 font-mono uppercase">Manage cluster access and permissions</p>
                    </div>
                    <button className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-2 ${
                      theme === 'light' ? 'border-[#141414] hover:bg-[#141414] hover:text-[#E4E3E0]' : 'border-white/10 hover:bg-white/10'
                    }`}>
                      <UserPlus className="w-4 h-4" /> Add User
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {users.map(user => (
                      <div key={user.id} className={`p-6 border rounded-2xl transition-all flex items-center justify-between ${
                        theme === 'light' ? 'bg-white border-[#141414]/10 shadow-sm' : 'bg-white/5 border-white/10'
                      }`}>
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold ${
                            theme === 'light' ? 'bg-[#141414] text-[#E4E3E0]' : 'bg-emerald-500 text-[#0A0A0A]'
                          }`}>
                            {user.name[0]}
                          </div>
                          <div>
                            <h4 className="font-bold tracking-tight">{user.name}</h4>
                            <p className="text-xs opacity-50">{user.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-12">
                          <div className="text-center">
                            <p className="text-[10px] font-mono uppercase opacity-30 mb-1">Role</p>
                            <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${
                              user.role === 'admin' ? 'border-emerald-500/20 text-emerald-500 bg-emerald-500/5' : 'border-blue-500/20 text-blue-500 bg-blue-500/5'
                            }`}>
                              {user.role}
                            </span>
                          </div>
                          <div className="text-center">
                            <p className="text-[10px] font-mono uppercase opacity-30 mb-1">Status</p>
                            <span className={`text-[10px] font-mono uppercase ${user.status === 'active' ? 'text-emerald-500' : 'text-rose-500'}`}>
                              {user.status}
                            </span>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] font-mono uppercase opacity-30 mb-1">Last Login</p>
                            <p className="text-xs font-mono">{user.lastLogin}</p>
                          </div>
                          <button className={`p-2 rounded-lg transition-colors ${theme === 'light' ? 'hover:bg-[#141414]/5' : 'hover:bg-white/5'}`}>
                            <Settings className="w-4 h-4 opacity-50" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="space-y-6">
                  <h3 className="font-serif italic text-2xl">System Configuration</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={`p-6 border rounded-2xl space-y-4 ${
                      theme === 'light' ? 'bg-white border-[#141414]/10 shadow-sm' : 'bg-white/5 border-white/10'
                    }`}>
                      <h4 className="font-bold tracking-tight flex items-center gap-2">
                        <Database className="w-4 h-4" /> Unraid Integration
                      </h4>
                      <p className="text-sm opacity-70">Configure mount points and parity check schedules for the local storage array.</p>
                      <button className={`text-xs font-bold underline ${theme === 'light' ? 'text-[#141414]' : 'text-emerald-500'}`}>Manage Storage Settings</button>
                    </div>
                    <div className={`p-6 border rounded-2xl space-y-4 ${
                      theme === 'light' ? 'bg-white border-[#141414]/10 shadow-sm' : 'bg-white/5 border-white/10'
                    }`}>
                      <h4 className="font-bold tracking-tight flex items-center gap-2">
                        <Network className="w-4 h-4" /> Tailscale Mesh
                      </h4>
                      <p className="text-sm opacity-70">Manage node authentication and secure routing between distributed endpoints.</p>
                      <button className={`text-xs font-bold underline ${theme === 'light' ? 'text-[#141414]' : 'text-emerald-500'}`}>Configure Network</button>
                    </div>
                  </div>
                </section>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Agent Wizard Modal */}
      {/* Security Report Modal */}
      <AnimatePresence>
        {selectedAgentForSecurity && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedAgentForSecurity(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl p-8 border shadow-2xl ${
                theme === 'light' ? 'bg-white border-[#141414]' : 'bg-[#0a0a0a] border-white/10'
              }`}
            >
              <div className="flex justify-between items-start mb-8">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-rose-500/10 rounded-2xl">
                    <ShieldAlert className="w-8 h-8 text-rose-500" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-serif italic">Agent Intelligence & Security</h2>
                    <p className="text-xs font-mono uppercase opacity-50">Agent: {selectedAgentForSecurity.name}</p>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    setSelectedAgentForSecurity(null);
                    setModalTab('security');
                  }}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <Plus className="w-6 h-6 rotate-45" />
                </button>
              </div>

              {/* Tab Switcher */}
              <div className="flex gap-4 mb-8 border-b border-white/10">
                <button 
                  onClick={() => setModalTab('security')}
                  className={`pb-4 text-xs font-mono uppercase font-bold transition-all relative ${
                    modalTab === 'security' ? 'text-rose-500' : 'opacity-50 hover:opacity-100'
                  }`}
                >
                  Security Report
                  {modalTab === 'security' && (
                    <motion.div layoutId="modalTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-500" />
                  )}
                </button>
                <button 
                  onClick={() => setModalTab('api')}
                  className={`pb-4 text-xs font-mono uppercase font-bold transition-all relative ${
                    modalTab === 'api' ? 'text-emerald-500' : 'opacity-50 hover:opacity-100'
                  }`}
                >
                  API Call Log
                  {modalTab === 'api' && (
                    <motion.div layoutId="modalTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500" />
                  )}
                </button>
              </div>

              {modalTab === 'security' ? (
                <>
                  <div className="grid grid-cols-2 gap-6 mb-8">
                <div className={`p-4 rounded-2xl border ${theme === 'light' ? 'bg-[#141414]/5 border-[#141414]/10' : 'bg-white/5 border-white/10'}`}>
                  <p className="text-[10px] font-mono uppercase opacity-50 mb-1">Classification Level</p>
                  <div className="flex items-center gap-2">
                    <ClassificationBadge level={selectedAgentForSecurity.classification} theme={theme} />
                    <span className="text-sm font-bold">Level {selectedAgentForSecurity.classification}</span>
                  </div>
                </div>
                <div className={`p-4 rounded-2xl border ${theme === 'light' ? 'bg-[#141414]/5 border-[#141414]/10' : 'bg-white/5 border-white/10'}`}>
                  <p className="text-[10px] font-mono uppercase opacity-50 mb-1">Model Integrity</p>
                  <div className="flex items-center gap-2">
                    <Fingerprint className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm font-bold">{selectedAgentForSecurity.model}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <section>
                  <h3 className="text-xs font-mono uppercase font-bold mb-3 flex items-center gap-2">
                    <Key className="w-3 h-3" />
                    Allowed Toolset
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedAgentForSecurity.allowedTools.map(tool => (
                      <div key={tool} className={`p-3 rounded-xl border flex items-center justify-between ${
                        theme === 'light' ? 'bg-white border-[#141414]/10' : 'bg-white/5 border-white/10'
                      }`}>
                        <span className="text-xs font-mono">{tool}</span>
                        <ShieldCheck className="w-3 h-3 text-emerald-500" />
                      </div>
                    ))}
                  </div>
                </section>

                <section>
                  <h3 className="text-xs font-mono uppercase font-bold mb-3 flex items-center gap-2 text-rose-500">
                    <AlertOctagon className="w-3 h-3" />
                    Detected Vulnerabilities
                  </h3>
                  <div className="space-y-2">
                    {selectedAgentForSecurity.vulnerabilities?.map((vuln) => (
                      <div key={vuln.id} className={`p-4 rounded-xl border flex items-start gap-3 ${
                        vuln.severity === 'critical' ? 'bg-rose-500/10 border-rose-500/30' :
                        vuln.severity === 'high' ? 'bg-rose-500/5 border-rose-500/20' :
                        'bg-amber-500/5 border-amber-500/20'
                      }`}>
                        <AlertTriangle className={`w-4 h-4 mt-0.5 ${
                          vuln.severity === 'critical' || vuln.severity === 'high' ? 'text-rose-500' : 'text-amber-500'
                        }`} />
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <p className={`text-sm font-bold ${
                              vuln.severity === 'critical' || vuln.severity === 'high' ? 'text-rose-500' : 'text-amber-500'
                            }`}>{vuln.title}</p>
                            <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded uppercase ${
                              vuln.severity === 'critical' ? 'bg-rose-500 text-white' :
                              vuln.severity === 'high' ? 'bg-rose-500/20 text-rose-500' :
                              'bg-amber-500/20 text-amber-500'
                            }`}>
                              {vuln.severity}
                            </span>
                          </div>
                          <p className="text-[11px] opacity-70 mt-1">{vuln.description}</p>
                          <div className="flex justify-between items-center mt-2 text-[9px] font-mono opacity-50">
                            <span>Target: {vuln.target}</span>
                            <span>Detected: {vuln.detectedAt}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                    {(!selectedAgentForSecurity.vulnerabilities || selectedAgentForSecurity.vulnerabilities.length === 0) && (
                      <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 flex items-center gap-3">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <p className="text-sm font-bold text-emerald-500">No vulnerabilities detected</p>
                      </div>
                    )}
                  </div>
                </section>

                <section>
                  <h3 className="text-xs font-mono uppercase font-bold mb-3 flex items-center gap-2 text-amber-500">
                    <History className="w-3 h-3" />
                    Policy Violations & Anomalies
                  </h3>
                  <div className="space-y-2">
                    {selectedAgentForSecurity.policyViolations?.map((violation) => (
                      <div key={violation.id} className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 flex items-start gap-3">
                        <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5" />
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <p className="text-sm font-bold text-amber-500">{violation.type}</p>
                            <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-500 uppercase">
                              {violation.severity}
                            </span>
                          </div>
                          <p className="text-[11px] opacity-70 mt-1">{violation.description}</p>
                          <div className="flex justify-between items-center mt-2 text-[9px] font-mono opacity-50">
                            <span>Status: {violation.status}</span>
                            <span>{violation.timestamp}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                    {(!selectedAgentForSecurity.policyViolations || selectedAgentForSecurity.policyViolations.length === 0) && (
                      <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 flex items-center gap-3">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <p className="text-sm font-bold text-emerald-500">No policy violations recorded</p>
                      </div>
                    )}
                  </div>
                </section>
              </div>
              </>
              ) : (
                <div className="space-y-6">
                  <section>
                    <h3 className="text-xs font-mono uppercase font-bold mb-3 flex items-center gap-2 text-emerald-500">
                      <TerminalSquare className="w-3 h-3" />
                      Live Tool Invocation Log
                    </h3>
                    <div className="space-y-3">
                      {toolUsage.filter(u => u.agentId === selectedAgentForSecurity.id).map((usage) => (
                        <div key={usage.id} className={`p-4 rounded-xl border ${
                          theme === 'light' ? 'bg-white border-[#141414]/10' : 'bg-white/5 border-white/10'
                        } space-y-3`}>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <div className="p-1.5 bg-emerald-500/10 rounded-lg">
                                <Wrench className="w-3 h-3 text-emerald-500" />
                              </div>
                              <span className="text-sm font-bold font-mono">{usage.toolName}</span>
                            </div>
                            <span className="text-[10px] font-mono opacity-50">{usage.lastUsed}</span>
                          </div>
                          
                          <div className={`p-3 rounded-lg font-mono text-[10px] ${
                            theme === 'light' ? 'bg-[#141414]/5' : 'bg-black/40'
                          }`}>
                            <p className="opacity-40 mb-1 uppercase text-[8px]">Parameters</p>
                            <pre className="whitespace-pre-wrap break-all opacity-80">
                              {JSON.stringify(JSON.parse(usage.parameters), null, 2)}
                            </pre>
                          </div>

                          <div className="flex justify-between items-center text-[9px] font-mono">
                            <div className="flex items-center gap-4">
                              <span className="opacity-50 uppercase">Total Calls: <span className="opacity-100 font-bold">{usage.count}</span></span>
                              <span className="opacity-50 uppercase">Avg Latency: <span className="opacity-100 font-bold">142ms</span></span>
                            </div>
                            <span className="text-emerald-500 font-bold uppercase">Success</span>
                          </div>
                        </div>
                      ))}
                      {toolUsage.filter(u => u.agentId === selectedAgentForSecurity.id).length === 0 && (
                        <div className="p-8 text-center opacity-30 italic font-mono text-sm">
                          No tool telemetry recorded for this agent.
                        </div>
                      )}
                    </div>
                  </section>
                </div>
              )}

              <div className="mt-8 pt-8 border-t border-white/10 flex gap-4">
                <button className="flex-1 bg-rose-500 text-white py-3 rounded-xl font-bold hover:bg-rose-600 transition-all">
                  Quarantine Agent
                </button>
                <button 
                  onClick={() => setSelectedAgentForSecurity(null)}
                  className={`flex-1 py-3 rounded-xl font-bold border transition-all ${
                    theme === 'light' ? 'border-[#141414] hover:bg-[#141414]/5' : 'border-white/20 hover:bg-white/10'
                  }`}
                >
                  Dismiss Report
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isWizardOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsWizardOpen(false)}
              className="absolute inset-0 bg-[#141414]/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={`relative w-full max-w-xl ${theme === 'dark' ? 'bg-[#141414] border-white/20 text-[#E4E3E0]' : 'bg-[#E4E3E0] border-[#141414] text-[#141414]'} border rounded-2xl shadow-2xl overflow-hidden`}
            >
              {/* Wizard Header */}
              <div className={`p-6 border-b ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-[#141414] bg-[#141414] text-[#E4E3E0]'} flex items-center justify-between`}>
                <div>
                  <h4 className="font-serif italic text-xl">Agent Authoring Wizard</h4>
                  <p className="text-[10px] font-mono uppercase opacity-50">Step {wizardStep} of 4: {
                    wizardStep === 1 ? 'Identity & Role' :
                    wizardStep === 2 ? 'Capabilities' :
                    wizardStep === 3 ? 'Security & Intelligence' : 'Review & Deploy'
                  }</p>
                </div>
                <button onClick={() => setIsWizardOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Wizard Body */}
              <div className="p-8 min-h-[400px]">
                {wizardStep === 1 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono uppercase opacity-50">Agent Name</label>
                      <input 
                        type="text" 
                        placeholder="e.g. DataSifter"
                        value={newAgentData.name}
                        onChange={(e) => setNewAgentData({...newAgentData, name: e.target.value})}
                        className={`w-full ${theme === 'dark' ? 'bg-white/5 border-white/20 focus:ring-white/10' : 'bg-white border-[#141414] focus:ring-[#141414]/10'} border rounded-xl px-4 py-3 font-mono text-sm focus:outline-none focus:ring-2`}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono uppercase opacity-50">Functional Role</label>
                      <textarea 
                        placeholder="Describe the agent's primary purpose..."
                        value={newAgentData.role}
                        onChange={(e) => setNewAgentData({...newAgentData, role: e.target.value})}
                        className={`w-full ${theme === 'dark' ? 'bg-white/5 border-white/20 focus:ring-white/10' : 'bg-white border-[#141414] focus:ring-[#141414]/10'} border rounded-xl px-4 py-3 font-mono text-sm focus:outline-none focus:ring-2 h-32 resize-none`}
                      />
                    </div>
                  </motion.div>
                )}

                {wizardStep === 2 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                    <div className="space-y-4">
                      <label className="text-[10px] font-mono uppercase opacity-50">Allowed Toolsets</label>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { id: 'read_bank', label: 'Bank Read Access', icon: Database },
                          { id: 'calculate_roi', label: 'ROI Calculator', icon: Zap },
                          { id: 'google_search', label: 'Web Search', icon: Network },
                          { id: 'web_scrape', label: 'Data Scraping', icon: FileText },
                          { id: 'lights_toggle', label: 'Home Control', icon: Zap },
                          { id: 'unraid_mount', label: 'Unraid Access', icon: HardDrive },
                        ].map(tool => (
                          <button
                            key={tool.id}
                            onClick={() => {
                              const tools = newAgentData.allowedTools || [];
                              if (tools.includes(tool.id)) {
                                setNewAgentData({...newAgentData, allowedTools: tools.filter(t => t !== tool.id)});
                              } else {
                                setNewAgentData({...newAgentData, allowedTools: [...tools, tool.id]});
                              }
                            }}
                            className={`flex items-center gap-3 p-3 border rounded-xl transition-all text-left ${
                              newAgentData.allowedTools?.includes(tool.id) 
                                ? 'bg-[#141414] text-[#E4E3E0] border-[#141414]' 
                                : theme === 'dark' ? 'bg-white/5 border-white/10 hover:border-white/30' : 'bg-white border-[#141414]/10 hover:border-[#141414]'
                            }`}
                          >
                            <tool.icon className="w-4 h-4" />
                            <span className="text-xs font-bold">{tool.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {wizardStep === 3 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                    <div className="space-y-4">
                      <label className="text-[10px] font-mono uppercase opacity-50">Classification Level (T-Level)</label>
                      <div className="flex justify-between gap-2">
                        {[10, 20, 30, 40, 50].map(level => (
                          <button
                            key={level}
                            onClick={() => setNewAgentData({...newAgentData, classification: level})}
                            className={`flex-1 py-3 border rounded-xl font-mono text-sm transition-all ${
                              newAgentData.classification === level 
                                ? 'bg-[#141414] text-[#E4E3E0] border-[#141414]' 
                                : theme === 'dark' ? 'bg-white/5 border-white/10 hover:border-white/30' : 'bg-white border-[#141414]/10 hover:border-[#141414]'
                            }`}
                          >
                            T{level}
                          </button>
                        ))}
                      </div>
                      <p className="text-[9px] font-mono opacity-50 italic">
                        T10: Public Data | T30: Financial/PII | T50: Root/System Access
                      </p>
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-mono uppercase opacity-50">Base Intelligence Model</label>
                      <div className="grid grid-cols-2 gap-3">
                        {['Llama 3 (Local)', 'Mistral (Local)', 'Gemini 3 Flash', 'Gemini 3 Pro'].map(model => (
                          <button
                            key={model}
                            onClick={() => setNewAgentData({...newAgentData, model})}
                            className={`p-3 border rounded-xl text-xs font-bold transition-all ${
                              newAgentData.model === model 
                                ? 'bg-[#141414] text-[#E4E3E0] border-[#141414]' 
                                : theme === 'dark' ? 'bg-white/5 border-white/10 hover:border-white/30' : 'bg-white border-[#141414]/10 hover:border-[#141414]'
                            }`}
                          >
                            {model}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {wizardStep === 4 && (
                  <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                    <div className={`p-6 border ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-[#141414] bg-white'} rounded-2xl space-y-4`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="text-xl font-bold tracking-tighter">{newAgentData.name || 'Untitled Agent'}</h5>
                          <p className="text-xs opacity-50 italic">{newAgentData.role || 'No role defined'}</p>
                        </div>
                        <ClassificationBadge level={newAgentData.classification || 10} theme={theme} />
                      </div>
                      <div className={`h-[1px] ${theme === 'dark' ? 'bg-white/10' : 'bg-[#141414]/10'}`} />
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-[9px] font-mono uppercase opacity-50 mb-1">Intelligence</p>
                          <p className="text-xs font-bold">{newAgentData.model}</p>
                        </div>
                        <div>
                          <p className="text-[9px] font-mono uppercase opacity-50 mb-1">Tools Enabled</p>
                          <p className="text-xs font-bold">{newAgentData.allowedTools?.length || 0} Toolsets</p>
                        </div>
                      </div>
                    </div>
                    <div className={`p-4 ${theme === 'dark' ? 'bg-emerald-500/20 border-emerald-500/30' : 'bg-emerald-500/10 border-emerald-500/20'} border rounded-xl flex items-center gap-3`}>
                      <Shield className="w-5 h-5 text-emerald-500" />
                      <p className={`text-[10px] font-bold ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-700'} uppercase`}>Policy Check Passed: Ready for Deployment</p>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Wizard Footer */}
              <div className={`p-6 border-t ${theme === 'dark' ? 'border-white/10 bg-white/5' : 'border-[#141414] bg-[#141414]/5'} flex justify-between items-center`}>
                <button 
                  onClick={() => setWizardStep(prev => Math.max(1, prev - 1))}
                  disabled={wizardStep === 1}
                  className="flex items-center gap-2 text-xs font-bold uppercase opacity-50 hover:opacity-100 disabled:opacity-20 transition-all"
                >
                  <ChevronLeftIcon className="w-4 h-4" /> Back
                </button>
                <div className="flex gap-2">
                  {wizardStep < 4 ? (
                    <button 
                      onClick={() => setWizardStep(prev => prev + 1)}
                      className={`px-6 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
                        theme === 'dark' ? 'bg-white text-[#141414] hover:bg-white/90' : 'bg-[#141414] text-[#E4E3E0] hover:bg-[#141414]/90'
                      }`}
                    >
                      Next <ChevronRightIcon className="w-4 h-4" />
                    </button>
                  ) : (
                    <button 
                      onClick={handleCreateAgent}
                      className="bg-emerald-600 text-white px-8 py-2 rounded-lg text-sm font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20"
                    >
                      Deploy Agent
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
