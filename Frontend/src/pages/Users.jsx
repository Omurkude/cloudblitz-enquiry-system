import { useState, useEffect, useCallback } from "react";
import Navbar from "../components/Navbar";
import AddUserModal from "../components/AddUserModal";
import EditUserModal from "../components/EditUserModal";
import DeleteUserConfirmModal from "../components/DeleteUserConfirmModal";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import {
  Users as UsersIcon,
  UserPlus,
  Search,
  ShieldCheck,
  UserCheck,
  Edit3,
  Trash2,
  RefreshCw,
  Mail,
  Calendar,
} from "lucide-react";

function Users() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [activeRoleTab, setActiveRoleTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getUsers();
      if (res.success) {
        setUsers(res.users || []);
      }
    } catch (err) {
      console.error("Failed to fetch users:", err.message);
      setError(err.message || "Failed to load system users.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchUsers();
  }, [fetchUsers]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const filteredUsers = users.filter((u) => {
    const matchesRole =
      activeRoleTab === "All" ||
      u.role.toLowerCase() === activeRoleTab.toLowerCase();
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      u.name.toLowerCase().includes(query) ||
      u.email.toLowerCase().includes(query);

    return matchesRole && matchesSearch;
  });

  const totalCount = users.length;
  const adminCount = users.filter((u) => u.role === "admin").length;
  const staffCount = users.filter((u) => u.role === "staff").length;

  const handleOpenEdit = (userToEdit) => {
    setSelectedUser(userToEdit);
    setIsEditOpen(true);
  };

  const handleOpenDelete = (userToDelete) => {
    setSelectedUser(userToDelete);
    setIsDeleteOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              User Management
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Admin control panel to manage staff and administrator access
              accounts
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchUsers}
              className="p-2.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl transition"
              title="Refresh Users"
            >
              <RefreshCw
                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
              />
            </button>
            <button
              onClick={() => setIsAddOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-indigo-500/25 transition"
            >
              <UserPlus className="w-4 h-4" />
              Add User
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center justify-between shadow-xl">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Total System Users
              </p>
              <h3 className="text-2xl font-black text-white mt-1">
                {totalCount}
              </h3>
            </div>
            <div className="p-3 bg-slate-800 text-slate-300 rounded-xl">
              <UsersIcon className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center justify-between shadow-xl">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-purple-400">
                Administrators
              </p>
              <h3 className="text-2xl font-black text-white mt-1">
                {adminCount}
              </h3>
            </div>
            <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl">
              <ShieldCheck className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center justify-between shadow-xl">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-blue-400">
                Staff Members
              </p>
              <h3 className="text-2xl font-black text-white mt-1">
                {staffCount}
              </h3>
            </div>
            <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl">
              <UserCheck className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-2.5 rounded-2xl">
          <div className="flex items-center gap-1 overflow-x-auto p-1">
            {["All", "Admin", "Staff"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveRoleTab(tab)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition whitespace-nowrap ${
                  activeRoleTab === tab
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/25"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search user name or email..."
              className="w-full pl-9 pr-4 py-2 bg-slate-800 border border-slate-700/80 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>
        </div>

        {/* Table View */}
        {loading ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-14 bg-slate-800/50 rounded-xl animate-pulse flex items-center px-4 justify-between"
              >
                <div className="w-1/3 h-4 bg-slate-700/50 rounded"></div>
                <div className="w-1/4 h-4 bg-slate-700/50 rounded"></div>
                <div className="w-1/6 h-6 bg-slate-700/50 rounded-full"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-slate-900 border border-rose-500/30 rounded-2xl p-12 text-center">
            <div className="text-rose-400 font-semibold text-base mb-2">
              Failed to load system users
            </div>
            <p className="text-slate-400 text-sm">{error}</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-16 text-center">
            <div className="w-16 h-16 bg-slate-800 text-slate-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <UsersIcon className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white">No users found</h3>
            <p className="text-slate-400 text-sm mt-1 max-w-sm mx-auto">
              There are no system users matching your search or role filter.
            </p>
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-800/40 text-xs font-bold uppercase tracking-wider text-slate-400">
                    <th className="py-4 px-6">Name</th>
                    <th className="py-4 px-6">Email</th>
                    <th className="py-4 px-6">Role</th>
                    <th className="py-4 px-6">Created Date</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-sm">
                  {filteredUsers.map((u) => {
                    const isSelf = currentUser?.id === (u._id || u.id);
                    return (
                      <tr
                        key={u._id || u.id}
                        className="hover:bg-slate-800/40 transition"
                      >
                        <td className="py-4 px-6 font-semibold text-white">
                          <div className="flex items-center gap-2">
                            <span>{u.name}</span>
                            {isSelf && (
                              <span className="text-[10px] bg-slate-800 text-indigo-400 border border-indigo-500/30 px-2 py-0.5 rounded-full font-bold">
                                You
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="py-4 px-6 text-slate-300">
                          <span className="flex items-center gap-1.5 text-slate-300">
                            <Mail className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                            {u.email}
                          </span>
                        </td>

                        <td className="py-4 px-6">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                              u.role === "admin"
                                ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                                : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                            }`}
                          >
                            {u.role === "admin" ? (
                              <ShieldCheck className="w-3 h-3 mr-1 text-purple-300" />
                            ) : (
                              <UserCheck className="w-3 h-3 mr-1 text-blue-300" />
                            )}
                            {u.role}
                          </span>
                        </td>

                        <td className="py-4 px-6 text-slate-400 text-xs">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-slate-500" />
                            {formatDate(u.createdAt)}
                          </div>
                        </td>

                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenEdit(u)}
                              title="Edit User"
                              className="p-2 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-lg transition"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleOpenDelete(u)}
                              disabled={isSelf}
                              title={
                                isSelf
                                  ? "Cannot delete your own account"
                                  : "Delete User"
                              }
                              className={`p-2 rounded-lg transition ${
                                isSelf
                                  ? "text-slate-600 cursor-not-allowed"
                                  : "text-slate-400 hover:text-rose-400 hover:bg-slate-800"
                              }`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      <AddUserModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSuccess={fetchUsers}
      />

      <EditUserModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        user={selectedUser}
        onSuccess={fetchUsers}
      />

      <DeleteUserConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        user={selectedUser}
        onSuccess={fetchUsers}
      />
    </div>
  );
}

export default Users;
