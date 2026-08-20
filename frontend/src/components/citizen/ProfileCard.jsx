import { Mail, Pencil, Phone, UserRound } from "lucide-react";

function ProfileCard({ profile, editing, form, onChange, onEdit, onCancel, onSave, saving }) {
  if (!profile) return null;
  return <section className="citizen-panel profile-card"><div className="citizen-panel-heading"><div><span className="citizen-eyebrow">Your account</span><h2>Profile</h2></div>{!editing && <button type="button" className="text-action" onClick={onEdit}><Pencil size={15} /> Edit</button>}</div>{editing ? <form className="profile-form" onSubmit={onSave}><label>Name<input required value={form.name} onChange={(event) => onChange("name", event.target.value)} /></label><label>Email<input required type="email" value={form.email} onChange={(event) => onChange("email", event.target.value)} /></label><label>Phone<input value={form.phone || ""} onChange={(event) => onChange("phone", event.target.value)} /></label><div className="profile-form-actions"><button type="button" className="secondary-action" onClick={onCancel}>Cancel</button><button type="submit" className="primary-action" disabled={saving}>{saving ? "Saving..." : "Save changes"}</button></div></form> : <div className="profile-details"><div><UserRound size={17} /><span><small>Name</small>{profile.name}</span></div><div><Mail size={17} /><span><small>Email</small>{profile.email}</span></div><div><Phone size={17} /><span><small>Phone</small>{profile.phone || "Not provided"}</span></div></div>}</section>;
}

export default ProfileCard;
