import Navbar from "../components/Navbar";

function Users() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8">
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="text-slate-400 text-sm mt-2">
            Protected Route (Admin Only) — User management features will be
            implemented in subsequent phases.
          </p>
        </div>
      </main>
    </div>
  );
}

export default Users;
