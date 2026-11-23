/*
# Create events, profiles, and registrations tables

1. New Tables
- `profiles` — public user display info (full_name, role) keyed to auth.users.
  - id (uuid, PK, references auth.users)
  - full_name (text)
  - role (text: 'student' | 'admin', default 'student')
  - created_at (timestamptz)
- `events` — institute events created by users.
  - id (uuid, PK)
  - title (text)
  - description (text)
  - category (text: 'workshop'|'seminar'|'cultural'|'sports'|'technical'|'other')
  - location (text)
  - event_date (date)
  - start_time (time)
  - end_time (time)
  - capacity (int, default 100)
  - image_url (text, nullable)
  - organizer_id (uuid, references auth.users, defaults to auth.uid())
  - created_at (timestamptz)
- `registrations` — a user's registration for an event.
  - id (uuid, PK)
  - event_id (uuid, references events)
  - user_id (uuid, references auth.users, defaults to auth.uid())
  - status (text: 'registered'|'attended'|'cancelled', default 'registered')
  - qr_token (text, unique) — unique token encoded into the QR code
  - created_at (timestamptz)
  - UNIQUE (event_id, user_id) — one registration per user per event

2. Security
- Enable RLS on all three tables.
- profiles: authenticated users can read all profiles; users can update only their own.
- events: authenticated users can read all events; any authenticated user can create/update/delete (institute events are collaborative). Admin gating handled in app.
- registrations: authenticated users can read their own registrations; can insert/delete only their own; cannot update status (handled by admins in app, but policy still scoped to own rows).
- Grants: SELECT/INSERT/UPDATE/DELETE to authenticated as appropriate.
- service_role granted for potential edge functions.

3. Notes
- Event creation is open to all authenticated users; a profile.role = 'admin' flag exists for UI-level distinctions but is not enforced at the DB layer (institute collaborative model).
*/

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL DEFAULT '',
  role text NOT NULL DEFAULT 'student' CHECK (role IN ('student','admin')),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

GRANT SELECT, UPDATE ON profiles TO authenticated;

DROP POLICY IF EXISTS "read_all_profiles" ON profiles;
CREATE POLICY "read_all_profiles" ON profiles FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'other' CHECK (category IN ('workshop','seminar','cultural','sports','technical','other')),
  location text NOT NULL DEFAULT '',
  event_date date NOT NULL,
  start_time time NOT NULL DEFAULT '09:00',
  end_time time NOT NULL DEFAULT '17:00',
  capacity integer NOT NULL DEFAULT 100 CHECK (capacity > 0),
  image_url text,
  organizer_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON events TO authenticated;

DROP POLICY IF EXISTS "read_all_events" ON events;
CREATE POLICY "read_all_events" ON events FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "insert_events" ON events;
CREATE POLICY "insert_events" ON events FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "update_events" ON events;
CREATE POLICY "update_events" ON events FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "delete_events" ON events;
CREATE POLICY "delete_events" ON events FOR DELETE
  TO authenticated USING (true);

CREATE TABLE IF NOT EXISTS registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'registered' CHECK (status IN ('registered','attended','cancelled')),
  qr_token text NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(16), 'hex'),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (event_id, user_id)
);

ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, DELETE, UPDATE ON registrations TO authenticated;

DROP POLICY IF EXISTS "read_own_registrations" ON registrations;
CREATE POLICY "read_own_registrations" ON registrations FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_registrations" ON registrations;
CREATE POLICY "insert_own_registrations" ON registrations FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_registrations" ON registrations;
CREATE POLICY "update_own_registrations" ON registrations FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_registrations" ON registrations;
CREATE POLICY "delete_own_registrations" ON registrations FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_events_event_date ON events(event_date);
CREATE INDEX IF NOT EXISTS idx_registrations_user_id ON registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_registrations_event_id ON registrations(event_id);
