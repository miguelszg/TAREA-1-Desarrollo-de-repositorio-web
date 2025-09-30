import React, { useState, useEffect } from 'react';
import { Dumbbell, Home, Activity, TrendingUp, User, Plus, Zap, Wifi, WifiOff, Database, Cloud, HardDrive, RefreshCw, Bell, X, CheckCircle, AlertCircle, Info, Battery, BatteryCharging, Camera, Smartphone, MapPin, Navigation } from 'lucide-react';

// ============ ESTILOS GLOBALES ============
const styles = {
  homeContainer: {
    minHeight: '100vh',
    backgroundColor: '#f9fafb',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  },
  header: {
    background: 'linear-gradient(90deg, #3b82f6 0%, #9333ea 100%)',
    color: 'white',
    padding: '2rem 1.5rem 1.5rem',
    borderBottomLeftRadius: '1.5rem',
    borderBottomRightRadius: '1.5rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
  },
  content: {
    padding: '1.5rem',
    paddingBottom: '7rem'
  },
  workoutCard: {
    backgroundColor: 'white',
    borderRadius: '1rem',
    padding: '1rem',
    marginBottom: '0.75rem',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    border: '1px solid #f3f4f6'
  },
  navbar: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTop: '1px solid #e5e7eb',
    padding: '1rem 1.5rem',
    borderTopLeftRadius: '1.5rem',
    borderTopRightRadius: '1.5rem',
    boxShadow: '0 -4px 6px rgba(0, 0, 0, 0.05)',
    zIndex: 100
  }
};

const keyframes = `
  @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
  @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
  @keyframes slideInRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
  @keyframes slideOutRight { from { transform: translateX(0); opacity: 1; } to { transform: translateX(100%); opacity: 0; } }
`;

// ============ COMPONENTE: NOTIFICACIONES ============
const NotificationSystem = ({ notifications, onClose }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle size={20} color="#10b981" />;
      case 'error': return <AlertCircle size={20} color="#ef4444" />;
      case 'info': return <Info size={20} color="#3b82f6" />;
      default: return <Bell size={20} color="#6b7280" />;
    }
  };

  const getColor = (type) => {
    switch (type) {
      case 'success': return { bg: '#ecfdf5', border: '#10b981', text: '#065f46' };
      case 'error': return { bg: '#fef2f2', border: '#ef4444', text: '#991b1b' };
      case 'info': return { bg: '#eff6ff', border: '#3b82f6', text: '#1e40af' };
      default: return { bg: '#f9fafb', border: '#6b7280', text: '#374151' };
    }
  };

  return (
    <div style={{ position: 'fixed', top: '1rem', right: '1rem', zIndex: 1000, maxWidth: '20rem' }}>
      <style>{keyframes}</style>
      {notifications.map((notif) => {
        const colors = getColor(notif.type);
        return (
          <div
            key={notif.id}
            style={{
              backgroundColor: colors.bg,
              border: `1px solid ${colors.border}`,
              borderRadius: '0.75rem',
              padding: '1rem',
              marginBottom: '0.75rem',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              animation: notif.closing ? 'slideOutRight 0.3s ease-out' : 'slideInRight 0.3s ease-out',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.75rem'
            }}
          >
            {getIcon(notif.type)}
            <div style={{ flex: 1 }}>
              <h4 style={{ fontWeight: '600', color: colors.text, fontSize: '0.875rem' }}>{notif.title}</h4>
              <p style={{ color: colors.text, fontSize: '0.75rem', marginTop: '0.25rem', opacity: 0.8 }}>{notif.message}</p>
            </div>
            <button
              onClick={() => onClose(notif.id)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            >
              <X size={16} color={colors.text} />
            </button>
          </div>
        );
      })}
    </div>
  );
};

// ============ COMPONENTE: NAVBAR ============
const Navbar = ({ activeTab, onTabChange }) => (
  <nav style={styles.navbar}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
      {[
        { icon: Home, label: 'Inicio', id: 'home' },
        { icon: Activity, label: 'Actividad', id: 'activity' },
        { icon: TrendingUp, label: 'Progreso', id: 'progress' },
        { icon: User, label: 'Perfil', id: 'profile' }
      ].map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.25rem',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '0'
          }}
        >
          <tab.icon size={24} color={activeTab === tab.id ? '#9333ea' : '#9ca3af'} strokeWidth={activeTab === tab.id ? 2.5 : 2} />
          <span style={{ fontSize: '0.75rem', color: activeTab === tab.id ? '#9333ea' : '#9ca3af', fontWeight: activeTab === tab.id ? '500' : '400' }}>
            {tab.label}
          </span>
        </button>
      ))}
    </div>
  </nav>
);

// ============ COMPONENTE: WORKOUT CARD ============
const WorkoutCard = ({ workout }) => (
  <div style={styles.workoutCard}>
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <h4 style={{ fontWeight: '600', color: '#1f2937', fontSize: '1.125rem' }}>{workout.name}</h4>
          {workout.source === 'local' ? (
            <HardDrive size={14} color="#6b7280" title="Local" />
          ) : (
            <Cloud size={14} color="#3b82f6" title="Remoto" />
          )}
        </div>
        <p style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '0.25rem' }}>{workout.date}</p>
      </div>
      <div style={{ backgroundColor: '#f3e8ff', borderRadius: '9999px', padding: '0.25rem 0.75rem' }}>
        <span style={{ color: '#9333ea', fontSize: '0.875rem', fontWeight: '500' }}>{workout.calories} kcal</span>
      </div>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', marginTop: '0.75rem', color: '#6b7280', fontSize: '0.875rem' }}>
      <Activity size={16} style={{ marginRight: '0.25rem' }} />
      <span>{workout.duration}</span>
    </div>
  </div>
);

// ============ APP PRINCIPAL ============
const FitTrackApp = () => {
  const [currentScreen, setCurrentScreen] = useState('splash');
  const [activeTab, setActiveTab] = useState('home');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [notifications, setNotifications] = useState([]);
  const [localData, setLocalData] = useState({ workouts: [], lastSync: null });
  const [notificationPermission, setNotificationPermission] = useState('default');

  // Sistema de notificaciones
  const showNotification = (title, message, type = 'info') => {
    const id = Date.now();
    const newNotif = { id, title, message, type, closing: false };
    setNotifications((prev) => [...prev, newNotif]);

    // Notificación del navegador si hay permiso
    if (notificationPermission === 'granted' && 'Notification' in window) {
      new Notification(title, {
        body: message,
        icon: '/fitness-icon.png',
        badge: '/badge-icon.png'
      });
    }

    setTimeout(() => {
      closeNotification(id);
    }, 5000);
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      if (permission === 'granted') {
        showNotification('🔔 Notificaciones activadas', 'Recibirás alertas de entrenamiento', 'success');
      } else {
        showNotification('❌ Permiso denegado', 'No podrás recibir notificaciones del sistema', 'error');
      }
    } else if (Notification.permission === 'granted') {
      showNotification('✅ Ya activadas', 'Las notificaciones ya están habilitadas', 'info');
    } else {
      showNotification('ℹ️ No disponible', 'Las notificaciones ya fueron configuradas', 'info');
    }
  };

  const closeNotification = (id) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, closing: true } : notif))
    );
    setTimeout(() => {
      setNotifications((prev) => prev.filter((notif) => notif.id !== id));
    }, 300);
  };

  // Base de datos local
  const localDB = {
    save: (key, data) => {
      const stored = { ...localData };
      stored[key] = data;
      stored.lastSync = new Date().toISOString();
      setLocalData(stored);
      console.log('💾 LOCAL: Datos guardados');
    },
    get: (key) => {
      console.log('📂 LOCAL: Leyendo datos');
      return localData[key];
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentScreen('home');
      showNotification('¡Bienvenida!', 'FitTrack está listo para ayudarte', 'success');
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  // Detectar cambios reales en la conexión de internet
  useEffect(() => {
    const handleOnline = () => {
      console.log('🟢 Conexión restaurada');
      setIsOnline(true);
      showNotification('🌐 Conexión restaurada', 'Ahora tienes acceso a internet', 'success');
    };

    const handleOffline = () => {
      console.log('🔴 Sin conexión');
      setIsOnline(false);
      showNotification('📴 Sin conexión', 'Usando datos guardados en cache', 'info');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Solicitar permiso de notificaciones al iniciar
  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  // Notificaciones periódicas (simuladas)
  useEffect(() => {
    const interval = setInterval(() => {
      const messages = [
        { title: '💪 ¡Hora de entrenar!', message: 'No olvides tu rutina de hoy', type: 'info' },
        { title: '🔥 Racha activa', message: 'Llevas 5 días consecutivos', type: 'success' },
        { title: '📊 Nuevo récord', message: 'Has superado tu mejor marca', type: 'success' }
      ];
      const random = messages[Math.floor(Math.random() * messages.length)];
      showNotification(random.title, random.message, random.type);
    }, 30000); // Cada 30 segundos

    return () => clearInterval(interval);
  }, []);

  // Pantalla Splash
  const SplashScreen = () => (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #3b82f6 0%, #9333ea 50%, #ec4899 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <style>{keyframes}</style>
      <div style={{ animation: 'bounce 1s infinite' }}>
        <Dumbbell size={96} color="white" strokeWidth={2} />
      </div>
      <h1 style={{ fontSize: '3rem', fontWeight: 'bold', color: 'white', marginTop: '1.5rem' }}>FitTrack</h1>
      <p style={{ color: 'white', fontSize: '1.125rem', marginTop: '0.5rem', opacity: 0.9 }}>Tu compañero de entrenamiento</p>
    </div>
  );

  // Pantalla Home
  const HomeScreen = () => {
    const workouts = [
      { id: 1, name: 'Cardio Matutino', duration: '30 min', calories: 250, date: 'Hoy, 7:00 AM', source: 'local' },
      { id: 2, name: 'Fuerza', duration: '45 min', calories: 320, date: 'Ayer, 6:30 PM', source: 'remote' },
      { id: 3, name: 'Yoga', duration: '20 min', calories: 120, date: 'Ayer, 8:00 AM', source: 'local' }
    ];

    return (
      <div style={styles.homeContainer}>
        <div style={styles.header}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold' }}>Hola, Ana</h2>
              <p style={{ color: '#bfdbfe', marginTop: '0.25rem' }}>Lunes, 29 de Septiembre</p>
            </div>
            <button
              onClick={requestNotificationPermission}
              style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', width: '3rem', height: '3rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <Bell size={20} color="white" />
            </button>
          </div>
        </div>

        <div style={styles.content}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>Entrenamientos</h3>
          {workouts.map((workout) => (
            <WorkoutCard key={workout.id} workout={workout} />
          ))}
          
          <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: '#fef3c7', borderRadius: '0.75rem', border: '1px solid #fcd34d' }}>
            <p style={{ fontSize: '0.875rem', color: '#92400e', fontWeight: '600' }}>💡 Tip de Notificaciones</p>
            <p style={{ fontSize: '0.75rem', color: '#78350f', marginTop: '0.5rem' }}>
              Haz clic en el botón 🔔 para activar notificaciones del sistema. Recibirás alertas incluso cuando no estés usando la app.
            </p>
          </div>
        </div>
      </div>
    );
  };

  // Pantalla Actividad
  const ActivityScreen = () => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dataSource, setDataSource] = useState('');
    const [syncing, setSyncing] = useState(false);
    const [batteryLevel, setBatteryLevel] = useState(null);
    const [isCharging, setIsCharging] = useState(false);
    const [cameraStream, setCameraStream] = useState(null);
    const [photoTaken, setPhotoTaken] = useState(null);
    const [location, setLocation] = useState(null);
    const [gettingLocation, setGettingLocation] = useState(false);

    useEffect(() => {
      const cachedData = localDB.get('workouts');
      
      if (!isOnline && cachedData && cachedData.length > 0) {
        console.log('📴 OFFLINE: Usando cache');
        setActivities(cachedData);
        setDataSource('offline');
        setLoading(false);
        return;
      }
      
      if (isOnline) {
        console.log('🌐 ONLINE: Obteniendo datos mixtos');
        const timer = setTimeout(() => {
          const onlineData = [
            { id: 1, type: 'Running', distance: '5.2 km', pace: '5:30 min/km', date: '28 Sep', icon: Zap, color: '#ef4444', source: 'online' },
            { id: 2, type: 'Cycling', distance: '15 km', pace: '22 km/h', date: '27 Sep', icon: Activity, color: '#3b82f6', source: 'online' }
          ];
          
          const offlineData = [
            { id: 3, type: 'Swimming', distance: '800 m', pace: '2:15 min/100m', date: '26 Sep', icon: TrendingUp, color: '#06b6d4', source: 'cache' },
            { id: 4, type: 'Weightlifting', distance: '45 min', pace: '12 sets', date: '25 Sep', icon: Dumbbell, color: '#8b5cf6', source: 'cache' }
          ];
          
          const mixedData = [...onlineData, ...offlineData];
          localDB.save('workouts', mixedData);
          setActivities(mixedData);
          setDataSource('mixed');
          setLoading(false);
          console.log('✅ Datos cargados');
        }, 1500);
        
        return () => clearTimeout(timer);
      }
      
      if (!isOnline && (!cachedData || cachedData.length === 0)) {
        console.log('❌ Sin cache');
        setDataSource('none');
        setLoading(false);
      }
    }, []);

    // Obtener nivel de batería
    useEffect(() => {
      const getBatteryInfo = async () => {
        if ('getBattery' in navigator) {
          try {
            const battery = await navigator.getBattery();
            setBatteryLevel(Math.round(battery.level * 100));
            setIsCharging(battery.charging);
            
            battery.addEventListener('levelchange', () => {
              setBatteryLevel(Math.round(battery.level * 100));
            });
            
            battery.addEventListener('chargingchange', () => {
              setIsCharging(battery.charging);
            });
            
            console.log('🔋 Batería detectada:', Math.round(battery.level * 100) + '%');
          } catch (error) {
            console.log('❌ No se pudo acceder a la batería');
          }
        } else {
          console.log('❌ API de batería no disponible');
        }
      };
      
      getBatteryInfo();
    }, []);

    const handleSync = () => {
      if (!isOnline) {
        showNotification('❌ Sin conexión', 'No puedes sincronizar sin internet', 'error');
        return;
      }
      setSyncing(true);
      setLoading(true);
      
      setTimeout(() => {
        const onlineData = [
          { id: 1, type: 'Running', distance: '5.2 km', pace: '5:30 min/km', date: '28 Sep', icon: Zap, color: '#ef4444', source: 'online' },
          { id: 2, type: 'Cycling', distance: '15 km', pace: '22 km/h', date: '27 Sep', icon: Activity, color: '#3b82f6', source: 'online' }
        ];
        
        const offlineData = [
          { id: 3, type: 'Swimming', distance: '800 m', pace: '2:15 min/100m', date: '26 Sep', icon: TrendingUp, color: '#06b6d4', source: 'cache' },
          { id: 4, type: 'Weightlifting', distance: '45 min', pace: '12 sets', date: '25 Sep', icon: Dumbbell, color: '#8b5cf6', source: 'cache' }
        ];
        
        const mixedData = [...onlineData, ...offlineData];
        
        localDB.save('workouts', mixedData);
        setActivities(mixedData);
        setDataSource('mixed');
        setSyncing(false);
        setLoading(false);
        showNotification('🔄 Sincronizado', 'Datos actualizados exitosamente', 'success');
      }, 1000);
    };

    // Función para obtener ubicación GPS
    const handleGetLocation = () => {
      if (!('geolocation' in navigator)) {
        showNotification('❌ No disponible', 'Tu dispositivo no soporta geolocalización', 'error');
        return;
      }

      setGettingLocation(true);
      showNotification('📍 Obteniendo ubicación...', 'Buscando tu posición GPS', 'info');

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const locationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          };
          setLocation(locationData);
          setGettingLocation(false);
          showNotification(
            '✅ Ubicación obtenida',
            `Lat: ${locationData.latitude.toFixed(4)}, Lng: ${locationData.longitude.toFixed(4)}`,
            'success'
          );
          console.log('📍 GPS:', locationData);
        },
        (error) => {
          setGettingLocation(false);
          let message = 'No se pudo obtener la ubicación';
          if (error.code === 1) message = 'Permiso denegado';
          if (error.code === 2) message = 'Posición no disponible';
          if (error.code === 3) message = 'Tiempo de espera agotado';
          showNotification('❌ Error GPS', message, 'error');
          console.log('❌ Error GPS:', error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    };

    // Función para vibrar
    const handleVibrate = () => {
      if ('vibrate' in navigator) {
        navigator.vibrate([200, 100, 200]);
        showNotification('📳 Vibración', 'Dispositivo vibrando', 'success');
        console.log('📳 Vibrando...');
      } else {
        showNotification('❌ No disponible', 'Tu dispositivo no soporta vibración', 'error');
        console.log('❌ Vibración no disponible');
      }
    };

    // Función para abrir cámara
    const handleCamera = async () => {
      if (!cameraStream) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'user' },
            audio: false 
          });
          setCameraStream(stream);
          showNotification('📸 Cámara activada', 'Toca "Capturar" para tomar foto', 'success');
          console.log('📸 Cámara activada');
        } catch (error) {
          showNotification('❌ Error', 'No se pudo acceder a la cámara', 'error');
          console.log('❌ Error al acceder a la cámara:', error);
        }
      } else {
        cameraStream.getTracks().forEach(track => track.stop());
        setCameraStream(null);
        setPhotoTaken(null);
        console.log('📸 Cámara desactivada');
      }
    };

    // Función para capturar foto
    const handleCapture = () => {
      if (cameraStream) {
        const video = document.getElementById('cameraVideo');
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0);
        const photoUrl = canvas.toDataURL('image/png');
        setPhotoTaken(photoUrl);
        
        cameraStream.getTracks().forEach(track => track.stop());
        setCameraStream(null);
        
        showNotification('✅ Foto capturada', 'Imagen guardada exitosamente', 'success');
        console.log('📸 Foto capturada');
      }
    };

    // Limpiar stream al desmontar
    useEffect(() => {
      return () => {
        if (cameraStream) {
          cameraStream.getTracks().forEach(track => track.stop());
        }
      };
    }, [cameraStream]);

    return (
      <div style={styles.homeContainer}>
        <style>{keyframes}</style>
        <div style={styles.header}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold' }}>Actividades</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                {dataSource === 'online' ? <Cloud size={16} color="#bfdbfe" /> : <HardDrive size={16} color="#fde68a" />}
                <p style={{ color: '#bfdbfe', fontSize: '0.875rem' }}>
                  {dataSource === 'online' ? 'Remoto' : 'Cache Local'}
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <div style={{ padding: '0.5rem', borderRadius: '0.5rem', backgroundColor: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center' }}>
                {isOnline ? <Wifi size={20} color="white" /> : <WifiOff size={20} color="white" />}
              </div>
              <button onClick={handleSync} disabled={!isOnline} style={{ padding: '0.5rem', borderRadius: '0.5rem', backgroundColor: 'rgba(255,255,255,0.2)', border: 'none', cursor: isOnline ? 'pointer' : 'not-allowed', opacity: isOnline ? 1 : 0.5 }}>
                <RefreshCw size={20} color="white" style={{ animation: syncing ? 'spin 1s linear infinite' : 'none' }} />
              </button>
            </div>
          </div>
          
          {batteryLevel !== null && (
            <div style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {isCharging ? <BatteryCharging size={20} color="#10b981" /> : <Battery size={20} color={batteryLevel > 20 ? '#bfdbfe' : '#ef4444'} />}
                <span style={{ fontSize: '0.875rem', color: '#bfdbfe' }}>
                  Batería: {batteryLevel}% {isCharging && '(Cargando)'}
                </span>
              </div>
            </div>
          )}
        </div>

        <div style={styles.content}>
          {/* Controles de Hardware */}
          <div style={{ marginBottom: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
            <button
              onClick={handleVibrate}
              style={{
                padding: '1rem',
                backgroundColor: '#8b5cf6',
                color: 'white',
                border: 'none',
                borderRadius: '0.75rem',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.5rem',
                fontWeight: '600',
                fontSize: '0.75rem'
              }}
            >
              <Smartphone size={20} />
              Vibrar
            </button>
            
            <button
              onClick={handleCamera}
              style={{
                padding: '1rem',
                backgroundColor: cameraStream ? '#ef4444' : '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '0.75rem',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.5rem',
                fontWeight: '600',
                fontSize: '0.75rem'
              }}
            >
              <Camera size={20} />
              {cameraStream ? 'Cerrar' : 'Cámara'}
            </button>

            <button
              onClick={handleGetLocation}
              disabled={gettingLocation}
              style={{
                padding: '1rem',
                backgroundColor: location ? '#10b981' : '#f59e0b',
                color: 'white',
                border: 'none',
                borderRadius: '0.75rem',
                cursor: gettingLocation ? 'wait' : 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.5rem',
                fontWeight: '600',
                fontSize: '0.75rem',
                opacity: gettingLocation ? 0.7 : 1
              }}
            >
              {gettingLocation ? <Navigation size={20} style={{ animation: 'spin 1s linear infinite' }} /> : <MapPin size={20} />}
              {gettingLocation ? 'GPS...' : location ? 'Ubicado' : 'GPS'}
            </button>
          </div>

          {/* Mostrar Ubicación */}
          {location && (
            <div style={{ marginBottom: '1.5rem', backgroundColor: 'white', borderRadius: '1rem', padding: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <MapPin size={20} color="#10b981" />
                <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1f2937' }}>Tu ubicación GPS:</h4>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.75rem', color: '#6b7280' }}>
                <div>
                  <strong>Latitud:</strong> {location.latitude.toFixed(6)}
                </div>
                <div>
                  <strong>Longitud:</strong> {location.longitude.toFixed(6)}
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <strong>Precisión:</strong> ±{location.accuracy.toFixed(0)} metros
                </div>
              </div>
            </div>
          )}

          {/* Vista de Cámara */}
          {cameraStream && (
            <div style={{ marginBottom: '1.5rem', backgroundColor: 'white', borderRadius: '1rem', padding: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <video
                id="cameraVideo"
                autoPlay
                playsInline
                ref={(video) => {
                  if (video && cameraStream) {
                    video.srcObject = cameraStream;
                  }
                }}
                style={{ width: '100%', borderRadius: '0.5rem', marginBottom: '0.75rem' }}
              />
              <button
                onClick={handleCapture}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  backgroundColor: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '0.875rem'
                }}
              >
                📸 Capturar Foto
              </button>
            </div>
          )}

          {/* Foto Capturada */}
          {photoTaken && (
            <div style={{ marginBottom: '1.5rem', backgroundColor: 'white', borderRadius: '1rem', padding: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.75rem' }}>Última foto capturada:</h4>
              <img src={photoTaken} alt="Captura" style={{ width: '100%', borderRadius: '0.5rem' }} />
            </div>
          )}

          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem 0' }}>
              <div style={{ width: '40px', height: '40px', border: '4px solid #e5e7eb', borderTop: '4px solid #9333ea', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }}></div>
              <p style={{ marginTop: '1rem', color: '#6b7280' }}>Cargando...</p>
            </div>
          ) : dataSource === 'none' ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', backgroundColor: '#fef2f2', borderRadius: '1rem', border: '1px solid #fecaca' }}>
              <WifiOff size={48} color="#dc2626" style={{ margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#991b1b', marginBottom: '0.5rem' }}>Sin cache disponible</h3>
              <p style={{ color: '#7f1d1d', fontSize: '0.875rem' }}>Conéctate a internet primero para guardar datos en el cache.</p>
            </div>
          ) : (
            <>
              {dataSource === 'offline' && (
                <div style={{ padding: '1rem', backgroundColor: '#fef3c7', borderRadius: '0.5rem', marginBottom: '1rem', border: '1px solid #fcd34d', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Database size={20} color="#92400e" />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '0.875rem', color: '#92400e', fontWeight: '600' }}>Modo Offline</p>
                    <p style={{ fontSize: '0.75rem', color: '#78350f', marginTop: '0.25rem' }}>
                      Mostrando datos del cache. Última sync: {localData.lastSync ? new Date(localData.lastSync).toLocaleTimeString() : 'Nunca'}
                    </p>
                  </div>
                </div>
              )}
              
              <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>Entrenamientos</h3>
              
              {activities.map((activity) => (
                <div key={activity.id} style={styles.workoutCard}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '3rem', height: '3rem', borderRadius: '0.75rem', backgroundColor: activity.color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <activity.icon size={24} color={activity.color} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <h4 style={{ fontWeight: '600', color: '#1f2937' }}>{activity.type}</h4>
                        {activity.source === 'online' ? (
                          <Cloud size={14} color="#3b82f6" title="Datos del servidor" />
                        ) : (
                          <HardDrive size={14} color="#f59e0b" title="Datos del cache" />
                        )}
                      </div>
                      <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>{activity.date}</p>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #f3f4f6', fontSize: '0.75rem' }}>
                    <div>
                      <p style={{ color: '#9ca3af' }}>Distancia</p>
                      <p style={{ color: '#1f2937', fontWeight: '600' }}>{activity.distance}</p>
                    </div>
                    <div>
                      <p style={{ color: '#9ca3af' }}>Ritmo</p>
                      <p style={{ color: '#1f2937', fontWeight: '600' }}>{activity.pace}</p>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    );
  };

  const renderScreen = () => {
    switch (activeTab) {
      case 'home': return <HomeScreen />;
      case 'activity': return <ActivityScreen />;
      default: return <div style={styles.homeContainer}><div style={styles.content}><p style={{ textAlign: 'center', color: '#6b7280' }}>Próximamente...</p></div></div>;
    }
  };

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <NotificationSystem notifications={notifications} onClose={closeNotification} />
      
      {!isOnline && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, backgroundColor: '#ef4444', color: 'white', padding: '0.5rem', textAlign: 'center', fontSize: '0.875rem', fontWeight: '600', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          <WifiOff size={16} />
          Sin conexión - Modo Offline
        </div>
      )}
      
      {currentScreen === 'splash' ? (
        <SplashScreen />
      ) : (
        <>
          {renderScreen()}
          <Navbar activeTab={activeTab} onTabChange={setActiveTab} />
        </>
      )}
    </div>
  );
};

export default FitTrackApp;