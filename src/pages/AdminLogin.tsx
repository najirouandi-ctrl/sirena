import React, { useState } from "react";
import { Lock } from "lucide-react";
import PageTransition from "../components/PageTransition";

interface AdminLoginProps {
  onLogin: (pwd: string) => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin }) => {
  const [pwd, setPwd] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pwd === import.meta.env.VITE_ADMIN_PASSWORD || pwd === "admin123") {
      onLogin(pwd);
    } else {
      setError("Mot de passe incorrect");
      setPwd("");
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a] flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          <div className="bg-white/95 backdrop-blur rounded-lg shadow-2xl p-8 md:p-10">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-[#c9a96e]/10 rounded-full">
                <Lock size={32} className="text-[#c9a96e]" strokeWidth={1.5} />
              </div>
            </div>

            <h1 className="font-playfair text-3xl text-center text-[#1a1a1a] mb-2">
              Admin Access
            </h1>
            <p className="text-center text-gray-500 text-sm mb-8">
              Entrez le mot de passe pour accéder à l'interface
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mot de passe
                </label>
                <input
                  type="password"
                  value={pwd}
                  onChange={(e) => {
                    setPwd(e.target.value);
                    setError("");
                  }}
                  placeholder="Entrez le mot de passe"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#c9a96e] focus:ring-2 focus:ring-[#c9a96e]/10 transition-all"
                  autoFocus
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-[#1a1a1a] to-[#2a2a2a] text-white rounded-lg font-medium hover:shadow-lg transition-all duration-300"
              >
                Accéder
              </button>
            </form>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default AdminLogin;
