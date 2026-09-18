# מודל התוכן וה־Generator — ספריית שמע דינמית מבוססת קבצים
**גרסה:** 1.0  
**סטטוס:** מסמך אפיון תוכן ו־Generator  
**מבוסס על:** מסמך דרישות מוצר 1.0 + אפיון פונקציונלי 1.0  
**מטרת המסמך:** להגדיר כיצד התוכן נשמר בתיקיות, כיצד ה־Generator סורק אותו, וכיצד נוצר JSON שממנו האתר כולו נטען — תוך שמירה על גמישות ופשטות.

> **עדכון מבנה Deployment:** קבצי ה-Runtime של האתר נמצאים תחת `/src` בלבד. `src/index.html`, `src/app`, `src/styles`, `src/content`, `src/data` ו-`src/config` הם עץ האתר שנפרס. `tools/`, `docs/` וקבצי ניהול נשארים מחוץ לאתר. GitHub Actions מפרסם ל-GitHub Pages רק את תוכן `src/`. בכל דוגמה ישנה במסמך שמציגה `/content`, `/data/library.json`, `/app`, `/styles` או `/index.html` ברוט של ה-repository, יש לקרוא אותם בהתאמה כ-`/src/content`, `/src/data/library.json`, `/src/app`, `/src/styles` ו-`/src/index.html`.

---

# 1. העיקרון המרכזי

התוכן עצמו הוא מקור האמת.

מנהל התוכן עובד עם:

```text
תיקיות
קבצי שמע
קבצי TXT
```

האתר עובד עם:

```text
library.json
```

ה־Generator הוא הגשר ביניהם:

```text
Folders + Audio + TXT
        ↓
     Generator
        ↓
   library.json
        ↓
      Web App
```

המטרה היא שלאחר שהאתר בנוי, הוספת תוכן חדש לא תדרוש שינוי בקוד.

---

# 2. מבנה התוכן

תיקיית השורש המומלצת:

```text
/content
```

בתוכה ניתן ליצור כל מבנה שרוצים.

דוגמה:

```text
/content
├── נושא א
│   ├── קטע 1.mp3
│   ├── קטע 1.txt
│   ├── תת נושא
│   │   ├── קטע 2.m4a
│   │   ├── קטע 2.txt
│   │   └── תת נושא נוסף
│   │       └── קטע 3.mp3
│   └── קטע 4.mp3
│
├── נושא ב
│   ├── קטע 5.opus
│   └── קטע 5.txt
│
└── קטע ישירות בשורש.mp3
```

---

# 3. אין עומק קבוע

המערכת לא מניחה מבנה של:

```text
קטגוריה ראשית
→ קטגוריה משנית
→ קטע
```

במקום זאת:

```text
Folder = Topic
Folder inside Folder = Subtopic
Audio file = Track
```

וכל Topic יכול להכיל:

- Topics נוספים.
- Tracks.
- גם Topics וגם Tracks.
- שום דבר.

אין מגבלת עומק פונקציונלית שהמערכת מגדירה מראש.

---

# 4. כלל ההתאמה בין שמע לטקסט

קובץ TXT מתאים לקובץ שמע כאשר יש לשניהם **אותו שם בסיס** ובאותה תיקייה.

לדוגמה:

```text
שם הקטע.mp3
שם הקטע.txt
```

או:

```text
שם הקטע.m4a
שם הקטע.txt
```

או:

```text
01 - פתיחה.opus
01 - פתיחה.txt
```

הסיומת בלבד שונה.

---

# 5. TXT הוא אופציונלי

קובץ שמע יכול להופיע גם ללא TXT.

לדוגמה:

```text
קטע ללא טקסט.mp3
```

במקרה כזה:

- Track נוצר כרגיל.
- `text` יהיה `null` או לא יופיע לפי ה־Schema הסופי.
- האתר לא מציג שגיאה.
- מסך הקטע פשוט לא מציג טקסט, או מציג הודעה קצרה.

---

# 6. TXT ללא שמע

לדוגמה:

```text
קטע כלשהו.txt
```

כאשר אין באותה תיקייה קובץ שמע בעל אותו שם בסיס.

התנהגות:

- לא נוצר Track.
- הקובץ לא מוצג באתר.
- ה־Generator מוסיף Warning.

לדוגמה:

```text
WARNING: text file has no matching audio:
content/נושא א/קטע כלשהו.txt
```

---

# 7. פורמטי שמע נתמכים

ברירת המחדל של ה־Generator תזהה את הפורמטים הנפוצים:

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

ההשוואה לסיומת תהיה Case Insensitive.

כלומר גם:

```text
.MP3
.M4A
```

יוכרו.

---

# 8. אין המרה אוטומטית

ה־Generator אינו Audio Converter.

אם נמצא:

```text
קטע.m4a
```

הוא נשאר M4A.

אם נמצא:

```text
קטע.mp3
```

הוא נשאר MP3.

לא ממירים:

```text
M4A → MP3
MP3 → AAC
FLAC → MP3
```

המטרה היא:

> לקחת את הקובץ כפי שהוא ולפרסם אותו, כל עוד הוא בפורמט שהמערכת מכירה והדפדפן יכול לנגן.

---

# 9. המלצת עבודה פשוטה עם הקלטות

לצורך הפרויקט:

- אם הטלפון מייצר M4A/AAC — משתמשים בו.
- אם הטלפון מייצר MP3 — משתמשים בו.
- אין צורך להמיר סתם.

האתר אינו תלוי בפורמט אחד.

---

# 10. קבצים שאינם רלוונטיים

ה־Generator יתעלם מקבצים שאינם:

- Audio נתמך.
- TXT תואם.

למשל:

```text
Thumbs.db
.DS_Store
README.md
desktop.ini
```

לא צריכים להפיל את התהליך.

אפשר להוסיף רשימת Ignore פשוטה.

---

# 11. שמות קבצים

אין פורמט קשיח.

כל אלה חוקיים:

```text
קטע ראשון.mp3
קטע מספר 2.m4a
01 - מבוא.mp3
02 - המשך.mp3
שם ארוך מאוד של קטע.opus
```

הכותרת המוצגת בגרסה א' תהיה:

> שם הקובץ ללא הסיומת.

לדוגמה:

```text
01 - מבוא.mp3
```

יהפוך ל:

```text
01 - מבוא
```

---

# 12. לא להסיר מספרים אוטומטית בגרסה א'

למרות שאפשר לזהות:

```text
01 -
02 -
03 -
```

לא נבנה בגרסה הראשונה מנגנון "חכם" שמסיר Prefix מהכותרת.

הסיבה:

- זה מוסיף Magic.
- יכול להסיר מידע שמנהל התוכן רצה להציג.
- קל מאוד לשנות בעתיד.

לכן:

```text
01 - פתיחה.mp3
```

יוצג כברירת מחדל:

```text
01 - פתיחה
```

אם בעתיד נרצה `displayTitle` נפרד — נוסיף זאת באופן מפורש.

---

# 13. שמות תיקיות

שם Topic יהיה שם התיקייה כפי שהוא.

לדוגמה:

```text
/content/נושא ראשי/תת נושא/
```

יוצג באתר:

```text
נושא ראשי
→ תת נושא
```

אין צורך בקובץ Configuration לכל תיקייה בגרסה הראשונה.

---

# 14. סדר פריטים

ה־Generator אחראי על הסדר.

האתר אינו ממיין מחדש.

ברירת המחדל:

> Natural Sort לפי שם.

כך:

```text
1
2
3
10
11
```

ולא:

```text
1
10
11
2
3
```

---

# 15. סדר בין Topics ל־Tracks

ה־JSON יכול לשמור `children` ברשימה אחת, אבל ה־UI רשאי להציג:

1. Topics.
2. Tracks.

זו החלטת Presentation.

ה־Generator לא צריך להוסיף מורכבות מיוחדת לכך.

---

# 16. אם רוצים לשלוט בסדר

אפשר להשתמש פשוט בשם:

```text
01 - נושא ראשון
02 - נושא שני
03 - נושא שלישי
```

או:

```text
01 - קטע ראשון.mp3
02 - קטע שני.mp3
```

אין צורך בקובץ `order.json` בגרסה א'.

---

# 17. סריקה רקורסיבית

האלגוריתם הבסיסי:

```text
scan(directory)
│
├── read entries
│
├── sort entries naturally
│
├── for each directory
│      └── scan(directory)
│
├── for each audio file
│      └── create Track
│
└── for each TXT
       └── match to Track
```

אין צורך לדעת מראש כמה רמות קיימות.

---

# 18. Root

תיקיית `/content` עצמה אינה חייבת להופיע למשתמש בשם "content".

ב־JSON יהיה Root לוגי.

לדוגמה:

```json
{
  "type": "root",
  "children": []
}
```

האתר יכול לקרוא לו:

```text
כל הנושאים
```

או פשוט לא להציג שם בכלל.

---

# 19. מודל JSON רעיוני

ה־JSON צריך להיות פשוט ורקורסיבי.

מבנה מוצע:

```json
{
  "schemaVersion": 1,
  "generatedAt": "2026-09-18T10:00:00Z",
  "root": {
    "type": "topic",
    "id": "root",
    "name": "ספריית השמע",
    "path": "",
    "children": []
  }
}
```

---

# 20. Topic

Topic בסיסי:

```json
{
  "type": "topic",
  "id": "topic_xxx",
  "name": "נושא א",
  "path": "נושא א",
  "children": []
}
```

שדות חובה:

```text
type
id
name
path
children
```

לא צריך להכניס עשרות שדות מראש.

---

# 21. Track

Track בסיסי:

```json
{
  "type": "track",
  "id": "track_xxx",
  "title": "01 - פתיחה",
  "audio": "content/נושא א/01 - פתיחה.mp3",
  "format": "mp3",
  "text": "..."
}
```

שדות ליבה:

```text
type
id
title
audio
format
text
```

שדות נוספים אופציונליים בהמשך:

```text
size
duration
modifiedAt
```

---

# 22. טקסט בתוך JSON או בקובץ נפרד

לגרסה הראשונה ההמלצה היא:

> להכניס את תוכן ה־TXT ישירות ל־`library.json`.

כלומר:

```json
{
  "text": "תוכן הטקסט..."
}
```

יתרונות:

- האתר מבצע Fetch אחד.
- אין צורך ב־Fetch נפרד לכל TXT.
- חיפוש בתוך הטקסט קל.
- Deployment פשוט.
- אין צורך לטפל בקבצי TXT בזמן Runtime.

---

# 23. מגבלה אפשרית של JSON גדול

אם בעתיד יהיו:

- אלפי קטעים.
- טקסטים ארוכים מאוד.
- JSON גדול מדי.

אפשר יהיה לפצל:

```text
library-index.json
texts/*.json
```

אבל לא עושים זאת מראש.

גרסה א':

```text
library.json אחד
```

כל עוד הביצועים טובים.

---

# 24. ID של Topic ו־Track

צריך ID כדי לתמוך ב:

- URL.
- Favorites.
- History.
- Resume.

הפתרון הפשוט לגרסה א':

> ID דטרמיניסטי שנגזר מהנתיב היחסי.

למשל:

```text
נושא א/תת נושא/קטע.mp3
```

עובר Normalization + Hash קצר.

דוגמה:

```text
track_7f3a91c2
```

---

# 25. למה לא להשתמש בשם עצמו כ־ID

שם יכול להכיל:

- עברית.
- Spaces.
- תווים מיוחדים.
- `/`.
- שינויים.

לכן URL פנימי ו־Storage יהיו פשוטים יותר עם ID קצר.

---

# 26. המשמעות של שינוי שם/העברה

אם ID נגזר מהנתיב:

```text
rename
או
move
```

יוצרים ID חדש.

התוצאה:

- History ישן לא יזהה את אותו Track.
- Favorite ישן יכול להיעלם.

בגרסה א' זה Tradeoff מקובל בשביל פשטות.

---

# 27. למה לא לבנות Stable-ID מורכב עכשיו

אפשר בעתיד להוסיף:

```text
track.meta.json
```

או מזהה קבוע.

אבל זה ידרוש ממנהל התוכן לנהל עוד קבצים.

זה מנוגד למטרה הראשונית:

> Audio + TXT + Folder בלבד.

לכן בגרסה א':
- Path-based deterministic ID.
- פשוט.
- צפוי.
- ללא Metadata ידני.

---

# 28. Hash

ה־Hash אינו לצורכי אבטחה.

הוא רק כדי ליצור ID:

- קצר.
- דטרמיניסטי.
- URL friendly.

אפשר להשתמש באלגוריתם פשוט ויציב.

אין צורך במנגנון Cryptographic כבד.

---

# 29. Path

ה־JSON ישמור נתיב יחסי.

לדוגמה:

```json
{
  "audio": "content/נושא א/קטע 1.mp3"
}
```

לא לשמור:

```text
C:\Users\...
/home/user/...
```

אין נתיבים מקומיים ב־JSON.

---

# 30. URL Encoding

האתר צריך להשתמש נכון ב־URL Encoding כאשר הנתיב מכיל:

- עברית.
- Spaces.
- Unicode.

ה־JSON עצמו יכול לשמור את הטקסט הטבעי.

אין צורך להפוך ידנית כל שם ל־`%D7...` בזמן יצירת JSON.

---

# 31. Unicode

כל התהליך עובד ב־UTF-8.

דרישות:

- שמות תיקיות בעברית.
- שמות קבצים בעברית.
- TXT בעברית.
- JSON UTF-8.

אין לבצע Transliteration אוטומטי.

---

# 32. Normalization של שמות

לצורך התאמת:

```text
Audio ↔ TXT
```

יש להשתמש בהשוואה עקבית.

מומלץ:

- אותו basename.
- Case insensitive לסיומות.
- Unicode normalization פנימי לצורך השוואה.

אין לבצע:
- שינוי רווחים.
- הסרת punctuation.
- Fuzzy matching.

ההתאמה צריכה להיות פשוטה ודטרמיניסטית.

---

# 33. שני Audio עם אותו Basename

דוגמה:

```text
קטע.mp3
קטע.m4a
קטע.txt
```

זה מצב Ambiguous.

ה־Generator לא יבחר לבד.

התנהגות מומלצת:

- Warning חזק.
- שני Tracks יכולים להיווצר, אבל לא ברור למי TXT שייך.

לכן בגרסה א' עדיף:

> Treat as Error for that basename.

ה־Generator מדווח:

```text
ERROR: multiple audio files share the same basename:
קטע.mp3
קטע.m4a
```

ושני הקבצים לא נכנסים לספרייה עד לתיקון.

---

# 34. Audio זהה בשם בתיקיות שונות

תקין לחלוטין:

```text
/נושא א/פתיחה.mp3
/נושא ב/פתיחה.mp3
```

הנתיב שונה ולכן גם ID שונה.

---

# 35. קבצים כפולים

ה־Generator לא צריך לבצע Content Hash של כל Audio כדי לגלות אם אותו קובץ הועתק פעמיים.

זה Over Engineering לגרסה א'.

אם יש שני קבצים במיקומים שונים:
- הם נחשבים שני Tracks.

---

# 36. Metadata בסיסי

אפשר להוסיף ללא מורכבות:

```text
fileSize
extension
```

באמצעות מערכת הקבצים.

לדוגמה:

```json
{
  "fileSize": 18423321
}
```

זה אופציונלי.

---

# 37. Duration

משך קטע דורש קריאת Metadata של האודיו באמצעות Library או כלי נוסף.

לכן:

- רצוי.
- לא חובה ל־Generator V1.
- לא צריך לעכב את הפרויקט.

אם נבחר Library קטנה ואמינה:
- נוסיף.

אם לא:
- הדפדפן ילמד duration לאחר טעינת metadata של הקטע.

---

# 38. Modified Date

אפשר לקרוא `mtime` מהקובץ.

אבל יש בעיה:

- Git/Copy יכול לשנות תאריכים.
- זה לא תמיד "תאריך הוספה".

לכן לא לבנות "נוספו לאחרונה" על `mtime` כאמת עסקית בלי החלטה מפורשת.

בגרסה א':
- אפשר לשמור `modifiedAt`.
- לא להבטיח שזה "תאריך פרסום".

---

# 39. generatedAt

`library.json` יכיל:

```json
{
  "generatedAt": "..."
}
```

לצרכי:

- Debugging.
- Cache busting.
- להבין מתי האינדקס נוצר.

---

# 40. schemaVersion

חובה לשמור:

```json
{
  "schemaVersion": 1
}
```

למה?

אם בעתיד נשנה JSON:
- האתר יודע איזו גרסה הוא מקבל.
- אפשר לבצע Migration פשוט או להציג שגיאה ברורה.

זה מעט מורכבות עם הרבה ערך.

---

# 41. config של Generator

ה־Generator יכול לקבל Configuration קטן.

לדוגמה:

```json
{
  "contentDirectory": "./content",
  "outputFile": "./data/library.json",
  "audioExtensions": [
    ".mp3",
    ".m4a",
    ".aac",
    ".ogg",
    ".oga",
    ".opus",
    ".webm",
    ".wav",
    ".flac"
  ]
}
```

אבל גם זה לא חייב להיות קובץ נפרד בגרסה הראשונה.

אפשר להתחיל עם Defaults בקוד.

---

# 42. עדיפות לפשטות בהרצה

ה־Generator צריך להיות ניתן להרצה בפקודה אחת.

לדוגמה:

```text
node generate-library.js
```

או בעתיד:

```text
npm run generate
```

לא יותר מזה.

---
# 43. טכנולוגיית Generator

המלצה:

> Node.js script פשוט.

הסיבות:

- עובד טוב עם Filesystem.
- Cross-platform.
- מתאים לפרויקט Web.
- קל להרצה.
- JSON מובנה.
- אין צורך בשרת.

ה־Generator אינו חלק מה־Runtime של האתר.

---

# 44. ללא Build של האתר

הרצת Generator אינה "Build" של האפליקציה במובן של Bundle/Compile.

היא רק:

```text
Scan content
→ Write library.json
```

האתר עצמו נשאר Static.

---

# 45. Output

מבנה מומלץ:

```text
/content
/data
    library.json
/tools
    generate-library.js
/index.html
/app
...
```

---

# 46. Log של Generator

במהלך הרצה צריך להציג Summary ברור.

לדוגמה:

```text
Library generation complete

Topics: 18
Tracks: 247
Texts matched: 231
Tracks without text: 16
Warnings: 2
Errors: 0

Output:
data/library.json
```

---

# 47. Warning מול Error

## Warning

בעיה שאינה מונעת יצירת אתר.

לדוגמה:

```text
Audio without TXT
TXT without Audio
Empty folder
```

## Error

בעיה שבה לא נכון לנחש.

לדוגמה:

```text
Two audio files with same basename in same folder
Cannot read directory
Cannot write output JSON
```

---

# 48. האם Warning נכנס ל־JSON

לא.

Warnings הם מידע למנהל התוכן בזמן Generate.

האתר לא צריך לקבל:

```text
warnings
```

אלא אם בעתיד יש צורך Debug מיוחד.

---

# 49. האם Error עוצר הכול

יש להפריד:

## Error מקומי

למשל:
```text
basename conflict
```

אפשר:
- לדלג על הפריט הבעייתי.
- להמשיך לבנות את שאר הספרייה.
- לסיים עם Exit Code שונה מאפס.

## Error קריטי

למשל:
```text
cannot read content root
cannot write library.json
```

עוצר את התהליך.

---

# 50. Atomic Write

כדי לא להשאיר JSON חצי כתוב:

1. כותבים לקובץ זמני.
2. מסיימים Serialization.
3. מחליפים את `library.json`.

כך אם Generator נכשל באמצע:
- הקובץ התקין הקודם נשאר.

זו הגנה פשוטה ששווה להוסיף.

---

# 51. Pretty JSON

בגרסה הראשונה עדיף שה־JSON יהיה Pretty Printed.

למשל indentation של 2 spaces.

יתרונות:

- קל לבדוק.
- קל לעשות Diff ב־Git.
- קל Debug.

אם בעתיד הגודל משמעותי:
- אפשר Minify.

לא עכשיו.

---

# 52. JSON Validation

אחרי יצירת ה־JSON:

- לבצע `JSON.stringify`.
- לקרוא אותו בחזרה או לפחות לבצע parse validation.
- לוודא Root ו־schemaVersion.

אין צורך ב־JSON Schema Framework מורכב בשלב ראשון.

---

# 53. בדיקת נתיבי Audio

ה־Generator יודע שהקובץ קיים ברגע הסריקה.

לכן כל Audio שנכנס ל־JSON:
- חייב להגיע מקובץ שנמצא בפועל.

זה מצמצם Broken Links.

---

# 54. שמירת הטקסט

TXT נקרא ב־UTF-8.

ה־Generator:
- לא משנה את התוכן.
- לא "מתקן" מילים.
- לא מסיר שורות.
- לא ממיר HTML.
- לא מבצע Markdown parsing.

הוא שומר Text כפי שנכתב.

---

# 55. Line Endings

ה־Generator יכול לנרמל:

```text
CRLF
LF
```

ל־`\n` בתוך JSON.

זה מפשט תצוגה בין מערכות הפעלה.

---

# 56. HTML בתוך TXT

בגרסה א':

TXT הוא Plain Text.

אם כתוב:

```text
<b>טקסט</b>
```

האתר לא אמור לפרש אותו כ־HTML.

זאת החלטת אבטחה ופשטות טובה.

---

# 57. קידוד לא תקין

אם TXT אינו UTF-8 וקריאתו נכשלת:

- Warning/Error עבור אותו Text.
- Track עדיין יכול להיווצר ללא Text.
- כל הספרייה לא נופלת.

---

# 58. Cache Busting

בעיה אפשרית:

GitHub Pages / Browser Cache מציגים `library.json` ישן.

פתרון פשוט:

האתר יכול לטעון:

```text
data/library.json?v=<app-version>
```

או להשתמש ב־`generatedAt`/גרסה.

אין צורך במערכת Hot Reload.

---

# 59. Library Version מול Schema Version

יש להבדיל:

```text
schemaVersion
```

= מבנה JSON.

ו־:

```text
generatedAt
```

= מתי התוכן נוצר.

אין צורך ב־Content Version ידני בגרסה א'.

---

# 60. Search Index

בגרסה א' אין צורך לייצר Search Index נפרד.

האתר יכול לבנות בזיכרון Index קטן מתוך:

- topic.name
- track.title
- track.text

אם בעתיד הנתונים גדלים:
- אפשר להוסיף Search Index ב־Generator.

לא עכשיו.

---

# 61. מועדפים והיסטוריה אינם ב־JSON

`library.json` מתאר תוכן ציבורי בלבד.

לא מכניסים אליו:

- favorites.
- lastPosition.
- history.
- listeningMode.

אלה נתוני משתמש מקומיים בדפדפן.

---

# 62. URL של Track

האתר משתמש ב־ID:

```text
/#/track/track_7f3a91c2
```

ולא בנתיב הפיזי הארוך.

ה־JSON ממפה:

```text
ID → Audio path
```

---

# 63. URL של Topic

אותו עיקרון:

```text
/#/topic/topic_ab12cd34
```

כך ה־Router לא צריך להתמודד עם נתיבים עבריים מורכבים.

---

# 64. שינוי מבנה תיקיות

לאחר:

```text
move folder
rename folder
```

מריצים Generator מחדש.

ה־JSON החדש משקף מיד את המבנה החדש.

אין Migration ידני.

---

# 65. מחיקת קובץ

כאשר Audio נמחק:

- לאחר Generate הוא אינו קיים ב־JSON.
- האתר לא מציג אותו.
- History/Favorites מקומיים שמתייחסים אליו יתעלמו ממנו.

---

# 66. הוספת פורמט חדש בעתיד

הרשימה תהיה מרוכזת במקום אחד.

לדוגמה:

```text
SUPPORTED_AUDIO_EXTENSIONS
```

כדי להוסיף פורמט:
- מוסיפים סיומת.
- לא משנים scanner logic.

---

# 67. תמיכה עתידית ב־Metadata ידני

ייתכן שבעתיד נרצה:

- title שונה מהשם.
- description.
- image.
- tags.
- order מותאם.
- stable ID.

אבל לא מוסיפים Sidecar JSON בגרסה א'.

אם יידרש, ניתן בעתיד לתמוך אופציונלית ב:

```text
קטע.meta.json
```

בלי לשבור את המודל הנוכחי.

---

# 68. תמיכה עתידית ב־Topic Metadata

אותו דבר:

בעתיד אולי:

```text
_topic.json
```

עבור:
- display name.
- description.
- image.
- order.

אבל לא בגרסה א'.

שם התיקייה מספיק.

---

# 69. אין צורך Database

ה־Generator אינו שומר Database.

אין:

- SQLite.
- PostgreSQL.
- MongoDB.

הקבצים עצמם + JSON מספיקים.

---

# 70. אין צורך Watcher בגרסה א'

תהליך העבודה:

```text
add files
↓
run generator
↓
deploy
```

אין צורך שה־Generator ירוץ כל הזמן.

בעתיד אפשר להוסיף Watch Mode אם נוח.

---

# 71. אין צורך GUI ל־Generator

בגרסה א':

```text
command line
```

מספיק.

המטרה היא שיהיה:
- קצר.
- ברור.
- יציב.

---

# 72. מבנה מומלץ של הפרויקט

```text
/
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
│   └── ...
│
├── styles/
│   └── ...
│
└── index.html
```

---

# 73. תהליך העבודה היומיומי

```text
1. מקליטים / מקבלים קובץ שמע.
2. נותנים לו שם ברור.
3. יוצרים TXT בעל אותו שם אם יש טקסט.
4. שמים אותם בנושא המתאים.
5. מריצים Generator.
6. בודקים Summary.
7. מתקנים Warnings/Errors חשובים.
8. Push.
```

זהו.

---

# 74. דוגמה מלאה

קלט:

```text
/content
└── נושא א
    ├── 01 - פתיחה.mp3
    ├── 01 - פתיחה.txt
    └── תת נושא
        ├── 01 - חלק ראשון.m4a
        ├── 01 - חלק ראשון.txt
        └── 02 - חלק שני.mp3
```

פלט רעיוני:

```json
{
  "schemaVersion": 1,
  "generatedAt": "2026-09-18T10:00:00Z",
  "root": {
    "type": "topic",
    "id": "root",
    "name": "ספריית השמע",
    "path": "",
    "children": [
      {
        "type": "topic",
        "id": "topic_x1",
        "name": "נושא א",
        "path": "נושא א",
        "children": [
          {
            "type": "track",
            "id": "track_a1",
            "title": "01 - פתיחה",
            "audio": "content/נושא א/01 - פתיחה.mp3",
            "format": "mp3",
            "text": "..."
          },
          {
            "type": "topic",
            "id": "topic_x2",
            "name": "תת נושא",
            "path": "נושא א/תת נושא",
            "children": [
              {
                "type": "track",
                "id": "track_a2",
                "title": "01 - חלק ראשון",
                "audio": "content/נושא א/תת נושא/01 - חלק ראשון.m4a",
                "format": "m4a",
                "text": "..."
              },
              {
                "type": "track",
                "id": "track_a3",
                "title": "02 - חלק שני",
                "audio": "content/נושא א/תת נושא/02 - חלק שני.mp3",
                "format": "mp3",
                "text": null
              }
            ]
          }
        ]
      }
    ]
  }
}
```

---

# 75. בדיקות חובה ל־Generator

לפני שנחשב אותו מוכן, צריך לבדוק:

## מבנה
- תיקייה אחת.
- 10 רמות תיקיות.
- תיקייה ריקה.
- Track בשורש.
- Topic שמכיל גם Track וגם Topic.

## שמות
- עברית.
- אנגלית.
- Spaces.
- סוגריים.
- מקפים.
- מספרים.
- Unicode.

## Audio
- MP3.
- M4A.
- AAC.
- OGG/OGA.
- Opus.
- WebM.
- WAV.
- FLAC.

## TXT
- התאמה תקינה.
- ללא TXT.
- TXT ללא Audio.
- טקסט רב־שורות.
- UTF-8.

## Conflicts
- MP3 + M4A עם אותו basename.
- שמות זהים בתיקיות שונות.

## Output
- JSON תקין.
- סדר קבוע.
- IDs קבועים בין שתי הרצות זהות.
- Paths יחסיים.
- אין Paths מקומיים.

---

# 76. דטרמיניזם

אותה תיקיית Content ללא שינוי צריכה לייצר:

- אותו סדר.
- אותם IDs.
- אותו מבנה.

`generatedAt` כמובן ישתנה.

זה חשוב ל־Git Diff ולבדיקות.

---

# 77. מה Generator לא עושה

בגרסה א' הוא לא:

- ממיר Audio.
- משפר Audio.
- מנקה רעשים.
- עורך TXT.
- מסנכרן Text לזמן.
- מוריד מידע מהאינטרנט.
- מייצר תמונות.
- מייצר תמלול.
- מתרגם.
- יוצר Playlist ידני.
- מנהל משתמשים.
- עושה Upload.

---

# 78. Acceptance Criteria

ה־Generator נחשב תקין כאשר:

1. ניתן ליצור כל עומק תיקיות.
2. כל תיקייה מופיעה כ־Topic.
3. כל Audio נתמך מופיע כ־Track.
4. same-name TXT משויך נכון.
5. Audio ללא TXT עדיין מופיע.
6. TXT ללא Audio לא מפיל את התהליך.
7. Conflict ברור מדווח ולא מנוחש.
8. שמות בעברית עובדים.
9. Paths ב־JSON יחסיים.
10. JSON תקין וניתן לטעינה.
11. IDs דטרמיניסטיים.
12. סדר דטרמיניסטי.
13. קובץ בעייתי אחד לא מפיל ספרייה שלמה, אלא אם מדובר בשגיאה קריטית.
14. הרצה אחת מייצרת `library.json` מוכן לאתר.
15. אין צורך בעריכת JSON ידנית.

---

# 79. עקרונות פשטות מחייבים

1. Folder = Topic.
2. Audio = Track.
3. Same-name TXT = Text.
4. Scan recursively.
5. Generate one JSON.
6. No manual metadata required.
7. No database.
8. No conversion.
9. No complex schema.
10. No sidecar files unless יהיה צורך אמיתי בעתיד.

---

# 80. החלטות שנשארו פתוחות בכוונה

המסמך אינו מקבע עדיין:

- אלגוריתם Hash מדויק.
- ספריית Node מדויקת.
- האם Duration יחולץ ב־V1.
- האם `text: null` או השדה יושמט.
- האם `path` יישאר ב־Production JSON.
- האם Root יקבל שם גלוי.
- האם `fileSize` יישמר.
- האם `modifiedAt` יישמר.

אלה החלטות implementation קטנות שייסגרו באפיון הטכני.

---

# 81. השלב הבא

השלב הבא הוא:

# מסמך אפיון UX/UI וחוויית ההאזנה

במסמך הבא נגדיר בצורה מלאה:

1. מבנה דף הבית.
2. מבנה מסך Topic.
3. מבנה רשימת Tracks.
4. מסך Track.
5. נגן מלא.
6. Mini Player.
7. מיקום וגודל כל פקד מרכזי.
8. Mobile מול Desktop.
9. איך מוצגים הטקסט והנגן יחד.
10. איך מציגים מצב האזנה כללי.
11. איך המשתמש בוחר:
   - שיר בודד.
   - המשך אוטומטי.
   - בחירה חופשית.
   - ערבוב אוטומטי.
12. איך נראה Repeat.
13. Loading / Buffering / Error.
14. חיפוש.
15. מועדפים.
16. היסטוריה.
17. המשך להאזין.
18. Breadcrumbs וניווט.
19. Visualization שנותן לאודיו חוויה ייחודית.
20. כללי פשטות כדי שהאתר יהיה מרשים אך לא עמוס.

אחריו נעבור ל:

**ארכיטקטורה טכנית → תכנית פיתוח → תכנית בדיקות → Production Checklist.**