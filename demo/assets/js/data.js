/* ============================================================
   Car Assistance — demo data (mirror of database/02-seed-w245.sql)
   Mercedes-Benz B-Class (W245) 2005–2011
   ============================================================ */

const VEHICLE = {
  model: 'Mercedes-Benz B-Class (W245)',
  years: '2005 – 2011',
  platform: 'Front-wheel drive, sandwich floor construction',
  engines: [
    'B160 · M266.940 · 1.5L petrol (95 hp)',
    'B170 · M266.920 · 1.7L petrol (116 hp)',
    'B180 · M266.960 · 1.8L petrol (109 hp)',
    'B200 · M266.960 · 2.0L petrol (136 hp)',
    'B200 Turbo · M266.980 · 2.0L petrol (193 hp)',
    'B180 CDI · OM640 · 2.0L diesel (109 hp)',
    'B200 CDI · OM640 · 2.0L diesel (140 hp)',
    'B170 NGT · M266 E20 NGT · bi-fuel petrol/CNG'
  ],
  transmission: '5- or 6-speed manual · Autotronic CVT',
  safety: 'ESP, ABS and traction control standard on all models'
};

const SEV = { HIGH: 'HIGH', MEDIUM: 'MEDIUM', LOW: 'LOW' };

const FAULT_CODES = [
  {
    code: 'P0300', name: 'Random/Multiple Cylinder Misfire Detected',
    severity: SEV.HIGH, system: 'Ignition / Engine',
    symptoms: ['Rough idle and vibration', 'Flashing malfunction indicator lamp', 'Loss of power under load', 'Fuel smell from exhaust'],
    causes: ['Worn spark plugs or ignition coils (M266 engines)', 'Vacuum leak in intake tract', 'Low fuel pressure', 'Sticking manifold flap (common on W245 petrol)'],
    dangerous: true,
    guide: {
      title: 'Misfire diagnosis — W245 petrol (M266)',
      steps: [
        'Read the freeze frame to identify which cylinder(s) misfired.',
        'Inspect and, if due, replace spark plugs (NGK/Bosch spec for M266).',
        'Swap the suspect ignition coil with another cylinder; see if the misfire follows it.',
        'Inspect vacuum hoses and the intake manifold flap for leaks or sticking.',
        'Clear the code and re-test drive; if it returns, check fuel pressure.'
      ],
      source: 'Repair guide R-01 · W245 common-faults digest'
    }
  },
  {
    code: 'P0171', name: 'System Too Lean (Bank 1)',
    severity: SEV.MEDIUM, system: 'Fuel & Air Metering',
    symptoms: ['Hesitation on cold start', 'High long-term fuel trim values', 'Occasional lean-mixture misfire'],
    causes: ['Vacuum leak (intake boot, PCV hose)', 'Dirty MAF sensor (P0101 companion)', 'Weak fuel pump or clogged filter'],
    dangerous: false,
    guide: {
      title: 'Lean mixture — air/vacuum check',
      steps: [
        'Visually inspect intake boot and all vacuum hoses for cracks (heat-brittle on older W245).',
        'Clean the MAF sensor with dedicated cleaner; compare MAF reading with spec.',
        'Check long-term fuel trim at idle and at 2500 rpm (lean at both = delivery; lean at idle only = vacuum).',
        'If trims normalise after a smoke test, repair the leaking hose and re-test.'
      ],
      source: 'Repair guide R-02 · Fuel & air metering digest'
    }
  },
  {
    code: 'P0101', name: 'MAF Sensor Circuit Range/Performance',
    severity: SEV.MEDIUM, system: 'Fuel & Air Metering',
    symptoms: ['Jerky acceleration', 'Hesitation on throttle tip-in', 'CVT shift quality complaints'],
    causes: ['Contaminated MAF hot film', 'Torn intake boot after MAF', 'Wiring/connector corrosion'],
    dangerous: false,
    guide: {
      title: 'MAF sensor service — W245',
      steps: [
        'Inspect the intake duct between MAF and throttle for tears.',
        'Clean the MAF hot film with MAF-safe cleaner; never touch the film.',
        'Compare live MAF g/s at idle against factory spec; replace if far off.',
        'Clear codes and verify fuel trims return to ±5%.'
      ],
      source: 'Repair guide R-02 · Fuel & air metering digest'
    }
  },
  {
    code: 'P0128', name: 'Coolant Thermostat (Below Regulating Temperature)',
    severity: SEV.LOW, system: 'Cooling System',
    symptoms: ['Engine never reaches 90°C', 'Weak cabin heating', 'Higher fuel consumption'],
    causes: ['Thermostat stuck open (classic M266 wear item)', 'Low coolant', 'Coolant temperature sensor drift'],
    dangerous: false,
    guide: {
      title: 'Thermostat replacement',
      steps: [
        'Confirm with live data: coolant stuck below 80°C after 15 min of driving.',
        'Drain coolant and replace the thermostat with gasket.',
        'Refill and bleed the cooling system per W245 procedure.',
        'Verify 87–95°C reached and held on a test drive.'
      ],
      source: 'Repair guide R-03 · Cooling system digest'
    }
  },
  {
    code: 'P0410', name: 'Secondary Air Injection System Malfunction',
    severity: SEV.LOW, system: 'Emissions',
    symptoms: ['Code appears on cold starts', 'Occasional cold-start roughness', 'Malfunction lamp with no driveability loss'],
    causes: ['Failed secondary air pump', 'Stuck check valve (moisture corrosion)', 'Blocked or cracked air hoses'],
    dangerous: false,
    guide: {
      title: 'Secondary air system check',
      steps: [
        'Listen for the pump running 20–60 s after a cold start.',
        'Inspect the combination valve for moisture corrosion (common failure).',
        'Test pump output and hoses for blockage.',
        'Replace the failed pump or valve; clear code and re-test cold start.'
      ],
      source: 'Repair guide R-04 · Emissions digest'
    }
  },
  {
    code: 'P2004', name: 'Intake Manifold Runner Control Stuck Open',
    severity: SEV.MEDIUM, system: 'Fuel & Air Metering',
    symptoms: ['Check-engine lamp with rough idle', 'Loss of low-end torque', 'Rattling from intake manifold'],
    causes: ['Sticking manifold swirl/flap actuator (known M266 issue)', 'Carbon build-up on flap linkage', 'Failed actuator motor'],
    dangerous: false,
    guide: {
      title: 'Intake manifold flap service',
      steps: [
        'Access the manifold flap linkage; check for free movement and carbon deposits.',
        'Clean the flap and linkage; verify the actuator rod moves freely.',
        'If the actuator motor is dead, replace the flap unit.',
        'Clear codes and confirm the flap cycles on a live-data test.'
      ],
      source: 'Repair guide R-05 · Manifold & induction digest'
    }
  },
  { code: 'P0670', name: 'Glow Plug Control Module (Cylinder 1–4)', severity: SEV.MEDIUM, system: 'Diesel Starting', symptoms: ['Long cranking on cold diesel starts', 'White smoke at start', 'Glow-plug lamp flashing'], causes: ['Failed glow plug control module (OM640)', 'Open-circuit glow plug harness'], dangerous: false, guide: { title: 'Glow plug module — OM640 CDI', steps: ['Measure glow plug resistance at the module connector (spec ~0.5–2 Ω).', 'Test module output during a cold start.', 'Replace the failed module or harness section.', 'Verify quick cold start after replacement.'], source: 'Repair guide R-06 · Diesel starting digest' } },
  { code: 'P0671', name: 'Cylinder 1 Glow Plug Circuit', severity: SEV.LOW, system: 'Diesel Starting', symptoms: ['Slightly longer cold start', 'Single-cylinder glow fault logged'], causes: ['Failed cylinder-1 glow plug', 'Corroded connector at the plug'], dangerous: false, guide: { title: 'Glow plug — cylinder 1', steps: ['Remove the engine cover for access to cylinder 1 plug.', 'Test resistance; replace if out of spec.', 'Apply anti-seize and refit; clear codes.'], source: 'Repair guide R-06 · Diesel starting digest' } },
  { code: 'P0672', name: 'Cylinder 2 Glow Plug Circuit', severity: SEV.LOW, system: 'Diesel Starting', symptoms: ['Extended cranking in cold weather'], causes: ['Failed cylinder-2 glow plug'], dangerous: false, guide: { title: 'Glow plug — cylinder 2', steps: ['Access cylinder 2 glow plug.', 'Test resistance; replace if open or shorted.', 'Clear codes and re-test cold start.'], source: 'Repair guide R-06 · Diesel starting digest' } },
  { code: 'P0673', name: 'Cylinder 3 Glow Plug Circuit', severity: SEV.LOW, system: 'Diesel Starting', symptoms: ['Extended cranking in cold weather'], causes: ['Failed cylinder-3 glow plug'], dangerous: false, guide: { title: 'Glow plug — cylinder 3', steps: ['Access cylinder 3 glow plug.', 'Test resistance; replace if out of spec.', 'Clear codes and re-test.'], source: 'Repair guide R-06 · Diesel starting digest' } },
  { code: 'P0674', name: 'Cylinder 4 Glow Plug Circuit', severity: SEV.LOW, system: 'Diesel Starting', symptoms: ['Extended cranking in cold weather'], causes: ['Failed cylinder-4 glow plug'], dangerous: false, guide: { title: 'Glow plug — cylinder 4', steps: ['Access cylinder 4 glow plug (closest to belt side).', 'Test resistance; replace if out of spec.', 'Clear codes and re-test.'], source: 'Repair guide R-06 · Diesel starting digest' } },
  { code: 'C1095', name: 'Steering Angle Sensor Implausible Signal', severity: SEV.HIGH, system: 'ESP / Steering', symptoms: ['ESP/ABS warning lamps on', 'ESP intervenes unnecessarily', 'Steering wheel off-centre reading'], causes: ['Steering angle sensor out of calibration (known W245 issue after battery disconnect)', 'Clockspring fault'], dangerous: true, guide: { title: 'Steering angle sensor calibration', steps: ['Perform the documented steering-angle zero calibration with the car on level ground.', 'Turn the steering lock-to-lock and back to centre per the procedure.', 'Clear codes; ESP/ABS lamps should extinguish.', 'If signals remain implausible, inspect the clockspring before replacing the sensor.'], source: 'Repair guide R-07 · ESP & chassis electronics digest' } },
  { code: 'C1201', name: 'ESP Hydraulic Unit Malfunction', severity: SEV.HIGH, system: 'ESP / Brakes', symptoms: ['ABS/ESP lamps on together', 'Pedal feedback abnormal'], causes: ['Hydraulic unit internal fault', 'Low brake fluid'], dangerous: true, guide: { title: 'ESP hydraulic unit assessment', steps: ['Check brake fluid level and top up to spec if low.', 'Read extended ESP fault memory for the sub-code.', 'Professional evaluation required — hydraulic unit replacement is a workshop task.'], source: 'Repair guide R-07 · ESP & chassis electronics digest' } },
  { code: 'B1048', name: 'Blower Motor Resistor (Air Conditioning)', severity: SEV.LOW, system: 'HVAC', symptoms: ['Blower works only on highest speed', 'No blower at all', 'Intermittent cabin airflow'], causes: ['Failed blower resistor pack (very common W245 fault)', 'Worn blower motor brushes'], dangerous: false, guide: { title: 'Blower resistor replacement', steps: ['Remove the passenger-side under-dash trim for resistor access.', 'Unplug and test the resistor pack; replace if open on any stage.', 'Check the blower motor brushes while the unit is exposed.', 'Reassemble and verify all blower speeds.'], source: 'Repair guide R-08 · HVAC & comfort digest' } },
  { code: 'B1104', name: 'Battery / SAM Control Module Fault', severity: SEV.MEDIUM, system: 'Electrical', symptoms: ['Random electrical glitches', 'Battery warning', 'Slow cranking after short trips'], causes: ['Weak or aged auxiliary battery', 'SAM module corroded connectors', 'Parasitic drain'], dangerous: false, guide: { title: 'Battery & SAM health check', steps: ['Load-test the main and auxiliary batteries; replace weak units.', 'Inspect SAM connectors under the dash for corrosion or water ingress.', 'Perform a parasitic-draw test if the battery drains overnight.', 'Clear codes and re-check over a week of driving.'], source: 'Repair guide R-09 · Electrical & SAM digest' } },
  { code: 'P0562', name: 'System Voltage Low', severity: SEV.MEDIUM, system: 'Electrical', symptoms: ['Dim lights at idle', 'Multiple warning lamps at once', 'Hard starts'], causes: ['Ageing battery (common after 5+ years)', 'Alternator undercharging', 'Corroded ground strap'], dangerous: false, guide: { title: 'Charging system diagnosis', steps: ['Measure resting battery voltage (≥ 12.4 V healthy).', 'Measure charging voltage at idle: 13.8–14.6 V expected.', 'Inspect and clean the engine ground strap.', 'Replace the battery or alternator per findings.'], source: 'Repair guide R-09 · Electrical & SAM digest' } },
  { code: 'P0501', name: 'Vehicle Speed Sensor Range/Performance', severity: SEV.MEDIUM, system: 'Transmission', symptoms: ['Speedometer erratic', 'CVT holds gears oddly', 'Cruise control inoperative'], causes: ['Wheel speed sensor fault', 'Wiring to ABS unit'], dangerous: false, guide: { title: 'Vehicle speed signal diagnosis', steps: ['Compare all four wheel-speed signals on live data.', 'Replace the sensor that drops out or reads implausibly.', 'Inspect wiring at the affected corner for chafe.', 'Clear codes and road-test.'], source: 'Repair guide R-10 · Transmission & driveline digest' } },
  { code: 'P0700', name: 'Transmission Control System (Autotronic CVT)', severity: SEV.MEDIUM, system: 'Transmission', symptoms: ['CVT jerks or flares', 'Limp-home mode', 'Gear indicator flashing'], causes: ['CVT fluid degradation (needs dedicated CVT fluid)', 'Valve body wear', 'Overheating CVT'], dangerous: false, guide: { title: 'Autotronic CVT health check', steps: ['Read the transmission control unit sub-codes (P0700 is a pointer).', 'Check CVT fluid level and condition; use only the specified fluid.', 'If fluid is degraded, service it and re-test.', 'Persistent sub-codes require a transmission specialist evaluation.'], source: 'Repair guide R-10 · Transmission & driveline digest' } },
  { code: 'P0030', name: 'HO2S Heater Control Circuit (Bank 1 Sensor 1)', severity: SEV.LOW, system: 'Emissions', symptoms: ['Fuel consumption up', 'Lean/rich codes following'], causes: ['Failed oxygen sensor heater element', 'Wiring fault at sensor'], dangerous: false, guide: { title: 'Oxygen sensor heater test', steps: ['Test the sensor heater resistance at the connector.', 'Check heater supply fuse and wiring.', 'Replace the front oxygen sensor if the element is open.', 'Clear codes and verify trims normalise.'], source: 'Repair guide R-04 · Emissions digest' } },
  { code: 'P0016', name: 'Crankshaft/Camshaft Position Correlation', severity: SEV.HIGH, system: 'Engine Timing', symptoms: ['Hard start or no start', 'Rattling at front of engine', 'Limp mode'], causes: ['Stretched timing chain (M266 high mileage)', 'Failed camshaft adjuster', 'Crank/cam sensor drift'], dangerous: true, guide: { title: 'Timing correlation diagnosis', steps: ['Verify cam/crank signals on live data against spec.', 'Inspect the timing chain for excessive slack (rattle at cold start).', 'Professional timing-chain service required — do not drive far with this code.'], source: 'Repair guide R-01 · W245 common-faults digest' } },
  { code: 'P0234', name: 'Turbocharger Overboost Condition (B200 Turbo)', severity: SEV.MEDIUM, system: 'Boost Control', symptoms: ['Limp mode under hard acceleration', 'Whistling from charge pipes'], causes: ['Stuck wastegate actuator', 'Leaking charge pipe (B200 Turbo)', 'Boost pressure sensor drift'], dangerous: false, guide: { title: 'Boost control check — B200 Turbo', steps: ['Inspect all charge pipes and clamps for leaks.', 'Check wastegate actuator rod for free movement.', 'Compare requested vs actual boost on live data.', 'Replace the leaking pipe or faulty actuator; clear codes.'], source: 'Repair guide R-05 · Manifold & induction digest' } },
  { code: 'P0401', name: 'EGR Flow Insufficient (OM640 CDI)', severity: SEV.LOW, system: 'Emissions', symptoms: ['Rough diesel idle', 'Lamp on with no power loss'], causes: ['Carbon-clogged EGR valve (diesel-typical)', 'Blocked EGR passage'], dangerous: false, guide: { title: 'EGR valve service — OM640', steps: ['Remove and inspect the EGR valve for carbon build-up.', 'Clean the valve and passage; verify the pintle moves freely.', 'Refit with a new gasket; clear codes and road-test.'], source: 'Repair guide R-04 · Emissions digest' } },
  { code: 'P0442', name: 'EVAP System Small Leak Detected', severity: SEV.LOW, system: 'Emissions', symptoms: ['Fuel smell occasionally', 'Lamp on after refuelling'], causes: ['Loose or worn fuel filler cap', 'Cracked EVAP hose', 'Failed purge valve'], dangerous: false, guide: { title: 'EVAP small-leak check', steps: ['Tighten or replace the fuel filler cap first (cheapest fix).', 'Inspect EVAP lines under the car for cracks.', 'Test the purge valve for proper sealing.', 'Clear codes; expect a few drive cycles to confirm the fix.'], source: 'Repair guide R-04 · Emissions digest' } },
  { code: 'P0011', name: 'Camshaft Position — Timing Over-Advanced (Bank 1)', severity: SEV.MEDIUM, system: 'Engine Timing', symptoms: ['Cold-start rattle', 'Slight power loss'], causes: ['Camshaft adjuster sticking (M266)', 'Low or degraded engine oil'], dangerous: false, guide: { title: 'Cam adjuster check', steps: ['Check oil level and condition first; service if degraded.', 'Read live cam timing deviation at cold start.', 'If deviation persists, have the adjuster evaluated professionally.'], source: 'Repair guide R-01 · W245 common-faults digest' } },
  { code: 'U0100', name: 'Lost Communication With ECM/PCM', severity: SEV.HIGH, system: 'Network / CAN', symptoms: ['Multiple warning lamps', 'No-start condition', 'Random module dropouts'], causes: ['CAN bus wiring fault', 'Corroded SAM/can connector', 'Low system voltage collapsing the bus'], dangerous: true, guide: { title: 'CAN communication diagnosis', steps: ['Test battery and charging system first — low voltage mimics bus faults.', 'Inspect CAN harness under the dash and at the SAM for corrosion or chafe.', 'Professional network diagnosis required if wiring checks clean.'], source: 'Repair guide R-09 · Electrical & SAM digest' } },
  /* ---------- W245 community corpus supplement (generated by scripts/merge-rag.js — run: npm run merge-rag. Do not edit by hand.) ---------- */
  { code: 'P0100', name: 'Mass Air Flow Circuit Malfunction',
    severity: SEV.MEDIUM, system: 'محرك M266',
    symptoms: ['دائرة حساس الهواء'],
    causes: ['نضف حساس MAF بمنظف الكترونيات، شيك فلتر هواء'],
    dangerous: false,
    guide: {
      title: 'Mass Air Flow Circuit Malfunction — W245 (محرك M266)',
      steps: ['نضف حساس MAF بمنظف الكترونيات، شيك فلتر هواء.', 'Recommended action: اقرب مركز صيانة متخصص مرسيدس.'],
      source: 'W245 community digest'
    }
  },
  { code: 'P0170', name: 'Fuel Trim Malfunction Bank1',
    severity: SEV.MEDIUM, system: 'محرك M266',
    symptoms: ['خليط بنزين/هواء مش مظبوط'],
    causes: ['شيك تسريب هواء، حساس شكمان، رشاشات'],
    dangerous: false,
    guide: {
      title: 'Fuel Trim Malfunction Bank1 — W245 (محرك M266)',
      steps: ['شيك تسريب هواء، حساس شكمان، رشاشات.', 'Recommended action: اقرب مركز صيانة متخصص مرسيدس.'],
      source: 'W245 community digest'
    }
  },
  { code: 'P0172', name: 'System Too Rich Bank1',
    severity: SEV.MEDIUM, system: 'محرك M266',
    symptoms: ['خليط غني'],
    causes: ['رشاش بيسيل، حساس MAF بايظ'],
    dangerous: false,
    guide: {
      title: 'System Too Rich Bank1 — W245 (محرك M266)',
      steps: ['رشاش بيسيل، حساس MAF بايظ.', 'Recommended action: اقرب مركز صيانة متخصص مرسيدس.'],
      source: 'W245 community digest'
    }
  },
  { code: 'P0301', name: 'Cylinder 1-4 Misfire',
    severity: SEV.HIGH, system: 'محرك M266',
    symptoms: ['تقطيع سلندر محدد'],
    causes: ['بوجيه، موبينة، رشاش نفس السلندر'],
    dangerous: true,
    guide: {
      title: 'Cylinder 1-4 Misfire — W245 (محرك M266)',
      steps: ['بوجيه، موبينة، رشاش نفس السلندر.', 'Recommended action: اقرب مركز صيانة متخصص مرسيدس.'],
      source: 'W245 community digest'
    }
  },
  { code: 'P0302', name: 'Cylinder 1-4 Misfire',
    severity: SEV.HIGH, system: 'محرك M266',
    symptoms: ['تقطيع سلندر محدد'],
    causes: ['بوجيه، موبينة، رشاش نفس السلندر'],
    dangerous: true,
    guide: {
      title: 'Cylinder 1-4 Misfire — W245 (محرك M266)',
      steps: ['بوجيه، موبينة، رشاش نفس السلندر.', 'Recommended action: اقرب مركز صيانة متخصص مرسيدس.'],
      source: 'W245 community digest'
    }
  },
  { code: 'P0303', name: 'Cylinder 1-4 Misfire',
    severity: SEV.HIGH, system: 'محرك M266',
    symptoms: ['تقطيع سلندر محدد'],
    causes: ['بوجيه، موبينة، رشاش نفس السلندر'],
    dangerous: true,
    guide: {
      title: 'Cylinder 1-4 Misfire — W245 (محرك M266)',
      steps: ['بوجيه، موبينة، رشاش نفس السلندر.', 'Recommended action: اقرب مركز صيانة متخصص مرسيدس.'],
      source: 'W245 community digest'
    }
  },
  { code: 'P0304', name: 'Cylinder 1-4 Misfire',
    severity: SEV.HIGH, system: 'محرك M266',
    symptoms: ['تقطيع سلندر محدد'],
    causes: ['بوجيه، موبينة، رشاش نفس السلندر'],
    dangerous: true,
    guide: {
      title: 'Cylinder 1-4 Misfire — W245 (محرك M266)',
      steps: ['بوجيه، موبينة، رشاش نفس السلندر.', 'Recommended action: اقرب مركز صيانة متخصص مرسيدس.'],
      source: 'W245 community digest'
    }
  },
  { code: 'P0335', name: 'Crankshaft Position Sensor A Circuit',
    severity: SEV.MEDIUM, system: 'محرك M266',
    symptoms: ['حساس الكرنك'],
    causes: ['العربية بتبطل فجأة - حساس خلف الموتور A0031532828'],
    dangerous: false,
    guide: {
      title: 'Crankshaft Position Sensor A Circuit — W245 (محرك M266)',
      steps: ['العربية بتبطل فجأة - حساس خلف الموتور A0031532828.', 'Recommended action: اقرب مركز صيانة متخصص مرسيدس.'],
      source: 'W245 community digest'
    }
  },
  { code: 'P0340', name: 'Camshaft Position Sensor A Circuit Bank1',
    severity: SEV.MEDIUM, system: 'محرك M266',
    symptoms: ['حساس الكامة'],
    causes: ['مارش طويل ومش بيعدي 3000 لفة'],
    dangerous: false,
    guide: {
      title: 'Camshaft Position Sensor A Circuit Bank1 — W245 (محرك M266)',
      steps: ['مارش طويل ومش بيعدي 3000 لفة.', 'Recommended action: اقرب مركز صيانة متخصص مرسيدس.'],
      source: 'W245 community digest'
    }
  },
  { code: 'P0420', name: 'Catalyst Efficiency Below Threshold Bank1',
    severity: SEV.MEDIUM, system: 'محرك M266',
    symptoms: ['كفاءة علبة بيئة ضعيفة'],
    causes: ['بنزين وحش، علبة مسدودة، حساس شكمان خلفي'],
    dangerous: false,
    guide: {
      title: 'Catalyst Efficiency Below Threshold Bank1 — W245 (محرك M266)',
      steps: ['بنزين وحش، علبة مسدودة، حساس شكمان خلفي.', 'Recommended action: اقرب مركز صيانة متخصص مرسيدس.'],
      source: 'W245 community digest'
    }
  },
  { code: 'P0430', name: 'Catalyst Efficiency Bank2',
    severity: SEV.MEDIUM, system: 'محرك M266',
    symptoms: ['علبة بيئة بنك2'],
    causes: ['نفسه'],
    dangerous: false,
    guide: {
      title: 'Catalyst Efficiency Bank2 — W245 (محرك M266)',
      steps: ['نفسه.', 'Recommended action: اقرب مركز صيانة متخصص مرسيدس.'],
      source: 'W245 community digest'
    }
  },
  { code: 'P0446', name: 'Evap Vent Control Circuit',
    severity: SEV.MEDIUM, system: 'محرك M266',
    symptoms: ['بلف بخار بنزين'],
    causes: ['علبة كانستر، بلف EVAP'],
    dangerous: false,
    guide: {
      title: 'Evap Vent Control Circuit — W245 (محرك M266)',
      steps: ['علبة كانستر، بلف EVAP.', 'Recommended action: اقرب مركز صيانة متخصص مرسيدس.'],
      source: 'W245 community digest'
    }
  },
  { code: 'P0500', name: 'Vehicle Speed Sensor',
    severity: SEV.MEDIUM, system: 'محرك M266',
    symptoms: ['حساس سرعة العربية'],
    causes: ['عداد سرعة بيرقص'],
    dangerous: false,
    guide: {
      title: 'Vehicle Speed Sensor — W245 (محرك M266)',
      steps: ['عداد سرعة بيرقص.', 'Recommended action: اقرب مركز صيانة متخصص مرسيدس.'],
      source: 'W245 community digest'
    }
  },
  { code: 'P0560', name: 'System Voltage Low/High',
    severity: SEV.MEDIUM, system: 'محرك M266',
    symptoms: ['فولت بطارية ضعيف/عالي'],
    causes: ['بطارية، دينامو'],
    dangerous: false,
    guide: {
      title: 'System Voltage Low/High — W245 (محرك M266)',
      steps: ['بطارية، دينامو.', 'Recommended action: اقرب مركز صيانة متخصص مرسيدس.'],
      source: 'W245 community digest'
    }
  },
  { code: 'P0561', name: 'System Voltage Low/High',
    severity: SEV.MEDIUM, system: 'محرك M266',
    symptoms: ['فولت بطارية ضعيف/عالي'],
    causes: ['بطارية، دينامو'],
    dangerous: false,
    guide: {
      title: 'System Voltage Low/High — W245 (محرك M266)',
      steps: ['بطارية، دينامو.', 'Recommended action: اقرب مركز صيانة متخصص مرسيدس.'],
      source: 'W245 community digest'
    }
  },
  { code: 'P0563', name: 'System Voltage Low/High',
    severity: SEV.MEDIUM, system: 'محرك M266',
    symptoms: ['فولت بطارية ضعيف/عالي'],
    causes: ['بطارية، دينامو'],
    dangerous: false,
    guide: {
      title: 'System Voltage Low/High — W245 (محرك M266)',
      steps: ['بطارية، دينامو.', 'Recommended action: اقرب مركز صيانة متخصص مرسيدس.'],
      source: 'W245 community digest'
    }
  },
  { code: 'P0600', name: 'Internal Control Module Memory Error',
    severity: SEV.MEDIUM, system: 'محرك M266',
    symptoms: ['ذاكرة كنترول داخلية'],
    causes: ['كنترول موتور، محتاج برمجة او تغيير'],
    dangerous: false,
    guide: {
      title: 'Internal Control Module Memory Error — W245 (محرك M266)',
      steps: ['كنترول موتور، محتاج برمجة او تغيير.', 'Recommended action: اقرب مركز صيانة متخصص مرسيدس.'],
      source: 'W245 community digest'
    }
  },
  { code: 'P0601', name: 'Internal Control Module Memory Error',
    severity: SEV.MEDIUM, system: 'محرك M266',
    symptoms: ['ذاكرة كنترول داخلية'],
    causes: ['كنترول موتور، محتاج برمجة او تغيير'],
    dangerous: false,
    guide: {
      title: 'Internal Control Module Memory Error — W245 (محرك M266)',
      steps: ['كنترول موتور، محتاج برمجة او تغيير.', 'Recommended action: اقرب مركز صيانة متخصص مرسيدس.'],
      source: 'W245 community digest'
    }
  },
  { code: 'P0602', name: 'Internal Control Module Memory Error',
    severity: SEV.MEDIUM, system: 'محرك M266',
    symptoms: ['ذاكرة كنترول داخلية'],
    causes: ['كنترول موتور، محتاج برمجة او تغيير'],
    dangerous: false,
    guide: {
      title: 'Internal Control Module Memory Error — W245 (محرك M266)',
      steps: ['كنترول موتور، محتاج برمجة او تغيير.', 'Recommended action: اقرب مركز صيانة متخصص مرسيدس.'],
      source: 'W245 community digest'
    }
  },
  { code: 'P0603', name: 'Internal Control Module Memory Error',
    severity: SEV.MEDIUM, system: 'محرك M266',
    symptoms: ['ذاكرة كنترول داخلية'],
    causes: ['كنترول موتور، محتاج برمجة او تغيير'],
    dangerous: false,
    guide: {
      title: 'Internal Control Module Memory Error — W245 (محرك M266)',
      steps: ['كنترول موتور، محتاج برمجة او تغيير.', 'Recommended action: اقرب مركز صيانة متخصص مرسيدس.'],
      source: 'W245 community digest'
    }
  },
  { code: 'P0604', name: 'Internal Control Module Memory Error',
    severity: SEV.MEDIUM, system: 'محرك M266',
    symptoms: ['ذاكرة كنترول داخلية'],
    causes: ['كنترول موتور، محتاج برمجة او تغيير'],
    dangerous: false,
    guide: {
      title: 'Internal Control Module Memory Error — W245 (محرك M266)',
      steps: ['كنترول موتور، محتاج برمجة او تغيير.', 'Recommended action: اقرب مركز صيانة متخصص مرسيدس.'],
      source: 'W245 community digest'
    }
  },
  { code: 'P0605', name: 'Internal Control Module Memory Error',
    severity: SEV.MEDIUM, system: 'محرك M266',
    symptoms: ['ذاكرة كنترول داخلية'],
    causes: ['كنترول موتور، محتاج برمجة او تغيير'],
    dangerous: false,
    guide: {
      title: 'Internal Control Module Memory Error — W245 (محرك M266)',
      steps: ['كنترول موتور، محتاج برمجة او تغيير.', 'Recommended action: اقرب مركز صيانة متخصص مرسيدس.'],
      source: 'W245 community digest'
    }
  },
  { code: 'P0606', name: 'Internal Control Module Memory Error',
    severity: SEV.MEDIUM, system: 'محرك M266',
    symptoms: ['ذاكرة كنترول داخلية'],
    causes: ['كنترول موتور، محتاج برمجة او تغيير'],
    dangerous: false,
    guide: {
      title: 'Internal Control Module Memory Error — W245 (محرك M266)',
      steps: ['كنترول موتور، محتاج برمجة او تغيير.', 'Recommended action: اقرب مركز صيانة متخصص مرسيدس.'],
      source: 'W245 community digest'
    }
  },
  { code: 'P0705', name: 'Transmission Range Sensor Implausible',
    severity: SEV.LOW, system: 'فتيس CVT 722.8 / ESM',
    symptoms: ['اشارة عصا الفتيس غير منطقية'],
    causes: ['عصا فتيس N15/5 ESM'],
    dangerous: false,
    guide: {
      title: 'Transmission Range Sensor Implausible — W245 (فتيس CVT 722.8 / ESM)',
      steps: ['عصا فتيس N15/5 ESM.', 'Recommended action: اقرب مركز صيانة متخصص مرسيدس.'],
      source: 'W245 community digest'
    }
  },
  { code: 'P0706', name: 'Transmission Range Sensor Implausible',
    severity: SEV.LOW, system: 'فتيس CVT 722.8 / ESM',
    symptoms: ['اشارة عصا الفتيس غير منطقية'],
    causes: ['عصا فتيس N15/5 ESM'],
    dangerous: false,
    guide: {
      title: 'Transmission Range Sensor Implausible — W245 (فتيس CVT 722.8 / ESM)',
      steps: ['عصا فتيس N15/5 ESM.', 'Recommended action: اقرب مركز صيانة متخصص مرسيدس.'],
      source: 'W245 community digest'
    }
  },
  { code: 'P0710', name: 'Transmission Fluid Temp Sensor',
    severity: SEV.LOW, system: 'فتيس CVT 722.8 / ESM',
    symptoms: ['حساس حرارة زيت فتيس'],
    causes: ['فيشة فتيس، زيت ناقص'],
    dangerous: false,
    guide: {
      title: 'Transmission Fluid Temp Sensor — W245 (فتيس CVT 722.8 / ESM)',
      steps: ['فيشة فتيس، زيت ناقص.', 'Recommended action: اقرب مركز صيانة متخصص مرسيدس.'],
      source: 'W245 community digest'
    }
  },
  { code: 'P0711', name: 'Transmission Fluid Temp Sensor',
    severity: SEV.LOW, system: 'فتيس CVT 722.8 / ESM',
    symptoms: ['حساس حرارة زيت فتيس'],
    causes: ['فيشة فتيس، زيت ناقص'],
    dangerous: false,
    guide: {
      title: 'Transmission Fluid Temp Sensor — W245 (فتيس CVT 722.8 / ESM)',
      steps: ['فيشة فتيس، زيت ناقص.', 'Recommended action: اقرب مركز صيانة متخصص مرسيدس.'],
      source: 'W245 community digest'
    }
  },
  { code: 'P0712', name: 'Transmission Fluid Temp Sensor',
    severity: SEV.LOW, system: 'فتيس CVT 722.8 / ESM',
    symptoms: ['حساس حرارة زيت فتيس'],
    causes: ['فيشة فتيس، زيت ناقص'],
    dangerous: false,
    guide: {
      title: 'Transmission Fluid Temp Sensor — W245 (فتيس CVT 722.8 / ESM)',
      steps: ['فيشة فتيس، زيت ناقص.', 'Recommended action: اقرب مركز صيانة متخصص مرسيدس.'],
      source: 'W245 community digest'
    }
  },
  { code: 'P0713', name: 'Transmission Fluid Temp Sensor',
    severity: SEV.LOW, system: 'فتيس CVT 722.8 / ESM',
    symptoms: ['حساس حرارة زيت فتيس'],
    causes: ['فيشة فتيس، زيت ناقص'],
    dangerous: false,
    guide: {
      title: 'Transmission Fluid Temp Sensor — W245 (فتيس CVT 722.8 / ESM)',
      steps: ['فيشة فتيس، زيت ناقص.', 'Recommended action: اقرب مركز صيانة متخصص مرسيدس.'],
      source: 'W245 community digest'
    }
  },
  { code: 'P0714', name: 'Transmission Fluid Temp Sensor',
    severity: SEV.LOW, system: 'فتيس CVT 722.8 / ESM',
    symptoms: ['حساس حرارة زيت فتيس'],
    causes: ['فيشة فتيس، زيت ناقص'],
    dangerous: false,
    guide: {
      title: 'Transmission Fluid Temp Sensor — W245 (فتيس CVT 722.8 / ESM)',
      steps: ['فيشة فتيس، زيت ناقص.', 'Recommended action: اقرب مركز صيانة متخصص مرسيدس.'],
      source: 'W245 community digest'
    }
  },
  { code: 'P0715', name: 'Input/Turbine Speed Sensor',
    severity: SEV.MEDIUM, system: 'فتيس CVT 722.8 / ESM',
    symptoms: ['حساس سرعة دخل'],
    causes: ['Y3/9b3 / Y3/9b4'],
    dangerous: false,
    guide: {
      title: 'Input/Turbine Speed Sensor — W245 (فتيس CVT 722.8 / ESM)',
      steps: ['Y3/9b3 / Y3/9b4.', 'Recommended action: اقرب مركز صيانة متخصص مرسيدس.'],
      source: 'W245 community digest'
    }
  },
  { code: 'P0716', name: 'Input/Turbine Speed Sensor',
    severity: SEV.MEDIUM, system: 'فتيس CVT 722.8 / ESM',
    symptoms: ['حساس سرعة دخل'],
    causes: ['Y3/9b3 / Y3/9b4'],
    dangerous: false,
    guide: {
      title: 'Input/Turbine Speed Sensor — W245 (فتيس CVT 722.8 / ESM)',
      steps: ['Y3/9b3 / Y3/9b4.', 'Recommended action: اقرب مركز صيانة متخصص مرسيدس.'],
      source: 'W245 community digest'
    }
  },
  { code: 'P0717', name: 'Input/Turbine Speed Sensor',
    severity: SEV.MEDIUM, system: 'فتيس CVT 722.8 / ESM',
    symptoms: ['حساس سرعة دخل'],
    causes: ['Y3/9b3 / Y3/9b4'],
    dangerous: false,
    guide: {
      title: 'Input/Turbine Speed Sensor — W245 (فتيس CVT 722.8 / ESM)',
      steps: ['Y3/9b3 / Y3/9b4.', 'Recommended action: اقرب مركز صيانة متخصص مرسيدس.'],
      source: 'W245 community digest'
    }
  },
  { code: 'P0718', name: 'Input/Turbine Speed Sensor',
    severity: SEV.MEDIUM, system: 'فتيس CVT 722.8 / ESM',
    symptoms: ['حساس سرعة دخل'],
    causes: ['Y3/9b3 / Y3/9b4'],
    dangerous: false,
    guide: {
      title: 'Input/Turbine Speed Sensor — W245 (فتيس CVT 722.8 / ESM)',
      steps: ['Y3/9b3 / Y3/9b4.', 'Recommended action: اقرب مركز صيانة متخصص مرسيدس.'],
      source: 'W245 community digest'
    }
  },
  { code: 'P0720', name: 'Output Speed Sensor Circuit',
    severity: SEV.MEDIUM, system: 'فتيس CVT 722.8 / ESM',
    symptoms: ['حساس سرعة خرج Y3/9b5'],
    causes: ['اشهر كود W245 CVT - لحام بارد بوردة'],
    dangerous: false,
    guide: {
      title: 'Output Speed Sensor Circuit — W245 (فتيس CVT 722.8 / ESM)',
      steps: ['اشهر كود W245 CVT - لحام بارد بوردة.', 'Recommended action: اقرب مركز صيانة متخصص مرسيدس.'],
      source: 'W245 community digest'
    }
  },
  { code: 'P0721', name: 'Output Speed Sensor Circuit',
    severity: SEV.MEDIUM, system: 'فتيس CVT 722.8 / ESM',
    symptoms: ['حساس سرعة خرج Y3/9b5'],
    causes: ['اشهر كود W245 CVT - لحام بارد بوردة'],
    dangerous: false,
    guide: {
      title: 'Output Speed Sensor Circuit — W245 (فتيس CVT 722.8 / ESM)',
      steps: ['اشهر كود W245 CVT - لحام بارد بوردة.', 'Recommended action: اقرب مركز صيانة متخصص مرسيدس.'],
      source: 'W245 community digest'
    }
  },
  { code: 'P0722', name: 'Output Speed Sensor Circuit',
    severity: SEV.MEDIUM, system: 'فتيس CVT 722.8 / ESM',
    symptoms: ['حساس سرعة خرج Y3/9b5'],
    causes: ['اشهر كود W245 CVT - لحام بارد بوردة'],
    dangerous: false,
    guide: {
      title: 'Output Speed Sensor Circuit — W245 (فتيس CVT 722.8 / ESM)',
      steps: ['اشهر كود W245 CVT - لحام بارد بوردة.', 'Recommended action: اقرب مركز صيانة متخصص مرسيدس.'],
      source: 'W245 community digest'
    }
  },
  { code: 'P0723', name: 'Output Speed Sensor Circuit',
    severity: SEV.MEDIUM, system: 'فتيس CVT 722.8 / ESM',
    symptoms: ['حساس سرعة خرج Y3/9b5'],
    causes: ['اشهر كود W245 CVT - لحام بارد بوردة'],
    dangerous: false,
    guide: {
      title: 'Output Speed Sensor Circuit — W245 (فتيس CVT 722.8 / ESM)',
      steps: ['اشهر كود W245 CVT - لحام بارد بوردة.', 'Recommended action: اقرب مركز صيانة متخصص مرسيدس.'],
      source: 'W245 community digest'
    }
  },
  { code: 'P0730', name: 'Incorrect Gear Ratio',
    severity: SEV.MEDIUM, system: 'فتيس CVT 722.8 / ESM',
    symptoms: ['نسبة تعشيق غلط'],
    causes: ['جنزير CVT متآكل او بوردة'],
    dangerous: false,
    guide: {
      title: 'Incorrect Gear Ratio — W245 (فتيس CVT 722.8 / ESM)',
      steps: ['جنزير CVT متآكل او بوردة.', 'Recommended action: اقرب مركز صيانة متخصص مرسيدس.'],
      source: 'W245 community digest'
    }
  },
  { code: 'P0746-P0796', name: 'Pressure Control Solenoid Performance',
    severity: SEV.MEDIUM, system: 'فتيس CVT 722.8 / ESM',
    symptoms: ['بلف ضغط زيت فتيس'],
    causes: ['فلتر مسدود، بوردة'],
    dangerous: false,
    guide: {
      title: 'Pressure Control Solenoid Performance — W245 (فتيس CVT 722.8 / ESM)',
      steps: ['فلتر مسدود، بوردة.', 'Recommended action: اقرب مركز صيانة متخصص مرسيدس.'],
      source: 'W245 community digest'
    }
  },
  { code: 'P0793', name: 'Intermediate Shaft Speed Sensor',
    severity: SEV.MEDIUM, system: 'فتيس CVT 722.8 / ESM',
    symptoms: ['حساس سرعة وسيط Y3/9b4'],
    causes: ['نفس عيب P0720'],
    dangerous: false,
    guide: {
      title: 'Intermediate Shaft Speed Sensor — W245 (فتيس CVT 722.8 / ESM)',
      steps: ['نفس عيب P0720.', 'Recommended action: اقرب مركز صيانة متخصص مرسيدس.'],
      source: 'W245 community digest'
    }
  },
  { code: 'P0794', name: 'Intermediate Shaft Speed Sensor',
    severity: SEV.MEDIUM, system: 'فتيس CVT 722.8 / ESM',
    symptoms: ['حساس سرعة وسيط Y3/9b4'],
    causes: ['نفس عيب P0720'],
    dangerous: false,
    guide: {
      title: 'Intermediate Shaft Speed Sensor — W245 (فتيس CVT 722.8 / ESM)',
      steps: ['نفس عيب P0720.', 'Recommended action: اقرب مركز صيانة متخصص مرسيدس.'],
      source: 'W245 community digest'
    }
  },
  { code: 'P0810', name: 'Clutch Position Control',
    severity: SEV.MEDIUM, system: 'فتيس CVT 722.8 / ESM',
    symptoms: ['كلتش فتيس'],
    causes: ['CVT clutch'],
    dangerous: false,
    guide: {
      title: 'Clutch Position Control — W245 (فتيس CVT 722.8 / ESM)',
      steps: ['CVT clutch.', 'Recommended action: اقرب مركز صيانة متخصص مرسيدس.'],
      source: 'W245 community digest'
    }
  },
  { code: 'P0811', name: 'Clutch Position Control',
    severity: SEV.MEDIUM, system: 'فتيس CVT 722.8 / ESM',
    symptoms: ['كلتش فتيس'],
    causes: ['CVT clutch'],
    dangerous: false,
    guide: {
      title: 'Clutch Position Control — W245 (فتيس CVT 722.8 / ESM)',
      steps: ['CVT clutch.', 'Recommended action: اقرب مركز صيانة متخصص مرسيدس.'],
      source: 'W245 community digest'
    }
  },
  { code: 'P0812', name: 'Clutch Position Control',
    severity: SEV.MEDIUM, system: 'فتيس CVT 722.8 / ESM',
    symptoms: ['كلتش فتيس'],
    causes: ['CVT clutch'],
    dangerous: false,
    guide: {
      title: 'Clutch Position Control — W245 (فتيس CVT 722.8 / ESM)',
      steps: ['CVT clutch.', 'Recommended action: اقرب مركز صيانة متخصص مرسيدس.'],
      source: 'W245 community digest'
    }
  },
  { code: 'P0896', name: 'Shift Time Too Long',
    severity: SEV.MEDIUM, system: 'فتيس CVT 722.8 / ESM',
    symptoms: ['زمن نقل طويل'],
    causes: ['زيت غلط او فلتر مسدود - W245 CVT'],
    dangerous: false,
    guide: {
      title: 'Shift Time Too Long — W245 (فتيس CVT 722.8 / ESM)',
      steps: ['زيت غلط او فلتر مسدود - W245 CVT.', 'Recommended action: اقرب مركز صيانة متخصص مرسيدس.'],
      source: 'W245 community digest'
    }
  },
  { code: 'P1000', name: 'Electronic Gear Selector Module Defective N15/5',
    severity: SEV.LOW, system: 'فتيس CVT 722.8 / ESM',
    symptoms: ['عصا فتيس بايظة'],
    causes: ['تصليح بوردة عصا'],
    dangerous: false,
    guide: {
      title: 'Electronic Gear Selector Module Defective N15/5 — W245 (فتيس CVT 722.8 / ESM)',
      steps: ['تصليح بوردة عصا.', 'Recommended action: اقرب مركز صيانة متخصص مرسيدس.'],
      source: 'W245 community digest'
    }
  },
  { code: 'P1840-P1895', name: 'Gear Selector Module Various',
    severity: SEV.LOW, system: 'فتيس CVT 722.8 / ESM',
    symptoms: ['عصا فتيس اكواد متنوعة'],
    causes: ['ESM'],
    dangerous: false,
    guide: {
      title: 'Gear Selector Module Various — W245 (فتيس CVT 722.8 / ESM)',
      steps: ['ESM.', 'Recommended action: اقرب مركز صيانة متخصص مرسيدس.'],
      source: 'W245 community digest'
    }
  },
  { code: 'P240C', name: 'CAN Signal from N15/5 Implausible',
    severity: SEV.LOW, system: 'فتيس CVT 722.8 / ESM',
    symptoms: ['اشارة CAN من عصا الفتيس'],
    causes: ['ESM'],
    dangerous: false,
    guide: {
      title: 'CAN Signal from N15/5 Implausible — W245 (فتيس CVT 722.8 / ESM)',
      steps: ['ESM.', 'Recommended action: اقرب مركز صيانة متخصص مرسيدس.'],
      source: 'W245 community digest'
    }
  },
  { code: 'P1856', name: 'Selector Lever Position Implausible',
    severity: SEV.LOW, system: 'فتيس CVT 722.8 / ESM',
    symptoms: ['وضع عصا غير منطقي'],
    causes: ['ESM'],
    dangerous: false,
    guide: {
      title: 'Selector Lever Position Implausible — W245 (فتيس CVT 722.8 / ESM)',
      steps: ['ESM.', 'Recommended action: اقرب مركز صيانة متخصص مرسيدس.'],
      source: 'W245 community digest'
    }
  },
  { code: 'P1872', name: 'CAN Communication TCU Interrupted',
    severity: SEV.MEDIUM, system: 'فتيس CVT 722.8 / ESM',
    symptoms: ['انقطاع CAN مع كنترول فتيس'],
    causes: ['ضفيرة او EZS'],
    dangerous: false,
    guide: {
      title: 'CAN Communication TCU Interrupted — W245 (فتيس CVT 722.8 / ESM)',
      steps: ['ضفيرة او EZS.', 'Recommended action: اقرب مركز صيانة متخصص مرسيدس.'],
      source: 'W245 community digest'
    }
  },
  { code: 'B1000', name: 'HRA Headlamp Range Undervoltage',
    severity: SEV.LOW, system: 'بودي / ايرباج / ابواب / مناخ',
    symptoms: ['كشاف امامي فولت ضعيف'],
    causes: ['فيوز او ضفيرة فانوس'],
    dangerous: false,
    guide: {
      title: 'HRA Headlamp Range Undervoltage — W245 (بودي / ايرباج / ابواب / مناخ)',
      steps: ['فيوز او ضفيرة فانوس.', 'Recommended action: اقرب مركز صيانة متخصص مرسيدس.'],
      source: 'W245 community digest'
    }
  },
  { code: 'B1004', name: 'LCP Lower Control Panel Mismatch',
    severity: SEV.LOW, system: 'بودي / ايرباج / ابواب / مناخ',
    symptoms: ['لوحة تحكم سفلية غير مطابقة'],
    causes: ['برمجة'],
    dangerous: false,
    guide: {
      title: 'LCP Lower Control Panel Mismatch — W245 (بودي / ايرباج / ابواب / مناخ)',
      steps: ['برمجة.', 'Recommended action: اقرب مركز صيانة متخصص مرسيدس.'],
      source: 'W245 community digest'
    }
  },
  { code: 'B1016', name: 'EIS No Enable from EWM',
    severity: SEV.MEDIUM, system: 'بودي / ايرباج / ابواب / مناخ',
    symptoms: ['كونتاكت EZS مش مدي تمكين'],
    causes: ['EZS'],
    dangerous: false,
    guide: {
      title: 'EIS No Enable from EWM — W245 (بودي / ايرباج / ابواب / مناخ)',
      steps: ['EZS.', 'Recommended action: اقرب مركز صيانة متخصص مرسيدس.'],
      source: 'W245 community digest'
    }
  },
  { code: 'B1056', name: 'DCM-RL CAN Communication',
    severity: SEV.MEDIUM, system: 'بودي / ايرباج / ابواب / مناخ',
    symptoms: ['قطع اتصال وحدة باب خلفي'],
    causes: ['ضفيرة باب او كنترول باب'],
    dangerous: false,
    guide: {
      title: 'DCM-RL CAN Communication — W245 (بودي / ايرباج / ابواب / مناخ)',
      steps: ['ضفيرة باب او كنترول باب.', 'Recommended action: اقرب مركز صيانة متخصص مرسيدس.'],
      source: 'W245 community digest'
    }
  },
  { code: 'B1056-002', name: 'S20/1 Switch Group Fault',
    severity: SEV.LOW, system: 'بودي / ايرباج / ابواب / مناخ',
    symptoms: ['مجموعة مفاتيح زجاج باب سائق'],
    causes: ['لوحة مفاتيح A1698206410'],
    dangerous: false,
    guide: {
      title: 'S20/1 Switch Group Fault — W245 (بودي / ايرباج / ابواب / مناخ)',
      steps: ['لوحة مفاتيح A1698206410.', 'Recommended action: اقرب مركز صيانة متخصص مرسيدس.'],
      source: 'W245 community digest'
    }
  },
  { code: 'B1088', name: 'Window Switch Signal Implausible',
    severity: SEV.LOW, system: 'بودي / ايرباج / ابواب / مناخ',
    symptoms: ['اشارة مفتاح زجاج غير منطقية'],
    causes: ['مفتاح زجاج'],
    dangerous: false,
    guide: {
      title: 'Window Switch Signal Implausible — W245 (بودي / ايرباج / ابواب / مناخ)',
      steps: ['مفتاح زجاج.', 'Recommended action: اقرب مركز صيانة متخصص مرسيدس.'],
      source: 'W245 community digest'
    }
  },
  { code: 'B1226', name: 'In-car Temp Sensor B10/4',
    severity: SEV.LOW, system: 'بودي / ايرباج / ابواب / مناخ',
    symptoms: ['حساس حرارة صالون'],
    causes: ['لوحة مناخ'],
    dangerous: false,
    guide: {
      title: 'In-car Temp Sensor B10/4 — W245 (بودي / ايرباج / ابواب / مناخ)',
      steps: ['لوحة مناخ.', 'Recommended action: اقرب مركز صيانة متخصص مرسيدس.'],
      source: 'W245 community digest'
    }
  },
  { code: 'B1227', name: 'Outside Temp Sensor',
    severity: SEV.LOW, system: 'بودي / ايرباج / ابواب / مناخ',
    symptoms: ['حساس حرارة خارجية'],
    causes: ['مراية او اكصدام'],
    dangerous: false,
    guide: {
      title: 'Outside Temp Sensor — W245 (بودي / ايرباج / ابواب / مناخ)',
      steps: ['مراية او اكصدام.', 'Recommended action: اقرب مركز صيانة متخصص مرسيدس.'],
      source: 'W245 community digest'
    }
  },
  { code: 'B1230', name: 'Evaporator Temp Sensor B10/6',
    severity: SEV.LOW, system: 'بودي / ايرباج / ابواب / مناخ',
    symptoms: ['حساس حرارة ثلاجة'],
    causes: ['تكييف'],
    dangerous: false,
    guide: {
      title: 'Evaporator Temp Sensor B10/6 — W245 (بودي / ايرباج / ابواب / مناخ)',
      steps: ['تكييف.', 'Recommended action: اقرب مركز صيانة متخصص مرسيدس.'],
      source: 'W245 community digest'
    }
  },
  { code: 'B1232', name: 'Refrigerant Pressure Sensor B12',
    severity: SEV.LOW, system: 'بودي / ايرباج / ابواب / مناخ',
    symptoms: ['حساس ضغط فريون'],
    causes: ['تكييف'],
    dangerous: false,
    guide: {
      title: 'Refrigerant Pressure Sensor B12 — W245 (بودي / ايرباج / ابواب / مناخ)',
      steps: ['تكييف.', 'Recommended action: اقرب مركز صيانة متخصص مرسيدس.'],
      source: 'W245 community digest'
    }
  },
  { code: 'B1310', name: 'Left Window Airbag Sensor Defective',
    severity: SEV.HIGH, system: 'بودي / ايرباج / ابواب / مناخ',
    symptoms: ['حساس ايرباج جانبي شمال'],
    causes: ['ضفيرة او حساس'],
    dangerous: true,
    guide: {
      title: 'Left Window Airbag Sensor Defective — W245 (بودي / ايرباج / ابواب / مناخ)',
      steps: ['ضفيرة او حساس.', 'Recommended action: اقرب مركز صيانة متخصص مرسيدس.'],
      source: 'W245 community digest'
    }
  },
  { code: 'B1315', name: 'Front Passenger Child Seat Recognition',
    severity: SEV.LOW, system: 'بودي / ايرباج / ابواب / مناخ',
    symptoms: ['حساس كرسي طفل راكب'],
    causes: ['B48 حصيرة مقعد'],
    dangerous: false,
    guide: {
      title: 'Front Passenger Child Seat Recognition — W245 (بودي / ايرباج / ابواب / مناخ)',
      steps: ['B48 حصيرة مقعد.', 'Recommended action: اقرب مركز صيانة متخصص مرسيدس.'],
      source: 'W245 community digest'
    }
  },
  { code: 'B1850', name: 'CAN Interrupted with DCM',
    severity: SEV.MEDIUM, system: 'بودي / ايرباج / ابواب / مناخ',
    symptoms: ['CAN مقطوع مع وحدة باب'],
    causes: ['ضفيرة باب'],
    dangerous: false,
    guide: {
      title: 'CAN Interrupted with DCM — W245 (بودي / ايرباج / ابواب / مناخ)',
      steps: ['ضفيرة باب.', 'Recommended action: اقرب مركز صيانة متخصص مرسيدس.'],
      source: 'W245 community digest'
    }
  },
  { code: 'B1703', name: 'EZS Transponder Key',
    severity: SEV.LOW, system: 'بودي / ايرباج / ابواب / مناخ',
    symptoms: ['تراسسوندر مفتاح'],
    causes: ['مفتاح او EZS'],
    dangerous: false,
    guide: {
      title: 'EZS Transponder Key — W245 (بودي / ايرباج / ابواب / مناخ)',
      steps: ['مفتاح او EZS.', 'Recommended action: اقرب مركز صيانة متخصص مرسيدس.'],
      source: 'W245 community digest'
    }
  },
  { code: 'B2100', name: 'EZS Internal Fault',
    severity: SEV.MEDIUM, system: 'بودي / ايرباج / ابواب / مناخ',
    symptoms: ['عطل داخلي EZS'],
    causes: ['تصليح بوردة EZS'],
    dangerous: false,
    guide: {
      title: 'EZS Internal Fault — W245 (بودي / ايرباج / ابواب / مناخ)',
      steps: ['تصليح بوردة EZS.', 'Recommended action: اقرب مركز صيانة متخصص مرسيدس.'],
      source: 'W245 community digest'
    }
  },
  { code: 'B1760', name: 'EZS Fault',
    severity: SEV.MEDIUM, system: 'بودي / ايرباج / ابواب / مناخ',
    symptoms: ['عطل EZS عام'],
    causes: ['EZS'],
    dangerous: false,
    guide: {
      title: 'EZS Fault — W245 (بودي / ايرباج / ابواب / مناخ)',
      steps: ['EZS.', 'Recommended action: اقرب مركز صيانة متخصص مرسيدس.'],
      source: 'W245 community digest'
    }
  },
  { code: '9022', name: 'B48 Seat Occupancy Sensor',
    severity: SEV.LOW, system: 'بودي / ايرباج / ابواب / مناخ',
    symptoms: ['حساس اشغال مقعد راكب'],
    causes: ['حصيرة مقعد'],
    dangerous: false,
    guide: {
      title: 'B48 Seat Occupancy Sensor — W245 (بودي / ايرباج / ابواب / مناخ)',
      steps: ['حصيرة مقعد.', 'Recommended action: اقرب مركز صيانة متخصص مرسيدس.'],
      source: 'W245 community digest'
    }
  },
  { code: '9223', name: 'Airbag Resistance High',
    severity: SEV.HIGH, system: 'بودي / ايرباج / ابواب / مناخ',
    symptoms: ['مقاومة عالية ايرباج جانبي/طارة'],
    causes: ['شريط طارة Clock Spring'],
    dangerous: true,
    guide: {
      title: 'Airbag Resistance High — W245 (بودي / ايرباج / ابواب / مناخ)',
      steps: ['شريط طارة Clock Spring.', 'Recommended action: اقرب مركز صيانة متخصص مرسيدس.'],
      source: 'W245 community digest'
    }
  },
  { code: '9243', name: 'Airbag Resistance High',
    severity: SEV.HIGH, system: 'بودي / ايرباج / ابواب / مناخ',
    symptoms: ['مقاومة عالية ايرباج جانبي/طارة'],
    causes: ['شريط طارة Clock Spring'],
    dangerous: true,
    guide: {
      title: 'Airbag Resistance High — W245 (بودي / ايرباج / ابواب / مناخ)',
      steps: ['شريط طارة Clock Spring.', 'Recommended action: اقرب مركز صيانة متخصص مرسيدس.'],
      source: 'W245 community digest'
    }
  },
  { code: '900B', name: 'Airbag Resistance High',
    severity: SEV.HIGH, system: 'بودي / ايرباج / ابواب / مناخ',
    symptoms: ['مقاومة عالية ايرباج جانبي/طارة'],
    causes: ['شريط طارة Clock Spring'],
    dangerous: true,
    guide: {
      title: 'Airbag Resistance High — W245 (بودي / ايرباج / ابواب / مناخ)',
      steps: ['شريط طارة Clock Spring.', 'Recommended action: اقرب مركز صيانة متخصص مرسيدس.'],
      source: 'W245 community digest'
    }
  },
  { code: 'C1000', name: 'Traction Control Module Defective',
    severity: SEV.HIGH, system: 'شاسيه / ESP / BAS',
    symptoms: ['كنترول تراكشن بايظ'],
    causes: ['ESP/BAS'],
    dangerous: true,
    guide: {
      title: 'Traction Control Module Defective — W245 (شاسيه / ESP / BAS)',
      steps: ['ESP/BAS.', 'Recommended action: اقرب مركز صيانة متخصص مرسيدس.'],
      source: 'W245 community digest'
    }
  },
  { code: 'C1010', name: 'Battery Voltage Low',
    severity: SEV.MEDIUM, system: 'شاسيه / ESP / BAS',
    symptoms: ['فولت بطارية ضعيف'],
    causes: ['بطارية'],
    dangerous: false,
    guide: {
      title: 'Battery Voltage Low — W245 (شاسيه / ESP / BAS)',
      steps: ['بطارية.', 'Recommended action: اقرب مركز صيانة متخصص مرسيدس.'],
      source: 'W245 community digest'
    }
  },
  { code: 'C1011', name: 'ASR/ETS/ESP Circuit Open',
    severity: SEV.HIGH, system: 'شاسيه / ESP / BAS',
    symptoms: ['دائرة ESP مقطوعة'],
    causes: ['فيوز او ضفيرة'],
    dangerous: true,
    guide: {
      title: 'ASR/ETS/ESP Circuit Open — W245 (شاسيه / ESP / BAS)',
      steps: ['فيوز او ضفيرة.', 'Recommended action: اقرب مركز صيانة متخصص مرسيدس.'],
      source: 'W245 community digest'
    }
  },
  { code: 'C1012', name: 'Battery Voltage High',
    severity: SEV.MEDIUM, system: 'شاسيه / ESP / BAS',
    symptoms: ['فولت عالي'],
    causes: ['دينامو'],
    dangerous: false,
    guide: {
      title: 'Battery Voltage High — W245 (شاسيه / ESP / BAS)',
      steps: ['دينامو.', 'Recommended action: اقرب مركز صيانة متخصص مرسيدس.'],
      source: 'W245 community digest'
    }
  },
  { code: 'C1020', name: 'CAN Communication Fault',
    severity: SEV.MEDIUM, system: 'شاسيه / ESP / BAS',
    symptoms: ['عطل CAN عام'],
    causes: ['ضفيرة او كنترول'],
    dangerous: false,
    guide: {
      title: 'CAN Communication Fault — W245 (شاسيه / ESP / BAS)',
      steps: ['ضفيرة او كنترول.', 'Recommended action: اقرب مركز صيانة متخصص مرسيدس.'],
      source: 'W245 community digest'
    }
  },
  { code: 'C1021', name: 'CAN EA/CC/ISC Interrupted',
    severity: SEV.MEDIUM, system: 'شاسيه / ESP / BAS',
    symptoms: ['CAN مع وحدة تثبيت سرعة'],
    causes: ['مثبت سرعة'],
    dangerous: false,
    guide: {
      title: 'CAN EA/CC/ISC Interrupted — W245 (شاسيه / ESP / BAS)',
      steps: ['مثبت سرعة.', 'Recommended action: اقرب مركز صيانة متخصص مرسيدس.'],
      source: 'W245 community digest'
    }
  },
  { code: 'P0017', name: 'Crank/Cam Correlation',
    severity: SEV.MEDIUM, system: 'محرك - كاتينة',
    symptoms: ['جنزير كاتينة ممدود'],
    causes: ['شداد A2660520216 وجنزير'],
    dangerous: false,
    guide: {
      title: 'Crank/Cam Correlation — W245 (محرك - كاتينة)',
      steps: ['شداد A2660520216 وجنزير.', 'Recommended action: اقرب مركز صيانة متخصص مرسيدس.'],
      source: 'W245 community digest'
    }
  },
  { code: 'MOST ring open', name: 'MOST ring open circuit',
    severity: SEV.LOW, system: 'صوت - MOST',
    symptoms: ['حلقة فايبر مفتوحة - مفيش صوت'],
    causes: ['AGW او كابل فايبر متني - ممنوع ثني الفايبر'],
    dangerous: false,
    guide: {
      title: 'MOST ring open circuit — W245 (صوت - MOST)',
      steps: ['AGW او كابل فايبر متني - ممنوع ثني الفايبر.', 'Recommended action: اقرب مركز صيانة متخصص مرسيدس.'],
      source: 'W245 community digest'
    }
  },
];

const WORKSHOPS = [
  { name: 'El-Nasr Auto Service — Nasr City', area: 'Nasr City, Cairo', lat: 30.0566, lng: 31.3300, phone: '+201001112233', wa: '+201001112233', rating: 4.6, specialty: 'Mercedes specialist · engine & electrical' },
  { name: 'Mansour Mercedes Service — Mohandiseen', area: 'Mohandiseen, Giza', lat: 30.0444, lng: 31.2000, phone: '+201002223344', wa: '+201002223344', rating: 4.8, specialty: 'Mercedes dealer-grade diagnostics' },
  { name: 'AutoFix Downtown — Tahrir', area: 'Downtown, Cairo', lat: 30.0444, lng: 31.2357, phone: '+201003334455', wa: '+201003334455', rating: 4.3, specialty: 'General European cars · quick diagnostics' },
  { name: 'Shoubra Motor Care', area: 'Shoubra, Cairo', lat: 30.0900, lng: 31.2460, phone: '+201004445566', wa: '+201004445566', rating: 4.1, specialty: 'Brakes & suspension · same-day service' },
  { name: 'Nasr City Diesel Center', area: 'Heliopolis, Cairo', lat: 30.0908, lng: 31.3400, phone: '+201005556677', wa: '+201005556677', rating: 4.5, specialty: 'Diesel (OM640) · glow plugs & injectors' },
  { name: 'Giza Motors — Dokki', area: 'Dokki, Giza', lat: 30.0330, lng: 31.2160, phone: '+201006667788', wa: '+201006667788', rating: 4.4, specialty: 'Transmission (CVT) & general repair' }
];

/* mock current position (Tahrir Square, Cairo) — used by locator */
const ME = { lat: 30.0444, lng: 31.2357, label: 'Downtown, Cairo (demo position)' };

/* MAYDAY emergency contacts */
const MAYDAY = {
  callLabel: 'Call Roadside Assistance',
  callNumber: '+201234567890',
  waLabel: 'WhatsApp MAYDAY',
  waNumber: '+201234567890',
  waText: 'Car Assistance MAYDAY — I need roadside help with my Mercedes W245. My location: '
};

/* scripted chatbot flow (demo — no backend) */
const CHAT_SCRIPT = {
  greeting: 'Describe what your car is doing. For example: "the engine shakes at a red light" or "the check engine light is flashing".',
  quickChips: ['Engine shakes at idle', 'Check engine light is flashing', 'Long cranking before start', 'Blower only works on max speed'],
  rules: [
    {
      match: /(shake|misfire|rough|vibrat)/i,
      reply: 'Shaking at idle with a flashing check-engine lamp points to an engine misfire. On your W245 the most common cause is worn spark plugs or an ignition coil on the M266 petrol engines, or a sticking manifold flap.\n\nDiagnosis: **P0300 — Random/Multiple Cylinder Misfire** · severity HIGH.',
      code: 'P0300',
      cite: 'SOURCE: W245 COMMON-FAULTS DIGEST · R-01'
    },
    {
      match: /(flash.*(light|lamp)|check.*engine)/i,
      reply: 'A flashing check-engine lamp means an active misfire that can damage the catalytic converter. Reduce load and have it checked now. The most likely stored code is **P0300**.\n\nDiagnosis: **P0300 — Random/Multiple Cylinder Misfire** · severity HIGH.',
      code: 'P0300',
      cite: 'SOURCE: W245 COMMON-FAULTS DIGEST · R-01'
    },
    {
      match: /(crank|start.*(slow|long)|hard start)/i,
      reply: 'Long cranking on your W245 diesel (OM640 CDI) usually means glow-plug faults; on petrol it can be the cam adjuster. Both are documented W245 patterns.\n\nMost likely: **P0670 — Glow Plug Control Module** (diesel) · severity MEDIUM.',
      code: 'P0670',
      cite: 'SOURCE: DIESEL STARTING DIGEST · R-06'
    },
    {
      match: /(blower|ac|a\/c|air.*(cond|flow)|fan)/i,
      reply: 'A blower that only runs on the highest speed is the classic W245 blower-resistor failure — it is a cheap, well-documented fix.\n\nDiagnosis: **B1048 — Blower Motor Resistor** · severity LOW.',
      code: 'B1048',
      cite: 'SOURCE: HVAC & COMFORT DIGEST · R-08'
    },
    {
      match: /(esp|abs|steer|brake|warn)/i,
      reply: 'ESP/ABS lamps coming on together on the W245 is frequently the steering-angle sensor needing calibration — especially after a battery disconnect. Brakes feel normal in this case, but ESP behaviour must be treated seriously.\n\nDiagnosis: **C1095 — Steering Angle Sensor** · severity HIGH.',
      code: 'C1095',
      cite: 'SOURCE: ESP & CHASSIS ELECTRONICS DIGEST · R-07'
    },
    {
      match: /(heat|thermostat|temperature|temp)/i,
      reply: 'If the temperature never reaches 90°C and cabin heat is weak, the thermostat is stuck open — a very common M266 wear item.\n\nDiagnosis: **P0128 — Coolant Thermostat** · severity LOW.',
      code: 'P0128',
      cite: 'SOURCE: COOLING SYSTEM DIGEST · R-03'
    }
  ],
  fallback: 'I could not map that to a documented W245 fault pattern with confidence, so I will not guess. Try describing it differently, browse the fault-code list, or use the photo entry to have a dashboard warning read.'
};

/* Full technical specifications — Mercedes-Benz B-Class (W245) B150
   Source: ultimatespecs.com — B-Class (W245) B150 (2005–2008), fetched Nov 2026.
   The card in the app renders straight from this object. */
const SPECS = {
  variant: 'B150',
  title: 'Mercedes-Benz B-Class (W245) · B150',
  years: 'B150: 2005 – 2008 · W245 family: 2005 – 2011',
  source: 'ultimatespecs.com — fetched November 2026',
  key: {
    fuel: 'Petrol',
    displacement: '1,498 cm³',
    engine: 'Inline 4',
    power: '95 PS / 94 hp',
    torque: '140 Nm',
    topSpeed: '174 km/h'
  },
  sections: [
    { id: 'engine', title: 'Engine — M266 family', rows: [
      ['Engine type · layout', 'Inline 4 · transverse, front'],
      ['Displacement', '1,498 cm³ (91.4 cu-in)'],
      ['Bore × stroke', '83.0 × 69.2 mm'],
      ['Valves', '8 valves'],
      ['Compression ratio', '11.0 : 1'],
      ['Aspiration', 'Naturally aspirated'],
      ['Fuel system', 'Indirect injection · variable intake'],
      ['Max power', '95 PS / 94 hp / 70 kW @ 5,200 rpm'],
      ['Max torque', '140 Nm / 103 lb-ft @ 3,500–4,000 rpm'],
      ['Fuel type', 'Petrol']
    ]},
    { id: 'performance', title: 'Performance', rows: [
      ['Top speed', '174 km/h (108 mph)'],
      ['0 – 100 km/h', '13.2 s'],
      ['Drivetrain', 'Front-wheel drive (FWD)'],
      ['Gearbox (B150)', '5-speed manual · reverse 8.7']
    ]},
    { id: 'fuel', title: 'Fuel economy & range (NEDC)', rows: [
      ['City', '8.3 L/100 km · 28 MPG US'],
      ['Open road', '5.6 L/100 km · 42 MPG US'],
      ['Combined', '6.6 L/100 km · 36 MPG US'],
      ['Tank capacity', '54 L (14.3 US gal)'],
      ['Range', '≈ 818 km (508 miles)'],
      ['CO₂ emissions', '158 g/km']
    ]},
    { id: 'dimensions', title: 'Dimensions & weight', rows: [
      ['Length × width × height', '427.0 × 177.7 × 160.3 cm'],
      ['Wheelbase', '277.8 cm (109.4 in)'],
      ['Track front / rear', '155.6 / 155.1 cm'],
      ['Drag coefficient (Cx)', '0.30'],
      ['Curb weight', '1,300 kg (2,866 lbs)'],
      ['Weight / power', '13.7 kg per hp'],
      ['Seats', '5 · layout 2+3']
    ]},
    { id: 'capacity', title: 'Capacity', rows: [
      ['Trunk (seats up)', '458 L (16.2 cu-ft)'],
      ['Trunk (first row folded)', '1,530 L (54 cu-ft)']
    ]},
    { id: 'chassis', title: 'Brakes · wheels · suspension', rows: [
      ['Front brakes', 'Vented discs — 276 mm'],
      ['Rear brakes', 'Discs — 258 mm'],
      ['Tyres', '195/65 R15 front & rear'],
      ['Rims', '6.0" front & rear'],
      ['Steering', 'Rack and pinion — electric'],
      ['Front suspension', 'MacPherson struts · coil springs'],
      ['Rear suspension', 'Coil springs · beam axle']
    ]},
    { id: 'body', title: 'Body & production', rows: [
      ['Generation', 'W245 (sandwich floor · front-wheel drive)'],
      ['Doors', '5 doors'],
      ['Model years (B150)', '2005, 2006, 2007, 2008']
    ]}
  ],
  variants: [
    'B150 · B150 Auto', 'B160 Autotronic · B160 BlueEFFICIENCY', 'B170 · B170 Auto',
    'B180 Autotronic · B180 BlueEFFICIENCY', 'B180 CDI · B180 CDI Auto/Autotronic',
    'B200 · B200 Auto/Autotronic', 'B200 CDI · B200 CDI Auto/Autotronic',
    'B200 Turbo · B200 Turbo Auto/Autotronic'
  ]
};
