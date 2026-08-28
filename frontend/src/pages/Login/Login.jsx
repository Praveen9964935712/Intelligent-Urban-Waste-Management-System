import "./Login.css";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Recycle,
  ShieldCheck
} from "lucide-react";

import { loginUser, registerCitizen, requestPasswordOtp, resetPassword } from "../../services/authService";

function Login() {

  const navigate = useNavigate();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [registration, setRegistration] = useState({ name: "", phone: "" });
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [registrationRole, setRegistrationRole] = useState("CITIZEN");
  const [isResetting, setIsResetting] = useState(false);
  const [otpRequested, setOtpRequested] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState("EMAIL");
  const [otp, setOtp] = useState("");

  const handleLogin = async (e) => {

    e.preventDefault();
    if (isSubmitting) return;

    setError("");
    setIsSubmitting(true);

    try {
      const data = await loginUser(email, password);
      const token = data.token?.trim();
      const role = data.role?.trim().toUpperCase();
      if (!token || !["ADMIN", "STAFF", "CITIZEN"].includes(role)) {
        throw new Error("Login response contains an invalid role");
      }

      localStorage.setItem(
        "token",
        token
      );

      localStorage.setItem(
        "role",
        role
      );

      localStorage.setItem(
        "name",
        data.name
      );

      if (role === "ADMIN") {

        navigate(
          "/admin/dashboard"
        );

      } else if (role === "STAFF") {
        navigate("/staff/dashboard");
      } else {

        navigate(
          "/citizen/dashboard"
        );
      }

    } catch (requestError) {
      const status = requestError.response?.status;
      const serverMessage = requestError.response?.data?.message;
      setError(serverMessage || (status ? `Login failed (${status}). Please verify your credentials.` : "Unable to reach the login service."));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegistration = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setError("");
    setRegistrationComplete(false);
    setIsSubmitting(true);
    try {
      await registerCitizen({ name: registration.name, email, password, phone: registration.phone, role: registrationRole });
      setIsRegistering(false);
      setRegistrationComplete(true);
      setPassword("");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to create your account.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setError("");
    setIsSubmitting(true);
    try {
      if (!otpRequested) {
        await requestPasswordOtp({ email, method: deliveryMethod });
        setOtpRequested(true);
      } else {
        await resetPassword({ email, otp, newPassword: password });
        setIsResetting(false);
        setOtpRequested(false);
        setRegistrationComplete(true);
        setPassword("");
        setOtp("");
      }
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.message || "Unable to reset your password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateRegistration = (field, value) => setRegistration((current) => ({ ...current, [field]: value }));
  const beginRegistration = (role) => {
    setIsRegistering(true);
    setIsResetting(false);
    setRegistrationRole(role);
    setError("");
    setRegistrationComplete(false);
  };

  return (

    <main className="login-container">
      <section className="login-brand-panel" aria-labelledby="brand-title">
        <div className="brand-panel-content">
          <div className="brand-lockup"><span className="brand-mark"><Recycle size={22} strokeWidth={2.5} /></span><span>CleanCity</span></div>
          <div className="brand-copy">
            <p className="eyebrow">CITY OPERATIONS PLATFORM</p>
            <h1 id="brand-title">A cleaner city starts with better coordination.</h1>
            <p className="brand-description">Intelligent tools for the teams keeping every street, service, and community moving forward.</p>
          </div>
          <div className="feature-list">
            <div className="feature-item"><span className="feature-icon"><ShieldCheck size={19} /></span><span><strong>Smart Complaint Management</strong><small>Resolve issues with clarity and speed.</small></span></div>
            <div className="feature-item"><span className="feature-icon"><Activity size={19} /></span><span><strong>Workforce &amp; Task Coordination</strong><small>Keep field teams aligned in real time.</small></span></div>
            <div className="feature-item"><span className="feature-icon"><Recycle size={19} /></span><span><strong>City Operations Analytics</strong><small>Turn daily activity into better decisions.</small></span></div>
          </div>
        </div>
        <div className="city-grid" aria-hidden="true"><span /><span /><span /></div>
        <p className="brand-footer">INTELLIGENT URBAN WASTE MANAGEMENT SYSTEM</p>
      </section>

      <section className="login-right" aria-label="Sign in">
        <div className="login-card">
          <div className="mobile-brand-lockup"><span className="brand-mark"><Recycle size={19} strokeWidth={2.5} /></span><span>CleanCity</span></div>
          <div className="login-heading"><p className="eyebrow">{isRegistering ? `${registrationRole} ACCESS` : isResetting ? "ACCOUNT RECOVERY" : "SECURE ACCESS"}</p><h2>{isRegistering ? `Create a ${registrationRole.toLowerCase()} account` : isResetting ? "Reset your password" : "Welcome back"}</h2><p>{isRegistering ? "Register to access the CleanCity platform." : isResetting ? "Choose where to receive a one-time verification code." : "Sign in to continue to your operations dashboard."}</p></div>
          <form className="login-form" onSubmit={isRegistering ? handleRegistration : isResetting ? handlePasswordReset : handleLogin}>
            {isRegistering && <div className="field-group"><label htmlFor="name">Full name</label><div className="input-wrapper"><input id="name" type="text" placeholder="Your name" value={registration.name} autoComplete="name" required onChange={(e) => updateRegistration("name", e.target.value)} /></div></div>}
            <div className="field-group"><label htmlFor="email">Email address</label><div className="input-wrapper"><Mail size={18} aria-hidden="true" /><input id="email" type="email" placeholder="you@example.com" value={email} autoComplete="email" required onChange={(e) => setEmail(e.target.value)} /></div></div>
            {isRegistering && <div className="field-group"><label htmlFor="phone">Phone <span className="optional-label">(optional)</span></label><div className="input-wrapper"><input id="phone" type="tel" placeholder="Your phone number" value={registration.phone} autoComplete="tel" onChange={(e) => updateRegistration("phone", e.target.value)} /></div></div>}
            {isResetting && !otpRequested && <div className="field-group"><label htmlFor="delivery-method">Send code by</label><select id="delivery-method" value={deliveryMethod} onChange={(e) => setDeliveryMethod(e.target.value)}><option value="EMAIL">Email</option><option value="SMS">SMS</option></select></div>}
            {isResetting && otpRequested && <div className="field-group"><label htmlFor="otp">One-time code</label><div className="input-wrapper"><input id="otp" inputMode="numeric" pattern="[0-9]{6}" placeholder="Enter 6-digit code" value={otp} required onChange={(e) => setOtp(e.target.value)} /></div></div>}
            {(!isResetting || otpRequested) && <div className="field-group"><label htmlFor="password">{isResetting ? "New password" : "Password"}</label><div className="input-wrapper"><LockKeyhole size={18} aria-hidden="true" /><input id="password" type={showPassword ? "text" : "password"} placeholder="Enter your password" value={password} autoComplete={isRegistering || isResetting ? "new-password" : "current-password"} required minLength={6} onChange={(e) => setPassword(e.target.value)} /><button className="visibility-button" type="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></div>}
            {error && <div className="error" role="alert"><span>!</span>{error}</div>}
            {registrationComplete && <div className="success" role="status">Account created. You can now sign in.</div>}
            <button className="submit-button" type="submit" disabled={isSubmitting}>{isSubmitting ? (isRegistering ? "Creating account..." : isResetting ? (otpRequested ? "Resetting password..." : "Sending code...") : "Signing in...") : (isRegistering ? `Create ${registrationRole.toLowerCase()} account` : isResetting ? (otpRequested ? "Reset password" : "Send verification code") : "Sign in")}{!isSubmitting && <ArrowRight size={18} />}</button>
          </form>
          <div className="login-links">
            {isRegistering ? <button type="button" onClick={() => { setIsRegistering(false); setError(""); setRegistrationComplete(false); }}>Already have an account? Sign in</button> : <button type="button" onClick={() => beginRegistration("CITIZEN")}>Need a citizen account? Sign up</button>}
            {!isRegistering && !isResetting && <button type="button" onClick={() => { setIsResetting(true); setError(""); setRegistrationComplete(false); }}>Forgot your password?</button>}
            {isResetting && <button type="button" onClick={() => { setIsResetting(false); setOtpRequested(false); setError(""); }}>Back to sign in</button>}
          </div>
          <div className="login-assurance"><Check size={16} /> Protected municipal operations access</div>
        </div>
      </section>

    </main>
  );
}

export default Login;