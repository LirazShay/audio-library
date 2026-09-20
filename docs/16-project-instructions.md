# ChatGPT Project Instructions

This is the canonical text to paste into ChatGPT Project Instructions for this project.

Copy the content inside the block below.

---

```text
אתה עובד על פרויקט GitHub בשם LirazShay/audio-library.

העיקרון החשוב ביותר: ה-GitHub הוא הזיכרון הקבוע ומקור האמת של הפרויקט, לא היסטוריית הצ'אט. כל צ'אט חדש צריך להיות מסוגל להמשיך את העבודה בלי שהמשתמש יצטרך להדביק סיכום מצ'אט קודם.

בתחילת כל צ'אט שעוסק בפרויקט, ולפני תכנון או שינוי קוד:
1. קרא את AI-START-HERE.md.
2. קרא את CURRENT-STATUS.md.
3. קרא את docs/00-project-index.md.
4. קרא את docs/11-current-implementation.md.
5. קרא את docs/12-development-workflow.md.
6. אחר כך קרא רק את מסמכי האפיון/הקוד הרלוונטיים למשימה הנוכחית.
7. אם מדובר בהחלטה ארכיטקטונית, קרא גם docs/13-decisions-log.md.
8. אם מדובר בבדיקות, Audio, local preview, CI או תקלה, קרא גם docs/14-testing-troubleshooting.md.

אם יש לך גישה ל-GitHub של הפרויקט, השתמש בה ישירות ואל תבקש מהמשתמש לחזור על מידע שכבר נמצא בריפו.

סדר עדיפויות במקרה של סתירה:
1. הקוד וה-runtime data הנוכחיים בריפו.
2. CURRENT-STATUS.md לגבי המצב הפעיל, next action ו-verification.
3. החלטות Accepted ב-docs/13-decisions-log.md.
4. מסמכי האפיון תחת docs/.
5. סיכומים ישנים או מידע מצ'אטים קודמים.

כאשר המשתמש כותב "תמשיך לשלב הבא":
- התקדם בדיוק תת-שלב לוגי אחד מהמצב שמתועד כרגע.
- אל תקפוץ כמה Milestones בבת אחת.
- אם Milestone גדול, פצל אותו ל-Mx.1, Mx.2 וכו'.
- לפני המימוש קבע scope מדויק ומה במפורש לא נכנס לשלב הזה.

לכל שלב פיתוח בצע את המחזור הבא:
1. בדוק את הסטטוס, המסמכים והקוד הנוכחי.
2. הגדר את התת-שלב המדויק.
3. ממש את השינוי.
4. הוסף/עדכן בדיקות אוטומטיות רלוונטיות.
5. הרץ או אמת CI רלוונטי.
6. אם יש כשל, אל תסמן את השלב כגמור עד שתבין ותתקן אותו.
7. עדכן CURRENT-STATUS.md עם מה הושלם ומה הפעולה הבאה.
8. אם התקבלה החלטה ארכיטקטונית/התנהגותית חדשה, עדכן docs/13-decisions-log.md.
9. אם נלמד משהו חשוב מתהליך debugging, עדכן docs/14-testing-troubleshooting.md.
10. אם הארכיטקטורה בפועל השתנתה, עדכן docs/11-current-implementation.md.
11. ודא שלא נשאר מידע קריטי רק בתוך הצ'אט.
12. בצע commit ליחידה הלוגית שהושלמה.
13. דווח למשתמש בקצרה מה בוצע, אילו בדיקות עברו ומה השלב הבא.

לפני סיום סשן משמעותי קרא את docs/15-chat-handoff-protocol.md וודא שהצ'אט הבא יוכל להמשיך בלי recap ידני.

כללי אמת:
- אל תגיד שבדיקה ידנית עברה אם רק automated tests עברו.
- אם manual verification עדיין חסר, כתוב במפורש PENDING.
- אל תניח שתקלה נסגרה רק בגלל שהקוד נראה נכון.
- אם התיעוד סותר את הקוד, בדוק את הקוד ותקן את הצד השגוי במקום להתעלם מהסתירה.

Guardrails ארכיטקטוניים נוכחיים:
- האפליקציה היא static client-side ומפורסמת ב-GitHub Pages.
- מקור תוכן רגיל הוא src/content/.
- src/data/library.json נוצר על ידי Generator ולא אמור להיות מקור עריכה ידני.
- יש Audio/HTMLAudioElement גלובלי יחיד.
- Player State מרכזי.
- Audio Service הוא היחיד שמשנה ישירות את Audio element.
- רכיבי UI, כולל Full Player ו-Mini Player עתידי, שולטים באותו Audio דרך ה-Service.
- ה-Router הנוכחי הוא hash router.
אל תשנה guardrail כזה בלי צורך אמיתי ובלי לתעד החלטה חדשה.

בבדיקה לוקאלית העדף:
tools\update-and-preview.cmd

GitHub הוא מקור האמת בין צ'אטים. אל תתכנן מחדש את המערכת בכל צ'אט.

אל תכתוב "סיימתי" על תת-שלב ביניים. אם המשתמש הגדיר מראש horizon של כמה שלבים וביקש לכתוב "סיימתי" רק בסוף, כתוב זאת רק לאחר שכל ה-horizon הושלם ואומת.
```

---

## Why this prompt stays small

The Project Instructions intentionally contain process and invariants, not the full project state.

Mutable state belongs in:

- `CURRENT-STATUS.md`
- `docs/11-current-implementation.md`
- `docs/13-decisions-log.md`
- `docs/14-testing-troubleshooting.md`

This prevents the Project Instructions from becoming stale every time a milestone advances.

## Maintenance rule

If the Project Instructions themselves need to change:

1. update this file
2. update the text in ChatGPT Project Instructions
3. ensure `tools/documentation-contract.test.js` still passes
