# Acceptance Criteria / Definition of Done — ספריית שמע דינמית
**גרסה:** 1.0  
**סטטוס:** מסמך תנאי קבלה סופי  
**מבוסס על:** כל מסמכי האפיון הקודמים בפרויקט  
**מטרת המסמך:** להגדיר בצורה חד־משמעית מה נחשב "עובד", "מוכן" ו"גמור" עבור כל חלק במערכת, ומהם התנאים לכך שגרסה 1.0 תיחשב מוכנה לשחרור.

---

# 1. עקרון מרכזי

המוצר לא נחשב גמור רק כי:

- הוא עולה.
- הנגן מנגן.
- רוב המסכים קיימים.

הוא נחשב גמור רק כאשר כל הזרימה העיקרית עובדת בצורה אמינה, פשוטה וברורה למשתמש.

העיקרון:

> **Done = עובד בפועל, ברור למשתמש, יציב במקרי הקצה המרכזיים, וניתן לתחזוקה בלי עבודה ידנית מיותרת.**

---

# 2. Definition of Done כללי לכל Feature

Feature נחשב גמור כאשר:

1. ההתנהגות המרכזית שלו עובדת.
2. Error states רלוונטיים מטופלים.
3. אין Console Errors משמעותיים.
4. הוא עובד במובייל ובדסקטופ אם רלוונטי.
5. הוא לא שובר Feature קיים.
6. אין workaround ידני קבוע.
7. אין hardcoded data שהיה צריך להגיע מה־JSON או מה־State.
8. ה־UX ברור בלי הסבר חיצוני.
9. אם יש State מתמשך — הוא נשמר נכון.
10. אם קיימת דרישה במסמכי האפיון — היא ממומשת או שסומנה במפורש כ־Out of Scope.

---

# 3. Definition of Done לגרסה 1.0

גרסה 1.0 נחשבת מוכנה רק כאשר כל התנאים הבאים מתקיימים:

- Generator עובד על תוכן אמיתי.
- `library.json` נוצר אוטומטית.
- האתר נטען מ־Static Hosting.
- Topics מוצגים בכל עומק.
- Tracks מוצגים לפי המבנה.
- Track נפתח ונגן עובד.
- Audio ממשיך בזמן ניווט.
- Full Player עובד.
- Mini Player עובד.
- Text מוצג.
- Listening Modes עובדים.
- Repeat עובד.
- Resume עובד.
- History עובדת.
- Favorites עובדים.
- Search עובד.
- Responsive עובד.
- RTL תקין.
- Error states מרכזיים מטופלים.
- GitHub Pages עובד בפועל.
- Content חדש מופיע ללא שינוי קוד.
- אין Known Critical Bugs.
- אין Known High Bugs בזרימה המרכזית.

---

# 4. Acceptance — Generator

## AC-GEN-001 — סריקה רקורסיבית

Given:
- `/content` מכיל תיקיות ותתי־תיקיות בכל עומק.

When:
- מריצים Generator.

Then:
- כל תיקייה מופיעה כ־Topic.
- כל תת־תיקייה מופיעה תחת ההורה המתאים.
- אין תלות בעומק קבוע.

---

# 5. Acceptance — Audio Detection

## AC-GEN-002

Given:
קבצי שמע בסיומות נתמכות.

Then:
כל אחד מהם מזוהה כ־Track.

פורמטים לפחות:

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

---

# 6. Acceptance — TXT Matching

## AC-GEN-003

Given:

```text
track.mp3
track.txt
```

Then:
- נוצר Track אחד.
- הטקסט משויך אליו.

---

# 7. Acceptance — Audio ללא TXT

## AC-GEN-004

Given:
Audio ללא TXT.

Then:
- Track נוצר.
- אין כשל.
- Track מופיע באתר.

---

# 8. Acceptance — TXT ללא Audio

## AC-GEN-005

Given:
TXT ללא Audio תואם.

Then:
- לא נוצר Track.
- Warning ברור.
- שאר ה־Generation ממשיך.

---

# 9. Acceptance — Duplicate Basename

## AC-GEN-006

Given:

```text
track.mp3
track.m4a
track.txt
```

Then:
- Generator לא מנחש.
- Conflict מדווח.
- הפריט הבעייתי לא נכנס בצורה עמומה.

---

# 10. Acceptance — JSON

## AC-GEN-007

Then:
- JSON תקין.
- `schemaVersion` קיים.
- `generatedAt` קיים.
- Root קיים.
- Paths יחסיים.
- UTF-8 תקין.

---

# 11. Acceptance — Determinism

## AC-GEN-008

Given:
אותו Content ללא שינוי.

When:
Generator רץ פעמיים.

Then:
- אותו מבנה.
- אותו סדר.
- אותם IDs.
- רק metadata זמן יכול להשתנות.

---

# 12. Acceptance — Atomic Output

## AC-GEN-009

Given:
כשל בזמן כתיבה.

Then:
- `library.json` הקודם לא נהרס.
- לא נשאר קובץ חצי תקין כקובץ הייצור.

---

# 13. Acceptance — Generator Workflow

## AC-GEN-010

מנהל תוכן צריך להיות מסוגל:

```text
להוסיף Audio
להוסיף TXT
למקם בתיקייה
להריץ Generator
```

בלי לערוך JSON ידנית.

---

# 14. Acceptance — Library Loading

## AC-LIB-001

When:
האתר נטען.

Then:
- `library.json` נטען פעם אחת.
- ה־App State עובר ל־Ready.
- Topics/Tracks זמינים דרך Lookup Maps.

---

# 15. Acceptance — Library Error

## AC-LIB-002

Given:
JSON חסר או לא תקין.

Then:
- App לא קורס.
- מוצגת הודעה ברורה.
- קיימת אפשרות Retry.

---

# 16. Acceptance — Schema Mismatch

## AC-LIB-003

Given:
`schemaVersion` לא נתמך.

Then:
- לא ממשיכים בשקט.
- מוצגת הודעת שגיאה מתאימה.
- Console מכיל מידע טכני למפתח.

---

# 17. Acceptance — Topics

## AC-TOPIC-001

Given:
Topic עם child Topics.

Then:
- כולם מוצגים.
- סדר תואם JSON.

---

# 18. Acceptance — Topic עם Tracks

## AC-TOPIC-002

Then:
- Tracks מוצגים.
- שם נכון.
- אין duplication.
- clicking opens correct Track.

---

# 19. Acceptance — Topic מעורב

## AC-TOPIC-003

Given:
Topic עם child Topics וגם Tracks.

Then:
- שניהם מוצגים.
- ה־UI נשאר ברור.

---

# 20. Acceptance — Empty Topic

## AC-TOPIC-004

Then:
- מוצגת הודעת Empty State.
- אין layout שבור.

---

# 21. Acceptance — Breadcrumb

## AC-TOPIC-005

Given:
Topic בעומק גבוה.

Then:
- Desktop מציג Breadcrumb ברור.
- Mobile מציג גרסה מקוצרת/Back שימושי.
- לחיצה מחזירה לרמה הנכונה.

---

# 22. Acceptance — Direct Topic URL

## AC-TOPIC-006

Given:
URL ישיר ל־Topic.

Then:
- Topic נטען לאחר טעינת Library.
- Breadcrumb תקין.
- Refresh לא שובר.

---

# 23. Acceptance — Track Page

## AC-TRACK-001

When:
Track נבחר.

Then:
- title מופיע.
- context מופיע.
- Full Player מופיע.
- Text מופיע אם קיים.

---

# 24. Acceptance — Track ללא Text

## AC-TRACK-002

Then:
- Player עובד.
- אין Error.
- אזור טקסט מוסתר או מציג הודעה קצרה.

---

# 25. Acceptance — Direct Track URL

## AC-TRACK-003

Given:
URL ישיר.

Then:
- Track Page נפתח.
- אין Autoplay כפוי.
- Play זמין.
- Breadcrumb/context סביר.

---

# 26. Acceptance — Track Not Found

## AC-TRACK-004

Then:
- Not Found Page.
- Home/Search actions קיימים.

---

# 27. Acceptance — Play/Pause

## AC-PLY-001

Then:
- Play מתחיל.
- Pause עוצר.
- State ו־UI מסונכרנים.

---

# 28. Acceptance — Seek

## AC-PLY-002

Then:
- ניתן לגרור/ללחוץ על Progress.
- currentTime מתעדכן.
- UI תואם.

---

# 29. Acceptance — Skip ±10

## AC-PLY-003

Then:
- אחורה לא יורד מתחת ל־0.
- קדימה לא עובר duration.

---

# 30. Acceptance — Current Time / Duration

## AC-PLY-004

Then:
- זמן נוכחי מוצג.
- משך כולל מוצג כשהוא ידוע.
- פורמט תומך גם מעל שעה.

---

# 31. Acceptance — Playback Speed

## AC-PLY-005

Then:
- הערכים שסוכמו עובדים.
- UI מציג את הערך הפעיל.
- אין שינוי Pitch חריג מעבר להתנהגות הדפדפן הרגילה.

---

# 32. Acceptance — Volume

## AC-PLY-006

Desktop:
- Volume control עובד.

Mobile:
- אם הוחלט להסתמך על מערכת ההפעלה, אין חובה ל־Slider.

---

# 33. Acceptance — Audio Errors

## AC-PLY-007

Given:
Audio חסר/פגום/לא נתמך.

Then:
- שגיאה מקומית.
- App ממשיך לעבוד.
- אפשר Retry או מעבר ל־Track אחר.

---

# 34. Acceptance — Single Audio Instance

## AC-PLY-008

Then:
- אין שני Tracks שמנגנים יחד.
- Track חדש עוצר את הקודם.

---

# 35. Acceptance — Full Player

## AC-PLY-009

Then:
- Play/Pause ברור.
- Progress ברור.
- ±10 נגיש.
- Previous/Next נגישים.
- Speed נגיש.
- Repeat נגיש.
- Loading/Buffering/Error states מוצגים.

---

# 36. Acceptance — Mini Player

## AC-MINI-001

Given:
יש Current Track והמשתמש אינו ב־Full Player.

Then:
- Mini Player מופיע.
- title מוצג.
- Play/Pause עובד.
- click opens Full Player.

---

# 37. Acceptance — Audio Continuity

## AC-MINI-002

Given:
Audio מתנגן.

When:
המשתמש עובר בין מסכים.

Then:
- Audio ממשיך.
- currentTime לא מתאפס.
- Mini Player נשאר מסונכרן.

---

# 38. Acceptance — Listening Mode: Single

## AC-MODE-001

Track מסתיים.

Then:
- הנגן נעצר.
- לא נבחר Track אחר.

---

# 39. Acceptance — Listening Mode: Auto Continue

## AC-MODE-002

Track באמצע Context מסתיים.

Then:
- Next מתחיל אוטומטית.

---

# 40. Acceptance — Auto Continue End

## AC-MODE-003

Track אחרון ב־Context מסתיים.

Then:
- נעצרים.
- אין מעבר אוטומטי ל־Topic אחר.

---

# 41. Acceptance — Free Choice

## AC-MODE-004

Then:
- אין מעבר אוטומטי.
- המשתמש בוחר Track הבא.

---

# 42. Acceptance — Random

## AC-MODE-005

Then:
- נבחר Track מתוך Current Context.
- כאשר קיימת חלופה, לא נבחר מיד אותו Track.

---

# 43. Acceptance — Repeat

## AC-MODE-006

When:
Repeat פעיל.

Then:
- Current Track מתחיל מחדש בסיום.
- Listening Mode לא מופעל.

---

# 44. Acceptance — Repeat Priority

## AC-MODE-007

Then:
```text
Repeat Current Track
>
Listening Mode
```

---

# 45. Acceptance — Previous/Next

## AC-MODE-008

Then:
- משתמשים ב־Current Context.
- סדר תואם JSON.
- אין wrap-around ב־V1 אלא אם הוגדר אחרת.

---

# 46. Acceptance — Context Stability

## AC-MODE-009

When:
המשתמש גולש ל־Topic אחר בזמן Playing.

Then:
- Current Context לא משתנה רק בגלל browsing.

When:
המשתמש בוחר Track חדש.

Then:
- Context מתעדכן.

---

# 47. Acceptance — Text

## AC-TXT-001

Given:
Track עם TXT.

Then:
- הטקסט מופיע.
- RTL.
- line breaks נשמרים.
- Plain Text בלבד.

---

# 48. Acceptance — Text Safety

## AC-TXT-002

Given:
TXT מכיל HTML/Script.

Then:
- מוצג כטקסט.
- לא מורץ.

---

# 49. Acceptance — Long Text

## AC-TXT-003

Then:
- scroll תקין.
- Player control בסיסי נשאר נגיש.
- אין freeze.

---

# 50. Acceptance — Resume

## AC-RES-001

Given:
משתמש עצר באמצע Track.

When:
חוזר מאוחר יותר.

Then:
- Resume point זמין.
- Play ממשיך מהנקודה האחרונה.

---

# 51. Acceptance — Resume Start Again

## AC-RES-002

Then:
- קיימת אפשרות להתחיל מהתחלה.
- position מתאפס.

---

# 52. Acceptance — Completed

## AC-RES-003

Given:
Track הגיע לסוף/threshold.

Then:
- `completed = true`.
- UI מציג Completed.
- Resume לא מציע נקודה חסרת משמעות.

---

# 53. Acceptance — Progress Save

## AC-RES-004

Then:
Progress נשמר:
- בזמן Playback במרווח סביר.
- Pause.
- Seek.
- Track change.
- pagehide ככל האפשר.

לא בכל `timeupdate`.

---

# 54. Acceptance — History

## AC-HIS-001

Given:
Track התחיל Playback ממשי.

Then:
- נכנס להיסטוריה.

---

# 55. Acceptance — History Sort

## AC-HIS-002

Then:
- Last Played ראשון.

---

# 56. Acceptance — History Progress

## AC-HIS-003

Then:
- progress מוצג.
- Continue עובד.

---

# 57. Acceptance — Removed Track in History

## AC-HIS-004

Given:
Track נמחק מה־Library.

Then:
- UI לא נשבר.
- stale entry ignored/cleaned.

---

# 58. Acceptance — Favorites Add/Remove

## AC-FAV-001

Then:
- add/remove מיידיים.
- refresh שומר מצב.
- אין duplicates.

---

# 59. Acceptance — Favorites Page

## AC-FAV-002

Then:
- Tracks מוצגים.
- open Track עובד.
- remove עובד.
- Empty State ברור.

---

# 60. Acceptance — Removed Favorite Track

## AC-FAV-003

Then:
- פריט חסר לא מוצג כפריט שבור.

---

# 61. Acceptance — Search

## AC-SRC-001

Search מוצא:
- Topic name.
- Track title.

---

# 62. Acceptance — Search Hebrew

## AC-SRC-002

Then:
- חיפוש בעברית עובד.
- Unicode normalization אינו שובר.

---

# 63. Acceptance — Search Case

## AC-SRC-003

English search:
- case insensitive.

---

# 64. Acceptance — Search No Results

## AC-SRC-004

Then:
- "לא נמצאו תוצאות".
- UI לא ריק בלי הסבר.

---

# 65. Acceptance — Search While Playing

## AC-SRC-005

Then:
- Audio ממשיך.
- Search אינו מאפס Player.

---

# 66. Acceptance — Open Search Result

## AC-SRC-006

Then:
- Track/Topic הנכון נפתח.
- route נכון.

---

# 67. Acceptance — Search Text

אם מופעל ב־V1:

Then:
- Query בתוך Text מחזיר Track.

אם לא עומד בביצועים:
- מותר להשאיר מחוץ ל־V1 אם הדבר תועד.

---

# 68. Acceptance — Home

## AC-HOME-001

Then:
המשתמש רואה בצורה ברורה:
- Search.
- Topics.
- Continue Listening אם קיים.

---

# 69. Acceptance — Continue Listening

## AC-HOME-002

Given:
Track חלקי.

Then:
- מופיע כרטיס.
- progress ברור.
- Continue פותח אותו בנקודה הנכונה.

---

# 70. Acceptance — Navigation

## AC-NAV-001

Then:
- Home.
- Topics.
- Search.
- Favorites.
- History.
נגישים בצורה פשוטה.

---

# 71. Acceptance — Back/Forward

## AC-NAV-002

Then:
- Browser Back/Forward עובדים.
- אין History פנימי שבור.

---

# 72. Acceptance — Hash Routing

## AC-NAV-003

Then:
- Refresh על Hash URL עובד.
- GitHub Pages לא צריך Rewrite מיוחד.

---

# 73. Acceptance — RTL

## AC-RTL-001

Then:
- Layout טבעי בעברית.
- Header/Breadcrumb/List/Player/Search תקינים.
- אין אזורים מרכזיים ש"מרגישים LTR".

---

# 74. Acceptance — Mixed Text

## AC-RTL-002

Given:
עברית + English + numbers.

Then:
- title/labels נשארים קריאים.

---

# 75. Acceptance — Mobile

## AC-MOB-001

Then:
- אין horizontal overflow.
- Play/Pause נוח.
- Progress נוח לגרירה.
- Mini Player לא מסתיר Content.
- Bottom Nav לא מתנגש ב־Mini Player.
- Text קריא ללא Zoom.

---

# 76. Acceptance — Tablet

## AC-MOB-002

Then:- Layout נשאר שימושי.
- אין צורך ב־UI נפרד אם responsive רגיל מספיק.

---

# 77. Acceptance — Desktop

## AC-DESK-001

Then:
- שימוש טוב ברוחב.
- Player/Text לא צפופים.
- Track list נוחה.
- Volume נגיש.

---

# 78. Acceptance — Long Titles

## AC-UI-001

Then:
- list לא נשבר.
- title מלא במסך Track.
- ellipsis/2 lines לפי UX.

---

# 79. Acceptance — Current Track

## AC-UI-002

Then:
- Current Track מסומן בכל רשימה שבה מופיע.
- לא מסתמכים רק על צבע.

---

# 80. Acceptance — Completed Track

## AC-UI-003

Then:
- completed indicator קטן וברור.
- לא משתלט על UI.

---

# 81. Acceptance — Loading

## AC-UI-004

Then:
- Library loading ברור.
- Audio loading ברור.
- אין double actions.

---

# 82. Acceptance — Buffering

## AC-UI-005

Then:
- state מוצג.
- לא נזרקת שגיאה מיידית.

---

# 83. Acceptance — Error Recovery

## AC-ERR-001

כל Error משמעותי כולל פעולה אם יש פעולה הגיונית:

- Retry.
- Back.
- Home.
- Next.

---

# 84. Acceptance — Empty States

## AC-ERR-002

יש Empty State ברור עבור:
- Empty Topic.
- Empty Favorites.
- Empty History.
- No Search Results.
- Empty Library.

---

# 85. Acceptance — Storage Failure

## AC-STO-001

Given:
localStorage לא זמין/פגום.

Then:
- App עדיין עובד.
- persistence בלבד נפגעת.
- אין crash.

---

# 86. Acceptance — Preferences

## AC-STO-002

אם הוגדר לשמור:
- listeningMode.
- playbackRate.
- volume.

Then:
- reload משחזר.

---

# 87. Acceptance — Accessibility

## AC-A11Y-001

Then:
- כל control מרכזי keyboard accessible.
- focus visible.
- icon-only buttons עם aria-label.
- semantic elements.
- contrast סביר.
- touch targets סבירים.

---

# 88. Acceptance — Reduced Motion

## AC-A11Y-002

Given:
`prefers-reduced-motion`.

Then:
- animations מצטמצמות.
- UX נשאר ברור.

---

# 89. Acceptance — Screen Reader Smoke

## AC-A11Y-003

Then:
- Play/Pause מזוהים.
- Search label ברור.
- Track title נקרא.

לא נדרש Certification מלא ב־V1.

---

# 90. Acceptance — Performance

## AC-PERF-001

Then:
- Library load לא מרגיש תקוע עם התוכן האמיתי.
- Search מגיב בזמן סביר.
- Topic גדול עדיין usable.
- UI לא נתקע בזמן Playback.

אין SLA מלאכותי ללא מדידה אמיתית.

---

# 91. Acceptance — Memory

## AC-PERF-002

After:
מעבר בין Tracks רבים.

Then:
- אין הצטברות Audio Elements.
- אין memory leak ברור.

---

# 92. Acceptance — No Premature Optimization

## AC-PERF-003

אין חובה ל:
- Web Worker.
- Virtualization.
- Split JSON.
- Service Worker.

אלא אם נמדדה בעיה אמיתית.

---

# 93. Acceptance — Browser Support

## AC-BRW-001

לפני Release:
- Chrome latest עובד.
- Edge latest עובד.
- Firefox latest עובד.
- Safari recent עובד ככל שניתן לבדוק.

---

# 94. Acceptance — Audio Formats

## AC-BRW-002

Then:
- פורמטים שהדפדפן תומך בהם מנגנים.
- פורמט לא נתמך מטופל בצורה ברורה.
- App לא קורס.

---

# 95. Acceptance — Autoplay

## AC-BRW-003

Then:
- אין Autoplay כפוי בכניסה ישירה.
- Continue/Auto-next עובדים לאחר User Interaction בהתאם למגבלות הדפדפן.

---

# 96. Acceptance — Background Tab

## AC-BRW-004

Then:
- Audio ממשיך אם הדפדפן מאפשר.
- UI מסתנכרן כשחוזרים.

---

# 97. Acceptance — Network Slow

## AC-NET-001

Then:
- Library/Audio loading states ברורים.
- UI נשאר responsive.

---

# 98. Acceptance — Network Failure

## AC-NET-002

Then:
- Audio error מקומי.
- Retry אפשרי.
- תוכן שכבר נטען לא נעלם סתם.

---

# 99. Acceptance — Recovery

## AC-NET-003

When:
הרשת חוזרת.

Then:
- Retry עובד.
- אין צורך לפתוח מחדש את כל האתר אם לא הכרחי.

---

# 100. Acceptance — GitHub Pages

## AC-DEP-001

Then:
- site loads.
- JS loads.
- CSS loads.
- JSON loads.
- Audio loads.
- Hash routes work.
- relative paths correct.

---

# 101. Acceptance — Project Page Base Path

## AC-DEP-002

Given:
`username.github.io/repository/`

Then:
- אין absolute paths ששוברים את האתר.

---

# 102. Acceptance — Cache Update

## AC-DEP-003

After:
Deployment עם `library.json` חדש.

Then:
- משתמש חדש מקבל תוכן חדש.
- משתמש חוזר לא נתקע לנצח על JSON ישן.

---

# 103. Acceptance — Content Update Workflow

## AC-CONTENT-001

Given:
נוסף Audio + TXT לתיקייה קיימת.

When:
Generator רץ ו־Deploy מתבצע.

Then:
- Track מופיע באתר.
- Text מופיע.
- אין שינוי קוד.

---

# 104. Acceptance — New Topic Workflow

## AC-CONTENT-002

Given:
נוספה תיקייה חדשה.

Then:
- Topic מופיע באתר אוטומטית.

---

# 105. Acceptance — Rename Workflow

## AC-CONTENT-003

Given:
שינוי שם קובץ/תיקייה.

Then:
- JSON חדש משקף את השם.
- האתר מציג אותו.
- stale local data אינו שובר UI.

---

# 106. Acceptance — Delete Workflow

## AC-CONTENT-004

Given:
Track נמחק.

Then:
- אינו מופיע לאחר Regenerate.
- Favorites/History ישנים לא שוברים.

---

# 107. Acceptance — README

## AC-DOC-001

מפתח/מנהל תוכן חדש צריך להבין מה־README:

- איך להריץ מקומית.
- איך להוסיף Content.
- איך להריץ Generator.
- איך לעשות Deploy.

---

# 108. Acceptance — Docs

## AC-DOC-002

ב־`/docs` קיימים לפחות:

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
```

---

# 109. Acceptance — Project Structure

## AC-ARCH-001

Then:
- Generator נפרד מה־Runtime.
- Services לא מציירים UI.
- Components לא עושים Fetch ישיר.
- Pages לא קוראים localStorage ישירות.
- Audio Service הוא היחיד שמנהל Audio Element.
- אין circular dependencies.

---

# 110. Acceptance — Simplicity

## AC-ARCH-002

הפרויקט לא כולל ללא צורך אמיתי:

- Backend.
- Database.
- Redux.
- React Router.
- Build pipeline.
- Service Worker.
- Web Audio DSP.
- Complex search library.
- CMS.
- Plugin architecture.

---

# 111. Acceptance — Static Runtime

## AC-ARCH-003

Then:
- האתר פועל כ־Static Site.
- אין Compile חובה לפני שימוש.
- אין Server Runtime.

---

# 112. Acceptance — No Hardcoded Content

## AC-ARCH-004

Then:
- Topics/Tracks/Text מגיעים מה־JSON בלבד.
- אין רשימות תוכן ידניות בקוד.

---

# 113. Acceptance — No Manual JSON Editing

## AC-ARCH-005

Then:
- JSON תמיד נוצר דרך Generator.
- אין שלב Workflow שמצריך עריכה ידנית.

---

# 114. Acceptance — Visual Experience

## AC-UX-001

המוצר צריך להרגיש יותר מאשר `<audio controls>`.

Then:
- Player UI מותאם.
- Progress ברור.
- Controls גדולים.
- Visualization עדינה קיימת או Progress presentation איכותי.
- Text משולב בחוויית Track.

---

# 115. Acceptance — UX Simplicity

## AC-UX-002

Then:
- המשתמש לא צריך Tutorial.
- אין terminology טכנית כמו Queue/Codec/Path.
- לא מוצגים controls שלא נחוצים.

---

# 116. Acceptance — Listening Mode Clarity

## AC-UX-003

Then:
האפשרויות מוצגות בעברית פשוטה:

```text
שיר בודד
המשך אוטומטי
בחירה חופשית
ערבוב אוטומטי
```

---

# 117. Acceptance — Repeat Clarity

## AC-UX-004

When:
Repeat פעיל.

Then:
- המשתמש מבין שהקטע יחזור.
- לא נוצר בלבול למה Next לא קורה.

---

# 118. Acceptance — Mobile First

## AC-UX-005

Then:
- Mobile אינו גרסת Desktop מוקטנת.
- controls מותאמים למגע.
- layout מותאם.

---

# 119. Acceptance — No Over Engineering

## AC-SIMP-001

Feature/Layer/Dependency שלא נותן ערך ברור לגרסה 1.0:
- אינו נכנס.

---

# 120. Acceptance — Minimal Dependencies

## AC-SIMP-002

Runtime dependencies נשארות מינימליות.

כיוון:

```text
preact
htm
@preact/signals
```

בלי ספריות נוספות אלא אם יש צורך מוכח.

---

# 121. Acceptance — LocalStorage Only

## AC-SIMP-003

ב־V1:
- persistence באמצעות localStorage.
- אין IndexedDB אלא אם דרישה אמיתית משנה זאת.

---

# 122. Acceptance — No Service Worker

## AC-SIMP-004

ב־V1:
- אין Service Worker.
- אין Offline Audio Manager.

---

# 123. Acceptance — No App Phase Yet

## AC-SIMP-005

גרסה 1.0 עוסקת באתר בלבד.

Native apps:
- מחוץ ל־Scope.

---

# 124. Critical Flow — End to End

גרסה 1.0 חייבת לעבור את הזרימה הבאה:

```text
Open Site
↓
Browse Topics
↓
Open Subtopic
↓
Choose Track
↓
Play
↓
Read Text
↓
Navigate Elsewhere
↓
Audio Continues
↓
Next/Mode Works
↓
Pause
↓
Reload/Return
↓
Resume
↓
Search Another Track
↓
Favorite It
```

אם אחד השלבים המרכזיים נשבר:
- הגרסה אינה Ready.

---

# 125. Content Manager Flow — End to End

חייב לעבור:

```text
Add folder
↓
Add audio
↓
Add matching txt
↓
Run generator
↓
Review summary
↓
Push/deploy
↓
New content appears
```

בלי:
- שינוי JS.
- שינוי HTML.
- שינוי JSON ידני.

---

# 126. Release Blocking Criteria

הדברים הבאים חוסמים Release:

## Critical
- App לא עולה.
- Generator לא עובד.
- JSON corrupted.
- Audio core לא עובד.
- ניווט מרכזי שבור.
- Track navigation עוצר/מאתחל Audio שלא לצורך.
- Mobile unusable.

## High
- Resume לא עובד כלל.
- Search לא עובד כלל.
- Listening modes לא עובדים.
- Favorites/History שוברות UI.
- Deployment paths שבורים.

---

# 127. Non-Blocking Issues

לא חוסמים Release אם מתועדים:

- alignment קטן.
- animation לא מושלמת.
- wording קטן.
- enhancement עתידי.
- browser edge case נדיר שאינו בזרימה המרכזית.

---

# 128. Final Definition of Done — Generator

Generator Done כאשר:

- recursive.
- deterministic.
- supports agreed extensions.
- text pairing עובד.
- warnings/errors ברורים.
- JSON valid.
- atomic write.
- one-command workflow.
- no manual JSON.

---

# 129. Final Definition of Done — Web App

Web App Done כאשר:

- static.
- client-side.
- no mandatory build.
- loads library.
- navigates.
- plays.
- persists user state.
- responsive.
- RTL.
- handles errors.

---

# 130. Final Definition of Done — Player

Player Done כאשר:

- Play/Pause.
- Seek.
- ±10.
- Time/Duration.
- Speed.
- Previous/Next.
- Repeat.
- Loading/Buffering/Error.
- Full/Mini synchronized.
- one audio instance.

---

# 131. Final Definition of Done — Content Experience

Done כאשר:

- Topic hierarchy works.
- Track list works.
- Text works.
- Search works.
- Continue Listening works.
- History/Favorites work.

---

# 132. Final Definition of Done — UX

Done כאשר:

- clear without tutorial.
- mobile-friendly.
- desktop-friendly.
- current track clear.
- listening mode clear.
- controls not overloaded.
- text readable.
- experience feels intentional and polished.

---

# 133. Final Definition of Done — Release Candidate

Release Candidate מוכן כאשר:

1. כל Acceptance Criteria הקריטיים עוברים.
2. Test Plan המרכזי עבר.
3. אין Critical Bugs.
4. אין High Bugs בזרימה המרכזית.
5. GitHub Pages Smoke Test עבר.
6. Content Workflow עבר.
7. README מעודכן.
8. Docs תואמים למימוש בפועל.
9. Debug code מיותר הוסר.
10. Release Checklist מוכן לביצוע.

---

# 134. השלב הבא

השלב הבא והאחרון בסדרת מסמכי ההכנה הוא:

# Production / Release Checklist

במסמך הבא נבנה Checklist מעשי קצר וברור לביצוע לפני כל Release:

1. בדיקות Generator.
2. בדיקות JSON.
3. בדיקות תוכן.
4. בדיקות Player.
5. בדיקות Search/History/Favorites.
6. בדיקות Mobile/Desktop.
7. בדיקות Browser.
8. בדיקות RTL/Accessibility.
9. בדיקות Performance.
10. בדיקות GitHub Pages.
11. Cache/Version.
12. README/Docs.
13. Smoke Test סופי.
14. Go / No-Go.
15. Post-Release verification.

לאחר המסמך הזה, שלב התכנון ייחשב סגור ויהיה אפשר להתחיל את הפיתוח לפי `07-development-plan.md`.