/* i18n — Arabic/English UI layer (Phase 6 — localization).
   - window.t('English text') → Arabic translation when LANG === 'ar' (identity otherwise)
   - Static HTML text is translated by a text-node walk on window load
   - Language toggle is injected into every .topbar; choice persists in localStorage
   - CHAT_SCRIPT_AR mirrors the scripted diagnosis flow with Arabic triggers/replies */
(function () {
  'use strict';

  const LANG_KEY = 'ca_lang';
  const saved = localStorage.getItem(LANG_KEY);
  window.LANG = saved || (((navigator.language || '')).toLowerCase().startsWith('ar') ? 'ar' : 'en');
  window.t = function (s) { return (window.LANG === 'ar' && I18N_AR[s]) ? I18N_AR[s] : s; };

  /* severity badges */
  const SEV_AR = { HIGH: 'مرتفع', MEDIUM: 'متوسط', LOW: 'منخفض', ALL: 'الكل' };
  window.sevLabel = function (s) { return window.LANG === 'ar' ? (SEV_AR[s] || s) : s; };

  /* system labels (English ones; Arabic ones pass through untouched) */
  const SYSTEM_AR = {
    'Ignition / Engine': 'الإشعال / المحرك',
    'Fuel & Air Metering': 'الوقود والهواء',
    'Cooling System': 'نظام التبريد',
    'Emissions': 'الانبعاثات',
    'Diesel Starting': 'تشغيل الديزل',
    'ESP / Steering': 'ESP / التوجيه',
    'ESP / Brakes': 'ESP / الفرامل',
    'HVAC': 'تكييف وتدفئة',
    'Electrical': 'كهرباء',
    'Transmission': 'ناقل الحركة',
    'Engine Timing': 'توقيت المحرك',
    'Boost Control': 'التحكم بالشحن',
    'Network / CAN': 'شبكة / CAN'
  };
  const _t = function (s) { return (window.LANG === 'ar' && (I18N_AR[s] || SYSTEM_AR[s])) ? (I18N_AR[s] || SYSTEM_AR[s]) : s; };
  window.t = function (s) { return _t(s); };

  /* ---------- Arabic dictionary (keyed by exact English source text) ---------- */
  const I18N_AR = {
    /* brand + navigation */
    'Car Assistance': 'مساعد السيارة',
    'Home': 'الرئيسية',
    'Chat': 'المحادثة',
    'Emergency': 'الطوارئ',
    'Back': 'رجوع',

    /* index */
    'Mercedes-Benz B-Class · W245': 'مرسيدس بنز B-Class · W245',
    'Understand what': 'افهم ماذا',
    'your Mercedes is': 'تحاول ميرسيدسك',
    'telling you.': 'أن تقول لك.',
    'Fault codes, symptoms and dashboard photos — explained and cited to documented repair guides. No mechanic knowledge required.': 'أكواد أعطال وأعراض وصور لوحة قيادة — تُشرح وتُسند إلى أدلة إصلاح موثقة. بلا حاجة لأي خبرة ميكانيكية.',
    'Quick search · fault code': 'بحث سريع · كود عطل',
    'Search a code… e.g. P0300': 'ابحث عن كود… مثل P0300',
    'Type a code (like': 'اكتب كودًا (مثل',
    '), a system (like': '، أو نظامًا (مثل',
    ') or a symptom — results appear here instantly.': ') أو عرضًا — النتائج تظهر هنا فورًا.',
    'More ways to start a diagnosis': 'طرق أخرى لبدء التشخيص',
    'I know the fault code': 'أعرف كود العطل',
    'Use the quick search above — or browse the full W245 codebook.': 'استخدم البحث السريع أعلاه — أو تصفح دفتر أكواد W245 كاملًا.',
    'I can describe the symptom': 'أستطيع وصف العَرَض',
    'Tell the assistant what the car is doing, in your own words.': 'قل للمساعد ماذا تفعل السيارة، بكلماتك أنت.',
    'I have a photo of the warning': 'لدي صورة للمبة التحذير',
    'Upload a dashboard shot; the warning is read and mapped to a code.': 'ارفع صورة لوحة القيادة؛ يُقرأ التحذير ويُربط بكود موثق.',
    'One tap to a roadside-assistance call or WhatsApp.': 'بضغطة واحدة: اتصال بمساعدة الطريق أو واتساب.',
    'Technical specifications': 'المواصفات الفنية',
    'Full B150 data — engine, fuel, dimensions, brakes.': 'بيانات B150 كاملة — المحرك، الوقود، الأبعاد، الفرامل.',
    'My garage': 'جراجي',
    'My Garage': 'جراجي',
    'Sign in to save your W245': 'سجّل الدخول لحفظ W245 الخاص بك',
    'Demo vehicle · verified facts': 'سيارة العرض · حقائق موثقة',
    'Mercedes-Benz B-Class (W245), 2005–2011. Petrol M266 engines (B160–B200 Turbo), diesel OM640 CDI (B180/B200 CDI), B170 NGT. 5/6-speed manual or Autotronic CVT. ESP, ABS and traction control standard.': 'مرسيدس بنز B-Class‏ (W245) 2005–2011. محركات بنزين M266 ‏(B160–B200 Turbo)، ديزل OM640 CDI ‏(B180/B200 CDI)، وB170 NGT. جير مانوال 5/6 أو أوتوماتيك CVT. نظاما ESP وABS والتحكم في الجر قياسيان.',

    /* facts strip */
    'Model': 'الموديل',
    'Production': 'الإنتاج',
    'Engines': 'المحركات',
    'Platform': 'المنصة',
    'B-Class (W245)': 'B-Class ‏(W245)',
    '8 variants': '8 إصدارات',
    'Sandwich floor, FWD': 'أرضية ساندويتش، دفع أمامي',

    /* codes page */
    'Fault Codes · W245': 'أكواد الأعطال · W245',
    'Search fault codes… (e.g. P0300)': 'ابحث في أكواد الأعطال… (مثل P0300)',
    'Type a fault code (like': 'اكتب كود عطل (مثل',
    ') or a symptom to search the documented W245 codebook.': ') أو عرضًا للبحث في دفتر أكواد W245 الموثق.',
    'All': 'الكل',
    'High': 'مرتفع',
    'Medium': 'متوسط',
    'Low': 'منخفض',
    'Codebook · Mercedes-Benz B-Class (W245) · 104 codes': 'دفتر الأكواد · مرسيدس بنز B-Class (W245) · 104 كود',
    'Codebook · Mercedes-Benz B-Class (W245)': 'دفتر الأكواد · مرسيدس بنز B-Class (W245)',
    'codes': 'كود',
    'Not found': 'غير موجود',
    'Browse by system': 'تصفح حسب النظام',
    'Common codes': 'أكواد شائعة',
    'Search results · Mercedes-Benz B-Class (W245)': 'نتائج البحث · مرسيدس بنز B-Class (W245)',
    'No documented W245 code matches': 'لا يوجد كود W245 موثق يطابق',
    'Try the chat instead.': 'جرّب المحادثة بدلًا من ذلك.',

    /* code detail */
    'Fault Code': 'كود العطل',
    'Loading…': 'جارٍ التحميل…',
    'Symptoms': 'الأعراض',
    'Possible causes': 'الأسباب المحتملة',
    'Recommended steps': 'الخطوات الموصى بها',
    'Safety warning': 'تحذير سلامة',
    'every answer is cited to a retrieved document.': 'كل إجابة مسندة إلى وثيقة مسترجعة.',
    'Safety-critical. Address this before further driving — the MAYDAY buttons below connect you to help.': 'حرج لسلامتك. عالجه قبل أي قيادة إضافية — أزرار MAYDAY بالأسفل توصلك للمساعدة.',
    'Driveable short-term; schedule a check soon.': 'يمكن القيادة على المدى القصير؛ حدد موعد فحص قريبًا.',
    'Low urgency — safe to book a normal service visit.': 'إلحاح منخفض — يُحجز في الصيانة الدورية بأمان.',
    'is flagged safety-critical for your': 'مُصنَّف عطلًا حرجًا لسلامة سيارتك',
    '. Stop driving and get help now.': '. توقف عن القيادة واطلب المساعدة الآن.',
    'Find nearest workshop': 'أقرب ورشة',
    'Find nearest workshop (locator)': 'أقرب ورشة',
    'Call MAYDAY': 'اتصل MAYDAY',
    'SOURCE: W245 COMMON-FAULTS DIGEST · R-01': 'المصدر: ملخص أعطال W245 الشائعة · R-01',
    'Back to fault codes': 'عودة لأكواد الأعطال',
    'No documented W245 code with this ID.': 'لا يوجد كود W245 موثق بهذا المُعرّف.',
    'Browse the list': 'تصفح القائمة',
    'View diagnosis': 'عرض التشخيص',

    /* chat */
    'Diagnosis Assistant': 'مساعد التشخيص',
    'Describe what the car is doing…': 'اوصف ماذا تفعل السيارة…',
    'Send': 'إرسال',
    'Attach a photo': 'أرفق صورة',
    'Engine shakes at idle': 'المحرك يهتز في الواقف',
    'Check engine light flashing': 'لمبة الشيك تومض',
    'Long cranking': 'الاستارت يتأخر',
    'Blower only on max': 'المروحة على السرعة القصوى فقط',
    'Check engine light is flashing': 'لمبة الشيك تومض',
    'Long cranking before start': 'الاستارت يتأخر قبل الإشعال',
    'Blower only works on max speed': 'المروحة تعمل على السرعة القصوى فقط',
    'Find workshop': 'أقرب ورشة',
    'Try another symptom': 'جرّب عرضًا آخر',
    'Safety warning.': 'تحذير سلامة.',
    'This fault is flagged safety-critical. Stop driving and get help.': 'هذا العطل مُصنَّف حرجًا لسلامتك. توقف عن القيادة واطلب المساعدة.',
    '· sent for vision analysis': '· أُرسلت لتحليل الرؤية',
    'Vision analysis (demo): reading the dashboard image… detected a <b>flashing engine-shaped warning lamp</b> with amber-to-red colouring.': 'تحليل الرؤية (تجريبي): تُقرأ صورة اللوحة… تم رصد <b>لمبة محرك على شكل تحذير تومض</b> بلون عنبري يتجه للأحمر.',
    'The detected lamp maps to a documented W245 fault code:\n\n<b>P0300</b> — Random/Multiple Cylinder Misfire Detected · severity <b>HIGH</b>.': 'اللمبة المُرصودة ترتبط بكود W245 موثق:\n\n<b>P0300</b> — تشويش عشوائي/متعدد في الأسطوانات · الخطورة <b>مرتفعة</b>.',

    /* mayday */
    'MAYDAY · Roadside Assistance': 'MAYDAY · مساعدة الطريق',
    'Get help now.': 'اطلب المساعدة الآن.',
    'If the diagnosis flagged brakes, steering or fuel as safety-critical, stop driving. One tap below connects you to help.': 'إذا وسم التشخيص الفرامل أو التوجيه أو الوقود بأنها حرجة للسلامة، فتوقف عن القيادة. ضغطة واحدة بالأسفل توصلك للمساعدة.',
    'Call MAYDAY — Roadside Assistance': 'اتصل MAYDAY — مساعدة الطريق',
    'WhatsApp MAYDAY': 'واتساب MAYDAY',
    'While you wait': 'أثناء الانتظار',
    'Nearest workshops': 'أقرب الورش',
    'Sorted by real distance from your position': 'مرتبة بمسافة حقيقية من موقعك',
    'Browse fault codes': 'تصفح أكواد الأعطال',
    'Check severity before deciding to drive': 'افحص الخطورة قبل أن تقرر القيادة',

    /* photo */
    'Photo Diagnosis': 'تشخيص بالصورة',
    'Tap to add a dashboard photo': 'اضغط لإضافة صورة لوحة القيادة',
    'Demo mode: a mock warning-light image is analysed by the vision pipeline.': 'وضع تجريبي: تُحلَّل صورة لمبة تحذير تجريبية عبر مسار الرؤية.',
    'Reading dashboard… detecting warning lamps and text.': 'تُقرأ اللوحة… تُرصد لمبات التحذير والنصوص.',
    'Vision result · mock VLM': 'نتيجة الرؤية · VLM تجريبي',
    'Detected: flashing warning symbol': 'مُرصد: رمز تحذير يومض',
    'Engine-shaped lamp · flashing · amber-to-red': 'لمبة بشكل محرك · تومض · عنبري إلى أحمر',
    'Mapped to a documented W245 fault code. The vision result is passed to the diagnosis pipeline with the same source-citation rule as text.': 'مرتبط بكود W245 موثق. نتيجة الرؤية تُمرر إلى مسار التشخيص بنفس قاعدة الاستشهاد بالمصدر كالنص.',
    'Linked diagnosis': 'التشخيص المرتبط',
    'Find nearest workshop (photo)': 'أقرب ورشة',
    'Six documented Cairo workshops, sorted by distance': 'ست ورش موثقة في القاهرة، مرتبة بالمسافة',
    'Analyse another photo': 'حلل صورة أخرى',

    /* locator */
    'Service Locator': 'محدد الخدمة',
    'Downtown, Cairo (demo position)': 'وسط البلد، القاهرة (موقع تجريبي)',
    'Nearest workshops · sorted by distance': 'أقرب الورش · مرتبة بالمسافة',
    'Demo mode: distances are computed from a mock position using the haversine formula — the same service the live Service Locator will perform through the maps integration.': 'وضع تجريبي: تُحسب المسافات من موقع تجريبي بمعادلة haversine — نفس الخدمة التي سيؤديها محدد الخدمة الحي عبر تكامل الخرائط.',
    'km': 'كم',
    'Showing nearest workshops for': 'أقرب الورش للكود',
    ' — call ahead and mention the code.': ' — اتصل مسبقًا واذكر الكود.',

    /* auth */
    'Sign in': 'تسجيل الدخول',
    'Create account': 'إنشاء حساب',
    'Sign in to save your W245 and get diagnoses linked to your car.': 'سجّل الدخول لحفظ W245 والحصول على تشخيص مرتبط بسيارتك.',
    'Email': 'البريد الإلكتروني',
    'Password': 'كلمة المرور',
    'Password (8+ characters)': 'كلمة المرور (8+ حروف)',
    'Display name': 'الاسم الظاهر',
    'you@example.com': 'you@example.com',
    'Requires the live backend (Supabase). Run it locally with': 'يتطلب باك إند حي (Supabase). شغّله محليًا بـ',
    'and set': 'وضع',
    '— see README.md.': '— راجع README.md.',

    /* garage */
    'Signed in as': 'مسجل الدخول باسم',
    'Vehicles': 'السيارات',
    'Add your W245': 'أضف W245 الخاص بك',
    'Model year': 'سنة الموديل',
    'Engine': 'المحرك',
    'Select…': 'اختر…',
    'Add to my garage': 'أضف إلى جراجي',
    'Demo scope: Mercedes-Benz B-Class (W245) 2005–2011 — the seeded codebook matches this model.': 'نطاق العرض: مرسيدس بنز B-Class (W245) 2005–2011 — دفتر الأكواد المُعبأ يطابق هذا الموديل.',
    'Sign out': 'خروج',
    'Garage empty — add your W245 below.': 'الجراج فارغ — أضف W245 بالأسفل.',
    'Sign in to view your garage': 'سجّل الدخول لعرض جراجك',
    'Create an account or sign in': 'أنشئ حسابًا أو سجّل الدخول',
    'engine not specified': 'المحرك غير محدد',
    'no API configured': 'لا يوجد API مضبوط',
    'not signed in': 'غير مسجل الدخول',
    'You are not signed in.': 'أنت غير مسجل الدخول.',
    'Saved to your garage ✓': 'حُفظ في جراجك ✓',
    'vehicle(s) synced from the live database.': 'سيارة متزامنة من قاعدة البيانات الحية.',
    'Session expired — sign in again.': 'انتهت الجلسة — سجّل الدخول من جديد.',
    'Backend not configured — set localStorage["api_base"] (see README).': 'الباك إند غير مضبوط — اضبط localStorage["api_base"] (راجع README).',

    /* specs */
    'Technical Specifications': 'المواصفات الفنية',
    'VEHICLE FACTS': 'حقائق السيارة',
    'Power': 'القوة',
    'Torque': 'العزم',
    'Top speed': 'السرعة القصوى',
    'Fuel': 'الوقود',
    '0–100 km/h': '0–100 كم/س',
    'Petrol': 'بنزين',
    'Engine type · layout': 'نوع المحرك · الترتيب',
    'Displacement': 'سعة المحرك',
    'Bore × stroke': 'قطر × شوط',
    'Valves': 'الصمامات',
    'Compression ratio': 'نسبة الانضغاط',
    'Aspiration': 'الشحن',
    'Inline 4 · transverse, front': '4 سلندر خطي · عرضي، أمامي',
    '8 valves': '8 صمامات',
    'Naturally aspirated': 'سحب طبيعي'
  };
  window.I18N_AR = I18N_AR;

  /* ---------- static-text walker (runs after app.js renders) ---------- */
  function walk() {
    if (window.LANG !== 'ar') return;
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const n = walker.currentNode;
      const raw = n.nodeValue;
      const key = raw.trim();
      if (!key) continue;
      const ar = I18N_AR[key];
      if (!ar) continue;
      const lead = raw.slice(0, raw.length - raw.trimStart().length);
      const trail = raw.slice(raw.trimEnd().length);
      n.nodeValue = lead + ar + trail;
    }
    document.querySelectorAll('input[placeholder]').forEach(inp => {
      const p = inp.getAttribute('placeholder').trim();
      if (I18N_AR[p]) inp.setAttribute('placeholder', I18N_AR[p]);
    });
    document.querySelectorAll('[aria-label="Back"]').forEach(el => el.setAttribute('aria-label', 'رجوع'));
  }
  window.i18nWalk = walk;

  function applyDir() {
    document.documentElement.lang = window.LANG;
    document.documentElement.dir = window.LANG === 'ar' ? 'rtl' : 'ltr';
  }

  /* ---------- topbar language toggle (injected on every page) ---------- */
  function injectToggle() {
    const bar = document.querySelector('.topbar');
    if (!bar || document.getElementById('lang-toggle')) return;
    const btn = document.createElement('button');
    btn.id = 'lang-toggle';
    btn.className = 'chip-btn';
    btn.style.cssText = 'margin-inline-start:auto;font-size:11px;padding:6px 12px;flex-shrink:0';
    btn.textContent = window.LANG === 'ar' ? 'English' : 'عربي';
    btn.addEventListener('click', () => {
      localStorage.setItem(LANG_KEY, window.LANG === 'ar' ? 'en' : 'ar');
      location.reload();
    });
    bar.appendChild(btn);
  }

  window.addEventListener('load', () => {
    applyDir();
    injectToggle();
    walk();
  });
  applyDir();
})();

/* ---------- Arabic chat script (mirrors CHAT_SCRIPT in data.js) ----------
   Rules match Arabic free text first, then the English chip phrases as
   fallback so the quick chips keep routing in AR mode. Replies are Arabic;
   codes and severity stay universal (P0300…). Cites use an Arabic source label. */
window.CHAT_SCRIPT_AR = {
  greeting: 'اوصف ماذا تفعل السيارة. مثلًا: «المحرك يهتز عند الإشارة» أو «لمبة الشيك تومض».',
  quickChips: ['المحرك يهتز في الواقف', 'لمبة الشيك تومض', 'الاستارت يتأخر قبل الإشعال', 'المروحة تعمل على السرعة القصوى فقط'],
  rules: [
    {
      match: /(يهتز|اهتزاز|يرجف|تشعث|متقطع|مش دايم|shake|misfire|rough|vibrat)/i,
      reply: 'اهتزاز في الواقف مع لمبة شيك تومض يشير إلى تشويش (Misfire) في المحرك. في W245 الخاص بك السبب الأشهر هو بواجي تالفة أو كويل إشعال في محركات البنزين M266، أو انسداد فلاب المانيفولد.\n\nالتشخيص: **P0300 — تشويش عشوائي/متعدد في الأسطوانات** · الخطورة مرتفعة.',
      code: 'P0300',
      cite: 'المصدر: ملخص أعطال W245 الشائعة · R-01'
    },
    {
      match: /(تومض|يومض|وميض|لمبة الشيك|لمبة المحرك|شيك|check|flash)/i,
      reply: 'لمبة الشيك وهي تومض تعني تشويشًا نشطًا قد يتلف الكاتاليزور. خفف الحمل وافحص السيارة الآن. الكود الأرجح المسجل هو **P0300**.\n\nالتشخيص: **P0300 — تشويش عشوائي/متعدد في الأسطوانات** · الخطورة مرتفعة.',
      code: 'P0300',
      cite: 'المصدر: ملخص أعطال W245 الشائعة · R-01'
    },
    {
      match: /(استارت|إستارت|كرانك|تأخر|طويل|بطيء|بطء|crank|start)/i,
      reply: 'استارت طويل في ديزل W245 (OM640 CDI) يعني غالبًا أعطال بواجي التسخين (الشمع)، وفي البنزين قد يكون من موقّع الكام. كلاهما نمط موثق في W245.\n\nالأرجح: **P0670 — وحدة تحكم بواجي التسخين** (ديزل) · الخطورة متوسطة.',
      code: 'P0670',
      cite: 'المصدر: ملخص مشاكل التشغيل الديزل · R-06'
    },
    {
      match: /(مروحة|تكييف|تدفئة|هواء|بخاخ|blower|fan|a\/c|air)/i,
      reply: 'مروحة تعمل على السرعة القصوى فقط هي العطل الكلاسيكي لمقاومة المروحة (Blower Resistor) في W245 — إصلاح رخيص وموثق جيدًا.\n\nالتشخيص: **B1048 — مقاومة موتور المروحة** · الخطورة منخفضة.',
      code: 'B1048',
      cite: 'المصدر: ملخص التكييف والتدفئة HVAC · R-08'
    },
    {
      match: /(esp|abs|فرامل|بريك|توجيه|مقو|زاوية|warn|brake|steer)/i,
      reply: 'ظهور لمبات ESP/ABS معًا في W245 سببه غالبًا حساس زاوية التوجيه الذي يحتاج معايرة — خاصة بعد فصل البطارية. الفرامل طبيعية في هذه الحالة، لكن سلوك ESP يجب التعامل معه بجدية.\n\nالتشخيص: **C1095 — حساس زاوية التوجيه** · الخطورة مرتفعة.',
      code: 'C1095',
      cite: 'المصدر: ملخص ESP وإلكترونيات الشاسيه · R-07'
    },
    {
      match: /(حرارة|ترموستات|تسخين|درجة|تبرد|رادياتير|heat|thermostat|temp)/i,
      reply: 'إذا كانت الحرارة لا تصل إلى 90°C والتدفئة داخل السيارة ضعيفة، فالترموستات عالق مفتوحًا — قطعة تآكل شائعة جدًا في محرك M266.\n\nالتشخيص: **P0128 — ترموستات ماء التبريد** · الخطورة منخفضة.',
      code: 'P0128',
      cite: 'المصدر: ملخص نظام التبريد · R-03'
    }
  ],
  fallback: 'لم أستطع ربط ذلك بنمط عطل موثق في W245 بثقة كافية، ولن أخمّن. جرّب وصف المشكلة بصيغة أخرى، أو تصفح قائمة أكواد الأعطال، أو استخدم مدخل الصورة لقراءة لمبة تحذير من لوحة القيادة.'
};
