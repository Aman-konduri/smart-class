import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  CLASSROOMS,
  INITIAL_LIGHTS,
  INITIAL_FANS,
  INITIAL_LIVE_TREND,
  INITIAL_ACTIVITY_FEED,
  INITIAL_NOTICES,
  INITIAL_NOTIFICATIONS,
  DEFAULT_SETTINGS,
} from '../data/mockData';

const ClassroomContext = createContext(null);

/**
 * Shared state provider for classroom sensors, IoT device controls, notices,
 * settings, theme (Dark/Light), and toast alerts.
 */
export function ClassroomProvider({ children }) {
  // Theme state ('dark' by default for Lusion-inspired look)
  const [theme, setTheme] = useState(() => localStorage.getItem('sc_theme') || 'dark');

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('sc_theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));

  // Active classroom & brief skeleton loading state when switching rooms
  const [classrooms, setClassrooms] = useState(CLASSROOMS);
  const [selectedRoomId, setSelectedRoomId] = useState(CLASSROOMS[0].id);
  const [isLoadingRoom, setIsLoadingRoom] = useState(false);
  const [sensorError, setSensorError] = useState(null);

  // IoT Devices (Lights & Fans)
  const [lights, setLights] = useState(INITIAL_LIGHTS);
  const [fans, setFans] = useState(INITIAL_FANS);
  const [autoMode, setAutoMode] = useState(true);

  // Live Trend & Activity Feed
  const [liveTrend, setLiveTrend] = useState(INITIAL_LIVE_TREND);
  const [activities, setActivities] = useState(INITIAL_ACTIVITY_FEED);

  // Notices, Notifications & Settings
  const [notices, setNotices] = useState(INITIAL_NOTICES);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  // Toast queue
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, variant = 'success') => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setToasts((prev) => [...prev.slice(-3), { id, message, variant }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3400);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const currentRoom =
    classrooms.find((r) => r.id === selectedRoomId) || classrooms[0];

  const selectClassroom = (roomId) => {
    setSelectedRoomId(roomId);
    setSensorError(null);
    setIsLoadingRoom(true);
    // TODO: Fetch selected classroom telemetry from GET /api/v1/classrooms/:id/telemetry
    setTimeout(() => setIsLoadingRoom(false), 360);
  };

  // Simulate live IoT sensor ticks every 4 seconds
  useEffect(() => {
    // TODO: Replace setInterval simulation with WebSocket / MQTT subscription
    const timer = setInterval(() => {
      const now = new Date();
      const timeLabel = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      setClassrooms((prevRooms) =>
        prevRooms.map((room) => {
          if (room.id !== selectedRoomId) return room;
          const tempDelta = (Math.random() - 0.48) * 0.4;
          const nextTemp = Number(Math.max(19, Math.min(34, room.temperature + tempDelta)).toFixed(1));
          const aqiDelta = Math.round((Math.random() - 0.48) * 4);
          const nextAqi = Math.max(22, Math.min(165, room.aqi + aqiDelta));
          const nextKwh = Number((room.kwhToday + 0.03).toFixed(2));

          setLiveTrend((prevTrend) => [
            ...prevTrend.slice(-7),
            { time: timeLabel, temp: nextTemp, kwh: nextKwh, occupancy: room.occupancy },
          ]);

          return {
            ...room,
            temperature: nextTemp,
            aqi: nextAqi,
            kwhToday: nextKwh,
          };
        })
      );
    }, 4000);

    return () => clearInterval(timer);
  }, [selectedRoomId]);

  // Device Control Handlers
  const toggleLight = (id) => {
    // TODO: Publish MQTT command e.g. client.publish(`classroom/${selectedRoomId}/lights/${id}`, payload)
    setLights((prev) =>
      prev.map((light) => {
        if (light.id !== id) return light;
        const nextState = !light.isOn;
        addToast(`${light.name} turned ${nextState ? 'ON' : 'OFF'}`, 'info');
        setActivities((acts) => [
          { id: `act-${Date.now()}`, time: 'Just now', text: `${light.name} switched ${nextState ? 'ON' : 'OFF'}`, type: 'info' },
          ...acts.slice(0, 5),
        ]);
        return { ...light, isOn: nextState };
      })
    );
  };

  const setAllLights = (turnOn) => {
    // TODO: Send bulk REST/MQTT command POST /api/v1/devices/lights/bulk
    setLights((prev) => prev.map((l) => ({ ...l, isOn: turnOn })));
    addToast(`All classroom lights turned ${turnOn ? 'ON' : 'OFF'}`, turnOn ? 'success' : 'info');
  };

  const toggleFan = (id) => {
    // TODO: Publish MQTT command for individual fan relay
    setFans((prev) =>
      prev.map((fan) => {
        if (fan.id !== id) return fan;
        const nextState = !fan.isOn;
        addToast(`${fan.name} turned ${nextState ? 'ON' : 'OFF'}`, 'info');
        return { ...fan, isOn: nextState };
      })
    );
  };

  const changeFanSpeed = (id, speed) => {
    // TODO: Publish MQTT PWM speed level (1-5) to fan controller
    const numericSpeed = Number(speed);
    setFans((prev) =>
      prev.map((fan) => (fan.id === id ? { ...fan, speed: numericSpeed, isOn: true } : fan))
    );
    const target = fans.find((f) => f.id === id);
    if (target) {
      addToast(`${target.name} speed set to Level ${numericSpeed}`, 'success');
    }
  };

  const setAllFans = (turnOn) => {
    // TODO: Send bulk REST/MQTT command POST /api/v1/devices/fans/bulk
    setFans((prev) => prev.map((f) => ({ ...f, isOn: turnOn })));
    addToast(`All ceiling fans turned ${turnOn ? 'ON' : 'OFF'}`, turnOn ? 'success' : 'info');
  };

  const toggleAutoMode = () => {
    // TODO: Update edge controller occupancy automation flag via API
    setAutoMode((prev) => {
      const next = !prev;
      if (next && currentRoom.occupancy === 0) {
        setLights((l) => l.map((item) => ({ ...item, isOn: false })));
        setFans((f) => f.map((item) => ({ ...item, isOn: false })));
        addToast('Auto Mode enabled: Room is empty, powered down idle devices.', 'success');
      } else {
        addToast(`Smart Eco Auto-Mode ${next ? 'enabled' : 'disabled'}`, 'success');
      }
      return next;
    });
  };

  // Notices CRUD
  const saveNotice = (noticeData) => {
    // TODO: POST or PUT /api/v1/notices
    if (noticeData.id) {
      setNotices((prev) => prev.map((n) => (n.id === noticeData.id ? { ...n, ...noticeData } : n)));
      addToast('Announcement updated successfully');
    } else {
      const created = {
        ...noticeData,
        id: `ntc-${Date.now()}`,
        date: noticeData.date || new Date().toISOString().slice(0, 10),
        pinned: Boolean(noticeData.pinned),
      };
      setNotices((prev) => [created, ...prev]);
      addToast('New announcement published');
    }
  };

  const deleteNotice = (id) => {
    // TODO: DELETE /api/v1/notices/:id
    setNotices((prev) => prev.filter((n) => n.id !== id));
    addToast('Announcement deleted', 'info');
  };

  const togglePinNotice = (id) => {
    // TODO: PATCH /api/v1/notices/:id/pin
    setNotices((prev) =>
      prev.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const updateSettings = (nextSettings) => {
    // TODO: PUT /api/v1/classrooms/:id/settings
    setSettings(nextSettings);
    setClassrooms((prev) =>
      prev.map((room, idx) =>
        idx === 0
          ? { ...room, name: nextSettings.classroomName, capacity: Number(nextSettings.maxOccupancy) }
          : room
      )
    );
    addToast('System settings & thresholds saved!', 'success');
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
    addToast('Settings restored to factory defaults', 'info');
  };

  return (
    <ClassroomContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
        classrooms,
        currentRoom,
        selectedRoomId,
        selectClassroom,
        isLoadingRoom,
        sensorError,
        setSensorError,
        lights,
        fans,
        autoMode,
        toggleLight,
        setAllLights,
        toggleFan,
        changeFanSpeed,
        setAllFans,
        toggleAutoMode,
        liveTrend,
        activities,
        notices,
        saveNotice,
        deleteNotice,
        togglePinNotice,
        notifications,
        markAllNotificationsRead,
        settings,
        updateSettings,
        resetSettings,
        toasts,
        addToast,
        dismissToast,
      }}
    >
      {children}
    </ClassroomContext.Provider>
  );
}

export function useClassroom() {
  const ctx = useContext(ClassroomContext);
  if (!ctx) throw new Error('useClassroom must be used inside <ClassroomProvider>');
  return ctx;
}
