# ארכיטקטורה טכנית — ספריית שמע דינמית מבוססת קבצים
**גרסה:** 1.0  
**סטטוס:** מסמך ארכיטקטורה טכנית  
**מבוסס על:** מסמך דרישות מוצר 1.0 + אפיון פונקציונלי 1.0 + מודל התוכן וה־Generator 1.0 + אפיון UX/UI 1.0  
**מטרת המסמך:** להגדיר ארכיטקטורה פשוטה, ברורה ויציבה לאתר ספריית השמע — 100% Client-Side, ללא Backend וללא Build מסובך.

---

# 1. עקרון הארכיטקטורה

המטרה אינה לבנות Framework כללי.

המטרה היא לבנות **אתר שמע אחד, מצוין ופשוט לתחזוקה**.

הארכיטקטורה צריכה לשרת ארבעה דברים בלבד:

1. טעינת ספריית התוכן מתוך JSON.
2. ניווט וחיפוש בתוכן.
3. ניגון שמע רציף וגלובלי.
4. שמירת מצב משתמש מקומית בדפדפן.

העיקרון:

> מעט שכבות, אחריות ברורה, בלי תשתיות שלא צריך.

---

# 2. תמונת מערכת

```text
                  GitHub Pages
                       │
                       ▼
                 Static Web App
                       │
        ┌──────────────┼──────────────┐
        │              │              │
        ▼              ▼              ▼
   library.json      CSS/HTML       Audio Files
        │
        ▼
   Library Loader
        │
        ▼
   Application State
        │
   ┌────┼───────────────┬─────────────┐
   │    │               │             │
   ▼    ▼               ▼             ▼
Router Search       Audio Engine   User Storage
   │    │               │             │
   └────┴───────────────┴─────────────┘
                 │
                 ▼
            Preact UI
```

---

# 3. החלטות טכנולוגיות

## 3.1 UI Framework

הבחירה המומלצת:

```text
Preact
```

למה:

- קטן ופשוט.
- מודל Components ברור.
- מתאים לאפליקציה Client-Side.
- מתאים ל־Signals.
- יכול לעבוד ישירות בדפדפן ללא Bundler.
- נותן כמעט את חוויית React בלי להכניס Toolchain כבד.

---

# 4. ללא JSX Compilation

כדי לשמור על הדרישה:

```text
אין Build
אין Babel
אין Vite חובה
אין Webpack
```

נשתמש ב:

```text
HTM + Preact
```

כלומר Component יכול להיכתב כ־template tag במקום JSX.

כך:

```text
Browser
↓
ES Modules
↓
Preact + HTM
↓
Render
```

אין Compile Step של האתר.

---

# 5. Import Maps

`index.html` יכיל Import Map.

מבנה רעיוני:

```html
<script type="importmap">
{
  "imports": {
    "preact": "...",
    "preact/": "...",
    "htm/preact": "...",
    "@preact/signals": "..."
  }
}
</script>
```

לא מקבעים כאן URL/גרסה סופיים.

בפיתוח הסופי:
- נצמיד גרסאות מדויקות.
- לא נשתמש ב־`latest`.

---

# 6. מדיניות Dependencies

גרסה א' צריכה להסתפק כמעט רק ב:

```text
preact
htm
@preact/signals
```

לא מוסיפים Router Library.

לא מוסיפים State Library.

לא מוסיפים UI Framework כבד.

לא מוסיפים Search Library עד שיש צורך אמיתי.

לא מוסיפים Audio Library רק כדי לעטוף API שהדפדפן כבר מספק.

---

# 7. Signals

State ריאקטיבי גלובלי ינוהל באמצעות Signals.

מתאים במיוחד ל:

```text
currentTrack
isPlaying
currentTime
duration
listeningMode
repeatTrack
route
libraryLoaded
searchQuery
```

המטרה היא להימנע מ־State tree מורכב.

---

# 8. שכבות המערכת

נשתמש בחמש שכבות פשוטות:

```text
1. Data
2. Services
3. State
4. Components
5. Pages
```

אין צורך ב:

```text
Repository Layer
Domain Layer
CQRS
Event Bus
Dependency Injection Container
Redux
```

---

# 9. מבנה תיקיות מוצע

```text
/
├── index.html
├── 404.html
│
├── content/
│   └── ...
│
├── data/
│   └── library.json
│
├── tools/
│   └── generate-library.js
│
├── app/
│   ├── main.js
│   ├── app.js
│   │
│   ├── state/
│   │   ├── app-state.js
│   │   ├── player-state.js
│   │   └── user-state.js
│   │
│   ├── services/
│   │   ├── library-service.js
│   │   ├── audio-service.js
│   │   ├── router-service.js
│   │   ├── search-service.js
│   │   └── storage-service.js
│   │
│   ├── components/
│   │   ├── header.js
│   │   ├── bottom-nav.js
│   │   ├── breadcrumb.js
│   │   ├── topic-card.js
│   │   ├── track-row.js
│   │   ├── mini-player.js
│   │   ├── full-player.js
│   │   ├── progress-bar.js
│   │   ├── listening-mode.js
│   │   ├── empty-state.js
│   │   └── error-state.js
│   │
│   └── pages/
│       ├── home-page.js
│       ├── topics-page.js
│       ├── topic-page.js
│       ├── track-page.js
│       ├── search-page.js
│       ├── favorites-page.js
│       ├── history-page.js
│       └── not-found-page.js
│
└── styles/
    ├── variables.css
    ├── base.css
    ├── layout.css
    ├── components.css
    └── responsive.css
```

החלוקה יכולה להשתנות מעט בפיתוח, אבל האחריות צריכה להישאר ברורה.

---

# 10. `index.html`

התפקיד של `index.html` קטן:

- `lang`.
- `dir="rtl"`.
- viewport.
- CSS.
- Import Map.
- Root element.
- טעינת `app/main.js`.

דוגמה רעיונית:

```html
<body>
  <div id="app"></div>
  <script type="module" src="./app/main.js"></script>
</body>
```

לא מכניסים לתוכו את האפליקציה עצמה.

---

# 11. Bootstrap של האפליקציה

`main.js` אחראי רק ל־Startup.

זרימה:

```text
start
↓
initialize router
↓
load library.json
↓
initialize user storage
↓
initialize audio service
↓
render app
```

אם הספרייה לא נטענת:
- האפליקציה עדיין עולה.
- מוצג Library Error State.

---

# 12. Library Service

`library-service.js`

אחריות:

- Fetch ל־`data/library.json`.
- בדיקת `schemaVersion`.
- שמירת הספרייה בזיכרון.
- בניית Lookup Maps.
- פונקציות פשוטות לקבלת Topic/Track.

API רעיוני:

```text
loadLibrary()
getRoot()
getTopic(id)
getTrack(id)
getAllTracks()
getAllTopics()
```

---

# 13. Lookup Maps

לא נחפש כל Track בעץ בכל פעולה.

לאחר טעינה אחת נבנה:

```text
tracksById: Map
topicsById: Map
```

לדוגמה:

```text
track_a1 → Track
topic_b2 → Topic
```

זו אופטימיזציה פשוטה מאוד עם ערך גבוה.

---

# 14. Flattened Search Data

בעת טעינת הספרייה נבנה גם Array שטוח לצורך חיפוש:

```text
searchItems[]
```

כל פריט יכיל רק מה שצריך:

```text
type
id
title/name
breadcrumb
normalizedSearchText
```

אם נחפש גם בתוך הטקסט:
- ניתן לכלול `text` במחרוזת החיפוש.
- נמדוד ביצועים לפני שמוסיפים אינדקס מורכב.

---

# 15. אין Mutation של `library.json`

הספרייה היא Read-Only בזמן Runtime.

האתר לא משנה:

- Topics.
- Tracks.
- Text.

שינויים מגיעים רק דרך:

```text
Content
→ Generator
→ JSON חדש
→ Deployment
```

---

# 16. Router

נשתמש ב־Hash Router קטן משלנו.

לדוגמה:

```text
/#/
/#/topics
/#/topic/topic_123
/#/track/track_456
/#/search
/#/favorites
/#/history
```

---

# 17. למה Hash Router

GitHub Pages הוא Hosting סטטי.

Hash Routing נותן:

- Refresh בטוח.
- Back/Forward טבעיים.
- URL ישיר.
- ללא Rewrite Rules.
- ללא Router Dependency.

זה הפתרון הפשוט ביותר לפרויקט הזה.

---

# 18. Router Service

`router-service.js`

אחריות:

- קריאת `window.location.hash`.
- parse route.
- האזנה ל־`hashchange`.
- ניווט.

API רעיוני:

```text
navigate(route)
parseHash()
startRouter()
```

לא צריך Router Framework.

---

# 19. Route State

ה־Router מעדכן Signal:

```text
currentRoute
```

לדוגמה:

```js
{
  name: "track",
  params: {
    id: "track_123"
  }
}
```

`App` בוחר Page לפי Route.

---

# 20. Browser Back / Forward

לא ננהל Stack נוסף.

הדפדפן כבר מנהל History של Hash.

כלומר:

```text
window.history
```

נשאר מקור האמת לניווט אחורה/קדימה.

---

# 21. App Shell

`app.js` הוא מעטפת האפליקציה.

הוא מציג:

```text
Header
Current Page
Mini Player
Bottom Navigation
```

לפי מצב/רוחב.

ה־Audio Engine אינו נוצר בתוך Page.

---

# 22. Audio Engine — עקרון קריטי

תהיה **ישות Audio אחת בלבד לכל האתר**.

לדוגמה:

```js
const audio = new Audio();
```

או `<audio>` יחיד קבוע.

כל Track משתמש באותו Audio Element.

---

# 23. למה Audio יחיד

כך אנחנו מבטיחים:

- לא יכולים להתנגן שני Tracks ביחד.
- מעבר Page לא עוצר Audio.
- State אחד בלבד.
- Event handling פשוט.
- Mini Player ו־Full Player שולטים באותו נגן.

---

# 24. Audio Service

`audio-service.js`

אחריות:

```text
loadTrack()
play()
pause()
seek()
skipForward()
skipBackward()
setRate()
setVolume()
playNext()
playPrevious()
```

והאזנה ל־Media Events.

---

# 25. Events של Audio

נקשיב לפחות ל:

```text
loadedmetadata
timeupdate
play
pause
ended
waiting
playing
error
durationchange
```

ה־Audio Service מתרגם אותם ל־Player State.

Components לא מתחברים ישירות ל־Audio events.

---

# 26. Player State

`player-state.js`

Signals עיקריים:

```text
currentTrack
currentContext
isPlaying
playerStatus
currentTime
duration
playbackRate
volume
repeatTrack
listeningMode
```

`playerStatus`:

```text
idle
loading
ready
playing
paused
buffering
ended
error
```

---

# 27. Separation: Audio Service מול Player State

Audio Service:
- מדבר עם הדפדפן.

Player State:
- מתאר את מה שה־UI צריך לדעת.

כך Component לא עושה:

```text
audio.currentTime = ...
```

הוא קורא:

```text
audioService.seek(...)
```

---

# 28. Track Loading

כאשר המשתמש בוחר Track:

```text
select track
↓
save previous position
↓
set currentTrack
↓
set currentContext
↓
audio.src = track.audio
↓
load metadata
↓
restore resume position if relevant
↓
ready
```

Play מתחיל לפי הפעולה שהמשתמש ביקש.

---

# 29. Resume

בעת טעינת Track:

Storage Service מחפש:

```text
progress[track.id]
```

אם קיימת נקודה מתאימה:
- Audio Service מגדיר `currentTime`.
- UI מציג "ממשיך מ־...".

---

# 30. Listening Context

מבנה קטן:

```js
{
  topicId,
  trackIds: [...]
}
```

אין Queue Editor.

זה רק Context שמאפשר:

- Next.
- Previous.
- Automatic.
- Random.

---

# 31. Next

`audioService.playNext()`

לוגיקה:

```text
repeatTrack?
→ play same track

otherwise:
listeningMode?
→ determine next action
```

פירוט המצבים נשאר לפי האפיון הפונקציונלי.

---

# 32. Random

ל־"ערבוב אוטומטי":

- נבחר Track מתוך `currentContext.trackIds`.
- לא נבחר Current Track כאשר יש חלופות.
- אין צורך באלגוריתם Shuffle מורכב.

אם בעתיד נרצה להימנע מחזרות לאורך Session:
- אפשר לשמור history קטן של Shuffle.
- לא בגרסה הראשונה.

---

# 33. Full Player ו־Mini Player

שניהם Components שונים.

שניהם קוראים:

```text
playerState
```

ושניהם מפעילים:

```text
audioService
```

אין Audio Element נפרד.

---

# 34. Progress Updates

`timeupdate` אינו דורש שמירת Storage בכל Event.

נעשה הפרדה:

```text
UI update
→ לעיתים קרובות

Persistent save
→ במרווח סביר
```

לדוגמה:
- save כל 5–10 שניות.
- Pause.
- Track change.
- Seek.
- pagehide.

הערך המדויק ייקבע בפיתוח.

---

# 35. Storage Strategy — החלטה מפשטת

בגרסה הראשונה:

> **localStorage בלבד.**

לא IndexedDB.

למה:

המידע שאנחנו שומרים קטן מאוד:

```text
preferences
favorites
history
track progress
```

גם עבור אלפי Tracks מדובר בכמות נתונים סבירה.

---

# 36. מתי נצטרך IndexedDB

רק אם בעתיד נרצה:

- Offline Audio.
- Cache גדול.
- Downloaded Tracks.
- מידע מקומי גדול.
- אלפי/עשרות אלפי רשומות עשירות מאוד.

אז נוסיף IndexedDB.

לא עכשיו.

---

# 37. Storage Keys

מומלץ Namespace אחד:

```text
audioLibrary.v1.preferences
audioLibrary.v1.favorites
audioLibrary.v1.history
audioLibrary.v1.progress
```

או Object אחד מרכזי.

העדיפות:

- מספר קטן של Keys.
- Version prefix.

---

# 38. Preferences

נשמור:

```json
{
  "listeningMode": "auto-next",
  "playbackRate": 1,
  "volume": 1
}
```

לא שומרים UI state מיותר.

---

# 39. Favorites

נשמור Array/Set של IDs:

```json
[
  "track_a1",
  "track_b7"
]
```

לא מעתיקים את כל Track ל־Storage.

המידע מגיע תמיד מ־Library.

---

# 40. History

נשמור מידע מצומצם לפי Track ID.

לדוגמה:

```json
{
  "track_a1": {
    "lastPlayed": 1780000000000
  }
}
```

Progress נשמר בנפרד או יחד.

---

# 41. Progress

לדוגמה:

```json
{
  "track_a1": {
    "position": 754.2,
    "duration": 2400.0,
    "completed": false,
    "updatedAt": 1780000000000
  }
}
```

---

# 42. Storage Validation

בכל קריאה מ־localStorage:

- try/catch.
- JSON parse validation בסיסי.
- Default אם הקובץ פגום.

נתון מקומי פגום לא מפיל את האתר.

---

# 43. Cleaning Removed Tracks

לאחר טעינת Library:

אפשר לבצע cleanup פשוט:

- Favorite ID שלא קיים → להסיר.
- History ID שלא קיים → להסיר/להתעלם.
- Progress ID שלא קיים → להסיר/להתעלם.

לא חובה לנקות מיד בכל Startup אם זה מוסיף מורכבות; התעלמות מספיקה.

---

# 44. Search Service

`search-service.js`

לגרסה הראשונה:

> Search פשוט בזיכרון.

לא Fuse.js.

לא Lunr.

לא Search Server.

---

# 45. Normalization לחיפוש

לכל Query:

- trim.
- lowercase.
- Unicode normalization.
- חיפוש `includes`.

ניתן בהמשך לשפר טיפול בסימני ניקוד/וריאציות אם עולה צורך אמיתי.

---

# 46. חיפוש Topics ו־Tracks

ה־Search Service מחזיר:

```text
Topic results
Track results
```

ה־UI מחליט איך להציג.
---

# 47. חיפוש בתוך Text

מותר בגרסה א' אם Library בגודל סביר.

נבדוק עם תוכן אמיתי.

אם איטי:
- מחפשים קודם title/topic.
- דוחים full-text.
- או מוסיפים index בפיתוח מאוחר.

לא בונים Search Engine מורכב מראש.

---

# 48. CSS Strategy

Plain CSS.

לא:

```text
Tailwind build
Sass compilation
CSS-in-JS runtime
```

---

# 49. CSS Variables

`variables.css`:

```text
colors
spacing
radius
font sizes
z-index layers
player heights
```

מספר קטן של Tokens.

לא Design System ענק.

---

# 50. Responsive CSS

Mobile First:

```css
base mobile
→ tablet media query
→ desktop media query
```

לא עשרות Breakpoints.

---

# 51. RTL

ב־HTML:

```html
<html lang="he" dir="rtl">
```

CSS ייכתב ככל האפשר עם Logical Properties:

```text
margin-inline
padding-inline
inset-inline
border-inline
```

במקום left/right כשאפשר.

---

# 52. Icons

עדיפות:

- SVG inline קטן.
- Icon set אחד בלבד.

לא כמה ספריות Icons.

אפשר לשמור:

```text
/app/icons/
```

או Components של SVG.

---

# 53. Fonts

עדיפות לפונט Web בטוח/מערכתי או פונט אחד קל.

לא לטעון מספר משפחות ומשקלים רבים.

ביצועים לפני קישוט.

---

# 54. Visualization Architecture

בגרסה א':

ה־Visualization הוא Component תצוגה.

לא תלוי ב־Web Audio API.

יכול לעבוד לפי:

```text
isPlaying
progress
```

למשל:
- animated bars.
- progress ring.

---

# 55. למה לא Web Audio API בגרסה א'

אנחנו לא צריכים:

- DSP.
- EQ.
- spectrum analysis אמיתי.
- filters.
- mixing.

לכן `HTMLAudioElement` מספיק.

אם בעתיד נצטרך visualization אמיתי מהאות:
- נחבר Web Audio API כ־Enhancement.

---

# 56. Media Session

אפשר להוסיף בהמשך Progressive Enhancement.

אם `navigator.mediaSession` קיים:

- metadata.
- Play/Pause.
- Previous/Next.
- Seek.

אבל:

> אין לבנות את ליבת המוצר על Media Session.

תמיכת הדפדפנים אינה אחידה לכל היכולות.

---

# 57. Service Worker

לא בגרסה הראשונה.

הסיבה:

- אין דרישת Offline.
- מוסיף Cache complexity.
- יכול להקשות על עדכוני JSON בזמן פיתוח.

נוסיף רק אם מוגדרת דרישת PWA/Offline אמיתית.

---

# 58. Web App Manifest

לא נדרש לגרסה הראשונה.

אנחנו מתמקדים באתר.

אם בעתיד נרצה Installable PWA:
- נוסיף Manifest + Service Worker בשלב נפרד.

---

# 59. Cache של `library.json`

גרסה א':

Fetch רגיל עם אסטרטגיה פשוטה.

בעת Deployment אפשר להוסיף Query Version:

```text
library.json?v=...
```

או Cache Control בהתאם ל־Hosting.

אין Cache Layer פנימי מורכב.

---

# 60. Audio Caching

הדפדפן מנהל HTTP Cache.

אנחנו לא בונים Audio Cache משלנו.

---

# 61. Preload

ל־Audio Element:

- `preload="metadata"` או התנהגות דומה.

לא preload של כל Audio.

אפשר בעתיד לטעון Metadata של Track הבא אם נמדוד צורך.

---

# 62. Error Handling — מבנה

Errors מתחלקים:

```text
Library Error
Route Error
Track Error
Storage Error
```

כל Service:
- מטפל בפרטים הטכניים.
- מחזיר State ברור ל־UI.

---

# 63. Logging

בגרסה א':

`console.error` / `console.warn` למפתח.

לא מערכת Telemetry.

לא Sentry אלא אם בעתיד יש צורך.

---

# 64. User-Facing Errors

UI מקבל Error Code/State פשוט.

לדוגמה:

```text
audio-load-failed
unsupported-audio
library-load-failed
not-found
```

ומתרגם לטקסט אנושי.

---

# 65. Security

האתר סטטי.

אין Secrets בקוד.

אין:

- API keys פרטיים.
- passwords.
- auth tokens.

כל דבר ב־Repo/Browser נחשב גלוי.

---

# 66. TXT Rendering

Text יוצג כ־Plain Text.

לא:

```text
innerHTML
dangerouslySetInnerHTML
```

כך:
- אין HTML Injection.
- אין צורך Sanitizer.
- הפשטות נשמרת.

---

# 67. Content URLs

ה־Audio path מגיע מ־JSON.

הוא נבנה על ידי Generator מתוך קבצים אמיתיים.

ה־UI לא מרכיב Path לפי כותרת.

---

# 68. URL Encoding

Service/Browser יטפל ב־URLs נכון.

לא עושים Manual Percent Encoding לכל הנתיב ב־Generator.

---

# 69. Generator — מקומו בארכיטקטורה

ה־Generator הוא Tool נפרד.

```text
Node.js
Filesystem
↓
library.json
```

הוא לא נטען בדפדפן.

הוא לא חלק מ־`app/`.

---

# 70. Generator Dependencies

ל־V1 נעדיף Zero Dependencies.

Node built-ins:

```text
fs/promises
path
crypto
```

Natural Sort:

```text
Intl.Collator
```

כך לא צריך `npm install` רק כדי ליצור JSON.

---

# 71. Generator Hash

ל־ID דטרמיניסטי:

- Normalize relative path.
- Hash עם Node built-in `crypto`.
- קיצור לתוצאה סבירה.

אין צורך Library חיצונית.

---

# 72. Generator Atomic Output

זרימה:

```text
scan
↓
validate
↓
serialize
↓
write library.tmp.json
↓
parse/check
↓
rename to library.json
```

אם יש כשל:
- JSON הקודם נשאר.

---

# 73. Generator Exit Codes

```text
0 → success, warnings allowed
1 → local errors / validation failed
2 → critical generator failure
```

המספרים המדויקים יכולים להשתנות, אבל חשוב שיהיה ברור אם ההרצה תקינה.

---

# 74. Development Workflow

אין Development Server חובה.

אפשר להשתמש בשרת סטטי קטן מקומי כדי למנוע מגבלות `file://`.

לדוגמה:
- VS Code Live Server.
- Python static server.
- Node static server.

הבחירה אינה חלק מהמערכת.

---

# 75. למה לא לפתוח `index.html` ישירות כ־file://

ES Modules ו־Fetch ל־JSON עלולים להיות מוגבלים תחת `file://`.

לכן בפיתוח:
- מריצים Static HTTP Server מקומי.

זו אינה תשתית Backend.

---

# 76. GitHub Pages Deployment

מבנה האתר סטטי ולכן מתאים ישירות ל־GitHub Pages.

Deployment:

```text
commit
↓
push
↓
GitHub Pages
↓
static files served
```

אין server build חובה.

---

# 77. Base Path

צריך להיזהר אם האתר מפורסם כ־Project Page:

```text
username.github.io/repository-name/
```

לכן:
- להשתמש בנתיבים יחסיים.
- לא להניח שהאתר יושב ב־`/`.

---

# 78. Relative Paths

מומלץ:

```text
./data/library.json
./app/main.js
./styles/base.css
```

Audio paths גם יחסיים ל־site base.

---

# 79. 404.html

למרות Hash Routing, כדאי `404.html` פשוט.

הוא יכול:
- להפנות לבית.
- להציג קישור לאתר.

לא נבנה SPA rewrite hack מסובך.

---

# 80. Versioning

שלושה מושגים:

```text
App Version
Schema Version
GeneratedAt
```

## App Version
גרסת קוד.

## Schema Version
מבנה JSON.

## GeneratedAt
זמן יצירת התוכן.

לא לערבב ביניהם.

---

# 81. App Config

אפשר `app-config.js` קטן.

לדוגמה:

```text
APP_NAME
LIBRARY_URL
DEFAULT_LISTENING_MODE
SKIP_SECONDS
```

לא JSON Config ענק.

---

# 82. Default Listening Mode

ההחלטה תהיה Product/UX.

הקוד רק קורא:

```text
DEFAULT_LISTENING_MODE
```

כך שינוי ברירת מחדל אינו מפוזר בקוד.

---

# 83. Component Tree רעיוני

```text
App
├── Header
├── PageRouter
│   ├── HomePage
│   ├── TopicPage
│   ├── TrackPage
│   ├── SearchPage
│   ├── FavoritesPage
│   └── HistoryPage
├── MiniPlayer
└── BottomNav
```

`FullPlayer` נמצא בתוך TrackPage אך משתמש ב־State גלובלי.

---

# 84. Component Responsibility

Component:
- Render.
- User interaction.

Service:
- Logic/Browser API.

State:
- Observable data.

Page:
- Composition.

כך לא שמים כל הלוגיקה בתוך Components.

---

# 85. Track Row Reuse

`TrackRow` ישמש:

- Topic.
- Search.
- Favorites.
- History.

Props פשוטים יקבעו:
- context label.
- progress.
- favorite button.

לא נבנה Component שונה לכל מסך אם הוא כמעט זהה.

---

# 86. Topic Card Reuse

`TopicCard` ישמש:
- Home.
- Topics.
- Topic children.

---

# 87. No Prop Drilling עמוק

Global domains כמו Player/Library/User State מיובאים ישירות מה־State modules.

אין צורך Context Provider מורכב.

---

# 88. Computed State

Signals computed יכולים לחשב:

```text
currentTrackProgress
canGoNext
canGoPrevious
currentTrackIsFavorite
```

בלי לשמור values כפולים.

---

# 89. Avoid Duplicated State

לא נשמור:

```text
currentTrackId
וגם
currentTrack object
```

אלא אם יש סיבה.

מקור אמת אחד.

---

# 90. Search Debounce

אפשר debounce קטן של כ־100–200ms.

לא חובה אם Search מהיר.

נמדוד קודם.

---

# 91. Performance: Library Load

בעת Startup:

1. Fetch JSON.
2. Parse.
3. Build maps.
4. Render.

אין Fetch לכל Topic.

זה פשוט ומהיר לספרייה קטנה/בינונית.

---

# 92. Performance: Large Library

רק אם נמדוד בעיה אמיתית:

- Split JSON.
- Lazy topic loading.
- Search index file.
- Virtualized lists.

כל אלה מחוץ ל־V1.

---

# 93. Performance: Rendering Lists

Preact יטפל ברשימות רגילות.

אם Topic מכיל מאות רבות/אלפים:
- נשקול pagination/virtualization.

לא מראש.

---

# 94. Performance: Audio

לא מעבדים את קובץ השמע ב־JavaScript.

הדפדפן מנגן ישירות.

כך:
- Memory נמוך.
- CPU נמוך.
- Streaming/HTTP range לפי יכולת השרת/דפדפן.

---

# 95. Accessibility Architecture

Components בסיסיים יהיו Semantically correct:

```text
button
nav
main
header
section
input
```

לא clickable `div` כשאפשר `button`.

---

# 96. Keyboard

לוגיקה בסיסית יכולה להיות ב־Audio Service/App:

```text
Space → Play/Pause
```

רק אם focus אינו בשדה קלט.

לא צריך מערכת Keyboard Commands.

---

# 97. Tests — הכנה ארכיטקטונית

למרות שאין Build, נשמור Logic pure ככל האפשר.

למשל:

```text
getNextTrack()
normalizeSearch()
parseRoute()
buildLookupMaps()
```

פונקציות כאלה קל לבדוק.

---

# 98. No Framework Lock-In

ה־Library JSON וה־Generator אינם תלויים ב־Preact.

אם בעתיד נרצה להחליף UI:
- התוכן נשאר.
- Generator נשאר.
- JSON נשאר.

זו הפרדה חשובה.

---

# 99. CDN Dependency

אם משתמשים ב־ESM CDN:

- גרסאות pin.
- לא `latest`.
- לבדוק Production deployment.

אם בעתיד נרצה לבטל תלות חיצונית:
- נוכל לשמור Modules locally.

לא צריך לפתור זאת ב־V1 אם CDN אמין ומקובל.

---

# 100. Local Vendor Option

הארכיטקטורה לא צריכה להניח CDN קשיח.

Import Map מאפשר בעתיד להחליף:

```text
https://cdn/.../preact
```

ב:

```text
./vendor/preact.js
```

מבלי לשנות Imports בקוד.

---

# 101. Browser Support

מכוונים לדפדפנים מודרניים:

- Chrome/Chromium.
- Edge.
- Safari.
- Firefox.

לא תומכים ב־Internet Explorer.

---

# 102. Audio Format Support

Generator מזהה פורמטים רבים.

Runtime:
- הדפדפן קובע בפועל אם codec ניתן לניגון.

Audio Service מטפל ב־Error.

אין Transcoding Runtime.

---

# 103. Media Session Progressive Enhancement

אם נתמך:

```text
navigator.mediaSession
```

אפשר בעתיד לחבר:

- play.
- pause.
- nexttrack.
- previoustrack.
- seekto.

אבל האתר חייב לעבוד מצוין גם בלעדיו.

---

# 104. No Web Worker ב־V1

Search ו־JSON Parsing יישארו Main Thread.

אם בעתיד library ענק:
- אפשר Search Worker.

לא מראש.

---

# 105. No WASM

אין שום צורך.

---

# 106. No Backend Proxy

Audio ו־JSON מוגשים כקבצים סטטיים.

אין API Server.

---

# 107. Future Hosting Flexibility

למרות GitHub Pages:

- Content paths יחסיים.
- App static.
- אין GitHub-specific runtime code.

כך אפשר בעתיד להעביר ל:

```text
Netlify
Cloudflare Pages
S3/CDN
שרת סטטי אחר
```

בלי לשכתב את האפליקציה.

---

# 108. Future Audio CDN

אם Audio בעתיד יעבור ל־CDN נפרד:

אפשר להוסיף:

```text
audioBaseUrl
```

ב־Config/Generator.

אבל לא צריך עכשיו אם Content באותו Hosting.

---

# 109. Git Repository Size

קבצי Audio יכולים לגדול.

זה לא משנה את ארכיטקטורת האתר, אבל אם repository נהיה כבד:
- ניתן בעתיד להוציא Audio ל־Object Storage/CDN.

לא צריך לפתור לפני שיש בעיה אמיתית.

---

# 110. החלטות מחייבות לגרסה א'

אנחנו נועלים:

```text
Static Client-Side Site
Preact
HTM
Signals
ES Modules
Import Maps
Hash Router custom
Single HTMLAudioElement
Plain CSS
library.json אחד
localStorage
Client-side search
Node.js Generator
GitHub Pages
No Service Worker
No Backend
No Build/Bundler
```

---

# 111. דברים שלא נועלים עדיין

- צבעים.
- CDN ספציפי.
- גרסאות dependency סופיות.
- Hash algorithm מדויק.
- exact CSS breakpoints.
- exact localStorage shape.
- Media Session ב־V1.
- duration extraction ב־Generator.

אלה ייסגרו בזמן implementation הרלוונטי.

---

# 112. דברים שבכוונה לא בונים

```text
Backend
Database
Authentication
Redux
React Router
Build pipeline
Vite חובה
Webpack
Service Worker
Offline Audio Manager
Web Audio DSP
Complex Search Engine
CMS
Playlist Editor
Recommendation Engine
Telemetry platformPlugin system
```

---

# 113. Acceptance Criteria — ארכיטקטורה

הארכיטקטורה נחשבת נכונה אם:

1. האתר עולה מ־Static Hosting.
2. אין Backend.
3. אין Compile חובה.
4. Library נטען מ־JSON.
5. Topic/Track נמצאים ב־O(1) דרך Maps לאחר טעינה.
6. Router עובד עם Back/Forward/Refresh.
7. Track ממשיך לנגן בעת ניווט.
8. קיים Audio Element יחיד.
9. Mini Player ו־Full Player שולטים באותו Audio.
10. Resume/Favorites/History נשמרים ללא Server.
11. Storage failure לא מפיל את האתר.
12. Search עובד מקומית.
13. Generator אינו תלוי ב־Runtime.
14. שינוי Content אינו דורש שינוי קוד.
15. מבנה הקוד מספיק פשוט להבנה ותחזוקה.

---

# 114. עקרון פשטות אחרון

לפני הוספת Library או Layer נשאל:

> האם הדפדפן או 20–30 שורות קוד פשוטות כבר פותרות את הבעיה?

אם כן:
- לא מוסיפים Dependency.

לפני הוספת Abstraction נשאל:

> האם יש כרגע יותר ממימוש אחד או צורך ממשי בהפרדה?

אם לא:
- לא מוסיפים Abstraction.

---

# 115. Reference Architecture Flow

```text
                index.html
                    │
                    ▼
                 main.js
                    │
        ┌───────────┴───────────┐
        ▼                       ▼
 Library Service            Router
        │                       │
        ▼                       ▼
  library.json              Route Signal
        │                       │
        ├─────────┐             │
        ▼         ▼             │
   Lookup Maps   Search         │
        │         │             │
        └────┬────┴─────────────┘
             ▼
            App
             │
       ┌─────┼───────────────┐
       ▼     ▼               ▼
     Pages  Player UI     Navigation
              │
              ▼
        Player State
              │
              ▼
        Audio Service
              │
              ▼
       HTMLAudioElement
              │
              ▼
          Audio File

User actions
    │
    ├── Favorites ─┐
    ├── History ───┼── Storage Service ── localStorage
    ├── Progress ──┤
    └── Settings ──┘
```

---

# 116. השלב הבא

השלב הבא הוא:

# תכנית פיתוח מפורטת לפי שלבים ומיילסטונים

במסמך הבא נגדיר:

1. סדר הפיתוח המדויק.
2. מה בונים קודם ומה אחר כך.
3. מה חייב לעבוד בסוף כל שלב.
4. אילו קבצים נוצרים בכל שלב.
5. אילו בדיקות בסיסיות מבצעים לפני שעוברים הלאה.
6. מתי בונים Generator.
7. מתי בונים Router.
8. מתי בונים Library UI.
9. מתי בונים Audio Engine.
10. מתי מוסיפים Full/Mini Player.
11. מתי מוסיפים מצבי האזנה.
12. מתי מוסיפים Text.
13. מתי מוסיפים Search.
14. מתי מוסיפים Resume/History/Favorites.
15. מתי עושים Responsive/UX polish.
16. מתי עושים Error Handling.
17. מתי מבצעים Performance pass.
18. מתי עושים Deployment.
19. מהו Definition of Done לכל Milestone.
20. איך שומרים שבכל נקודה תהיה גרסה עובדת ולא "חצי מערכת".

לאחר תכנית הפיתוח נעבור ל:

**תכנית בדיקות מלאה → Production Checklist.**