import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Printer, 
  Trash2, 
  Check, 
  RefreshCw,
  Sparkles,
  Info,
  Layers,
  Award,
  BookOpen,
  Plus,
  X,
  SlidersHorizontal,
  Pencil,
  Undo,
  Redo,
  Clock,
  Share2,
  Link2
} from 'lucide-react';
import { getUSFederalHolidays, formatDateKey } from './utils/holidays';
import { motion, AnimatePresence } from 'motion/react';

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June", 
  "July", "August", "September", "October", "November", "December"
];

const WEEKDAY_NAMES_SUN = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const WEEKDAY_NAMES_MON = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

interface CalendarTheme {
  id: string;
  name: string;
  primary: string; 
  accentText: string;
  accentBg: string;
  borderFocus: string;
  badge: string;
  banner: string;
}

const THEMES: CalendarTheme[] = [
  { 
    id: 'charcoal', 
    name: 'Charcoal', 
    primary: 'bg-zinc-800 hover:bg-zinc-900 text-white', 
    accentText: 'text-zinc-800', 
    accentBg: 'bg-zinc-50 border-zinc-200',
    borderFocus: 'focus-within:border-zinc-700',
    badge: 'bg-zinc-150 text-zinc-900 border-zinc-200',
    banner: 'bg-zinc-50 border-zinc-200 text-zinc-800'
  },
  { 
    id: 'navy', 
    name: 'Navy', 
    primary: 'bg-blue-600 hover:bg-blue-700 text-white', 
    accentText: 'text-blue-900', 
    accentBg: 'bg-blue-50 border-blue-200',
    borderFocus: 'focus-within:border-blue-600',
    badge: 'bg-blue-50 text-blue-800 border-blue-100',
    banner: 'bg-blue-50 border-blue-200 text-blue-950'
  },
  { 
    id: 'sage', 
    name: 'Sage', 
    primary: 'bg-teal-750 hover:bg-teal-800 text-white', 
    accentText: 'text-teal-900', 
    accentBg: 'bg-teal-50 border-teal-200',
    borderFocus: 'focus-within:border-teal-700',
    badge: 'bg-teal-50 text-teal-800 border-teal-100',
    banner: 'bg-teal-50 border-teal-200 text-teal-950'
  },
  { 
    id: 'rose', 
    name: 'Rose', 
    primary: 'bg-rose-700 hover:bg-rose-800 text-white', 
    accentText: 'text-rose-950', 
    accentBg: 'bg-rose-50 border-rose-200',
    borderFocus: 'focus-within:border-rose-600',
    badge: 'bg-rose-50 text-rose-800 border-rose-100',
    banner: 'bg-rose-50 border-rose-100 text-rose-950'
  },
  {
    id: 'indigo',
    name: 'Indigo',
    primary: 'bg-indigo-600 hover:bg-indigo-700 text-white',
    accentText: 'text-indigo-950',
    accentBg: 'bg-indigo-50 border-indigo-200',
    borderFocus: 'focus-within:border-indigo-600',
    badge: 'bg-indigo-50 text-indigo-800 border-indigo-100',
    banner: 'bg-indigo-50 border-indigo-100 text-indigo-950'
  },
  {
    id: 'orange',
    name: 'Orange',
    primary: 'bg-amber-600 hover:bg-amber-700 text-white',
    accentText: 'text-amber-950',
    accentBg: 'bg-amber-50 border-amber-200',
    borderFocus: 'focus-within:border-amber-600',
    badge: 'bg-amber-50 text-amber-850 border-amber-100',
    banner: 'bg-amber-50 border-amber-100 text-amber-950'
  }
];

const rowSizeStyles = {
  xs: {
    height: 'h-[24px]',
    text: 'text-[9.5px]',
    padding: 'px-1.5 py-0',
    dayMinHeight: 'min-h-[9.5rem] sm:min-h-[11.5rem]',
    emptyIndicator: 'text-[8.5px]'
  },
  sm: {
    height: 'h-[29px]',
    text: 'text-[11px]',
    padding: 'px-2 py-0.5',
    dayMinHeight: 'min-h-[11rem] sm:min-h-[14rem]',
    emptyIndicator: 'text-[9.5px]'
  },
  base: {
    height: 'h-[34px]',
    text: 'text-[12.5px]',
    padding: 'px-2.5 py-1',
    dayMinHeight: 'min-h-[13rem] sm:min-h-[17.5rem]',
    emptyIndicator: 'text-[11px]'
  }
};

const themeStyles: Record<string, {
  color: string;
  ring: string;
  bg: string;
  text: string;
  bgHover: string;
  focusBorder: string;
  textLight: string;
  accentTitleText: string;
}> = {
  charcoal: {
    color: 'bg-neutral-800 hover:bg-neutral-900',
    ring: 'ring-neutral-700',
    bg: 'bg-neutral-50 bg-neutral-100/30',
    text: 'text-neutral-800',
    bgHover: 'hover:bg-neutral-50',
    focusBorder: 'focus:border-neutral-700 focus-within:border-neutral-700',
    textLight: 'text-neutral-500',
    accentTitleText: 'text-neutral-850 decoration-neutral-200',
  },
  navy: {
    color: 'bg-blue-600 hover:bg-blue-700',
    ring: 'ring-blue-600',
    bg: 'bg-blue-50/25',
    text: 'text-blue-600',
    bgHover: 'hover:bg-blue-50',
    focusBorder: 'focus:border-blue-600 focus-within:border-blue-600',
    textLight: 'text-blue-500',
    accentTitleText: 'text-blue-650 decoration-blue-200',
  },
  sage: {
    color: 'bg-teal-700 hover:bg-teal-800',
    ring: 'ring-teal-700',
    bg: 'bg-teal-50/25',
    text: 'text-teal-700',
    bgHover: 'hover:bg-teal-55',
    focusBorder: 'focus:border-teal-700 focus-within:border-teal-700',
    textLight: 'text-teal-500',
    accentTitleText: 'text-teal-700 decoration-teal-200',
  },
  rose: {
    color: 'bg-rose-600 hover:bg-rose-700',
    ring: 'ring-rose-600',
    bg: 'bg-rose-50/25',
    text: 'text-rose-600',
    bgHover: 'hover:bg-rose-50',
    focusBorder: 'focus:border-rose-600 focus-within:border-rose-600',
    textLight: 'text-rose-500',
    accentTitleText: 'text-rose-650 decoration-rose-200',
  },
  indigo: {
    color: 'bg-indigo-600 hover:bg-indigo-700',
    ring: 'ring-indigo-600',
    bg: 'bg-indigo-50/25',
    text: 'text-indigo-600',
    bgHover: 'hover:bg-indigo-50',
    focusBorder: 'focus:border-indigo-600 focus-within:border-indigo-600',
    textLight: 'text-indigo-500',
    accentTitleText: 'text-indigo-650 decoration-indigo-200',
  },
  orange: {
    color: 'bg-amber-600 hover:bg-amber-700',
    ring: 'ring-amber-600',
    bg: 'bg-amber-50/25',
    text: 'text-amber-600',
    bgHover: 'hover:bg-amber-50',
    focusBorder: 'focus:border-amber-600 focus-within:border-amber-600',
    textLight: 'text-amber-505',
    accentTitleText: 'text-amber-700 decoration-amber-200',
  },
};

const COLOR_OPTIONS = [
  { id: 'emerald', name: 'Green', dotBg: 'bg-emerald-500' },
  { id: 'amber', name: 'Orange', dotBg: 'bg-amber-500' },
  { id: 'rose', name: 'Red', dotBg: 'bg-rose-500' },
  { id: 'sky', name: 'Blue', dotBg: 'bg-sky-500' },
  { id: 'purple', name: 'Purple', dotBg: 'bg-purple-500' },
  { id: 'indigo', name: 'Indigo', dotBg: 'bg-indigo-500' },
  { id: 'pink', name: 'Pink', dotBg: 'bg-pink-500' },
  { id: 'cyan', name: 'Cyan', dotBg: 'bg-cyan-500' },
  { id: 'teal', name: 'Teal', dotBg: 'bg-teal-500' },
  { id: 'slate', name: 'Gray', dotBg: 'bg-slate-500' },
];

const getStyleForColor = (colorName: string, isClosed: boolean) => {
  const normMap: Record<string, string> = {
    emerald: 'bg-emerald-50 text-emerald-800 border-l-2 border-emerald-500 print:bg-emerald-50/70 print:border-emerald-500',
    amber: 'bg-amber-50 text-amber-800 border-l-2 border-amber-500 print:bg-amber-50/70 print:border-amber-500',
    rose: 'bg-rose-50 text-rose-850 border-l-2 border-rose-500 print:bg-rose-50/70 print:border-rose-500',
    sky: 'bg-sky-50 text-sky-800 border-l-2 border-sky-500 print:bg-sky-50/70 print:border-sky-500',
    purple: 'bg-purple-50 text-purple-800 border-l-2 border-purple-500 print:bg-purple-50/75 print:border-purple-500',
    indigo: 'bg-indigo-50 text-indigo-800 border-l-2 border-indigo-500 print:bg-indigo-50/70 print:border-indigo-500',
    pink: 'bg-pink-50 text-pink-800 border-l-2 border-pink-500 print:bg-pink-50/70 print:border-pink-500',
    cyan: 'bg-cyan-50 text-cyan-800 border-l-2 border-cyan-500 print:bg-cyan-50/70 print:border-cyan-500',
    teal: 'bg-teal-50 text-teal-850 border-l-2 border-teal-500 print:bg-teal-50/70 print:border-teal-500',
    slate: 'bg-slate-50 text-slate-800 border-l border-slate-300 print:bg-slate-50/70 print:border-slate-300',
  };

  const closedMap: Record<string, string> = {
    emerald: 'bg-emerald-900/40 text-emerald-200 border-l-2 border-emerald-400 print:bg-emerald-50 print:text-emerald-950 print:border-emerald-500',
    amber: 'bg-amber-900/40 text-amber-200 border-l-2 border-amber-400 print:bg-amber-50 print:text-amber-950 print:border-amber-500',
    rose: 'bg-rose-900/45 text-rose-200 border-l-2 border-rose-400 print:bg-rose-50 print:text-rose-950 print:border-rose-500',
    sky: 'bg-sky-900/40 text-sky-200 border-l-2 border-sky-400 print:bg-sky-50 print:text-sky-950 print:border-sky-500',
    purple: 'bg-purple-900/40 text-purple-200 border-l-2 border-purple-400 print:bg-purple-50 print:text-purple-950 print:border-purple-500',
    indigo: 'bg-indigo-900/40 text-indigo-200 border-l-2 border-indigo-400 print:bg-indigo-50 print:text-indigo-950 print:border-indigo-500',
    pink: 'bg-pink-900/40 text-pink-200 border-l-2 border-pink-400 print:bg-pink-50 print:text-pink-950 print:border-pink-500',
    cyan: 'bg-cyan-900/40 text-cyan-200 border-l-2 border-cyan-400 print:bg-cyan-50 print:text-cyan-950 print:border-cyan-500',
    teal: 'bg-teal-900/40 text-teal-200 border-l-2 border-teal-400 print:bg-teal-50 print:text-teal-950 print:border-teal-500',
    slate: 'bg-slate-700/50 text-slate-200 border-l border-slate-500 print:bg-slate-100 print:text-slate-900 border-slate-600',
  };

  return isClosed ? (closedMap[colorName] || closedMap.slate) : (normMap[colorName] || normMap.slate);
};

function getEasterAndGoodFriday(year: number): { easter: string; goodFriday: string } {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31); // 3 = March, 4 = April
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  
  const easterDate = new Date(year, month - 1, day);
  const goodFridayDate = new Date(year, month - 1, day - 2);
  
  return {
    easter: formatDateKey(year, easterDate.getMonth(), easterDate.getDate()),
    goodFriday: formatDateKey(year, goodFridayDate.getMonth(), goodFridayDate.getDate())
  };
}

function getDayAfterThanksgiving(year: number): string {
  const nov1 = new Date(year, 10, 1);
  let thursdayCount = 0;
  let day = 1;
  while (thursdayCount < 4) {
    const d = new Date(year, 10, day);
    if (d.getDay() === 4) { // Thursday
      thursdayCount++;
      if (thursdayCount === 4) {
        const dayAfterDate = new Date(year, 10, day + 1);
        return formatDateKey(year, 10, dayAfterDate.getDate());
      }
    }
    day++;
  }
  return '';
}

export default function App() {
  // May 2026 is general target
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(4); 
  
  // Custom title to render on print
  const [calendarTitle, setCalendarTitle] = useState("PTO & Live Coverage Planner");

  // Options states
  const [showHolidays, setShowHolidays] = useState(true);
  const [weekStartsOn, setWeekStartsOn] = useState<'Sunday' | 'Monday'>('Sunday');
  const [activeThemeId, setActiveThemeId] = useState('charcoal');
  const [fontSize, setFontSize] = useState<'xs' | 'sm' | 'base'>('sm');
  
  // Saving indicators
  const [isSaving, setIsSaving] = useState(false);
  const [savedTime, setSavedTime] = useState<string | null>(null);

  // Active custom memo label being edited
  const [editingKey, setEditingKey] = useState<string | null>(null);
  
  // Custom color picker popup active state
  const [activeColorPickerKey, setActiveColorPickerKey] = useState<string | null>(null);

  // Reset confirmation state
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetInput, setResetInput] = useState("");
  const [mathChallenge, setMathChallenge] = useState({ num1: 0, num2: 0, answer: 0 });
  const [mathAnswer, setMathAnswer] = useState("");
  const [resetScope, setResetScope] = useState<'month' | 'all'>('all');

  // Dynamic custom status/memo keys
  const [statusKeys, setStatusKeys] = useState<string[]>(() => {
    const saved = localStorage.getItem('calendar_status_keys_v3');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error parsing stored status keys", e);
      }
    }
    return ['pto', 'gap', 'critical', 'covered', 'purple'];
  });

  // Password-protected Memo editing & dynamic changes
  const [isMemoUnlocked, setIsMemoUnlocked] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordTargetAction, setPasswordTargetAction] = useState<{ type: 'edit' | 'add' | 'delete'; key?: string } | null>(null);

  // Custom status/memo labels - loaded from v3 to start with clean simple labels
  const [statusLabels, setStatusLabels] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem('calendar_status_labels_v3');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error parsing stored status labels", e);
      }
    }
    return {
      pto: 'PTO',
      gap: 'GAP',
      critical: 'CRITICAL',
      covered: 'COVERED',
      purple: 'PURPLE'
    };
  });

  // Custom status/memo colors: mapping category key to Tailwind color names
  const [statusColors, setStatusColors] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem('calendar_status_colors_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error parsing stored status colors", e);
      }
    }
    return {
      pto: 'emerald',
      gap: 'amber',
      critical: 'rose',
      covered: 'sky',
      purple: 'purple'
    };
  });

  const updateStatusColor = (colorKey: string, val: string) => {
    setIsSaving(true);
    const updated = { ...statusColors, [colorKey]: val };
    setStatusColors(updated);
    localStorage.setItem('calendar_status_colors_v2', JSON.stringify(updated));
    setTimeout(() => {
      setIsSaving(false);
      const now = new Date();
      setSavedTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 205);
  };

  // Custom company holidays & closed states (with optional day classification type)
  const [companyHolidays, setCompanyHolidays] = useState<Record<string, { name: string; closed: boolean; type?: 'holiday' | 'coverage' }>>(() => {
    const saved = localStorage.getItem('calendar_company_holidays_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error parsing company holidays", e);
      }
    }
    return {};
  });

  // State for multi-row day cells (up to 4 items)
  interface CalendarRow {
    text: string;
    color: string;
  }

  const [dayRows, setDayRows] = useState<Record<string, CalendarRow[]>>(() => {
    const saved = localStorage.getItem('calendar_rows_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error parsing stored day rows", e);
      }
    }
    return {};
  });

  // Active Clicked Cell for Popover/Toolbar
  const [activeDateKey, setActiveDateKey] = useState<string | null>(null);

  // Set of holiday names that are DISABLED. (Save to localStorage so choices persist)
  const [disabledHolidays, setDisabledHolidays] = useState<string[]>(() => {
    const saved = localStorage.getItem('calendar_disabled_holidays_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error parsing disabled holidays", e);
      }
    }
    return [];
  });

  const [showHolidayListModal, setShowHolidayListModal] = useState(false);

  // Public Read-Only State & Public Sharing Customization
  const [isReadOnlyView, setIsReadOnlyView] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const isPublic = params.get('readonly') === 'true' || params.get('view') === 'public' || params.get('mode') === 'readonly';
      setIsReadOnlyView(isPublic);
    }
  }, []);

  // Undo/Redo States for dayRows
  const [pastStates, setPastStates] = useState<Record<string, CalendarRow[]>[]>([]);
  const [futureStates, setFutureStates] = useState<Record<string, CalendarRow[]>[]>([]);

  const pushToHistory = (currentState: Record<string, CalendarRow[]>) => {
    const cloned = JSON.parse(JSON.stringify(currentState));
    setPastStates(prev => [...prev.slice(-49), cloned]);
    setFutureStates([]);
  };

  const handleUndo = () => {
    if (pastStates.length === 0) return;
    const previous = pastStates[pastStates.length - 1];
    setPastStates(prev => prev.slice(0, -1));

    const currentCloned = JSON.parse(JSON.stringify(dayRows));
    setFutureStates(prev => [currentCloned, ...prev]);

    setDayRows(previous);
    localStorage.setItem('calendar_rows_v2', JSON.stringify(previous));

    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
    }, 200);
  };

  const handleRedo = () => {
    if (futureStates.length === 0) return;
    const next = futureStates[0];
    setFutureStates(prev => prev.slice(1));

    const currentCloned = JSON.parse(JSON.stringify(dayRows));
    setPastStates(prev => [...prev, currentCloned]);

    setDayRows(next);
    localStorage.setItem('calendar_rows_v2', JSON.stringify(next));

    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
    }, 200);
  };

  const toggleHolidayEnabled = (holidayName: string) => {
    let updated: string[];
    if (disabledHolidays.includes(holidayName)) {
      updated = disabledHolidays.filter(name => name !== holidayName);
    } else {
      updated = [...disabledHolidays, holidayName];
    }
    setDisabledHolidays(updated);
    localStorage.setItem('calendar_disabled_holidays_v1', JSON.stringify(updated));
  };

  const getExtendedHolidaysOfCurrentYear = () => {
    const baseFeds = getUSFederalHolidays(currentYear);
    const result: { dateKey: string; name: string; type: string }[] = [];

    Object.entries(baseFeds).forEach(([dateKey, name]) => {
      let displayName = name;
      let displayType = 'Federal Holiday';
      if (name === "Columbus Day") {
        displayName = "Indigenous Peoples Day / Columbus Day";
        displayType = "Floating Option";
      } else if (name === "Martin Luther King Jr. Day") {
        displayName = "Martin Luther King Day";
        displayType = "Floating Option";
      } else if (name === "Presidents' Day") {
        displayName = "Presidents Day";
        displayType = "Floating Option";
      } else if (name === "Juneteenth" || name === "Veterans Day") {
        displayType = "Federal Holiday";
      } else {
        // Memorial Day, Independence Day, Labor Day, Thanksgiving Day, Christmas Day, New Year's Day
        displayType = "Paid Holiday";
      }
      result.push({ dateKey, name: displayName, type: displayType });
    });

    const { easter, goodFriday } = getEasterAndGoodFriday(currentYear);
    result.push({ dateKey: goodFriday, name: 'Good Friday', type: 'Floating Option' });
    result.push({ dateKey: easter, name: 'Easter Sunday', type: 'Observance' });

    const dayAfterThg = getDayAfterThanksgiving(currentYear);
    if (dayAfterThg) {
      result.push({ dateKey: dayAfterThg, name: 'Day after Thanksgiving', type: 'Paid Holiday' });
    }

    result.push({ dateKey: formatDateKey(currentYear, 11, 24), name: 'Christmas Eve', type: 'Observance' });
    result.push({ dateKey: formatDateKey(currentYear, 11, 31), name: "New Year's Eve", type: 'Observance' });

    return result.sort((a, b) => a.dateKey.localeCompare(b.dateKey));
  };

  const masterHolidaysMap = React.useMemo(() => {
    const list = getExtendedHolidaysOfCurrentYear();
    const map: Record<string, string> = {};
    list.forEach(h => {
      if (!disabledHolidays.includes(h.name)) {
        map[h.dateKey] = h.name;
      }
    });
    return map;
  }, [currentYear, disabledHolidays]);

  const holidayCounts = React.useMemo(() => {
    const list = getExtendedHolidaysOfCurrentYear();
    const total = list.length;
    const active = list.filter(h => !disabledHolidays.includes(h.name)).length;
    return { total, active };
  }, [currentYear, disabledHolidays]);

  const updateCompanyHoliday = (dateKey: string, name: string, closed: boolean, type: 'holiday' | 'coverage' = 'holiday') => {
    setIsSaving(true);
    const updated = { ...companyHolidays };
    if (!name.trim() && !closed) {
      delete updated[dateKey];
    } else {
      updated[dateKey] = { name: name.trim(), closed, type };
    }
    setCompanyHolidays(updated);
    localStorage.setItem('calendar_company_holidays_v2', JSON.stringify(updated));
    setTimeout(() => {
      setIsSaving(false);
      const now = new Date();
      setSavedTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 205);
  };

  // Notes and legacy DayStatuses for backward migration
  const [notes, setNotes] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem('calendar_notes_v1');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return {};
  });
  const [dayStatuses, setDayStatuses] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem('calendar_statuses_v1');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return {};
  });

  // Backward Compatibility Migration once on mount
  useEffect(() => {
    const hasExistingRows = Object.keys(dayRows).length > 0;
    const hasLegacyData = Object.keys(notes).length > 0 || Object.keys(dayStatuses).length > 0;
    if (!hasExistingRows && hasLegacyData) {
      const migrated: Record<string, CalendarRow[]> = {};
      const allKeys = new Set([...Object.keys(notes), ...Object.keys(dayStatuses)]);
      
      allKeys.forEach(k => {
        const note = notes[k] || "";
        const status = dayStatuses[k] as any || 'none';
        const lines = note.split('\n').filter(line => line.trim().length > 0).slice(0, 4);
        
        const rows: CalendarRow[] = [];
        if (lines.length > 0) {
          lines.forEach((line, idx) => {
            rows.push({
              text: line,
              color: idx === 0 && ['pto', 'gap', 'critical', 'covered'].includes(status) ? status : 'none'
            });
          });
        } else if (status !== 'none') {
          rows.push({
            text: statusLabels[status] || status.toUpperCase(),
            color: status
          });
        }
        
        while (rows.length < 4) {
          rows.push({ text: "", color: 'none' });
        }
        migrated[k] = rows;
      });

      setDayRows(migrated);
      localStorage.setItem('calendar_rows_v2', JSON.stringify(migrated));
    }
  }, []);

  // Listen for Undo / Redo keyboard shortcuts globally
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target?.tagName === 'INPUT' || 
        target?.tagName === 'TEXTAREA' || 
        target?.isContentEditable
      ) {
        return;
      }
      
      const isZ = e.key?.toLowerCase() === 'z';
      const isY = e.key?.toLowerCase() === 'y';
      
      if ((e.ctrlKey || e.metaKey) && isZ) {
        e.preventDefault();
        handleUndo();
      } else if ((e.ctrlKey || e.metaKey) && isY) {
        e.preventDefault();
        handleRedo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [pastStates, futureStates, dayRows]);

  // Active theme calculation
  const activeTheme = THEMES.find(t => t.id === activeThemeId) || THEMES[0];
  const currentThemeStyle = themeStyles[activeThemeId] || themeStyles['charcoal'];

  // Dynamically calculate federal holidays for current year
  const federalHolidays = getUSFederalHolidays(currentYear);

  const updateStatusLabel = (colorKey: string, val: string) => {
    setIsSaving(true);
    const updated = { ...statusLabels, [colorKey]: val };
    setStatusLabels(updated);
    localStorage.setItem('calendar_status_labels_v3', JSON.stringify(updated));
    setTimeout(() => {
      setIsSaving(false);
      const now = new Date();
      setSavedTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 205);
  };

  const handleEditMemoClick = (key: string) => {
    if (isMemoUnlocked) {
      setEditingKey(key);
    } else {
      setPasswordTargetAction({ type: 'edit', key });
      setPasswordInput("");
      setPasswordError("");
      setShowPasswordModal(true);
    }
  };

  const handleAddMemoClick = () => {
    if (isMemoUnlocked) {
      addNewMemoLabel();
    } else {
      setPasswordTargetAction({ type: 'add' });
      setPasswordInput("");
      setPasswordError("");
      setShowPasswordModal(true);
    }
  };

  const handleDeleteMemoClick = (key: string) => {
    if (isMemoUnlocked) {
      deleteMemoLabel(key);
    } else {
      setPasswordTargetAction({ type: 'delete', key });
      setPasswordInput("");
      setPasswordError("");
      setShowPasswordModal(true);
    }
  };

  const addNewMemoLabel = () => {
    setIsSaving(true);
    const newKey = `memo_${Date.now()}`;
    const updatedKeys = [...statusKeys, newKey];
    
    const updatedLabels = { ...statusLabels, [newKey]: 'NEW MEMO' };
    const updatedColors = { ...statusColors, [newKey]: 'slate' };
    
    setStatusKeys(updatedKeys);
    setStatusLabels(updatedLabels);
    setStatusColors(updatedColors);
    
    localStorage.setItem('calendar_status_keys_v3', JSON.stringify(updatedKeys));
    localStorage.setItem('calendar_status_labels_v3', JSON.stringify(updatedLabels));
    localStorage.setItem('calendar_status_colors_v2', JSON.stringify(updatedColors));
    
    setEditingKey(newKey);
    setTimeout(() => {
      setIsSaving(false);
      const now = new Date();
      setSavedTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 205);
  };

  const deleteMemoLabel = (keyToDelete: string) => {
    setIsSaving(true);
    const updatedKeys = statusKeys.filter(k => k !== keyToDelete);
    setStatusKeys(updatedKeys);
    localStorage.setItem('calendar_status_keys_v3', JSON.stringify(updatedKeys));
    
    const updatedLabels = { ...statusLabels };
    delete updatedLabels[keyToDelete];
    setStatusLabels(updatedLabels);
    localStorage.setItem('calendar_status_labels_v3', JSON.stringify(updatedLabels));

    const updatedColors = { ...statusColors };
    delete updatedColors[keyToDelete];
    setStatusColors(updatedColors);
    localStorage.setItem('calendar_status_colors_v2', JSON.stringify(updatedColors));

    if (editingKey === keyToDelete) setEditingKey(null);
    if (activeColorPickerKey === keyToDelete) setActiveColorPickerKey(null);

    setTimeout(() => {
      setIsSaving(false);
      const now = new Date();
      setSavedTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 205);
  };

  const handlePasswordSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = passwordInput.trim().toLowerCase();
    if (
      trimmed === 'loraine' ||
      trimmed === 'andrew' ||
      trimmed.includes('loraine') ||
      trimmed.includes('velez') ||
      trimmed.includes('lugo') ||
      trimmed === 'admin'
    ) {
      setIsMemoUnlocked(true);
      setShowPasswordModal(false);
      
      if (passwordTargetAction) {
        if (passwordTargetAction.type === 'edit' && passwordTargetAction.key) {
          setEditingKey(passwordTargetAction.key);
        } else if (passwordTargetAction.type === 'add') {
          addNewMemoLabel();
        } else if (passwordTargetAction.type === 'delete' && passwordTargetAction.key) {
          deleteMemoLabel(passwordTargetAction.key);
        }
      }
      setPasswordTargetAction(null);
    } else {
      setPasswordError("Incorrect password. Try using the owner's name \"Loraine\" or \"Andrew\"!");
    }
  };

  const updateDayRow = (dateKey: string, rowIndex: number, text: string, color: string) => {
    setIsSaving(true);
    pushToHistory(dayRows);
    const existing = dayRows[dateKey] ? JSON.parse(JSON.stringify(dayRows[dateKey])) as CalendarRow[] : Array.from({ length: 4 }, () => ({ text: "", color: 'none' }));
    
    while (existing.length < 4) {
      existing.push({ text: "", color: 'none' });
    }

    existing[rowIndex] = { text, color };
    
    const updated = { ...dayRows, [dateKey]: existing };
    
    // If all completely empty, we can cleanup key
    const isAllClear = existing.every(r => !r.text.trim() && r.color === 'none');
    if (isAllClear) {
      delete updated[dateKey];
    }

    setDayRows(updated);
    localStorage.setItem('calendar_rows_v2', JSON.stringify(updated));

    setTimeout(() => {
      setIsSaving(false);
      const now = new Date();
      setSavedTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 205);
  };

  // Navigations
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      if (currentYear > 2025) {
        setCurrentMonth(11);
        setCurrentYear(prev => prev - 1);
      }
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      if (currentYear < 2035) {
        setCurrentMonth(0);
        setCurrentYear(prev => prev + 1);
      }
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  const openResetConfirm = () => {
    const n1 = Math.floor(Math.random() * 8) + 3; // 3 to 10
    const n2 = Math.floor(Math.random() * 8) + 3; // 3 to 10
    setMathChallenge({ num1: n1, num2: n2, answer: n1 + n2 });
    setResetInput("");
    setMathAnswer("");
    setShowResetConfirm(true);
  };

  // Clear current active month's notes & statuses fully
  const handleClearMonthData = () => {
    pushToHistory(dayRows);
    if (resetScope === 'all') {
      setDayRows({});
      setCompanyHolidays({});
      localStorage.setItem('calendar_rows_v2', JSON.stringify({}));
      localStorage.setItem('calendar_company_holidays_v2', JSON.stringify({}));
      // Legacy data clear
      setNotes({});
      setDayStatuses({});
      localStorage.setItem('calendar_notes_v1', JSON.stringify({}));
      localStorage.setItem('calendar_statuses_v1', JSON.stringify({}));
    } else {
      const cleanedRows = { ...dayRows };
      const daysInActiveMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
      
      for (let i = 1; i <= daysInActiveMonth; i++) {
        const k = formatDateKey(currentYear, currentMonth, i);
        delete cleanedRows[k];
      }
      
      setDayRows(cleanedRows);
      localStorage.setItem('calendar_rows_v2', JSON.stringify(cleanedRows));
    }
    setShowResetConfirm(false);
  };

  // Trigger Native print
  const handlePrint = () => {
    window.print();
  };

  // Grid calculation logic
  const buildCalendarCells = () => {
    const prevMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    const prevMonthIndex = currentMonth === 0 ? 11 : currentMonth - 1;
    const daysInPrevMonth = new Date(prevMonthYear, prevMonthIndex + 1, 0).getDate();
    const daysInActiveMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    const firstDayOfActiveMonth = new Date(currentYear, currentMonth, 1);
    let startOffset = firstDayOfActiveMonth.getDay(); // 0 is Sunday, 1 is Monday...
    
    if (weekStartsOn === 'Monday') {
      startOffset = (startOffset + 6) % 7;
    }

    const cellList: {
      dayNumber: number;
      month: number;
      year: number;
      dateKey: string;
      isCurrentMonth: boolean;
      dayOfWeekName: string;
    }[] = [];

    // Prior Month Fillers (Shaded grey)
    for (let i = startOffset - 1; i >= 0; i--) {
      const dayNum = daysInPrevMonth - i;
      const rawDate = new Date(prevMonthYear, prevMonthIndex, dayNum);
      const dateKey = formatDateKey(prevMonthYear, prevMonthIndex, dayNum);
      cellList.push({
        dayNumber: dayNum,
        month: prevMonthIndex,
        year: prevMonthYear,
        dateKey,
        isCurrentMonth: false,
        dayOfWeekName: rawDate.toLocaleDateString('en-US', { weekday: 'short' }),
      });
    }

    // Current Active Month Days
    for (let i = 1; i <= daysInActiveMonth; i++) {
      const rawDate = new Date(currentYear, currentMonth, i);
      const dateKey = formatDateKey(currentYear, currentMonth, i);
      cellList.push({
        dayNumber: i,
        month: currentMonth,
        year: currentYear,
        dateKey,
        isCurrentMonth: true,
        dayOfWeekName: rawDate.toLocaleDateString('en-US', { weekday: 'long' }),
      });
    }

    // Post Month Fillers to maintain perfect 7x6 / 7x5 layout aspect ratio grids
    const totalCurrentLength = cellList.length;
    const remainingSlots = (7 - (totalCurrentLength % 7)) % 7;
    const nextMonthYear = currentMonth === 11 ? currentYear + 1 : currentYear;
    const nextMonthIndex = currentMonth === 11 ? 0 : currentMonth + 1;

    for (let i = 1; i <= remainingSlots; i++) {
      const rawDate = new Date(nextMonthYear, nextMonthIndex, i);
      const dateKey = formatDateKey(nextMonthYear, nextMonthIndex, i);
      cellList.push({
        dayNumber: i,
        month: nextMonthIndex,
        year: nextMonthYear,
        dateKey,
        isCurrentMonth: false,
        dayOfWeekName: rawDate.toLocaleDateString('en-US', { weekday: 'short' }),
      });
    }

    return cellList;
  };

  // Dynamic next-month variables for the top-right print mini-calendar preview
  const getNextMonthMiniData = () => {
    let nextM = currentMonth + 1;
    let nextY = currentYear;
    if (nextM > 11) {
      nextM = 0;
      nextY += 1;
    }
    const daysInMonth = new Date(nextY, nextM + 1, 0).getDate();
    const firstDayIndex = new Date(nextY, nextM, 1).getDay(); // 0 is Sunday
    
    const cells: (number | null)[] = [];
    for (let i = 0; i < firstDayIndex; i++) {
      cells.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      cells.push(i);
    }
    return { monthName: MONTH_NAMES[nextM], year: nextY, cells };
  };

  const miniCalendarData = getNextMonthMiniData();
  const calendarDays = buildCalendarCells();
  const weekDays = weekStartsOn === 'Sunday' ? WEEKDAY_NAMES_SUN : WEEKDAY_NAMES_MON;

  // Calculates stats of active month planning parameters
  const getCoverageStats = () => {
    let ptoCount = 0;
    let gapCount = 0;
    let criticalCount = 0;
    let coveredCount = 0;
    let purpleCount = 0;
    
    // Scan active month days
    const daysInActiveMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    for (let i = 1; i <= daysInActiveMonth; i++) {
      const k = formatDateKey(currentYear, currentMonth, i);
      const rows = dayRows[k] || [];
      rows.forEach(row => {
        if (row.color === 'pto') ptoCount++;
        else if (row.color === 'gap') gapCount++;
        else if (row.color === 'critical') criticalCount++;
        else if (row.color === 'covered') coveredCount++;
        else if (row.color === 'purple') purpleCount++;
      });
    }
    return { ptoCount, gapCount, criticalCount, coveredCount, purpleCount };
  };

  const stats = getCoverageStats();

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0f172a] font-sans selection:bg-indigo-100 antialiased print:bg-white print:text-black">
      
      {/* Upper header section - Hidden during PDF print */}
      <header className="print:hidden bg-white border-b border-[#e2e8f0] sticky top-0 z-20 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.02)]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#f1f5f9] rounded-xl text-slate-800">
              <CalendarIcon id="header_icon" className={`w-6 h-6 stroke-[2.2px] ${currentThemeStyle.text}`} />
            </div>
             <div className="title-group">
              <h1 className="text-[26px] font-medium tracking-tight text-[#0f172a] font-display leading-tight flex flex-wrap items-center gap-4">
                <span>{MONTH_NAMES[currentMonth]} {currentYear}</span>
                {!isReadOnlyView && (
                  <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 p-0.5 rounded-xl">
                    <button
                      type="button"
                      onClick={handleUndo}
                      disabled={pastStates.length === 0}
                      className={`p-1.5 rounded-lg border-transparent transition-all ${
                        pastStates.length === 0
                          ? 'text-slate-300 cursor-not-allowed opacity-40'
                          : 'text-slate-600 bg-white shadow-3xs cursor-pointer active:scale-95 hover:text-slate-900 hover:shadow-xs'
                      }`}
                      title="Undo (Ctrl+Z)"
                    >
                      <Undo className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={handleRedo}
                      disabled={futureStates.length === 0}
                      className={`p-1.5 rounded-lg border-transparent transition-all ${
                        futureStates.length === 0
                          ? 'text-slate-300 cursor-not-allowed opacity-40'
                          : 'text-slate-600 bg-white shadow-3xs cursor-pointer active:scale-95 hover:text-slate-900 hover:shadow-xs'
                      }`}
                      title="Redo (Ctrl+Y)"
                    >
                      <Redo className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </h1>
              <p className="text-sm text-[#64748b] font-semibold mt-0.5">
                {calendarTitle || "Productivity Planner & Federal Holidays"}
              </p>
              
              {/* Publicly Visible Links requested by the user */}
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <a
                  href="https://clock.payrollservers.us/#/clock/web/login"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 bg-slate-55 bg-[#f1f5f9]/80 hover:bg-[#cbd5e1]/50 border border-slate-200 text-slate-700 hover:text-slate-900 px-3 py-1 rounded-full text-[11px] font-bold transition-all shadow-3xs"
                  title="Open Employee Time Clock in a new tab"
                >
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>Employee Time Clock</span>
                </a>
                <a
                  href="chrome-extension://efaidnbmnnnibpcajpcglclefindmkaj/https://drive.usercontent.google.com/download?id=1rhIiyrdYWVvk-zDir-AHS5FAYMx9V5eS&authuser=3&acrobatPromotionSource=gdrive_chrome-list"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 bg-[#f1f5f9]/80 hover:bg-[#cbd5e1]/50 border border-slate-200 text-slate-700 hover:text-slate-900 px-3 py-1 rounded-full text-[11px] font-bold transition-all shadow-3xs"
                  title="Open Employee Handbook in a new tab"
                >
                  <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                  <span>Employee Handbook</span>
                </a>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            {/* Auto-saved indicator - Hidden in read-only view */}
            {!isReadOnlyView && (
              <div className="text-right hidden xl:block">
                {isSaving ? (
                  <span className="text-xs font-semibold text-[#64748b] flex items-center gap-1.5">
                    <RefreshCw className={`w-3.5 h-3.5 animate-spin ${currentThemeStyle.text}`} /> Syncing changes...
                  </span>
                ) : savedTime ? (
                  <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" /> Synced: {savedTime}
                  </span>
                ) : (
                  <span className="text-xs text-slate-400 font-semibold">Offline cache hot</span>
                )}
              </div>
            )}

            {/* Public View Status Indicator */}
            {isReadOnlyView && (
              <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 border border-emerald-150 rounded-xl text-emerald-700 text-xs font-bold shadow-3xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Read-Only Guest Mode</span>
              </div>
            )}

            {/* Share Public Link Button */}
            {!isReadOnlyView && (
              <button
                type="button"
                onClick={() => setShowShareModal(true)}
                className="flex items-center gap-2 px-3.5 py-2.5 bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 hover:border-indigo-200 rounded-xl text-indigo-700 transition-all cursor-pointer text-xs font-bold shadow-3xs"
                title="Generate read-only calendar link for employees"
              >
                <Share2 className="w-4 h-4 text-indigo-500" />
                <span>Share Public Link</span>
              </button>
            )}

            {/* Holiday Switch - Replaced with clickable popup list */}
            <button
              type="button"
              onClick={() => setShowHolidayListModal(true)}
              className="flex items-center gap-2 px-3.5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 rounded-xl text-[#334155] transition-all cursor-pointer text-xs font-bold shadow-3xs"
              title="Configure observable bank and federal holidays list"
            >
              <Award className="w-4 h-4 text-amber-500" />
              <span>Holidays</span>
              <span className="bg-slate-100 text-slate-600 rounded-md px-1.5 py-0.5 text-[10px] font-bold">
                {holidayCounts.active}/{holidayCounts.total}
              </span>
            </button>

            {/* Seamless Print triggers */}
            <button
              onClick={handlePrint}
              id="export_pdf_button"
              className={`hover:opacity-90 text-white font-bold text-sm px-5 py-2.5 rounded-[10px] shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1)] transition-all cursor-pointer flex items-center gap-2 shrink-0 ${currentThemeStyle.color}`}
            >
              <Printer className="w-4 h-4" />
              <span>Export PDF / Print</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Interactive Workspace Area */}
      <main className="max-w-7xl mx-auto px-6 py-6 print:p-0">
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 print:block">
          
          {/* Calendar Sidebar Settings Desk - Hidden on PDF Print */}
          {!isReadOnlyView && (
            <section id="sidebar_settings" className="print:hidden lg:col-span-1 space-y-5">
            
            {/* Month & Year Navigation Card */}
            <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.02)] space-y-4">
              <h2 className="text-xs font-medium tracking-wider uppercase text-[#94a3b8] font-display">
                Planner Navigation
              </h2>
              
              <div className="flex items-center justify-between gap-2">
                <button
                  onClick={handlePrevMonth}
                  className="p-2 bg-[#f1f5f9] hover:bg-[#e2e8f0] rounded-xl transition-all cursor-pointer text-slate-700"
                  title="Previous Month"
                >
                  <ChevronLeft className="w-4.5 h-4.5" />
                </button>
                <div className="text-center">
                  <span className="block font-black text-[#1e293b] font-display text-sm tracking-tight">
                    {MONTH_NAMES[currentMonth]}
                  </span>
                  <span className="block text-[11px] font-mono text-[#64748b] font-extrabold mt-0.5">
                    {currentYear}
                  </span>
                </div>
                <button
                  onClick={handleNextMonth}
                  className="p-2 bg-[#f1f5f9] hover:bg-[#e2e8f0] rounded-xl transition-all cursor-pointer text-slate-700"
                  title="Next Month"
                >
                  <ChevronRight className="w-4.5 h-4.5" />
                </button>
              </div>

              {/* Precise dropdown selects */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-50">
                <div>
                  <label className="block text-[10px] font-bold text-[#94a3b8] uppercase mb-1">Month</label>
                  <select
                    value={currentMonth}
                    onChange={(e) => setCurrentMonth(parseInt(e.target.value))}
                    className="w-full text-xs font-bold bg-[#f8fafc] border border-[#e2e8f0] cursor-pointer rounded-lg p-2 focus:outline-hidden focus:border-indigo-500 text-slate-700"
                  >
                    {MONTH_NAMES.map((m, i) => (
                      <option key={m} value={i}>{m}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#94a3b8] uppercase mb-1">Year</label>
                  <select
                    value={currentYear}
                    onChange={(e) => setCurrentYear(parseInt(e.target.value))}
                    className="w-full text-xs font-bold bg-[#f8fafc] border border-[#e2e8f0] cursor-pointer rounded-lg p-2 focus:outline-hidden focus:border-indigo-500 text-slate-700"
                  >
                    {Array.from({ length: 11 }, (_, i) => 2025 + i).map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            {/* Custom Label Text Fields with Dynamic Colors */}
            <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.03)] space-y-4">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-xs font-medium tracking-wider uppercase text-[#94a3b8] font-display flex items-center gap-1.5">
                  <SlidersHorizontal className={`w-3.5 h-3.5 ${currentThemeStyle.text}`} />
                  <span>Custom Memo Labels</span>
                </h2>
                <button
                  type="button"
                  onClick={handleAddMemoClick}
                  className="p-1 text-slate-500 hover:text-slate-850 hover:bg-slate-50 border border-slate-200/80 rounded-lg transition-all cursor-pointer flex items-center justify-center w-7 h-7"
                  title="Add Custom Memo Label"
                >
                  <Plus className="w-4 h-4 text-emerald-600" />
                </button>
              </div>
              <div className="space-y-3">
                {statusKeys.map((key) => {
                  const currentLabel = statusLabels[key];
                  const currentColor = statusColors[key] || 'slate';
                  const activeColorOpt = COLOR_OPTIONS.find(o => o.id === currentColor) || COLOR_OPTIONS[0];
                  const isEditing = editingKey === key;
                  
                  return (
                    <div 
                      key={`param_label_${key}`} 
                      className="relative flex items-center justify-between gap-3 py-1.5 px-0.5 border-b border-slate-50 last:border-b-0 last:pb-0 group"
                    >
                      {/* Color Dot representing selected and acting as popover trigger button */}
                      <div className="relative shrink-0">
                        <button
                          type="button"
                          onClick={() => setActiveColorPickerKey(activeColorPickerKey === key ? null : key)}
                          className={`w-6 h-6 rounded-full cursor-pointer transition-all hover:scale-110 flex items-center justify-center border-2 border-white shadow-xs hover:shadow-xs ${activeColorOpt.dotBg}`}
                          title="Change Color Picker"
                        >
                          <span className="text-[7.5px] text-white/90 select-none font-sans">▼</span>
                        </button>

                        {/* Interactive Absolute Color Picker Popover */}
                        {activeColorPickerKey === key && (
                          <>
                            {/* Dismiss Backdrop Overlay */}
                            <div 
                              className="fixed inset-0 z-30" 
                              onClick={() => setActiveColorPickerKey(null)} 
                            />
                            {/* Color Picker Bubble */}
                            <div className="absolute left-0 mt-2 p-3 bg-white border border-slate-200 rounded-xl shadow-lg z-40 w-44 animate-fadeIn">
                              <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 select-none">
                                Color Style ({key.toUpperCase()})
                              </div>
                              <div className="grid grid-cols-5 gap-2">
                                {COLOR_OPTIONS.map((opt) => (
                                  <button
                                    key={`picker_dot_${key}_${opt.id}`}
                                    type="button"
                                    onClick={() => {
                                      updateStatusColor(key, opt.id);
                                      setActiveColorPickerKey(null);
                                    }}
                                    className={`w-5.5 h-5.5 rounded-full cursor-pointer transition-all hover:scale-120 ${opt.dotBg} border border-slate-100 ${
                                      currentColor === opt.id 
                                        ? 'ring-2 ring-slate-800 ring-offset-1 scale-110' 
                                        : 'opacity-85 hover:opacity-100'
                                    }`}
                                    title={opt.name}
                                  />
                                ))}
                              </div>
                            </div>
                          </>
                        )}
                      </div>

                      {/* Display & Text Editing Block */}
                      <div className="flex-1 flex items-center justify-between min-w-0">
                        {isEditing ? (
                          <input
                            type="text"
                            value={currentLabel}
                            onChange={(e) => updateStatusLabel(key, e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                setEditingKey(null);
                              }
                            }}
                            onBlur={() => setEditingKey(null)}
                            maxLength={15}
                            autoFocus
                            className={`w-full text-xs font-bold bg-[#f1f5f9]/80 border border-[#cbd5e1] rounded-lg px-2 py-1 focus:outline-hidden ${currentThemeStyle.focusBorder} text-slate-800`}
                          />
                        ) : (
                          <span 
                            onClick={() => handleEditMemoClick(key)}
                            className="text-xs font-bold text-slate-700 truncate cursor-pointer select-none hover:text-slate-900 py-1 flex-1"
                            title="Click to edit label name"
                          >
                            {currentLabel || `Empty (${key.toUpperCase()})`}
                          </span>
                        )}

                        <div className="flex items-center gap-1 shrink-0">
                          {/* Save / Edit Control Button */}
                          <button
                            type="button"
                            onClick={() => {
                              if (isEditing) {
                                setEditingKey(null);
                              } else {
                                handleEditMemoClick(key);
                              }
                            }}
                            className={`p-1 rounded-md transition-all cursor-pointer ${
                              isEditing 
                                ? 'bg-slate-900 text-white hover:bg-slate-800 shadow-xs' 
                                : 'opacity-0 group-hover:opacity-100 text-slate-400 hover:text-slate-850 hover:bg-slate-50 border border-slate-200/40'
                            }`}
                            title={isEditing ? "Save Text" : "Edit Text"}
                          >
                            {isEditing ? (
                              <Check className="w-3.5 h-3.5" />
                            ) : (
                              <Pencil className="w-3.5 h-3.5" />
                            )}
                          </button>

                          {/* Delete Memo Label Button */}
                          {!isEditing && (
                            <button
                              type="button"
                              onClick={() => handleDeleteMemoClick(key)}
                              className="p-1 rounded-md transition-all cursor-pointer opacity-0 group-hover:opacity-100 text-slate-350 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100"
                              title="Delete Label"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Accent Color Themes - Horizontal Dot Carousel slider (names/text removed) */}
            <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.03)] space-y-3">
              <h2 className="text-xs font-medium tracking-wider uppercase text-[#94a3b8] font-display">
                Theme Accent
              </h2>
              
              {/* Converted to exact dot carousel as requested */}
              <div className="flex items-center gap-2.5 overflow-x-auto py-1 px-0.5 scrollbar-thin select-none">
                {THEMES.map((theme) => {
                  const themeDotColors: Record<string, string> = {
                    charcoal: 'bg-neutral-800 border-neutral-700',
                    navy: 'bg-blue-600 border-blue-500',
                    sage: 'bg-teal-700 border-teal-600',
                    rose: 'bg-rose-600 border-rose-500',
                    indigo: 'bg-indigo-600 border-indigo-500',
                    orange: 'bg-amber-600 border-amber-500',
                  };
                  const colorBadgeClass = themeDotColors[theme.id] || 'bg-zinc-800';
                  const isThemeSelected = activeThemeId === theme.id;
                  const dotColorTheme = themeStyles[theme.id] || themeStyles['charcoal'];
                  
                  return (
                    <button
                      key={theme.id}
                      onClick={() => setActiveThemeId(theme.id)}
                      type="button"
                      className={`w-7 h-7 rounded-full shrink-0 transition-transform cursor-pointer relative ${colorBadgeClass} ${
                        isThemeSelected 
                          ? `ring-4 ring-offset-1 ${dotColorTheme.ring} scale-110 shadow-xs` 
                          : 'hover:scale-105 border border-slate-200'
                      }`}
                      title={`${theme.name} Theme`}
                    >
                      {isThemeSelected && (
                        <span className="absolute inset-0 flex items-center justify-center text-white text-[11px] font-black">
                          ✓
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Extra Settings Desk */}
            <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.03)] space-y-5">
              <h2 className="text-xs font-medium tracking-wider uppercase text-[#94a3b8] font-display">
                Settings
              </h2>

              {/* Printable calendar subtitle */}
              <div>
                <label className="block text-xs font-bold text-[#334155] mb-1.5">
                  Printable Title/Details
                </label>
                <input
                  type="text"
                  maxLength={50}
                  value={calendarTitle}
                  onChange={(e) => setCalendarTitle(e.target.value)}
                  placeholder="e.g. PTO & Team Coverage Board"
                  className={`w-full text-xs bg-[#f8fafc] border border-[#e2e8f0] rounded-lg p-2.5 outline-hidden ${currentThemeStyle.focusBorder} font-semibold`}
                />
              </div>

              {/* Weekday arrangement arrangement */}
              <div>
                <label className="block text-xs font-bold text-[#334155] mb-2">
                  First Day of Week
                </label>
                <div className="grid grid-cols-2 gap-1 bg-[#f1f5f9] p-1 rounded-xl">
                  <button
                    onClick={() => setWeekStartsOn('Sunday')}
                    className={`text-xs font-bold py-1.5 rounded-lg transition-all cursor-pointer ${
                      weekStartsOn === 'Sunday'
                        ? 'bg-white text-[#1e293b] shadow-xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Sunday
                  </button>
                  <button
                    onClick={() => setWeekStartsOn('Monday')}
                    className={`text-xs font-bold py-1.5 rounded-lg transition-all cursor-pointer ${
                      weekStartsOn === 'Monday'
                        ? 'bg-white text-[#1e293b] shadow-xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Monday
                  </button>
                </div>
              </div>

              {/* Text Size parameters */}
              <div>
                <label className="block text-xs font-bold text-[#334155] mb-2">
                  Daily Notes Font Size
                </label>
                <div className="grid grid-cols-3 gap-1 bg-[#f1f5f9] p-1 rounded-xl text-center">
                  {(['xs', 'sm', 'base'] as const).map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setFontSize(sz)}
                      className={`text-xs font-extrabold py-1.5 rounded-lg uppercase tracking-wider transition-all cursor-pointer ${
                        fontSize === sz
                          ? 'bg-white text-[#1e293b] shadow-xs font-black'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clear active boards */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-end">
                <button
                  type="button"
                  onClick={openResetConfirm}
                  className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10.5px] font-bold text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
                  title="Reset current month notes"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              </div>

            </div>

            {/* Next Month Quick-View mini-calendar preview card inside sidebar */}
            <div className="bg-white border border-[#e2e8f0] rounded-2xl p-4.5 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.03)] space-y-3">
              <h2 className="text-xs font-medium tracking-wider uppercase text-[#94a3b8] font-display">
                Next Month Preview
              </h2>
              <div className="bg-slate-50 rounded-xl p-3 flex flex-col items-center">
                <span className="text-[11px] font-black text-[#1e293b] uppercase tracking-wider mb-2 font-display">
                  {miniCalendarData.monthName} {miniCalendarData.year}
                </span>
                <div className="grid grid-cols-7 gap-1.5 text-[9px] font-black text-[#94a3b8] text-center border-b border-slate-200/60 pb-1 w-full">
                  {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                    <div key={`msb_${i}`}>{d}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1.5 text-[9px] font-extrabold text-slate-700 text-center font-mono pt-1.5 w-full">
                  {miniCalendarData.cells.map((cell, idx) => (
                    <div 
                      key={`minc_side_${idx}`}
                      className={`w-4 h-3.5 flex items-center justify-center rounded-sm ${
                        cell === null ? 'invisible' : 'bg-white/40 border border-transparent'
                      }`}
                    >
                      {cell}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-[#f1f5f9] rounded-2xl p-4 border border-[#e2e8f0] flex gap-3 text-[#64748b]">
              <Info className="w-4 h-4 text-[#94a3b8] shrink-0 mt-0.5" />
              <div className="text-[11px] leading-relaxed font-semibold">
                Your private workspace auto-saves data on edit. No network connectivity is required.
              </div>
            </div>

          </section>
          )}

          {/* Calendar Master Canvas */}
          <section className={`${isReadOnlyView ? 'lg:col-span-4' : 'lg:col-span-3'} bg-white border border-[#e2e8f0] rounded-2xl shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] overflow-hidden print:border-none print:shadow-none print:m-0 print:p-0 print-calendar-container`}>
            
            {/* Header Title block - Displays beautifully and matches the timeanddate layout */}
            <div className="bg-white p-6 border-b border-[#e2e8f0] print:py-4 print:px-0 flex items-center justify-between gap-4 print-calendar-header">
              <div className="flex-1">
                <h2 className="text-3xl font-medium font-display text-[#0f172a] tracking-tight flex flex-wrap items-center gap-3 print:text-3.5xl">
                  <span>{MONTH_NAMES[currentMonth]} {currentYear}</span>
                  {isReadOnlyView && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-50 border border-emerald-200 rounded-md text-emerald-800 text-[10px] font-bold uppercase tracking-wider print:hidden shadow-3xs">
                      Read-Only View
                    </span>
                  )}
                </h2>
                <div className="text-[11px] text-[#94a3b8] font-bold uppercase tracking-wider font-display pr-1 mt-1 font-mono">
                  {calendarTitle || "PTO & COVERAGE RECORDER"}
                </div>
                <div className={`text-[10px] ${currentThemeStyle.text} font-bold uppercase tracking-wider mt-1 hidden print:block font-mono`}>
                  Federal Holidays: {showHolidays ? "ENABLED" : "MUTED"}
                </div>

                {/* Publicly Visible Links across from Month/Year in the Canvas itself */}
                <div className="flex flex-wrap items-center gap-2 mt-2.5 print:hidden">
                  <a
                    href="https://clock.payrollservers.us/#/clock/web/login"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 bg-[#f1f5f9]/80 hover:bg-[#cbd5e1]/50 border border-slate-200 text-slate-700 hover:text-slate-900 px-2.5 py-1 rounded-full text-[10.5px] font-bold transition-all shadow-3xs"
                    title="Open Employee Time Clock in a new tab"
                  >
                    <Clock className="w-3 h-3 text-slate-500" />
                    <span>Time Clock</span>
                  </a>
                  <a
                    href="chrome-extension://efaidnbmnnnibpcajpcglclefindmkaj/https://drive.usercontent.google.com/download?id=1rhIiyrdYWVvk-zDir-AHS5FAYMx9V5eS&authuser=3&acrobatPromotionSource=gdrive_chrome-list"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 bg-[#f1f5f9]/80 hover:bg-[#cbd5e1]/50 border border-slate-200 text-slate-700 hover:text-slate-900 px-2.5 py-1 rounded-full text-[10.5px] font-bold transition-all shadow-3xs"
                    title="Open Employee Handbook in a new tab"
                  >
                    <BookOpen className="w-3 h-3 text-slate-500" />
                    <span>Handbook</span>
                  </a>
                </div>
              </div>

              {/* Floating Miniature Next Month block matching screenshot EXACTLY */}
              <div className="hidden print:block shrink-0 border border-slate-300 bg-white p-3 rounded-lg text-center" style={{ width: '135px' }}>
                <div className="text-[9px] font-black text-slate-900 uppercase tracking-widest leading-none mb-1 font-mono">
                  {miniCalendarData.monthName} {miniCalendarData.year}
                </div>
                <div className="grid grid-cols-7 text-[7px] font-black text-slate-800 border-b border-slate-200 pb-0.5 mb-1">
                  {["S", "M", "T", "W", "T", "F", "S"].map((d, id) => (
                    <div key={id} className="w-3.5 h-3 flex items-center justify-center">{d}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 text-[7px] font-bold text-slate-700 font-mono">
                  {miniCalendarData.cells.map((cell, id) => (
                    <div key={id} className={`w-3.5 h-2.5 flex items-center justify-center ${cell === null ? 'invisible' : ''}`}>
                      {cell}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Weeks displays - Day Columns header */}
            <div className="grid grid-cols-7 bg-[#f1f5f9] border-b border-[#e2e8f0] print-calendar-weeks">
              {weekDays.map((day) => (
                <div 
                  key={day} 
                  className="py-3 text-center text-[11px] font-black text-[#94a3b8] uppercase tracking-wider print:text-[#0f172a] py-1.5"
                >
                  <span className="hidden md:inline">{day}</span>
                  <span className="inline md:hidden">{day.substring(0, 3)}</span>
                </div>
              ))}
            </div>

            {/* Days Cells Grid */}
            <div className="grid grid-cols-7 bg-[#e2e8f0] gap-[1px] print-calendar-grid">
              
              {calendarDays.map((day, index) => {
                const customHoliday = companyHolidays[day.dateKey];
                const holidayName = customHoliday?.name || masterHolidaysMap[day.dateKey] || '';
                const isClosed = customHoliday?.closed || false;
                const activeHoliday = holidayName;

                const rows = dayRows[day.dateKey] || [
                  { text: "", color: 'none' as const },
                  { text: "", color: 'none' as const },
                  { text: "", color: 'none' as const },
                  { text: "", color: 'none' as const }
                ];

                // Detect Saturday and Sunday to shade weekend columns elegantly
                const innerDateObj = new Date(day.year, day.month, day.dayNumber);
                const isWeekend = innerDateObj.getDay() === 0 || innerDateObj.getDay() === 6;

                // Simple white or subtle weekend background
                let bgStyle = 'bg-white hover:bg-slate-50 text-[#0f172a]';
                if (isClosed) {
                  bgStyle = 'bg-slate-700 text-slate-100 hover:bg-slate-650 border-slate-600';
                } else if (!day.isCurrentMonth) {
                  bgStyle = 'bg-[#fafafa] text-slate-400 hover:bg-slate-100/60 print:text-slate-400';
                } else if (isWeekend) {
                  bgStyle = 'bg-slate-50/70 hover:bg-slate-100 text-slate-800';
                }

                const isActiveDayEditing = activeDateKey === day.dateKey;
                const printBgStyle = isClosed
                  ? 'print:bg-slate-700 print:text-slate-100 print:border-slate-600'
                  : 'print:bg-white print:border-slate-200';

                return (
                  <div
                    key={`${day.dateKey}_${index}`}
                    onClick={() => setActiveDateKey(day.dateKey)}
                    className={`${rowSizeStyles[fontSize].dayMinHeight} p-2 sm:p-2.5 leading-tight flex flex-col justify-between transition-all group relative cursor-pointer border border-transparent ${bgStyle} ${
                      isActiveDayEditing ? `ring-2 ${currentThemeStyle.ring} ${currentThemeStyle.bg} z-10` : ''
                    } print:border ${printBgStyle} print-calendar-day`}
                  >
                    {/* Grid Day Indicators: weekday + day number */}
                    <div className="flex items-start justify-between gap-1 select-none">
                      <div className="flex flex-col items-start">
                        <span className={`text-[8.5px] font-black uppercase tracking-wider ${
                          isClosed ? 'text-slate-400 print:text-slate-500' : 'text-[#94a3b8] print:text-slate-700'
                        }`}>
                          {day.dayOfWeekName.substring(0, 3)}
                        </span>
                        
                        <span className={`text-[15px] sm:text-[16.5px] font-black sm:mt-0.5 font-display ${
                          isClosed 
                            ? 'text-white print:text-white' 
                            : day.isCurrentMonth ? 'text-[#1e293b]' : 'text-slate-400/80'
                        }`}>
                          {day.dayNumber}
                        </span>
                      </div>

                      {/* Display a small label badge if any rows contain colors for overview */}
                      <div className="flex gap-0.5 flex-wrap justify-end font-semibold">
                        {rows.some(r => r.color !== 'none') && (
                          <div className="flex -space-x-1 select-none">
                            {Array.from(new Set(rows.map(r => r.color).filter(c => c !== 'none'))).map((clrHex) => {
                              const dynamicColorName = statusColors[clrHex] || 'slate';
                              const activeColorOpt = COLOR_OPTIONS.find(o => o.id === dynamicColorName) || COLOR_OPTIONS[0];
                              return (
                                <span 
                                  key={clrHex} 
                                  className={`w-2.5 h-2.5 rounded-full border border-white shadow-xs ${activeColorOpt.dotBg}`} 
                                />
                              );
                            })}
                          </div>
                        )}

                        {/* Holiday or Coverage tag display inside cell */}
                        {holidayName && (
                          <div 
                            className={`text-[8.5px] sm:text-[9.5px] font-black px-1.5 py-0.5 rounded-sm border max-w-[65px] sm:max-w-[75px] truncate select-none leading-none ${
                              isClosed
                                ? (customHoliday?.type === 'coverage' 
                                    ? 'bg-amber-950/50 text-amber-200 border-amber-800/60'
                                    : 'bg-rose-950/60 text-rose-250 border-rose-800/60')
                                : (customHoliday?.type === 'coverage'
                                    ? 'bg-amber-50 text-amber-850 border-amber-200'
                                    : 'bg-blue-50 text-blue-700 border-blue-100')
                            }`}
                            title={holidayName}
                          >
                            <span>{customHoliday?.type === 'coverage' ? '🛡️' : '★'}</span>{' '}
                            <span>{holidayName}</span>
                          </div>
                        )}
                        {isClosed && !holidayName && (
                          <div className="bg-rose-950/60 text-rose-250 border border-rose-800/60 text-[8.5px] sm:text-[9.5px] font-black px-1.5 py-0.5 rounded-sm leading-none">
                            CLOSED
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Content area: 4 lines/rows - highly optimized and readable with Dynamic Colors */}
                    <div className="mt-2 flex-1 flex flex-col gap-0.5 sm:gap-1">
                      {rows.slice(0, 4).map((row, rIdx) => {
                        let rBg = '';
                        if (row.color && row.color !== 'none') {
                          const chosenColor = statusColors[row.color] || 'slate';
                          rBg = getStyleForColor(chosenColor, isClosed);
                        } else if (row.text.trim()) {
                          rBg = isClosed 
                            ? 'bg-slate-600/30 text-slate-100 border-l border-slate-500/50 print:bg-slate-100 print:text-slate-900 border-slate-600'
                            : 'bg-slate-50/55 text-slate-800 border-l border-slate-200';
                        } else {
                          rBg = isClosed ? 'bg-transparent border-none text-slate-400/30' : 'bg-transparent border-none text-slate-300';
                        }

                        return (
                          <div 
                            key={`cell_${day.dateKey}_r_${rIdx}`} 
                            className={`${rowSizeStyles[fontSize].height} ${rowSizeStyles[fontSize].padding} ${rowSizeStyles[fontSize].text} font-semibold rounded-md flex items-center justify-between transition-all truncate ${rBg}`}
                          >
                            <span className="truncate">
                              {row.text || <span className={`text-slate-300/40 ${rowSizeStyles[fontSize].emptyIndicator} font-normal group-hover:text-slate-300 print:hidden`}>—</span>}
                            </span>
                            
                            {row.color !== 'none' && (
                              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                                (() => {
                                  const clName = statusColors[row.color] || 'slate';
                                  const opt = COLOR_OPTIONS.find(o => o.id === clName) || COLOR_OPTIONS[0];
                                  return opt.dotBg;
                                })()
                              }`} />
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Quick indicator when edited */}
                    <div className={`absolute top-1 right-2 w-1.5 h-1.5 ${currentThemeStyle.color} rounded-full opacity-0 group-hover:opacity-100 print:hidden transition-opacity`} />
                  </div>
                );
              })}

            </div>

            {/* Bottom mini disclaimer footer */}
            <footer className="bg-[#f8fafc] py-4 px-6 border-t border-[#e2e8f0] flex items-center justify-between text-[#cbd5e1] font-mono text-[9px] print:hidden">
              <div>System Date Engine: Active ISO 8601</div>
              <div>Free Federal Calendar Tool • Print/PDF Optimised</div>
            </footer>

          </section>

        </div>

      </main>

      {/* Dynamic Pop-up Toolbar Modal for Row Editing - Triggers on Cell Click */}
      <AnimatePresence>
        {activeDateKey && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 print:hidden">
            {/* Backdrop Blur overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveDateKey(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            {/* Modal Dialog Content Container */}
            <motion.div
              initial={{ scale: 0.95, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 15, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="relative bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <header className="p-5 border-b border-slate-150 flex items-center justify-between bg-slate-50/50">
                <div>
                  <h3 className="text-base font-medium text-[#0f172a] font-display flex items-center gap-2">
                    <SlidersHorizontal className={`w-4 h-4 ${currentThemeStyle.text}`} />
                    <span>Day Planner Toolbar</span>
                  </h3>
                  <p className="text-xs text-slate-500 font-bold mt-0.5">
                    Configuring lines for <span className={`underline ${currentThemeStyle.text}`}>
                      {(() => {
                        if (!activeDateKey) return "";
                        const parts = activeDateKey.split('-');
                        if (parts.length === 3) {
                          const year = parseInt(parts[0]);
                          const month = parseInt(parts[1]);
                          const day = parseInt(parts[2]);
                          return `${MONTH_NAMES[month]} ${day}, ${year}`;
                        }
                        return activeDateKey;
                      })()}
                    </span>
                  </p>
                </div>
                <button
                  onClick={() => setActiveDateKey(null)}
                  className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  title="Close Toolbar"
                >
                  <X className="w-5 h-5" />
                </button>
              </header>

              {/* Body Content - List up to 4 Lines */}
              <div className="p-5 overflow-y-auto space-y-4">
                 {(() => {
                   const currentHoliday = companyHolidays[activeDateKey] || { name: "", closed: false, type: 'holiday' as const };
                   const currentHolidayType = currentHoliday.type || 'holiday';
                   const fedHolidayName = masterHolidaysMap[activeDateKey] || "";
                   
                   return (
                     <div className="p-4 rounded-xl border border-dashed border-slate-200 bg-slate-50/40 space-y-4 font-semibold">
                       <div className="flex items-center justify-between">
                         <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                           <Award className={`w-4 h-4 ${currentThemeStyle.text}`} />
                           <span>Special Day Setup</span>
                         </div>
                         
                         {fedHolidayName && !currentHoliday.name && (
                           <span className="text-[9.5px] font-extrabold bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded-sm border border-blue-100">
                             Federal: {fedHolidayName}
                           </span>
                         )}
                       </div>
                       
                       {/* Day Type Selector Buttons */}
                       <div>
                         <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">
                           Day Classification
                          </label>
                          {(() => {
                            const holidayName = currentHoliday.name || fedHolidayName;
                            return holidayName ? (
                              <div className="flex items-center gap-2.5 px-3 py-2.5 bg-amber-50/60 border border-amber-100 text-[#7c2d12] rounded-xl text-xs font-bold mb-2.5 mt-1.5">
                                <Award className="w-4 h-4 text-amber-500 shrink-0" />
                                <div>
                                  <div className="text-[9px] text-amber-600 uppercase tracking-wider font-extrabold font-sans">Active Holiday</div>
                                  <div className="text-slate-800 font-bold">{holidayName}</div>
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2.5 px-3 py-2.5 bg-slate-50 border border-slate-200 text-slate-600 rounded-xl text-xs font-bold mb-2.5 mt-1.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                                <div>
                                  <div className="text-[9px] text-slate-400 uppercase tracking-wider font-extrabold font-sans">Calendar Day</div>
                                  <div className="text-slate-700 font-bold font-sans">Regular Scheduled Day</div>
                                </div>
                              </div>
                            );
                          })()}
                          <label className="hidden">
                         </label>
                         <div className="hidden grid grid-cols-2 gap-1.5 bg-slate-100 p-1 rounded-lg">
                           <button
                             type="button"
                             onClick={() => updateCompanyHoliday(activeDateKey, currentHoliday.name, currentHoliday.closed, 'holiday')}
                             className={`text-[10.5px] font-extrabold py-1.5 rounded-md transition-all cursor-pointer text-center flex items-center justify-center gap-1 ${
                               currentHolidayType === 'holiday'
                                 ? 'bg-white text-slate-800 shadow-xs border border-slate-200/40 font-black'
                                 : 'text-slate-500 hover:text-slate-800 hover:bg-white/40" '
                             }`}
                           >
                             <span>★</span>
                             <span>Observed Holiday</span>
                           </button>
                           <button
                             type="button"
                             onClick={() => updateCompanyHoliday(activeDateKey, currentHoliday.name, currentHoliday.closed, 'coverage')}
                             className={`text-[10.5px] font-extrabold py-1.5 rounded-md transition-all cursor-pointer text-center flex items-center justify-center gap-1 ${
                               currentHolidayType === 'coverage'
                                 ? 'bg-[#0f172a] text-white shadow-xs font-black'
                                 : 'text-slate-500 hover:text-slate-800 hover:bg-white/40'
                             }`}
                           >
                             <span>🛡️</span>
                             <span>Observed Coverage</span>
                           </button>
                         </div>
                       </div>
 
                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 animation-colors">
                         {/* Name input */}
                         <div>
                           <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                             {currentHolidayType === 'coverage' ? 'Coverage Description / Name' : 'Holiday Description / Name'}
                           </label>
                           <input
                             type="text"
                             placeholder={
                               currentHolidayType === 'coverage' 
                                 ? "e.g. Critical Shift / Observed Coverage" 
                                 : (fedHolidayName ? `Override: ${fedHolidayName}` : "e.g. Easter Holiday / Closed")
                             }
                             disabled={isReadOnlyView} value={currentHoliday.name}
                             onChange={(e) => updateCompanyHoliday(activeDateKey, e.target.value, currentHoliday.closed, currentHolidayType)}
                             className={`w-full text-xs font-semibold bg-white border border-slate-200 rounded-lg p-2 focus:outline-hidden ${currentThemeStyle.focusBorder} text-slate-800`}
                           />
                         </div>
                         
                         {/* Closed toggle */}
                         <div>
                           <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                             Closed for Business?
                           </label>
                           <div className="grid grid-cols-2 gap-1 bg-slate-100 p-1 rounded-lg">
                             <button
                               type="button"
                               onClick={() => !isReadOnlyView && updateCompanyHoliday(activeDateKey, currentHoliday.name, true, currentHolidayType)} disabled={isReadOnlyView}
                               className={`text-[11px] font-extrabold py-1.5 rounded-md transition-all cursor-pointer text-center ${
                                 currentHoliday.closed
                                   ? 'bg-slate-900 text-white shadow-xs font-black'
                                   : 'text-slate-505 hover:text-slate-800 hover:bg-white/40'
                               }`}
                             >
                               Closed: YES
                             </button>
                             <button
                               type="button"
                               onClick={() => !isReadOnlyView && updateCompanyHoliday(activeDateKey, currentHoliday.name, false, currentHolidayType)} disabled={isReadOnlyView}
                               className={`text-[11px] font-extrabold py-1.5 rounded-md transition-all cursor-pointer text-center ${
                                 !currentHoliday.closed
                                   ? 'bg-white text-slate-800 shadow-xs font-black border border-slate-200/50'
                                   : 'text-slate-505 hover:text-slate-800 hover:bg-white/40'
                               }`}
                             >
                               Closed: NO
                             </button>
                           </div>
                         </div>
                      </div>
                    </div>
                  );
                })()}

                {(() => {
                  const rows = dayRows[activeDateKey] || [
                    { text: "", color: 'none' as const },
                    { text: "", color: 'none' as const },
                    { text: "", color: 'none' as const },
                    { text: "", color: 'none' as const }
                  ];
                  while (rows.length < 4) {
                    rows.push({ text: "", color: 'none' });
                  }

                  return (
                    <div className="space-y-3">
                      {rows.slice(0, 4).map((row, rIdx) => (
                        <div 
                          key={`editor_${activeDateKey}_r_${rIdx}`} 
                          className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 space-y-2.5 hover:border-slate-350 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[10.5px] font-black uppercase text-slate-400 tracking-wider">
                              Line #{rIdx + 1}
                            </span>
                            {row.color !== 'none' && (
                              <span className="text-[9.5px] font-extrabold uppercase px-1.5 py-0.5 rounded-sm bg-white border border-slate-200 text-slate-500">
                                Active Category: {statusLabels[row.color]}
                              </span>
                            )}
                          </div>

                          <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center">
                            {/* Text Input Block */}
                            <input
                              type="text"
                              disabled={isReadOnlyView} value={row.text}
                              onChange={(e) => updateDayRow(activeDateKey, rIdx, e.target.value, row.color)}
                              placeholder="e.g. Employee Out (Flex)"
                              className={`text-xs font-bold leading-normal text-slate-800 placeholder-slate-300 bg-white border border-slate-200 rounded-lg px-2.5 py-2 flex-1 focus:outline-hidden ${currentThemeStyle.focusBorder}`}
                            />

                            {/* Row specific Color selector bar */}
                            <div className="flex items-center gap-1.5 bg-white p-1 rounded-lg border border-slate-200 justify-center">
                              <button
                                type="button"
                                onClick={() => !isReadOnlyView && updateDayRow(activeDateKey, rIdx, row.text, 'none')} disabled={isReadOnlyView}
                                className={`w-5 h-5 rounded-full bg-slate-100 hover:scale-110 active:scale-95 transition-transform flex items-center justify-center text-[10px] font-black text-slate-400 border border-slate-200 cursor-pointer ${
                                  row.color === 'none' ? 'ring-2 ring-slate-400 ring-offset-1' : ''
                                }`}
                                title="No Category Color"
                              >
                                ×
                              </button>
                              {statusKeys.map((key) => {
                                const labelColorKey = statusColors[key] || 'slate';
                                const colorOpt = COLOR_OPTIONS.find(o => o.id === labelColorKey) || COLOR_OPTIONS[0];
                                const isSelected = row.color === key;
                                return (
                                  <button
                                    key={`row_btn_${key}`}
                                    type="button"
                                    onClick={() => !isReadOnlyView && updateDayRow(activeDateKey, rIdx, row.text, key)} disabled={isReadOnlyView}
                                    className={`w-4.5 h-4.5 rounded-full cursor-pointer transition-all hover:scale-125 hover:rotate-12 ${colorOpt.dotBg} ${
                                      isSelected ? 'ring-2 ring-slate-800 ring-offset-1 scale-110 shadow-md !opacity-100' : 'opacity-65 hover:opacity-100'
                                    }`}
                                    title={`Set Category: ${statusLabels[key] || 'Memo'}`}
                                  />
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
                </div>

                {/* Footer Buttons */}
                <footer className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between gap-3">
                  <button
                    type="button"
                  onClick={() => {
                    pushToHistory(dayRows);
                    const updatedRows = { ...dayRows };
                    delete updatedRows[activeDateKey];
                    setDayRows(updatedRows);
                    localStorage.setItem('calendar_rows_v2', JSON.stringify(updatedRows));

                    const updatedHolidays = { ...companyHolidays };
                    delete updatedHolidays[activeDateKey];
                    setCompanyHolidays(updatedHolidays);
                    localStorage.setItem('calendar_company_holidays_v2', JSON.stringify(updatedHolidays));

                    setActiveDateKey(null);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer ${isReadOnlyView ? 'hidden' : ''}`}
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Clear All Rows</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveDateKey(null)}
                  className={`px-5 py-2 ${currentThemeStyle.color} text-white font-bold rounded-xl shadow-md hover:scale-102 transition-all cursor-pointer text-xs`}
                >
                  {isReadOnlyView ? 'Close Viewer' : 'Save & Apply Done'}
                </button>
              </footer>
            </motion.div>
          </div>
        )}

        {showResetConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 print:hidden animate-fadeIn">
            {/* Backdrop Blur overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowResetConfirm(false)}
              className="absolute inset-0 bg-[#0f172a]/70 backdrop-blur-md"
            />

            {/* Modal Dialog Content Container */}
            <motion.div
              initial={{ scale: 0.95, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 15, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="relative bg-white w-full max-w-sm rounded-2xl shadow-2xl border border-slate-200 p-6 flex flex-col gap-4 font-sans text-slate-800"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-rose-50 rounded-lg text-rose-600">
                    <Trash2 className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 font-display">
                      Confirm Planner Reset
                    </h3>
                    <p className="text-[10.5px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                      {MONTH_NAMES[currentMonth]} {currentYear}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>

              {/* Scope Selector */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Select Reset Scope
                </label>
                <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => {
                      setResetScope('all');
                      setResetInput("");
                    }}
                    className={`py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      resetScope === 'all'
                        ? 'bg-white text-rose-600 shadow-3xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    All Months & Years
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setResetScope('month');
                      setResetInput("");
                    }}
                    className={`py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      resetScope === 'month'
                        ? 'bg-white text-slate-800 shadow-3xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    This Month Only
                  </button>
                </div>
              </div>

              <div className="p-4 bg-rose-50/55 rounded-xl border border-rose-100 space-y-2">
                <p className="text-xs font-semibold text-rose-900 leading-relaxed">
                  {resetScope === 'all' ? (
                    <span>Warning! This will permanently delete <strong>ALL custom cell notes, planning lines, and team schedules</strong> across all months and years. This cannot be undone.</span>
                  ) : (
                    <span>Warning! Doing this will permanently delete all custom cell notes, planning lines, and status colors assigned for <span className="font-extrabold underline">{MONTH_NAMES[currentMonth]} {currentYear}</span>. This action cannot be undone.</span>
                  )}
                </p>
              </div>

              {/* Puzzle requirements */}
              <div className="space-y-3.5">
                {/* Challenge 1: Text challenge */}
                <div className="space-y-1.5">
                  <label className="text-[10.5px] font-black text-slate-400 uppercase tracking-wider block">
                    Verification Challenge 1/2
                  </label>
                  <div className="text-xs font-semibold text-slate-600">
                    Please type: <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-rose-600 font-black select-all text-center block tracking-wide select-none drop-shadow-3xs">
                      {resetScope === 'all' ? 'RESET ALL' : `RESET ${MONTH_NAMES[currentMonth].toUpperCase()} ${currentYear}`}
                    </span>
                  </div>
                  <input
                    type="text"
                    value={resetInput}
                    onChange={(e) => setResetInput(e.target.value)}
                    placeholder={`Type response here`}
                    className="w-full text-xs font-mono font-bold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:ring-1 focus:ring-slate-400 focus:outline-hidden text-slate-800"
                  />
                </div>

                {/* Challenge 2: Math challenge */}
                <div className="space-y-1.5">
                  <label className="text-[10.5px] font-black text-slate-400 uppercase tracking-wider block">
                    Verification Challenge 2/2
                  </label>
                  <div className="text-xs font-semibold text-slate-600">
                    Solve this equation: <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-blue-600 font-black">{mathChallenge.num1} + {mathChallenge.num2} = ?</span>
                  </div>
                  <input
                    type="number"
                    value={mathAnswer}
                    onChange={(e) => setMathAnswer(e.target.value)}
                    placeholder="Enter answer"
                    className="w-full text-xs font-mono font-bold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:ring-1 focus:ring-slate-400 focus:outline-hidden text-slate-800"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 border border-slate-200 hover:bg-slate-50 rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={
                    resetInput !== (resetScope === 'all' ? 'RESET ALL' : `RESET ${MONTH_NAMES[currentMonth].toUpperCase()} ${currentYear}`) ||
                    parseInt(mathAnswer) !== mathChallenge.answer
                  }
                  onClick={handleClearMonthData}
                  className="flex-1 py-2 text-xs font-bold bg-rose-600 text-white hover:bg-rose-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>{resetScope === 'all' ? 'Reset Entire App' : 'Clear Month'}</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {showHolidayListModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 print:hidden animate-fadeIn">
            {/* Backdrop Blur overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowHolidayListModal(false)}
              className="absolute inset-0 bg-[#0f172a]/70 backdrop-blur-md"
            />

            {/* Modal Dialog Content Container */}
            <motion.div
              initial={{ scale: 0.95, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 15, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 p-6 flex flex-col gap-4 font-sans text-slate-800"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-amber-50 rounded-lg text-amber-500">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 font-display">
                      Observable Annual Holidays
                    </h3>
                    <p className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-wider">
                      Turn on / off visibility of federal & bank holidays
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowHolidayListModal(false)}
                  className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>

              {/* Quick Actions (All On/Off) */}
              <div className="flex items-center justify-between gap-2 text-xs border-b border-slate-100 pb-3">
                <span className="text-[11px] text-slate-500 font-semibold">
                  Active in calendar: <span className="font-bold text-slate-850">{holidayCounts.active} / {holidayCounts.total}</span>
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setDisabledHolidays([]);
                      localStorage.setItem('calendar_disabled_holidays_v1', JSON.stringify([]));
                    }}
                    className="text-[10.5px] font-bold text-indigo-600 hover:text-indigo-800 hover:underline transition-all cursor-pointer"
                  >
                    Enable All
                  </button>
                  <span className="text-slate-300">|</span>
                  <button
                    type="button"
                    onClick={() => {
                      const allNames = getExtendedHolidaysOfCurrentYear().map(h => h.name);
                      setDisabledHolidays(allNames);
                      localStorage.setItem('calendar_disabled_holidays_v1', JSON.stringify(allNames));
                    }}
                    className="text-[10.5px] font-bold text-rose-500 hover:text-rose-700 hover:underline transition-all cursor-pointer"
                  >
                    Disable All
                  </button>
                </div>
              </div>

              {/* Scrollable Holiday List container */}
              <div className="max-h-80 overflow-y-auto pr-1 space-y-2 border-b border-slate-100 pb-3 custom-scrollbar">
                {getExtendedHolidaysOfCurrentYear().map((h) => {
                  const isEnabled = !disabledHolidays.includes(h.name);
                  const dateParts = h.dateKey.split('-');
                  const dateObj = new Date(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1, parseInt(dateParts[2]));
                  const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', weekday: 'short' });
                  
                  return (
                    <div
                      key={`list_holiday_${h.name}`}
                      onClick={() => toggleHolidayEnabled(h.name)}
                      className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer select-none ${
                        isEnabled
                          ? 'bg-white border-slate-200 hover:bg-slate-50/50'
                          : 'bg-slate-50/60 border-slate-100 text-slate-400 opacity-60'
                      }`}
                    >
                      <div className="flex flex-col gap-1 pr-4">
                        <div className="flex items-center gap-2">
                          <span className={`text-[12px] font-bold leading-tight ${isEnabled ? 'text-slate-800' : 'text-slate-400 line-through'}`}>
                            {h.name}
                          </span>
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                            h.type === 'Federal Holiday' ? 'bg-indigo-50 text-indigo-600' :
                            h.type === 'Paid Holiday' ? 'bg-emerald-50 text-emerald-600' :
                            h.type === 'Floating Option' ? 'bg-amber-50 text-amber-600 font-extrabold border border-amber-200' :
                            'bg-slate-100 text-slate-600'
                          }`}>
                            {h.type}
                          </span>
                        </div>
                        <span className="text-[10px] font-semibold text-slate-400">
                          {formattedDate} ({h.dateKey})
                        </span>
                      </div>

                      {/* Small Toggle Switch */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleHolidayEnabled(h.name);
                        }}
                        className={`w-9 h-5 rounded-full relative transition-colors ${
                          isEnabled ? currentThemeStyle.color : 'bg-slate-200'
                        }`}
                      >
                        <span
                          className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.75 left-0.75 transition-transform ${
                            isEnabled ? 'translate-x-4' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={() => setShowHolidayListModal(false)}
                  className={`px-4 py-2 text-xs font-bold text-white ${currentThemeStyle.color} rounded-xl shadow-md hover:opacity-90 transition-all cursor-pointer`}
                >
                  Close & Apply
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {showShareModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 print:hidden animate-fadeIn">
            {/* Backdrop Blur overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setShowShareModal(false);
                setIsCopied(false);
              }}
              className="absolute inset-0 bg-[#0f172a]/70 backdrop-blur-md"
            />

            {/* Modal Dialog Content Container */}
            <motion.div
              initial={{ scale: 0.95, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 15, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 p-6 flex flex-col gap-4 font-sans text-slate-800"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 bg-indigo-55 bg-indigo-50 rounded-xl text-indigo-600">
                    <Share2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 font-display">
                      Share Public Calendar
                    </h3>
                    <p className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-wider">
                      Read-Only Link Customizer
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowShareModal(false);
                    setIsCopied(false);
                  }}
                  className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>

              <div className="p-4 bg-slate-50/70 border border-slate-100 rounded-xl space-y-2">
                <p className="text-xs font-semibold text-slate-600 leading-relaxed">
                  Generate a public URL. Employees and guests who visit this URL can view the live interactive calendar, but they will be <strong className="text-slate-900">completely restricted</strong> from editing memo values, switching week starts, and applying edits.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-[10.5px] font-black text-slate-400 uppercase tracking-wider block">
                  Public Guest Access URl
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}?readonly=true` : ''}
                    onClick={(e) => {
                      (e.target as HTMLInputElement).select();
                    }}
                    className="flex-1 text-xs font-mono font-bold bg-[#f8fafc] border border-slate-200 focus:border-slate-350 outline-hidden rounded-xl px-3.5 py-3 text-slate-700 select-all"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}?readonly=true` : '';
                      navigator.clipboard.writeText(shareUrl).then(() => {
                        setIsCopied(true);
                        setTimeout(() => setIsCopied(false), 2500);
                      });
                    }}
                    className={`px-4 rounded-xl text-xs font-bold font-sans transition-all flex items-center gap-1.5 shrink-0 select-none cursor-pointer ${
                      isCopied 
                        ? 'bg-emerald-600 text-white shadow-emerald-100' 
                        : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100'
                    }`}
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-4 h-4 stroke-[3]" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Link2 className="w-4 h-4" />
                        <span>Copy Link</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2.5 pt-1.5">
                <a
                  href={typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}?readonly=true` : '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 text-xs font-bold text-center text-slate-600 hover:text-slate-800 border border-slate-200 hover:bg-slate-50 rounded-xl transition-all select-none"
                >
                  Open Live Preview
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setShowShareModal(false);
                    setIsCopied(false);
                  }}
                  className={`flex-1 py-3 text-xs font-bold text-white rounded-xl transition-all shadow-md hover:opacity-90 cursor-pointer ${currentThemeStyle.color}`}
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {showPasswordModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 print:hidden animate-fadeIn">
            {/* Backdrop Blur overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setShowPasswordModal(false);
                setPasswordTargetAction(null);
              }}
              className="absolute inset-0 bg-[#0f172a]/70 backdrop-blur-md"
            />

            {/* Modal Dialog Content Container */}
            <motion.div
              initial={{ scale: 0.95, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 15, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="relative bg-white w-full max-w-sm rounded-2xl shadow-2xl border border-slate-200 p-6 flex flex-col gap-4 font-sans text-slate-800"
            >
              <form onSubmit={(e) => handlePasswordSubmit(e)} className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-indigo-55 bg-indigo-50 rounded-lg text-indigo-600">
                      <SlidersHorizontal className="w-5 h-5 animate-pulse" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 font-display">
                        Authorization Required
                      </h3>
                      <p className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-wider">
                        Lock Status: Secure
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setShowPasswordModal(false);
                      setPasswordTargetAction(null);
                    }}
                    className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  >
                    <X className="w-4.5 h-4.5" />
                  </button>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-xs font-semibold text-slate-600 leading-relaxed">
                    Custom Memo adjustments are password-protected. Please authorize to unlock these administration tools.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10.5px] font-black text-slate-400 uppercase tracking-wider block">
                    Enter Password
                  </label>
                  <input
                    type="password"
                    value={passwordInput}
                    onChange={(e) => {
                      setPasswordInput(e.target.value);
                      if (passwordError) setPasswordError("");
                    }}
                    placeholder="Enter password..."
                    autoFocus
                    className={`w-full text-xs font-medium bg-slate-50 border rounded-xl px-3 py-2.5 outline-hidden transition-all text-slate-800 ${
                      passwordError ? 'border-rose-300 focus:border-rose-500 ring-rose-50' : 'border-slate-200 focus:border-slate-400'
                    }`}
                  />
                  {passwordError && (
                    <p className="text-[10.5px] text-rose-500 font-bold mt-1 leading-tight">
                      {passwordError}
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowPasswordModal(false);
                      setPasswordTargetAction(null);
                    }}
                    className="flex-1 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 border border-slate-200 hover:bg-slate-50 rounded-xl transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`flex-1 py-2 text-xs font-bold ${currentThemeStyle.color} text-white font-bold rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5 hover:opacity-90`}
                  >
                    <Check className="w-4 h-4" />
                    <span>Authorize</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
