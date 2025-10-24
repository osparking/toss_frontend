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
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      setOrderName(checkResult.orderName);

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

  const doneData = [
    { property: "구매 항목:", value: orderName },
    { property: "주문 번호:", value: searchParams.get("orderId") },
    {
      property: "결제 금액:",
      value: Number(searchParams.get("amount")).toLocaleString() + "원",
    },
    { property: "결제 키:", value: searchParams.get("paymentKey") },
  ];
  return (
    <>
      <PaymentDoneModal
        show={isModalOpen}
        onHide={() => setIsModalOpen(false)}
        title="결제 완료"
      >
        <img
          width="100px"
          src="https://static.toss.im/illusts/check-blue-spot-ending-frame.png"
        />
        <h4>결제 완료 내용:</h4>
        <table border="1" style={{ borderCollapse: "collapse", width: "80%" }}>
          <tbody>
            {doneData.map((item, index) => (
              <tr key={index}>
                <th
                  style={{
                    textAlign: "right",
                    padding: "8px",
                    backgroundColor: "#f5f5f5",
                  }}
                >
                  {item.property}
                </th>
                <td style={{ padding: "8px", textAlign: "left" }}>
                  {item.value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </PaymentDoneModal>
      <div
        className="box_section"
        style={{ width: "600px", textAlign: "left" }}
      >
        <b>Response Data :</b>
        <div id="response" style={{ whiteSpace: "initial" }}>
          {responseData && <pre>{JSON.stringify(responseData, null, 4)}</pre>}
        </div>
      </div>
    </>
  );
}
