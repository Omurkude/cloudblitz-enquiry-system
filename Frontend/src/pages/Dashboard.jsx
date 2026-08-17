import { useState, useEffect, useCallback } from "react";
import Navbar from "../components/Navbar";
import EnquiryTable from "../components/EnquiryTable";
import AddEnquiryModal from "../components/AddEnquiryModal";
import EditEnquiryModal from "../components/EditEnquiryModal";
import ViewEnquiryModal from "../components/ViewEnquiryModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import { api } from "../services/api";
import {
  Plus,
  Search,
  Inbox,
  Clock,
  CheckCircle2,
  ListFilter,
  RefreshCw,
} from "lucide-react";

function Dashboard() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Modals
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Statistics
  const [stats, setStats] = useState({
    total: 0,
    newCount: 0,
    inProgressCount: 0,
    closedCount: 0,
  });

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const fetchEnquiries = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getEnquiries({
        status: activeTab,
        search: debouncedSearch,
      });

      if (res.success) {
        setEnquiries(res.enquiries || []);
      }
    } catch (err) {
      console.error("Failed to fetch enquiries:", err.message);
      setError(err.message || "Failed to load enquiries.");
    } finally {
      setLoading(false);
    }
  }, [activeTab, debouncedSearch]);

  // Fetch overall statistics for cards
  const fetchStats = useCallback(async () => {
    try {
      const res = await api.getEnquiries();
      if (res.success && res.enquiries) {
        const all = res.enquiries;
        setStats({
          total: all.length,
          newCount: all.filter((e) => e.status === "New").length,
          inProgressCount: all.filter((e) => e.status === "In Progress").length,
          closedCount: all.filter((e) => e.status === "Closed").length,
        });
      }
    } catch (err) {
      console.error("Failed to fetch stats:", err.message);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchEnquiries();
    fetchStats();
  }, [fetchEnquiries, fetchStats]);

  const handleRefresh = () => {
    fetchEnquiries();
    fetchStats();
  };

  const handleOpenView = (enquiry) => {
    setSelectedEnquiry(enquiry);
    setIsViewOpen(true);
  };

  const handleOpenEdit = (enquiry) => {
    setSelectedEnquiry(enquiry);
    setIsEditOpen(true);
  };

  const handleOpenDelete = (enquiry) => {
    setSelectedEnquiry(enquiry);
    setIsDeleteOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Enquiry Management
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Track, manage, and respond to incoming customer enquiries
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              className="p-2.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl transition"
              title="Refresh Data"
            >
              <RefreshCw
                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
              />
            </button>
            <button
              onClick={() => setIsAddOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-indigo-500/25 transition"
            >
              <Plus className="w-4 h-4" />
              New Enquiry
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center justify-between shadow-xl">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Total Enquiries
              </p>
              <h3 className="text-2xl font-black text-white mt-1">
                {stats.total}
              </h3>
            </div>
            <div className="p-3 bg-slate-800 text-slate-300 rounded-xl">
              <Inbox className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center justify-between shadow-xl">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-blue-400">
                New
              </p>
              <h3 className="text-2xl font-black text-white mt-1">
                {stats.newCount}
              </h3>
            </div>
            <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl">
              <Clock className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center justify-between shadow-xl">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                In Progress
              </p>
              <h3 className="text-2xl font-black text-white mt-1">
                {stats.inProgressCount}
              </h3>
            </div>
            <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl">
              <ListFilter className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center justify-between shadow-xl">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                Closed
              </p>
              <h3 className="text-2xl font-black text-white mt-1">
                {stats.closedCount}
              </h3>
            </div>
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Toolbar: Tabs + Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-2.5 rounded-2xl">
          {/* Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto p-1">
            {["All", "New", "In Progress", "Closed"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition whitespace-nowrap ${
                  activeTab === tab
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/25"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search customer, email, phone..."
              className="w-full pl-9 pr-4 py-2 bg-slate-800 border border-slate-700/80 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>
        </div>

        {/* Main Table */}
        <EnquiryTable
          enquiries={enquiries}
          loading={loading}
          error={error}
          onView={handleOpenView}
          onEdit={handleOpenEdit}
          onDelete={handleOpenDelete}
        />
      </main>

      {/* Modals */}
      <AddEnquiryModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSuccess={handleRefresh}
      />

      <EditEnquiryModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        enquiry={selectedEnquiry}
        onSuccess={handleRefresh}
      />

      <ViewEnquiryModal
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        enquiry={selectedEnquiry}
      />

      <DeleteConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        enquiry={selectedEnquiry}
        onSuccess={handleRefresh}
      />
    </div>
  );
}

export default Dashboard;
