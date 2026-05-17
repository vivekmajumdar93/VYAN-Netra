import { c as createLucideIcon, r as reactExports, b as useUsers, a as useProducts, j as jsxRuntimeExports, U as Users, k as Button, q as UserRole, s as UserStatus, t as useSuspendUser, v as useRestoreUser, w as useRemoveUser, x as useUpdateUserRole, n as ue, C as ChevronDown, y as useCreateUser, z as useUserActivities, A as Activity, D as ActivityEventType, m as Settings, L as LogIn } from "./index-BCJFQ4-n.js";
import { I as Input } from "./input-DMBUQZmY.js";
import { L as Label } from "./label-Bl69gsBZ.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-CVBYqagU.js";
import { S as Skeleton } from "./skeleton-DpPmXALx.js";
import { U as UserPlus } from "./user-plus-Ci0cc_sa.js";
import { S as Search } from "./search-DqizQwqj.js";
import { X } from "./x-BWJjv8ZZ.js";
import { P as Plus } from "./plus-DObSqLEn.js";
import { C as Clock } from "./clock-BSAl9IO0.js";
import { S as ShieldCheck } from "./shield-check-JUemDo3J.js";
import { T as Trash2 } from "./trash-2-BRazMmfj.js";
import "./index-XCDx2eqQ.js";
import "./index-CgD3lSY3.js";
import "./Combination-D7_teDzu.js";
import "./index-vH3xme5C.js";
import "./check-BtsvWYh4.js";
import "./chevron-up-DX6hR0JY.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [["path", { d: "m9 18 6-6-6-6", key: "mthhwq" }]];
const ChevronRight = createLucideIcon("chevron-right", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "m2 2 20 20", key: "1ooewy" }],
  [
    "path",
    {
      d: "M5 5a1 1 0 0 0-1 1v7c0 5 3.5 7.5 7.67 8.94a1 1 0 0 0 .67.01c2.35-.82 4.48-1.97 5.9-3.71",
      key: "1jlk70"
    }
  ],
  [
    "path",
    {
      d: "M9.309 3.652A12.252 12.252 0 0 0 11.24 2.28a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1v7a9.784 9.784 0 0 1-.08 1.264",
      key: "18rp1v"
    }
  ]
];
const ShieldOff = createLucideIcon("shield-off", __iconNode);
function toDate(argument) {
  const argStr = Object.prototype.toString.call(argument);
  if (argument instanceof Date || typeof argument === "object" && argStr === "[object Date]") {
    return new argument.constructor(+argument);
  } else if (typeof argument === "number" || argStr === "[object Number]" || typeof argument === "string" || argStr === "[object String]") {
    return new Date(argument);
  } else {
    return /* @__PURE__ */ new Date(NaN);
  }
}
function constructFrom(date, value) {
  if (date instanceof Date) {
    return new date.constructor(value);
  } else {
    return new Date(value);
  }
}
const minutesInMonth = 43200;
const minutesInDay = 1440;
let defaultOptions = {};
function getDefaultOptions() {
  return defaultOptions;
}
function getTimezoneOffsetInMilliseconds(date) {
  const _date = toDate(date);
  const utcDate = new Date(
    Date.UTC(
      _date.getFullYear(),
      _date.getMonth(),
      _date.getDate(),
      _date.getHours(),
      _date.getMinutes(),
      _date.getSeconds(),
      _date.getMilliseconds()
    )
  );
  utcDate.setUTCFullYear(_date.getFullYear());
  return +date - +utcDate;
}
function compareAsc(dateLeft, dateRight) {
  const _dateLeft = toDate(dateLeft);
  const _dateRight = toDate(dateRight);
  const diff = _dateLeft.getTime() - _dateRight.getTime();
  if (diff < 0) {
    return -1;
  } else if (diff > 0) {
    return 1;
  } else {
    return diff;
  }
}
function constructNow(date) {
  return constructFrom(date, Date.now());
}
function differenceInCalendarMonths(dateLeft, dateRight) {
  const _dateLeft = toDate(dateLeft);
  const _dateRight = toDate(dateRight);
  const yearDiff = _dateLeft.getFullYear() - _dateRight.getFullYear();
  const monthDiff = _dateLeft.getMonth() - _dateRight.getMonth();
  return yearDiff * 12 + monthDiff;
}
function getRoundingMethod(method) {
  return (number) => {
    const round = method ? Math[method] : Math.trunc;
    const result = round(number);
    return result === 0 ? 0 : result;
  };
}
function differenceInMilliseconds(dateLeft, dateRight) {
  return +toDate(dateLeft) - +toDate(dateRight);
}
function endOfDay(date) {
  const _date = toDate(date);
  _date.setHours(23, 59, 59, 999);
  return _date;
}
function endOfMonth(date) {
  const _date = toDate(date);
  const month = _date.getMonth();
  _date.setFullYear(_date.getFullYear(), month + 1, 0);
  _date.setHours(23, 59, 59, 999);
  return _date;
}
function isLastDayOfMonth(date) {
  const _date = toDate(date);
  return +endOfDay(_date) === +endOfMonth(_date);
}
function differenceInMonths(dateLeft, dateRight) {
  const _dateLeft = toDate(dateLeft);
  const _dateRight = toDate(dateRight);
  const sign = compareAsc(_dateLeft, _dateRight);
  const difference = Math.abs(
    differenceInCalendarMonths(_dateLeft, _dateRight)
  );
  let result;
  if (difference < 1) {
    result = 0;
  } else {
    if (_dateLeft.getMonth() === 1 && _dateLeft.getDate() > 27) {
      _dateLeft.setDate(30);
    }
    _dateLeft.setMonth(_dateLeft.getMonth() - sign * difference);
    let isLastMonthNotFull = compareAsc(_dateLeft, _dateRight) === -sign;
    if (isLastDayOfMonth(toDate(dateLeft)) && difference === 1 && compareAsc(dateLeft, _dateRight) === 1) {
      isLastMonthNotFull = false;
    }
    result = sign * (difference - Number(isLastMonthNotFull));
  }
  return result === 0 ? 0 : result;
}
function differenceInSeconds(dateLeft, dateRight, options) {
  const diff = differenceInMilliseconds(dateLeft, dateRight) / 1e3;
  return getRoundingMethod(options == null ? void 0 : options.roundingMethod)(diff);
}
const formatDistanceLocale = {
  lessThanXSeconds: {
    one: "less than a second",
    other: "less than {{count}} seconds"
  },
  xSeconds: {
    one: "1 second",
    other: "{{count}} seconds"
  },
  halfAMinute: "half a minute",
  lessThanXMinutes: {
    one: "less than a minute",
    other: "less than {{count}} minutes"
  },
  xMinutes: {
    one: "1 minute",
    other: "{{count}} minutes"
  },
  aboutXHours: {
    one: "about 1 hour",
    other: "about {{count}} hours"
  },
  xHours: {
    one: "1 hour",
    other: "{{count}} hours"
  },
  xDays: {
    one: "1 day",
    other: "{{count}} days"
  },
  aboutXWeeks: {
    one: "about 1 week",
    other: "about {{count}} weeks"
  },
  xWeeks: {
    one: "1 week",
    other: "{{count}} weeks"
  },
  aboutXMonths: {
    one: "about 1 month",
    other: "about {{count}} months"
  },
  xMonths: {
    one: "1 month",
    other: "{{count}} months"
  },
  aboutXYears: {
    one: "about 1 year",
    other: "about {{count}} years"
  },
  xYears: {
    one: "1 year",
    other: "{{count}} years"
  },
  overXYears: {
    one: "over 1 year",
    other: "over {{count}} years"
  },
  almostXYears: {
    one: "almost 1 year",
    other: "almost {{count}} years"
  }
};
const formatDistance$1 = (token, count, options) => {
  let result;
  const tokenValue = formatDistanceLocale[token];
  if (typeof tokenValue === "string") {
    result = tokenValue;
  } else if (count === 1) {
    result = tokenValue.one;
  } else {
    result = tokenValue.other.replace("{{count}}", count.toString());
  }
  if (options == null ? void 0 : options.addSuffix) {
    if (options.comparison && options.comparison > 0) {
      return "in " + result;
    } else {
      return result + " ago";
    }
  }
  return result;
};
function buildFormatLongFn(args) {
  return (options = {}) => {
    const width = options.width ? String(options.width) : args.defaultWidth;
    const format = args.formats[width] || args.formats[args.defaultWidth];
    return format;
  };
}
const dateFormats = {
  full: "EEEE, MMMM do, y",
  long: "MMMM do, y",
  medium: "MMM d, y",
  short: "MM/dd/yyyy"
};
const timeFormats = {
  full: "h:mm:ss a zzzz",
  long: "h:mm:ss a z",
  medium: "h:mm:ss a",
  short: "h:mm a"
};
const dateTimeFormats = {
  full: "{{date}} 'at' {{time}}",
  long: "{{date}} 'at' {{time}}",
  medium: "{{date}}, {{time}}",
  short: "{{date}}, {{time}}"
};
const formatLong = {
  date: buildFormatLongFn({
    formats: dateFormats,
    defaultWidth: "full"
  }),
  time: buildFormatLongFn({
    formats: timeFormats,
    defaultWidth: "full"
  }),
  dateTime: buildFormatLongFn({
    formats: dateTimeFormats,
    defaultWidth: "full"
  })
};
const formatRelativeLocale = {
  lastWeek: "'last' eeee 'at' p",
  yesterday: "'yesterday at' p",
  today: "'today at' p",
  tomorrow: "'tomorrow at' p",
  nextWeek: "eeee 'at' p",
  other: "P"
};
const formatRelative = (token, _date, _baseDate, _options) => formatRelativeLocale[token];
function buildLocalizeFn(args) {
  return (value, options) => {
    const context = (options == null ? void 0 : options.context) ? String(options.context) : "standalone";
    let valuesArray;
    if (context === "formatting" && args.formattingValues) {
      const defaultWidth = args.defaultFormattingWidth || args.defaultWidth;
      const width = (options == null ? void 0 : options.width) ? String(options.width) : defaultWidth;
      valuesArray = args.formattingValues[width] || args.formattingValues[defaultWidth];
    } else {
      const defaultWidth = args.defaultWidth;
      const width = (options == null ? void 0 : options.width) ? String(options.width) : args.defaultWidth;
      valuesArray = args.values[width] || args.values[defaultWidth];
    }
    const index = args.argumentCallback ? args.argumentCallback(value) : value;
    return valuesArray[index];
  };
}
const eraValues = {
  narrow: ["B", "A"],
  abbreviated: ["BC", "AD"],
  wide: ["Before Christ", "Anno Domini"]
};
const quarterValues = {
  narrow: ["1", "2", "3", "4"],
  abbreviated: ["Q1", "Q2", "Q3", "Q4"],
  wide: ["1st quarter", "2nd quarter", "3rd quarter", "4th quarter"]
};
const monthValues = {
  narrow: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
  abbreviated: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ],
  wide: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ]
};
const dayValues = {
  narrow: ["S", "M", "T", "W", "T", "F", "S"],
  short: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
  abbreviated: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  wide: [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ]
};
const dayPeriodValues = {
  narrow: {
    am: "a",
    pm: "p",
    midnight: "mi",
    noon: "n",
    morning: "morning",
    afternoon: "afternoon",
    evening: "evening",
    night: "night"
  },
  abbreviated: {
    am: "AM",
    pm: "PM",
    midnight: "midnight",
    noon: "noon",
    morning: "morning",
    afternoon: "afternoon",
    evening: "evening",
    night: "night"
  },
  wide: {
    am: "a.m.",
    pm: "p.m.",
    midnight: "midnight",
    noon: "noon",
    morning: "morning",
    afternoon: "afternoon",
    evening: "evening",
    night: "night"
  }
};
const formattingDayPeriodValues = {
  narrow: {
    am: "a",
    pm: "p",
    midnight: "mi",
    noon: "n",
    morning: "in the morning",
    afternoon: "in the afternoon",
    evening: "in the evening",
    night: "at night"
  },
  abbreviated: {
    am: "AM",
    pm: "PM",
    midnight: "midnight",
    noon: "noon",
    morning: "in the morning",
    afternoon: "in the afternoon",
    evening: "in the evening",
    night: "at night"
  },
  wide: {
    am: "a.m.",
    pm: "p.m.",
    midnight: "midnight",
    noon: "noon",
    morning: "in the morning",
    afternoon: "in the afternoon",
    evening: "in the evening",
    night: "at night"
  }
};
const ordinalNumber = (dirtyNumber, _options) => {
  const number = Number(dirtyNumber);
  const rem100 = number % 100;
  if (rem100 > 20 || rem100 < 10) {
    switch (rem100 % 10) {
      case 1:
        return number + "st";
      case 2:
        return number + "nd";
      case 3:
        return number + "rd";
    }
  }
  return number + "th";
};
const localize = {
  ordinalNumber,
  era: buildLocalizeFn({
    values: eraValues,
    defaultWidth: "wide"
  }),
  quarter: buildLocalizeFn({
    values: quarterValues,
    defaultWidth: "wide",
    argumentCallback: (quarter) => quarter - 1
  }),
  month: buildLocalizeFn({
    values: monthValues,
    defaultWidth: "wide"
  }),
  day: buildLocalizeFn({
    values: dayValues,
    defaultWidth: "wide"
  }),
  dayPeriod: buildLocalizeFn({
    values: dayPeriodValues,
    defaultWidth: "wide",
    formattingValues: formattingDayPeriodValues,
    defaultFormattingWidth: "wide"
  })
};
function buildMatchFn(args) {
  return (string, options = {}) => {
    const width = options.width;
    const matchPattern = width && args.matchPatterns[width] || args.matchPatterns[args.defaultMatchWidth];
    const matchResult = string.match(matchPattern);
    if (!matchResult) {
      return null;
    }
    const matchedString = matchResult[0];
    const parsePatterns = width && args.parsePatterns[width] || args.parsePatterns[args.defaultParseWidth];
    const key = Array.isArray(parsePatterns) ? findIndex(parsePatterns, (pattern) => pattern.test(matchedString)) : (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- I challange you to fix the type
      findKey(parsePatterns, (pattern) => pattern.test(matchedString))
    );
    let value;
    value = args.valueCallback ? args.valueCallback(key) : key;
    value = options.valueCallback ? (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- I challange you to fix the type
      options.valueCallback(value)
    ) : value;
    const rest = string.slice(matchedString.length);
    return { value, rest };
  };
}
function findKey(object, predicate) {
  for (const key in object) {
    if (Object.prototype.hasOwnProperty.call(object, key) && predicate(object[key])) {
      return key;
    }
  }
  return void 0;
}
function findIndex(array, predicate) {
  for (let key = 0; key < array.length; key++) {
    if (predicate(array[key])) {
      return key;
    }
  }
  return void 0;
}
function buildMatchPatternFn(args) {
  return (string, options = {}) => {
    const matchResult = string.match(args.matchPattern);
    if (!matchResult) return null;
    const matchedString = matchResult[0];
    const parseResult = string.match(args.parsePattern);
    if (!parseResult) return null;
    let value = args.valueCallback ? args.valueCallback(parseResult[0]) : parseResult[0];
    value = options.valueCallback ? options.valueCallback(value) : value;
    const rest = string.slice(matchedString.length);
    return { value, rest };
  };
}
const matchOrdinalNumberPattern = /^(\d+)(th|st|nd|rd)?/i;
const parseOrdinalNumberPattern = /\d+/i;
const matchEraPatterns = {
  narrow: /^(b|a)/i,
  abbreviated: /^(b\.?\s?c\.?|b\.?\s?c\.?\s?e\.?|a\.?\s?d\.?|c\.?\s?e\.?)/i,
  wide: /^(before christ|before common era|anno domini|common era)/i
};
const parseEraPatterns = {
  any: [/^b/i, /^(a|c)/i]
};
const matchQuarterPatterns = {
  narrow: /^[1234]/i,
  abbreviated: /^q[1234]/i,
  wide: /^[1234](th|st|nd|rd)? quarter/i
};
const parseQuarterPatterns = {
  any: [/1/i, /2/i, /3/i, /4/i]
};
const matchMonthPatterns = {
  narrow: /^[jfmasond]/i,
  abbreviated: /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i,
  wide: /^(january|february|march|april|may|june|july|august|september|october|november|december)/i
};
const parseMonthPatterns = {
  narrow: [
    /^j/i,
    /^f/i,
    /^m/i,
    /^a/i,
    /^m/i,
    /^j/i,
    /^j/i,
    /^a/i,
    /^s/i,
    /^o/i,
    /^n/i,
    /^d/i
  ],
  any: [
    /^ja/i,
    /^f/i,
    /^mar/i,
    /^ap/i,
    /^may/i,
    /^jun/i,
    /^jul/i,
    /^au/i,
    /^s/i,
    /^o/i,
    /^n/i,
    /^d/i
  ]
};
const matchDayPatterns = {
  narrow: /^[smtwf]/i,
  short: /^(su|mo|tu|we|th|fr|sa)/i,
  abbreviated: /^(sun|mon|tue|wed|thu|fri|sat)/i,
  wide: /^(sunday|monday|tuesday|wednesday|thursday|friday|saturday)/i
};
const parseDayPatterns = {
  narrow: [/^s/i, /^m/i, /^t/i, /^w/i, /^t/i, /^f/i, /^s/i],
  any: [/^su/i, /^m/i, /^tu/i, /^w/i, /^th/i, /^f/i, /^sa/i]
};
const matchDayPeriodPatterns = {
  narrow: /^(a|p|mi|n|(in the|at) (morning|afternoon|evening|night))/i,
  any: /^([ap]\.?\s?m\.?|midnight|noon|(in the|at) (morning|afternoon|evening|night))/i
};
const parseDayPeriodPatterns = {
  any: {
    am: /^a/i,
    pm: /^p/i,
    midnight: /^mi/i,
    noon: /^no/i,
    morning: /morning/i,
    afternoon: /afternoon/i,
    evening: /evening/i,
    night: /night/i
  }
};
const match = {
  ordinalNumber: buildMatchPatternFn({
    matchPattern: matchOrdinalNumberPattern,
    parsePattern: parseOrdinalNumberPattern,
    valueCallback: (value) => parseInt(value, 10)
  }),
  era: buildMatchFn({
    matchPatterns: matchEraPatterns,
    defaultMatchWidth: "wide",
    parsePatterns: parseEraPatterns,
    defaultParseWidth: "any"
  }),
  quarter: buildMatchFn({
    matchPatterns: matchQuarterPatterns,
    defaultMatchWidth: "wide",
    parsePatterns: parseQuarterPatterns,
    defaultParseWidth: "any",
    valueCallback: (index) => index + 1
  }),
  month: buildMatchFn({
    matchPatterns: matchMonthPatterns,
    defaultMatchWidth: "wide",
    parsePatterns: parseMonthPatterns,
    defaultParseWidth: "any"
  }),
  day: buildMatchFn({
    matchPatterns: matchDayPatterns,
    defaultMatchWidth: "wide",
    parsePatterns: parseDayPatterns,
    defaultParseWidth: "any"
  }),
  dayPeriod: buildMatchFn({
    matchPatterns: matchDayPeriodPatterns,
    defaultMatchWidth: "any",
    parsePatterns: parseDayPeriodPatterns,
    defaultParseWidth: "any"
  })
};
const enUS = {
  code: "en-US",
  formatDistance: formatDistance$1,
  formatLong,
  formatRelative,
  localize,
  match,
  options: {
    weekStartsOn: 0,
    firstWeekContainsDate: 1
  }
};
function formatDistance(date, baseDate, options) {
  const defaultOptions2 = getDefaultOptions();
  const locale = (options == null ? void 0 : options.locale) ?? defaultOptions2.locale ?? enUS;
  const minutesInAlmostTwoDays = 2520;
  const comparison = compareAsc(date, baseDate);
  if (isNaN(comparison)) {
    throw new RangeError("Invalid time value");
  }
  const localizeOptions = Object.assign({}, options, {
    addSuffix: options == null ? void 0 : options.addSuffix,
    comparison
  });
  let dateLeft;
  let dateRight;
  if (comparison > 0) {
    dateLeft = toDate(baseDate);
    dateRight = toDate(date);
  } else {
    dateLeft = toDate(date);
    dateRight = toDate(baseDate);
  }
  const seconds = differenceInSeconds(dateRight, dateLeft);
  const offsetInSeconds = (getTimezoneOffsetInMilliseconds(dateRight) - getTimezoneOffsetInMilliseconds(dateLeft)) / 1e3;
  const minutes = Math.round((seconds - offsetInSeconds) / 60);
  let months;
  if (minutes < 2) {
    if (options == null ? void 0 : options.includeSeconds) {
      if (seconds < 5) {
        return locale.formatDistance("lessThanXSeconds", 5, localizeOptions);
      } else if (seconds < 10) {
        return locale.formatDistance("lessThanXSeconds", 10, localizeOptions);
      } else if (seconds < 20) {
        return locale.formatDistance("lessThanXSeconds", 20, localizeOptions);
      } else if (seconds < 40) {
        return locale.formatDistance("halfAMinute", 0, localizeOptions);
      } else if (seconds < 60) {
        return locale.formatDistance("lessThanXMinutes", 1, localizeOptions);
      } else {
        return locale.formatDistance("xMinutes", 1, localizeOptions);
      }
    } else {
      if (minutes === 0) {
        return locale.formatDistance("lessThanXMinutes", 1, localizeOptions);
      } else {
        return locale.formatDistance("xMinutes", minutes, localizeOptions);
      }
    }
  } else if (minutes < 45) {
    return locale.formatDistance("xMinutes", minutes, localizeOptions);
  } else if (minutes < 90) {
    return locale.formatDistance("aboutXHours", 1, localizeOptions);
  } else if (minutes < minutesInDay) {
    const hours = Math.round(minutes / 60);
    return locale.formatDistance("aboutXHours", hours, localizeOptions);
  } else if (minutes < minutesInAlmostTwoDays) {
    return locale.formatDistance("xDays", 1, localizeOptions);
  } else if (minutes < minutesInMonth) {
    const days = Math.round(minutes / minutesInDay);
    return locale.formatDistance("xDays", days, localizeOptions);
  } else if (minutes < minutesInMonth * 2) {
    months = Math.round(minutes / minutesInMonth);
    return locale.formatDistance("aboutXMonths", months, localizeOptions);
  }
  months = differenceInMonths(dateRight, dateLeft);
  if (months < 12) {
    const nearestMonth = Math.round(minutes / minutesInMonth);
    return locale.formatDistance("xMonths", nearestMonth, localizeOptions);
  } else {
    const monthsSinceStartOfYear = months % 12;
    const years = Math.trunc(months / 12);
    if (monthsSinceStartOfYear < 3) {
      return locale.formatDistance("aboutXYears", years, localizeOptions);
    } else if (monthsSinceStartOfYear < 9) {
      return locale.formatDistance("overXYears", years, localizeOptions);
    } else {
      return locale.formatDistance("almostXYears", years + 1, localizeOptions);
    }
  }
}
function formatDistanceToNow(date, options) {
  return formatDistance(date, constructNow(date), options);
}
function roleKey(r) {
  if (r === UserRole.admin) return "admin";
  if (r === UserRole.manager) return "manager";
  return "viewer";
}
function statusKey(s) {
  return s === UserStatus.active ? "active" : "suspended";
}
function getInitials(name) {
  return name.split(" ").slice(0, 2).map((w) => {
    var _a;
    return ((_a = w[0]) == null ? void 0 : _a.toUpperCase()) ?? "";
  }).join("");
}
function relativeTime(ts) {
  try {
    const ms = Number(ts / 1000000n);
    if (ms === 0) return "Never";
    return formatDistanceToNow(new Date(ms), { addSuffix: true });
  } catch {
    return "Unknown";
  }
}
const ROLE_BG = {
  admin: "rgba(147,89,255,0.18)",
  manager: "rgba(91,157,255,0.16)",
  viewer: "rgba(52,211,153,0.13)"
};
const ROLE_COLOR = {
  admin: "#B78BFF",
  manager: "#7BBDFF",
  viewer: "#6EE7B7"
};
const ROLE_BORDER = {
  admin: "rgba(147,89,255,0.3)",
  manager: "rgba(91,157,255,0.3)",
  viewer: "rgba(52,211,153,0.3)"
};
const AVATAR_GRADIENTS = [
  "linear-gradient(135deg,#5b9dff,#9359ff)",
  "linear-gradient(135deg,#9359ff,#e054a0)",
  "linear-gradient(135deg,#34d399,#5b9dff)",
  "linear-gradient(135deg,#fbbf24,#f87171)",
  "linear-gradient(135deg,#818cf8,#38bdf8)"
];
function avatarGradient(name) {
  const idx = name.charCodeAt(0) % AVATAR_GRADIENTS.length;
  return AVATAR_GRADIENTS[idx];
}
const ACTIVITY_ICONS = {
  [ActivityEventType.login]: /* @__PURE__ */ jsxRuntimeExports.jsx(LogIn, { className: "w-3 h-3" }),
  [ActivityEventType.action]: /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "w-3 h-3" }),
  [ActivityEventType.permissionChange]: /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "w-3 h-3" })
};
function ConfirmDialog({
  title,
  body,
  danger,
  onConfirm,
  onCancel
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "fixed inset-0 z-50 flex items-center justify-center p-4",
      style: { background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" },
      "data-ocid": "users.dialog",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "w-full max-w-sm rounded-2xl p-6",
          style: {
            background: "rgba(8,14,34,0.96)",
            border: "1px solid rgba(91,157,255,0.2)",
            boxShadow: "0 0 56px rgba(91,157,255,0.1)"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-base font-display font-bold text-[#E8E8FF] mb-2", children: title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: `text-sm font-body mb-6 ${danger ? "text-red-400" : "text-[rgba(232,232,255,0.55)]"}`,
                children: body
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "button",
                  variant: "outline",
                  className: "flex-1",
                  onClick: onCancel,
                  "data-ocid": "users.cancel_button",
                  children: "Cancel"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "button",
                  className: `flex-1 ${danger ? "bg-red-600 hover:bg-red-500 border-red-600 text-white" : ""}`,
                  onClick: onConfirm,
                  "data-ocid": "users.confirm_button",
                  children: "Confirm"
                }
              )
            ] })
          ]
        }
      )
    }
  );
}
function ActivityPanel({ user }) {
  const { data: activities, isLoading } = useUserActivities(user.productId);
  const userActivities = (activities ?? []).filter((a) => a.userId === user.id).slice(0, 5);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    "td",
    {
      colSpan: 7,
      className: "px-0 pt-0 pb-0",
      style: { background: "rgba(91,157,255,0.03)" },
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-mono text-[rgba(232,232,255,0.35)] uppercase tracking-widest mb-3", children: "Recent Activity" }),
        isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-full rounded-md" }, i)) }) : userActivities.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-mono text-[rgba(232,232,255,0.3)] italic", children: "No activity recorded yet." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1.5", children: userActivities.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center gap-3 text-xs font-mono",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[rgba(91,157,255,0.7)]", children: ACTIVITY_ICONS[a.eventType] ?? /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "w-3 h-3" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[rgba(232,232,255,0.65)] flex-1", children: a.description || a.eventType }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[rgba(232,232,255,0.3)] flex-shrink-0", children: relativeTime(a.timestamp) })
            ]
          },
          a.id.toString()
        )) })
      ] })
    }
  ) });
}
function UserRow({
  user,
  index,
  productName
}) {
  const [expanded, setExpanded] = reactExports.useState(false);
  const [confirmSuspend, setConfirmSuspend] = reactExports.useState(false);
  const [confirmRemove, setConfirmRemove] = reactExports.useState(false);
  const [editingRole, setEditingRole] = reactExports.useState(false);
  const suspend = useSuspendUser();
  const restore = useRestoreUser();
  const remove = useRemoveUser();
  const updateRole = useUpdateUserRole();
  const rk = roleKey(user.role);
  const isSuspended = user.status === UserStatus.suspended;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "tr",
      {
        className: "border-b border-[rgba(91,157,255,0.07)] hover:bg-[rgba(91,157,255,0.03)] transition-colors cursor-pointer",
        onClick: () => setExpanded((v) => !v),
        onKeyDown: (e) => {
          if (e.key === "Enter") setExpanded((v) => !v);
        },
        tabIndex: 0,
        "data-ocid": `users.item.${index}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-display font-bold text-white flex-shrink-0",
                style: { background: avatarGradient(user.name) },
                children: getInitials(user.name)
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-body font-medium text-[#E8E8FF] truncate", children: user.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-mono text-[rgba(232,232,255,0.35)] truncate", children: user.email })
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "text-[10px] font-mono px-2 py-0.5 rounded-full",
              style: {
                background: "rgba(91,157,255,0.1)",
                color: "#7BBDFF",
                border: "1px solid rgba(91,157,255,0.2)"
              },
              children: productName
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "td",
            {
              className: "px-5 py-3.5",
              onClick: (e) => e.stopPropagation(),
              onKeyDown: (e) => e.stopPropagation(),
              children: editingRole ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Select,
                {
                  defaultValue: rk,
                  onValueChange: (val) => {
                    updateRole.mutate(
                      { id: user.id, role: val },
                      {
                        onSuccess: () => {
                          ue.success("Role updated");
                          setEditingRole(false);
                        },
                        onError: () => ue.error("Failed to update role")
                      }
                    );
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      SelectTrigger,
                      {
                        className: "h-6 text-[10px] font-mono w-28 bg-[rgba(91,157,255,0.06)] border-[rgba(91,157,255,0.2)] text-[#E8E8FF]",
                        "data-ocid": `users.role_select.${index}`,
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "viewer", children: "Viewer" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "manager", children: "Manager" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "admin", children: "Admin" })
                    ] })
                  ]
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setEditingRole(true),
                  className: "text-[10px] font-mono px-2 py-0.5 rounded-full transition-smooth hover:opacity-80",
                  style: {
                    background: ROLE_BG[rk] ?? "rgba(91,157,255,0.1)",
                    color: ROLE_COLOR[rk] ?? "#7BBDFF",
                    border: `1px solid ${ROLE_BORDER[rk] ?? "rgba(91,157,255,0.2)"}`
                  },
                  title: "Click to edit role",
                  "data-ocid": `users.role_badge.${index}`,
                  children: rk
                }
              )
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "text-[10px] font-mono px-2 py-0.5 rounded-full",
              style: {
                background: isSuspended ? "rgba(239,68,68,0.1)" : "rgba(52,211,153,0.12)",
                color: isSuspended ? "#F87171" : "#34D399",
                border: `1px solid ${isSuspended ? "rgba(239,68,68,0.25)" : "rgba(52,211,153,0.25)"}`
              },
              children: statusKey(user.status)
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-mono text-[rgba(232,232,255,0.35)] flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3 h-3 flex-shrink-0" }),
            relativeTime(user.lastActivity)
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[rgba(91,157,255,0.4)]", children: expanded ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "w-4 h-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-4 h-4" }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "td",
            {
              className: "px-5 py-3.5",
              onClick: (e) => e.stopPropagation(),
              onKeyDown: (e) => e.stopPropagation(),
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-1", children: [
                isSuspended ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => {
                      restore.mutate(user.id, {
                        onSuccess: () => ue.success(`${user.name} restored`),
                        onError: () => ue.error("Failed to restore")
                      });
                    },
                    "aria-label": "Restore user",
                    "data-ocid": `users.restore_button.${index}`,
                    className: "p-1.5 rounded-lg hover:bg-[rgba(52,211,153,0.1)] transition-colors",
                    title: "Restore",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "w-3.5 h-3.5 text-emerald-400" })
                  }
                ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setConfirmSuspend(true),
                    "aria-label": "Suspend user",
                    "data-ocid": `users.suspend_button.${index}`,
                    className: "p-1.5 rounded-lg hover:bg-[rgba(251,191,36,0.1)] transition-colors",
                    title: "Suspend",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldOff, { className: "w-3.5 h-3.5 text-yellow-400" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setConfirmRemove(true),
                    "aria-label": "Remove user",
                    "data-ocid": `users.delete_button.${index}`,
                    className: "p-1.5 rounded-lg hover:bg-[rgba(239,68,68,0.1)] transition-colors",
                    title: "Remove",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3.5 h-3.5 text-red-400" })
                  }
                )
              ] })
            }
          )
        ]
      }
    ),
    expanded && /* @__PURE__ */ jsxRuntimeExports.jsx(ActivityPanel, { user }),
    confirmSuspend && /* @__PURE__ */ jsxRuntimeExports.jsx(
      ConfirmDialog,
      {
        title: `Suspend ${user.name}?`,
        body: "This will prevent the user from accessing the product. You can restore them later.",
        onConfirm: () => {
          suspend.mutate(user.id, {
            onSuccess: () => ue.success(`${user.name} suspended`),
            onError: () => ue.error("Failed to suspend")
          });
          setConfirmSuspend(false);
        },
        onCancel: () => setConfirmSuspend(false)
      }
    ),
    confirmRemove && /* @__PURE__ */ jsxRuntimeExports.jsx(
      ConfirmDialog,
      {
        title: `Remove ${user.name}?`,
        body: "This action is permanent. The user will be removed from the product and all activity data will be lost.",
        danger: true,
        onConfirm: () => {
          remove.mutate(user.id, {
            onSuccess: () => ue.success(`${user.name} removed`),
            onError: () => ue.error("Failed to remove")
          });
          setConfirmRemove(false);
        },
        onCancel: () => setConfirmRemove(false)
      }
    )
  ] });
}
function InviteModal({ onClose }) {
  const { data: products } = useProducts();
  const createUser = useCreateUser();
  const [name, setName] = reactExports.useState("");
  const [email, setEmail] = reactExports.useState("");
  const [role, setRole] = reactExports.useState("viewer");
  const [productId, setProductId] = reactExports.useState("");
  async function handleSubmit(e) {
    e.preventDefault();
    if (!productId) {
      ue.error("Select a product first");
      return;
    }
    try {
      await createUser.mutateAsync({
        productId: BigInt(productId),
        name,
        email,
        role
      });
      ue.success(`Invitation sent to ${email}`);
      onClose();
    } catch {
      ue.error("Failed to invite user");
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "fixed inset-0 z-50 flex items-center justify-center p-4",
      style: { background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" },
      "data-ocid": "users.dialog",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "w-full max-w-md rounded-2xl p-6",
          style: {
            background: "rgba(8,14,34,0.96)",
            border: "1px solid rgba(91,157,255,0.25)",
            boxShadow: "0 0 64px rgba(91,157,255,0.12), 0 0 120px rgba(147,89,255,0.08)"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-6", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "w-8 h-8 rounded-full flex items-center justify-center",
                    style: { background: "linear-gradient(135deg,#5b9dff,#9359ff)" },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "w-4 h-4 text-white" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-base font-display font-bold text-[#E8E8FF]", children: "Invite User" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-mono text-[rgba(232,232,255,0.35)]", children: "Grant access to a connected product" })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: onClose,
                  "aria-label": "Close invite dialog",
                  "data-ocid": "users.close_button",
                  className: "p-2 rounded-lg hover:bg-[rgba(91,157,255,0.1)] transition-colors",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4 text-[rgba(232,232,255,0.5)]" })
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[10px] font-mono text-[rgba(232,232,255,0.5)] uppercase tracking-widest", children: "Product" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: productId, onValueChange: setProductId, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    SelectTrigger,
                    {
                      "data-ocid": "users.product.select",
                      className: "bg-[rgba(91,157,255,0.06)] border-[rgba(91,157,255,0.18)] text-[#E8E8FF] focus:ring-[rgba(91,157,255,0.3)]",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select product…" })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: products == null ? void 0 : products.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: p.id.toString(), children: p.name }, p.id.toString())) })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[10px] font-mono text-[rgba(232,232,255,0.5)] uppercase tracking-widest", children: "Full Name" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      value: name,
                      onChange: (e) => setName(e.target.value),
                      required: true,
                      placeholder: "Jane Doe",
                      "data-ocid": "users.name.input",
                      className: "bg-[rgba(91,157,255,0.06)] border-[rgba(91,157,255,0.18)] text-[#E8E8FF] placeholder:text-[rgba(232,232,255,0.2)]"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[10px] font-mono text-[rgba(232,232,255,0.5)] uppercase tracking-widest", children: "Role" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: role, onValueChange: setRole, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      SelectTrigger,
                      {
                        "data-ocid": "users.role.select",
                        className: "bg-[rgba(91,157,255,0.06)] border-[rgba(91,157,255,0.18)] text-[#E8E8FF]",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "viewer", children: "Viewer" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "manager", children: "Manager" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "admin", children: "Admin" })
                    ] })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[10px] font-mono text-[rgba(232,232,255,0.5)] uppercase tracking-widest", children: "Email Address" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    type: "email",
                    value: email,
                    onChange: (e) => setEmail(e.target.value),
                    required: true,
                    placeholder: "jane@company.com",
                    "data-ocid": "users.email.input",
                    className: "bg-[rgba(91,157,255,0.06)] border-[rgba(91,157,255,0.18)] text-[#E8E8FF] placeholder:text-[rgba(232,232,255,0.2)]"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 pt-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    type: "button",
                    variant: "outline",
                    onClick: onClose,
                    className: "flex-1",
                    "data-ocid": "users.cancel_button",
                    children: "Cancel"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    type: "submit",
                    disabled: createUser.isPending,
                    className: "flex-1 gap-2",
                    "data-ocid": "users.submit_button",
                    children: createUser.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" }),
                      "Sending…"
                    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "w-4 h-4" }),
                      " Invite User"
                    ] })
                  }
                )
              ] })
            ] })
          ]
        }
      )
    }
  );
}
function SkeletonRows() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: [1, 2, 3, 4, 5].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-[rgba(91,157,255,0.07)]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-8 h-8 rounded-full flex-shrink-0" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-28 rounded" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-2.5 w-40 rounded" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-20 rounded-full" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-16 rounded-full" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-16 rounded-full" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-24 rounded" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-4 rounded" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-5 py-3.5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-7 w-7 rounded-lg" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-7 w-7 rounded-lg" })
    ] }) })
  ] }, i)) });
}
function UsersPage() {
  const [showModal, setShowModal] = reactExports.useState(false);
  const [search, setSearch] = reactExports.useState("");
  const [filterProduct, setFilterProduct] = reactExports.useState("all");
  const [filterRole, setFilterRole] = reactExports.useState("all");
  const [filterStatus, setFilterStatus] = reactExports.useState("all");
  const { data: users, isLoading } = useUsers();
  const { data: products } = useProducts();
  const productMap = new Map(
    (products ?? []).map((p) => [p.id.toString(), p.name])
  );
  const filtered = (users ?? []).filter((u) => {
    const q = search.toLowerCase();
    if (q && !u.name.toLowerCase().includes(q) && !u.email.toLowerCase().includes(q))
      return false;
    if (filterProduct !== "all" && u.productId.toString() !== filterProduct)
      return false;
    if (filterRole !== "all" && roleKey(u.role) !== filterRole) return false;
    if (filterStatus !== "all" && statusKey(u.status) !== filterStatus)
      return false;
    return true;
  });
  const totalCount = (users == null ? void 0 : users.length) ?? 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-5", "data-ocid": "users.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
            style: {
              background: "linear-gradient(135deg,#5b9dff22,#9359ff22)",
              border: "1px solid rgba(91,157,255,0.2)"
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-5 h-5", style: { color: "#7BBDFF" } })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-display font-bold text-[#E8E8FF]", children: "Users" }),
            !isLoading && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "span",
              {
                className: "text-[10px] font-mono px-2 py-0.5 rounded-full",
                style: {
                  background: "rgba(91,157,255,0.12)",
                  color: "#7BBDFF",
                  border: "1px solid rgba(91,157,255,0.2)"
                },
                "data-ocid": "users.count_badge",
                children: [
                  totalCount,
                  " total"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-mono text-[rgba(232,232,255,0.35)] mt-0.5", children: "Manage users across all connected products" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          onClick: () => setShowModal(true),
          className: "gap-2 flex-shrink-0",
          "data-ocid": "users.invite_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "w-4 h-4" }),
            "Invite User"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "rounded-xl p-4 flex flex-wrap items-center gap-3",
        style: {
          background: "rgba(8,14,34,0.7)",
          border: "1px solid rgba(91,157,255,0.1)",
          backdropFilter: "blur(12px)"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 min-w-48", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[rgba(91,157,255,0.5)] pointer-events-none" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                value: search,
                onChange: (e) => setSearch(e.target.value),
                placeholder: "Search name or email…",
                "data-ocid": "users.search_input",
                className: "pl-8 bg-[rgba(91,157,255,0.06)] border-[rgba(91,157,255,0.15)] text-[#E8E8FF] placeholder:text-[rgba(232,232,255,0.25)] h-8 text-xs"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: filterProduct, onValueChange: setFilterProduct, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              SelectTrigger,
              {
                className: "w-40 h-8 text-xs bg-[rgba(91,157,255,0.06)] border-[rgba(91,157,255,0.15)] text-[#E8E8FF]",
                "data-ocid": "users.product_filter.select",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "All Products" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All Products" }),
              products == null ? void 0 : products.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: p.id.toString(), children: p.name }, p.id.toString()))
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: filterRole, onValueChange: setFilterRole, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              SelectTrigger,
              {
                className: "w-32 h-8 text-xs bg-[rgba(91,157,255,0.06)] border-[rgba(91,157,255,0.15)] text-[#E8E8FF]",
                "data-ocid": "users.role_filter.select",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "All Roles" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All Roles" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "admin", children: "Admin" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "manager", children: "Manager" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "viewer", children: "Viewer" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: filterStatus, onValueChange: setFilterStatus, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              SelectTrigger,
              {
                className: "w-32 h-8 text-xs bg-[rgba(91,157,255,0.06)] border-[rgba(91,157,255,0.15)] text-[#E8E8FF]",
                "data-ocid": "users.status_filter.select",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "All Status" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All Status" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "active", children: "Active" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "suspended", children: "Suspended" })
            ] })
          ] }),
          (search || filterProduct !== "all" || filterRole !== "all" || filterStatus !== "all") && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => {
                setSearch("");
                setFilterProduct("all");
                setFilterRole("all");
                setFilterStatus("all");
              },
              className: "h-8 px-2.5 text-[10px] font-mono text-[rgba(232,232,255,0.45)] hover:text-[#E8E8FF] flex items-center gap-1.5 rounded-lg hover:bg-[rgba(91,157,255,0.08)] transition-colors",
              "data-ocid": "users.clear_filters",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-3 h-3" }),
                " Clear"
              ]
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "rounded-xl overflow-hidden",
        style: {
          background: "rgba(8,14,34,0.7)",
          border: "1px solid rgba(91,157,255,0.1)",
          backdropFilter: "blur(12px)"
        },
        children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, {}) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { "data-ocid": "users.loading_state", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SkeletonRows, {}) })
        ] }) : !filtered.length ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          EmptyState,
          {
            hasUsers: totalCount > 0,
            onInvite: () => setShowModal(true)
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, {}) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: filtered.map((user, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            UserRow,
            {
              user,
              index: i + 1,
              productName: productMap.get(user.productId.toString()) ?? "Unknown"
            },
            user.id.toString()
          )) })
        ] })
      }
    ),
    showModal && /* @__PURE__ */ jsxRuntimeExports.jsx(InviteModal, { onClose: () => setShowModal(false) })
  ] });
}
function TableHead() {
  const cols = [
    "User",
    "Product",
    "Role",
    "Status",
    "Last Activity",
    "",
    "Actions"
  ];
  const aligns = [
    "text-left",
    "text-left",
    "text-left",
    "text-left",
    "text-left",
    "text-left",
    "text-right"
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "border-b border-[rgba(91,157,255,0.1)]", children: cols.map((c, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    "th",
    {
      className: `px-5 py-3 ${aligns[i]} text-[10px] font-mono text-[rgba(232,232,255,0.32)] uppercase tracking-widest`,
      children: c
    },
    c || `col-${i}`
  )) });
}
function EmptyState({
  hasUsers,
  onInvite
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "py-20 flex flex-col items-center gap-4",
      "data-ocid": "users.empty_state",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "w-14 h-14 rounded-full flex items-center justify-center",
            style: {
              background: "rgba(91,157,255,0.08)",
              border: "1px solid rgba(91,157,255,0.15)"
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-6 h-6 text-[rgba(91,157,255,0.4)]" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-body font-medium text-[rgba(232,232,255,0.55)]", children: hasUsers ? "No users match your filters" : "No users yet" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-mono text-[rgba(232,232,255,0.28)] mt-1", children: hasUsers ? "Try adjusting your search or filter criteria." : "Invite a user to a connected product to get started." })
        ] }),
        !hasUsers && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            onClick: onInvite,
            variant: "outline",
            className: "gap-2 mt-1",
            "data-ocid": "users.empty_invite_button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
              " Invite First User"
            ]
          }
        )
      ]
    }
  );
}
export {
  UsersPage as default
};
