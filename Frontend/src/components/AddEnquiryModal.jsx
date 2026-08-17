import { useState, useEffect } from "react";
import { api } from "../services/api";
import { useToast } from "../context/ToastContext";
import {
  X,
  Loader2,
  UserPlus,
  Mail,
  Phone,
  MessageSquare,
  UserCheck,
} from "lucide-react";

const AddEnquiryModal = ({ isOpen, onClose, onSuccess }) => {
  const [customerName, setCustomerName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("New");
  const [assignedTo, setAssignedTo] = useState("");
  const [assignees, setAssignees] = useState([]);
  const [fieldErrors, setFieldErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { showSuccess, showError } = useToast();

  useEffect(() => {
    if (isOpen) {
      // Fetch assignees
      api
        .getAssignees()
        .then((res) => {
          if (res.success) {
            setAssignees(res.users || []);
          }
        })
        .catch(() => {});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const validateForm = () => {
    const errors = {};
    if (!customerName.trim()) {
      errors.customerName = "Customer name is required";
    } else if (customerName.trim().length < 2) {
      errors.customerName = "Name must be at least 2 characters";
    }

    if (!email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Invalid email format";
    }

    if (!phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (phone.trim().length < 7) {
      errors.phone = "Phone must be at least 7 characters";
    }

    if (!message.trim()) {
      errors.message = "Message is required";
    } else if (message.trim().length < 5) {
      errors.message = "Message must be at least 5 characters";
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
      const payload = {
        customerName: customerName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        message: message.trim(),
        status,
        assignedTo: assignedTo || null,
      };

      const res = await api.createEnquiry(payload);

      if (res.success) {
        showSuccess("Enquiry created successfully!");
        // Reset form
        setCustomerName("");
        setEmail("");
        setPhone("");
        setMessage("");
        setStatus("New");
        setAssignedTo("");
        setFieldErrors({});

        onSuccess();
        onClose();
      }
    } catch (err) {
      setApiError(err.message || "Failed to create enquiry.");
      showError(err.message || "Failed to create enquiry.");
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
            Create New Enquiry
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
              Customer Name *
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => {
                setCustomerName(e.target.value);
                if (fieldErrors.customerName)
                  setFieldErrors((prev) => ({ ...prev, customerName: "" }));
              }}
              className={`w-full px-3.5 py-2.5 bg-slate-800 border ${
                fieldErrors.customerName
                  ? "border-rose-500"
                  : "border-slate-700"
              } rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              placeholder="e.g. John Smith"
            />
            {fieldErrors.customerName && (
              <p className="mt-1 text-xs text-rose-400">
                {fieldErrors.customerName}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  placeholder="john@example.com"
                />
              </div>
              {fieldErrors.email && (
                <p className="mt-1 text-xs text-rose-400">
                  {fieldErrors.email}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Phone Number *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (fieldErrors.phone)
                      setFieldErrors((prev) => ({ ...prev, phone: "" }));
                  }}
                  className={`w-full pl-9 pr-3.5 py-2.5 bg-slate-800 border ${
                    fieldErrors.phone ? "border-rose-500" : "border-slate-700"
                  } rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  placeholder="+1 555 123 4567"
                />
              </div>
              {fieldErrors.phone && (
                <p className="mt-1 text-xs text-rose-400">
                  {fieldErrors.phone}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Initial Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="New">New</option>
                <option value="In Progress">In Progress</option>
                <option value="Closed">Closed</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Assign Team Member
              </label>
              <div className="relative">
                <UserCheck className="w-4 h-4 text-slate-500 absolute left-3 top-3 pointer-events-none" />
                <select
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Unassigned</option>
                  {assignees.map((u) => (
                    <option key={u.id || u._id} value={u.id || u._id}>
                      {u.name} ({u.role})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
              Enquiry Message *
            </label>
            <div className="relative">
              <MessageSquare className="w-4 h-4 text-slate-500 absolute left-3 top-3 pointer-events-none" />
              <textarea
                rows={4}
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  if (fieldErrors.message)
                    setFieldErrors((prev) => ({ ...prev, message: "" }));
                }}
                className={`w-full pl-9 pr-3.5 py-2.5 bg-slate-800 border ${
                  fieldErrors.message ? "border-rose-500" : "border-slate-700"
                } rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                placeholder="Details about the enquiry..."
              />
            </div>
            {fieldErrors.message && (
              <p className="mt-1 text-xs text-rose-400">
                {fieldErrors.message}
              </p>
            )}
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
                  Saving...
                </>
              ) : (
                "Create Enquiry"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEnquiryModal;
