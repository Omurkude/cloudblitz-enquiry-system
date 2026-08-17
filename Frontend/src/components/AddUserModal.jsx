import { useState } from "react";
import { api } from "../services/api";
import { useToast } from "../context/ToastContext";
import { X, Loader2, UserPlus, Mail, Lock, ShieldCheck } from "lucide-react";

const AddUserModal = ({ isOpen, onClose, onSuccess }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("staff");
  const [fieldErrors, setFieldErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { showSuccess, showError } = useToast();

  if (!isOpen) return null;

  const validateForm = () => {
    const errors = {};
    if (!name.trim()) {
      errors.name = "Name is required";
    } else if (name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters";
    }

    if (!email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Invalid email format";
    }

    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");

    if (!validateForm() || submitting) return;

    setSubmitting(true);

    try {
      const res = await api.createUser({
        name: name.trim(),
        email: email.trim(),
        password,
        role,
      });

      if (res.success) {
        showSuccess("User created successfully!");
        setName("");
        setEmail("");
        setPassword("");
        setRole("staff");
        setFieldErrors({});

        onSuccess();
        onClose();
      }
    } catch (err) {
      setApiError(err.message || "Failed to create user.");
      showError(err.message || "Failed to create user.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2 text-white font-bold text-lg">
            <div className="p-2 bg-indigo-600/20 text-indigo-400 rounded-lg">
              <UserPlus className="w-5 h-5" />
            </div>
            Create System User
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition p-1.5 rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {apiError && (
          <div className="mt-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-sm">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4" noValidate>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (fieldErrors.name)
                  setFieldErrors((prev) => ({ ...prev, name: "" }));
              }}
              className={`w-full px-3.5 py-2.5 bg-slate-800 border ${
                fieldErrors.name ? "border-rose-500" : "border-slate-700"
              } rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              placeholder="Jane Staff"
            />
            {fieldErrors.name && (
              <p className="mt-1 text-xs text-rose-400">{fieldErrors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (fieldErrors.email)
                    setFieldErrors((prev) => ({ ...prev, email: "" }));
                }}
                className={`w-full pl-9 pr-3.5 py-2.5 bg-slate-800 border ${
                  fieldErrors.email ? "border-rose-500" : "border-slate-700"
                } rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                placeholder="jane@cloudblitz.com"
              />
            </div>
            {fieldErrors.email && (
              <p className="mt-1 text-xs text-rose-400">{fieldErrors.email}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (fieldErrors.password)
                      setFieldErrors((prev) => ({ ...prev, password: "" }));
                  }}
                  className={`w-full pl-9 pr-3.5 py-2.5 bg-slate-800 border ${
                    fieldErrors.password
                      ? "border-rose-500"
                      : "border-slate-700"
                  } rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  placeholder="Min 6 characters"
                />
              </div>
              {fieldErrors.password && (
                <p className="mt-1 text-xs text-rose-400">
                  {fieldErrors.password}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                User Role *
              </label>
              <div className="relative">
                <ShieldCheck className="w-4 h-4 text-slate-500 absolute left-3 top-3 pointer-events-none" />
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="staff">Staff Member</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-indigo-500/25 disabled:opacity-60 transition"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create User"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserModal;
