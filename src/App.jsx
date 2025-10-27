import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { FailPage } from "./Fail";
import WidgetCheckoutPage from "./WidgetCheckoutPage";
import { WidgetSuccessPage } from "./WidgetSuccess";
import MyPaymentsPage from "./MyPayments";

export default function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route>
        <Route path="/" element={<WidgetCheckoutPage />} />
        <Route path="/success" element={<WidgetSuccessPage />} />
        <Route path="/fail" element={<FailPage />} />
        <Route path="/my_payments" element={<MyPaymentsPage />} />
      </Route>
    )
  );

  return (
    <main className="">
      <RouterProvider router={router} />
    </main>
  );
}
