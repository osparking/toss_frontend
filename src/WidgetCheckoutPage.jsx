import { loadTossPayments } from "@tosspayments/tosspayments-sdk";
import { useEffect, useState } from "react";
import "./App.css";
import { api } from "./util/api";

// 전자결제 신청 및 가입 완료 후, clientKey 를 다음으로 수정할 것.
// 개발자센터의 결제위젯 연동 키 > 클라이언트 키
const clientKey = "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm";
const customerKey = generateRandomString();

function generateRandomString() {
  return window.btoa(Math.random().toString()).slice(0, 20);
}

function WidgetCheckoutPage() {
  const [widgets, setWidgets] = useState(null);
  const [bsOrder, setBsOrder] = useState({ amount: 0 });

  useEffect(() => {
    async function fetchOrderInfo() {
      try {
        const url = new URL("http://localhost:9193/payments/orderInfo");
        let response = await fetch(url, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        let orderInfo = await response.json();
        setBsOrder(orderInfo);
        console.log("후단에서 읽은 결제 정보: ", JSON.stringify(orderInfo));
      } catch (error) {
        console.error("주문 정보 읽기 오류:", error);
      }
    }

    fetchOrderInfo();
  }, []);

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

  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function renderPaymentWidgets() {
      if (widgets == null) {
        console.log("위젯은 널");
        return;
      }
      if (bsOrder.amount === 0) {
        console.log("금액은 0");
        return;
      }
      // @docs https://docs.tosspayments.com/sdk/v2/js#widgetssetamount
      await widgets.setAmount({
        currency: "KRW",
        value: bsOrder.amount,
      });

      await Promise.all([
        // ------  결제 UI 렌더링 ------
        // @docs https://docs.tosspayments.com/sdk/v2/js#widgetsrenderpaymentmethods
        widgets.renderPaymentMethods({
          selector: "#payment-method",
          // 렌더링하고 싶은 결제 UI의 variantKey
          // 결제 수단 및 스타일이 다른 멀티 UI를 직접 만들고 싶다면 계약이 필요해요.
          // @docs https://docs.tosspayments.com/guides/v2/payment-widget/admin#새로운-결제-ui-추가하기
          variantKey: "DEFAULT",
        }),
        // ------  이용약관 UI 렌더링 ------
        // @docs https://docs.tosspayments.com/sdk/v2/js#widgetsrenderagreement
        widgets.renderAgreement({
          selector: "#agreement",
          variantKey: "AGREEMENT",
        }),
      ]);

      setReady(true);
    }

    renderPaymentWidgets();
  }, [widgets, bsOrder]);

  return (
    <div className="wrapper">
      <div className="box_section">
        <h3>구매 내역 요약</h3>
        <ul
          style={{
            textAlign: "left",
            border: "1px solid black",
            width: "90%",
            margin: "5%",
          }}
        >
          <li>내역: {bsOrder.orderName}</li>
          <li>금액: {bsOrder.amount?.toLocaleString()}원</li>
          <li>주문ID: {bsOrder.orderId}</li>
        </ul>
        {/* 결제 UI */}
        <div id="payment-method" />
        {/* 이용약관 UI */}
        <div id="agreement" />

        {/* 결제하기 버튼 */}
        <button
          className="button"
          style={{ marginTop: "30px" }}
          disabled={!ready}
          // ------ '결제하기' 버튼 누르면 결제창 띄우기 ------
          // @docs https://docs.tosspayments.com/sdk/v2/js#widgetsrequestpayment
          onClick={async () => {
            try {
              // 결제를 요청 전, 결제 정보(orderId, amount) 서버 저장 - 결제 금액 확인 용
              const saveOrderInfoReq = {
                orderId: bsOrder.orderId,
                amount: bsOrder.amount,
                orderName: bsOrder.orderName,
              };
              console.log("저장 정보: ", JSON.stringify(saveOrderInfoReq));
              await api
                .post("/saveOrderInfo", saveOrderInfoReq)
                .then((response) => {
                  console.log("금액 저장:", response.data);
                })
                .catch((error) => {
                  console.error("저장 실패:", error);
                });
              await widgets.requestPayment({
                orderId: bsOrder.orderId, // 주문 고유 번호
                orderName: bsOrder.orderName,
                successUrl: window.location.origin + "/success", // 결제 요청이 성공하면 리다이렉트되는 URL
                failUrl: window.location.origin + "/fail", // 결제 요청이 실패하면 리다이렉트되는 URL
                customerEmail: "jbpark03@gmail.com",
                customerName: "범이고객",
                // 가상계좌 안내, 퀵계좌이체 휴대폰 번호 자동 완성에 사용되는 값입니다. 필요하다면 주석을 해제해 주세요.
                // customerMobilePhone: "01012341234",
              });
            } catch (error) {
              // 에러 처리하기
              console.error(error);
            }
          }}
        >
          결제하기
        </button>
      </div>
    </div>
  );
}

export default WidgetCheckoutPage;
