import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Patient, QueueSettings, QueueNotification, DepartmentType, PriorityLevel } from '../types/queue';
import { INITIAL_PATIENTS, INITIAL_SETTINGS, INITIAL_NOTIFICATIONS, SAMPLE_NAMES } from '../data/mockData';
import { hospitalAudio } from '../utils/audio';

export type ViewType = 'dashboard' | 'register' | 'live-queue' | 'waiting-room' | 'settings';

interface ToastInfo {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
}

interface RegisterFormData {
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other' | 'Prefer not to say';
  department: DepartmentType;
  priority: PriorityLevel;
  phone?: string;
  notes?: string;
}

interface QueueContextType {
  patients: Patient[];
  settings: QueueSettings;
  notifications: QueueNotification[];
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  lastCalledPatient: Patient | null;
  toasts: ToastInfo[];
  dismissToast: (id: string) => void;
  showToast: (message: string, type?: ToastInfo['type']) => void;
  // Actions
  callPatient: (patientId: string, customRoom?: string) => void;
  markServing: (patientId: string, room?: string) => void;
  markServed: (patientId: string) => void;
  cancelPatient: (patientId: string) => void;
  registerPatient: (formData: RegisterFormData) => Patient;
  updateSettings: (newSettings: Partial<QueueSettings>) => void;
  resetDemoData: () => void;
  seedMorePatients: () => void;
  clearAllServed: () => void;
  markAllNotificationsRead: () => void;
  // Computed stats
  stats: {
    totalToday: number;
    waitingCount: number;
    servingCount: number;
    servedCount: number;
    avgWaitTime: number;
  };
}

const QueueContext = createContext<QueueContextType | undefined>(undefined);

export const QueueProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [patients, setPatients] = useState<Patient[]>(() => {
    const saved = localStorage.getItem('medqueue_patients');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved patients', e);
      }
    }
    return INITIAL_PATIENTS;
  });

  const [settings, setSettings] = useState<QueueSettings>(() => {
    const saved = localStorage.getItem('medqueue_settings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved settings', e);
      }
    }
    return INITIAL_SETTINGS;
  });

  const [notifications, setNotifications] = useState<QueueNotification[]>(() => {
    const saved = localStorage.getItem('medqueue_notifications');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved notifications', e);
      }
    }
    return INITIAL_NOTIFICATIONS;
  });

  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [lastCalledPatient, setLastCalledPatient] = useState<Patient | null>(null);
  const [toasts, setToasts] = useState<ToastInfo[]>([]);

  // Sync to local storage for persistence across reloads
  useEffect(() => {
    localStorage.setItem('medqueue_patients', JSON.stringify(patients));
  }, [patients]);

  useEffect(() => {
    localStorage.setItem('medqueue_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('medqueue_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const showToast = (message: string, type: ToastInfo['type'] = 'info') => {
    const id = 'toast-' + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      dismissToast(id);
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Recalculate estimated waiting times dynamically for waiting patients
  const recalculateWaitTimes = (patientList: Patient[], avgTime: number, counters: number): Patient[] => {
    let waitingRank = 0;
    return patientList.map((p) => {
      if (p.status === 'Waiting') {
        waitingRank += 1;
        // Priority patients get prioritized in wait time calculations
        const factor = p.priority === 'Urgent' ? 0.3 : p.priority === 'Priority' ? 0.7 : 1.0;
        const estimatedMinutes = Math.max(3, Math.round((waitingRank * avgTime) / Math.max(1, counters) * factor));
        return { ...p, estimatedWaitMinutes: estimatedMinutes };
      }
      return p;
    });
  };

  const updateSettings = (newSettings: Partial<QueueSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      // Also update waiting times with new settings
      setPatients((current) =>
        recalculateWaitTimes(current, updated.avgConsultationMinutes, updated.activeCounters)
      );
      return updated;
    });
    showToast('Queue configuration settings updated', 'success');
  };

  const callPatient = (patientId: string, customRoom?: string) => {
    const patient = patients.find((p) => p.id === patientId);
    if (!patient) return;

    const assignedRoom = customRoom || patient.counterOrRoom || 'Room 102';

    // Play chime and spoken voice announcement
    if (settings.soundAnnouncement) {
      hospitalAudio.announceToken(patient.tokenNumber, assignedRoom, true);
    }

    const updatedPatients = patients.map((p) => {
      if (p.id === patientId) {
        return {
          ...p,
          status: 'Serving' as const,
          counterOrRoom: assignedRoom,
          servingStartTime: p.servingStartTime || Date.now(),
          estimatedWaitMinutes: 0,
        };
      }
      return p;
    });

    const refreshed = recalculateWaitTimes(updatedPatients, settings.avgConsultationMinutes, settings.activeCounters);
    setPatients(refreshed);

    const targetPatient = refreshed.find((p) => p.id === patientId) || patient;
    setLastCalledPatient(targetPatient);

    // Add alert notification
    const newNotif: QueueNotification = {
      id: 'notif-' + Date.now(),
      title: `Token ${patient.tokenNumber} Called`,
      message: `${patient.name} summoned to ${assignedRoom} (${patient.department}).`,
      time: 'Just now',
      type: 'info',
      read: false,
      token: patient.tokenNumber,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    showToast(`Announced: Token ${patient.tokenNumber} (${patient.name}) -> ${assignedRoom}`, 'info');
  };

  const markServing = (patientId: string, room?: string) => {
    setPatients((prev) => {
      const nextList = prev.map((p) => {
        if (p.id === patientId) {
          return {
            ...p,
            status: 'Serving' as const,
            counterOrRoom: room || p.counterOrRoom || 'Room 102',
            servingStartTime: Date.now(),
            estimatedWaitMinutes: 0,
          };
        }
        return p;
      });
      return recalculateWaitTimes(nextList, settings.avgConsultationMinutes, settings.activeCounters);
    });
    showToast(`Patient status updated to Serving`, 'success');
  };

  const markServed = (patientId: string) => {
    const patient = patients.find((p) => p.id === patientId);
    if (!patient) return;

    const now = new Date();
    const servedTimeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setPatients((prev) => {
      const nextList = prev.map((p) => {
        if (p.id === patientId) {
          return {
            ...p,
            status: 'Served' as const,
            servedTime: servedTimeStr,
            estimatedWaitMinutes: 0,
          };
        }
        return p;
      });
      return recalculateWaitTimes(nextList, settings.avgConsultationMinutes, settings.activeCounters);
    });

    if (lastCalledPatient?.id === patientId) {
      setLastCalledPatient(null);
    }

    const newNotif: QueueNotification = {
      id: 'notif-' + Date.now(),
      title: 'Consultation Completed',
      message: `${patient.name} (${patient.tokenNumber}) completed visit in ${patient.department}.`,
      time: 'Just now',
      type: 'success',
      read: false,
      token: patient.tokenNumber,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    showToast(`Consultation completed for ${patient.name} (${patient.tokenNumber})`, 'success');
  };

  const cancelPatient = (patientId: string) => {
    const patient = patients.find((p) => p.id === patientId);
    if (!patient) return;

    setPatients((prev) => {
      const nextList = prev.map((p) => (p.id === patientId ? { ...p, status: 'Cancelled' as const } : p));
      return recalculateWaitTimes(nextList, settings.avgConsultationMinutes, settings.activeCounters);
    });

    showToast(`Token ${patient.tokenNumber} marked as Cancelled`, 'warning');
  };

  const registerPatient = (formData: RegisterFormData): Patient => {
    // Generate next token number e.g. MQ-105
    const existingTokens = patients
      .map((p) => parseInt(p.tokenNumber.replace(/\D/g, '') || '100', 10))
      .filter((n) => !isNaN(n));
    const highestNumber = existingTokens.length > 0 ? Math.max(...existingTokens) : 100;
    const nextTokenNumber = `MQ-${highestNumber + 1}`;

    const now = new Date();
    const registrationTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newPatient: Patient = {
      id: 'pat-' + Date.now() + '-' + Math.random().toString(36).substring(2, 5),
      tokenNumber: nextTokenNumber,
      name: formData.name.trim(),
      age: Number(formData.age),
      gender: formData.gender,
      department: formData.department,
      priority: formData.priority,
      phone: formData.phone?.trim() || undefined,
      notes: formData.notes?.trim() || undefined,
      registrationTime,
      registeredAtTimestamp: Date.now(),
      status: 'Waiting',
      counterOrRoom: `Counter ${Math.floor(Math.random() * settings.activeCounters) + 1}`,
      estimatedWaitMinutes: 15,
    };

    setPatients((prev) => {
      // Priority patients move before normal waiting patients if priority
      const updated = [...prev, newPatient];
      return recalculateWaitTimes(updated, settings.avgConsultationMinutes, settings.activeCounters);
    });

    // Add intake notification
    const newNotif: QueueNotification = {
      id: 'notif-' + Date.now(),
      title: `New Registration: ${newPatient.tokenNumber}`,
      message: `${newPatient.name} registered for ${newPatient.department}.`,
      time: 'Just now',
      type: 'info',
      read: false,
      token: newPatient.tokenNumber,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    showToast(`Token ${newPatient.tokenNumber} generated for ${newPatient.name}!`, 'success');
    return newPatient;
  };

  const resetDemoData = () => {
    setPatients(INITIAL_PATIENTS);
    setSettings(INITIAL_SETTINGS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setLastCalledPatient(null);
    showToast('Demo queue data reset to factory initial state', 'info');
  };

  const seedMorePatients = () => {
    const randomPick = SAMPLE_NAMES[Math.floor(Math.random() * SAMPLE_NAMES.length)];
    const existingTokens = patients
      .map((p) => parseInt(p.tokenNumber.replace(/\D/g, '') || '100', 10))
      .filter((n) => !isNaN(n));
    const nextNum = (existingTokens.length > 0 ? Math.max(...existingTokens) : 100) + 1;
    const now = new Date();

    const seededPatient: Patient = {
      id: 'pat-' + Date.now(),
      tokenNumber: `MQ-${nextNum}`,
      name: randomPick.name,
      age: randomPick.age,
      gender: randomPick.gender as any,
      department: randomPick.dept as DepartmentType,
      priority: Math.random() > 0.75 ? 'Priority' : 'Normal',
      phone: `+1 (555) ${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}`,
      notes: randomPick.notes,
      registrationTime: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      registeredAtTimestamp: Date.now(),
      status: 'Waiting',
      counterOrRoom: `Counter ${Math.floor(Math.random() * settings.activeCounters) + 1}`,
      estimatedWaitMinutes: 20,
    };

    setPatients((prev) => {
      const nextList = [...prev, seededPatient];
      return recalculateWaitTimes(nextList, settings.avgConsultationMinutes, settings.activeCounters);
    });

    showToast(`Seeded sample patient ${seededPatient.name} (${seededPatient.tokenNumber})`, 'info');
  };

  const clearAllServed = () => {
    setPatients((prev) => prev.filter((p) => p.status !== 'Served' && p.status !== 'Cancelled'));
    showToast('Archived completed and cancelled entries', 'info');
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Stats calculation
  const stats = useMemo(() => {
    const activePatients = patients.filter((p) => p.status !== 'Cancelled');
    const waiting = patients.filter((p) => p.status === 'Waiting');
    const serving = patients.filter((p) => p.status === 'Serving');
    const served = patients.filter((p) => p.status === 'Served');

    const totalWaitSum = waiting.reduce((acc, p) => acc + p.estimatedWaitMinutes, 0);
    const avgWait = waiting.length > 0 ? Math.round(totalWaitSum / waiting.length) : 0;

    return {
      totalToday: activePatients.length,
      waitingCount: waiting.length,
      servingCount: serving.length,
      servedCount: served.length,
      avgWaitTime: avgWait || settings.avgConsultationMinutes,
    };
  }, [patients, settings.avgConsultationMinutes]);

  return (
    <QueueContext.Provider
      value={{
        patients,
        settings,
        notifications,
        currentView,
        setCurrentView,
        lastCalledPatient,
        toasts,
        dismissToast,
        showToast,
        callPatient,
        markServing,
        markServed,
        cancelPatient,
        registerPatient,
        updateSettings,
        resetDemoData,
        seedMorePatients,
        clearAllServed,
        markAllNotificationsRead,
        stats,
      }}
    >
      {children}
    </QueueContext.Provider>
  );
};

export const useQueue = () => {
  const context = useContext(QueueContext);
  if (!context) {
    throw new Error('useQueue must be used within a QueueProvider');
  }
  return context;
};
