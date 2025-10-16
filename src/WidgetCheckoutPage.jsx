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

  const [ready, setReady] = useState(false);

  // return (
  //   <>
  //     <h1>결제 창</h1>
  //     <div>
  //       <ul style={{ textAlign: "left" }}>
  //         <li>내역: {productName}</li>
  //         <li>금액: {amount.value.toLocaleString()}원</li>
  //         <li>주문ID: {orderId}00000001</li>
  //       </ul>
  //     </div>
  //   </>
  // );

  return (
    <div className="wrapper">
      <div className="box_section">
        {/* 결제 UI */}
        <div id="payment-method" />
        {/* 이용약관 UI */}
        <div id="agreement" />
        {/* 쿠폰 체크박스 */}
        <div style={{ paddingLeft: "30px" }}>
          <div className="checkable typography--p">
            <label
              htmlFor="coupon-box"
              className="checkable__label typography--regular"
            >
              <input
                id="coupon-box"
                className="checkable__input"
                type="checkbox"
                aria-checked="true"
                disabled={!ready}
                // ------  주문서의 결제 금액이 변경되었을 경우 결제 금액 업데이트 ------
                // @docs https://docs.tosspayments.com/sdk/v2/js#widgetssetamount
                onChange={async (event) => {
                  if (event.target.checked) {
                    await widgets.setAmount({
                      currency: amount.currency,
                      value: amount.value - 5000,
                    });

                    return;
                  }

                  await widgets.setAmount({
                    currency: amount.currency,
                    value: amount.value,
                  });
                }}
              />
              <span className="checkable__label-text">5,000원 쿠폰 적용</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WidgetCheckoutPage;
