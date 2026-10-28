# DOCUMENT 02 — ASTRONOMY, MATHEMATICS AND CHART CALCULATION SPECIFICATION

## 1. Coordinate Systems and Reference Frames

Constructing an astrological chart from birth data requires transforming an instant of civil time and a geodetic location on the oblate Earth into spherical coordinates on the celestial sphere. Vyom uses four primary astronomical coordinate frames, following the conventions of [Jean Meeus's *Astronomical Algorithms* (2nd Edition, 1998)](https://auass.com/wp-content/uploads/2021/01/Astronomical-Algorithms.pdf) and the [NASA JPL DE440/DE441 Planetary and Lunar Ephemerides](https://ssd.jpl.nasa.gov/doc/Park.2021.AJ.DE440.pdf):

1. **Geodetic Terrestrial Frame $(\phi, \lambda, h)$**:
   - Geodetic latitude $\phi \in [-90^\circ, +90^\circ]$ (North positive, South negative).
   - Geodetic longitude $\lambda \in [-180^\circ, +180^\circ]$ (East positive, West negative in IAU/Meeus modern standard; note that Meeus 1998 Ch. 12 occasionally wrote West positive in older US Naval Observatory notation—Vyom standardizes strictly on **East positive** across all code and schemas).
   - Geocentric latitude $\phi'$ for topocentric parallax corrections on the WGS-84 ellipsoid ($f = 1/298.257223563$, $b/a = 1 - f = 0.996647189335$):
     $$\tan U = (1 - f)\tan\phi, \qquad \rho\sin\phi' = (1 - f)\sin U + \frac{h}{6378137}\sin\phi, \qquad \rho\cos\phi' = \cos U + \frac{h}{6378137}\cos\phi$$
2. **Equatorial Coordinate System $(\alpha, \delta)$**:
   - **Right Ascension ($\alpha$)**: Measured eastward along the celestial equator from the true vernal equinox of date ($\Upsilon$), expressed in degrees $[0^\circ, 360^\circ)$ or hours $[0^{\text{h}}, 24^{\text{h}})$ where $1^{\text{h}} = 15^\circ$.
   - **Declination ($\delta$)**: Angular distance north ($+$) or south ($-$) of the celestial equator, $\delta \in [-90^\circ, +90^\circ]$.
3. **Ecliptic Coordinate System $(\lambda_{\text{ecl}}, \beta_{\text{ecl}})$**:
   - **Ecliptic Longitude ($\lambda_{\text{ecl}}$)**: Measured eastward along the ecliptic (the plane of the Earth-Moon barycenter's orbit around the Sun) from the vernal equinox ($\lambda_{\text{trop}}$) or from a fixed sidereal fiducial point ($\lambda_{\text{sid}}$), $\lambda_{\text{ecl}} \in [0^\circ, 360^\circ)$.
   - **Ecliptic Latitude ($\beta_{\text{ecl}}$)**: Angular distance perpendicular to the ecliptic plane, $\beta_{\text{ecl}} \in [-90^\circ, +90^\circ]$. By definition, for the Sun, $\beta_{\odot} \approx 0^\circ$ (within $1.2''$).
4. **Horizontal (Topocentric Horizon) System $(A, h_{\text{alt}})$**:
   - **Altitude ($h_{\text{alt}}$)**: Angular elevation above the local horizon ($0^\circ$ at geometric horizon; $-0^\circ 50'$ for standard atmospheric sunrise/sunset).
   - **Azimuth ($A$)**: Measured along the horizon.

---

## 2. Time Scales, Julian Day, and Historical Civil Time Normalization

### 2.1 Time Scales
Astronomical ephemerides are indexed by dynamical time (uniform atomic/ephemeris time), whereas Earth's rotation (which governs the Ascendant and house cusps) is indexed by Universal Time:
- **UTC (Coordinated Universal Time)**: Civil atomic time broadcast since 1972, kept within $0.9\text{ s}$ of $\text{UT1}$ via leap seconds.
- **UT1 (Universal Time)**: Directly proportional to the Earth's rotation angle ($\text{ERA}$). Required for computing Greenwich Mean Sidereal Time ($\text{GMST}$), Local Sidereal Time ($\text{LST}$), Ascendant, and house cusps.
- **TAI (International Atomic Time)**: Continuous atomic scale where $\text{TAI} - \text{UTC} = \Delta_{\text{AT}}$ ($37\text{ s}$ as of 2017–2026).
- **TT (Terrestrial Time / Ephemeris Time)**: Uniform time argument for solar, lunar, and planetary equations of motion:
  $$\text{TT} = \text{TAI} + 32.184\text{ s}, \qquad \Delta T = \text{TT} - \text{UT1}$$

### 2.2 Formula Specification 1: Julian Day Number ($\text{JD}$)
- **Mathematical Definition** ([Jean Meeus, *Astronomical Algorithms*, 1998, Ch. 7, p. 60–61](https://auass.com/wp-content/uploads/2021/01/Astronomical-Algorithms.pdf)):
  Given civil year $Y$, month $M \in \{1..12\}$, day $D$ with fractional UTC hour $h_{\text{UT}} \in [0, 24)$:
  1. Set $D_{\text{frac}} = D + \frac{h_{\text{UT}}}{24.0}$.
  2. If $M \le 2$, replace $Y \leftarrow Y - 1$ and $M \leftarrow M + 12$.
  3. For the **Gregorian Calendar** (adopted October 15, 1582 in Catholic Europe; September 14, 1752 in Britain/Colonies/India):
     $$A = \lfloor Y / 100 \rfloor, \qquad B = 2 - A + \lfloor A / 4 \rfloor$$
     For the **Julian Calendar**, set $B = 0$.
  4. Compute:
     $$\text{JD}_{\text{UT}} = \lfloor 365.25(Y + 4716) \rfloor + \lfloor 30.6001(M + 1) \rfloor + D_{\text{frac}} + B - 1524.5$$
- **Variables & Units**: $Y \in \mathbb{Z}$ (astronomical year, where $0 = 1\text{ BCE}$, $-1 = 2\text{ BCE}$), $M \in \{1..12\}$, $D_{\text{frac}} \in \mathbb{R}$, output $\text{JD}_{\text{UT}}$ in days since $-4712\text{-01-01 } 12:00\text{ UT}$.
- **Valid Input Range**: All positive Julian Days ($\text{JD} \ge 0$, i.e., years $\ge -4712$).
- **Numerical Example & Expected Output**:
  - Input: $1987\text{-04-10 at } 00:00:00\text{ UT}$ ($Y=1987, M=4, D_{\text{frac}}=10.0$).
  - Intermediate: $A = 19$, $B = 2 - 19 + 4 = -13$.
  - $\text{JD}_{\text{UT}} = \lfloor 365.25 \times 6703 \rfloor + \lfloor 30.6001 \times 5 \rfloor + 10.0 - 13 - 1524.5 = 2448270 + 153 + 10 - 13 - 1524.5 = 2446895.5$.
- **Independent Verification**: Matches Jean Meeus (*Astronomical Algorithms*, Example 12.a, p. 88) exactly: $\text{JD} = 2446895.5$.

### 2.3 Formula Specification 2: Greenwich & Local Sidereal Time ($\text{GMST}$, $\text{GAST}$, $\text{LST}$)
- **Mathematical Definition** ([Meeus Ch. 12, Eq. 12.4](https://auass.com/wp-content/uploads/2021/01/Astronomical-Algorithms.pdf)):
  Let $T_{\text{UT}} = \frac{\text{JD}_{\text{UT}} - 2451545.0}{36525.0}$ be Julian centuries from J2000.0 ($2000\text{-01-01 } 12:00\text{ UT}$). The Greenwich Mean Sidereal Time in degrees is:
  $$\theta_0 = \left(280.46061837 + 360.98564736629(\text{JD}_{\text{UT}} - 2451545.0) + 0.000387933 T_{\text{UT}}^2 - \frac{T_{\text{UT}}^3}{38710000.0}\right) \bmod 360^\circ$$
  Greenwich Apparent Sidereal Time ($\text{GAST}$) adds the equation of the equinoxes ($\Delta\psi \cos\varepsilon$, where $\Delta\psi$ is nutation in longitude and $\varepsilon = \varepsilon_0 + \Delta\varepsilon$ is true obliquity):
  $$\theta_{\text{app}} = \theta_0 + \Delta\psi \cos\varepsilon$$
  Local Sidereal Time ($\text{LST}$, equivalent to the Right Ascension of the Midheaven, $\text{RAMC}$) at East longitude $\lambda_{\text{E}}$ is:
  $$\text{LST} = \text{RAMC} = (\theta_{\text{app}} + \lambda_{\text{E}}) \bmod 360^\circ$$
- **Numerical Example & Expected Output**:
  - Input: $\text{JD}_{\text{UT}} = 2446895.5$ ($1987\text{-04-10 } 00:00\text{ UT}$).
  - Executed via `vyom_calc_engine.py`: $\theta_0 = 197.693195^\circ = 197^\circ 41' 35.50''$ ($13^{\text{h}} 10^{\text{m}} 46.3668^{\text{s}}$).
  - For New Delhi ($\lambda_{\text{E}} = +77.2090^\circ$) on $2000\text{-01-01 } 06:30:00\text{ UT}$ ($\text{JD}_{\text{UT}} = 2451544.77083333$): $\text{LST} = 274.943741^\circ$.

---

## 3. Obliquity, Precession, Nutation, and Coordinate Transformations

### 3.1 Formula Specification 3: Obliquity of the Ecliptic ($\varepsilon_0, \varepsilon$)
- **Mathematical Definition** (IAU / Laskar 10th-degree polynomial, [Meeus Ch. 22, Eq. 22.2–22.3](https://auass.com/wp-content/uploads/2021/01/Astronomical-Algorithms.pdf)):
  Let $T = \frac{\text{JD}_{\text{TT}} - 2451545.0}{36525.0}$ be Julian centuries of Terrestrial Time from J2000.0. Mean obliquity $\varepsilon_0$ is:
  $$\varepsilon_0 = 23^\circ 26' 21.448'' - 46.8150'' T - 0.00059'' T^2 + 0.001813'' T^3$$
  True obliquity $\varepsilon = \varepsilon_0 + \Delta\varepsilon$, where $\Delta\varepsilon \approx +9.20'' \cos\Omega_{\text{Moon}} + 0.57'' \cos(2L_{\odot})$ is nutation in obliquity.
- **Numerical Example**: At $2000\text{-01-01 } 06:30:00\text{ UT}$ ($T = -0.00000625$), $\varepsilon_0 = 23.439291^\circ$ ($23^\circ 26' 21.45''$).

### 3.2 Formula Specification 4: Ecliptic $\leftrightarrow$ Equatorial Transformation
- **Ecliptic $(\lambda_{\text{ecl}}, \beta_{\text{ecl}})$ to Equatorial $(\alpha, \delta)$**:
  $$\tan\alpha = \frac{\sin\lambda_{\text{ecl}}\cos\varepsilon - \tan\beta_{\text{ecl}}\sin\varepsilon}{\cos\lambda_{\text{ecl}}}, \qquad \sin\delta = \sin\beta_{\text{ecl}}\cos\varepsilon + \cos\beta_{\text{ecl}}\sin\varepsilon\sin\lambda_{\text{ecl}}$$
  (Evaluated via two-argument `atan2(y, x)` to preserve quadrant).
- **Equatorial $(\alpha, \delta)$ to Ecliptic $(\lambda_{\text{ecl}}, \beta_{\text{ecl}})$**:
  $$\tan\lambda_{\text{ecl}} = \frac{\sin\alpha\cos\varepsilon + \tan\delta\sin\varepsilon}{\cos\alpha}, \qquad \sin\beta_{\text{ecl}} = \sin\delta\cos\varepsilon - \cos\delta\sin\varepsilon\sin\alpha$$

---

## 4. Horizon Angles and House Cusp Mathematics

### 4.1 Formula Specification 5: Tropical Ascendant ($\lambda_{\text{Asc}}$) and Midheaven ($\lambda_{\text{MC}}$)
- **Mathematical Definition**:
  Given $\text{RAMC} = \text{LST} \in [0^\circ, 360^\circ)$, observer geodetic latitude $\phi$, and true obliquity $\varepsilon$:
  1. **Midheaven (Tenth Cusp / $\text{MC}$)**: The intersection of the local meridian with the ecliptic:
     $$\lambda_{\text{MC}} = \operatorname{atan2}\left(\sin(\text{RAMC}),\, \cos(\text{RAMC})\cos\varepsilon\right) \bmod 360^\circ$$
     *(Quadrant check: $\text{MC}$ must lie in the same right-ascension quadrant as $\text{RAMC}$, guaranteed by two-argument `atan2`).*
  2. **Ascendant (First Cusp / *Udaya Lagna*)**: The point of the ecliptic rising on the eastern horizon ($h_{\text{alt}} = 0^\circ$, $\beta_{\text{ecl}} = 0^\circ$):
     $$\lambda_{\text{Asc}} = \operatorname{atan2}\left(\cos(\text{RAMC}),\, -\sin(\text{RAMC})\cos\varepsilon - \tan\phi\sin\varepsilon\right) \bmod 360^\circ$$
  3. **Imum Coeli ($\text{IC}$) and Descendant ($\text{Desc}$)**:
     $$\lambda_{\text{IC}} = (\lambda_{\text{MC}} + 180^\circ) \bmod 360^\circ, \qquad \lambda_{\text{Desc}} = (\lambda_{\text{Asc}} + 180^\circ) \bmod 360^\circ$$
- **Valid Input Range**: $|\phi| < 90^\circ - \varepsilon \approx 66.56^\circ$. At polar latitudes $|\phi| \ge 66.56^\circ$, when the vernal/autumnal points align with the horizon, all ecliptic points rise/set simultaneously and the Ascendant undergoes a $180^\circ$ discontinuity.
- **Numerical Example & Verification**:
  - Input: $2000\text{-01-01 } 12:00:00\text{ IST}$ ($06:30:00\text{ UTC}$), New Delhi ($\phi = 28.6139^\circ\text{N}$, $\lambda = 77.2090^\circ\text{E}$).
  - $\text{RAMC} = 274.943741^\circ$, $\varepsilon = 23.439291^\circ$.
  - $\lambda_{\text{MC, trop}} = 274.537572^\circ = \text{Capricorn } 04^\circ 32' 15.26''$.
  - $\lambda_{\text{Asc, trop}} = 7.047631^\circ = \text{Aries } 07^\circ 02' 51.47''$.
  - Subtracting Lahiri Ayanamsha ($23^\circ 51' 25.50''$): $\lambda_{\text{Asc, sid}} = 343.190547^\circ = \text{Meena (Pisces) } 13^\circ 11' 25.97''$.

### 4.2 Mathematical Specification of Major House Systems
Different traditions partition the diurnal rotation or space between horizon and meridian using distinct geometric projections:

| House System | Mathematical Algorithm | Polar Behavior ($|\phi| > 66.56^\circ$) | Primary Tradition Usage |
| :--- | :--- | :--- | :--- |
| **Whole Sign (*Rashi = Bhava*)** | Let $s_{\text{Asc}} = \lfloor \lambda_{\text{Asc}} / 30^\circ \rfloor$. House $k \in \{1..12\}$ spans $[((s_{\text{Asc}} + k - 1) \bmod 12) \times 30^\circ,\; +30^\circ)$. The Ascendant degree acts as a sensitive point inside the 1st House; $\text{MC}$ floats into whichever sign it occupies (usually 9th, 10th, or 11th). | Defined everywhere except at the exact instant of horizon/ecliptic coincidence. | Classical Parashari Jyotisha, Jaimini, Hellenistic (*Valens*, *Dorotheus*). |
| **Equal House** | Cusp $k$ is defined by $\lambda_k = (\lambda_{\text{Asc}} + (k-1)\times 30^\circ) \bmod 360^\circ$. | Defined whenever $\lambda_{\text{Asc}}$ is defined. | Classical Western, some modern Vedic interpretations. |
| **Porphyry / *Sripati Bhava Chalita*** | Trisects the ecliptic arcs between the four cardinal angles: let $\Delta_{\text{Q1}} = (\lambda_{\text{Asc}} - \lambda_{\text{MC}}) \bmod 360^\circ$ and $\Delta_{\text{Q4}} = (\lambda_{\text{IC}} - \lambda_{\text{Asc}}) \bmod 360^\circ$. In **Porphyry**, those arcs are divided into 3 equal segments to yield Cusps 11, 12, 2, 3. In **Sripati** (*Bhava Chalita*), the angles $\lambda_{\text{Asc}}$ and $\lambda_{\text{MC}}$ are the **midpoints (*Bhava Madhya*)** of Houses 1 and 10, and the midpoints of adjacent houses are bisected to form the house boundaries (*Bhava Sandhi*). | Defined wherever $\text{Asc}$ and $\text{MC}$ are non-collinear. | Late Medieval Indian (*Sripati Paddhati*, 11th c. CE), Late Antique Western (Porphyry). |
| **Placidus (Time-Proportional)** | Trisects the **diurnal/nocturnal semi-arc** of each ecliptic degree. For Cusp $k \in \{11, 12, 2, 3\}$, solve iteratively via fixed-point iteration: $\alpha_k = \text{RAMC} + f_k \cdot \text{DSA}(\delta(\lambda_k))$, where $\text{DSA}(\delta) = 90^\circ + \arcsin(\tan\phi\tan\delta)$, $f_{11}=1/3, f_{12}=2/3$, and $\tan\lambda_k = \frac{\sin\alpha_k}{\cos\alpha_k\cos\varepsilon}$. | **Fails mathematically** when $|\delta| \ge 90^\circ - |\phi|$ ($\tan\phi\tan\delta \ge 1$), as circumpolar ecliptic degrees have no semi-arc. | Modern Western Natal, Krishnamurti Paddhati (KP). |
| **Regiomontanus (Equatorial Projection)** | Divides the celestial equator into $30^\circ$ segments from the East point and projects great circles through the North and South horizon points onto the ecliptic: $\tan\lambda_k = \frac{\sin(\text{RAMC} + H_k)\cos\varepsilon + \tan\phi\sin H_k\sin\varepsilon}{\cos(\text{RAMC} + H_k)}$. | Defined up to high latitudes. | Renaissance Horary (William Lilly, *Christian Astrology*). |
| **Campanus (Prime Vertical)** | Divides the Prime Vertical (East-Zenith-West circle) into twelve $30^\circ$ equal segments and projects them through the North-South horizon points onto the ecliptic. | Defined up to polar circles; produces extreme distortion near poles. | Medieval Western & Mundane. |

---

## 5. Ayanamsha Systems and Sidereal Reduction

The **Tropical Zodiac** (*Sayana*) is anchored to the moving vernal equinox ($\Upsilon$, where the Sun crosses the celestial equator northward). Due to luni-solar gravitational torque on Earth's equatorial bulge, Earth's rotation axis precesses westward with a period of $\sim 25,772$ years ($\sim 50.288''/\text{year}$ or $1^\circ$ every $71.6$ years). The **Sidereal Zodiac** (*Nirayana*) remains anchored to the background fixed stars (specifically *Yogataras* of the Nakshatras). The angular separation between the two zero-points at epoch $t$ is the **Ayanamsha** $A(t)$:
$$\lambda_{\text{sidereal}}(t) = \left(\lambda_{\text{tropical}}(t) - A(t)\right) \bmod 360^\circ$$

### Comparison of Major Ayanamsha Definitions in Vyom

| Ayanamsha System | Anchoring Definition / Fiducial Star | Value at 1956-03-21 0h UT | Value at J2000.0 (2000-01-01 12h TT) | Value at 2026-01-01 | Primary Usage & Provenance |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Lahiri (*Chitrapaksha*)** | Adopted by the [Government of India Calendar Reform Committee (N.C. Lahiri, 1955)](https://roxyapi.com/blogs/ayanamsa-lahiri-raman-kp-developers) for the *Rashtriya Panchang* and *Indian Astronomical Ephemeris*. Anchored so that Spica (*Chitra*, $\alpha$ Virginis) lies at $180^\circ 00'$ (0° Tula/Libra) at the zero-precession epoch (~285 CE). | $23^\circ 15' 00.658''$ | $23^\circ 51' 25.53''$ ($23.85709^\circ$) | $24^\circ 13' 13.0''$ ($24.2203^\circ$) | Official Indian standard; default for 95%+ of Parashari Vedic charts. |
| **True Chitrapaksha (*Spica at 180°*)** | Dynamically locks the apparent position of $\alpha$ Virginis (including proper motion and nutation) strictly to $180^\circ 00' 00''$ at every instant $t$. | $23^\circ 14' 54''$ | $23^\circ 51' 11''$ | $24^\circ 12' 58''$ | Preferred by precision sidereal researchers (e.g., Jagannatha Hora true-star mode). |
| **Krishnamurti Paddhati (KP Old / New)** | Formulated by Prof. K.S. Krishnamurti using Newcomb's precession rate ($50.2388475''/\text{yr}$) from a zero-ayanamsha year of 291 CE; differs from Lahiri by $\sim 6'$ (arcminutes). | $23^\circ 08' 56''$ | $23^\circ 45' 02''$ ($23.7506^\circ$) | $24^\circ 06' 48''$ | Mandatory for KP Sub-Lord calculations (where $6'$ can shift a Sub-Lord). |
| **B.V. Raman** | Formulated by Dr. B.V. Raman (*Notable Horoscopes*, 1950) with zero-year 397 CE; approximately $1^\circ 26'$ smaller than Lahiri. | $21^\circ 48' 05''$ | $22^\circ 24' 16''$ ($22.4044^\circ$) | $22^\circ 46' 02''$ | Used solely when replicating charts from B.V. Raman's published works. |
| **Fagan-Bradley (Western Sidereal)** | Formulated by Cyril Fagan and Donald Bradley (1950) based on Babylonian fiducial star alignments (Spica at $29^\circ 06'$ Virgo); $\sim 0^\circ 53'$ larger than Lahiri. | $24^\circ 08' 14''$ | $24^\circ 44' 11''$ ($24.7364^\circ$) | $25^\circ 05' 58''$ | Standard in Western Sidereal astrology. |
| **Pushya-Paksha** | Proposed by [P.V.R. Narasimha Rao](https://www.vedicastrologer.org/) anchoring $\delta$ Cancri (Pushya *Yogatara*) at $106^\circ 00' 00''$ (Cancer $16^\circ 00'$); $\sim 1^\circ 04'$ smaller than Lahiri. | $22^\circ 11' 10''$ | $22^\circ 47' 21''$ | $23^\circ 09' 08''$ | Specialized research lineage in *Jagannatha Hora*. |

---

## 6. Planetary Kinematics: Apparent Retrograde Motion, Stations, and Nodes

### 6.1 Apparent Retrograde Motion (*Vakri*)
In physical celestial mechanics, all planets orbit the Sun in the same prograde counter-clockwise direction (as viewed from north of the ecliptic). **Apparent retrograde motion** is purely a coordinate-frame transformation artifact resulting from observing a moving planet from a moving Earth whose orbital velocity ($v_{\oplus} \approx 29.78\text{ km/s}$, Kepler's Third Law $v \propto r^{-1/2}$) differs from that of the target planet:
- Let $\dot{\lambda} = \frac{d\lambda_{\text{ecl}}}{dt}$ be the geocentric apparent longitudinal angular velocity (computed via central finite differences or analytic differentiation of the Chebyshev polynomial ephemeris):
  - **Direct (*Margi*)**: $\dot{\lambda} > +0.0005^\circ/\text{day}$.
  - **Stationary Retrograde (*Vakrarambha* / Station R)**: $\dot{\lambda}$ crosses $0^\circ/\text{day}$ from positive to negative.
  - **Retrograde (*Vakri*)**: $\dot{\lambda} < -0.0005^\circ/\text{day}$.
  - **Stationary Direct (*Anuvakra* / Station D)**: $\dot{\lambda}$ crosses $0^\circ/\text{day}$ from negative to positive.
- **Luminaries**: The Sun ($\dot{\lambda}_{\odot} \approx +0.9856^\circ/\text{day}$) and Moon ($\dot{\lambda}_{\mathbb{C}} \approx +13.176^\circ/\text{day}$) are **never** retrograde.
- **Lunar Nodes (Rahu & Ketu)**: The intersection line of the Moon's orbital plane ($i \approx 5.145^\circ$) with the ecliptic regresses westward due to solar gravitational perturbation at a mean rate of $-0.05295^\circ/\text{day}$ ($18.61$-year cycle). Thus, the **Mean Node** is perpetually retrograde ($\dot{\lambda}_{\Omega,\text{mean}} = -3' 10.6''/\text{day}$), whereas the **True (Osculating) Node** wobbles and exhibits short periods of direct motion twice a month when the Moon crosses the nodes or is at quadrature.

### 6.2 Reference Ephemeris Interpolation (Chebyshev & Besselian)
1. **Production Ephemeris (JPL DE440 / Swiss Ephemeris)**: Stores barycentric Cartesian positions $(X, Y, Z)$ as Chebyshev polynomials over 16-day or 32-day granules. Evaluating the Chebyshev recurrence $T_n(x) = 2xT_{n-1}(x) - T_{n-2}(x)$ yields positions accurate to $< 0.001''$ (1 milli-arcsecond) and velocities $\dot{X}, \dot{Y}, \dot{Z}$ via the derivative recurrence.
2. **Tabular Ephemeris Interpolation (3-Point Besselian / Meeus Ch. 3)**: When interpolating tabular daily ephemeris values $y_1, y_2, y_3$ at intervals $\Delta t$ (after unwrapping $360^\circ \leftrightarrow 0^\circ$ wrap-around discontinuities!):
   $$a = y_2 - y_1, \quad b = y_3 - y_2, \quad c = b - a, \quad y(n) = y_2 + \frac{n}{2}(a + b + n c)$$
   where $n = \frac{t - t_2}{\Delta t} \in [-0.5, +0.5]$. Station time ($dy/dn = 0$) occurs at $n_0 = -\frac{a+b}{2c}$.
