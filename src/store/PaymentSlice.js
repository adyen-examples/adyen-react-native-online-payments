import { createSlice } from "@reduxjs/toolkit";

// set the correct URL based on what is output during `npm run server`
export const SERVER_URL = "http://192.168.2.42:8089";

export const slice = createSlice({
  name: "payment",
  initialState: {
    error: "",
    paymentLinksRes: null,
    paymentMethodsRes: null,
    paymentMethodInUse: null,
    paymentRes: null,
    paymentDetailsRes: null,
  },
  reducers: {
    paymentLinks: (state, action) => {
      const [res, status] = action.payload;
      if (status >= 300) {
        state.error = res;
      } else {
        state.paymentLinksRes = res;
      }
    },
    paymentMethods: (state, action) => {
      const [res, status] = action.payload;
      if (status >= 300) {
        state.error = res;
      } else {
        state.paymentMethodsRes = res;
      }
    },
    paymentMethodInUse: (state, action) => {
      if (state.paymentMethodsRes && state.paymentMethodsRes.paymentMethods) {
        state.paymentMethodInUse = state.paymentMethodsRes.paymentMethods.filter(
          (it) => it.type === action.payload
        );
      }
    },
    payments: (state, action) => {
      const [res, status] = action.payload;
      if (status >= 300) {
        state.error = res;
      } else {
        state.paymentRes = res;
      }
    },
    paymentDetails: (state, action) => {
      const [res, status] = action.payload;
      if (status >= 300) {
        state.error = res;
      } else {
        state.paymentDetailsRes = res;
      }
    },
  },
});

export const {
  setBilling,
  paymentMethods,
  paymentMethodInUse,
  payments,
  paymentDetails,
  paymentLinks,
} = slice.actions;

export const setPaymentMethodInUse = (type) => (dispatch) => {
  dispatch(paymentMethodInUse(type));
};
export const getPaymentLinks = () => async (dispatch) => {
  const response = await fetch(`${SERVER_URL}/api/getPaymentLinks`, {
    method: "POST",
  });
  dispatch(paymentLinks([await response.json(), response.status]));
};

export const getPaymentMethods = () => async (dispatch) => {
  const response = await fetch(`${SERVER_URL}/api/getPaymentMethods`, {
    method: "POST",
  });
  dispatch(paymentMethods([await response.json(), response.status]));
};

export const initiatePayment = (data) => async (dispatch) => {
  const response = await fetch(`${SERVER_URL}/api/initiatePayment`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
  dispatch(payments([await response.json(), response.status]));
};

export const submitAdditionalDetails = (data) => async (dispatch) => {
  const response = await fetch(`${SERVER_URL}/api/submitAdditionalDetails`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
  dispatch(paymentDetails([await response.json(), response.status]));
};

export default slice.reducer;
