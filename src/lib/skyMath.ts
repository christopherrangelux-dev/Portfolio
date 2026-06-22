// Spherical astronomy helpers for the Real Night Sky Background feature.
// Formulas follow Jean Meeus, "Astronomical Algorithms" — Julian Date, GMST
// (IAU 1982), Local Sidereal Time, Hour Angle, and the atan2 alt/az form.
// See portfolio-build-doc-v2.md, Section 5, for the derivation/rationale.

const DEG_TO_RAD = Math.PI / 180;
const RAD_TO_DEG = 180 / Math.PI;

/** Julian Date for a UTC Date instance (Meeus 7.1). */
export function getJulianDate(date: Date): number {
	let Y = date.getUTCFullYear();
	let M = date.getUTCMonth() + 1;
	const D =
		date.getUTCDate() +
		(date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600) / 24;

	if (M <= 2) {
		Y -= 1;
		M += 12;
	}

	const A = Math.floor(Y / 100);
	const B = 2 - A + Math.floor(A / 4);

	return (
		Math.floor(365.25 * (Y + 4716)) + Math.floor(30.6001 * (M + 1)) + D + B - 1524.5
	);
}

/** Greenwich Mean Sidereal Time, in hours (0–24), IAU 1982 formula. */
export function getGMSTHours(jd: number): number {
	const T = (jd - 2451545.0) / 36525;
	let gmstDeg =
		280.46061837 +
		360.98564736629 * (jd - 2451545.0) +
		0.000387933 * T * T -
		(T * T * T) / 38710000;
	gmstDeg = ((gmstDeg % 360) + 360) % 360;
	return gmstDeg / 15;
}

/** Local Sidereal Time, in hours (0–24). longitudeDeg is East-positive. */
export function getLSTHours(gmstHours: number, longitudeDeg: number): number {
	return ((gmstHours + longitudeDeg / 15) % 24 + 24) % 24;
}

export interface AltAz {
	alt: number;
	az: number;
}

/**
 * Convert a star's RA/Dec to observed altitude/azimuth for a given UTC date
 * and observer location. raHours: 0–24. decDeg, latDeg, lonDeg: degrees
 * (lonDeg East-positive). Returns degrees: alt (0 = horizon, 90 = zenith),
 * az in standard compass convention (0 = North, 90 = East, clockwise).
 */
export function getAltAz(
	raHours: number,
	decDeg: number,
	date: Date,
	latDeg: number,
	lonDeg: number
): AltAz {
	const jd = getJulianDate(date);
	const gmstHours = getGMSTHours(jd);
	const lstHours = getLSTHours(gmstHours, lonDeg);

	// Hour angle in degrees.
	const haDeg = (lstHours - raHours) * 15;
	const haRad = haDeg * DEG_TO_RAD;

	const latRad = latDeg * DEG_TO_RAD;
	const decRad = decDeg * DEG_TO_RAD;

	const sinAlt =
		Math.sin(latRad) * Math.sin(decRad) +
		Math.cos(latRad) * Math.cos(decRad) * Math.cos(haRad);
	const altRad = Math.asin(sinAlt);

	// Meeus azimuth convention: 0 = South, increasing westward.
	const azMeeusRad = Math.atan2(
		Math.sin(haRad),
		Math.cos(haRad) * Math.sin(latRad) - Math.tan(decRad) * Math.cos(latRad)
	);

	// Convert to standard compass convention: 0 = North, 90 = East, clockwise.
	const azCompassDeg = (azMeeusRad * RAD_TO_DEG + 180) % 360;

	return {
		alt: altRad * RAD_TO_DEG,
		az: azCompassDeg,
	};
}
