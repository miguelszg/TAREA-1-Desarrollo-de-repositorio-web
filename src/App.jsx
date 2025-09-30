// ============ COMPONENTE: PANTALLA DE PROGRESO CON HARDWARE ============
const ProgressScreen = ({ showNotification }) => {
  const [photo, setPhoto] = useState(null);
  const [location, setLocation] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [batteryLevel, setBatteryLevel] = useState(null);

  // Detectar nivel de batería
  useEffect(() => {
    if ('getBattery' in navigator) {
      navigator.getBattery().then((battery) => {
        setBatteryLevel(Math.round(battery.level * 100));
        
        battery.addEventListener('levelchange', () => {
          setBatteryLevel(Math.round(battery.level * 100));
        });
      });
    }
  }, []);

  // Tomar foto con la cámara
  const takePhoto = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment';
    
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setPhoto(event.target.result);
          vibrate();
          showNotification('📸 Foto capturada', 'Foto de progreso guardada', 'success');
        };
        reader.readAsDataURL(file);
      }
    };
    
    input.click();
  };

  // Obtener ubicación GPS
  const getLocation = () => {
    if (!('geolocation' in navigator)) {
      showNotification('❌ GPS no disponible', 'Tu dispositivo no soporta geolocalización', 'error');
      return;
    }

    setLoadingLocation(true);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude.toFixed(6),
          lng: position.coords.longitude.toFixed(6),
          accuracy: position.coords.accuracy.toFixed(0)
        });
        setLoadingLocation(false);
        vibrate();
        showNotification('📍 Ubicación obtenida', 'GPS activado correctamente', 'success');
      },
      (error) => {
        setLoadingLocation(false);
        let message = 'Error al obtener ubicación';
        if (error.code === 1) message = 'Permiso de ubicación denegado';
        showNotification('❌ Error GPS', message, 'error');
      }
    );
  };

  // Vibración háptica
  const vibrate = (pattern = 200) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  };

  const vibratePattern = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([100, 50, 100, 50, 200]);
      showNotification('📳 Vibración', 'Patrón de vibración ejecutado', 'info');
    } else {
      showNotification('❌ Vibración no disponible', 'Tu dispositivo no soporta vibración', 'error');
    }
  };

  return (
    <div style={styles.homeContainer}>
      <div style={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold' }}>Hardware</h2>
            <p style={{ color: '#bfdbfe', fontSize: '0.875rem', marginTop: '0.5rem' }}>Dispositivos físicos</p>
          </div>
          {batteryLevel !== null && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'rgba(255,255,255,0.2)', padding: '0.5rem 0.75rem', borderRadius: '0.5rem' }}>
              <Battery size={20} color="white" />
              <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>{batteryLevel}%</span>
            </div>
          )}
        </div>
      </div>

      <div style={styles.content}>
        {/* Cámara */}
        <div style={styles.workoutCard}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ width: '3rem', height: '3rem', borderRadius: '0.75rem', backgroundColor: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Camera size={24} color="#3b82f6" />
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937' }}>Cámara</h3>
              <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>Toma fotos de tu progreso</p>
            </div>
          </div>
          
          {photo && (
            <img 
              src={photo} 
              alt="Foto de progreso" 
              style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '0.5rem', marginBottom: '1rem' }} 
            />
          )}
          
          <button
            onClick={takePhoto}
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            <Camera size={20} />
            {photo ? 'Tomar otra foto' : 'Abrir cámara'}
          </button>
        </div>

        {/* GPS */}
        <div style={styles.workoutCard}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ width: '3rem', height: '3rem', borderRadius: '0.75rem', backgroundColor: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MapPin size={24} color="#10b981" />
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937' }}>Geolocalización</h3>
              <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>Rastrea tu ubicación GPS</p>
            </div>
          </div>

          {location && (
            <div style={{ backgroundColor: '#f0fdf4', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1rem', border: '1px solid #86efac' }}>
              <p style={{ fontSize: '0.875rem', color: '#166534', marginBottom: '0.5rem' }}>
                <strong>Latitud:</strong> {location.lat}
              </p>
              <p style={{ fontSize: '0.875rem', color: '#166534', marginBottom: '0.5rem' }}>
                <strong>Longitud:</strong> {location.lng}
              </p>
              <p style={{ fontSize: '0.75rem', color: '#15803d' }}>
                Precisión: ±{location.accuracy}m
              </p>
            </div>
          )}

          <button
            onClick={getLocation}
            disabled={loadingLocation}
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontWeight: '600',
              cursor: loadingLocation ? 'not-allowed' : 'pointer',
              opacity: loadingLocation ? 0.6 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            <MapPin size={20} />
            {loadingLocation ? 'Obteniendo ubicación...' : 'Obtener ubicación'}
          </button>
        </div>

        {/* Vibración */}
        <div style={styles.workoutCard}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ width: '3rem', height: '3rem', borderRadius: '0.75rem', backgroundColor: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Smartphone size={24} color="#f59e0b" />
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937' }}>Vibración</h3>
              <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>Feedback háptico del dispositivo</p>
            </div>
          </div>

          <button
            onClick={vibratePattern}
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: '#f59e0b',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            <Smartphone size={20} />
            Vibrar dispositivo
          </button>

          <div style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: '#fffbeb', borderRadius: '0.5rem', border: '1px solid #fcd34d' }}>
            <p style={{ fontSize: '0.75rem', color: '#92400e' }}>
              <strong>💡 Nota:</strong> La vibración funciona mejor en dispositivos móviles físicos.
            </p>
          </div>
        </div>

        {/* Info adicional */}
        <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: '#eff6ff', borderRadius: '0.75rem', border: '1px solid #93c5fd' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <Info size={20} color="#1e40af" />
            <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1e40af' }}>APIs del Dispositivo</h4>
          </div>
          <ul style={{ fontSize: '0.75rem', color: '#1e3a8a', lineHeight: '1.6', paddingLeft: '1.25rem', margin: 0 }}>
            <li>Cámara: MediaDevices API</li>
            <li>GPS: Geolocation API</li>
            <li>Vibración: Vibration API</li>
            <li>Batería: Battery Status API</li>
          </ul>
        </div>
      </div>
    </div>
  );
};import React, { useState, useEffect } from 'react';
import { Dumbbell, Home, Activity, TrendingUp, User, Plus, Zap, Wifi, WifiOff, Database, Cloud, HardDrive, RefreshCw, Bell, X, CheckCircle, AlertCircle, Info, Camera, MapPin, Smartphone, Battery, BatteryCharging } from 'lucide-react';

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
  const [isOnline, setIsOnline] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [localData, setLocalData] = useState({ workouts: [], lastSync: null });

  // Sistema de notificaciones
  const showNotification = (title, message, type = 'info') => {
    const id = Date.now();
    const newNotif = { id, title, message, type, closing: false };
    setNotifications((prev) => [...prev, newNotif]);

    // Auto-cerrar después de 5 segundos
    setTimeout(() => {
      closeNotification(id);
    }, 5000);
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
              onClick={() => showNotification('🔔 Notificación', 'Esta es una notificación de prueba', 'info')}
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
              Haz clic en el botón 🔔 para probar notificaciones. Se generan automáticamente cada 30 segundos.
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

    useEffect(() => {
      const cachedData = localDB.get('workouts');
      
      if (!isOnline && cachedData && cachedData.length > 0) {
        setActivities(cachedData);
        setDataSource('offline');
        setLoading(false);
      } else if (isOnline) {
        setTimeout(() => {
          const data = [
            { id: 1, type: 'Running', distance: '5.2 km', pace: '5:30 min/km', date: '28 Sep', icon: Zap, color: '#ef4444' },
            { id: 2, type: 'Cycling', distance: '15 km', pace: '22 km/h', date: '27 Sep', icon: Activity, color: '#3b82f6' }
          ];
          localDB.save('workouts', data);
          setActivities(data);
          setDataSource('online');
          setLoading(false);
        }, 1500);
      } else {
        setDataSource('none');
        setLoading(false);
      }
    }, [isOnline]);

    const toggleOnline = () => {
      const newOnlineState = !isOnline;
      setIsOnline(newOnlineState);
      showNotification(
        newOnlineState ? '🌐 Modo Online' : '📴 Modo Offline',
        newOnlineState ? 'Conexión activada' : 'Conexión desactivada',
        'info'
      );
    };

    const handleSync = () => {
      if (!isOnline) return;
      setSyncing(true);
      setTimeout(() => {
        const data = [
          { id: 1, type: 'Running', distance: '5.2 km', pace: '5:30 min/km', date: '28 Sep', icon: Zap, color: '#ef4444' },
          { id: 2, type: 'Cycling', distance: '15 km', pace: '22 km/h', date: '27 Sep', icon: Activity, color: '#3b82f6' }
        ];
        localDB.save('workouts', data);
        setActivities(data);
        setSyncing(false);
        showNotification('🔄 Sincronizado', 'Datos actualizados exitosamente', 'success');
      }, 1000);
    };

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
                  {dataSource === 'online' ? 'Remoto' : 'Local'}
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={toggleOnline} style={{ padding: '0.5rem', borderRadius: '0.5rem', backgroundColor: 'rgba(255,255,255,0.2)', border: 'none', cursor: 'pointer' }}>
                {isOnline ? <Wifi size={20} color="white" /> : <WifiOff size={20} color="white" />}
              </button>
              <button onClick={handleSync} disabled={!isOnline} style={{ padding: '0.5rem', borderRadius: '0.5rem', backgroundColor: 'rgba(255,255,255,0.2)', border: 'none', cursor: isOnline ? 'pointer' : 'not-allowed', opacity: isOnline ? 1 : 0.5 }}>
                <RefreshCw size={20} color="white" style={{ animation: syncing ? 'spin 1s linear infinite' : 'none' }} />
              </button>
            </div>
          </div>
        </div>

        <div style={styles.content}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem 0' }}>
              <div style={{ width: '40px', height: '40px', border: '4px solid #e5e7eb', borderTop: '4px solid #9333ea', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }}></div>
            </div>
          ) : (
            activities.map((activity) => (
              <div key={activity.id} style={styles.workoutCard}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '3rem', height: '3rem', borderRadius: '0.75rem', backgroundColor: activity.color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <activity.icon size={24} color={activity.color} />
                  </div>
                  <div>
                    <h4 style={{ fontWeight: '600', color: '#1f2937' }}>{activity.type}</h4>
                    <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>{activity.date}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  const renderScreen = () => {
    switch (activeTab) {
      case 'home': return <HomeScreen />;
      case 'activity': return <ActivityScreen />;
      case 'progress': return <ProgressScreen showNotification={showNotification} />;
      default: return <div style={styles.homeContainer}><div style={styles.content}><p style={{ textAlign: 'center', color: '#6b7280' }}>Próximamente...</p></div></div>;
    }
  };

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <NotificationSystem notifications={notifications} onClose={closeNotification} />
      
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