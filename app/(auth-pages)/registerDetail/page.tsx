"use client"

import Link from "next/link";

const RegisterDetail = () => {

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Register işlemleri burada yapılacak
    }

    return (
        <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900">Kayit Detaylarini tamamla</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Hemen ücretsiz kayıt ol
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Ad
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="surname" className="block text-sm font-medium text-gray-700">
                                Soyad
                            </label>
                            <input
                                id="surname"
                                name="surname"
                                type="text"
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Kayıt Ol
                    </button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">Veya</span>
                        </div>
                    </div>
                    <p className="text-center text-sm text-gray-600">
                        Zaten hesabınız var mı?{" "}
                        <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                            Giriş yap
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    )
};

export default RegisterDetail;