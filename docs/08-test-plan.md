# תכנית בדיקות מלאה — ספריית שמע דינמית
**גרסה:** 1.0  
**סטטוס:** מסמך Test Plan  
**מבוסס על:** מסמך דרישות מוצר 1.0 + אפיון פונקציונלי 1.0 + מודל התוכן וה־Generator 1.0 + אפיון UX/UI 1.0 + ארכיטקטורה טכנית 1.0 + מבנה הפרויקט 1.0 + תכנית הפיתוח 1.0  
**מטרת המסמך:** להגדיר אסטרטגיית בדיקות מקיפה אך פשוטה, שתיתן ביטחון שהמערכת עובדת נכון לפני Release ושתאפשר לזהות Regression בלי לבנות מערך בדיקות מסורבל.

---

# 1. עקרון הבדיקות

המטרה אינה להגיע ל־100% Test Coverage מלאכותי.

המטרה היא לבדוק היטב את האזורים שבהם תקלה באמת פוגעת במוצר:

1. Generator.
2. טעינת הספרייה.
3. ניווט.
4. Audio playback.
5. מצבי האזנה.
6. Storage מקומי.
7. Search.
8. Responsive.
9. RTL.
10. Error handling.
11. Deployment.

העיקרון:

> **בודקים לעומק את הליבה, ובפשטות את השאר.**

---

# 2. סוגי הבדיקות

הבדיקות יחולקו ל:

```text
1. Unit Tests
2. Integration Tests
3. Manual Functional Tests
4. Browser Tests
5. Mobile/Responsive Tests
6. Accessibility Checks
7. Performance Checks
8. Regression Checklist
9. Release Smoke Tests
```

לא כל שלב חייב להיות אוטומטי.

---

# 3. מה כן צריך להיות אוטומטי

העדיפות לאוטומציה היא במקומות דטרמיניסטיים שקל לשבור בלי לשים לב:

- Generator.
- Route parsing.
- Search normalization.
- Next/Previous logic.
- Listening mode decisions.
- ID generation.
- Storage parsing.
- Progress/completed calculations.

---

# 4. מה יכול להישאר ידני

בגרסה הראשונה:

- UX.
- Layout.
- Visual polish.
- Touch comfort.
- Audio quality perception.
- Responsive.
- Error message clarity.
- Cross-browser behavior.

אין צורך ב־Visual Regression Platform מורכב.

---

# 5. Test Data קבוע

צריך להכין תיקיית תוכן ייעודית לבדיקות.

לדוגמה:

```text
/test-content
├── נושא א
│   ├── 01 - קטע ראשון.mp3
│   ├── 01 - קטע ראשון.txt
│   ├── 02 - קטע שני.mp3
│   ├── תת נושא
│   │   ├── 01 - קטע נוסף.m4a
│   │   ├── 01 - קטע נוסף.txt
│   │   └── תת נושא עמוק
│   │       └── 01 - קטע עמוק.mp3
│   └── טקסט בלי שמע.txt
│
├── נושא ריק
│
└── נושא ב
    ├── duplicate.mp3
    └── duplicate.m4a
```

ה־Test Data צריך לכלול בכוונה גם מצבים תקינים וגם בעייתיים.

---

# 6. בדיקות Generator — בסיס

## TC-GEN-001 — סריקה בסיסית

קלט:
```text
נושא/
  קטע.mp3
  קטע.txt
```

צפוי:
- Topic אחד.
- Track אחד.
- Text משויך.

---

# 7. בדיקות Generator — עומק

## TC-GEN-002 — עומק רקורסיבי

מבנה:
```text
A/B/C/D/E/track.mp3
```

צפוי:
- כל רמות ה־Topic נוצרות.
- Track מופיע ברמה הנכונה.
- אין מגבלת עומק מלאכותית.

---

# 8. בדיקות Generator — Audio ללא TXT

## TC-GEN-003

קלט:
```text
track.mp3
```

צפוי:
- Track נוצר.
- אין crash.
- `text` ריק/null לפי הסכמה.
- Warning אופציונלי.

---

# 9. בדיקות Generator — TXT ללא Audio

## TC-GEN-004

קלט:
```text
track.txt
```

צפוי:
- לא נוצר Track.
- Warning ברור.

---

# 10. בדיקות Generator — duplicate basename

## TC-GEN-005

קלט:
```text
track.mp3
track.m4a
track.txt
```

צפוי:
- conflict מזוהה.
- Generator לא מנחש.
- Error ברור לפריט.
- שאר הספרייה עדיין יכולה להיבנות.

---

# 11. בדיקות Generator — עברית ו־Unicode

## TC-GEN-006

קלט:
```text
נושא בעברית/
  שיר מספר 1.mp3
  שיר מספר 1.txt
```

צפוי:
- JSON UTF-8 תקין.
- שם נשמר.
- ID נוצר.
- path יחסי.

---

# 12. בדיקות Generator — Natural Sort

## TC-GEN-007

קלט:
```text
1.mp3
2.mp3
10.mp3
11.mp3
```

צפוי:
```text
1
2
10
11
```

ולא sort לקסיקוגרפי שגוי.

---

# 13. בדיקות Generator — Case Insensitive Extensions

## TC-GEN-008

קלט:
```text
A.MP3
B.M4A
```

צפוי:
- שניהם מזוהים.

---

# 14. בדיקות Generator — Ignore Files

## TC-GEN-009

קלט:
```text
.DS_Store
Thumbs.db
README.md
```

צפוי:
- לא נכנסים לספרייה.
- לא נוצרת שגיאה.

---

# 15. בדיקות Generator — Deterministic IDs

## TC-GEN-010

פעולה:
- מריצים Generator פעמיים ללא שינוי.

צפוי:
- אותם IDs.
- אותו סדר.
- רק `generatedAt` שונה.

---

# 16. בדיקות Generator — Rename

## TC-GEN-011

פעולה:
- משנים שם של Track.
- מריצים Generator.

צפוי:
- ID משתנה אם הוא מבוסס path.
- JSON משקף את השם החדש.

---

# 17. בדיקות Generator — Move

## TC-GEN-012

פעולה:
- מעבירים Track לתיקייה אחרת.

צפוי:
- Topic משתנה.
- path משתנה.
- ID משתנה לפי מדיניות.

---

# 18. בדיקות Generator — Atomic Write

## TC-GEN-013

סימולציה:
- כשל בזמן כתיבה.

צפוי:
- `library.json` הקודם נשאר תקין.
- temp file לא מחליף אותו חלקית.

---

# 19. בדיקות Generator — JSON Validity

## TC-GEN-014

צפוי:
- `JSON.parse()` מצליח.
- `schemaVersion` קיים.
- `root` קיים.

---

# 20. בדיקות Generator — פורמטים

לבדוק לפחות:

```text
.mp3
.m4a
.aac
.ogg
.oga
.opus
.webm
.wav
.flac
```

המטרה בבדיקה זו:
- Generator מזהה extension.

היא אינה מבטיחה שהדפדפן מסוגל לנגן כל codec.

---

# 21. בדיקות Generator — Summary

בסוף הרצה צריך לקבל Summary הגיוני:

```text
Topics
Tracks
Texts matched
Warnings
Errors
Output file
```

---

# 22. Unit Tests — Router

לבדוק פונקציות כמו:

```text
parseRoute()
buildRoute()
```

---

# 23. Router — Home

## TC-ROUTE-001

קלט:
```text
#/
```

צפוי:
```text
home
```

---

# 24. Router — Topic

## TC-ROUTE-002

קלט:
```text
#/topic/topic_123
```

צפוי:
```text
route = topic
id = topic_123
```

---

# 25. Router — Track

## TC-ROUTE-003

קלט:
```text
#/track/track_456
```

צפוי:
```text
route = track
id = track_456
```

---

# 26. Router — Invalid

## TC-ROUTE-004

קלט:
```text
#/something/unknown
```

צפוי:
```text
not-found
```

---

# 27. Router — Back/Forward

בדיקה ידנית:

1. Home.
2. Topic A.
3. Track 1.
4. Browser Back.
5. Browser Forward.

צפוי:
- המסכים תואמים History.
- Audio לא מתאפס רק בגלל ניווט פנימי.

---

# 28. בדיקות Library Loader

## TC-LIB-001 — JSON תקין

צפוי:
- state = ready.
- Maps נבנים.
- Topics/Tracks נגישים.

---

# 29. Library Loader — JSON חסר

## TC-LIB-002

צפוי:
- state = error.
- UI מציג הודעה.
- App לא קורס.

---

# 30. Library Loader — JSON פגום

## TC-LIB-003

צפוי:
- parse error מטופל.
- User-facing error פשוט.

---

# 31. Library Loader — Schema לא נתמך

## TC-LIB-004

צפוי:
- error ברור.
- לא ממשיכים עם מבנה לא מוכר.

---

# 32. Library Loader — Lookup

## TC-LIB-005

לבדוק:
```text
getTrack(id)
getTopic(id)
```

צפוי:
- O(1) lookup דרך Map.
- unknown ID מחזיר null/undefined צפוי.

---

# 33. בדיקות Topics

## TC-TOPIC-001

Topic עם child Topics בלבד.

צפוי:
- child Topics מוצגים.
- אין Track list ריק מיותר.

---

# 34. Topics + Tracks

## TC-TOPIC-002

Topic עם:
- subtopics.
- tracks.

צפוי:
- שניהם מוצגים.
- order עקבי.

---

# 35. Empty Topic

## TC-TOPIC-003

צפוי:
```text
אין עדיין תוכן בנושא זה.
```

---

# 36. Deep Breadcrumb

## TC-TOPIC-004

עומק:
```text
A/B/C/D/E
```

צפוי:
- breadcrumb תקין בדסקטופ.
- mobile variant לא נשבר.

---

# 37. בדיקות Track Page

## TC-TRACK-001

Track תקין עם Text.

צפוי:
- title.
- player.
- text.
- context.

---

# 38. Track ללא Text

## TC-TRACK-002

צפוי:
- player עובד.
- אין crash.
- text section חסר/הודעה קצרה.

---

# 39. Track לא קיים

## TC-TRACK-003

URL ישיר ל־ID לא קיים.

צפוי:
- Not Found.

---

# 40. בדיקות Audio — Play/Pause

## TC-AUD-001

- Play מתחיל ניגון.
- Pause עוצר.
- State תואם.

---

# 41. Audio — Seek

## TC-AUD-002

פעולה:
- לגרור Progress.

צפוי:
- currentTime משתנה.
- UI מתעדכן.
- אין jump שגוי.

---

# 42. Audio — Skip Back 10

## TC-AUD-003

אם currentTime = 5:

צפוי:
```text
0
```

לא ערך שלילי.

---

# 43. Audio — Skip Forward 10

## TC-AUD-004

אם נשארו 4 שניות:

צפוי:
- לא עוברים מעבר duration.

---

# 44. Audio — Speed

## TC-AUD-005

לבדוק:

```text
0.75x
1x
1.25x
1.5x
1.75x
2x
```

צפוי:
- playbackRate משתנה.
- UI מציג ערך נכון.

---

# 45. Audio — Volume

## TC-AUD-006

בדסקטופ:
- slider עובד.
- mute עובד.
- unmute עובד.

---

# 46. Audio — Buffering

## TC-AUD-007

לסמלץ רשת איטית.

צפוי:
- state = buffering.
- spinner/indicator.
- אין error מידי.

---

# 47. Audio — Error

## TC-AUD-008

קובץ חסר/פגום.

צפוי:
- player error state.
- Retry אפשרי.
- שאר האתר עובד.

---

# 48. Audio — Track Switch

## TC-AUD-009

בזמן Track A:
- בוחרים Track B.

צפוי:
- A נעצר.
- B נטען.
- אין overlap.
- context מתעדכן.

---

# 49. Audio — Global Continuity

## TC-AUD-010

1. מתחילים Track.
2. עוברים Topic.
3. עוברים Search.
4. חוזרים Home.

צפוי:
- Audio ממשיך.
- Mini Player נשאר.
- progress נשמר.

---

# 50. Audio — Single Audio Element

בדיקת קוד/Runtime:

צפוי:
- אין יותר מ־Audio Element/instance פעיל אחד.

---

# 51. בדיקות Listening Modes

---

# 52. Single Track Mode

## TC-MODE-001

Track מסתיים.

צפוי:
- נעצר.
- לא Next.

---

# 53. Auto Continue

## TC-MODE-002

Track באמצע רשימה מסתיים.

צפוי:
- Next מתחיל.

---

# 54. Auto Continue — End of List

## TC-MODE-003

Track אחרון מסתיים.

צפוי:
- נעצר.
- לא עובר Topic.

---

# 55. Free Choice

## TC-MODE-004

Track מסתיים.

צפוי:
- לא נבחר Track אחר אוטומטית.

---

# 56. Random

## TC-MODE-005

Track מסתיים.

צפוי:
- Track אחר מתוך context נבחר אם יש חלופה.

---

# 57. Random — Single Item

## TC-MODE-006

Context מכיל Track יחיד.

צפוי:
- התנהגות תואמת החלטת המוצר הסופית.
- אין loop מקרי לא מתועד.

---

# 58. Repeat

## TC-MODE-007

Repeat פעיל.

צפוי:
- Current Track מתחיל מחדש.
- listening mode לא מופעל.

---

# 59. Repeat Off

## TC-MODE-008

מכבים Repeat.

צפוי:
- ended הבא פועל לפי listening mode.

---

# 60. Previous/Next

## TC-MODE-009

Track באמצע context.

צפוי:
- previous/next נכונים.
- order תואם JSON.

---

# 61. Previous at First

## TC-MODE-010

צפוי:
- disabled/no action.
- אין wrap-around ב־V1.

---

# 62. בדיקות Resume

## TC-RES-001

Track נעצר ב־10:00.

Refresh.

צפוי:
- Resume point קיים.
- Play ממשיך מהנקודה שנשמרה.

---

# 63. Resume — Start Again

## TC-RES-002

יש Resume point.

פעולה:
- "התחל מהתחלה".

צפוי:
- position = 0.

---

# 64. Resume — Very Early

## TC-RES-003

עוצרים אחרי 2–3 שניות.

צפוי:
- אפשר להחליט שלא להציע Resume.
- בהתאם threshold הסופי.

---

# 65. Resume — Near End

## TC-RES-004

עוצרים קרוב לסוף.

צפוי:
- יכול להיחשב Completed.
- לא Resume אגרסיבי.

---

# 66. Completed

## TC-RES-005

Track מגיע לסוף.

צפוי:
- completed = true.
- progress = 100%/threshold.

---

# 67. Storage Corruption

## TC-STO-001

localStorage מכיל JSON פגום.

צפוי:
- fallback defaults.
- App עולה.
- אין crash.

---

# 68. Storage Unavailable

## TC-STO-002

סימולציה של write failure/quota/security restriction.

צפוי:
- האפליקציה ממשיכה לעבוד.
- persistence בלבד נפגעת.

---

# 69. Favorites — Add

## TC-FAV-001

צפוי:
- נוסף מיד.
- icon/state משתנה.
- נשמר Refresh.

---

# 70. Favorites — Remove

## TC-FAV-002

צפוי:
- מוסר מיד.
- אין duplicate state.

---

# 71. Favorite Track Removed from Library

## TC-FAV-003

Track נמחק מה־JSON.

צפוי:- לא מוצג כפריט שבור.
- ignored/cleaned.

---

# 72. History — First Play

## TC-HIS-001

Track מתחיל ניגון ממשי.

צפוי:
- נכנס להיסטוריה.

---

# 73. History — Sort

## TC-HIS-002

לנגן A ואז B ואז A.

צפוי:
- A ראשון.
- B אחריו.

---

# 74. History — Progress

## TC-HIS-003

צפוי:
- progress תואם האחרון שנשמר.

---

# 75. בדיקות Search

## TC-SRC-001 — Title

Query תואם חלק משם Track.

צפוי:
- Track מופיע.

---

# 76. Search — Topic

## TC-SRC-002

Query תואם Topic.

צפוי:
- Topic מופיע.

---

# 77. Search — Case

## TC-SRC-003

אנגלית באותיות שונות.

צפוי:
- case insensitive.

---

# 78. Search — Hebrew

## TC-SRC-004

Query בעברית.

צפוי:
- תוצאה נכונה.

---

# 79. Search — No Results

## TC-SRC-005

צפוי:
```text
לא נמצאו תוצאות
```

---

# 80. Search — While Playing

## TC-SRC-006

Audio מתנגן.

מבצעים Search.

צפוי:
- Audio ממשיך.

---

# 81. Search — Open Result

## TC-SRC-007

לחיצה על Track result.

צפוי:
- route correct.
- context הגיוני.
- Track נפתח.

---

# 82. Search in Text

אם מופעל:

## TC-SRC-008

Query מופיע רק בתוך TXT.

צפוי:
- Track מופיע.

אם לא מופעל ב־V1:
- הבדיקה אינה חובה.

---

# 83. בדיקות UI — Home

לבדוק:

- חיפוש.
- המשך להאזין.
- Topics.
- מועדפים/היסטוריה.
- Empty state.

---

# 84. בדיקות Mini Player

## TC-UI-001

צפוי:
- מופיע רק כשיש Current Track.
- לא מופיע לפני שנבחר Track.
- Play/Pause עובד.
- פתיחת Full Player עובדת.

---

# 85. Mini Player + Bottom Nav

## TC-UI-002

במובייל:
- לא מסתירים זה את זה.
- התוכן מקבל padding מתאים.

---

# 86. Full Player — Mobile

לבדוק:

- title.
- progress.
- play.
- ±10.
- speed.
- repeat.
- text.
- scroll.

---

# 87. Full Player — Desktop

לבדוק:

- רוחב.
- list/player/text.
- volume.
- readability.

---

# 88. Long Titles

## TC-UI-003

Track/Topic עם שם ארוך מאוד.

צפוי:
- אין overflow.
- Track Page מציג title מלא.
- list משתמש ב־2 lines/ellipsis לפי design.

---

# 89. Long Text

## TC-UI-004

TXT ארוך מאוד.

צפוי:
- scroll חלק.
- player basic controls נשארים נגישים.

---

# 90. RTL

## TC-RTL-001

לבדוק:

- Header.
- Breadcrumb.
- Topic cards.
- Track rows.
- Player.
- Search.
- Bottom sheets.
- Progress labels.

צפוי:
- layout טבעי בעברית.

---

# 91. Mixed RTL/LTR

## TC-RTL-002

Track title עם:
```text
עברית English 123
```

צפוי:
- לא נשבר בצורה חריגה.

---

# 92. Responsive Matrix

לבדוק לפחות:

```text
320px
360px
390px
768px
1024px
1440px
```

אין צורך להינעל על דגמי מכשירים ספציפיים בלבד.

---

# 93. Mobile — Touch Targets

לבדוק:

- Play.
- ±10.
- Next/Previous.
- Bottom Nav.
- Favorite.
- Speed selector.

צפוי:
- נוח ללחיצה.
- אין טעויות בגלל צפיפות.

---

# 94. Mobile — Orientation

Portrait חובה.

Landscape:
- צריך להיות usable.
- לא חייב layout מיוחד אם responsive מספיק.

---

# 95. Browser Matrix

לפני Release:

```text
Chrome latest
Edge latest
Firefox latest
Safari latest / recent
```

אם Safari לא זמין בסביבת הפיתוח:
- לבדוק במכשיר Apple אמיתי/Browser service לפני Release משמעותי.

---

# 96. Browser — Audio Formats

לא כל Browser תומך בכל codec.

המטרה:
- פורמט נתמך מנגן.
- פורמט לא נתמך מטופל יפה.

---

# 97. Autoplay Restrictions

## TC-BRW-001

פתיחת Track URL ישיר.

צפוי:
- אין Autoplay כפוי.
- Play זמין.

---

# 98. Background Tab

## TC-BRW-002

Audio מתנגן.

עוברים לטאב אחר.

צפוי:
- Audio ממשיך אם הדפדפן מאפשר.
- state חוזר נכון כשחוזרים.

---

# 99. Refresh

## TC-BRW-003

Refresh באמצע Track.

צפוי:
- Audio מפסיק כי הדף נטען מחדש.
- Resume point נשמר ככל האפשר.
- "המשך להאזין" זמין.

---

# 100. Network — Slow

## TC-NET-001

Chrome throttling Slow 3G/דומה.

צפוי:
- Library Loading ברור.
- Audio buffering ברור.
- UI נשאר responsive.

---

# 101. Network — Offline After Load

## TC-NET-002

לאחר טעינת האתר:
- עוברים Offline.

צפוי:
- תוכן שכבר נטען יכול להישאר מוצג.
- Audio חדש עלול להיכשל.
- error ברור.

---

# 102. Network — Recover

## TC-NET-003

חוזרים Online.

צפוי:
- Retry עובד.
- אין צורך Refresh מלא אם לא הכרחי.

---

# 103. Performance — Startup

למדוד:

- fetch library.
- parse.
- build maps.
- first meaningful render.

לא לקבוע SLA קשיח לפני שיש Content אמיתי.

---

# 104. Performance — Search

עם ספרייה אמיתית:

צפוי:
- אין lag מורגש בהקלדה.

אם יש:
- למדוד.
- רק אז לבצע optimization.

---

# 105. Performance — Large Topic

לבדוק Topic עם:
- 100 Tracks.
- 300 Tracks.
- יותר אם רלוונטי.

צפוי:
- scroll ו־render סבירים.

---

# 106. Performance — Large Text

Track עם TXT גדול.

צפוי:
- Track Page לא קופא.

---

# 107. Performance — Audio Memory

לעבור בין Tracks רבים.

צפוי:
- אין הצטברות Audio Elements.
- אין memory growth חריג בגלל listeners שלא הוסרו.

---

# 108. Accessibility — Keyboard

לבדוק:

- Tab.
- Shift+Tab.
- Enter.
- Space על Buttons.
- focus visible.

---

# 109. Accessibility — Labels

כל Icon-only button צריך:
- `aria-label`.

---

# 110. Accessibility — Semantic Elements

לבדוק:
- button ולא clickable div.
- nav.
- main.
- headings.

---

# 111. Accessibility — Contrast

לבדוק visually/tool בסיסי.

לא צריך מערכת audit מורכבת, אבל לא לקבל contrast חלש.

---

# 112. Accessibility — Reduced Motion

להפעיל:
```text
prefers-reduced-motion
```

צפוי:
- animation מצטמצמת.
- UI עדיין ברור.

---

# 113. Accessibility — Screen Reader Smoke Test

אם אפשר:

- NVDA/VoiceOver smoke test.

לפחות:
- כפתורי נגן מזוהים.
- Track title נקרא.
- Search label ברור.

---

# 114. בדיקות Error Recovery

כל Error צריך Action סביר.

לבדוק:

```text
Library Error → Retry
Audio Error → Retry/Next
404 → Home/Search
Empty Topic → Back
No Search Results → clear/new query
```

---

# 115. בדיקות JSON ישן

אם `schemaVersion` שונה:

צפוי:
- לא להמשיך באופן שקט.
- הודעה ברורה למפתח/משתמש.

---

# 116. בדיקות Track Removed

תרחיש:

1. Track קיים ונשמר ב־Favorites/History.
2. Track נמחק.
3. JSON מתעדכן.

צפוי:
- UI לא נשבר.
- stale ID ignored/cleaned.

---

# 117. בדיקות Content Update

תרחיש:

1. מוסיפים Topic.
2. מוסיפים Audio + TXT.
3. מריצים Generator.
4. Deploy.

צפוי:
- Topic מופיע.
- Track מופיע.
- Text מופיע.
- אין שינוי קוד.

---

# 118. בדיקות Rename

תרחיש:

1. Rename file.
2. Regenerate.
3. Refresh.

צפוי:
- title חדש.
- ID חדש אם path-based.
- old favorite/history לא נשבר את האתר.

---

# 119. בדיקות Cache

לאחר Deploy חדש:

צפוי:
- `library.json` החדש נטען.
- אין מצב שבו תוכן ישן נשאר לנצח.

אם יש בעיה:
- cache busting.

---

# 120. GitHub Pages Smoke Test

לאחר Deployment:

לבדוק:

- Home.
- Topic.
- Track.
- Audio.
- TXT.
- Search.
- Favorites.
- History.
- direct hash URL.
- Refresh.
- mobile.

---

# 121. Release Smoke Test קצר

לפני כל Release:

```text
1. Home loads
2. Topic opens
3. Track plays
4. Pause works
5. Seek works
6. Text appears
7. Navigate while playing
8. Mini Player works
9. Next works
10. Resume works
11. Search works
12. Favorite works
13. Mobile layout works
```

אם אחד מאלה נכשל:
- לא משחררים.

---

# 122. Regression Checklist

לאחר שינוי משמעותי, לבדוק לפחות:

- Generator output.
- Router.
- Current Track.
- Mini Player.
- Full Player.
- Listening Mode.
- Resume.
- Favorites.
- Search.
- Mobile.
- Error states.

---

# 123. Regression לפי אזור שינוי

## שינוי Generator
בודקים:
- JSON.
- IDs.
- paths.
- order.
- app load.

## שינוי Player
בודקים:
- play/pause.
- seek.
- next/previous.
- modes.
- resume.

## שינוי Router
בודקים:
- all routes.
- back/forward.
- audio continuity.

## שינוי CSS
בודקים:
- mobile.
- desktop.
- mini player overlap.
- long text/title.

---

# 124. Bug Severity

## Critical

- האתר לא עולה.
- Generator לא מייצר JSON.
- Audio לא מנגן בכלל.
- JSON corrupt.
- Data loss משמעותי.

## High

- Next/Resume/Search מרכזי שבור.
- mobile unusable.
- navigation שובר Audio.

## Medium

- UI issue משמעותי.
- Edge case לא תקין.

## Low

- polish.
- minor alignment.
- copy wording.

---

# 125. Release Blocking

Blocker ל־Release:

- כל Critical.
- High שמשפיע על flow מרכזי.
- mobile broken.
- audio core broken.
- generator corrupts library.

לא חוסמים Release על:
- cosmetic minor issue.
- future enhancement.

---

# 126. Test Automation Scope ל־V1

האוטומציה בפועל כוללת כיום:

```text
Generator
Library Service
Router
Application routing
Player/Audio Service
Local media server
Documentation contract
Playwright browser E2E
```

Playwright הוא כעת חלק מה־CI הפעיל, ולא רק תכנון עתידי.

לא נדרש כרגע:
- Selenium Grid.
- cloud device farm.
- Visual Regression SaaS.

---

# 127. Browser E2E — מיושם

Playwright מריץ Chromium אמיתי במצב Headless בתוך GitHub Actions.

ה־flows הנוכחיים כוללים:

```text
open app
navigate topic
open real Track
load real WAV metadata
play real audio
verify visible current time advances
verify seek advances
verify percentage advances
seek
speed
repeat
desktop mute
mobile responsive checks
```

הרצה מתבצעת בשני projects:

```text
desktop-chromium
mobile-chromium
```

בדיקה ידנית אינה נדרשת כ־gate שגרתי להתנהגות אובייקטיבית שכבר מכוסה ב־E2E.

בדיקה ידנית עדיין רלוונטית לשיפוט חזותי/UX או לתקלה ספציפית לסביבה שאינה משתחזרת ב־CI.

---

# 128. Test File Structure עתידי

אם נוסיף tests:

```text
/tests
├── generator/
├── router/
├── player/
├── search/
└── storage/
```

לא ליצור לפני שיש tests אמיתיים.

---

# 129. Test Naming

שמות צריכים לתאר התנהגות.

טוב:
```text
should stop at end of list in auto mode
```

פחות טוב:
```text
test1
mode test
```

---

# 130. Test Isolation

בדיקות Storage:
- מנקות keys לפני/אחרי.

בדיקות Generator:
- משתמשות בתיקיית temp.

בדיקות route:
- pure functions ככל האפשר.

---

# 131. בדיקות עם Content אמיתי

לפני Release אמיתי חייבים לבדוק עם:

- מבנה התיקיות האמיתי.
- קבצי Audio אמיתיים.
- TXT אמיתי.
- שמות אמיתיים.
- כמות תוכן אמיתית.

Mock בלבד אינו מספיק.

---

# 132. בדיקות User Experience

לפחות אדם אחד שאינו מפתח צריך לבצע:

```text
מצא נושא
בחר Track
נגן
קרא
חזור
חפש
שמור מועדף
```

בלי הדרכה מוקדמת.

אם צריך להסביר:
- ה־UX דורש שיפור.

---

# 133. שאלות UX בבדיקה

- האם ברור מה מתנגן?
- האם ברור איך לעצור?
- האם ברור מה יקרה בסוף?
- האם קל למצוא Track אחר?
- האם Mode ברור?
- האם הטקסט נוח?
- האם יש כפתורים מיותרים?

---

# 134. בדיקות פשטות

בכל Review:
- האם הוספנו UI שלא צריך?
- האם יש שתי דרכים לאותה פעולה?
- האם יש state כפול?
- האם יש error technical מדי?
- האם המשתמש רואה מושג פנימי?

---

# 135. Bug Reproduction Template

לכל Bug משמעותי לתעד:

```text
Title
Environment
Steps
Expected
Actual
Screenshot/Console if relevant
Severity
```

לא צריך מערכת Bug Tracking מורכבת אם הפרויקט אישי.

---

# 136. Test Environment

מומלץ:

## Local
- static HTTP server.
- test content.

## Production-like
- GitHub Pages preview/repository.

שניהם חשובים.

---

# 137. Test Browser Cache State

לבדוק:

- fresh cache/incognito.
- returning user עם localStorage.
- אחרי content update.

---

# 138. Returning User Scenario

תרחיש:

1. נגן Track.
2. Favorite.
3. שינוי speed.
4. יציאה.
5. חזרה.

צפוי:
- preferences נשמרות.
- favorite נשמר.
- resume זמין.

---

# 139. New User Scenario

localStorage ריק.

צפוי:
- defaults תקינים.
- אין errors.
- אין empty broken sections.

---

# 140. Large History Scenario

ליצור היסטוריה של הרבה Tracks.

צפוי:
- History Page נשאר מהיר.

אם בעתיד גדל מאוד:
- אפשר limit.

לא צריך מראש.

---

# 141. Large Favorites Scenario

אותו עיקרון.

---

# 142. Session Change Scenario

Track Playing + user selects another Topic.

צפוי:
- Audio continues.
- context לא משתנה רק בגלל browsing.

Track חדש selected:
- context כן מתעדכן.

---

# 143. Direct URL Scenario

פתיחת:
```text
/#/track/id
```
צפוי:
- Track Page נטען.
- no autoplay.
- Play עובד.
- context מוגדר בצורה סבירה או מינימלית.

---

# 144. Track Direct URL + Next

אם אין context מלא מהניווט:

יש להגדיר התנהגות עקבית.

אפשרות פשוטה:
- context = siblings של Track בתוך Topic ההורה.

זו צריכה להיבדק.

---

# 145. Breadcrumb Direct URL

גם ב־direct URL:
- breadcrumb נכון.

---

# 146. בדיקות Current Track Highlight

Track פעיל מופיע ב:
- Topic.
- Search.
- Favorites.
- History.

צפוי:
- indicator ברור ועקבי.

---

# 147. בדיקות Completed Highlight

Track שהושלם:
- check/progress נכון.
- לא מוגזם חזותית.

---

# 148. בדיקות Progress Accuracy

Progress UI צריך להיות עקבי עם:
```text
currentTime / duration
```

לבדוק:
- 0%.
- 50%.
- 100%.

---

# 149. בדיקות Time Formatting

לבדוק:
- 00:05.
- 05:32.
- 1:02:15.

לא להציג פורמט שבור לקטע מעל שעה.

---

# 150. בדיקות Speed Persistence

אם הוחלט לשמור speed:

1. בחר 1.5x.
2. Reload.
3. נגן Track.

צפוי:
- 1.5x.

---

# 151. בדיקות Listening Mode Persistence

אותו עיקרון.

---

# 152. בדיקות Repeat Reset

אם Repeat מוגדר כ־session/track state:

1. Repeat on.
2. select new Track.

צפוי:
- behavior תואם החלטה.
- מומלץ reset ל־off.

---

# 153. בדיקות Volume Persistence

אם נשמר:
- ערך חוזר אחרי Reload.

אם לא נשמר:
- default צפוי.

---

# 154. בדיקות Search Text Performance

אם מחפשים בתוך Lyrics/Text:
- למדוד עם הספרייה האמיתית.
- אם יש lag, להחליט אם לדחות full-text.

---

# 155. בדיקות Generator Performance

עם הרבה קבצים:
- זמן Generate סביר.
- memory סביר.
- output תקין.

אין צורך benchmark קשיח ב־V1.

---

# 156. בדיקות File Name Edge Cases

לבדוק שמות עם:

```text
רווחים
סוגריים ()
מקפים -
נקודות .
מספרים
עברית
English
```

לא לבדוק תווים אסורים שמערכת ההפעלה ממילא לא מאפשרת.

---

# 157. בדיקות TXT Line Endings

לבדוק:
- CRLF.
- LF.

צפוי:
- תצוגה זהה.

---

# 158. בדיקות Plain Text Safety

TXT עם:
```text
<script>alert(1)</script>
```

צפוי:
- מוצג כטקסט.
- לא מורץ.

---

# 159. בדיקות URL Encoding

Track path עם:
- עברית.
- spaces.

צפוי:
- Audio נטען.
- אין broken URL.

---

# 160. בדיקות Base Path

ב־GitHub Project Pages:

```text
username.github.io/repo/
```

צפוי:
- JSON.
- JS.
- CSS.
- Audio.
כולם נטענים.

---

# 161. בדיקות 404.html

לפתוח URL לא קיים שאינו Hash.

צפוי:
- fallback נעים.
- אפשר לחזור לבית.

---

# 162. בדיקות README Workflow

לפני Release:
- מפתח/משתמש אחר עוקב אחרי README.
- מצליח:
  - להריץ local.
  - להריץ generator.
  - להוסיף content.

אם לא:
- README לא מספיק טוב.

---

# 163. Definition of Done — Test Plan

תכנית הבדיקות נחשבת מיושמת כאשר:

1. Generator נבדק על מבנה תקין ובעייתי.
2. Router נבדק.
3. Library loader נבדק.
4. Audio core נבדק.
5. Listening modes נבדקים.
6. Resume/History/Favorites נבדקים.
7. Search נבדק.
8. Mobile/Desktop נבדקים.
9. RTL נבדק.
10. Error cases נבדקים.
11. Browser matrix בסיסי עובר.
12. GitHub Pages smoke test עובר.
13. Regression checklist קיים.
14. Release blockers מוגדרים.

---

# 164. מה לא צריך ב־V1

לא צריך:

- QA infrastructure כבדה.
- Selenium Grid.
- Device Farm קבוע.
- Visual Regression SaaS.
- 100% unit coverage.
- Full E2E לכל edge case.
- load testing של שרת כי אין backend.

---

# 165. עקרון בדיקות אחרון

לפני כל Release שואלים:

> האם משתמש אמיתי יכול למצוא Track, לנגן אותו, לקרוא את הטקסט, להמשיך להאזין, לחזור אחר כך, ולעשות את כל זה גם בטלפון בלי להיתקע?

אם כן — אנחנו קרובים לשחרור.

אם לא — כל בדיקה אחרת פחות חשובה כרגע.

---

# 166. השלב הבא

השלב הבא הוא:

# מסמך Acceptance Criteria / Definition of Done מלא

במסמך הבא נרכז במקום אחד את תנאי הקבלה הסופיים של המוצר:

1. תנאי קבלה לכל Feature.
2. תנאי קבלה ל־Generator.
3. תנאי קבלה ל־Library.
4. תנאי קבלה ל־Player.
5. תנאי קבלה ל־Listening Modes.
6. תנאי קבלה ל־Text.
7. תנאי קבלה ל־Resume/History/Favorites.
8. תנאי קבלה ל־Search.
9. תנאי קבלה ל־Responsive.
10. תנאי קבלה ל־RTL.
11. תנאי קבלה ל־Accessibility.
12. תנאי קבלה ל־Performance.
13. תנאי קבלה ל־Error Handling.
14. תנאי קבלה ל־Deployment.
15. Definition of Done לגרסה 1.0 כולה.

לאחר מסמך ה־Acceptance נשאר המסמך האחרון:

**Production / Release Checklist.**