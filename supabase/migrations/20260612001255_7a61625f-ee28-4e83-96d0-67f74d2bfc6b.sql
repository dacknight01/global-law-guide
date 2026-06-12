INSERT INTO public.law_cards (slug, title, country, category, summary, full_explanation, rights, what_to_do, search_terms)
VALUES (
  'tenant-rights-no-lease',
  'What rights do tenants have without a written lease?',
  'global',
  'housing',
  'Even without a signed lease, renters who pay rent and live in a home usually have legal protections. Most places treat the arrangement as a month-to-month tenancy with basic rights to notice, habitable conditions, and privacy.',
  'When you rent a home without signing a written lease, the law in most countries still treats you as a tenant. Paying rent and being allowed to live in the property is usually enough to create a verbal or implied tenancy.

In practice, this means the landlord cannot simply force you out overnight. Most jurisdictions require written notice — often 30 days, sometimes more — before ending a month-to-month tenancy. Some places require a court order before any eviction.

You also keep the right to a safe, habitable home: working plumbing, heating where required, locks, and freedom from serious health hazards. Landlords generally cannot enter without reasonable notice except in emergencies.

If the landlord took a deposit, that money typically still belongs to you and must be returned (minus lawful deductions) when you move out. Keep receipts, text messages, and bank transfers — they help prove the tenancy existed.

Rules vary by country, state, and city — check your local source for exact notice periods and procedures.',
  '- Right to written notice before being asked to leave (length varies by location).
- Right to a habitable home — working utilities, locks, basic safety.
- Right to privacy — landlord must give reasonable notice before entering.
- Right to get your deposit back, minus lawful deductions.
- Right to not be evicted by force, threats, or lockouts without a legal process.',
  '- Keep written proof of the tenancy: rent receipts, bank transfers, text messages, photos of the home.
- Ask for any agreement in writing going forward, even a short text confirming rent and move-in date.
- If asked to leave, request the notice in writing and check your local minimum notice period.
- If the landlord changes locks, shuts off utilities, or threatens you, contact a local tenant rights or legal aid service.
- Before withholding rent for repairs, check what your local rules actually allow — withholding incorrectly can be used against you.',
  'tenant rights no lease verbal agreement month to month renter protections without written lease'
)
ON CONFLICT DO NOTHING;