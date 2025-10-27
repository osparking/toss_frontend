import { Button, Table } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import "./MyPayments.css";
import { formatDate } from "./util/service";

const MyPaymentsPage = () => {
  const location = useLocation();
  const recentPayments = location.state?.data;
  const navigate = useNavigate();

  const gotoPayment = () => {
    navigate("/");
  };

  return (
    <div className="box_section" style={{ width: "800px", textAlign: "left" }}>
      <div className="d-flex justify-content-center align-items-center">
        <h3>최근 결제 목록</h3>
      </div>
      <div className="d-flex justify-content-center align-items-center">
        <h5>(결제일시 역순)</h5>
      </div>
      <div
        id="response"
        style={{ whiteSpace: "initial" }}
        className="d-flex justify-content-center align-items-center"
      >
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>주문ID</th>
              <th>결제일시</th>
              <th>결제방법</th>
              <th>결제금액</th>
              <th>주문명</th>
              <th>영수증</th>
            </tr>
          </thead>
          <tbody>
            {recentPayments &&
              recentPayments.map((payment, idx) => (
                <tr key={idx}>
                  <td>{payment.orderId}</td>
                  <td>{formatDate(payment.approvedAt)}</td>
                  <td>{payment.method}</td>
                  <td>{Number(payment.totalAmount).toLocaleString()}원</td>
                  <td>{payment.orderName}</td>
                  <td>
                    <a href={payment.receiptUrl} target="_blank">
                      링크
                    </a>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      </div>
      <div className="d-flex justify-content-center align-items-center">
        <Button
          variant="info"
          onClick={() => gotoPayment()}
          style={{ marginTop: "30px" }}
        >
          결제 창
        </Button>
      </div>
    </div>
  );
};

export default MyPaymentsPage;
