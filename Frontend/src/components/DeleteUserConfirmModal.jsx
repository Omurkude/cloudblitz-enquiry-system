import { useState } from "react";
import { api } from "../services/api";
import { useToast } from "../context/ToastContext";
import { AlertTriangle, Loader2, X } from "lucide-react";

const DeleteUserConfirmModal = ({ isOpen, onClose, user, onSuccess }) => {
  const [deleting, setDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { showSuccess, showError } = useToast();

  if (!isOpen || !user) return null;

  const handleDelete = async () => {
    setDeleting(true);
    setErrorMessage("");

    try {
      const userId = user._id || user.id;
      const res = await api.deleteUser(userId);
      if (res.success) {
        showSuccess("User deleted successfully!");
        onSuccess();
        onClose();
      }
    } catch (err) {
      setErrorMessage(err.message || "Failed to delete user.");
      showError(err.message || "Failed to delete user.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-rose-500/10 text-rose-400 rounded-xl shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">
              Delete User Account
            </h3>
            <p className="text-sm text-slate-400 mt-1">
              Are you sure you want to delete user{" "}
              <strong className="text-slate-200">{user.name}</strong> (
              {user.email})? This action cannot be undone.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition p-1 rounded-lg absolute top-4 right-4"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMessage && (
          <div className="mt-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-sm">
            {errorMessage}
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={deleting}
            className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="flex items-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-rose-500/25 disabled:opacity-60 transition"
          >
            {deleting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Confirm Delete"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteUserConfirmModal;
