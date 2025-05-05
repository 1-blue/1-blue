import ky from "ky";

// 리그 오브 레전드 API 클라이언트
export const lolInstance = ky.create({
  prefixUrl: process.env.NEXT_PUBLIC_LOL_API_URL,
  timeout: 30000,
  retry: 3,
});

export const serverInstance = ky.create({
  prefixUrl: process.env.NEXT_PUBLIC_SERVER_URL,
});
