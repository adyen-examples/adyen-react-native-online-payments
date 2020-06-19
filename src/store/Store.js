import { configureStore } from "@reduxjs/toolkit";
import paymentReducer from "./PaymentSlice";

export default configureStore({
  reducer: {
    payment: paymentReducer,
  },
});
