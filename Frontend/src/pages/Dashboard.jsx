import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { ShieldCheck, UserCheck, Mail, KeyRound } from "lucide-react";

function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 text-indigo-400 font-medium text-sm mb-1">
                <ShieldCheck className="w-4 h-4" />
                Authenticated Session Active
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight">
                Welcome back, {user?.name}!
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                CloudBlitz Enquiry Management System Overview
              </p>
            </div>

            <div className="inline-flex items-center gap-2 bg-slate-800 border border-slate-700 px-4 py-2 rounded-xl text-sm font-semibold">
              <span className="text-slate-400">Current Role:</span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs uppercase font-bold tracking-wider ${
                  user?.role === "admin"
                    ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                    : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                }`}
              >
                {user?.role}
              </span>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-800/50 border border-slate-800 rounded-xl p-5 flex items-start gap-4">
              <div className="p-3 bg-indigo-500/10 rounded-lg text-indigo-400">
                <UserCheck className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  User ID
                </p>
                <p className="text-sm font-mono text-slate-200 mt-1 break-all">
                  {user?.id}
                </p>
              </div>
            </div>

            <div className="bg-slate-800/50 border border-slate-800 rounded-xl p-5 flex items-start gap-4">
              <div className="p-3 bg-emerald-500/10 rounded-lg text-emerald-400">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Email Address
                </p>
                <p className="text-sm text-slate-200 mt-1 font-medium">
                  {user?.email}
                </p>
              </div>
            </div>

            <div className="bg-slate-800/50 border border-slate-800 rounded-xl p-5 flex items-start gap-4">
              <div className="p-3 bg-amber-500/10 rounded-lg text-amber-400">
                <KeyRound className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Authentication Status
                </p>
                <p className="text-sm text-slate-200 mt-1 font-medium">
                  JWT Verified & Token Stored
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
