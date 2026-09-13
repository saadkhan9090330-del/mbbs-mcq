import type { Question } from "../types";

// ============================================================
// SAMPLE QUESTION BANK
// 35 original, concept-based questions (5 per subject) so the
// app has real content to test with on first run.
//
// IMPORTANT: These are original questions written for this app.
// They are NOT copied from any textbook or question bank.
// The "source" field is left empty because no real textbook
// reference applies - never fabricate a reference.
// ============================================================

const now = new Date().toISOString();

export const SAMPLE_QUESTIONS: Question[] = [
  // ---------------- MEDICINE ----------------
  {
    id: "medicine-0001",
    subject: "medicine",
    topic: "medicine__cardiology",
    subtopic: "Acute Coronary Syndrome",
    questionType: "clinical-scenario",
    question:
      "A 58-year-old man presents with crushing retrosternal chest pain radiating to the left arm for the past 2 hours, associated with sweating and nausea. ECG shows ST-segment elevation in leads II, III, and aVF. Which coronary artery is most likely occluded?",
    options: [
      { key: "A", text: "Left anterior descending artery" },
      { key: "B", text: "Right coronary artery" },
      { key: "C", text: "Left circumflex artery" },
      { key: "D", text: "Left main coronary artery" },
    ],
    correctAnswer: "B",
    explanation:
      "ST elevation in the inferior leads (II, III, aVF) corresponds to the inferior wall of the left ventricle, which is supplied by the right coronary artery (RCA) in the majority of people (right-dominant circulation).",
    clinicalPearl:
      "Inferior MI can be associated with RV infarction and bradyarrhythmias (AV block) due to RCA supplying the AV node in most patients - avoid nitrates if RV involvement is suspected.",
    optionExplanations: {
      A: "LAD occlusion causes anterior wall changes (V1-V4), not inferior changes.",
      C: "Left circumflex occlusion typically causes lateral wall changes (I, aVL, V5-V6).",
      D: "Left main occlusion is often catastrophic and causes widespread anterior and lateral changes, not isolated inferior changes.",
    },
    difficulty: "moderate",
    tags: ["ECG", "MI", "coronary anatomy"],
    createdAt: now,
  },
  {
    id: "medicine-0002",
    subject: "medicine",
    topic: "medicine__respiratory-medicine",
    subtopic: "Obstructive lung disease",
    questionType: "clinical-scenario",
    question:
      "A 62-year-old smoker with a 40 pack-year history presents with progressive dyspnea and chronic productive cough. Spirometry shows FEV1/FVC ratio of 0.55 with minimal reversibility after bronchodilator. What is the most likely diagnosis?",
    options: [
      { key: "A", text: "Asthma" },
      { key: "B", text: "Chronic obstructive pulmonary disease" },
      { key: "C", text: "Restrictive lung disease" },
      { key: "D", text: "Pulmonary embolism" },
    ],
    correctAnswer: "B",
    explanation:
      "A reduced FEV1/FVC ratio (<0.7) with poor reversibility, in a long-term smoker with chronic productive cough, is classic for COPD.",
    clinicalPearl:
      "Asthma classically shows significant reversibility (>12% and 200mL increase in FEV1) after bronchodilator, while COPD shows fixed obstruction.",
    optionExplanations: {
      A: "Asthma typically shows significant bronchodilator reversibility, which is absent here.",
      C: "Restrictive disease shows a normal or increased FEV1/FVC ratio with reduced FVC, not a reduced ratio.",
      D: "PE presents acutely with pleuritic pain/dyspnea, not chronic progressive symptoms with obstructive spirometry.",
    },
    difficulty: "easy",
    tags: ["spirometry", "COPD", "smoking"],
    createdAt: now,
  },
  {
    id: "medicine-0003",
    subject: "medicine",
    topic: "medicine__endocrinology",
    subtopic: "Diabetic emergencies",
    questionType: "clinical-scenario",
    question:
      "A 19-year-old with type 1 diabetes presents with vomiting, abdominal pain, and Kussmaul breathing. Blood glucose is 480 mg/dL, arterial pH is 7.15, and serum ketones are strongly positive. What is the most appropriate immediate first step in management?",
    options: [
      { key: "A", text: "Start IV insulin infusion immediately" },
      { key: "B", text: "Begin IV isotonic saline fluid resuscitation" },
      { key: "C", text: "Give IV sodium bicarbonate" },
      { key: "D", text: "Administer subcutaneous long-acting insulin" },
    ],
    correctAnswer: "B",
    explanation:
      "In diabetic ketoacidosis, the first priority is fluid resuscitation with isotonic saline to correct volume depletion, which also helps lower glucose and improve perfusion, before starting insulin.",
    clinicalPearl:
      "Insulin should generally be started after initial fluids have begun, and potassium must be checked before insulin is given, since insulin drives potassium into cells and can precipitate dangerous hypokalemia.",
    optionExplanations: {
      A: "Insulin is important but is given after fluid resuscitation begins, and only once potassium is known to be adequate.",
      C: "Bicarbonate is reserved for severe, life-threatening acidosis (pH <6.9) and is not routine first management.",
      D: "Subcutaneous insulin is not used in DKA due to unreliable absorption during hypoperfusion; IV insulin infusion is used instead.",
    },
    difficulty: "difficult",
    tags: ["DKA", "diabetes", "emergency"],
    createdAt: now,
  },
  {
    id: "medicine-0004",
    subject: "medicine",
    topic: "medicine__nephrology",
    subtopic: "Acute kidney injury",
    questionType: "clinical-scenario",
    question:
      "A 70-year-old man on long-term NSAIDs for osteoarthritis develops a rise in serum creatinine after starting an ACE inhibitor and a diuretic for hypertension. Which mechanism best explains this acute kidney injury?",
    options: [
      { key: "A", text: "Direct tubular toxicity from the ACE inhibitor" },
      { key: "B", text: "Impaired renal autoregulation from combined NSAID, ACE inhibitor, and diuretic use" },
      { key: "C", text: "Acute glomerulonephritis" },
      { key: "D", text: "Bilateral renal artery embolism" },
    ],
    correctAnswer: "B",
    explanation:
      "NSAIDs reduce afferent arteriolar dilation (via prostaglandin inhibition) while ACE inhibitors reduce efferent arteriolar constriction; combined with volume depletion from a diuretic, this impairs glomerular filtration pressure and precipitates AKI - the classic 'triple whammy'.",
    clinicalPearl:
      "The NSAID + ACE inhibitor/ARB + diuretic combination is a well-recognized preventable cause of AKI, especially in elderly patients - always review medication lists in unexplained AKI.",
    optionExplanations: {
      A: "ACE inhibitors are not classically directly nephrotoxic to tubules; their effect here is hemodynamic.",
      C: "There is no clinical clue (hematuria, proteinuria pattern) suggesting glomerulonephritis here.",
      D: "Embolic disease would not typically be temporally linked this precisely to starting these medications.",
    },
    difficulty: "difficult",
    tags: ["AKI", "drug interactions", "nephrology"],
    createdAt: now,
  },
  {
    id: "medicine-0005",
    subject: "medicine",
    topic: "medicine__infectious-diseases",
    subtopic: "Meningitis",
    questionType: "clinical-scenario",
    question:
      "A 22-year-old college student presents with fever, severe headache, neck stiffness, and photophobia for 12 hours. A petechial rash is noted on the trunk. What is the most appropriate immediate step before any imaging or lumbar puncture?",
    options: [
      { key: "A", text: "Start empirical IV antibiotics without delay" },
      { key: "B", text: "Wait for CT head results before giving antibiotics" },
      { key: "C", text: "Perform lumbar puncture first, then decide on antibiotics" },
      { key: "D", text: "Give oral antibiotics and reassess in the outpatient clinic" },
    ],
    correctAnswer: "A",
    explanation:
      "Suspected bacterial meningitis, especially with a petechial rash suggesting meningococcemia, is a medical emergency - empirical IV antibiotics should be started immediately without waiting for imaging or LP, as delay increases mortality.",
    clinicalPearl:
      "Never delay antibiotics for suspected bacterial meningitis to obtain imaging or LP - blood cultures can be drawn quickly beforehand, but treatment should not wait.",
    optionExplanations: {
      B: "Waiting for CT before treatment risks fatal delay; CT is only needed first if there are signs of raised ICP or focal neurological deficits, and even then antibiotics should not be withheld.",
      C: "LP can be performed if safe, but antibiotics should never be delayed to obtain it.",
      D: "Oral antibiotics and outpatient management are inappropriate for this life-threatening emergency.",
    },
    difficulty: "moderate",
    tags: ["meningitis", "emergency", "infectious disease"],
    createdAt: now,
  },

  // ---------------- SURGERY ----------------
  {
    id: "surgery-0001",
    subject: "surgery",
    topic: "surgery__general-surgery",
    subtopic: "Acute abdomen",
    questionType: "clinical-scenario",
    question:
      "A 24-year-old woman presents with periumbilical pain that has migrated to the right iliac fossa over 18 hours, with associated anorexia, low-grade fever, and localized tenderness at McBurney's point. What is the most likely diagnosis?",
    options: [
      { key: "A", text: "Acute appendicitis" },
      { key: "B", text: "Ectopic pregnancy" },
      { key: "C", text: "Acute cholecystitis" },
      { key: "D", text: "Mesenteric lymphadenitis" },
    ],
    correctAnswer: "A",
    explanation:
      "The classic history of periumbilical pain migrating to the right iliac fossa, with anorexia and McBurney's point tenderness, is the textbook presentation of acute appendicitis.",
    clinicalPearl:
      "Always exclude pregnancy with a urine hCG test in any woman of reproductive age presenting with lower abdominal pain, even when appendicitis seems clinically obvious.",
    optionExplanations: {
      B: "Ectopic pregnancy should always be excluded but classically presents with amenorrhea and may cause sudden severe pain if ruptured, not this gradual migratory pattern.",
      C: "Cholecystitis causes right upper quadrant pain, not right iliac fossa pain.",
      D: "Mesenteric lymphadenitis can mimic appendicitis but is more common in children following a viral illness, and pain is usually less localized.",
    },
    difficulty: "easy",
    tags: ["appendicitis", "acute abdomen"],
    createdAt: now,
  },
  {
    id: "surgery-0002",
    subject: "surgery",
    topic: "surgery__hepatobiliary-surgery",
    subtopic: "Biliary disease",
    questionType: "clinical-scenario",
    question:
      "A 45-year-old obese woman presents with fever, right upper quadrant pain, and jaundice. Ultrasound shows a dilated common bile duct with a stone at the distal end. What is this clinical triad called?",
    options: [
      { key: "A", text: "Charcot's triad" },
      { key: "B", text: "Virchow's triad" },
      { key: "C", text: "Beck's triad" },
      { key: "D", text: "Whipple's triad" },
    ],
    correctAnswer: "A",
    explanation:
      "Charcot's triad (fever, jaundice, right upper quadrant pain) is classically associated with ascending cholangitis due to choledocholithiasis.",
    clinicalPearl:
      "Reynold's pentad (Charcot's triad plus hypotension and altered mental status) indicates suppurative cholangitis and requires urgent biliary decompression.",
    optionExplanations: {
      B: "Virchow's triad relates to the pathogenesis of venous thrombosis (stasis, hypercoagulability, endothelial injury), unrelated to biliary disease.",
      C: "Beck's triad (hypotension, muffled heart sounds, raised JVP) is seen in cardiac tamponade.",
      D: "Whipple's triad relates to the diagnosis of hypoglycemia from insulinoma.",
    },
    difficulty: "easy",
    tags: ["cholangitis", "biliary disease"],
    createdAt: now,
  },
  {
    id: "surgery-0003",
    subject: "surgery",
    topic: "surgery__trauma",
    subtopic: "Primary survey",
    questionType: "clinical-scenario",
    question:
      "A 30-year-old man is brought to the emergency department after a road traffic accident. He is tachypneic with tracheal deviation to the left, absent breath sounds on the right, and hyper-resonance to percussion on the right chest. What is the most appropriate immediate action?",
    options: [
      { key: "A", text: "Obtain a chest X-ray to confirm diagnosis before treatment" },
      { key: "B", text: "Perform immediate needle decompression of the right chest" },
      { key: "C", text: "Perform immediate needle decompression of the left chest" },
      { key: "D", text: "Intubate the patient and wait for CT chest" },
    ],
    correctAnswer: "B",
    explanation:
      "This presentation (tracheal deviation away from the affected side, absent breath sounds, hyper-resonance) is classic for tension pneumothorax on the right side, which is a clinical diagnosis requiring immediate needle decompression, not imaging.",
    clinicalPearl:
      "Tension pneumothorax is a clinical diagnosis - do not wait for chest X-ray, as delay can be fatal from obstructive shock.",
    optionExplanations: {
      A: "Imaging must never delay treatment of a clinically diagnosed tension pneumothorax.",
      C: "Decompression should be performed on the affected (right) side, not the side the trachea has deviated toward.",
      D: "Intubation alone does not relieve a tension pneumothorax; decompression is required first.",
    },
    difficulty: "moderate",
    tags: ["trauma", "tension pneumothorax", "primary survey"],
    createdAt: now,
  },
  {
    id: "surgery-0004",
    subject: "surgery",
    topic: "surgery__urology",
    subtopic: "Renal colic",
    questionType: "clinical-scenario",
    question:
      "A 35-year-old man presents with sudden onset severe colicky left flank pain radiating to the groin, with hematuria on urinalysis. Non-contrast CT confirms a 4mm stone in the distal left ureter with mild hydronephrosis. What is the most appropriate initial management?",
    options: [
      { key: "A", text: "Immediate surgical ureterolithotomy" },
      { key: "B", text: "Conservative management with analgesia, hydration, and observation for spontaneous passage" },
      { key: "C", text: "Emergency percutaneous nephrostomy" },
      { key: "D", text: "Extracorporeal shock wave lithotripsy the same day" },
    ],
    correctAnswer: "B",
    explanation:
      "Stones smaller than 5mm have a high likelihood of spontaneous passage; in the absence of infection, uncontrolled pain, or significant obstruction, conservative management with analgesia and hydration is appropriate first-line management.",
    clinicalPearl:
      "Signs mandating urgent intervention in renal colic include infection with obstruction (infected hydronephrosis), intractable pain, or a solitary/transplanted kidney with obstruction.",
    optionExplanations: {
      A: "Surgery is reserved for stones that fail to pass or are too large, not as first-line for a small distal stone.",
      C: "Nephrostomy is reserved for infected obstructed systems or when urgent decompression is needed, not for this stable presentation.",
      D: "Lithotripsy may be considered if the stone fails to pass over several weeks, not immediately.",
    },
    difficulty: "moderate",
    tags: ["urolithiasis", "renal colic"],
    createdAt: now,
  },
  {
    id: "surgery-0005",
    subject: "surgery",
    topic: "surgery__orthopedic-surgery",
    subtopic: "Fractures",
    questionType: "clinical-scenario",
    question:
      "A 70-year-old woman falls on an outstretched hand and presents with a 'dinner fork' deformity of the wrist. X-ray shows dorsal displacement and angulation of the distal radius fragment. What is this fracture called?",
    options: [
      { key: "A", text: "Colles' fracture" },
      { key: "B", text: "Smith's fracture" },
      { key: "C", text: "Galeazzi fracture" },
      { key: "D", text: "Monteggia fracture" },
    ],
    correctAnswer: "A",
    explanation:
      "A Colles' fracture is a fracture of the distal radius with dorsal displacement/angulation, classically producing a 'dinner fork' deformity, typically from a fall on an outstretched hand.",
    clinicalPearl:
      "Smith's fracture is the reverse pattern (volar displacement) and results from a fall on a flexed wrist - the two are commonly confused.",
    optionExplanations: {
      B: "Smith's fracture has volar (palmar) displacement, opposite to what is described here.",
      C: "Galeazzi fracture involves the radius shaft with distal radioulnar joint dislocation.",
      D: "Monteggia fracture involves the proximal ulna with radial head dislocation.",
    },
    difficulty: "easy",
    tags: ["fracture", "wrist", "orthopedics"],
    createdAt: now,
  },

  // ---------------- ENT ----------------
  {
    id: "ent-0001",
    subject: "ent",
    topic: "ent__middle-ear",
    subtopic: "Otitis media",
    questionType: "clinical-scenario",
    question:
      "A 6-year-old child presents with fever and ear pain for 2 days. Otoscopy reveals a bulging, erythematous tympanic membrane with loss of the light reflex. What is the most likely diagnosis?",
    options: [
      { key: "A", text: "Acute otitis media" },
      { key: "B", text: "Otitis externa" },
      { key: "C", text: "Otosclerosis" },
      { key: "D", text: "Cholesteatoma" },
    ],
    correctAnswer: "A",
    explanation:
      "A bulging, red tympanic membrane with loss of the light reflex in a febrile child with ear pain is characteristic of acute otitis media.",
    clinicalPearl:
      "Perforation with sudden pain relief and otorrhea can occur if acute otitis media is untreated - this is not a complication to be feared but reflects natural pressure release.",
    optionExplanations: {
      B: "Otitis externa presents with pain on tragal traction and ear canal inflammation, with a normal or minimally visible tympanic membrane.",
      C: "Otosclerosis presents with gradual conductive hearing loss in adults, not acute pain and fever in a child.",
      D: "Cholesteatoma presents with chronic foul-smelling discharge and a retraction pocket, not an acute bulging drum.",
    },
    difficulty: "easy",
    tags: ["otitis media", "pediatric ENT"],
    createdAt: now,
  },
  {
    id: "ent-0002",
    subject: "ent",
    topic: "ent__nose",
    subtopic: "Epistaxis",
    questionType: "clinical-scenario",
    question:
      "A 10-year-old boy presents with recurrent mild anterior epistaxis, most often after nose picking. Examination shows dilated vessels on the anteroinferior nasal septum. What is the name of this vascular area?",
    options: [
      { key: "A", text: "Little's area" },
      { key: "B", text: "Woodruff's plexus" },
      { key: "C", text: "Kiesselbach's plexus (same as Little's area)" },
      { key: "D", text: "Both A and C refer to the same anatomical site" },
    ],
    correctAnswer: "D",
    explanation:
      "Little's area (on the anteroinferior nasal septum) is the site of Kiesselbach's plexus, an anastomosis of several arteries, and is the most common source of anterior epistaxis, especially in children.",
    clinicalPearl:
      "Woodruff's plexus, in contrast, is located posteriorly and is implicated in posterior epistaxis, which is more common in older adults with hypertension or atherosclerosis.",
    optionExplanations: {
      A: "This is correct terminology but incomplete as a standalone answer since it is the same site as Kiesselbach's plexus.",
      B: "Woodruff's plexus is a posterior site, not the one described here.",
      C: "Correct fact but the most complete answer clarifies A and C are the same site, hence D.",
    },
    difficulty: "easy",
    tags: ["epistaxis", "nasal anatomy"],
    createdAt: now,
  },
  {
    id: "ent-0003",
    subject: "ent",
    topic: "ent__larynx",
    subtopic: "Airway emergencies",
    questionType: "clinical-scenario",
    question:
      "A 4-year-old child presents with sudden onset stridor, drooling, high fever, and a preference for sitting upright leaning forward ('tripod position'). What is the most important immediate step?",
    options: [
      { key: "A", text: "Perform a thorough oral examination with a tongue depressor" },
      { key: "B", text: "Avoid distressing the child and urgently secure the airway in a controlled setting" },
      { key: "C", text: "Obtain a lateral neck X-ray before any intervention" },
      { key: "D", text: "Give oral antibiotics and reassess in 24 hours" },
    ],
    correctAnswer: "B",
    explanation:
      "This presentation is classic for acute epiglottitis, a life-threatening emergency. The child should not be examined or distressed, as this can precipitate complete airway obstruction; airway control should be secured urgently by experienced anesthesia/ENT staff in a controlled setting such as the operating room.",
    clinicalPearl:
      "Never attempt to examine the throat with a tongue depressor or lay the child down in suspected epiglottitis - this can trigger fatal laryngospasm/obstruction.",
    optionExplanations: {
      A: "Examining the oropharynx can precipitate complete airway obstruction and should be avoided.",
      C: "Imaging should never delay definitive airway management in a child with impending airway obstruction.",
      D: "Oral antibiotics and delayed reassessment are wholly inadequate for this airway emergency.",
    },
    difficulty: "difficult",
    tags: ["epiglottitis", "pediatric airway emergency"],
    createdAt: now,
  },
  {
    id: "ent-0004",
    subject: "ent",
    topic: "ent__hearing",
    subtopic: "Hearing loss assessment",
    questionType: "clinical-scenario",
    question:
      "A 40-year-old man undergoes Rinne and Weber tests. Rinne test is negative (BC > AC) in the left ear, and Weber test lateralizes to the left ear. What type of hearing loss does this indicate in the left ear?",
    options: [
      { key: "A", text: "Conductive hearing loss" },
      { key: "B", text: "Sensorineural hearing loss" },
      { key: "C", text: "Mixed hearing loss with sensorineural predominance" },
      { key: "D", text: "Normal hearing" },
    ],
    correctAnswer: "A",
    explanation:
      "A negative Rinne test (bone conduction better than air conduction) in an ear, combined with Weber lateralizing to that same ear, indicates conductive hearing loss in that ear.",
    clinicalPearl:
      "In sensorineural hearing loss, Weber lateralizes to the better (unaffected) ear, and Rinne remains positive (AC > BC) in both ears, though possibly reduced overall in the affected ear.",
    optionExplanations: {
      B: "Sensorineural loss would show Weber lateralizing away from the affected ear, not toward it.",
      C: "There is no evidence here of a sensorineural component; the pattern is purely conductive.",
      D: "A negative Rinne test is abnormal and rules out normal hearing in that ear.",
    },
    difficulty: "moderate",
    tags: ["hearing tests", "Rinne", "Weber"],
    createdAt: now,
  },
  {
    id: "ent-0005",
    subject: "ent",
    topic: "ent__paranasal-sinuses",
    subtopic: "Sinusitis",
    questionType: "clinical-scenario",
    question:
      "A 28-year-old woman presents with facial pain and pressure over the cheeks, purulent nasal discharge, and reduced sense of smell for 10 days following a viral upper respiratory infection. What is the most likely diagnosis?",
    options: [
      { key: "A", text: "Acute bacterial rhinosinusitis" },
      { key: "B", text: "Allergic rhinitis" },
      { key: "C", text: "Nasal polyposis" },
      { key: "D", text: "Trigeminal neuralgia" },
    ],
    correctAnswer: "A",
    explanation:
      "Persistent purulent discharge and facial pain beyond 7-10 days following a viral URI, without improvement, suggests acute bacterial rhinosinusitis (a viral infection is presumed if symptoms are improving by day 5-7).",
    clinicalPearl:
      "Most acute rhinosinusitis is viral and self-limiting; bacterial superinfection is suggested by symptoms persisting beyond 10 days or worsening after initial improvement ('double sickening').",
    optionExplanations: {
      B: "Allergic rhinitis typically causes clear discharge, sneezing, and itching, not purulent discharge following a recent viral illness.",
      C: "Nasal polyposis is a chronic condition, not typically preceded acutely by a viral URI in this pattern.",
      D: "Trigeminal neuralgia causes brief, severe, electric-shock-like facial pain, not this pattern of nasal symptoms.",
    },
    difficulty: "easy",
    tags: ["sinusitis", "rhinology"],
    createdAt: now,
  },

  // ---------------- OPHTHALMOLOGY ----------------
  {
    id: "ophthalmology-0001",
    subject: "ophthalmology",
    topic: "ophthalmology__glaucoma",
    subtopic: "Acute angle closure",
    questionType: "clinical-scenario",
    question:
      "A 65-year-old woman presents with sudden severe eye pain, blurred vision, halos around lights, headache, nausea, and vomiting. Examination shows a fixed, mid-dilated pupil and a red eye with a hazy cornea. Intraocular pressure is markedly elevated. What is the most likely diagnosis?",
    options: [
      { key: "A", text: "Acute angle-closure glaucoma" },
      { key: "B", text: "Primary open-angle glaucoma" },
      { key: "C", text: "Anterior uveitis" },
      { key: "D", text: "Conjunctivitis" },
    ],
    correctAnswer: "A",
    explanation:
      "Sudden severe eye pain with halos, a fixed mid-dilated pupil, corneal edema, and markedly raised intraocular pressure is the classic presentation of acute angle-closure glaucoma, an ophthalmic emergency.",
    clinicalPearl:
      "Acute angle-closure glaucoma requires urgent IOP-lowering treatment (e.g., IV acetazolamide, topical agents) followed by laser peripheral iridotomy to prevent permanent vision loss.",
    optionExplanations: {
      B: "Open-angle glaucoma is chronic and typically asymptomatic until advanced visual field loss occurs, not an acute painful presentation.",
      C: "Anterior uveitis causes pain and redness but typically with a constricted (not mid-dilated) pupil and normal or low IOP.",
      D: "Conjunctivitis causes redness and discharge but not severe pain, halos, or markedly raised IOP.",
    },
    difficulty: "moderate",
    tags: ["glaucoma", "ophthalmic emergency"],
    createdAt: now,
  },
  {
    id: "ophthalmology-0002",
    subject: "ophthalmology",
    topic: "ophthalmology__retina",
    subtopic: "Vascular occlusion",
    questionType: "clinical-scenario",
    question:
      "A 70-year-old man with atrial fibrillation presents with sudden, painless, complete loss of vision in one eye. Fundoscopy reveals a pale retina with a 'cherry-red spot' at the macula. What is the most likely diagnosis?",
    options: [
      { key: "A", text: "Central retinal artery occlusion" },
      { key: "B", text: "Central retinal vein occlusion" },
      { key: "C", text: "Retinal detachment" },
      { key: "D", text: "Vitreous hemorrhage" },
    ],
    correctAnswer: "A",
    explanation:
      "Sudden painless monocular vision loss with a pale retina and cherry-red spot at the macula (due to the thin fovea allowing the underlying choroidal circulation to show through) is classic for central retinal artery occlusion, often embolic in origin (e.g., from atrial fibrillation).",
    clinicalPearl:
      "Central retinal artery occlusion is often described as a 'stroke of the eye' and shares the same time-critical urgency and vascular risk factor workup as cerebral stroke.",
    optionExplanations: {
      B: "Central retinal vein occlusion causes a 'blood and thunder' fundus appearance with widespread hemorrhages, not a cherry-red spot.",
      C: "Retinal detachment classically causes floaters, flashes, and a curtain-like visual field loss, not a cherry-red spot.",
      D: "Vitreous hemorrhage causes sudden floaters and visual loss but with a hazy, not pale, fundus view.",
    },
    difficulty: "moderate",
    tags: ["retinal occlusion", "sudden vision loss"],
    createdAt: now,
  },
  {
    id: "ophthalmology-0003",
    subject: "ophthalmology",
    topic: "ophthalmology__cornea",
    subtopic: "Keratitis",
    questionType: "clinical-scenario",
    question:
      "A contact lens wearer presents with a painful red eye, photophobia, and a corneal ulcer with a hypopyon. What is the most appropriate immediate management?",
    options: [
      { key: "A", text: "Topical steroids alone" },
      { key: "B", text: "Urgent ophthalmology referral for corneal scraping and empirical topical antibiotics" },
      { key: "C", text: "Patching the eye and reassessing in one week" },
      { key: "D", text: "Oral antihistamines" },
    ],
    correctAnswer: "B",
    explanation:
      "A corneal ulcer with hypopyon in a contact lens wearer suggests microbial (often bacterial, including Pseudomonas) keratitis, a sight-threatening emergency requiring urgent ophthalmology referral, corneal scraping for culture, and empirical intensive topical antibiotics.",
    clinicalPearl:
      "Contact lens wearers are at particular risk of Pseudomonas keratitis, which can progress rapidly and cause corneal perforation if not treated promptly.",
    optionExplanations: {
      A: "Steroids alone in an undiagnosed infective corneal ulcer can worsen infection and are contraindicated before/without antimicrobial cover.",
      C: "Patching an infected eye can worsen bacterial keratitis by creating a warm, moist environment; delay risks perforation.",
      D: "Antihistamines have no role in treating microbial keratitis.",
    },
    difficulty: "moderate",
    tags: ["keratitis", "contact lens", "corneal ulcer"],
    createdAt: now,
  },
  {
    id: "ophthalmology-0004",
    subject: "ophthalmology",
    topic: "ophthalmology__lens",
    subtopic: "Cataract",
    questionType: "single-best-answer",
    question:
      "Which of the following is the most common type of age-related cataract affecting the central part of the lens and often causing early difficulty with near vision improving paradoxically ('second sight')?",
    options: [
      { key: "A", text: "Nuclear sclerotic cataract" },
      { key: "B", text: "Cortical cataract" },
      { key: "C", text: "Posterior subcapsular cataract" },
      { key: "D", text: "Congenital cataract" },
    ],
    correctAnswer: "A",
    explanation:
      "Nuclear sclerotic cataracts increase the refractive power of the lens, causing a myopic shift that can temporarily improve near vision in presbyopic patients - the phenomenon known as 'second sight'.",
    clinicalPearl:
      "Posterior subcapsular cataracts, in contrast, cause disproportionate glare and difficulty with reading/bright light, and are associated with steroid use and diabetes.",
    optionExplanations: {
      B: "Cortical cataracts cause spoke-like opacities and glare but are not classically associated with the 'second sight' phenomenon.",
      C: "Posterior subcapsular cataracts cause early glare and reading difficulty, not improved near vision.",
      D: "Congenital cataracts are present at birth or infancy, unrelated to this age-related presentation.",
    },
    difficulty: "moderate",
    tags: ["cataract", "lens"],
    createdAt: now,
  },
  {
    id: "ophthalmology-0005",
    subject: "ophthalmology",
    topic: "ophthalmology__squint",
    subtopic: "Strabismus",
    questionType: "single-best-answer",
    question:
      "In a child with suspected strabismus, the corneal light reflex test (Hirschberg test) is used to assess ocular alignment. What does an asymmetric corneal light reflex indicate?",
    options: [
      { key: "A", text: "Manifest squint (tropia)" },
      { key: "B", text: "Normal binocular vision" },
      { key: "C", text: "Refractive error only, with no misalignment" },
      { key: "D", text: "Amblyopia without any misalignment" },
    ],
    correctAnswer: "A",
    explanation:
      "The Hirschberg corneal reflex test assesses ocular alignment by observing the position of a light reflex on each cornea; asymmetry indicates a manifest deviation (tropia), i.e., true strabismus.",
    clinicalPearl:
      "The cover-uncover test is used alongside the Hirschberg test to distinguish manifest (tropia) from latent (phoria) squints.",
    optionExplanations: {
      B: "Normal binocular vision would show a symmetric, centered light reflex in both eyes.",
      C: "Refractive error alone does not cause asymmetry of the corneal light reflex.",
      D: "Amblyopia is a consequence that can result from strabismus but the light reflex test specifically detects misalignment, not amblyopia itself.",
    },
    difficulty: "easy",
    tags: ["strabismus", "pediatric ophthalmology"],
    createdAt: now,
  },

  // ---------------- GYNECOLOGY ----------------
  {
    id: "gynecology-0001",
    subject: "gynecology",
    topic: "gynecology__pelvic-inflammatory-disease",
    subtopic: "PID",
    questionType: "clinical-scenario",
    question:
      "A 24-year-old sexually active woman presents with lower abdominal pain, fever, and cervical motion tenderness on bimanual examination, along with purulent cervical discharge. What is the most likely diagnosis?",
    options: [
      { key: "A", text: "Pelvic inflammatory disease" },
      { key: "B", text: "Ovarian torsion" },
      { key: "C", text: "Endometriosis" },
      { key: "D", text: "Uterine fibroid degeneration" },
    ],
    correctAnswer: "A",
    explanation:
      "Lower abdominal pain with fever, cervical motion tenderness, and purulent discharge in a sexually active woman is characteristic of pelvic inflammatory disease, usually due to ascending infection (commonly Chlamydia or Gonorrhea).",
    clinicalPearl:
      "Cervical motion tenderness ('chandelier sign') is a key clinical finding supporting PID and prompts empirical antibiotic treatment even before culture results return, given the risk of tubal damage and infertility if untreated.",
    optionExplanations: {
      B: "Ovarian torsion presents with sudden severe unilateral pain, often with nausea/vomiting, and typically without fever or discharge.",
      C: "Endometriosis presents with chronic cyclical pain, not an acute febrile illness with discharge.",
      D: "Fibroid degeneration can cause acute pain but not typically with purulent discharge and cervical motion tenderness.",
    },
    difficulty: "easy",
    tags: ["PID", "pelvic pain"],
    createdAt: now,
  },
  {
    id: "gynecology-0002",
    subject: "gynecology",
    topic: "gynecology__menstrual-disorders",
    subtopic: "Abnormal uterine bleeding",
    questionType: "clinical-scenario",
    question:
      "A 45-year-old woman presents with heavy, irregular menstrual bleeding for 6 months. Transvaginal ultrasound shows a thickened endometrium. What is the most appropriate next investigation to exclude endometrial pathology?",
    options: [
      { key: "A", text: "Endometrial biopsy" },
      { key: "B", text: "Repeat ultrasound in 6 months" },
      { key: "C", text: "Serum CA-125" },
      { key: "D", text: "Diagnostic laparoscopy" },
    ],
    correctAnswer: "A",
    explanation:
      "In a woman over 40-45 with abnormal uterine bleeding and a thickened endometrium, endometrial biopsy (or hysteroscopy with biopsy) is indicated to exclude endometrial hyperplasia or carcinoma.",
    clinicalPearl:
      "Any postmenopausal bleeding warrants endometrial assessment regardless of endometrial thickness, given the risk of malignancy.",
    optionExplanations: {
      B: "Simply repeating ultrasound delays diagnosis of a potentially serious underlying pathology.",
      C: "CA-125 is a nonspecific tumor marker more relevant to ovarian pathology, not a first-line test for endometrial evaluation.",
      D: "Laparoscopy is used to evaluate pelvic/adnexal pathology or endometriosis, not to sample the endometrium.",
    },
    difficulty: "moderate",
    tags: ["abnormal uterine bleeding", "endometrial pathology"],
    createdAt: now,
  },
  {
    id: "gynecology-0003",
    subject: "gynecology",
    topic: "gynecology__ovarian-disorders",
    subtopic: "Ovarian torsion",
    questionType: "clinical-scenario",
    question:
      "A 19-year-old woman presents with sudden onset severe unilateral pelvic pain, nausea, and vomiting. Ultrasound shows an enlarged ovary with absent Doppler flow. What is the most appropriate management?",
    options: [
      { key: "A", text: "Emergency surgical exploration for detorsion" },
      { key: "B", text: "Oral analgesia and outpatient follow-up" },
      { key: "C", text: "Combined oral contraceptive pills" },
      { key: "D", text: "Observation with repeat ultrasound in 48 hours" },
    ],
    correctAnswer: "A",
    explanation:
      "Ovarian torsion is a surgical emergency; sudden severe unilateral pain with an enlarged ovary and absent Doppler flow requires urgent surgical exploration to detorse the ovary and preserve viability, ideally within hours of symptom onset.",
    clinicalPearl:
      "Ovarian viability can sometimes be preserved even after several hours of torsion, so surgery should not be delayed based on symptom duration alone.",
    optionExplanations: {
      B: "Delaying definitive treatment risks ovarian necrosis and loss of the ovary.",
      C: "Hormonal treatment has no role in acute ovarian torsion.",
      D: "Observation risks progression to irreversible ischemia and loss of the ovary.",
    },
    difficulty: "difficult",
    tags: ["ovarian torsion", "gynecologic emergency"],
    createdAt: now,
  },
  {
    id: "gynecology-0004",
    subject: "gynecology",
    topic: "gynecology__fibroids",
    subtopic: "Uterine leiomyoma",
    questionType: "single-best-answer",
    question:
      "Which of the following is the most common benign tumor of the female genital tract?",
    options: [
      { key: "A", text: "Uterine leiomyoma (fibroid)" },
      { key: "B", text: "Ovarian cystadenoma" },
      { key: "C", text: "Endometrial polyp" },
      { key: "D", text: "Cervical polyp" },
    ],
    correctAnswer: "A",
    explanation:
      "Uterine leiomyomas (fibroids) are the most common benign tumors of the female genital tract, arising from smooth muscle of the myometrium.",
    clinicalPearl:
      "Fibroids are estrogen-dependent and typically regress after menopause, but rapid growth in a postmenopausal woman should raise suspicion for leiomyosarcoma.",
    optionExplanations: {
      B: "Ovarian cystadenomas are common ovarian tumors but not as common overall as uterine fibroids.",
      C: "Endometrial polyps are common but less prevalent than fibroids.",
      D: "Cervical polyps are relatively common but not the most common benign genital tract tumor overall.",
    },
    difficulty: "easy",
    tags: ["fibroids", "leiomyoma"],
    createdAt: now,
  },
  {
    id: "gynecology-0005",
    subject: "gynecology",
    topic: "gynecology__menopause",
    subtopic: "Menopause diagnosis",
    questionType: "single-best-answer",
    question:
      "A 50-year-old woman has had no menstrual periods for 14 months and reports hot flashes and vaginal dryness. Which hormonal finding would be most consistent with menopause?",
    options: [
      { key: "A", text: "Elevated FSH and LH with low estradiol" },
      { key: "B", text: "Low FSH and LH with high estradiol" },
      { key: "C", text: "Normal FSH with elevated prolactin" },
      { key: "D", text: "Low FSH with low estradiol" },
    ],
    correctAnswer: "A",
    explanation:
      "Menopause results from ovarian follicular depletion, leading to low estradiol and loss of negative feedback, causing compensatory elevation of FSH and LH.",
    clinicalPearl:
      "Menopause is a clinical diagnosis after 12 months of amenorrhea in a woman of the appropriate age; hormone testing is not usually required but can support the diagnosis in ambiguous cases.",
    optionExplanations: {
      B: "This pattern would suggest ongoing ovarian estrogen production, inconsistent with menopause.",
      C: "Elevated prolactin suggests a separate pathology (e.g., prolactinoma) causing secondary amenorrhea, not typical menopause.",
      D: "Low FSH with low estradiol would suggest a hypothalamic-pituitary cause of amenorrhea, not primary ovarian failure/menopause.",
    },
    difficulty: "moderate",
    tags: ["menopause", "reproductive endocrinology"],
    createdAt: now,
  },

  // ---------------- OBSTETRICS ----------------
  {
    id: "obstetrics-0001",
    subject: "obstetrics",
    topic: "obstetrics__preeclampsia",
    subtopic: "Hypertensive disorders of pregnancy",
    questionType: "clinical-scenario",
    question:
      "A 32-year-old primigravida at 34 weeks gestation presents with blood pressure of 160/110 mmHg, proteinuria on urine dipstick, and a severe headache. What is the most appropriate immediate management priority?",
    options: [
      { key: "A", text: "Control blood pressure and give magnesium sulfate for seizure prophylaxis" },
      { key: "B", text: "Immediate cesarean section regardless of maternal stabilization" },
      { key: "C", text: "Discharge home with outpatient blood pressure monitoring" },
      { key: "D", text: "Start oral iron supplementation" },
    ],
    correctAnswer: "A",
    explanation:
      "This presentation is consistent with severe preeclampsia. Immediate priorities are controlling severe hypertension (to prevent stroke) and administering magnesium sulfate for seizure (eclampsia) prophylaxis, before proceeding to delivery planning.",
    clinicalPearl:
      "Magnesium sulfate is used for seizure prophylaxis in severe preeclampsia/eclampsia, not as an antihypertensive - blood pressure is controlled separately with agents like labetalol or hydralazine.",
    optionExplanations: {
      B: "Delivery is often indicated but only after initial maternal stabilization (BP control, seizure prophylaxis); rushing to delivery without stabilization risks maternal harm.",
      C: "This presentation (severe range BP, proteinuria, headache) requires admission and urgent treatment, not outpatient monitoring.",
      D: "Iron supplementation is irrelevant to this acute hypertensive emergency.",
    },
    difficulty: "difficult",
    tags: ["preeclampsia", "obstetric emergency"],
    createdAt: now,
  },
  {
    id: "obstetrics-0002",
    subject: "obstetrics",
    topic: "obstetrics__postpartum-hemorrhage",
    subtopic: "PPH management",
    questionType: "clinical-scenario",
    question:
      "A woman has a vaginal delivery followed by heavy bleeding estimated at 900mL within 30 minutes. On examination, the uterus is soft and boggy. What is the most likely cause of this postpartum hemorrhage?",
    options: [
      { key: "A", text: "Uterine atony" },
      { key: "B", text: "Retained placental fragments" },
      { key: "C", text: "Genital tract trauma" },
      { key: "D", text: "Coagulopathy" },
    ],
    correctAnswer: "A",
    explanation:
      "A soft, boggy uterus after delivery with heavy bleeding is the classic finding of uterine atony, the most common cause of primary postpartum hemorrhage, resulting from failure of the myometrium to contract adequately.",
    clinicalPearl:
      "The 'four T's' of PPH causes are Tone (atony - most common), Trauma, Tissue (retained products), and Thrombin (coagulopathy) - uterine massage and uterotonics are first-line for atony.",
    optionExplanations: {
      B: "Retained fragments can cause PPH but would not typically present with such a diffusely boggy, atonic uterus as the primary sign; atony is more specifically suggested.",
      C: "Trauma-related bleeding typically occurs with a well-contracted (firm) uterus, since the source is a laceration rather than the uterine cavity.",
      D: "Coagulopathy is a less common cause and would be suspected if bleeding continued despite a well-contracted uterus and no identifiable trauma.",
    },
    difficulty: "moderate",
    tags: ["PPH", "uterine atony"],
    createdAt: now,
  },
  {
    id: "obstetrics-0003",
    subject: "obstetrics",
    topic: "obstetrics__fetal-distress",
    subtopic: "Cardiotocography interpretation",
    questionType: "clinical-scenario",
    question:
      "During labor, a cardiotocograph shows repetitive late decelerations with reduced baseline variability. What does this pattern most likely indicate?",
    options: [
      { key: "A", text: "Fetal hypoxia/uteroplacental insufficiency" },
      { key: "B", text: "Normal fetal sleep cycle" },
      { key: "C", text: "Umbilical cord compression only" },
      { key: "D", text: "Maternal fever without fetal compromise" },
    ],
    correctAnswer: "A",
    explanation:
      "Late decelerations (onset after the peak of a contraction, with a delayed return to baseline) combined with reduced variability are concerning signs of fetal hypoxia due to uteroplacental insufficiency, and warrant urgent assessment and likely expedited delivery.",
    clinicalPearl:
      "Variable decelerations (not late decelerations) are classically associated with umbilical cord compression, while late decelerations point toward placental insufficiency.",
    optionExplanations: {
      B: "A normal fetal sleep cycle would show reduced variability but not repetitive late decelerations.",
      C: "Cord compression classically produces variable, not late, decelerations.",
      D: "Maternal fever alone would not explain this specific CTG pattern of hypoxia.",
    },
    difficulty: "difficult",
    tags: ["CTG", "fetal distress"],
    createdAt: now,
  },
  {
    id: "obstetrics-0004",
    subject: "obstetrics",
    topic: "obstetrics__antenatal-care",
    subtopic: "Screening",
    questionType: "single-best-answer",
    question:
      "At what gestational age is the oral glucose tolerance test typically performed for routine screening of gestational diabetes in an average-risk pregnancy?",
    options: [
      { key: "A", text: "24-28 weeks" },
      { key: "B", text: "8-10 weeks" },
      { key: "C", text: "36-38 weeks" },
      { key: "D", text: "At the first antenatal visit only" },
    ],
    correctAnswer: "A",
    explanation:
      "Routine screening for gestational diabetes with an oral glucose tolerance test is typically performed at 24-28 weeks gestation in average-risk pregnancies, when insulin resistance from placental hormones is more pronounced.",
    clinicalPearl:
      "Women with high-risk factors (e.g., obesity, prior gestational diabetes, family history) may be screened earlier, in the first trimester, with repeat testing at 24-28 weeks if the initial test is normal.",
    optionExplanations: {
      B: "This is too early for standard screening in an average-risk pregnant woman.",
      C: "This is beyond the standard screening window and would delay diagnosis and management.",
      D: "Screening only at the first visit would miss the physiological insulin resistance that develops later in pregnancy.",
    },
    difficulty: "easy",
    tags: ["gestational diabetes", "antenatal screening"],
    createdAt: now,
  },
  {
    id: "obstetrics-0005",
    subject: "obstetrics",
    topic: "obstetrics__malpresentation",
    subtopic: "Breech presentation",
    questionType: "clinical-scenario",
    question:
      "A woman at 36 weeks gestation is found to have a breech presentation on examination, confirmed by ultrasound. There are no contraindications. What is the most appropriate next step in management?",
    options: [
      { key: "A", text: "Offer external cephalic version" },
      { key: "B", text: "Schedule immediate cesarean section" },
      { key: "C", text: "Reassure and reassess only at term" },
      { key: "D", text: "Induce labor immediately" },
    ],
    correctAnswer: "A",
    explanation:
      "In an uncomplicated breech presentation at or near 36-37 weeks without contraindications, external cephalic version (ECV) should be offered to attempt to turn the fetus to a cephalic presentation and reduce the likelihood of cesarean delivery.",
    clinicalPearl:
      "ECV has a reasonable success rate and is generally safe when performed by trained practitioners with facilities available for emergency delivery if needed, given a small risk of complications like fetal distress.",
    optionExplanations: {
      B: "Cesarean section is one management option for persistent breech at term, but ECV should be offered first when there are no contraindications.",
      C: "Simple reassurance and delay ignores the opportunity for ECV, which is most effective when offered around 36-37 weeks.",
      D: "Inducing labor with a breech presentation is not standard first-line management.",
    },
    difficulty: "moderate",
    tags: ["breech", "external cephalic version"],
    createdAt: now,
  },

  // ---------------- COMMUNITY MEDICINE ----------------
  {
    id: "community-medicine-0001",
    subject: "community-medicine",
    topic: "community-medicine__epidemiology",
    subtopic: "Study design",
    questionType: "single-best-answer",
    question:
      "A researcher wants to study the association between smoking and lung cancer by comparing the smoking history of patients with lung cancer to that of matched controls without lung cancer. What type of study design is this?",
    options: [
      { key: "A", text: "Case-control study" },
      { key: "B", text: "Cohort study" },
      { key: "C", text: "Randomized controlled trial" },
      { key: "D", text: "Cross-sectional study" },
    ],
    correctAnswer: "A",
    explanation:
      "A study that starts with cases (disease present) and controls (disease absent) and looks back at exposure history is a case-control study, which is well suited to studying rare diseases like many cancers.",
    clinicalPearl:
      "Case-control studies measure the odds ratio as their primary measure of association, whereas cohort studies can directly measure relative risk/incidence.",
    optionExplanations: {
      B: "A cohort study would start with exposed and unexposed groups and follow them forward over time to see who develops disease.",
      C: "An RCT involves random allocation of an intervention, which is not applicable to studying smoking exposure retrospectively.",
      D: "A cross-sectional study measures exposure and outcome at a single point in time, not by selecting based on disease status and looking back.",
    },
    difficulty: "easy",
    tags: ["epidemiology", "study design"],
    createdAt: now,
  },
  {
    id: "community-medicine-0002",
    subject: "community-medicine",
    topic: "community-medicine__biostatistics",
    subtopic: "Screening test statistics",
    questionType: "single-best-answer",
    question:
      "A new screening test for a disease has high sensitivity but low specificity. What is the main practical consequence of using this test in a population with low disease prevalence?",
    options: [
      { key: "A", text: "A high number of false positive results" },
      { key: "B", text: "A high number of false negative results" },
      { key: "C", text: "The test will miss most true cases" },
      { key: "D", text: "The positive predictive value will be very high" },
    ],
    correctAnswer: "A",
    explanation:
      "Low specificity means the test frequently gives positive results in people without the disease, leading to a high number of false positives, especially problematic when disease prevalence is low, as positive predictive value drops sharply.",
    clinicalPearl:
      "High sensitivity tests are good for 'ruling out' disease (SnNout) when negative, while high specificity tests are good for 'ruling in' disease (SpPin) when positive.",
    optionExplanations: {
      B: "High sensitivity means the test rarely misses true cases, so false negatives are low, not high.",
      C: "High sensitivity means the test correctly identifies most true cases, not that it misses them.",
      D: "Low specificity combined with low prevalence typically leads to a low, not high, positive predictive value.",
    },
    difficulty: "moderate",
    tags: ["biostatistics", "screening", "PPV"],
    createdAt: now,
  },
  {
    id: "community-medicine-0003",
    subject: "community-medicine",
    topic: "community-medicine__immunization",
    subtopic: "National immunization schedule",
    questionType: "single-best-answer",
    question:
      "Which type of immunity is provided by administering a vaccine to a healthy individual to stimulate their own immune system to produce antibodies?",
    options: [
      { key: "A", text: "Active artificial immunity" },
      { key: "B", text: "Passive artificial immunity" },
      { key: "C", text: "Active natural immunity" },
      { key: "D", text: "Passive natural immunity" },
    ],
    correctAnswer: "A",
    explanation:
      "Vaccination stimulates the individual's own immune system to produce antibodies, which is termed active artificial immunity, as opposed to naturally acquiring immunity through actual infection.",
    clinicalPearl:
      "Passive artificial immunity refers to administering preformed antibodies (e.g., immunoglobulin), which gives immediate but short-lived protection, unlike the longer-lasting protection from active immunization.",
    optionExplanations: {
      B: "Passive artificial immunity involves giving preformed antibodies, not stimulating the person's own immune response.",
      C: "Active natural immunity results from actually contracting and recovering from a natural infection, not from vaccination.",
      D: "Passive natural immunity refers to antibodies transferred naturally, such as from mother to fetus/infant.",
    },
    difficulty: "easy",
    tags: ["immunization", "immunity types"],
    createdAt: now,
  },
  {
    id: "community-medicine-0004",
    subject: "community-medicine",
    topic: "community-medicine__maternal-and-child-health",
    subtopic: "Maternal mortality",
    questionType: "single-best-answer",
    question:
      "The maternal mortality ratio is defined as the number of maternal deaths per how many live births, over a specified time period?",
    options: [
      { key: "A", text: "100,000 live births" },
      { key: "B", text: "1,000 live births" },
      { key: "C", text: "10,000 live births" },
      { key: "D", text: "1,000,000 live births" },
    ],
    correctAnswer: "A",
    explanation:
      "The maternal mortality ratio (MMR) is conventionally expressed as the number of maternal deaths per 100,000 live births during a given time period, reflecting the risk of death once a woman becomes pregnant.",
    clinicalPearl:
      "This differs from the infant mortality rate, which is conventionally expressed per 1,000 live births - a common source of confusion in exams.",
    optionExplanations: {
      B: "1,000 live births is the denominator used for infant mortality rate, not maternal mortality ratio.",
      C: "10,000 is not the standard denominator used for MMR.",
      D: "1,000,000 is not the standard denominator used for MMR.",
    },
    difficulty: "easy",
    tags: ["maternal mortality", "health indicators"],
    createdAt: now,
  },
  {
    id: "community-medicine-0005",
    subject: "community-medicine",
    topic: "community-medicine__nutrition",
    subtopic: "Protein-energy malnutrition",
    questionType: "clinical-scenario",
    question:
      "A 2-year-old child presents with bilateral pitting pedal edema, a distended abdomen, thin discolored hair, and skin changes, but relatively preserved subcutaneous fat. What is the most likely diagnosis?",
    options: [
      { key: "A", text: "Kwashiorkor" },
      { key: "B", text: "Marasmus" },
      { key: "C", text: "Vitamin A deficiency" },
      { key: "D", text: "Rickets" },
    ],
    correctAnswer: "A",
    explanation:
      "Kwashiorkor is a form of severe protein-energy malnutrition characterized by edema, a distended abdomen (often from hepatomegaly/ascites), hair changes, and skin lesions, typically with relative preservation of subcutaneous fat, due to predominant protein deficiency relative to calorie intake.",
    clinicalPearl:
      "Marasmus, in contrast, is characterized by severe wasting with loss of both fat and muscle without edema, reflecting an overall deficiency of calories and protein.",
    optionExplanations: {
      B: "Marasmus presents with severe wasting and loss of subcutaneous fat, without the edema described here.",
      C: "Vitamin A deficiency primarily causes ocular findings like night blindness and xerophthalmia, not this constellation of edema and hair/skin changes.",
      D: "Rickets presents with bony deformities from vitamin D deficiency, not with edema and hair changes as described.",
    },
    difficulty: "moderate",
    tags: ["malnutrition", "pediatric nutrition"],
    createdAt: now,
  },
];
