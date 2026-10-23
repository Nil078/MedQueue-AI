export type PatientStatus = 'Waiting' | 'Serving' | 'Served' | 'Cancelled';

export type PriorityLevel = 'Normal' | 'Priority' | 'Urgent';

export type DepartmentType =
  | 'General Medicine'
  | 'Cardiology'
  | 'Pediatrics'
  | 'Orthopedics'
  | 'ENT'
  | 'Dermatology'
  | 'Ophthalmology'
  | 'Neurology';

export interface Patient {
  id: string;
  tokenNumber: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other' | 'Prefer not to say';
  department: DepartmentType;
  priority: PriorityLevel;
  phone?: string;
  notes?: string;
  registrationTime: string;
  registeredAtTimestamp: number;
  status: PatientStatus;
  counterOrRoom?: string;
  servingStartTime?: number;
  servedTime?: string;
  estimatedWaitMinutes: number;
}

export interface QueueSettings {
  hospitalName: string;
  departmentName: string;
  avgConsultationMinutes: number;
  soundAnnouncement: boolean;
  activeCounters: number;
  voiceGender: 'female' | 'male';
  theme: 'dark' | 'light';
}

export interface QueueNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'info' | 'warning' | 'success';
  read: boolean;
  token?: string;
}
