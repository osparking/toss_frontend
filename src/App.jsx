import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";
import WidgetCheckoutPage from "./WidgetCheckoutPage";
import { WidgetSuccessPage } from "./WidgetSuccess";
import { FailPage } from "./Fail.";


export default function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route>
      {/* <Route path="/" element={<WidgetCheckoutPage />}> */}
        {/* <Route index element={<WidgetCheckoutPage />} /> */}
        <Route path="/" element={<WidgetCheckoutPage />} />
        <Route path="/success" element={<WidgetSuccessPage />} />
        <Route path="/fail" element={<FailPage />} />
      </Route>
    )
  );

  return (
    <main className="">
      <RouterProvider router={router} />
    </main>
  );
}
