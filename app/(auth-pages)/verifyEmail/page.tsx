"use client"

import { verifyEmailService } from "@/services";
import { useStore } from "@/store";
import { ERRORS } from "@/store/slices/errorSlice";
import { Icon } from "@iconify/react/dist/iconify.js";
import { AxiosResponse } from "axios";
import React, { useState } from "react";

const VerifyEmail = () => {
    const [verifyCode,setVerifyCode] = useState("");
    const [loading, setLoading] = useState(false);

    const { setErrorConfirmInfoModal } = useStore();
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
            
        try {
            setLoading(true);
            const response: AxiosResponse = await verifyEmailService({verifyCode: verifyCode});
            const ss = response.data?.data?.messages;
        } catch (error : any) {
            console.log("error", error.response.data.messages);
            setErrorConfirmInfoModal(
            ERRORS.GENERIC_INFO_AND_ERRORS, 
            error.response.data.messages, 
            "Email Doğrulama", 
            "error"
            );
        } 
        finally {
            setLoading(false);
        }
    }

    
    return (
		<div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
			<div className="w-full max-w-md space-y-8">
				<div className="text-center">
					<h2 className="text-3xl font-bold text-gray-900">
						Email Doğrulama
					</h2>
				</div>

				<form onSubmit={handleSubmit} className="mt-8 space-y-6">
					<div className="space-y-4">
						<div>
							<input
								id="name"
								name="name"
								type="number"
								placeholder="Doğrulama Kodu"
								min={0}
								max={999999}
								required
                                onChange={(e) => setVerifyCode(e.target.value)}
								className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-center"
							/>
						</div>
					</div>

					<button
						type="submit"
						className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
					>
						{loading ? (
							<Icon
								icon="line-md:loading-loop"
								width="24"
								height="24"
							/>
						) : (
							<></>
						)}
						Doğrula
					</button>
				</form>
			</div>
		</div>
	);
};

export default VerifyEmail;