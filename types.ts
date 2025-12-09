

// Enum Types
export enum PriorityClass {
  P0 = "P0",
  P1 = "P1",
  P2 = "P2",
  P3 = "P3"
}

export enum AxisRole {
  Criticality = "criticality",
  Timescale = "timescale",
  Knowledge = "knowledge",
  Integration = "integration",
  Cost = "cost",
  Extra = "extra"
}

export enum AxisType {
  Ordinal = "ordinal",
  Time = "time",
  Cost = "cost"
}

// Domain Models
export interface Workshop {
  id: string;
  name: string;
  description: string;
  created_at: string;
}

export interface ScaleStep {
  id: string; // e.g., scalestep:criticality:1
  step: number; // 1-4
  label: string;
  description: string;
  color: string; // tailwind color class or hex
}

export interface Axis {
  id: string; // e.g., axis:criticality
  name: string;
  description: string;
  role: AxisRole;
  axis_type: AxisType;
  is_active: boolean;
  scale_steps: ScaleStep[]; // Always 4 steps
}

export interface ItemMetric {
  axis_id: string;
  ordinal_value: number; // 1-4
  numeric_value?: number;
  icl_value?: number;
  unit?: string;
}

export interface NextAction {
  id: string;
  description: string;
  responsible: string;
  is_complete: boolean;
}

export interface Item {
  id: string;
  workshop_id: string;
  master_grouping?: string; // e.g., 'Marketing', 'Engineering'
  title: string;
  description: string;
  priority_class: PriorityClass;
  priority_score: number;
  known: string[];
  unknowns: string[];
  must_discover: string[];
  next_actions: NextAction[];
  research_tracks: string[];
  depends_on: string[];
  metrics: Record<string, ItemMetric>; // Keyed by axis_id
  is_complete: boolean;
  start_date?: string; // ISO 8601 YYYY-MM-DD
  created_at: string;
  updated_at: string;
}

export type ViewMode = 'list' | 'heatmap' | 'settings' | 'timeline' | 'gantt' | 'resources' | 'people';
