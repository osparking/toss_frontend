import { api } from "./util/api";

export async function getMyRecentPayments(count) {
  try {
    const response = await api.get("/getRecentSome", {
      params: { count: count },
    });
    return response.data;
  } catch (error) {
    console.error("결제 읽기 실패:", error);
    throw error; // Re-throw the error so it can be caught in changeRecentPayments
  }
}
