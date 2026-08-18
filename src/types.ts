export type Priority = 'high' | 'medium' | 'low';
export type Filter = 'all' | 'active' | 'completed';
export type Locale = 'zh-CN' | 'en' | 'ja';
export type SortBy = 'priority' | 'time' | 'created';

export interface TaskPatch {
  title?: string;
  priority?: Priority;
  timeStart?: string;
  timeEnd?: string;
}

export interface Task {
  id: string;
  title: string;
  priority: Priority;
  timeStart?: string;
  timeEnd?: string;
  completed: boolean;
  createdAt: number;
}
