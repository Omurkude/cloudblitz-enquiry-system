import {
  X,
  Mail,
  Phone,
  Calendar,
  UserCheck,
  Tag,
  MessageSquare,
} from "lucide-react";

const ViewEnquiryModal = ({ isOpen, onClose, enquiry }) => {
  if (!isOpen || !enquiry) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-indigo-400">
              Enquiry Details
            </span>
            <h3 className="text-xl font-bold text-white mt-0.5">
              {enquiry.customerName}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition p-1.5 rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-5 space-y-4 text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-800/60 border border-slate-800 p-3.5 rounded-xl">
              <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase mb-1">
                <Mail className="w-3.5 h-3.5 text-indigo-400" /> Email
              </div>
              <p className="text-white font-medium break-all">
                {enquiry.email}
              </p>
            </div>

            <div className="bg-slate-800/60 border border-slate-800 p-3.5 rounded-xl">
              <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase mb-1">
                <Phone className="w-3.5 h-3.5 text-indigo-400" /> Phone
              </div>
              <p className="text-white font-medium">{enquiry.phone}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-800/60 border border-slate-800 p-3.5 rounded-xl">
              <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase mb-1">
                <Tag className="w-3.5 h-3.5 text-indigo-400" /> Status
              </div>
              <span
                className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  enquiry.status === "New"
                    ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                    : enquiry.status === "In Progress"
                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                      : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                }`}
              >
                {enquiry.status}
              </span>
            </div>

            <div className="bg-slate-800/60 border border-slate-800 p-3.5 rounded-xl">
              <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase mb-1">
                <UserCheck className="w-3.5 h-3.5 text-indigo-400" /> Assigned
                To
              </div>
              <p className="text-white font-medium">
                {enquiry.assignedTo
                  ? `${enquiry.assignedTo.name} (${enquiry.assignedTo.role})`
                  : "Unassigned"}
              </p>
            </div>
          </div>

          <div className="bg-slate-800/60 border border-slate-800 p-4 rounded-xl">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase mb-2">
              <MessageSquare className="w-3.5 h-3.5 text-indigo-400" /> Message
            </div>
            <p className="text-slate-200 whitespace-pre-wrap leading-relaxed">
              {enquiry.message}
            </p>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-2">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-500" /> Created:{" "}
              {formatDate(enquiry.createdAt)}
            </div>
            {enquiry.updatedAt && (
              <div>Updated: {formatDate(enquiry.updatedAt)}</div>
            )}
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-semibold transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewEnquiryModal;
