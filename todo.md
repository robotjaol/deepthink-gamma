# DeepThink: MVP Migration Roadmap

This document is a detailed, step-by-step roadmap for migrating the DeepThink prototype from a dummy-data-driven application to a production-ready Minimum Viable Product (MVP) using Supabase as the backend.

**Current State:** The application is a functional prototype using dummy data (`constants.ts`), `localStorage` for state persistence, and an insecure, client-side API key.

**Target State:** A secure, scalable, and fully functional application where all data and business logic are handled by Supabase.

---

## Phase 1: MVP Migration Checklist

### Step 1: Environment & Configuration (Security First)
- [ ] **Create `.env.local` File:** In the project root, create a file named `.env.local`.
- [ ] **Add Environment Variables:** Populate `.env.local` with your credentials from Supabase and Google.
    ```
    # Supabase Project URL and Anon Key
    REACT_APP_SUPABASE_URL=https://<your-project-ref>.supabase.co
    REACT_APP_SUPABASE_ANON_KEY=<your-anon-key>

    # Google Gemini API Key
    REACT_APP_API_KEY=<your-gemini-api-key>
    ```
- [ ] **Update Supabase Client:** In `lib/supabaseClient.ts`, replace the hardcoded strings with the environment variables.
- [ ] **Update Gemini Service:** In `services/geminiService.ts`, remove the hardcoded `API_KEY` and replace it with `process.env.REACT_APP_API_KEY`.
- [ ] **Add `.env.local` to `.gitignore`:** Ensure this file is never committed to version control.
- [ ] **Configure Deployment Environment:** Add these same environment variables to your hosting provider's settings (e.g., Vercel, Netlify).

### Step 2: Backend Schema Setup
- [ ] **Initialize Supabase Project:** In your Supabase project's SQL Editor, copy and run the entire script from the project's `supabase.md` file. This will create all necessary tables, types, policies, and triggers.
- [ ] **Verify Schema:** Briefly check the tables in the Supabase UI to ensure they've been created correctly.
- [ ] **Set up Storage:** In the Supabase UI, create a public bucket named `profile_pictures`. Apply the RLS policies from `supabase.md` to secure uploads.

### Step 3: Authentication Overhaul
- **Objective:** Replace all dummy authentication with Supabase Auth.
- **File to Refactor:** `contexts/AuthContext.tsx`
    - [ ] **Listen for Auth State Changes:** Use `supabase.auth.onAuthStateChange` inside a `useEffect` to set the user state application-wide, replacing the `useState<User | null>`. Fetch the user's profile from the `users` table upon successful login.
    - [ ] **Implement `login`:** Replace the hardcoded check with a call to `supabase.auth.signInWithPassword`.
    - [ ] **Implement `signup`:** Replace the dummy logic with `supabase.auth.signUp`. Pass the user's full name in the `options.data` object to populate the `users` table via the `handle_new_user` trigger.
    - [ ] **Implement `logout`:** Replace `setUser(null)` with `supabase.auth.signOut`.
    - [ ] **Implement `updateUserProfile`:** This function should now perform an `update` operation on the `users` table for the authenticated user.
    - [ ] **Implement `sendPasswordResetEmail`**: Use `supabase.auth.resetPasswordForEmail`.
    - [ ] **Implement `getToken`**: Use `supabase.auth.getSession` to retrieve the real JWT for authenticated API calls.

### Step 4: Feature-by-Feature Data Migration
- **Objective:** Systematically remove all dummy data imports and `localStorage` usage, replacing them with live Supabase queries.

- [ ] **Scenarios & Challenges (`contexts/ScenarioContext.tsx`, `pages/ScenarioPage.tsx`, `pages/ChallengePage.tsx`)**
    - [ ] **Refactor `ScenarioContext`:**
        - Remove dummy data.
        - Implement functions to fetch `myScenarios` (from `custom_scenarios` where `user_id` matches) and `publishedChallenges` (from `custom_scenarios` where `is_published` is true).
        - Implement `addMyScenario` to `insert` into `custom_scenarios`.
        - Implement `removeMyScenario` to `delete` from `custom_scenarios`.
        - Implement `publishScenario` to `update` the `is_published` flag.
    - [ ] **Refactor `ScenarioPage`:**
        - Remove import of `DUMMY_SCENARIOS`.
        - In a `useEffect`, fetch official scenarios using `supabase.from('scenarios').select('*')`.
    - [ ] **Refactor `ChallengePage`:**
        - Remove all dummy data dependencies; rely entirely on `useScenarios()` context.

- [ ] **Leaderboard (`pages/dashboard/LeaderboardPage.tsx`)**
    - [ ] Remove imports of `DUMMY_LEADERBOARD` and related constants.
    - [ ] Fetch data by querying the `leaderboard` table, joining with `users` to get profile details, and ordering by `points`.

- [ ] **History (`pages/dashboard/HistoryPage.tsx`)**
    - [ ] Remove import of `DUMMY_HISTORY`.
    - [ ] Fetch session history for the logged-in user with `supabase.from('sessions').select('*').eq('user_id', auth.uid())`.

- [ ] **Notes (`pages/dashboard/NotesPage.tsx`)**
    - [ ] Remove import of `DUMMY_NOTES`.
    - [ ] **Read:** Fetch notes with `supabase.from('notes').select('*').eq('user_id', auth.uid())`.
    - [ ] **Create/Update (`handleSaveNote`):** Use `supabase.from('notes').upsert(...)`.
    - [ ] **Delete (`confirmDelete`):** Use `supabase.from('notes').delete().eq('id', noteId)`.

- [ ] **Badges (`pages/dashboard/BadgesPage.tsx`)**
    - [ ] Remove imports of `DUMMY_BADGES` and `DUMMY_USER_BADGES`.
    - [ ] Fetch all badge definitions from the `badges` table.
    - [ ] Fetch the user's earned badges from the `user_badges` table to determine which are unlocked.

- [ ] **User Settings (`pages/dashboard/UserSettingsPage.tsx`)**
    - [ ] **Profile Updates:** The `handleSubmit` function should call `supabase.from('users').update({ name, hobbies, contacts }).eq('id', user.id)`.
    - [ ] **Profile Picture (`handlePictureSave`):** The logic for uploading to Supabase Storage is correct, ensure it points to the right bucket.

- [ ] **Task Hub (`pages/dashboard/DevelopmentPage.tsx`)**
    - [ ] **Remove `localStorage`:** Delete all `localStorage.getItem` and `localStorage.setItem` calls.
    - [ ] **State Initialization:**
        - [ ] Fetch tasks from the `tasks` table where `user_id` matches the logged-in user.
        - [ ] Fetch user progress (`level`, `xp`) from the `leaderboard` table.
    - [ ] **CRUD Operations:**
        - [ ] `handleSaveTask`: Use `supabase.from('tasks').upsert(...)`.
        - [ ] `handleDeleteTask`: Use `supabase.from('tasks').delete()`.
        - [ ] `updateTaskStatus`: Use `supabase.from('tasks').update({ status: newStatus }).eq('id', id)`. This will trigger the `on-task-complete` Edge Function if the status is 'Done'.

### Step 5: Server-Side Logic (Edge Functions)
- **Objective:** Deploy Supabase Edge Functions to handle secure, critical business logic. The client should **never** award points or badges directly.

- [ ] **`on-session-complete` Function:**
    - [ ] **Client-Side Change (`ScenarioSessionPage.tsx`):** After receiving the analysis report from Gemini, the **only** action is to insert the new session record into the `sessions` table.
    - [ ] **Deploy Edge Function:** Create and deploy the Supabase Function. It will be triggered by the `sessions` table insert.
    - [ ] **Function Logic:**
        1.  Read the `final_score` and `analysis_report` from the new session row.
        2.  Update the user's `points` and `daily_streak` in the `leaderboard` table.
        3.  Check if any badge criteria are met and insert into `user_badges`.
        4.  Update skill XP based on strengths from the analysis (Post-MVP).
        5.  Check for and update `daily_quests` progress.

- [ ] **`on-task-complete` Function:**
    - [ ] **Client-Side Change (`DevelopmentPage.tsx`):** The client simply updates the task's status to 'Done'.
    - [ ] **Deploy Edge Function:** Create and deploy the function, triggered on `tasks` table updates.
    - [ ] **Function Logic:**
        1.  Read the task's `xp` value.
        2.  Update `dev_xp` and handle level-ups in the `leaderboard` table.
        3.  Award any relevant development-specific badges.

- [ ] **Stripe & Other Functions:**
    - [ ] Deploy the `create-checkout-session` and `stripe-webhook` functions.
    - [ ] Implement and schedule the `weekly-league-reset` function via the Supabase dashboard cron jobs.

### Step 6: Code Cleanup
- [ ] **Remove `constants.ts`:** Once all `DUMMY_` data imports are removed from the application, this file can be deleted.
- [ ] **Remove `MasteryPage.tsx`:** As this feature is on hold, remove the component and its route from `App.tsx` to simplify the UI.

---

## Phase 2: Post-MVP Feature Enhancements

- [ ] **Team Management Dashboard:** For Enterprise clients, build a dashboard for managers to track their team's progress.
- [ ] **Advanced Filtering & Sorting:** Add more robust controls on the Scenario, History, and Task Hub pages.
- [ ] **Command Palette:** Introduce a `Cmd+K` style command palette for quick navigation.
- [ ] **Web Push Notifications:** Implement notifications for task reminders or league updates.
- [ ] **Re-introduce Mastery/Skill Tree:** Connect skill tree data to Supabase and award XP based on session performance.

---

## Phase 3: Long-Term Vision

- [ ] **Native Mobile Application**
- [ ] **Collaborative Multi-User Scenarios**
- [ ] **Scenario Marketplace (Voting & Featured)**
- [ ] **AI-Driven Adaptive Learning Paths**