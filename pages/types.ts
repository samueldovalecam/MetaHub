
export type PlanType = 'free' | 'basic';
export type IndicatorUnit = 'number' | 'percent' | 'currency';

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
  responsible: string; // Required field for responsible person
  deadline?: string; // Optional date
}

export interface ActionItem {
  id: string;
  title: string;
  description?: string; // Optional description
  responsible: string; // Required field for responsible person
  deadline?: string; // Optional date string (YYYY-MM-DD)
  completed: boolean;
  completedAt?: string; // Date when the action was completed
  contribution: number; // The "weight" or value this action adds
  subTasks: SubTask[];
}

export interface Indicator {
  id: string;
  title: string;
  description?: string; // Optional description
  unit: IndicatorUnit;
  initialValue: number; // The starting value set by the user
  currentValue: number;
  targetValue: number;
  actions: ActionItem[];
}

export interface UserProfile {
  name: string;
  email: string;
  phone?: string;
  plan: PlanType;
  whatsappNotifications: boolean;
}
