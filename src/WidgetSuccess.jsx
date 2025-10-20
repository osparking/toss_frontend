import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./App.css";
import PaymentDoneModal from "./modal/PaymentDone";
import { prefix } from "./util/api";

export function WidgetSuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [responseData, setResponseData] = useState(null);
  const [orderName, setOrderName] = useState("");

  useEffect(() => {
    async function confirm() {
      const params = {
        orderId: searchParams.get("orderId"),
        amount: parseInt(searchParams.get("amount")),
      };
      console.log("saved amount check request: ", JSON.stringify(params));

      // For GET requests - using URL object
      const url = new URL("http://localhost:9193/payments/checkAmount");
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });

      let response = await fetch(url, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      let checkResult = await response.json();
      console.log("response: ", JSON.stringify(checkResult));
      if (!checkResult.matches) {
        throw { message: "결제 금액 불일치 오류", code: 400 };
      }
      setOrderName(checkResult.productName);

      const requestData = {
        ...params,
        paymentKey: searchParams.get("paymentKey"),
      };

      response = await fetch(`${prefix}/confirm`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const paymentConfirmResponse = await response.json();
      return paymentConfirmResponse;
    }

    confirm()
      .then((data) => {
        setResponseData(data);
        console.log("order name: ", data.orderName);
        setIsModalOpen(true);
      })
      .catch((error) => {
        navigate(`/fail?code=${error.code}&message=${error.message}`);
      });
  }, [searchParams]);

  return (
    <>
      <div className="box_section" style={{ width: "600px" }}>
        <img width="100px" src="https://static.toss.im/illusts/check-blue-spot-ending-frame.png" />
        <h2>결제가 완료되었습니다</h2>
        <div className="p-grid typography--p" style={{ marginTop: "50px" }}>
          <div className="p-grid-col text--left">
            <b>결제금액</b>
          </div>
          <div className="p-grid-col text--right" id="amount">
            {`${Number(searchParams.get("amount")).toLocaleString()}원`}
          </div>
        </div>
        <div className="p-grid typography--p" style={{ marginTop: "10px" }}>
          <div className="p-grid-col text--left">
            <b>주문번호</b>
          </div>
          <div className="p-grid-col text--right" id="orderId">
            {`${searchParams.get("orderId")}`}
          </div>
        </div>
        <div className="p-grid typography--p" style={{ marginTop: "10px" }}>
          <div className="p-grid-col text--left">
            <b>paymentKey</b>
          </div>
          <div className="p-grid-col text--right" id="paymentKey" style={{ whiteSpace: "initial", width: "250px" }}>
            {`${searchParams.get("paymentKey")}`}
          </div>
        </div>
      </div>
      <div className="box_section" style={{ width: "600px", textAlign: "left" }}>
        <b>Response Data :</b>
        <div id="response" style={{ whiteSpace: "initial" }}>
          {responseData && <pre>{JSON.stringify(responseData, null, 4)}</pre>}
        </div>
      </div>
    </>
  );
}
