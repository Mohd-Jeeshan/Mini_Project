/*
# Make events.organizer_id nullable

1. Changes
- ALTER TABLE events ALTER COLUMN organizer_id DROP NOT NULL.
2. Rationale
- Pre-seeded campus events (GCET) are created by the system, not by a signed-in
  user, so they have no organizer. Allowing NULL lets us seed canonical campus
  events that every signed-in user can browse and register for.
3. Security
- No policy changes. RLS still gates reads to authenticated users; inserts by
  authenticated users still default organizer_id to auth.uid().
*/

ALTER TABLE events ALTER COLUMN organizer_id DROP NOT NULL;
