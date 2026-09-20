# Audio Library

ספריית שמע דינמית מבוססת קבצים.

## עבודה עם ChatGPT / מעבר בין צ׳אטים

ה־repository הוא הזיכרון הקבוע של הפרויקט.

בכל צ׳אט חדש, נקודת הכניסה היא:

```text
AI-START-HERE.md
```

אחריו יש לקרוא:

```text
CURRENT-STATUS.md
docs/00-project-index.md
docs/11-current-implementation.md
docs/12-development-workflow.md
```

המטרה היא שצ׳אט חדש יוכל להמשיך את הפרויקט בלי לקבל סיכום ידני של הצ׳אט הקודם.

## מקור האמת של הפרויקט

מסמכי האפיון והפיתוח נמצאים תחת `/docs`.

מקור האמת למצב הפעיל:
- `CURRENT-STATUS.md`

החלטות ארכיטקטוניות:
- `docs/13-decisions-log.md`

ידע בדיקות ותקלות:
- `docs/14-testing-troubleshooting.md`

פרוטוקול handoff:
- `docs/15-chat-handoff-protocol.md`

## מבנה בסיסי

```text
/
├── AI-START-HERE.md       # נקודת כניסה יציבה לכל צ׳אט AI חדש
├── src/                   # כל מה שנפרס לאתר
│   ├── index.html
│   ├── 404.html
│   ├── app/
│   ├── styles/
│   ├── content/
│   ├── data/
│   └── config/
├── tools/                 # כלי פיתוח, Generator ובדיקות
├── docs/                  # אפיון + continuity documentation
├── .github/workflows/     # CI / Deployment
├── CURRENT-STATUS.md      # מצב פעיל + next action
└── README.md
```

## הפעלה מקומית

האתר הוא Static Web App ללא Build.

הדרך המועדפת ב־Windows:

```cmd
tools\update-and-preview.cmd
```

הסקריפט:
1. מושך את השינויים האחרונים עם `git pull --ff-only`
2. מריץ local checks
3. עוצר שרת ישן שמאזין על פורט 8080
4. מפעיל שרת Node חדש
5. פותח את הדפדפן

URL:

```text
http://127.0.0.1:8080/
```

## בדיקות מקומיות

```cmd
tools\local-check.cmd
```

ה־local checks כוללים:
- Generator tests
- local media-server tests
- יצירה מחדש של `src/data/library.json`

שרת המדיה המקומי:

```text
tools/dev-server.js
```

הרצה ידנית:

```cmd
node tools\dev-server.js
```

השרת תומך ב־HTTP byte ranges כדי ש־HTMLAudioElement, seek ו־timeline יעבדו כמו מול שרת מדיה תקין.

## Content / Generator

מקור התוכן:

```text
src/content/
```

ה־Generator:

```text
tools/generate-library.js
```

הקובץ שנוצר:

```text
src/data/library.json
```

אין לערוך את `library.json` ידנית כחלק מזרימת תוכן רגילה.

## Deployment

GitHub Pages נפרס באמצעות:

```text
.github/workflows/deploy-pages.yml
```

מפורסם רק:

```text
src/
```

לכן `docs/`, `tools/`, `AI-START-HERE.md`, `CURRENT-STATUS.md` ושאר קבצי הפיתוח אינם חלק מהאתר שנפרס.

Production:

```text
https://lirazshay.github.io/audio-library/
```

## טכנולוגיות בסיס

- Preact
- HTM
- @preact/signals
- Browser ES Modules
- Import Maps
- Plain CSS
- HTMLAudioElement
- GitHub Pages

## עקרונות חשובים

- Static client-side web app
- תוכן מתוך תיקיות וקבצי שמע/TXT
- Generator יוצר את `library.json`
- Audio גלובלי יחיד
- Player State מרכזי
- UI לא משנה את Audio element ישירות
- ללא Backend בגרסה הנוכחית
- פיתוח לפי Milestones ותתי־שלבים
- GitHub הוא מקור האמת בין צ׳אטים
