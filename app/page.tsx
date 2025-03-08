'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiReqWithQueryService, formDataService, loginService } from '@/services';

export default function Home() {
  const router = useRouter();
  
  const loginFormdata = () =>{
    const formData =new FormData()
formData.append("Name","Burakhan")
formData.append("Surname","İbrahim")
    const response= formDataService(formData)
  }
  const loginJson = () =>{
   const form ={
    name:"Burakhan",
    surname:"İbrahim"
   }
    const response= loginService(form)
  }

   
  const loginReqWithQuery = () =>{
    const form ={
     pageSize:"10",
    search:""
    }
     const response= apiReqWithQueryService(form)
   }
 
  return (
    <div>
      Home
    </div>
  );
}
