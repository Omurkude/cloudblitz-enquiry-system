import {
  Eye,
  Edit3,
  Trash2,
  Mail,
  Phone,
  Calendar,
  UserCheck,
  Inbox,
} from "lucide-react";

const EnquiryTable = ({
  enquiries,
  loading,
  error,
  onView,
  onEdit,
  onDelete,
}) => {
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-16 bg-slate-800/50 rounded-xl animate-pulse flex items-center px-4 justify-between"
            >
              <div className="w-1/4 h-4 bg-slate-700/50 rounded"></div>
              <div className="w-1/5 h-4 bg-slate-700/50 rounded"></div>
              <div className="w-1/6 h-6 bg-slate-700/50 rounded-full"></div>
              <div className="w-1/6 h-4 bg-slate-700/50 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-slate-900 border border-rose-500/30 rounded-2xl p-12 text-center">
        <div className="text-rose-400 font-semibold text-base mb-2">
          Failed to load enquiries
        </div>
        <p className="text-slate-400 text-sm">{error}</p>
      </div>
    );
  }

  if (!enquiries || enquiries.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-16 text-center">
        <div className="w-16 h-16 bg-slate-800 text-slate-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Inbox className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-white">No enquiries found</h3>
        <p className="text-slate-400 text-sm mt-1 max-w-sm mx-auto">
          There are no enquiries matching the current status filter or search
          query.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-800/40 text-xs font-bold uppercase tracking-wider text-slate-400">
              <th className="py-4 px-6">Customer</th>
              <th className="py-4 px-6">Contact</th>
              <th className="py-4 px-6">Message Preview</th>
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6">Assigned To</th>
              <th className="py-4 px-6">Date</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-sm">
            {enquiries.map((enquiry) => (
              <tr
                key={enquiry._id || enquiry.id}
                className="hover:bg-slate-800/40 transition group"
              >
                <td className="py-4 px-6 font-semibold text-white">
                  {enquiry.customerName}
                </td>

                <td className="py-4 px-6 text-slate-300">
                  <div className="flex flex-col gap-0.5">
                    <span className="flex items-center gap-1.5 text-slate-300 text-xs">
                      <Mail className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      {enquiry.email}
                    </span>
                    <span className="flex items-center gap-1.5 text-slate-400 text-xs">
                      <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      {enquiry.phone}
                    </span>
                  </div>
                </td>

                <td className="py-4 px-6 text-slate-400 max-w-xs truncate">
                  {enquiry.message}
                </td>

                <td className="py-4 px-6">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                      enquiry.status === "New"
                        ? "bg-blue-500/15 text-blue-400 border border-blue-500/30"
                        : enquiry.status === "In Progress"
                          ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                          : "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                        enquiry.status === "New"
                          ? "bg-blue-400"
                          : enquiry.status === "In Progress"
                            ? "bg-amber-400"
                            : "bg-emerald-400"
                      }`}
                    ></span>
                    {enquiry.status}
                  </span>
                </td>

                <td className="py-4 px-6 text-slate-300">
                  {enquiry.assignedTo ? (
                    <span className="inline-flex items-center gap-1.5 bg-slate-800 border border-slate-700/80 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-200">
                      <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
                      {enquiry.assignedTo.name}
                    </span>
                  ) : (
                    <span className="text-xs text-slate-500 italic">
                      Unassigned
                    </span>
                  )}
                </td>

                <td className="py-4 px-6 text-slate-400 text-xs">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    {formatDate(enquiry.createdAt)}
                  </div>
                </td>

                <td className="py-4 px-6 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => onView(enquiry)}
                      title="View Details"
                      className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-lg transition"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onEdit(enquiry)}
                      title="Edit Enquiry"
                      className="p-2 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-lg transition"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(enquiry)}
                      title="Delete Enquiry"
                      className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EnquiryTable;
