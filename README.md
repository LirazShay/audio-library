# Audio Library

ספריית שמע דינמית מבוססת קבצים.

## מקור האמת של הפרויקט

כל מסמכי האפיון והפיתוח נמצאים תחת `/docs`.

לפני עבודה על Milestone חדש יש לקרוא:
1. `CURRENT-STATUS.md`
2. `docs/07-development-plan.md`
3. את מסמכי האפיון הרלוונטיים לשלב

## מבנה בסיסי

```text
/
├── src/                  # כל מה שנפרס לאתר
│   ├── index.html
│   ├── 404.html
│   ├── app/
│   ├── styles/
│   ├── content/
│   ├── data/
│   └── config/
├── tools/                # כלי פיתוח ו-Generator
├── docs/                 # מסמכי הפרויקט
├── .github/workflows/    # Deployment
├── CURRENT-STATUS.md
└── README.md
```

## הפעלה מקומית

האתר הוא Static Web App ללא Build.

מתיקיית הפרויקט:

```bash
python -m http.server 8080 --directory src
```

ואז לפתוח:

```text
http://localhost:8080/
```

אין להפעיל את `src/index.html` ישירות דרך `file://`.

## Deployment

GitHub Pages נפרס באמצעות GitHub Actions.

ה־workflow:

```text
.github/workflows/deploy-pages.yml
```

מפרסם רק את:

```text
src/
```

לכן `docs/`, `tools/`, `CURRENT-STATUS.md` ושאר קבצי הפיתוח אינם חלק מהאתר שנפרס.

## Runtime data

קבצי Runtime נשמרים בתוך `src/`:

```text
src/content/   # קבצי שמע וטקסט
src/data/      # JSON שנוצר, למשל library.json
src/config/    # הגדרות Runtime של האתר
```

אין JSON Runtime ברוט של ה־repository.

## טכנולוגיות בסיס

- Preact
- HTM
- @preact/signals
- Browser ES Modules
- Import Maps
- Plain CSS

## עקרונות

- Static client-side web app
- GitHub Pages
- תוכן מתוך תיקיות וקבצי שמע/TXT
- Generator ייצור `src/data/library.json`
- ללא Backend בגרסה הראשונה
- ללא Build מורכב
- פיתוח לפי Milestones
