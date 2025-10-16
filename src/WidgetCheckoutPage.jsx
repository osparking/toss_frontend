import { useEffect, useState } from "react";
import "./App.css";
import getOrderIdPrefix from "./util/service";
import { loadTossPayments } from "@tosspayments/tosspayments-sdk";

// 전자결제 신청 및 가입 완료 후, clientKey 를 다음으로 수정할 것.
// 개발자센터의 결제위젯 연동 키 > 클라이언트 키
const clientKey = "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm";
const customerKey = generateRandomString();

function generateRandomString() {
  return window.btoa(Math.random().toString()).slice(0, 20);
}

function WidgetCheckoutPage() {
  const [amount, setAmount] = useState({
    currency: "KRW",
    value: 10700,
  });
  const productName = "백설공주 2개 등";
  const orderId = getOrderIdPrefix(6);

  const [widgets, setWidgets] = useState(null);

  useEffect(() => {
    async function fetchPaymentWidgets() {
      try {
        const tossPayments = await loadTossPayments(clientKey);

        // 회원 결제
        // @docs https://docs.tosspayments.com/sdk/v2/js#tosspaymentswidgets
        const widgets = tossPayments.widgets({
          customerKey,
        });
        // 비회원 결제
        // const widgets = tossPayments.widgets({ customerKey: ANONYMOUS });

        setWidgets(widgets);
      } catch (error) {
        console.error("Error fetching payment widget:", error);
      }
    }

    fetchPaymentWidgets();
  }, [clientKey, customerKey]);

  return (
    <>
      <h1>결제 창</h1>
      <div>
        <ul style={{ textAlign: "left" }}>
          <li>내역: {productName}</li>
          <li>금액: {amount.value.toLocaleString()}원</li>
          <li>주문ID: {orderId}00000001</li>
        </ul>
      </div>
    </>
  );
}

export default WidgetCheckoutPage;
