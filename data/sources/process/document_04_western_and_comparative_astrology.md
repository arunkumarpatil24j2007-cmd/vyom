# DOCUMENT 04 — WESTERN AND COMPARATIVE ASTROLOGY

## 1. Architectural Separation of Astrological Traditions

A foundational requirement of the Vyom platform is that **knowledge of one tradition must never be conflated with knowledge of all astrology**. While Vedic, Hellenistic, Medieval Perso-Arabic, Renaissance, and Modern Western horoscopy share a common Greco-Babylonian mathematical ancestry (ecliptic longitudes, horizon Ascendant, and 12-fold sign/house division), their zodiacal zero-points, planetary sets, aspect mechanics, dignity tables, and timing algorithms differ fundamentally. East Asian traditions (Chinese *BaZi* and *Zi Wei Dou Shu*) operate on entirely distinct calendrical and sexagenary coordinate spaces.

In Vyom, every tradition is implemented as an isolated software module (`tradition_id`) consuming the shared Tier 1 `AstronomicalState` and emitting its own strongly typed `TraditionFeatureSet`.

---

## 2. Hellenistic Astrology (c. 150 BCE – 600 CE)

Grounded in [Vettius Valens's *Anthologies* (trans. Mark T. Riley)](https://www.goodreads.com/book/show/63102476-the-anthology), Dorotheus of Sidon's *Carmen Astrologicum*, [Claudius Ptolemy's *Tetrabiblos*](https://raw.githubusercontent.com/janegca/latex-valens/main/Valens-Anthologies-Annotated.pdf), Paulus Alexandrinus, and modern textual reconstruction by [Chris Brennan (*Hellenistic Astrology: The Study of Fate and Fortune*, 2017)](https://www.goodreads.com/book/show/63102476-the-anthology):

### 2.1 Core Technical Doctrines
1. **Sect (*Hairesis*)**: Every chart is classified strictly as a **Day Chart (Diurnal)** if the Sun is above the horizon ($h_{\text{alt},\odot} \ge 0^\circ$, i.e., $\lambda_{\odot}$ lies on the semi-circle from $\lambda_{\text{Desc}}$ back to $\lambda_{\text{Asc}}$ via $\lambda_{\text{MC}}$) or a **Night Chart (Nocturnal)** if the Sun is below the horizon:
   - **Diurnal Sect**: Led by the **Sun**, supported by **Jupiter** and **Saturn**. In a day chart, Jupiter is the most constructive benefic and Saturn is the more constructive/disciplined malefic, while Mars is the primary out-of-sect (*contrary to sect*) malefic.
   - **Nocturnal Sect**: Led by the **Moon**, supported by **Venus** and **Mars**. In a night chart, Venus is the primary benefic and Mars is the more constructive malefic, while Saturn is the primary out-of-sect malefic.
   - **Planetary Joys (*Chara*)**: Mercury rejoices in the **1st House** (*Helm*), Moon in the **3rd** (*Goddess*), Venus in the **5th** (*Good Fortune*), Mars in the **6th** (*Bad Fortune*), Sun in the **9th** (*God*), Jupiter in the **11th** (*Good Spirit*), and Saturn in the **12th** (*Bad Spirit*).
2. **Whole Sign Houses (*Topoi*) with Floating Angles**: The entire sign containing $\lambda_{\text{Asc}}$ is the 1st Place (*Horoskopos*), and subsequent signs form Places 2 through 12. The exact degree of the Midheaven ($\lambda_{\text{MC}}$) is also calculated and may fall in the 9th, 10th, or 11th Whole Sign house, adding angular signification to whichever sign it occupies.
3. **Whole-Sign vs. Degree-Based Aspects & *Bonification / Maltreatment***:
   - Aspects (*Martyria* / witnessing) occur primarily by sign configuration: Conjunction (*Synodos* / co-presence, $0^\circ$), Sextile ($60^\circ$), Square ($90^\circ$), Trine ($120^\circ$), and Opposition ($180^\circ$).Signs 2, 6, 8, and 12 from a reference sign are in **Aversion (*Apostrophe*)**—they cannot "see" the reference sign.
   - **Superior (Overcoming / *Kathuperteresis*)**: A planet in an earlier zodiacal sign looking forward at a planet in a later sign via the **10th house (right-hand square)** or **9th house (right-hand trine)** "overcomes" and dominates the later planet.
4. **Hermetic Lots (*Kleroi*)**:
   - **Lot of Fortune (*Tyche*)**:
     $$\lambda_{\text{Fortune}} = \begin{cases} (\lambda_{\text{Asc}} + \lambda_{\mathbb{C}} - \lambda_{\odot}) \bmod 360^\circ & \text{(Day Chart)} \\ (\lambda_{\text{Asc}} + \lambda_{\odot} - \lambda_{\mathbb{C}}) \bmod 360^\circ & \text{(Night Chart)} \end{cases}$$
   - **Lot of Spirit (*Daimon*)**: Reverses the luminary subtraction of Fortune:
     $$\lambda_{\text{Spirit}} = \begin{cases} (\lambda_{\text{Asc}} + \lambda_{\odot} - \lambda_{\mathbb{C}}) \bmod 360^\circ & \text{(Day Chart)} \\ (\lambda_{\text{Asc}} + \lambda_{\mathbb{C}} - \lambda_{\odot}) \bmod 360^\circ & \text{(Night Chart)} \end{cases}$$
   *(Note: Ptolemy in Tetrabiblos 3.10 controversially used the diurnal formula for both day and night charts; Valens, Dorotheus, and Paulus strictly reverse by sect. Vyom defaults to sect-reversed Valens/Dorotheus and supports Ptolemaic unreversed via configuration).*

### 2.2 Hellenistic Time-Lord Systems (*Chronocrators*)
1. **Annual Profections (*Epipedo*)**: At birth (Age $0$), the 1st Whole Sign house is activated. On each solar birthday at Age $A \in \mathbb{N}_0$, the profected sign advances by 1 sign per year:
   $$\text{Profected House Index (1..12)} = (A \bmod 12) + 1, \qquad \text{Profected Sign} = (\text{Sign}(\text{Asc}) + A) \bmod 12$$
   The traditional planetary ruler of the profected sign becomes the **Lord of the Year (*Chronocrator*)**, governing natal and transit activations for those 12 months.
2. **Zodiacal Releasing (*Aphesis*, [Vettius Valens, *Anthologies* Book IV](https://www.goodreads.com/book/show/63102476-the-anthology))**:
   - Starting from the sign of the **Lot of Spirit** (for career/action) or **Lot of Fortune** (for bodily health and circumstances), time is partitioned into Level 1 (L1, years), Level 2 (L2, months, $1/12$ of years = $30\text{-day}$ months), Level 3 (L3, days), and Level 4 (L4, hours) according to Egyptian planetary minor years assigned to each sign's domicile lord (using $360$-day years):
     - **Aries**: $15\text{y}$ | **Taurus**: $8\text{y}$ | **Gemini**: $20\text{y}$ | **Cancer**: $25\text{y}$ | **Leo**: $19\text{y}$ | **Virgo**: $20\text{y}$ | **Libra**: $8\text{y}$ | **Scorpio**: $15\text{y}$ | **Sagittarius**: $12\text{y}$ | **Capricorn**: $27\text{y}$ | **Aquarius**: $30\text{y}$ | **Pisces**: $12\text{y}$.
   - **Loosing of the Bond (*Syndesmou Lysis*)**: When L2 cycles through all 12 signs and returns for a second pass to the starting sign of the current L1 period (whenever the L1 sign has $> 17.5\text{ years}$, i.e., Cancer $25\text{y}$, Leo $19\text{y}$, Virgo/Gemini $20\text{y}$, Capricorn $27\text{y}$, Aquarius $30\text{y}$), instead of repeating the starting sign at L2, the sequence **jumps directly to the opposite (7th) sign**, signaling a major pivot or reversal in life direction.

---

## 3. Medieval Perso-Arabic, Renaissance, and Modern Western Astrology

### 3.1 Essential Dignities and Scoring Table (Ptolemaic vs. Dorothean/Lilly)
In Medieval and Renaissance Western astrology ([Abu Ma'shar](https://www.renaissanceastrology.com/albiruni.html), [Al-Biruni](https://www.renaissanceastrology.com/albiruni.html), [William Lilly's *Christian Astrology*, 1647, p. 104](https://www.renaissanceastrology.com/albiruni.html)), every degree of the tropical zodiac has five tiers of **Essential Dignity** and two tiers of **Essential Debility**:
- **Domicile (Rulership, $+5\text{ pts}$)** / **Detriment (Opposite Domicile, $-5\text{ pts}$)**:
  - Sun: Leo (Detriment: Aquarius) | Moon: Cancer (Detriment: Capricorn)
  - Mercury: Gemini, Virgo (Detriment: Sagittarius, Pisces) | Venus: Taurus, Libra (Detriment: Scorpio, Aries)
  - Mars: Aries, Scorpio (Detriment: Libra, Taurus) | Jupiter: Sagittarius, Pisces (Detriment: Gemini, Virgo)
  - Saturn: Capricorn, Aquarius (Detriment: Cancer, Leo).
  *(In Modern Western astrology, outer planets are assigned co-rulerships: **Uranus** = Aquarius, **Neptune** = Pisces, **Pluto** = Scorpio).*
- **Exaltation ($+4\text{ pts}$)** / **Fall (Opposite Exaltation, $-4\text{ pts}$)**: Sun in Aries ($19^\circ$), Moon in Taurus ($3^\circ$), Mercury in Virgo ($15^\circ$), Venus in Pisces ($27^\circ$), Mars in Capricorn ($28^\circ$), Jupiter in Cancer ($15^\circ$), Saturn in Libra ($21^\circ$).
- **Triplicity ($+3\text{ pts}$, Dorothean Day / Night / Participating Rulers)**:
  - **Fire (Aries, Leo, Sagittarius)**: Sun (Day) / Jupiter (Night) / Saturn (Part.).
  - **Earth (Taurus, Virgo, Capricorn)**: Venus (Day) / Moon (Night) / Mars (Part.).
  - **Air (Gemini, Libra, Aquarius)**: Saturn (Day) / Mercury (Night) / Jupiter (Part.).
  - **Water (Cancer, Scorpio, Pisces)**: Venus (Day) / Mars (Night) / Moon (Part.).
- **Terms / Bounds (*Horai*, $+2\text{ pts}$)**: Unequal 5-part divisions of each $30^\circ$ sign ruled by Mercury, Venus, Mars, Jupiter, and Saturn (excluding Sun and Moon). Two competing tables exist: **Egyptian Bounds** (Valens/Dorotheus, standard in Hellenistic) and **Ptolemaic Terms** (Lilly, standard in Renaissance Horary).
- **Decans / Faces ($+1\text{ pt}$)**: $10^\circ$ segments assigned in **Chaldean order** (Saturn $\rightarrow$ Jupiter $\rightarrow$ Mars $\rightarrow$ Sun $\rightarrow$ Venus $\rightarrow$ Mercury $\rightarrow$ Moon) starting from $0^\circ$ Aries (Mars).
- **Peregrine ($-5\text{ pts}$ in Lilly)**: A planet lacking any essential dignity at its zodiacal degree.

### 3.2 Western Predictive Techniques
1. **Secondary Progressions (*Day-for-a-Year*, Placidus/Kepler)**: The astronomical configuration at $D_{\text{prog}} = \text{JD}_{\text{birth}} + A_{\text{years}}$ (1 ephemeris day after birth equals 1 tropical year of life):
   $$\text{JD}_{\text{progressed}}(t_{\text{target}}) = \text{JD}_{\text{birth}} + \frac{\text{JD}_{\text{target}} - \text{JD}_{\text{birth}}}{365.242199}$$
   Because the Progressed Moon moves $\sim 12^\circ$–$15^\circ/\text{day}$, it moves $\sim 1^\circ/\text{month}$ in real life, cycling through the entire chart in $27.3\text{ years}$ (**Progressed Lunar Return**).
2. **Solar Arc Directions**: Computes the progressed Sun's advancement $\Delta\lambda_{\text{SA}} = (\lambda_{\odot}(\text{JD}_{\text{prog}}) - \lambda_{\odot}(\text{JD}_{\text{birth}})) \bmod 360^\circ$ ($\approx 0.9856^\circ/\text{year}$) and adds $\Delta\lambda_{\text{SA}}$ uniformly to **all** natal planets and angles.
3. **Solar Return (*Revolution of the Years*)**: Solves via Newton-Raphson root-finding for the exact instant $\text{JD}_{\text{SR}}$ in target year $Y$ when the transiting Sun returns to the exact natal tropical longitude:
   $$f(\text{JD}) = (\lambda_{\odot, \text{trop}}(\text{JD}) - \lambda_{\odot, \text{trop}}(\text{JD}_{\text{birth}})) = 0$$
   Cast for either the natal coordinates or the relocation coordinates.

---

## 4. Chinese Astrological Systems: *BaZi* (Four Pillars) and *Zi Wei Dou Shu*

### 4.1 Four Pillars of Destiny ([*BaZi* / 八字](https://en.wikipedia.org/wiki/Four_Pillars_of_Destiny))
BaZi does not project planets onto the 12 zodiac signs; instead, it converts solar time into four binomial pairs of **10 Heavenly Stems (*Tiangan*)** and **12 Earthly Branches (*Dizhi*)** forming the 60-element Sexagenary Cycle (*Ganzhi*):

| Index | Heavenly Stem (*Tiangan*) | Yin/Yang & Element (*Wuxing*) | Index | Earthly Branch (*Dizhi*) | Animal & Element | Fixed Solar Term (*Jie*) Month Start ($\lambda_{\odot,\text{trop}}$) | Double-Hour (*Shichen*) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **1** | **Jia (甲)** | Yang Wood | **1** | **Zi (子)** | Rat (Yang Water) | *Daxue* ($255^\circ$, ~Dec 7, Month 11) | 23:00–01:00 |
| **2** | **Yi (乙)** | Yin Wood | **2** | **Chou (丑)** | Ox (Yin Earth) | *Xiaohan* ($285^\circ$, ~Jan 5, Month 12) | 01:00–03:00 |
| **3** | **Bing (丙)** | Yang Fire | **3** | **Yin (寅)** | Tiger (Yang Wood) | ***Lichun* ($315^\circ$, ~Feb 4, Month 1 / Year Start)** | 03:00–05:00 |
| **4** | **Ding (丁)** | Yin Fire | **4** | **Mao (卯)** | Rabbit (Yin Wood) | *Jingzhe* ($345^\circ$, ~Mar 5, Month 2) | 05:00–07:00 |
| **5** | **Wu (戊)** | Yang Earth | **5** | **Chen (辰)** | Dragon (Yang Earth) | *Qingming* ($15^\circ$, ~Apr 5, Month 3) | 07:00–09:00 |
| **6** | **Ji (己)** | Yin Earth | **6** | **Si (巳)** | Snake (Yin Fire) | *Lixia* ($45^\circ$, ~May 5, Month 4) | 09:00–11:00 |
| **7** | **Geng (庚)** | Yang Metal | **7** | **Wu (午)** | Horse (Yang Fire) | *Mangzhong* ($75^\circ$, ~Jun 6, Month 5) | 11:00–13:00 |
| **8** | **Xin (辛)** | Yin Metal | **8** | **Wei (未)** | Goat (Yin Earth) | *Xiaoshu* ($105^\circ$, ~Jul 7, Month 6) | 13:00–15:00 |
| **9** | **Ren (壬)** | Yang Water | **9** | **Shen (申)** | Monkey (Yang Metal) | *Liqiu* ($135^\circ$, ~Aug 7, Month 7) | 15:00–17:00 |
| **10** | **Gui (癸)** | Yin Water | **10** | **You (酉)** | Rooster (Yin Metal) | *Bailu* ($165^\circ$, ~Sep 7, Month 8) | 17:00–19:00 |
| — | — | — | **11** | **Xu (戌)** | Dog (Yang Earth) | *Hanlu* ($195^\circ$, ~Oct 8, Month 9) | 19:00–21:00 |
| — | — | — | **12** | **Hai (亥)** | Pig (Yin Water) | *Lidong* ($225^\circ$, ~Nov 7, Month 10) | 21:00–23:00 |

- **Mathematical Construction of the Four Pillars**:
  1. **Year Pillar (*Nian Zhu*)**: Changes strictly at the exact astronomical instant of **Lichun ($\lambda_{\odot,\text{trop}} = 315^\circ 00' 00''$, ~Feb 4)**, NOT at Lunar New Year or Jan 1. For solar year $Y_{\text{solar}}$, the 0-based 60-cycle index is $(Y_{\text{solar}} - 4) \bmod 60$.
  2. **Month Pillar (*Yue Zhu*)**: The Branch is determined by the 12 *Jie* solar terms ($\lambda_{\odot,\text{trop}} \in [315^\circ, 345^\circ) \rightarrow \text{Yin}$, etc.). The Month Stem is derived from the Year Stem $S_Y \in \{0..9\}$ via the **Five Tigers Formula**: first month (Yin) stem index $= (2(S_Y \bmod 5) + 2) \bmod 10$.
  3. **Day Pillar (*Ri Zhu*)**: Continuous 60-day count from Julian Day Number at local apparent solar time: $\text{Ganzhi}_{60} = (\lfloor \text{JD}_{\text{local}} + 0.5 \rfloor + 49) \bmod 60$. The **Day Stem** is the **Day Master (*Ri Yuan*)**, representing the self.
  4. **Hour Pillar (*Shi Zhu*)**: The Branch is the 2-hour Local Apparent Solar Time block; the Hour Stem is derived from the Day Stem $S_D$ via the **Five Rats Formula**: Zi-hour stem index $= (2(S_D \bmod 5)) \bmod 10$.
  5. **Ten Gods (*Shi Shen*) & 10-Year Luck Pillars (*Da Yun*)**: All other stems and hidden stems (*Cang Gan*) are classified relative to the Day Master's element and polarity (Friend, Rob Wealth, Eating God, Hurting Officer, Direct/Indirect Wealth, Direct/7-Killings Officer, Direct/Indirect Resource). Luck Pillars step forward (for Yang Male / Yin Female) or backward (for Yin Male / Yang Female) from the Month Pillar, with starting age equal to the number of days from birth to the next/previous *Jie* solar term divided by $3$ ($3\text{ days} = 1\text{ year}$).

### 4.2 Purple Star Astrology ([*Zi Wei Dou Shu* / 紫微斗數](https://fortunecloud.co/en/bazi-calculator))
1. **Inputs**: Chinese Luni-Solar Year (Stem & Branch), Lunar Month ($M_L \in \{1..12\}$, with leap-month handling conventions), Lunar Day ($D_L \in \{1..30\}$), and Birth Double-Hour ($H_B \in \{1..12\}$).
2. **12 Palaces (*Shier Gong*)**: Placed counter-clockwise starting from the **Life Palace (*Ming Gong*)** at branch index $(2 + (M_L - 1) - (H_B - 1)) \bmod 12$ (where $2 = \text{Yin}$): *Ming Gong* (Self), *Xiong Di* (Siblings), *Fu Qi* (Spouse), *Zi Nv* (Children), *Cai Bo* (Wealth), *Ji E* (Health), *Qian Yi* (Travel), *Jiao You* (Friends/Subordinates), *Guan Lu* (Career), *Tian Zhai* (Property), *Fu De* (Mental/Karma), *Fu Mu* (Parents).
3. **Five-Element Bureau (*Wu Xing Ju*) & Placement of *Zi Wei* Star**: Combining the Life Palace branch and the Year Stem yields the Five-Element Bureau ($B \in \{2\text{ Water}, 3\text{ Wood}, 4\text{ Metal}, 5\text{ Earth}, 6\text{ Fire}\}$). Dividing the Lunar Day $D_L$ by $B$ places the Emperor Star **Zi Wei** (which anchors the 6 Northern/Southern star groups totaling 14 Major Stars).
4. **Four Transformations (*Si Hua*)**: Each of the 10 Heavenly Stems attaches four transformative energies—**Hua Lu (Prosperity)**, **Hua Quan (Authority)**, **Hua Ke (Fame/Smoothness)**, and **Hua Ji (Obstruction/Obsession)**—to four specific stars across Natal, 10-Year (*Da Xian*), and Annual (*Liu Nian*) layers.
