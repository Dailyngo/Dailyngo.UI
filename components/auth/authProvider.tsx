"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { enableCache } from '@iconify/react';

type ProviderProps = {
  children: ReactNode;
};
enableCache('all');

const Provider = ({ children }: ProviderProps) => {
  return <SessionProvider>
      {children}
  </SessionProvider>;
};

export default Provider;
