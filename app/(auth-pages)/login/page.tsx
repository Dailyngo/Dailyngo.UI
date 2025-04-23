"use client";

import React, { useEffect, useState } from "react";
import { useStore } from "@/store";
import Link from "next/link";
import { Icon } from "@iconify/react/dist/iconify.js";
import { ERRORS } from "@/store/slices/errorSlice";

export default function LoginPage() {
  const [username, setUsername] = useState<string | undefined>();
  const [password, setPassword] = useState<string | undefined>();
  const [showPassword, setShowPassword] = useState(false);
  const { login, authErrors } = useStore();
  const [loading, setLoading] = useState(false);
  const { setErrorConfirmInfoModal } = useStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      return;
    }
    setLoading(true);
    await login(
      {
        EmailOrUserName: username,
        Password: password,
      },
      () => {}
    );
    setLoading(false);
  };

  useEffect(() => {
    if (authErrors) {
      setErrorConfirmInfoModal(
        ERRORS.GENERIC_INFO_AND_ERRORS,
        "Hata",
        authErrors,
        "error"
      );
    }
  }, [authErrors]);

  return (
    <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 bg-gray-100">
      <div className="w-full max-w-md space-y-8 bg-white p-6 rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800">Hoş Geldiniz</h2>
          <p className="mt-2 text-sm text-gray-600">Hesabınıza giriş yapın</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                E-posta
              </label>
              <input
                id="email"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-700 focus:border-gray-700 bg-gray-50 text-gray-800"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Şifre
              </label>
              <div className="relative mt-1">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-700 focus:border-gray-700 bg-gray-50 text-gray-800"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                >
                  {showPassword ? (
                    <Icon
                      icon="mdi:eye-off-outline"
                      className="w-5 h-5 text-gray-500"
                    />
                  ) : (
                    <Icon
                      icon="mdi:eye-outline"
                      className="w-5 h-5 text-gray-500"
                    />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                className="h-4 w-4 text-gray-700 focus:ring-gray-700 border-gray-300 rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-800"
              >
                Beni hatırla
              </label>
            </div>

            <div className="text-sm">
              <Link
                href="/forgot-password"
                className="font-medium text-gray-700 hover:text-gray-900"
              >
                Şifremi unuttum
              </Link>
            </div>
          </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700"
              >
              {loading && <Icon icon="line-md:loading-loop" width="24" height="24" />}
              <span>{loading ? "Giriş Yap" : "Giriş Yap"}</span>
            </button>

          <p className="text-center text-sm text-gray-600">
            Hesabınız yok mu?{" "}
            <Link
              href="/register"
              className="font-medium text-gray-700 hover:text-gray-900"
            >
              Kayıt ol
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
