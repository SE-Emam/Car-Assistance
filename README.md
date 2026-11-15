# Car Assistance — App (المرحلة التنفيذية)

مجلد التطبيق بعد اعتماد الوثيقة المعمارية (SE209). الواجهات معتمدة ✅، وهذه المرحلة تبني الباك إند.

## الهيكل

```
Car-Assistance-App/
├── docs/            WORK-PLAN.md (خطة معتمدة) · DESIGN-SYSTEM.md (نظام التصميم معتمد)
├── demo/            الواجهات المعتمدة (8 صفحات Mobile-First) — تعمل بلا خادم
│   └── specs.html   كارت المواصفات الشاملة (W245 B150 — من ultimatespecs.com)
├── database/        01-schema.sql + 02-seed-w245.sql (Supabase: pgvector + RLS + طابور)
├── api/             دوال Serverless (JavaScript/Node.js) — البوابة الوحيدة للحركة
│   ├── codes.js           GET  /api/codes?q=&severity=
│   ├── codes-detail.js    GET  /api/codes/{code}   (+ دليل الإصلاح)
│   ├── workshops.js       GET  /api/workshops?lat=&lng=
│   ├── chat.js            POST /api/chat           (LLM Gateway + مسار مكتوب)
│   ├── image-jobs.js      POST /api/image-jobs     (طابور VLM)
│   ├── auth-register.js   POST /api/auth-register  (Supabase Auth)
│   ├── auth-login.js      POST /api/auth-login
│   ├── vehicles.js        GET/POST /api/vehicles   (جراجي — bearer token)
│   ├── rag.js             POST /api/rag            (pgvector / keyword)
│   ├── ingest.js          POST /api/ingest         (تضمين 475 مقطع — admin)
│   ├── specs.js           GET  /api/specs          (كارت المواصفات الشاملة)
│   └── health.js          GET  /api/health
├── api/_lib/        db.js · auth.js · http.js · retrieve.js · seed.js
├── local-server.js  خادم تطوير محلي يوجّه /api/* لنفس الدوال
├── openapi.yaml     عقد API (مصدر الحقيقة للفرق — تُعلن قبل الكود)
└── scripts/         sync-seed.js · test-api.js
```

## تشغيل سريع (بلا أي إعداد)

```bash
npm start                 # خادم محلي على :3000 — وضع seed تلقائيًا
npm run test:api          # 11 اختبار smoke
```

افتح الديمو ووصله بالـ API (اختياري): في كونسول المتصفح
`localStorage.setItem('api_base','http://localhost:3000')` ثم حدّث الصفحة.
بدون ذلك يعمل الديمو من البيانات المدمجة (fallback صامت).

## التشغيل الحي (Supabase)

1. نفّذ `database/01-schema.sql` ثم `02-seed-w245.sql` في SQL Editor
2. اضبط متغيرات البيئة:
   - `SUPABASE_URL` · `SUPABASE_SERVICE_ROLE_KEY` (سري — باك إند فقط)
   - `LLM_API_URL` + `LLM_API_KEY` (واجهة LLM المجانية — اختياري؛ بدونها الشات مكتوب)
   - `RATE_LIMIT_PER_MIN` (افتراضي 30)
3. عند وجودها، كل Endpoints تتحول تلقائيًا لـ Supabase (header ‏`X-Data-Mode: supabase`)

## تحديث البيانات

`data.js` في الديمو هو **المصدر الواحد** (104 كود عطل). مسارات المزامنة:

```bash
npm run sync-seed   # يولّد api/_lib/seed.js + knowledge.js من data.js — idempotent
npm run sync-sql    # يولّد القسم الإضافي في database/02-seed-w245.sql (أكواد + أدلة + مقاطع معرفة)
```

- `api/_lib/knowledge.js` — منحنى معرفة الإصلاح المنظم (121 مقطع: فيوزات، CVT، تكييف، حساسات…)
  يغذي خدمة الاسترجاع ومسار ingest. يُعاد توليده تلقائيًا إذا وُجد مجلد مصادر محلي، وإلا يُستخدم كما هو.
- `npm run merge-rag` — أداة دمج اختيارية لمصادر بيانات خارجية (متاحة محليًا فقط).

## النشر

GitHub → Vercel (مجلد `api/` يُكتشف تلقائيًا كدوال serverless بـ JavaScript (Node.js)).
الديمو يستضاف كصفحات ثابتة. الفريق لا يدير أي خادم.
