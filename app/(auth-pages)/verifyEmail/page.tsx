"use client";

import { verifyEmailService, sendVerificationEmail } from "@/services";
import { useStore } from "@/store";
import { ERRORS } from "@/store/slices/errorSlice";
import { Icon } from "@iconify/react/dist/iconify.js";
import { AxiosResponse } from "axios";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react"; 
import React, { useEffect, useState } from "react";
import CountdownButton from "./countdown";

export interface IMinSec {
  minutes: number;
  seconds: number;
}

const VerifyEmail = () => {
  const [verifyCode, setVerifyCode] = useState("");
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
      const response: AxiosResponse = await verifyEmailService({
        verifyCode: verifyCode,
      });
      if (response.status === 200) {
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
    } catch (error: any) {
      console.log("error", error.response.data.messages);
      setErrorConfirmInfoModal(
        ERRORS.GENERIC_INFO_AND_ERRORS,
        error.response.data.messages,
        "Email Doğrulama",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

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
      if (response.status === 201) {
        setErrorConfirmInfoModal(
          ERRORS.GENERIC_INFO_AND_ERRORS,
          "Email doğrulama kodu başarılı bir şekilde gönderildi.",
          "Email Doğrulama",
          "success"
        );
        setVerifyCodeExpired(
          getMinuteDifference(new Date(response.data.data.emailConfirmedDate))
        );
      } else {
        setVerifyCodeExpired(
          getMinuteDifference(new Date(response.data.data.emailConfirmedDate))
        );
        console.log(
          "response",
          getMinuteDifference(new Date(response.data.data.emailConfirmedDate))
        );
      }
    } catch (error: any) {
      console.log("error", error);
      setErrorConfirmInfoModal(
        ERRORS.GENERIC_INFO_AND_ERRORS,
        error.response.data.messages,
        "Email Doğrulama",
        "error"
      );
    } finally {
      setSendLoading(false);
    }
  };

  const getMinuteDifference = (utcDate: Date): IMinSec => {
    const now = new Date(); // Şimdiki zamanı al
    const diffMs = utcDate.getTime() - now.getTime(); // Milisaniye farkını hesapla
    const diffMinutes = Math.floor(diffMs / (1000 * 60)); // Milisaniyeyi dakikaya çevir
    const diffSeconds = Math.floor((diffMs % (1000 * 60)) / 1000); // Kalan saniyeyi hesapla
    return { minutes: diffMinutes, seconds: diffSeconds };
  };

  return (
    <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 bg-gray-100">
      <div className="w-full max-w-md space-y-8 bg-white p-6 rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800">Email Doğrulama</h2>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
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
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-700 focus:border-gray-700 text-center bg-gray-50 text-gray-800"
              />
            </div>
          </div>
          <CountdownButton
            initialMinutes={verifyCodeExpired}
            handleReSend={sendVerificationCode}
          />

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700"
          >
            {loading ? (
              <Icon icon="line-md:loading-loop" width="24" height="24" />
            ) : (
              "Doğrula"
            )}
          </button>
        
        <button
        type= "button"
          onClick={() => signOut()}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700"
        >
         İptal Et
        </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyEmail;