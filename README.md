# Audio Library

ספריית שמע דינמית מבוססת קבצים.

## מקור האמת של הפרויקט

כל מסמכי האפיון והפיתוח נמצאים תחת `/docs`.

לפני עבודה על Milestone חדש יש לקרוא:
1. `CURRENT-STATUS.md`
2. `docs/07-development-plan.md`
3. את מסמכי האפיון הרלוונטיים לשלב

## הפעלה מקומית

האתר הוא Static Web App ללא Build.

מתיקיית הפרויקט אפשר להפעיל שרת סטטי פשוט, למשל:

```bash
python -m http.server 8080
```

ואז לפתוח:

```text
http://localhost:8080/
```

אין להפעיל את `index.html` ישירות דרך `file://`, משום שהפרויקט משתמש ב־ES Modules ויטען בהמשך נתונים באמצעות `fetch`.

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
- Generator ייצור `data/library.json`
- ללא Backend בגרסה הראשונה
- ללא Build מורכב
- פיתוח לפי Milestones
