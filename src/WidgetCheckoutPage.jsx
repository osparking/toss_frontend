import "./App.css";
import getOrderIdPrefix from "./util/service";

function WidgetCheckoutPage() {
  const amount = 10700;
  const productName = "백설공주 2개 등";
  const orderId = getOrderIdPrefix(6);

  return (
    <>
      <h1>결제 창</h1>
      <div>
        <ul style={{ textAlign: "left" }}>
          <li>내역: {productName}</li>
          <li>금액: {amount}원</li>
          <li>주문ID: {orderId}00000001</li>
        </ul>
      </div>
    </>
  );
}

export default WidgetCheckoutPage;
