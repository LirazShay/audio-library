# Production / Release Checklist — ספריית שמע דינמית
**גרסה:** 1.0  
**סטטוס:** מסמך Release / Production Checklist  
**מבוסס על:** כל מסמכי האפיון, הפיתוח, הבדיקות וה־Acceptance של הפרויקט  
**מטרת המסמך:** לספק Checklist מעשי, קצר יחסית אך מקיף, לביצוע לפני כל Release, בזמן העלייה ולאחריה — כדי לוודא שהגרסה שנפרסת ל־Production אכן מוכנה.

> **עדכון מבנה Deployment:** קבצי ה-Runtime של האתר נמצאים תחת `/src` בלבד. `src/index.html`, `src/app`, `src/styles`, `src/content`, `src/data` ו-`src/config` הם עץ האתר שנפרס. `tools/`, `docs/` וקבצי ניהול נשארים מחוץ לאתר. GitHub Actions מפרסם ל-GitHub Pages רק את תוכן `src/`. בכל דוגמה ישנה במסמך שמציגה `/content`, `/data/library.json`, `/app`, `/styles` או `/index.html` ברוט של ה-repository, יש לקרוא אותם בהתאמה כ-`/src/content`, `/src/data/library.json`, `/src/app`, `/src/styles` ו-`/src/index.html`.

---

# 1. עקרון מרכזי

Release אינו שלב שבו "בודקים הכול מחדש מאפס".

לפני Release כבר אמורים להיות:

- פיתוח גמור.
- Acceptance Criteria שעברו.
- Test Plan מרכזי שעבר.
- אין Critical Bugs פתוחים.
- אין High Bugs בזרימה המרכזית.

ה־Checklist הזה הוא שכבת ההגנה האחרונה.

העיקרון:

> **לפני Release בודקים את מה שעלול להפיל משתמש אמיתי, לא ממציאים תהליך כבד חדש.**

---

# 2. מתי משתמשים במסמך

יש להשתמש ב־Checklist:

## לפני Release ראשון
חובה לעבור על הכול.

## לפני Release משמעותי
לעבור על כל הסעיפים הרלוונטיים.

## לפני עדכון תוכן בלבד
אפשר להשתמש בגרסה מצומצמת:

```text
Generator
JSON
Content
Deploy
Smoke Test
```

---

# 3. Release Types

## 3.1 Release קוד

כולל שינויי:

- JavaScript.
- CSS.
- Router.
- Player.
- Storage.
- Search.
- UX.

דורש Checklist מלא כמעט כולו.

## 3.2 Release תוכן בלבד

כולל:

- Audio.
- TXT.
- Topics.
- library.json.

דורש בעיקר:
- Generator.
- Content validation.
- Deploy.
- Smoke Test.

---

# 4. לפני תחילת Release

- [ ] כל שינויי הקוד שמיועדים לגרסה קיימים ב־Repository.
- [ ] אין קבצים מקומיים חשובים שלא נכנסו ל־Git.
- [ ] אין שינויים לא רצויים.
- [ ] אין debug code זמני.
- [ ] אין TODO קריטי שנשכח.
- [ ] כל מסמכי הפרויקט הרלוונטיים מעודכנים אם החלטות השתנו.
- [ ] ברור מה בדיוק נכנס לגרסה הזאת.

---

# 5. Freeze קצר לפני Release

לפני Release:

- [ ] לא מוסיפים Feature חדש.
- [ ] לא משנים Architecture.
- [ ] לא "מנקים" קוד גדול ברגע האחרון.
- [ ] מתקנים רק Bugs או בעיות Release.
- [ ] כל שינוי נוסף עובר Smoke Test מחדש.

המטרה:
> לא לייצר Regression ברגע האחרון.

---

# 6. Generator — בדיקות לפני Release

- [ ] `generate-library.js` רץ בלי Critical Error.
- [ ] הפקודה להרצת Generator עובדת כפי שמתועד.
- [ ] Summary מוצג.
- [ ] מספר Topics נראה סביר.
- [ ] מספר Tracks נראה סביר.
- [ ] מספר TXT matched נראה סביר.
- [ ] Warnings נבדקו.
- [ ] אין Conflict שלא טופל.
- [ ] אין duplicate basename בעייתי.
- [ ] אין Error שה־Generator דילג עליו בלי שנבדק.

---

# 7. Generator — Determinism

ב־Release משמעותי:

- [ ] הרצה נוספת ללא שינוי אינה משנה IDs או סדר.
- [ ] `generatedAt` הוא השינוי הצפוי היחיד אם אין שינוי Content.
- [ ] אין reorder מקרי של Tracks.

---

# 8. library.json

- [ ] `library.json` קיים.
- [ ] JSON תקין.
- [ ] `schemaVersion` נכון.
- [ ] `generatedAt` קיים.
- [ ] Root קיים.
- [ ] Paths יחסיים.
- [ ] אין Paths מקומיים כמו `C:\...`.
- [ ] עברית נשמרת תקין.
- [ ] אין corruption.
- [ ] הקובץ נוצר מה־Generator ולא נערך ידנית.

---

# 9. Content — Topics

- [ ] Topics חדשים מופיעים במקום הנכון.
- [ ] Topics שהוסרו אינם מופיעים.
- [ ] Rename משתקף.
- [ ] תתי־נושאים נמצאים תחת ההורה הנכון.
- [ ] אין Topic כפול בטעות.
- [ ] אין Topic ריק לא מתוכנן.

---

# 10. Content — Tracks

- [ ] Tracks חדשים מופיעים.
- [ ] Tracks שהוסרו אינם מופיעים.
- [ ] הסדר נכון.
- [ ] שמות נכונים.
- [ ] Audio path נכון.
- [ ] Track משויך ל־Topic הנכון.
- [ ] אין duplicate Track לא מתוכנן.

---

# 11. Content — Text

- [ ] TXT תואם ל־Audio הנכון.
- [ ] טקסט עברי מוצג תקין.
- [ ] Line breaks נשמרים.
- [ ] Track ללא TXT עדיין עובד.
- [ ] TXT ללא Audio דווח ולא יצר Track שגוי.
- [ ] אין HTML שמפורש בטעות.

---

# 12. Audio Files

ל־Release תוכן:

- [ ] לפחות Track חדש אחד נבדק בפועל.
- [ ] Audio מתחיל לנגן.
- [ ] Duration מזוהה.
- [ ] אין קובץ ריק/פגום.
- [ ] פורמט חדש, אם נוסף, נבדק בדפדפן אמיתי.
- [ ] שמות קבצים עם עברית/רווחים עובדים.

---

# 13. Application Startup

- [ ] האתר עולה ללא מסך ריק.
- [ ] אין Console Error קריטי.
- [ ] `library.json` נטען.
- [ ] App עובר מ־Loading ל־Ready.
- [ ] Home מופיע.
- [ ] No stale broken state.

---

# 14. Home

- [ ] Home נטען.
- [ ] Search entry נגיש.
- [ ] Topics מוצגים.
- [ ] Continue Listening מופיע רק אם רלוונטי.
- [ ] אין Empty section מיותר.
- [ ] Layout תקין במובייל.
- [ ] Layout תקין בדסקטופ.

---

# 15. Topic Navigation

- [ ] Root Topic navigation עובד.
- [ ] Subtopic navigation עובד.
- [ ] עומק של כמה רמות עובד.
- [ ] Breadcrumb עובד.
- [ ] Browser Back עובד.
- [ ] Browser Forward עובד.
- [ ] Refresh על Topic URL עובד.
- [ ] Topic Not Found מטופל.

---

# 16. Track Navigation

- [ ] Track נפתח.
- [ ] Direct Track URL עובד.
- [ ] Refresh על Track URL עובד.
- [ ] Track Not Found מטופל.
- [ ] Breadcrumb/context נכון.
- [ ] Current Track מסומן ברשימות.

---

# 17. Full Player — Smoke

חובה לבדוק לפחות Track אחד מתחילתו ועד חלק מהניגון:

- [ ] Play.
- [ ] Pause.
- [ ] Seek.
- [ ] Skip -10.
- [ ] Skip +10.
- [ ] current time.
- [ ] duration.
- [ ] speed.
- [ ] previous.
- [ ] next.
- [ ] repeat.
- [ ] loading state.
- [ ] buffering state אם ניתן לסמלץ.
- [ ] error state לפחות פעם אחת ב־Release Candidate.

---

# 18. Single Audio Instance

- [ ] מעבר Track עוצר את Track הקודם.
- [ ] אין overlap.
- [ ] אין שני Audio Elements פעילים.
- [ ] Mini Player ו־Full Player שולטים באותו State.

---

# 19. Mini Player

- [ ] מופיע לאחר בחירת Track.
- [ ] לא מופיע לפני שיש Track.
- [ ] Play/Pause עובד.
- [ ] Progress מתעדכן.
- [ ] לחיצה פותחת Full Player.
- [ ] אינו מסתיר Content.
- [ ] אינו מתנגש ב־Bottom Navigation.

---

# 20. Audio Continuity

תרחיש חובה:

```text
Play Track
→ Open another Topic
→ Open Search
→ Return Home
```

- [ ] Audio ממשיך.
- [ ] currentTime ממשיך.
- [ ] Mini Player נשאר.
- [ ] Current Track נשאר מסונכרן.

---

# 21. Listening Modes

לבדוק:

## שיר בודד
- [ ] Track מסתיים ונעצר.

## המשך אוטומטי
- [ ] Track באמצע רשימה עובר ל־Next.
- [ ] Track אחרון נעצר.

## בחירה חופשית
- [ ] אין מעבר אוטומטי.

## ערבוב אוטומטי
- [ ] Track אחר נבחר מתוך Context.
- [ ] אינו בוחר מיד אותו Track כאשר יש חלופה.

---

# 22. Repeat

- [ ] Repeat On מחזיר את Current Track להתחלה.
- [ ] Repeat גובר על Listening Mode.
- [ ] Repeat Off מחזיר התנהגות ל־Listening Mode.
- [ ] UI מבהיר ש־Repeat פעיל.

---

# 23. Resume

תרחיש חובה:

```text
Play Track
→ Pause באמצע
→ Refresh / Return later
```

- [ ] Resume point קיים.
- [ ] Play ממשיך מהנקודה האחרונה.
- [ ] "התחל מהתחלה" עובד אם קיים.
- [ ] Completed Track לא מקבל Resume לא הגיוני.

---

# 24. Progress Persistence

- [ ] Progress נשמר.
- [ ] אינו נכתב לכל `timeupdate`.
- [ ] Pause שומר.
- [ ] Seek שומר.
- [ ] Track switch שומר.
- [ ] pagehide שומר ככל האפשר.

---

# 25. History

- [ ] Track שהתחיל Playback נכנס להיסטוריה.
- [ ] Last Played ראשון.
- [ ] Progress נכון.
- [ ] Continue עובד.
- [ ] Removed Track לא שובר את המסך.
- [ ] Empty History נראה תקין.

---

# 26. Favorites

- [ ] Add עובד.
- [ ] Remove עובד.
- [ ] Refresh שומר.
- [ ] אין duplicates.
- [ ] Favorites Page עובד.
- [ ] Removed Track לא נשאר כפריט שבור.
- [ ] Empty Favorites נראה תקין.

---

# 27. Search

- [ ] Search לפי Topic.
- [ ] Search לפי Track title.
- [ ] עברית.
- [ ] English case-insensitive.
- [ ] No Results.
- [ ] Open Track result.
- [ ] Open Topic result.
- [ ] Search בזמן Audio Playing לא עוצר Audio.
- [ ] Full-text, אם מופעל, נבדק.

---

# 28. Storage

- [ ] preferences נטענות.
- [ ] favorites נטענים.
- [ ] history נטענת.
- [ ] progress נטען.
- [ ] corrupted localStorage אינו מפיל App.
- [ ] user חדש ללא Storage מקבל defaults תקינים.

---

# 29. New User Scenario

ב־Incognito / storage נקי:

- [ ] Home עולה.
- [ ] אין שגיאות.
- [ ] אין sections שבורים.
- [ ] default listening mode נכון.
- [ ] player defaults נכונים.

---

# 30. Returning User Scenario

עם State קיים:

- [ ] Favorite נשמר.
- [ ] History נשמרת.
- [ ] Resume נשמר.
- [ ] speed נשמר אם הוחלט.
- [ ] listening mode נשמר.
- [ ] stale IDs לא שוברים UI.

---

# 31. Error States

לבדוק לפחות:

- [ ] Library load error.
- [ ] Track missing.
- [ ] Audio error.
- [ ] Unsupported format.
- [ ] Empty Topic.
- [ ] Empty Library.
- [ ] Not Found.
- [ ] No Search Results.
- [ ] Storage parse error.

---

# 32. Error Recovery

- [ ] Library Error כולל Retry.
- [ ] Audio Error מאפשר Retry/Next.
- [ ] Not Found מאפשר Home/Search.
- [ ] Empty Topic מאפשר Back.
- [ ] Error אחד אינו מפיל את כל האתר.

---

# 33. Loading / Buffering

- [ ] Library Loading ברור.
- [ ] Audio Loading ברור.
- [ ] Buffering ברור.
- [ ] Play button לא מאפשר double action בעייתי.
- [ ] UI נשאר usable בזמן Buffering.

---

# 34. RTL

- [ ] `<html dir="rtl">`.
- [ ] Header תקין.
- [ ] Breadcrumb תקין.
- [ ] Topic cards תקינים.
- [ ] Track rows תקינים.
- [ ] Player תקין.
- [ ] Search תקין.
- [ ] Bottom Sheet/Popover תקין.
- [ ] Mixed Hebrew/English titles נשארים קריאים.

---

# 35. Mobile

לבדוק על Device/Emulation:

- [ ] 320–360px.
- [ ] 390px בערך.
- [ ] אין horizontal scroll.
- [ ] Play גדול.
- [ ] ±10 נוחים.
- [ ] Progress ניתן לגרירה.
- [ ] Text קריא.
- [ ] Long title לא שובר.
- [ ] Bottom Nav תקין.
- [ ] Mini Player תקין.
- [ ] Full Player נוח.
- [ ] Bottom Sheet נוח.

---

# 36. Tablet

- [ ] Layout לא נשבר.
- [ ] אין צפיפות חריגה.
- [ ] Track list usable.
- [ ] Text readable.

---

# 37. Desktop

- [ ] שימוש טוב ברוחב.
- [ ] Track list לא צרה מדי.
- [ ] Text width נוח.
- [ ] Player ברור.
- [ ] Volume זמין.
- [ ] Keyboard focus נראה.

---

# 38. Long Content

- [ ] Long Track title.
- [ ] Long Topic title.
- [ ] Long TXT.
- [ ] Topic עם הרבה Tracks.
- [ ] History גדולה.
- [ ] Favorites רבים.

אין צורך באופטימיזציה מיוחדת אם הכול נשאר usable.

---

# 39. Accessibility

- [ ] Tab navigation.
- [ ] Shift+Tab.
- [ ] Enter/Space על Buttons.
- [ ] Focus visible.
- [ ] Icon buttons עם `aria-label`.
- [ ] Semantic HTML.
- [ ] Contrast סביר.
- [ ] לא מסתמכים רק על צבע.
- [ ] Reduced Motion עובד.

---

# 40. Screen Reader Smoke

אם אפשר:

- [ ] Play/Pause מזוהה.
- [ ] Track title נקרא.
- [ ] Search label ברור.
- [ ] Navigation ברור.

לא נדרש Certification מלא ל־V1.

---

# 41. Browser Matrix

לפני Release משמעותי:

- [ ] Chrome latest.
- [ ] Edge latest.
- [ ] Firefox latest.
- [ ] Safari recent אם זמין.

---

# 42. Audio Formats

לפחות:

- [ ] MP3 נבדק.
- [ ] M4A נבדק.

אם Content משתמש גם ב:

- [ ] AAC.
- [ ] OGG/OGA.
- [ ] Opus.
- [ ] WebM.
- [ ] WAV.
- [ ] FLAC.

בודקים לפחות פורמט אחד אמיתי מכל סוג שנמצא בפועל באתר.

---

# 43. Browser Autoplay

- [ ] Direct Track URL לא מתחיל Autoplay לא חוקי.
- [ ] Play ידני עובד.
- [ ] Auto Continue עובד אחרי Session שהתחיל באינטראקציה של המשתמש, ככל שהדפדפן מאפשר.

---

# 44. Background Tab

- [ ] Audio ממשיך כאשר הדפדפן מאפשר.
- [ ] חזרה לטאב מסנכרנת UI.

---

# 45. Slow Network

ב־DevTools:

- [ ] Library load state נראה תקין.
- [ ] Audio buffering state נראה תקין.
- [ ] UI לא קופא.

---

# 46. Offline / Network Loss

- [ ] תוכן שכבר נטען נשאר מוצג.
- [ ] Audio חדש שנכשל מציג Error.
- [ ] חזרה Online + Retry עובדת.

---

# 47. Performance

עם Content אמיתי:

- [ ] Startup אינו מרגיש תקוע.
- [ ] Search מגיב טוב.
- [ ] Topic גדול נגלל בצורה סבירה.
- [ ] Text גדול לא מקפיא.
- [ ] מעבר Track מהיר מספיק.
- [ ] אין memory growth חריג אחרי הרבה Track switches.

---

# 48. No Premature Optimization Check

לפני Release לוודא שלא הוכנסו סתם:

- [ ] Web Worker מיותר.
- [ ] Virtualization מיותר.
- [ ] Split JSON ללא צורך.
- [ ] Service Worker ללא צורך.
- [ ] Cache framework מורכב.

---

# 49. Security / Static Site

- [ ] אין Secrets.
- [ ] אין private API keys.
- [ ] אין password בקוד.
- [ ] TXT מוצג כ־Plain Text.
- [ ] אין `innerHTML` לא מבוקר לתוכן.
- [ ] כל Content שמפורסם אכן מותר להיות ציבורי.

---

# 50. Project Structure

- [ ] Content ב־`/content`.
- [ ] Generated JSON ב־`/data`.
- [ ] Generator ב־`/tools`.
- [ ] Runtime ב־`/app`.
- [ ] CSS ב־`/styles`.
- [ ] Docs ב־`/docs`.
- [ ] אין קבצים "זמניים" שנשכחו.
- [ ] אין circular dependencies ידועות.

---

# 51. Dependencies

- [ ] Runtime dependencies מינימליות.
- [ ] Versions pinned.
- [ ] אין `latest`.
- [ ] Import Map תקין.
- [ ] אין Dependency שלא בשימוש.

---

# 52. GitHub Pages Paths

- [ ] כל paths יחסיים.
- [ ] `library.json` נטען תחת Project Page path.
- [ ] JS נטען.
- [ ] CSS נטען.
- [ ] Audio נטען.
- [ ] Hash routes עובדים.
- [ ] אין assumptions על `/`.

---

# 53. GitHub Pages Deployment

- [ ] Repository מעודכן.
- [ ] branch/source נכון.
- [ ] Pages enabled.
- [ ] deployment completed.
- [ ] URL Production נפתח.
- [ ] HTTPS עובד.

---

# 54. 404.html

- [ ] פתיחת URL שגוי מציגה fallback סביר.
- [ ] יש דרך להגיע ל־Home.
- [ ] אין redirect loop.

---

# 55. Cache / Versioning

לפני Release:

- [ ] ברור איך `library.json` החדש ייטען.
- [ ] Browser Cache לא משאיר JSON ישן לנצח.
- [ ] אם צריך, query version/cache busting מעודכן.
- [ ] App version עודכן אם משתמשים בו.
- [ ] `schemaVersion` משתנה רק אם Schema באמת השתנה.

---

# 56. README

- [ ] מסביר איך מריצים Local.
- [ ] מסביר איך מוסיפים Content.
- [ ] מסביר איך מריצים Generator.
- [ ] מסביר איך עושים Deploy.
- [ ] פקודות אכן עובדות.

---

# 57. Docs

לוודא שקיימים:

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

- [ ] ההחלטות במסמכים תואמות למימוש בפועל.
- [ ] שינוי משמעותי שנעשה במהלך הפיתוח תועד.

---

# 58. Debug Cleanup

- [ ] אין `console.log` רועש.
- [ ] אין test buttons.
- [ ] אין mock data.
- [ ] אין temporary CSS.
- [ ] אין commented blocks גדולים מיותרים.
- [ ] אין feature flag זמני שנשכח.

---

# 59. Release Smoke Test — חובה

לאחר Deployment ל־Production:

## Flow אחד מלא

```text
Open site
→ Topic
→ Subtopic
→ Track
→ Play
→ Seek
→ Read Text
→ Navigate elsewhere
→ Mini Player
→ Next
→ Pause
→ Refresh
→ Resume
→ Search
→ Favorite
→ History
```

- [ ] כל הזרימה עוברת.

---

# 60. Smoke Test — מובייל

אחרי Deployment:

- [ ] Home.
- [ ] Topic.
- [ ] Track.
- [ ] Play.
- [ ] Full Player.
- [ ] Mini Player.
- [ ] Text.
- [ ] Search.
- [ ] Bottom Nav.

---

# 61. Smoke Test — Desktop

אחרי Deployment:

- [ ] Home.
- [ ] Topic.
- [ ] Track.
- [ ] Player.
- [ ] Text.
- [ ] Search.
- [ ] History.
- [ ] Favorites.

---

# 62. Go / No-Go — Critical

Release הוא **No-Go** אם אחד מהבאים נכון:

- [ ] האתר לא עולה.
- [ ] Generator נכשל על Content תקין.
- [ ] `library.json` פגום.
- [ ] Audio core לא עובד.
- [ ] ניווט מרכזי שבור.
- [ ] Audio נעצר בכל ניווט.
- [ ] Mobile אינו usable.
- [ ] Content paths שבורים.
- [ ] GitHub Pages לא מגיש Audio/JSON.
- [ ] יש Data corruption.
- [ ] יש Critical Security issue.

אם אחד מסומן:
> לא משחררים.

---

# 63. Go / No-Go — High

Release בדרך כלל **No-Go** אם:

- [ ] Resume שבור לחלוטין.
- [ ] Search שבור לחלוטין.
- [ ] Listening Modes שבורים.
- [ ] History/Favorites מפילים UI.
- [ ] Track direct URLs שבורים.
- [ ] Major browser מרכזי לא עובד.

אפשר לשחרר רק אם:
- הבעיה אינה בזרימה קריטית.
- היא מתועדת.
- התקבלה החלטה מפורשת.

---

# 64. Non-Blocking

אפשר לשחרר עם:

- [ ] alignment קטן.
- [ ] polish קטן.
- [ ] animation לא מושלמת.
- [ ] wording קטן.
- [ ] enhancement עתידי.

בתנאי:
- אין פגיעה בשימוש.

---

# 65. Release Decision

לפני השחרור:

```text
Generator       PASS / FAIL
Content         PASS / FAIL
Core Player     PASS / FAIL
Navigation      PASS / FAIL
Persistence     PASS / FAIL
Search          PASS / FAIL
Mobile          PASS / FAIL
Desktop         PASS / FAIL
Browsers        PASS / FAIL
Deployment      PASS / FAIL
Smoke Test      PASS / FAIL
```

## החלטה

```text
GO
או
NO-GO
```

לא צריך מערכת Approval מורכבת.

---

# 66. Release Tag / Version

אם משתמשים בגרסאות:

- [ ] version נקבע.
- [ ] commit ברור.
- [ ] optional Git tag.

למשל:

```text
v1.0.0
```

לא חובה ל־Release תוכן קטן.

---

# 67. Release Notes

Release משמעותי:
- [ ] 3–10 שורות קצרות מספיקות.

למשל:

```text
- Added global audio player
- Added resume and history
- Improved mobile layout
- Fixed audio errors
```

לא צריך מסמך ארוך.

---

# 68. Post-Release Verification — מיידי

מיד לאחר Deployment:

- [ ] URL production נכון.
- [ ] Home עולה.
- [ ] JSON חדש נטען.
- [ ] Track אמיתי מנגן.
- [ ] TXT אמיתי מוצג.
- [ ] Search מוצא Content חדש.
- [ ] Mobile עובד.
- [ ] Console ללא error קריטי.

---

# 69. Post-Release Verification — Returning User

עם Browser שכבר השתמש באתר:

- [ ] Cache לא תקוע על גרסה ישנה.
- [ ] localStorage הישן לא שובר.
- [ ] Favorites קיימים.
- [ ] History קיימת.
- [ ] Resume קיים.
- [ ] Tracks שנמחקו לא שוברים.

---

# 70. Post-Release Verification — New User

Incognito:

- [ ] Default state תקין.
- [ ] אין stale cache.
- [ ] כל assets נטענים.

---

# 71. Rollback

בגלל שהאתר סטטי, Rollback צריך להיות פשוט.

אם Release שבור:

1. לזהות commit תקין קודם.
2. להחזיר/לשחזר.
3. Deploy מחדש.4. Smoke Test.

אין צורך במערכת Rollback מורכבת.

---

# 72. Rollback של Content בלבד

אם Content חדש בעייתי:

1. לתקן/להחזיר קבצים.
2. להריץ Generator.
3. Deploy.
4. לבדוק Track.

---

# 73. Hotfix

Hotfix צריך להיות קטן.

Flow:

```text
fix
↓
targeted test
↓
regression smoke
↓
deploy
↓
post-release smoke
```

לא מצרפים Refactor גדול ל־Hotfix.

---

# 74. Monitoring לאחר Release

בגרסה א' אין מערכת Monitoring.

בדיקה פשוטה:

- האתר עולה.
- Audio עובד.
- Console ב־Browser נקי.
- משתמשים יכולים לדווח.

אם בעתיד יעלה צורך:
- נוסיף Telemetry.

לא עכשיו.

---

# 75. Release Hygiene

לאחר Release:

- [ ] branch/repo נקי.
- [ ] temp files נמחקו.
- [ ] docs תואמים.
- [ ] known issues מתועדים.
- [ ] next work item ברור.

---

# 76. Checklist מקוצר — Content Update בלבד

כאשר רק מוסיפים תוכן:

```text
[ ] Audio + TXT במקום הנכון
[ ] Generator PASS
[ ] Warnings נבדקו
[ ] library.json תקין
[ ] Content חדש מופיע Local
[ ] Push
[ ] GitHub Pages Deploy PASS
[ ] Track חדש מנגן Production
[ ] Text מוצג
[ ] Search מוצא אותו
```

זה מספיק ברוב עדכוני התוכן.

---

# 77. Checklist מקוצר — Code Release

```text
[ ] Relevant tests PASS
[ ] Generator PASS
[ ] Core Player PASS
[ ] Navigation PASS
[ ] Storage PASS
[ ] Search PASS
[ ] Mobile PASS
[ ] Desktop PASS
[ ] Browser smoke PASS
[ ] GitHub Pages PASS
[ ] Production smoke PASS
```

---

# 78. Checklist מקוצר — Hotfix

```text
[ ] Bug reproduced
[ ] Fix applied
[ ] Targeted test PASS
[ ] Core smoke PASS
[ ] Deploy PASS
[ ] Production verification PASS
```

---

# 79. Final Release Definition

Release נחשב הושלם רק כאשר:

1. Deployment הצליח.
2. Production URL עובד.
3. Smoke Test עבר.
4. Content אמיתי מנגן.
5. Post-release verification עבר.
6. אין Critical regression.

לא ברגע ש־Git Push הסתיים.

---

# 80. סוף שלב התכנון

עם המסמך הזה קיימת סדרת מסמכי תכנון מלאה:

```text
01 Product Requirements
02 Functional Specification
03 Content & Generator Specification
04 UX/UI Specification
05 Technical Architecture
06 Project Structure
07 Development Plan
08 Test Plan
09 Acceptance Criteria
10 Production / Release Checklist
```

כל אחד עונה על שאלה אחרת:

```text
מה צריך?
↓
איך זה מתנהג?
↓
איך התוכן נבנה?
↓
איך המשתמש חווה אותו?
↓
איך המערכת בנויה?
↓
איך הקוד מסודר?
↓
באיזה סדר מפתחים?
↓
איך בודקים?
↓
מתי זה נחשב גמור?
↓
איך משחררים?
```

---

# 81. השלב הבא

שלב התכנון הסתיים.

השלב הבא הוא להתחיל **פיתוח בפועל לפי `07-development-plan.md`**.

מתחילים ב:

# M0 — שלד הפרויקט

בשלב הראשון ניצור בפועל:

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

ונביא את האתר למצב הראשון שבו:

- הוא עולה דרך Static HTTP Server.
- Preact + HTM + Signals נטענים.
- RTL מוגדר.
- אין Build.
- אין Backend.
- מופיע מסך ראשוני תקין.

רק לאחר ש־M0 עובר את ה־Definition of Done שלו, ממשיכים ל־M1 — Generator.