-- Remove demo/seed content that was synced from the old mock data files.
-- Safe to run multiple times (deletes by known demo slugs only).

-- Forum replies cascade from posts
delete from forum_posts where slug in (
  'break-into-reservoir-engineering',
  'iwcf-level-4-prep',
  'fe-exam-structural-depth',
  'offshore-rotation-schedules',
  'eclipse-vs-cmg',
  'production-engineer-interview',
  'pe-experience-documentation',
  'permian-salary-expectations',
  'hazop-entry-level',
  'subsea-vs-onshore-career',
  'mining-to-oil-gas-switch',
  'grad-school-petroleum-phd',
  'artificial-lift-selection',
  'electrical-pe-power-exam',
  'aramco-vs-international-majors'
);

delete from news_articles where slug in (
  'permian-hiring-surge-2026',
  'fe-exam-civil-changes-2026',
  'north-sea-subsea-projects'
);

-- Demo mentor profiles (not linked to real auth users from onboarding)
delete from mentor_profiles where slug in (
  'james-whitfield',
  'priya-nair',
  'fatima-al-rashid',
  'marcus-chen',
  'elena-volkov',
  'david-okonkwo',
  'carlos-mendez',
  'michael-oconnor',
  'sophie-laurent',
  'ahmed-hassan',
  'rachel-kim',
  'thomas-brennan',
  'yuki-tanaka',
  'nina-petrov',
  'lucia-fernandez',
  'henrik-larsen',
  'anna-kowalski',
  'robert-nguyen',
  'samuel-adeyemi',
  'isabelle-martin',
  'vikram-patel',
  'laura-simmons'
);
