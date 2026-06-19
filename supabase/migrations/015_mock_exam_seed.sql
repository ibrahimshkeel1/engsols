-- Seed a published FE Mechanical practice exam for Step 4 mock exam UI

insert into mock_exams (
  slug,
  title,
  discipline,
  exam_type,
  description,
  duration_minutes,
  passing_score,
  published,
  questions
)
values (
  'fe-mechanical-practice',
  'FE Mechanical Practice Exam',
  'Mechanical',
  'FE',
  'Timed multiple-choice practice covering statics, dynamics, thermodynamics, and materials — aligned with NCEES FE Mechanical specifications.',
  45,
  70,
  true,
  $json$[
    {
      "id": "q1",
      "prompt": "A simply supported beam of length L carries a uniformly distributed load w. Which expression gives the maximum bending moment at midspan?",
      "options": [
        "M = wL / 8",
        "M = wL² / 8",
        "M = wL / 4",
        "M = wL² / 4"
      ],
      "correct_index": 1,
      "code_reference": "NCEES FE Reference Handbook — Mechanics of Materials: beams, uniform load, M_max = wL²/8 at center for simply supported UDL.",
      "explanation": "For a simply supported beam with UDL w, the maximum moment occurs at midspan: M = wL²/8."
    },
    {
      "id": "q2",
      "prompt": "An ideal gas undergoes an isothermal expansion. Which statement is correct?",
      "options": [
        "Temperature increases",
        "Internal energy remains constant",
        "Enthalpy always decreases",
        "Entropy remains constant"
      ],
      "correct_index": 1,
      "code_reference": "NCEES FE Reference Handbook — Thermodynamics: ideal gas, isothermal process ΔU = 0.",
      "explanation": "For an ideal gas, internal energy depends only on temperature; isothermal ⇒ ΔU = 0."
    },
    {
      "id": "q3",
      "prompt": "A block on a 30° incline begins to slide when the coefficient of static friction μ_s equals:",
      "options": [
        "0.50",
        "0.58",
        "0.87",
        "1.00"
      ],
      "correct_index": 1,
      "code_reference": "NCEES FE Reference Handbook — Statics: incline plane, tan(θ) = μ_s at impending motion.",
      "explanation": "tan(30°) ≈ 0.577 — the coefficient of static friction at slide initiation."
    },
    {
      "id": "q4",
      "prompt": "Which stress state describes a material under equal normal stresses in all directions with zero shear?",
      "options": [
        "Plane stress",
        "Hydrostatic stress",
        "Pure shear",
        "Uniaxial stress"
      ],
      "correct_index": 1,
      "code_reference": "NCEES FE Reference Handbook — Mechanics of Materials: hydrostatic (spherical) stress state.",
      "explanation": "Equal normal stresses with no shear define a hydrostatic stress state."
    },
    {
      "id": "q5",
      "prompt": "In a Rankine cycle, the purpose of the condenser is to:",
      "options": [
        "Increase turbine inlet temperature",
        "Reject heat and condense exhaust steam",
        "Compress the working fluid isentropically",
        "Superheat steam before the turbine"
      ],
      "correct_index": 1,
      "code_reference": "NCEES FE Reference Handbook — Thermodynamics: power cycles, condenser function.",
      "explanation": "The condenser rejects heat to the surroundings and condenses turbine exhaust to liquid."
    }
  ]$json$::jsonb
)
on conflict (slug) do update set
  title = excluded.title,
  description = excluded.description,
  duration_minutes = excluded.duration_minutes,
  passing_score = excluded.passing_score,
  published = excluded.published,
  questions = excluded.questions,
  updated_at = now();
