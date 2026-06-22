export type Season = 'spring' | 'summer' | 'autumn' | 'winter';

/**
 * Determines the season for a given date using fixed calendar boundaries
 * (not astronomical solstice/equinox dates, which shift year to year):
 *   Spring: Mar 20 – Jun 20
 *   Summer: Jun 21 – Sep 21
 *   Autumn: Sep 22 – Dec 20
 *   Winter: Dec 21 – Mar 19
 *
 * This is the single source of truth for season logic — imported at build
 * time by both Base.astro (site-wide accent colors) and now.astro (the
 * season label), so the boundary logic only lives in one place.
 */
export function getSeason(date: Date = new Date()): Season {
  const month = date.getMonth() + 1;
  const day = date.getDate();

  if ((month === 3 && day >= 20) || month === 4 || month === 5 || (month === 6 && day <= 20)) {
    return 'spring';
  }
  if ((month === 6 && day >= 21) || month === 7 || month === 8 || (month === 9 && day <= 21)) {
    return 'summer';
  }
  if ((month === 9 && day >= 22) || month === 10 || month === 11 || (month === 12 && day <= 20)) {
    return 'autumn';
  }
  return 'winter';
}
