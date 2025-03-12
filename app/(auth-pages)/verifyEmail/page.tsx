"use client"

const VerifyEmail = () => {

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Register işlemleri burada yapılacak
    }

    return (
        <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900">Email Dogrula</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Hemen ücretsiz kayıt ol
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    <div className="space-y-4">
                        <div>
                            <input
                                id="name"
                                name="name"
                                type="number"
                                placeholder="Doğrulama Kodu"
                                min={6}
                                max={6}
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
                </form>
            </div>
        </div>
    )
};

export default VerifyEmail;