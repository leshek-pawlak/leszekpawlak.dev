export type TimeOfDay = "day" | "evening" | "night";

export function getTimeOfDay(hour: number): TimeOfDay {
  if (hour >= 6 && hour < 18) return "day";
  if (hour >= 18 && hour < 22) return "evening";
  return "night";
}

export const timeThemeScript = `
(function() {
  var h = new Date().getHours();
  var t = (h >= 6 && h < 18) ? 'day' : (h >= 18 && h < 22) ? 'evening' : 'night';
  document.documentElement.setAttribute('data-time', t);
})();
`;
