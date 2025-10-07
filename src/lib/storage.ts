// Local storage utilities for persisting app state

export interface AnimeItem {
  id: string;
  title: string;
  removed?: boolean;
}

export interface PomodoroSettings {
  focusDuration: number; // minutes
  shortBreakDuration: number;
  longBreakDuration: number;
  cyclesUntilLongBreak: number;
  autoStartBreaks: boolean;
  audioEnabled: boolean;
}

export interface YaoiCard {
  id: string;
  title: string;
  tags?: string[];
  note?: string;
  image?: string;
  tier: 'S' | 'A' | 'B' | 'C' | 'D' | 'F';
}

export interface AppSettings {
  theme: 'light' | 'dark';
  audioEnabled: boolean;
  reducedMotion: boolean;
  malConnected: boolean;
  anilistConnected: boolean;
}

// Default settings
export const defaultPomodoroSettings: PomodoroSettings = {
  focusDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  cyclesUntilLongBreak: 4,
  autoStartBreaks: false,
  audioEnabled: true,
};

export const defaultAppSettings: AppSettings = {
  theme: 'light',
  audioEnabled: true,
  reducedMotion: false,
  malConnected: false,
  anilistConnected: false,
};

// Storage keys
const KEYS = {
  ANIME_LIST: 'sherboard_anime_list',
  LAST_PICKED: 'sherboard_last_picked',
  POMODORO_SETTINGS: 'sherboard_pomodoro_settings',
  POMODORO_STATE: 'sherboard_pomodoro_state',
  YAOI_LIBRARY: 'sherboard_yaoi_library',
  APP_SETTINGS: 'sherboard_app_settings',
};

// Generic storage functions
export const storage = {
  get: <T>(key: string, defaultValue: T): T => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  },
  
  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Storage error:', error);
    }
  },
  
  remove: (key: string): void => {
    localStorage.removeItem(key);
  },
};

// Anime list functions
export const getAnimeList = (): AnimeItem[] => 
  storage.get(KEYS.ANIME_LIST, []);

export const setAnimeList = (list: AnimeItem[]): void => 
  storage.set(KEYS.ANIME_LIST, list);

export const getLastPicked = (): string | null => 
  storage.get(KEYS.LAST_PICKED, null);

export const setLastPicked = (id: string): void => 
  storage.set(KEYS.LAST_PICKED, id);

// Pomodoro functions
export const getPomodoroSettings = (): PomodoroSettings => 
  storage.get(KEYS.POMODORO_SETTINGS, defaultPomodoroSettings);

export const setPomodoroSettings = (settings: PomodoroSettings): void => 
  storage.set(KEYS.POMODORO_SETTINGS, settings);

// Yaoi library functions
export const getYaoiLibrary = (): YaoiCard[] => 
  storage.get(KEYS.YAOI_LIBRARY, []);

export const setYaoiLibrary = (library: YaoiCard[]): void => 
  storage.set(KEYS.YAOI_LIBRARY, library);

// App settings functions
export const getAppSettings = (): AppSettings => 
  storage.get(KEYS.APP_SETTINGS, defaultAppSettings);

export const setAppSettings = (settings: AppSettings): void => 
  storage.set(KEYS.APP_SETTINGS, settings);

// Export/Import functions
export const exportData = () => {
  const data = {
    animeList: getAnimeList(),
    pomodoroSettings: getPomodoroSettings(),
    yaoiLibrary: getYaoiLibrary(),
    appSettings: getAppSettings(),
    exportDate: new Date().toISOString(),
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `sherboard-backup-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

export const importData = (jsonString: string, merge: boolean = false) => {
  try {
    const data = JSON.parse(jsonString);
    
    if (merge) {
      // Merge data
      const existingAnime = getAnimeList();
      const existingYaoi = getYaoiLibrary();
      
      if (data.animeList) {
        const mergedAnime = [...existingAnime];
        data.animeList.forEach((item: AnimeItem) => {
          if (!mergedAnime.find(a => a.id === item.id)) {
            mergedAnime.push(item);
          }
        });
        setAnimeList(mergedAnime);
      }
      
      if (data.yaoiLibrary) {
        const mergedYaoi = [...existingYaoi];
        data.yaoiLibrary.forEach((card: YaoiCard) => {
          if (!mergedYaoi.find(c => c.id === card.id)) {
            mergedYaoi.push(card);
          }
        });
        setYaoiLibrary(mergedYaoi);
      }
    } else {
      // Replace data
      if (data.animeList) setAnimeList(data.animeList);
      if (data.pomodoroSettings) setPomodoroSettings(data.pomodoroSettings);
      if (data.yaoiLibrary) setYaoiLibrary(data.yaoiLibrary);
      if (data.appSettings) setAppSettings(data.appSettings);
    }
    
    return true;
  } catch (error) {
    console.error('Import error:', error);
    return false;
  }
};
