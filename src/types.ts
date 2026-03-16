export type NodeStatus = 'online' | 'offline' | 'degraded';
export type ServiceStatus = 'online' | 'degraded' | 'error';

export interface Service {
  name: string;
  status: ServiceStatus;
}

export interface Node {
  id: string;
  name: string;
  type: 'Brain' | 'Gateway' | 'Endpoint' | 'Sandbox';
  hardware: string;
  status: NodeStatus;
  ip: string;
  services: Service[];
}

export interface Agent {
  id: string;
  name: string;
  role: string;
  status: 'active' | 'suspended' | 'retired';
  allowedTools: string[];
  classification: number;
  model: string;
  lastInvocation: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  tool: string;
  status: 'allowed' | 'denied';
  classification: number;
}

export interface Document {
  id: string;
  name: string;
  classification: number;
  stage: 'ingest' | 'process' | 'publish';
  status: 'pending' | 'completed' | 'failed';
}

export interface ScheduledTask {
  id: string;
  title: string;
  description: string;
  startTime: string;
  status: 'queued' | 'running' | 'completed' | 'failed';
  priority: 'low' | 'medium' | 'high';
  model: string;
  retryStrategy: 'none' | 'exponential' | 'aggressive';
}

export interface CostEntry {
  id: string;
  category: 'AI Service' | 'Electricity' | 'Hardware';
  name: string;
  amount: number;
  date: string;
  platform?: 'Claude' | 'Perplexity' | 'Gemini' | 'Infrastructure';
}

export interface Subscription {
  id: string;
  name: string;
  platform: 'Claude' | 'Perplexity' | 'Gemini';
  monthlyCost: number;
  status: 'active' | 'cancelled';
  renewalDate: string;
}

export interface ErrorLog {
  id: string;
  timestamp: string;
  source: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'investigating' | 'resolved';
  assignedAgent?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
  status: 'active' | 'inactive';
  lastLogin: string;
}

export interface MatrixRoute {
  id: string;
  source: string;
  destination: string;
  policy: string;
  status: 'routed' | 'blocked' | 'bypassed';
  latency: number;
  timestamp: string;
}

export interface SecurityVulnerability {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  target: string;
  status: 'open' | 'patched' | 'ignored';
  detectedAt: string;
}

export interface PortStatus {
  port: number;
  service: string;
  status: 'open' | 'closed' | 'filtered';
  node: string;
}

export interface AgentProof {
  id: string;
  agentId: string;
  agentName: string;
  action: string;
  stage: 'Staging' | 'Review' | 'Production';
  hash: string;
  timestamp: string;
  changes?: string;
}
