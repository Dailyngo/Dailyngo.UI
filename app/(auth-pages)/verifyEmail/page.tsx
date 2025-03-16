"use client"

import { verifyEmailService,sendVerificationEmail } from "@/services";
import { useStore } from "@/store";
import { ERRORS } from "@/store/slices/errorSlice";
import { Icon } from "@iconify/react/dist/iconify.js";
import { AxiosResponse } from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import CountdownButton from "./countdown";

export interface IMinSec {
	minutes: number;
	seconds: number;
} 

const VerifyEmail = () => {
    const [verifyCode,setVerifyCode] = useState("");
    const [loading, setLoading] = useState(false);
	const [sendLoading, setSendLoading] = useState(false);
	const [verifyCodeExpired, setVerifyCodeExpired] = useState<IMinSec>({
		minutes: 5,
		seconds: 0,
	});
	const router = useRouter();
    const { setErrorConfirmInfoModal } = useStore();
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
            
        try {
            setLoading(true);
            const response: AxiosResponse = await verifyEmailService({verifyCode: verifyCode});
            if(response.status === 200){
				setErrorConfirmInfoModal(
					ERRORS.GENERIC_INFO_AND_ERRORS,
					"Email doğrulama işlemi başarılı bir şekilde gerçekleştirildi.",
					"Email Doğrulama",
					"success"
				);
				setTimeout(() => {
					router.push("/");
				}, 1000);
			}
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

	useEffect(() => {
		const fetchVerificationCode = async () => {
			await sendVerificationCode();
		};
		fetchVerificationCode();
	}, []);

	const sendVerificationCode = async () => {
		try {
            setSendLoading(true);
            const response: AxiosResponse = await sendVerificationEmail();
            if(response.status === 201){
				setErrorConfirmInfoModal(
					ERRORS.GENERIC_INFO_AND_ERRORS,
					"Email doğrulama kodu başarılı bir şekilde gönderildi.",
					"Email Doğrulama",
					"success"
				);
				setVerifyCodeExpired(getMinuteDifference(new Date(response.data.data.emailConfirmedDate)));
			}
			else {
				setVerifyCodeExpired(getMinuteDifference(new Date(response.data.data.emailConfirmedDate)));
				console.log("response", getMinuteDifference(new Date(response.data.data.emailConfirmedDate)));
			}
        } catch (error : any) {
            console.log("error", error);
            setErrorConfirmInfoModal(
            ERRORS.GENERIC_INFO_AND_ERRORS, 
            error.response.data.messages, 
            "Email Doğrulama", 
            "error"
            );
        } 
        finally {
            setSendLoading(false);
        }
	}

	const getMinuteDifference = (utcDate: Date): IMinSec => {
		const now = new Date(); // Şimdiki zamanı al

		console.log("now", utcDate);
		const diffMs = utcDate.getTime() - now.getTime(); // Milisaniye farkını hesapla
		const diffMinutes = Math.floor(diffMs / (1000 * 60)); // Milisaniyeyi dakikaya çevir
		const diffSeconds = Math.floor((diffMs % (1000 * 60)) / 1000); // Kalan saniyeyi hesapla
		return { minutes: diffMinutes, seconds: diffSeconds };
	};
    
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
					<CountdownButton
						initialMinutes={verifyCodeExpired}
						handleReSend={sendVerificationCode}
					/>

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