# תכנית פיתוח מפורטת לפי Milestones — ספריית שמע דינמית
**גרסה:** 1.0  
**סטטוס:** מסמך תכנית פיתוח  
**מבוסס על:** מסמך דרישות מוצר 1.0 + אפיון פונקציונלי 1.0 + מודל התוכן וה־Generator 1.0 + אפיון UX/UI 1.0 + ארכיטקטורה טכנית 1.0 + מבנה הפרויקט 1.0  
**מטרת המסמך:** להגדיר סדר פיתוח ברור, הדרגתי ופשוט, שבו בסוף כל Milestone קיימת מערכת עובדת שניתן לבדוק לפני שממשיכים.

---

# 1. עקרון הפיתוח

המערכת תיבנה בשלבים קטנים יחסית.

בכל שלב:

1. בונים רק את מה שנדרש לשלב.
2. משאירים מערכת רצה.
3. מבצעים בדיקות בסיסיות.
4. מתקנים בעיות.
5. רק אז ממשיכים.

העיקרון:

> **לא בונים חצי מערכת גדולה. בונים מערכת קטנה שעובדת, ואז מרחיבים אותה.**

---

# 2. סדר ה־Milestones

הסדר המומלץ:

```text
M0  – שלד הפרויקט
M1  – Generator בסיסי
M2  – טעינת Library ו־JSON
M3  – Router וניווט בסיסי
M4  – נושאים ותתי־נושאים
M5  – רשימות Tracks
M6  – Audio Engine בסיסי
M7  – Full Player
M8  – Mini Player ונגן גלובלי
M9  – הצגת טקסט
M10 – Listening Modes
M11 – Resume / Progress / History
M12 – Favorites
M13 – Search
M14 – Responsive + UX Polish
M15 – Error Handling ומקרי קצה
M16 – Performance pass
M17 – GitHub Pages Deployment
M18 – Stabilization / Release Candidate
```

---

# 3. M0 — שלד הפרויקט

## מטרה

ליצור את המבנה הבסיסי של הפרויקט ולהוכיח שהאתר נטען כ־Static Web App.

## יוצרים

```text
README.md
.gitignore
index.html
404.html

app/
  main.js
  app.js

styles/
  variables.css
  base.css
  layout.css
  components.css
  responsive.css

content/
data/
tools/
docs/
```

## מימוש

- `index.html` עם `lang="he"` ו־`dir="rtl"`.
- Import Map.
- טעינת Preact/HTM/Signals.
- Root element.
- `main.js` שמרנדר App בסיסי.
- CSS בסיסי.
- Static local server לפיתוח.

## תוצאה נדרשת

פתיחת האתר מציגה מסך פשוט:

```text
ספריית השמע
```

ללא שגיאות Console.

## בדיקות

- האתר נטען ב־Chrome.
- האתר נטען ב־Edge.
- RTL עובד.
- אין צורך ב־Build.
- Refresh עובד.

## Definition of Done

- הפרויקט רץ מ־HTTP static server.
- Preact נטען.
- App בסיסי מרונדר.
- מבנה התיקיות תואם למסמך מבנה הפרויקט.

---

# 4. M1 — Generator בסיסי

## מטרה

להפוך את תיקיית `/content` ל־`library.json`.

## יוצרים

```text
tools/generate-library.js
data/library.json
```

## מימוש

ה־Generator מבצע:

- recursive scan.
- Folder → Topic.
- Audio → Track.
- same-name TXT → Text.
- Natural Sort.
- path יחסי.
- ID דטרמיניסטי.
- `schemaVersion`.
- `generatedAt`.
- Pretty JSON.
- Atomic write.
- Summary.

## פורמטי Audio

לפחות:

```text
mp3
m4a
aac
ogg
oga
opus
webm
wav
flac
```

## מקרי קצה

- Audio ללא TXT.
- TXT ללא Audio.
- Empty folder.
- duplicate basename.
- עברית.
- spaces.
- Unicode.

## תוצאה נדרשת

ממבנה כזה:

```text
content/
  נושא א/
    קטע.mp3
    קטע.txt
```

נוצר JSON תקין עם Topic ו־Track.

## בדיקות

להכין Content בדיקה קטן עם:
- 2–3 רמות.
- Audio עם TXT.
- Audio בלי TXT.
- TXT בלי Audio.
- שמות בעברית.

## Definition of Done

- Generator רץ בפקודה אחת.
- JSON תקין.
- שתי הרצות זהות מייצרות אותו מבנה ו־IDs.
- Warning/Error ברורים.
- קובץ בעייתי לא מפיל את כל הספרייה אם אינו Critical.

---

# 5. M2 — Library Loader

## מטרה

לטעון `library.json` בדפדפן ולבנות מודל נתונים בזיכרון.

## יוצרים

```text
app/services/library-service.js
app/state/app-state.js
```

## מימוש

- Fetch ל־`library.json`.
- בדיקת `schemaVersion`.
- Building Maps:
  - `tracksById`
  - `topicsById`
- פונקציות:
  - `getRoot()`
  - `getTopic(id)`
  - `getTrack(id)`
  - `getAllTracks()`
  - `getAllTopics()`

## תוצאה נדרשת

האתר מציג:
- מספר Topics.
- מספר Tracks.
- הודעת Loading קצרה בזמן טעינה.

## בדיקות

- JSON תקין.
- JSON חסר.
- JSON פגום.
- schemaVersion לא נתמך.

## Definition of Done

- הספרייה נטענת פעם אחת.
- אין Fetch חוזר בכל Page.
- Lookup לפי ID עובד.
- Failure אינו מפיל את כל האפליקציה.

---

# 6. M3 — Router וניווט בסיסי

## מטרה

לאפשר ניווט בין מסכים באמצעות Hash Routing.

## יוצרים

```text
app/services/router-service.js
app/pages/home-page.js
app/pages/not-found-page.js
```

## Routes ראשונים

```text
/#/
/#/topic/:id
/#/track/:id
```

## מימוש

- parse hash.
- current route.
- `hashchange`.
- `navigate()`.
- Browser Back/Forward.

## תוצאה נדרשת

אפשר:
- לעבור Home → Topic.
- Back.
- Refresh.

## בדיקות

- URL ישיר.
- Route לא קיים.
- Track/Topic ID לא קיים.

## Definition of Done

- Back/Forward טבעיים.
- Refresh לא שובר.
- Not Found מוצג נכון.
- אין Router dependency חיצוני.

---

# 7. M4 — נושאים ותתי־נושאים

## מטרה

להציג את מבנה הספרייה בפועל.

## יוצרים

```text
app/pages/topics-page.js
app/pages/topic-page.js
app/components/topic-card.js
app/components/breadcrumb.js
```

## מימוש

Home/Topics:
- root topics.

Topic Page:
- שם Topic.
- child Topics.
- Breadcrumb.
- Empty Topic.

## תוצאה נדרשת

אפשר לדפדף בכל עומק.

## בדיקות

- Topic עם Topic.
- Topic עם 10 רמות.
- Topic ריק.
- שמות ארוכים.
- עברית.

## Definition of Done

- אין הנחה על depth.
- Breadcrumb נכון.
- Back עובד.
- Topic UI רספונסיבי בסיסית.

---

# 8. M5 — רשימות Tracks

## מטרה

להציג Tracks בכל Topic.

## יוצרים

```text
app/components/track-row.js
```

## מימוש

Track Row:
- title.
- Play placeholder / open.
- duration אם זמין.
- current indicator בהמשך.

Topic Page:
- child Topics.
- Tracks.

## תוצאה נדרשת

לחיצה על Track פותחת Track Page בסיסי.

## בדיקות

- Topic עם Tracks בלבד.
- Topic עם Tracks + Topics.
- Track title ארוך.
- Track ללא TXT.

## Definition of Done

- רשימות ברורות.
- order תואם JSON.
- Track direct URL עובד.

---

# 9. M6 — Audio Engine בסיסי

## מטרה

לנגן Track אחד באמצעות Audio Element יחיד.

## יוצרים

```text
app/services/audio-service.js
app/state/player-state.js
```

## מימוש

- `new Audio()` או Audio Element קבוע.
- `loadTrack`.
- `play`.
- `pause`.
- `seek`.
- `skipForward(10)`.
- `skipBackward(10)`.
- events בסיסיים:
  - play
  - pause
  - timeupdate
  - loadedmetadata
  - ended
  - error
  - waiting
  - playing

## תוצאה נדרשת

Track Page יכול:
- Play.
- Pause.
- Seek.
- להציג זמן.

## בדיקות

- MP3.
- M4A.
- Track missing.
- Unsupported/failed audio.
- מעבר Track בזמן Playing.

## Definition of Done

- קיים Audio אחד בלבד.
- שני Tracks לא מנגנים במקביל.
- State מתעדכן מאירועי Audio.
- Error מוצג במצב מבוקר.

---

# 10. M7 — Full Player

## מטרה

לבנות את חוויית הנגן המלאה.

## יוצרים

```text
app/components/full-player.js
app/components/progress-bar.js
```

## מימוש

פקדים:

- Play/Pause.
- ±10.
- Previous placeholder.
- Next placeholder.
- Progress.
- current time.
- duration.
- speed.
- repeat.
- volume desktop.
- loading/buffering state.

## Visualization

להתחיל פשוט:
- progress ring או bars עדינים.

לא Web Audio API.

## תוצאה נדרשת

מסך Track נראה ומרגיש כמו נגן אמיתי.

## בדיקות

- seek drag.
- speed.
- mute/volume.
- loading.
- buffering.
- error.
- progress.

## Definition of Done

- כל פקדי הליבה עובדים.
- UI ברור במובייל.
- UI סביר בדסקטופ.
- אין כפתור מיותר בליבה.

---

# 11. M8 — Mini Player ונגן גלובלי

## מטרה

לאפשר שמע רציף בזמן ניווט.

## יוצרים

```text
app/components/mini-player.js
```

## מימוש

- Mini Player ב־App Shell.
- מופיע כאשר יש Current Track.
- Play/Pause.
- Track title.
- progress קטן.
- open Full Player.

## תוצאה נדרשת

המשתמש:
1. מפעיל Track.
2. עובר ל־Topic אחר.
3. השמע ממשיך.

## בדיקות

- navigation בזמן Playing.
- search/page change בהמשך.
- refresh כמובן עוצר בפועל, אבל Resume יגיע מאוחר יותר.

## Definition of Done

- Audio לא תלוי ב־Track Page.
- Mini/Full Player שולטים באותו Audio.
- אין restart בעת navigation.

---

# 12. M9 — הצגת הטקסט

## מטרה

לחבר את ה־TXT לנגן כחוויית תוכן אחת.

## מימוש

Track Page מציג:
- `track.text`.
- `white-space: pre-wrap`.
- RTL.
- layout נוח.

אם אין Text:
- הודעה קצרה או הסתרה.

## תוצאה נדרשת

Audio + Text מופיעים באותו מסך.

## בדיקות

- טקסט קצר.
- טקסט ארוך.
- שורות ריקות.
- עברית.
- Unicode.
- ללא TXT.

## Definition of Done

- הטקסט קריא.
- אין HTML parsing.
- Scroll לא מסתיר שליטה בסיסית בנגן.

---

# 13. M10 — Listening Modes

## מטרה

להוסיף את ההתנהגות הכללית שסיכמנו.

## יוצרים

```text
app/components/listening-mode-selector.js
```

## המצבים

```text
שיר בודד
המשך אוטומטי
בחירה חופשית
ערבוב אוטומטי
```

## מימוש Context

כאשר Track נבחר מתוך Topic:
- נשמר `currentContext.trackIds`.

## Next / Previous

מבוססים על Context.

## Repeat

Repeat ל־Current Track גובר על Listening Mode.

## תוצאה נדרשת

`ended` מפעיל התנהגות מתאימה.

## בדיקות

- first track.
- middle track.
- last track.
- single-track context.
- repeat.
- random.
- manual next.

## Definition of Done

- ארבעת המצבים עובדים.
- Next/Previous עקביים.
- אין מעבר אוטומטי ל־Topic לא קשור.
- Repeat priority נכון.

---

# 14. M11 — Resume / Progress / History

## מטרה

לזכור את המשתמש מקומית.

## יוצרים

```text
app/services/storage-service.js
app/state/user-state.js
app/pages/history-page.js
```

## מימוש

localStorage בלבד.

נשמר:
- progress.
- lastPlayed.
- completed.
- playbackRate.
- listeningMode.
- volume לפי הצורך.

## Save triggers

- interval סביר.
- pause.
- seek.
- track change.
- pagehide.

## Resume

- Track נפתח בנקודה האחרונה.
- אפשר "התחל מהתחלה".

## History

- last played first.
- progress.
- continue.

## תוצאה נדרשת

סוגרים/מרעננים וחוזרים:
- אפשר להמשיך.

## בדיקות

- progress קטן.
- progress משמעותי.
- completed.
- localStorage corrupted.
- track שנמחק מה־Library.

## Definition of Done

- Resume עובד.
- History עובד.
- Storage failure לא מפיל את האתר.
- אין write בכל `timeupdate`.

---

# 15. M12 — Favorites

## מטרה

לאפשר שמירת Tracks.

## יוצרים

```text
app/pages/favorites-page.js
```

## מימוש

- add.
- remove.
- favorite state ב־Track Page/Track Row.
- favorites list.

## Storage

IDs בלבד.

## בדיקות

- add/remove.
- refresh.
- removed Track.
- duplicate click.

## Definition of Done

- Favorite מיידי.
- נשמר אחרי Refresh.
- אין duplicates.

---

# 16. M13 — Search

## מטרה

לאפשר למצוא תוכן במהירות.

## יוצרים

```text
app/services/search-service.js
app/pages/search-page.js
```

## מימוש

Search על:
- Topic name.
- Track title.
- Breadcrumb/context.

אם ביצועים טובים:
- Track text.

## normalization

- trim.
- lowercase.
- Unicode normalization.

## UI

- input.
- clear.
- results.
- no results.

## תוצאה נדרשת

הקלדה נותנת תוצאות מהירות.

## בדיקות

- עברית.
- אנגלית.
- חלק ממילה.
- אין תוצאות.
- כותרת ארוכה.
- חיפוש בזמן Audio Playing.

## Definition of Done

- search מהיר.
- אין dependency חיצוני.
- result opens correct route.

---

# 17. M14 — Responsive + UX Polish

## מטרה

להפוך את המערכת ממוצר עובד למוצר נעים ומרשים.

## עבודה

### Mobile
- Bottom Nav.
- Mini Player placement.
- Full Player.
- large controls.
- track text.
- sheets/popovers.

### Desktop
- wider layouts.
- list + player.
- volume.
- comfortable text width.

### Visual
- spacing.
- typography.
- player visual hierarchy.
- progress ring / bars.
- current track indication.
- completed state.

## בדיקות

- 320–360px.
- טלפון רגיל.
- tablet.
- desktop.
- wide desktop.

## Definition of Done

- אין overflow.
- פקדים נוחים.
- הטקסט קריא.
- Mini Player לא מסתיר תוכן.
- האתר מרשים אך לא עמוס.

---

# 18. M15 — Error Handling ומקרי קצה

## מטרה

להבטיח שמצבים לא תקינים לא שוברים את האתר.

## כיסוי

- library load error.
- JSON invalid.
- schema mismatch.
- topic not found.
- track not found.
- audio missing.
- unsupported audio.
- audio error.
- no text.
- empty topic.
- empty library.
- buffering.
- localStorage corrupted.
- disconnected network.

## Components

```text
empty-state.js
error-state.js
```

## Definition of Done

- לכל Error יש UI ברור.
- אין raw stack trace.
- Retry כשיש טעם.
- failure מקומי לא מפיל את כל App.

---

# 19. M16 — Performance Pass

## מטרה

למדוד לפני שעושים אופטימיזציה.

## בדיקות

- זמן טעינת `library.json`.
- זמן render.
- Search.
- Topic עם מאות Tracks.
- memory.
- audio start latency.

## רק אם צריך

אפשר:
- optimize maps.
- reduce text search.
- defer text indexing.
- preload next metadata.
- split huge list.
- virtualize very large list.

## לא לעשות מראש

- Web Worker.
- split JSON.
- lazy modules.
- complicated caching.

## Definition of Done

- אין lag מורגש בתוכן אמיתי.
- Search responsive.
- UI smooth.
- Audio remains stable.

---

# 20. M17 — GitHub Pages Deployment

## מטרה

להעלות את גרסת האתר האמיתית.

## עבודה

- repository.
- GitHub Pages.
- relative paths.
- base path verification.
- content/audio loading.
- direct hash URLs.
- 404 behavior.
- cache validation.

## בדיקות

- desktop.
- mobile.
- private/incognito.
- fresh browser cache.

## Definition of Done

- האתר נגיש מ־GitHub Pages.
- Audio מנגן.
- JSON נטען.
- Routes עובדים.
- no broken paths.

---

# 21. M18 — Stabilization / Release Candidate

## מטרה

לא להוסיף Features, רק לייצב.

## עבודה

- regression fixes.
- UX cleanup.
- remove debug logs.
- remove dead code.
- verify docs.
- verify Generator.
- verify content workflow.

## כלל

אין Feature חדש בשלב הזה אלא אם:
- blocker.
- critical UX issue.
## Definition of Done

- כל Milestones קודמים עוברים.
- אין Known Critical Bugs.
- workflow של הוספת Content עובד מתחילתו ועד סופו.
- Release Candidate מוכן.

---

# 22. סדר מימוש פנימי בכל Milestone

בכל Milestone עובדים באותו דפוס:

```text
1. Define exact task
2. Create minimum files
3. Implement happy path
4. Add required edge cases
5. Run manual checks
6. Fix
7. Update docs if decision changed
8. Commit
```

---

# 23. מה לא עושים במקביל

לא בונים:

```text
Search
Favorites
History
Player
Responsive
```

הכול יחד.

הסיבה:
- קשה לדעת איפה התקלה.
- קשה לבדוק.
- קשה לחזור אחורה.

---

# 24. סדר עדיפויות בפיתוח

## קודם
- Data.
- Navigation.
- Playback.

## אחר כך
- Persistence.
- Search.
- UX polish.

## בסוף
- Performance.
- Deployment.
- Stabilization.

---

# 25. Content Test Pack

כבר בתחילת הפיתוח כדאי לשמור תיקיית תוכן לדוגמה.

למשל:

```text
content/
  נושא א/
    01 - קטע ראשון.mp3
    01 - קטע ראשון.txt
    02 - קטע שני.mp3

    תת נושא/
      01 - קטע נוסף.m4a
      01 - קטע נוסף.txt

  נושא ב/
    ...
```

המטרה:
- אותו Test Data משמש לאורך כל הפיתוח.

---

# 26. Real Content Checkpoints

לא מספיק לעבוד רק עם Mock.

בנקודות הבאות צריך לבדוק עם תוכן אמיתי:

```text
M1
M6
M9
M13
M14
M16
M17
```

---

# 27. Definition of Done כללי לכל Milestone

Milestone לא נחשב גמור אם:

- יש Error ב־Console.
- יש feature מרכזי שלא נבדק.
- יש workaround ידני.
- צריך לערוך JSON ידנית.
- נוצר dependency שלא תועד.
- שברנו Milestone קודם.

---

# 28. Git Commit Strategy

מומלץ Commit אחד או כמה Commits ברורים לכל Milestone.

לדוגמה:

```text
M6: add global audio engine
M6: handle buffering and audio errors
```

לא חובה Squash.

---

# 29. Branching

אין צורך ב־Git Flow מורכב.

אפשר:

```text
main
feature branches לפי צורך
```

או אפילו עבודה ישירה ב־main אם הפרויקט אישי והכול בשליטה.

לא לבנות תהליך ארגוני מיותר.

---

# 30. Code Review עצמי

לפני סיום Milestone:

- האם האחריות במקום הנכון?
- האם הוספתי abstraction מיותר?
- האם אפשר לפשט?
- האם קוד UI מדבר ישירות עם browser API?
- האם יצרתי duplicate state?
- האם יש hardcoded content?

---

# 31. UX Review בכל Milestone רלוונטי

ב־M5 ומעלה:

- האם ברור מה ללחוץ?
- האם הכפתורים גדולים?
- האם Current Track ברור?
- האם יש יותר מדי פעולות?

---

# 32. Browser Matrix במהלך פיתוח

בכל Milestone גדול:

- Chrome/Chromium.

ב־M14 ומעלה:

- Edge.
- Firefox.
- Safari אם זמין.

לא צריך לבדוק כל דפדפן אחרי כל שורת קוד.

---

# 33. Mobile Testing

מ־M7 והלאה:

- DevTools mobile emulation.

מ־M14:
- מכשיר אמיתי לפחות אחד.

לפני Release:
- יותר ממכשיר אחד אם אפשר.

---

# 34. Audio Format Testing

ב־M6:

לפחות:
- MP3.
- M4A.

ב־M15:
- כל רשימת הפורמטים שה־Generator מזהה, ככל שיש קבצי בדיקה.

---

# 35. RTL Testing

מהרגע הראשון:

- כל UI ב־RTL.

לא לבנות LTR ואז "להפוך" בסוף.

---

# 36. Accessibility Checkpoints

ב־M7:
- Player buttons.

ב־M14:
- full keyboard/focus pass.

ב־M18:
- final accessibility check.

---

# 37. מה לא נכנס לתכנית V1

לא בונים:

- Login.
- Backend.
- CMS.
- User sync.
- Native apps.
- PWA offline.
- Service Worker.
- Web Audio DSP.
- Equalizer.
- AI.
- recommendations.
- complex playlists.
- timed lyrics.
- analytics platform.
- cloud database.

---

# 38. מתי מותר לשנות את המסמכים

המסמכים אינם "קדושים".

אם במהלך פיתוח מתברר ש:

- החלטה לא טובה.
- UX לא עובד.
- Edge Case חשוב חסר.

מעדכנים את המסמך המתאים.

אבל:
- לא משנים ארכיטקטורה סתם.
- מתעדים החלטות משמעותיות.

---

# 39. Change Discipline

לפני שינוי משמעותי:

1. האם זה Requirement אמיתי?
2. האם זה פותר בעיה נוכחית?
3. האם זה מוסיף complexity?
4. האם אפשר לפתור פשוט יותר?

---

# 40. Completion Flow

הפיתוח כולו:

```text
M0 Skeleton
↓
M1 Generator
↓
M2 Library
↓
M3 Router
↓
M4 Topics
↓
M5 Tracks
↓
M6 Audio
↓
M7 Full Player
↓
M8 Mini Player
↓
M9 Text
↓
M10 Listening Modes
↓
M11 Resume/History
↓
M12 Favorites
↓
M13 Search
↓
M14 UX/Responsive
↓
M15 Errors
↓
M16 Performance
↓
M17 Deploy
↓
M18 Stabilize
```

---

# 41. Minimum Usable Product Point

המערכת כבר "שימושית" אחרי:

```text
M9
```

כלומר:

- Topics.
- Tracks.
- Audio.
- Full Player.
- Mini Player.
- Text.

M10 ומעלה הופכים אותה למוצר שלם.

---

# 42. Feature Complete Point

המוצר נחשב Feature Complete לאחר:

```text
M15
```

כלומר:
- core features קיימים.
- errors מטופלים.

M16–M18 הם:
- optimization.
- deployment.
- stabilization.

---

# 43. Acceptance לפני Production

לא עולים ל־Production רק כי "זה עובד אצלי".

לפני M17 צריך:

- Generator stable.
- audio stable.
- navigation stable.
- resume stable.
- mobile usable.
- errors handled.

---

# 44. סדר התיעוד

ב־`/docs`:

```text
01-product-requirements.md
02-functional-spec.md
03-content-generator-spec.md
04-ux-ui-spec.md
05-technical-architecture.md
06-project-structure.md
07-development-plan.md
```

לאחר מכן:

```text
08-test-plan.md
09-acceptance-criteria.md
10-production-checklist.md
```

---

# 45. Definition of Done — כל הפרויקט

הפרויקט נחשב מפותח כאשר:

1. ניתן להוסיף Audio + TXT לתיקייה.
2. Generator מייצר JSON.
3. האתר מציג את המבנה אוטומטית.
4. ניתן לנווט בכל עומק.
5. ניתן לנגן Track.
6. Audio ממשיך בזמן ניווט.
7. Full Player עובד.
8. Mini Player עובד.
9. Text מוצג.
10. Listening Modes עובדים.
11. Resume עובד.
12. History עובד.
13. Favorites עובדים.
14. Search עובד.
15. Mobile ו־Desktop טובים.
16. Errors מטופלים.
17. GitHub Pages עובד.
18. הוספת תוכן חדש לא דורשת שינוי קוד.

---

# 46. השלב הבא

השלב הבא הוא:

# תכנית בדיקות מלאה

במסמך הבא נגדיר:

1. אסטרטגיית בדיקות.
2. אילו בדיקות ידניות ואילו אוטומטיות.
3. בדיקות Generator.
4. בדיקות JSON.
5. בדיקות Router.
6. בדיקות Topics/Tracks.
7. בדיקות Audio.
8. בדיקות Listening Modes.
9. בדיקות Resume/History/Favorites.
10. בדיקות Search.
11. בדיקות Mobile/Desktop.
12. בדיקות RTL.
13. בדיקות Accessibility.
14. בדיקות Browser compatibility.
15. בדיקות Performance.
16. בדיקות Network/Buffering.
17. בדיקות Error Recovery.
18. Regression checklist.
19. Test data נדרש.
20. מה חייב לעבור לפני Release.

לאחר תכנית הבדיקות נעבור ל:

**Acceptance Criteria / Definition of Done מלא → Production / Release Checklist.**