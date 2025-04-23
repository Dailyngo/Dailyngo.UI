"use client";
import React from "react";

import UserProfile from "@/components/profile/userProfile";
import { getTokenInfos } from "@/utils/helpers";
import { useRouter } from "next/navigation";

const UserProfilePage = ({ params }: { params: { id: string } }) => {
  const loginUserDetail = getTokenInfos();
  const loginUserId = loginUserDetail?.sub;

  if(loginUserId == params.id) {
    const router = useRouter();
    router.push("/profile");

    return <></>;
  }
  else
    return (
      <div className="min-h-screen bg-gray-50">
        <UserProfile userId={params.id} /> 
      </div>
    );
};
  
  export default UserProfilePage;