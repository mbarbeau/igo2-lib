export interface TimeFilterOptions {
  min?: string;
  max?: string;
  range?: boolean;
  value?: string;
  values?: [string, string];
  type?: 'date' | 'time' | 'datetime';
  format?: string;
  style?: 'calendar' | 'slider';
  step?: number;
  timeInterval?: number;
}
