import type { Subject } from "../types";

// Helper to slugify names into stable ids, e.g. "General Medicine" -> "general-medicine"
function slug(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function makeSubject(name: string, topicNames: string[]): Subject {
  const subjectId = slug(name);
  return {
    id: subjectId,
    name,
    topics: topicNames.map((t) => ({ id: `${subjectId}__${slug(t)}`, name: t })),
  };
}

export const DEFAULT_SUBJECTS: Subject[] = [
  makeSubject("Medicine", [
    "General Medicine",
    "Cardiology",
    "Respiratory Medicine",
    "Gastroenterology",
    "Neurology",
    "Nephrology",
    "Endocrinology",
    "Rheumatology",
    "Hematology",
    "Infectious Diseases",
    "Dermatology",
  ]),
  makeSubject("Surgery", [
    "General Surgery",
    "GI Surgery",
    "Hepatobiliary Surgery",
    "Urology",
    "Neurosurgery",
    "Orthopedic Surgery",
    "Vascular Surgery",
    "Breast Surgery",
    "Pediatric Surgery",
    "Trauma",
  ]),
  makeSubject("ENT", [
    "External Ear",
    "Middle Ear",
    "Internal Ear",
    "Hearing",
    "Vestibular System",
    "Nose",
    "Paranasal Sinuses",
    "Pharynx",
    "Larynx",
    "Head and Neck",
  ]),
  makeSubject("Ophthalmology", [
    "Eye Anatomy",
    "Optics and Refraction",
    "Cornea",
    "Lens",
    "Glaucoma",
    "Retina",
    "Uvea",
    "Neuro-ophthalmology",
    "Squint",
    "Ocular Trauma",
  ]),
  makeSubject("Gynecology", [
    "Menstrual Disorders",
    "Infertility",
    "Pelvic Inflammatory Disease",
    "Uterovaginal Prolapse",
    "Fibroids",
    "Endometriosis",
    "Ovarian Disorders",
    "Cervical Disorders",
    "Vaginal Disorders",
    "Menopause",
    "Gynecological Oncology",
  ]),
  makeSubject("Obstetrics", [
    "Antenatal Care",
    "Normal Labour",
    "Abnormal Labour",
    "Preeclampsia",
    "Eclampsia",
    "Antepartum Hemorrhage",
    "Postpartum Hemorrhage",
    "Multiple Pregnancy",
    "Malpresentation",
    "Malposition",
    "Fetal Distress",
    "Operative Obstetrics",
    "Puerperium",
  ]),
  makeSubject("Community Medicine", [
    "Epidemiology",
    "Biostatistics",
    "Screening",
    "Health Education",
    "Demography",
    "Maternal and Child Health",
    "Immunization",
    "Communicable Diseases",
    "Noncommunicable Diseases",
    "Environmental Health",
    "Nutrition",
    "Occupational Health",
  ]),
];
