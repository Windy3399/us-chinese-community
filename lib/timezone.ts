/**
 * 时区工具库
 * 将美国州名转换为时区，并格式化本地时间
 */

// 美国各州对应的时区映射
export const STATE_TIMEZONE_MAP: Record<string, string> = {
  // 东部时区
  "Alabama": "America/Chicago",
  "Arkansas": "America/Chicago",
  "Connecticut": "America/New_York",
  "Delaware": "America/New_York",
  "Florida": "America/New_York",
  "Georgia": "America/New_York",
  "Illinois": "America/Chicago",
  "Indiana": "America/Indiana/Indianapolis",
  "Kentucky": "America/Kentucky/Louisville",
  "Louisiana": "America/Chicago",
  "Maine": "America/New_York",
  "Maryland": "America/New_York",
  "Massachusetts": "America/New_York",
  "Michigan": "America/Detroit",
  "Mississippi": "America/Chicago",
  "Missouri": "America/Chicago",
  "New Hampshire": "America/New_York",
  "New Jersey": "America/New_York",
  "New York": "America/New_York",
  "North Carolina": "America/New_York",
  "Ohio": "America/New_York",
  "Oklahoma": "America/Chicago",
  "Pennsylvania": "America/New_York",
  "Rhode Island": "America/New_York",
  "South Carolina": "America/New_York",
  "Tennessee": "America/Chicago",
  "Texas": "America/Chicago",
  "Vermont": "America/New_York",
  "Virginia": "America/New_York",
  "West Virginia": "America/New_York",
  "Wisconsin": "America/Chicago",

  // 中部时区
  "Iowa": "America/Chicago",
  "Kansas": "America/Chicago",
  "Minnesota": "America/Chicago",
  "Nebraska": "America/Chicago",
  "North Dakota": "America/Chicago",
  "South Dakota": "America/Chicago",

  // 山地时区
  "Arizona": "America/Phoenix",
  "Colorado": "America/Denver",
  "Idaho": "America/Denver",
  "Montana": "America/Denver",
  "New Mexico": "America/Denver",
  "Utah": "America/Denver",
  "Wyoming": "America/Denver",

  // 太平洋时区
  "California": "America/Los_Angeles",
  "Nevada": "America/Los_Angeles",
  "Oregon": "America/Los_Angeles",
  "Washington": "America/Los_Angeles",

  // 阿拉斯加
  "Alaska": "America/Anchorage",

  // 夏威夷
  "Hawaii": "Pacific/Honolulu",
};

// 时区显示名称
export const TIMEZONE_DISPLAY_NAMES: Record<string, string> = {
  "America/New_York": "东部时间 (ET)",
  "America/Chicago": "中部时间 (CT)",
  "America/Denver": "山地时间 (MT)",
  "America/Los_Angeles": "太平洋时间 (PT)",
  "America/Detroit": "东部时间 (ET)",
  "America/Indiana/Indianapolis": "东部时间 (ET)",
  "America/Kentucky/Louisville": "东部时间 (ET)",
  "America/Phoenix": "山地时间 (MT)",
  "America/Anchorage": "阿拉斯加时间 (AKT)",
  "Pacific/Honolulu": "夏威夷时间 (HST)",
};

/**
 * 根据州名获取时区
 */
export function getTimezoneByState(state: string): string {
  return STATE_TIMEZONE_MAP[state] || "America/New_York";
}

/**
 * 格式化本地时间显示
 * @param utcDateString ISO 8601 格式���日期字符串
 * @param state 州名
 * @returns 格式化的本地时间字符串
 */
export function formatLocalTime(utcDateString: string, state: string): string {
  try {
    const date = new Date(utcDateString);
    const timezone = getTimezoneByState(state);

    // 使用 Intl.DateTimeFormat 格式化本地时间
    const formatter = new Intl.DateTimeFormat("zh-CN", {
      timeZone: timezone,
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });

    return formatter.format(date);
  } catch (error) {
    console.error("Failed to format local time:", error);
    return utcDateString;
  }
}

/**
 * 格式化相对时间（如：3小时前）
 */
export function formatRelativeTime(utcDateString: string, state: string): string {
  try {
    const date = new Date(utcDateString);
    const timezone = getTimezoneByState(state);

    // 转换为目标时区的时间
    const options: Intl.DateTimeFormatOptions = {
      timeZone: timezone,
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };

    const formatter = new Intl.DateTimeFormat("zh-CN", options);
    const localDate = formatter.formatToParts(date);

    // 提取年、月、日、时、分
    const parts: Record<string, string> = {};
    localDate.forEach(part => {
      parts[part.type] = part.value;
    });

    // 构建日期对象以计算相对时间
    const [month, day, year] = [parts.month, parts.day, parts.year];
    const [hour, minute] = [parts.hour, parts.minute];
    const localTime = new Date(`${month} ${day}, ${year} ${hour}:${minute}`);

    const now = new Date();
    const diffMs = now.getTime() - localTime.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "刚刚";
    if (diffMins < 60) return `${diffMins}分钟前`;
    if (diffHours < 24) return `${diffHours}小时前`;
    if (diffDays < 30) return `${diffDays}天前`;

    return formatter.format(date);
  } catch (error) {
    console.error("Failed to format relative time:", error);
    return utcDateString;
  }
}

/**
 * 获取时区显示名称
 */
export function getTimezoneDisplayName(state: string): string {
  const timezone = getTimezoneByState(state);
  return TIMEZONE_DISPLAY_NAMES[timezone] || timezone;
}

/**
 * 获取当前在指定时区的时间
 */
export function getCurrentTimeInTimezone(state: string): Date {
  const timezone = getTimezoneByState(state);
  const now = new Date();

  try {
    // 使用 toLocaleString 获取时区时间字符串，然后解析回 Date
    const timeString = now.toLocaleString("en-US", { timeZone: timezone });
    return new Date(timeString);
  } catch {
    return now;
  }
}
