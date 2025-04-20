
export const BREAKPOINTS = {
  mobile: 0,
  tablet: 768,
  laptop: 1024,
  desktop: 1280,
};

export const loginHeaderConfig = {
  headers: {
    "Content-Type": "application/json",
  },
};

export const debounce = (func: Function, delay: number) => {
  let timer: any;
  return function (...args: any) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      func.apply(func, args);
    }, delay);
  };
};

export function getTokenInfos() {
  const token = localStorage.getItem("token");

  if (!token) {
    return null;
  }

  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Invalid JWT token:", error);
    return null;
  }
}

export function getToken() {
  const token = localStorage.getItem("token");

  if (!token) {
    return null;
  }

  return token;
}

