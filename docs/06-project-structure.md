# מבנה הפרויקט — ספריית שמע דינמית מבוססת קבצים
**גרסה:** 1.0  
**סטטוס:** מסמך מבנה פרויקט  
**מבוסס על:** מסמך דרישות מוצר 1.0 + אפיון פונקציונלי 1.0 + מודל התוכן וה־Generator 1.0 + אפיון UX/UI 1.0 + ארכיטקטורה טכנית 1.0  
**מטרת המסמך:** להגדיר את מבנה התיקיות והקבצים של הפרויקט, תחומי האחריות, כללי התלות וה־Naming Conventions — כך שהמערכת תישאר פשוטה, ברורה וקלה לתחזוקה.

---

# 1. עקרון מרכזי

מבנה הפרויקט צריך להיות:

- פשוט להבנה.
- ברור למפתח שנכנס לפרויקט בפעם הראשונה.
- מופרד לפי אחריות.
- לא עמוק מדי.
- לא מפוצל לעשרות קבצים קטנים ללא צורך.
- לא תלוי ב־Build System.
- מתאים ל־GitHub Pages.
- מתאים ל־ES Modules בדפדפן.
- מותאם לכך שהתוכן מנוהל בנפרד מהקוד.

העיקרון:

> **כל דבר נמצא במקום שבו טבעי לחפש אותו, ולא מפצלים יותר ממה שצריך.**

---

# 2. מבנה העל של הפרויקט

המבנה המומלץ:

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
│   │   ├── listening-mode-selector.js
│   │   ├── empty-state.js
│   │   └── error-state.js
│   │
│   ├── pages/
│   │   ├── home-page.js
│   │   ├── topics-page.js
│   │   ├── topic-page.js
│   │   ├── track-page.js
│   │   ├── search-page.js
│   │   ├── favorites-page.js
│   │   ├── history-page.js
│   │   └── not-found-page.js
│   │
│   └── config/
│       └── app-config.js
│
└── styles/
    ├── variables.css
    ├── base.css
    ├── layout.css
    ├── components.css
    └── responsive.css
```

זהו מבנה היעד לגרסה הראשונה.

---

# 3. עקרון החלוקה

הפרויקט מחולק לחמישה אזורים ברורים:

```text
1. תוכן
2. נתונים שנוצרו
3. כלי Generator
4. קוד האפליקציה
5. עיצוב
```

בפועל:

```text
/content  → תוכן מקור
/data     → JSON שנוצר
/tools    → כלים מקומיים
/app      → Runtime
/styles   → CSS
```

---

# 4. תיקיית `/content`

## 4.1 תפקיד

זו תיקיית התוכן האמיתית של הספרייה.

בתוכה נמצאים:

- נושאים.
- תתי־נושאים.
- קבצי שמע.
- קבצי TXT.

## 4.2 דוגמה

```text
/content
├── נושא א
│   ├── 01 - קטע ראשון.mp3
│   ├── 01 - קטע ראשון.txt
│   └── תת נושא
│       ├── 01 - קטע שני.m4a
│       └── 01 - קטע שני.txt
└── נושא ב
```

## 4.3 מה לא נכנס ל־`content`

לא לשים שם:

- JavaScript.
- CSS.
- JSON מערכת.
- קבצי Build.
- Config של האפליקציה.
- Logs.
- קוד Generator.

---

# 5. תיקיית `/data`

## 5.1 תפקיד

מכילה Data שנוצר אוטומטית.

בגרסה א':

```text
/data/library.json
```

## 5.2 עיקרון

`library.json` הוא Generated File.

לא עורכים אותו ידנית.

אם צריך שינוי:

```text
משנים Content
↓
מריצים Generator
↓
נוצר JSON חדש
```

---

# 6. תיקיית `/tools`

## 6.1 תפקיד

מכילה כלים שמשמשים את מנהל הפרויקט בפיתוח/עדכון תוכן.

בגרסה א':

```text
/tools/generate-library.js
```

## 6.2 עיקרון

קוד בתיקייה זו:

- רץ ב־Node.js.
- לא נטען בדפדפן.
- לא חלק מ־Runtime.
- לא תלוי ב־Preact.

---

# 7. `generate-library.js`

## 7.1 תפקיד

אחראי על:

- סריקת `/content`.
- זיהוי תיקיות.
- זיהוי Audio.
- התאמת TXT.
- יצירת IDs.
- Natural Sort.
- יצירת JSON.
- Warnings/Errors.
- Atomic write.

## 7.2 כלל חשוב

הקובץ יכול להיות יחיד בגרסה א'.

לא מפצלים אותו מראש ל:

```text
scanner.js
matcher.js
writer.js
validator.js
id-generator.js
```

אלא אם הוא באמת נהיה גדול וקשה לתחזוקה.

---

# 8. `index.html`

## 8.1 תפקיד

Entry Point של האתר.

אחראי רק על:

- HTML בסיסי.
- `lang="he"`.
- `dir="rtl"`.
- viewport.
- CSS.
- Import Map.
- Root DOM element.
- טעינת `main.js`.

## 8.2 מה לא יהיה בו

לא מכניסים:

- UI.
- State.
- Router logic.
- Audio logic.
- נתוני ספרייה.

---

# 9. `404.html`

## 9.1 תפקיד

Fallback פשוט ל־GitHub Pages.

## 9.2 התנהגות

יכול:

- להציג הודעה.
- לתת קישור לבית.
- להפנות ל־Root.

אין צורך ב־SPA Rewrite Hack מורכב כי משתמשים ב־Hash Routing.

---

# 10. תיקיית `/app`

מכילה את כל קוד ה־Runtime.

היא לא מכילה:

- Audio.
- TXT.
- Generated JSON.
- CSS.
- Generator.

---

# 11. `app/main.js`

## 11.1 תפקיד

Bootstrap בלבד.

אחראי על:

```text
initialize
↓
load library
↓
initialize storage
↓
start router
↓
render app
```

## 11.2 כלל

`main.js` צריך להיות קצר.

אם הוא מתחיל להכיל Business Logic:
- הלוגיקה במקום הלא נכון.

---

# 12. `app/app.js`

## 12.1 תפקיד

App Shell.

הוא מרכיב:

- Header.
- Current Page.
- Mini Player.
- Bottom Navigation.

## 12.2 אחריות

`app.js` מחליט איזה Page להציג לפי Route.

הוא לא מטפל ב:

- Audio events.
- Search algorithm.
- localStorage.
- JSON fetch.

---

# 13. תיקיית `/app/state`

## 13.1 תפקיד

מכילה Global State.

לא כל State חייב להיות Global.

רק מידע שמשותף בין כמה אזורים.

---

# 14. `app-state.js`

## 14.1 תפקיד

State כללי של האפליקציה:

- library status.
- current route.
- global loading/error if needed.

## 14.2 לא לשים בו

- Audio details.
- Favorites.
- Search input מקומי למסך.

---

# 15. `player-state.js`

## 15.1 תפקיד

State של הנגן.

לדוגמה:

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

## 15.2 עיקרון

זהו מקור האמת של ה־UI לגבי הנגן.

---

# 16. `user-state.js`

## 16.1 תפקיד

State של המשתמש המקומי:

- favorites.
- history.
- progress.
- preferences.

## 16.2 מקור

נטען דרך `storage-service`.

---

# 17. תיקיית `/app/services`

מכילה Logic שמדבר עם:

- Browser APIs.
- Data.
- Storage.
- Router.
- Audio.

Services לא אמורים לצייר UI.

---

# 18. `library-service.js`

## 18.1 תפקיד

- Fetch של `library.json`.
- validation בסיסי.
- בניית Maps.
- גישה ל־Track/Topic.

## 18.2 API טיפוסי

```text
loadLibrary()
getTrack(id)
getTopic(id)
getAllTracks()
getAllTopics()
```

---

# 19. `audio-service.js`

## 19.1 תפקיד

מנהלת `HTMLAudioElement` יחיד.

אחראית על:

```text
loadTrack
play
pause
seek
skipForward
skipBackward
setRate
setVolume
next
previous
```

וגם:

- Audio events.
- update ל־Player State.

## 19.2 כלל חשוב

רק `audio-service` מדבר ישירות עם Audio Element.

Components לא עושים:

```js
audio.currentTime = ...
```

---

# 20. `router-service.js`

## 20.1 תפקיד

Hash Router קטן.

אחראי על:

- parse.
- navigate.
- hashchange.
- route state.

## 20.2 Routes

```text
/#/
/#/topics
/#/topic/:id
/#/track/:id
/#/search
/#/favorites
/#/history
```

---

# 21. `search-service.js`

## 21.1 תפקיד

חיפוש Client-Side.

אחראי על:

- normalization.
- חיפוש Topics.
- חיפוש Tracks.
- אפשרות חיפוש בתוך Text.

## 21.2 כלל

לא מכניסים Search UI לכאן.

רק logic.

---

# 22. `storage-service.js`

## 22.1 תפקיד

עטיפה פשוטה ל־`localStorage`.

אחראי על:

- read.
- write.
- parse.
- defaults.
- version prefix.
- טיפול ב־storage corruption.

## 22.2 מה נשמר

- preferences.
- favorites.
- history.
- progress.

---

# 23. תיקיית `/app/components`

מכילה רכיבי UI קטנים וחוזרים.

כל Component צריך להיות:

- ממוקד.
- reusable כשיש ערך.
- לא "generic" מדי.

---

# 24. `header.js`

אחראי על:

- Header.
- title/logo.
- navigation actions לפי המסך.
- back במובייל לפי הצורך.

---

# 25. `bottom-nav.js`

מוצג במובייל.

פריטים:

```text
בית
נושאים
חיפוש
מועדפים
היסטוריה
```

---

# 26. `breadcrumb.js`

אחראי על:

- הצגת היררכיה.
- ניווט חזרה לנושאים קודמים.

במובייל:
- יכול להציג גרסה מקוצרת.

---

# 27. `topic-card.js`

משמש להצגת Topic ב:

- Home.
- Topics.
- Topic children.

לא ליצור TopicCard נוסף לכל Page.

---

# 28. `track-row.js`

אחד הרכיבים החשובים.

משמש ב:

- Topic.
- Search.
- Favorites.
- History.

Props אפשריים:

```text
track
context
showProgress
showFavorite
showContext
```

אבל לא להפוך אותו ל־Component עם 30 Flags.

אם נהיה מורכב מדי:
- מפצלים וריאציה.

---

# 29. `mini-player.js`

מוצג כש:

- יש Current Track.
- Full Player לא פעיל.

אחראי על:

- title.
- play/pause.
- progress.
- open full player.

לא מכיל Audio Element משלו.

---

# 30. `full-player.js`

הרכיב המרכזי של מסך Track.

אחראי על:

- Play/Pause.
- ±10.
- Previous/Next.
- Progress.
- Speed.
- Repeat.
- Volume.
- Visualization.
- Metadata בסיסי.

---

# 31. `progress-bar.js`

רכיב משותף ל:

- Full Player.
- Mini Player.
- אולי Track Row.

אבל אם ה־UI שונה מדי:
- עדיף שני רכיבים פשוטים על Component כללי מסובך.

---

# 32. `listening-mode-selector.js`

אחראי על UI לבחירת:

```text
שיר בודד
המשך אוטומטי
בחירה חופשית
ערבוב אוטומטי
```

הוא לא מכיל Logic של Next.

רק משנה State/Preference.

---

# 33. `empty-state.js`

רכיב פשוט למצבים כמו:

```text
אין עדיין מועדפים
אין היסטוריה
אין תוכן בנושא
```

---

# 34. `error-state.js`

מציג Errors ידידותיים.

לדוגמה:

```text
לא ניתן לטעון את ספריית התוכן.
[נסה שוב]
```

---

# 35. תיקיית `/app/pages`

Pages הם Composition Layer.

הם מרכיבים Components ו־Services.

---

# 36. `home-page.js`

מציג:

- Search entry.
- Continue Listening.
- Topics.
- Favorites/History shortcuts.

לא אמור להכיל Audio logic.

---

# 37. `topics-page.js`

מציג Root Topics.

פשוט.

---

# 38. `topic-page.js`

אחראי על:

- Topic title.
- Breadcrumb.
- child topics.
- tracks.
- listening mode access.

הוא מקבל Topic לפי Route ID דרך Library Service.

---

# 39. `track-page.js`

אחראי על:

- Full Player.
- Text.
- Context.
- Previous/Next context.
- Favorite action.

הוא לא יוצר Audio חדש.

---

# 40. `search-page.js`

אחראי על:

- query state.
- search input.
- הצגת results.

Search algorithm נמצא ב־Search Service.

---

# 41. `favorites-page.js`

אחראי על:

- קבלת favorite IDs.
- resolve ל־Tracks.
- TrackRows.

---

# 42. `history-page.js`

אחראי על:

- מיון lastPlayed.
- resolve Track IDs.
- progress.
- resume action.

---

# 43. `not-found-page.js`

מציג:

```text
התוכן שביקשת לא נמצא.
```

עם:

- Home.
- Search.

---

# 44. תיקיית `/app/config`

מכילה Configuration קטן של Runtime.

בגרסה א':

```text
app-config.js
```

---

# 45. `app-config.js`

מכיל ערכים כמו:

```text
APP_NAME
LIBRARY_URL
DEFAULT_LISTENING_MODE
SKIP_SECONDS
STORAGE_PREFIX
```

לא מכניסים:

- תוכן.
- Routes.
- Track metadata.
- CSS values.

---

# 46. תיקיית `/styles`

כל CSS נמצא מחוץ ל־JS.

לא CSS-in-JS.

---

# 47. `variables.css`

מכיל:

- colors.
- spacing.
- radius.
- font sizes.
- z-index.
- layout constants.

מספר קטן של CSS variables.

---

# 48. `base.css`

מכיל:

- reset בסיסי.
- body.
- typography.
- buttons.
- inputs.
- RTL בסיסי.

---

# 49. `layout.css`

מכיל:

- page layout.
- grid.
- sidebar.
- app shell.
- containers.

---

# 50. `components.css`

מכיל styles של Components:

- topic-card.
- track-row.
- player.
- mini-player.
- breadcrumb.
- nav.

---

# 51. `responsive.css`

מכיל Media Queries עיקריים:

- Tablet.
- Desktop.

Mobile הוא ברירת המחדל.

---

# 52. למה לא CSS לכל Component

בגרסה א' לא צריך:

```text
header.css
track-row.css
player.css
...
```

אם CSS הכולל נהיה גדול מאוד:
- ניתן לפצל בעתיד.

לא מראש.

---

# 53. Naming Convention — קבצים

קבצי JS:
```text
kebab-case.js
```

דוגמאות:

```text
audio-service.js
track-row.js
player-state.js
```

CSS:

```text
kebab-case.css
```

---

# 54. Naming Convention — פונקציות

JavaScript:

```text
camelCase
```

לדוגמה:

```js
loadLibrary()
getTrack()
playNext()
normalizeSearchText()
```

---

# 55. Naming Convention — Components

בשם הקובץ:

```text
track-row.js
```

ב־JavaScript:

```js
function TrackRow() {}
```

כלומר Component names ב־PascalCase.

---

# 56. Naming Convention — Constants

```text
UPPER_SNAKE_CASE
```

לדוגמה:

```js
DEFAULT_LISTENING_MODE
SUPPORTED_AUDIO_EXTENSIONS
SKIP_SECONDS
```

---

# 57. Naming Convention — Signals

שמות רגילים וברורים:

```text
currentTrack
isPlaying
currentRoute
favorites
```

לא prefixes כמו:

```text
sigCurrentTrack
obsPlaying
```

אין צורך.

---

# 58. Imports

העדיפות:

- Import ישיר.
- paths יחסיים.
- לא `index.js` Barrel Files בגרסה א'.

לדוגמה:

```js
import { play } from "../services/audio-service.js";
```

ולא:

```js
import { play } from "../services/index.js";
```

Barrels מוסיפים magic בלי צורך.

---

# 59. Dependency Direction

הכיוון המותר:

```text
Pages
↓
Components
↓
State / Services
↓
Browser APIs / Data
```

בפועל Components יכולים לקרוא State/Services ישירות כשזה הגיוני.

---

# 60. תלויות אסורות

`services` לא מייבאים `pages`.

`state` לא מייבא `components`.

`tools` לא מייבא `app`.

`content` כמובן לא תלוי בשום קוד.

---

# 61. כלל: אין Circular Dependencies

אם:

```text
A imports B
B imports A
```

זה סימן שצריך לשנות אחריות.

לא פותרים עם workaround.

---

# 62. Pages לא מדברים עם localStorage ישירות

תמיד דרך:

```text
storage-service
```

כך:

- parsing במקום אחד.
- versioning במקום אחד.
- error handling במקום אחד.

---

# 63. Components לא עושים Fetch

Fetch של Library נמצא רק ב־Library Service.

לא:

```text
TopicPage → fetch library.json
SearchPage → fetch library.json
```

הספרייה נטענת פעם אחת.

---

# 64. Components לא יוצרים Audio

אסור:

```js
new Audio()
```

בתוך Component.

קיים Audio יחיד ב־Audio Service.

---

# 65. State לא אמור להכיל Business Logic גדול

Player State מחזיק ערכים.

Audio Service מחזיק פעולות.

לדוגמה:

```text
playerState.currentTime
audioService.seek()
```

---

# 66. Search Query מקומי

`searchQuery` לא חייב להיות Global Signal אם הוא משמש רק Search Page.

שומרים State מקומי ככל האפשר.

---

# 67. State Global רק כשצריך

Global:

- player.
- library.
- user preferences/history/favorites.
- route.

Local:

- dropdown open.
- search input זמני.
- modal/sheet open.
- hover states.

---

# 68. Event Handling

UI event:

```text
User clicks Play
↓
Component
↓
audioService.play()
↓
Audio element
↓
event
↓
playerState updates
↓
UI rerenders
```

זהו flow ברור.

---

# 69. Error Handling

Error טכני נלכד ב־Service.

לדוגמה:

```text
fetch failed
↓
library-service
↓
library state = error
↓
Page renders ErrorState
```

לא זורקים Error raw ל־UI.

---

# 70. Debugging

אפשר Console logs בפיתוח.

לא להשאיר debug noise רב ב־Production.

לא צריך Logger framework.

---

# 71. Comments בקוד

Comments רק כאשר:

- יש החלטה לא מובנת.
- יש Edge Case.
- יש workaround.

לא לכתוב comments שמסבירים קוד ברור.

---

# 72. פונקציות

להעדיף פונקציות קצרות עם אחריות אחת.

אם Function עושה:

```text
fetch
parse
search
update DOM
write storage
```

היא גדולה מדי.

---

# 73. קבצים

קובץ לא חייב להיות קטן מאוד.

אין "כל function בקובץ".

פיצול רק לפי אחריות ברורה.

---

# 74. כלל נגד Over Engineering

לא ליצור מראש:

```text
interfaces/
models/
repositories/
adapters/
factories/
providers/
use-cases/
commands/
events/
```

אין צורך בפרויקט הזה.

---

# 75. מודלים

אין צורך ב־Class לכל Track/Topic.

JSON Objects רגילים מספיקים.

לדוגמה:

```js
track.title
track.audio
track.text
```

---

# 76. ללא TypeScript בגרסה א'

כיוון שהדרישה היא:

```text
No Build
No Compile
```

נשתמש ב־JavaScript מודרני.

אם בעתיד הפרויקט נהיה גדול מספיק:
- אפשר לשקול TypeScript.

לא עכשיו.

---

# 77. JSDoc

אפשר להשתמש ב־JSDoc במקומות מרכזיים.

לדוגמה:

```js
/**
 * @param {string} trackId
 */
```

רק אם מוסיף ערך.

לא להפוך את הקוד למסמך Types ידני.

---

# 78. `vendor/` — לא כרגע

לא צריך תיקיית Vendor בגרסה א' אם dependencies מגיעות דרך Import Map/CDN.

אם נחליט לארח dependencies מקומית:
- נוסיף `/vendor`.

לא מראש.

---

# 79. `assets/`

כרגע אין צורך בתיקייה כללית אם אין Images/Fonts.

אם נוסיף:

```text
/assets/
├── icons/
├── images/
└── fonts/
```

אבל רק כאשר יש תוכן אמיתי.

---

# 80. Icons

אם יש מעט Icons:
- אפשר inline SVG בתוך Components.

אם גדל:
- `/assets/icons`.

לא להקים Icon System מורכב.

---

# 81. תמונות

אין דרישה לתמונות בגרסה א'.

לכן אין צורך:

```text
/images
```

סתם.

---

# 82. Tests Structure — בהמשך

כאשר נעבור לתכנית הבדיקות, המבנה יכול להיות:

```text
/tests
```

אבל לא נוסיף אותו לפני שיש Tests אמיתיים.

---

# 83. מסמכים

מומלץ לשמור את מסמכי האפיון בתיקייה:

```text
/docs
```

לדוגמה:

```text
/docs
├── 01-product-requirements.md
├── 02-functional-spec.md
├── 03-content-generator-spec.md
├── 04-ux-ui-spec.md
├── 05-technical-architecture.md
├── 06-project-structure.md
└── ...
```

זה ישמור על סדר.

---

# 84. README

מומלץ Root:

```text
README.md
```

מטרתו:

- מה הפרויקט.
- איך מריצים מקומית.
- איך מריצים Generator.
- איך מוסיפים תוכן.
- איך עושים Deploy.

לא חוזר על כל מסמכי `/docs`.

---

# 85. `.gitignore`

יכלול רק מה שבאמת נדרש.

לדוגמה:

```text
node_modules/
.DS_Store
Thumbs.db
*.tmp
```

אם אין `node_modules` בפועל:
- עדיין אפשר להשאיר.

---

# 86. האם `library.json` נכנס ל־Git

כן, בגרסה א'.

הסיבה:

- GitHub Pages צריך להגיש אותו.
- Generator רץ לפני Push.
- אין Build server.

לכן:

```text
content + library.json
```

שניהם ב־Repository.

---

# 87. האם Audio נכנס ל־Git

כן בשלב הראשון, כל עוד גודל הפרויקט סביר.

אם בעתיד Repository נהיה כבד:
- נוציא Audio ל־CDN/Object Storage.

לא עכשיו.

---

# 88. האם TXT נכנס ל־Git

כן.

הוא מקור תוכן.

---

# 89. Generated JSON ו־Source יחד

זה תקין שב־Repo יהיו:

```text
/content
/data/library.json
```

האחד מקור.

השני artifact של Generator.

---

# 90. מתי פותחים תיקייה חדשה

רק כשיש לפחות שניים־שלושה קבצים מאותה אחריות.

לא יוצרים:

```text
utils/
helpers/
common/
shared/
```

רק "כי אולי נצטרך".

---

# 91. Utils

בגרסה א' אין `/utils`.

אם נוצרת פונקציה כללית:
- קודם שומרים ליד המקום שמשתמש בה.

רק אם באמת reused בכמה מקומות:
- יוצרים `utils`.

---

# 92. Helpers

אותו עיקרון.

לא `helpers.js` ענק.

---

# 93. Config

`app-config.js` קטן בלבד.

לא מערכת Configuration Dynamic מורכבת.

---

# 94. Constants

לא צריך `constants.js` מרכזי אם יש מעט.

Constant ששייך ל־Audio:
- בתוך `audio-service`.

Constant גלובלי:
- `app-config`.

---

# 95. Styling naming

CSS Classes ב־kebab-case.

לדוגמה:

```text
.track-row
.mini-player
.player-controls
.topic-card
```

---

# 96. CSS specificity

להעדיף Classes פשוטים.

לא selectors עמוקים:

```css
.app .page .content .row .button span
```

---

# 97. CSS architecture

לא BEM חובה.

לא Utility framework חובה.

שמות פשוטים ועקביים מספיקים.

---

# 98. Z-index

לשמור מספר קטן של שכבות:

```text
content
sticky
mini-player
bottom-sheet
modal
```

להגדיר ב־variables.css.

---

# 99. Mini Player ו־Bottom Nav

צריך לקחת בחשבון גובה שניהם ב־Layout.

לא לתת להם לכסות תוכן.

---

# 100. Scroll ownership

ברירת מחדל:

```text
body/main scroll
```

לא Scroll פנימי לכל Panel.

בדסקטופ אפשר exception רק אם ממש מועיל.

---

# 101. Text rendering

Text נשמר ב־JSON.

Track Page מציג:

```text
white-space: pre-wrap
```

או פתרון שקול.

אין HTML parsing.

---

# 102. שיתוף קוד בין Mobile/Desktop

אותם Components.

לא:

```text
mobile-player.js
desktop-player.js
```

אלא אם ההתנהגות באמת שונה.

ברירת המחדל:
- CSS משנה Layout.

---

# 103. Responsive responsibility

CSS אחראי ל־Layout.

JavaScript לא צריך לבדוק width בכל מקום.

רק כשBehavior באמת שונה אפשר להשתמש ב־matchMedia.

---

# 104. Lazy Loading של Pages

לא נדרש בגרסה א'.

כל JS קטן מספיק.

אין Dynamic Imports בשביל "אופטימיזציה" לפני שיש בעיה.

---

# 105. Lazy Loading של Audio

כן.

Audio נטען רק כאשר צריך.

זה מגיע טבעית מה־Audio Element.

---

# 106. Tree traversal

פונקציות עץ שייכות ל־`library-service`.

לא ל־Page.

לדוגמה:

```text
flattenTracks(topic)
getBreadcrumb(topicId)
```

---

# 107. Breadcrumb data

לא לחשב בכל Component מחדש.

Library Service יכול לספק:

```text
getTopicAncestors(id)
getTrackAncestors(id)
```

---

# 108. Current Context

נבנה כאשר המשתמש בוחר Track מתוך Topic.

TrackRow/TopicPage מעבירים ל־Audio Service את רשימת ה־Track IDs של ההקשר.

לא לחשב Next על ידי "חיפוש DOM".

---

# 109. Favorites

ה־Component משנה דרך User State/Storage Service.

לא שומר ל־localStorage ישירות.

---

# 110. History

Audio Service/Player integration מעדכנים History כאשר מתחילה האזנה ממשית.

לא Track Page.

כך History נשמר גם אם Track התחיל ממסך Search.

---

# 111. Progress

Player/Audio logic מעדכן.

לא UI.

---

# 112. Listening Mode

שמור ב־User Preferences.

ה־Selector רק משנה Preference.

Audio Service קורא את המצב בזמן `ended`.

---

# 113. Repeat

Repeat הוא Player State, לא Preference קבועה בהכרח.

ברירת המחדל:
- False בכל Session/Track חדש.

אם בעתיד נרצה לשמור:
- אפשר.

---

# 114. Full Player State

לא שומרים "player open" ב־localStorage.

זה UI state זמני.

---

# 115. Search State

לא שומרים Query בהיסטוריה המקומית בגרסה א'.

---

# 116. Error Recovery

Retry actions נמצאות ב־Service/Page המתאים.

לדוגמה:

- Library Error → `loadLibrary()`.
- Audio Error → `audioService.reload()`.

---

# 117. Accessibility files

לא צריך תיקייה נפרדת.

Accessibility היא חלק מה־Components.

---

# 118. Internationalization

לא צריך `/i18n` בגרסה א'.

המוצר בעברית.

אם בעתיד יידרשו שפות נוספות:
- נוסיף שכבה.

לא מראש.

---

# 119. Analytics

לא חלק מהמבנה כרגע.

אם בעתיד נרצה:
- Service קטן.

לא ליצור Placeholder.

---

# 120. Environment files

אין `.env` בגרסה א'.

אין Secrets ואין Build.

---

# 121. Package.json

האתר לא חייב `package.json`.

אבל ה־Generator יכול להרוויח ממנו אם נרצה פקודה:

```text
npm run generate
```

אם משתמשים רק ב:

```text
node tools/generate-library.js
```

אפשר בלי `package.json`.

העדיפות לגרסה א':
- בלי package.json אם אין בו צורך ממשי.

---

# 122. אם נוסיף package.json

רק עבור scripts פשוטים:

```json
{
  "scripts": {
    "generate": "node tools/generate-library.js"
  }
}
```

לא dependencies אם אין צורך.

---

# 123. README — מבנה מומלץ

```text
# Project Name

## Run locally
## Generate library
## Add content
## Deploy
## Project structure
## Documentation
```

---
# 124. `/docs`

המסמכים הקיימים צריכים להישמר בסדר מספרי.

המלצה:

```text
01-product-requirements.md
02-functional-spec.md
03-content-generator-spec.md
04-ux-ui-spec.md
05-technical-architecture.md
06-project-structure.md
07-development-plan.md
08-test-plan.md
09-acceptance-criteria.md
10-production-checklist.md
```

---

# 125. מה לא לשים באותו קובץ

לא לשלב למשל:

```text
audio-service + router
search + storage
player UI + library loader
```

אם האחריות שונה בבירור.

---

# 126. מה כן אפשר להשאיר באותו קובץ

פונקציות קטנות הקשורות מאוד זו לזו.

לדוגמה:

`router-service.js` יכול להכיל:

```text
parseRoute
navigate
startRouter
```

אין צורך בשלושה קבצים.

---

# 127. קובץ שגדל

אם קובץ עובר סדר גודל של כמה מאות שורות ולא ברור לקריאה:
- בודקים האם יש שתי אחריויות.
- אם כן מפצלים.

לא מפצלים רק בגלל מספר שורות.

---

# 128. עקרון "מקום טבעי"

כאשר לא ברור איפה לשים קוד, שואלים:

> מה האחריות העיקרית שלו?

אם הוא:
- מדבר עם Audio → audio-service.
- מציג UI → component/page.
- שומר data → storage-service.
- מחפש → search-service.
- קורא library → library-service.

---

# 129. Anti-pattern: God Service

לא להפוך `app-service.js` לקובץ שעושה הכל.

אין צורך בכלל ב־`app-service.js` בגרסה א'.

---

# 130. Anti-pattern: Generic Manager

לא ליצור:

```text
data-manager.js
ui-manager.js
state-manager.js
system-manager.js
```

שמות כאלה בדרך כלל מסתירים אחריות לא ברורה.

---

# 131. Anti-pattern: Shared Everything

לא לשים הכול ב:

```text
common/
shared/
utils/
```

רק כדי "למחזר".

---

# 132. Anti-pattern: Premature Abstraction

אם יש כרגע:

```text
AudioService
```

לא צריך:

```text
IAudioService
AudioServiceImpl
AudioServiceFactory
```

---

# 133. Anti-pattern: Event Bus

לא צריך Global Event Bus.

Signals מספיקים.

---

# 134. Anti-pattern: State Duplication

לא לשמור אותו מידע:

- ב־Player State.
- ב־Component State.
- ב־localStorage.
- ב־DOM.

מקור אמת אחד.

---

# 135. Anti-pattern: DOM as Data Source

לא קוראים מידע מה־DOM כדי לדעת:

- Track next.
- Current topic.
- Favorites.

כל המידע מגיע מה־State/Library.

---

# 136. Anti-pattern: Hardcoded Content

אסור לשים:

```js
const tracks = [...]
```

בתוך הקוד.

כל תוכן מגיע מ־`library.json`.

---

# 137. Anti-pattern: Magic Paths

לא לכתוב בכל מקום:

```text
./data/library.json
```

הנתיב מגיע מ־Config.

---

# 138. Anti-pattern: Browser-specific hacks

לא להכניס workaround לדפדפן ספציפי בלי שיש בעיה אמיתית.

---

# 139. Git Hygiene

Commitים צריכים להפריד ככל האפשר בין:

- קוד.
- תוכן.
- generated JSON.

אבל אין חובה קשיחה.

---

# 140. Generated JSON consistency

אחרי שינוי Content:

- מריצים Generator.
- מוסיפים את `library.json` שנוצר לאותו Commit.

כך Repo נשאר עקבי.

---

# 141. קבצים זמניים

Generator temp files:

```text
library.tmp.json
```

צריכים להימחק בסיום.

אם נשארו:
- `.gitignore`.

---

# 142. Testability

Functions שקל לבדוק צריכות להישאר Pure כשאפשר.

דוגמאות:

```text
parseRoute
normalizeSearchText
getNextTrackId
naturalSort
buildTrackId
```

---

# 143. No Hidden Magic

הפרויקט צריך להיות כזה שמפתח יכול להבין מ־Folder Tree מה קורה.

אם צריך לדעת "Convention סודי":
- המבנה מסובך מדי.

---

# 144. Minimal Entry Points

יש רק שני Entry Points מרכזיים:

```text
Browser → index.html → main.js
Generator → generate-library.js
```

זהו.

---

# 145. Deployment Surface

מה שעולה ל־GitHub Pages:

```text
index.html
404.html
app/
styles/
data/
content/
assets/ אם יש
```

`tools/` יכול גם להיות ב־Repo אבל לא נדרש Runtime.

---

# 146. האם להסתיר `/tools`

אין צורך.

GitHub Pages יכול להגיש אותם כקבצים סטטיים, אבל הם לא בשימוש.

אם בעתיד רוצים להימנע:
- אפשר Deployment branch ייעודי.

לא צריך עכשיו.

---

# 147. אם נוסיף build בעתיד

הארכיטקטורה לא תלויה בכך.

אפשר בעתיד:
- bundle.
- minify.
- package.

אבל מקור הקוד יכול להישאר באותו מבנה.

---

# 148. Definition of Done — מבנה פרויקט

מבנה הפרויקט נחשב נכון כאשר:

1. כל קובץ נמצא במקום טבעי.
2. אין תיקיות placeholder מיותרות.
3. אין circular dependencies.
4. אין Hardcoded content בקוד.
5. Generator נפרד מה־Runtime.
6. Audio logic מרוכז ב־Audio Service.
7. Storage logic מרוכז ב־Storage Service.
8. Library load מרוכז ב־Library Service.
9. UI מחולק ל־Pages ו־Components.
10. State גלובלי קטן וברור.
11. CSS מופרד מה־JS.
12. אין Build חובה.
13. README מסביר את מבנה הפרויקט.
14. מסמכי האפיון שמורים תחת `/docs`.
15. מפתח חדש יכול להבין את המבנה תוך דקות.

---

# 149. מבנה סופי מומלץ — גרסה א'

```text
/
├── README.md
├── .gitignore
├── index.html
├── 404.html
│
├── docs/
│   ├── 01-product-requirements.md
│   ├── 02-functional-spec.md
│   ├── 03-content-generator-spec.md
│   ├── 04-ux-ui-spec.md
│   ├── 05-technical-architecture.md
│   └── 06-project-structure.md
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
│   ├── config/
│   │   └── app-config.js
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
│   │   ├── listening-mode-selector.js
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

---

# 150. השלב הבא

השלב הבא הוא:

# תכנית פיתוח מפורטת לפי Milestones

במסמך הבא נגדיר:

1. סדר הפיתוח המדויק.
2. מה בונים בכל שלב.
3. אילו קבצים נוצרים בכל Milestone.
4. מה חייב לעבוד בסיום כל שלב.
5. אילו בדיקות מבצעים לפני מעבר הלאה.
6. מתי בונים Generator.
7. מתי בונים Library Loader.
8. מתי בונים Router.
9. מתי בונים Topics ו־Tracks.
10. מתי בונים Audio Engine.
11. מתי בונים Full Player.
12. מתי בונים Mini Player.
13. מתי מוסיפים Text.
14. מתי מוסיפים Listening Modes.
15. מתי מוסיפים Resume/History/Favorites.
16. מתי מוסיפים Search.
17. מתי עושים Responsive/UX polish.
18. מתי מוסיפים Error Handling.
19. מתי עושים Performance pass.
20. מתי עושים GitHub Pages Deployment.
21. מהו Definition of Done לכל Milestone.
22. איך נשמור שבכל שלב תהיה גרסה עובדת ולא "חצי מערכת".

לאחר תכנית הפיתוח נעבור ל:

**תכנית בדיקות מלאה → Acceptance Criteria / Definition of Done → Production Checklist.**