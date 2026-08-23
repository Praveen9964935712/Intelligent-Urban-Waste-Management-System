import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout";

const defaultPreferences = { notifications: true, autoRefresh: true };

function SettingsPage() {
  const [searchParams] = useSearchParams();
  const section = searchParams.get("section") || "preferences";
  const [preferences, setPreferences] = useState(() => {
    try {
      return { ...defaultPreferences, ...JSON.parse(localStorage.getItem("cleancity.preferences") || "{}") };
    } catch {
      return defaultPreferences;
    }
  });
  const [saved, setSaved] = useState(false);
  const [profileName, setProfileName] = useState(() => localStorage.getItem("name") || "Admin");

  const updatePreference = (field) => {
    setPreferences((current) => ({ ...current, [field]: !current[field] }));
    setSaved(false);
  };

  const savePreferences = (event) => {
    event.preventDefault();
    localStorage.setItem("cleancity.preferences", JSON.stringify(preferences));
    setSaved(true);
  };

  const saveProfile = (event) => {
    event.preventDefault();
    localStorage.setItem("name", profileName.trim() || "Admin");
    setSaved(true);
  };

  return (
    <AdminLayout>
      <main className="admin-module-placeholder">
        <section className="admin-module-hero">
          <span className="admin-module-eyebrow">System / Settings</span>
          <h1>Settings</h1>
          <p>Manage workspace preferences and operational defaults for CleanCity.</p>
        </section>
        <section className="admin-module-empty settings-panel">
          {section === "profile" ? (
            <form className="settings-form" onSubmit={saveProfile}>
              <h2>Profile settings</h2>
              <label>Display name<input value={profileName} onChange={(event) => { setProfileName(event.target.value); setSaved(false); }} required /></label>
              <p>Your login email and role are managed by your account administrator.</p>
              <button type="submit">Save profile</button>
              {saved && <p role="status">Profile saved.</p>}
            </form>
          ) : (
            <form className="settings-form" onSubmit={savePreferences}>
              <h2>Preferences</h2>
              <label><input type="checkbox" checked={preferences.notifications} onChange={() => updatePreference("notifications")} /> Enable operational notifications</label>
              <label><input type="checkbox" checked={preferences.autoRefresh} onChange={() => updatePreference("autoRefresh")} /> Refresh dashboard data automatically</label>
              <button type="submit">Save preferences</button>
              {saved && <p role="status">Preferences saved.</p>}
            </form>
          )}
        </section>
      </main>
    </AdminLayout>
  );
}

export default SettingsPage;
