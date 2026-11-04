# Roadmap

## Phase 1: Real data
- Google Health API (the legacy Fitbit Web API is being decommissioned). Sign in with Google OAuth 2.0 in the system browser, then read steps, sleep, heart rate and activity.
- Wrap data access in one adapter so the UI never calls the vendor directly.
- OAuth tokens belong on a small backend (never in the app bundle).

## Phase 2: Scripture
- YouVersion Platform: Verse of the Day, Bible reader SDK, reading plans, Sign in with YouVersion.
- Register for an app key at the YouVersion Platform developer dashboard. Terms are non-commercial.
- Keep the 10 built-in devotionals as offline fallback and as Temple's own voice.

## Phase 3: Nutrition and coaching
- Photo meal logging (camera plus a food-recognition or vision model), barcode lookup.
- Weekly coach summary from the user's own trends.

## Phase 4: Polish
- Progress photos, "Our journey" milestones, notifications, Play Store release (signed AAB).
