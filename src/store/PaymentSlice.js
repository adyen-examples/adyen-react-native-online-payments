import { createSlice } from "@reduxjs/toolkit";

// set the correct URL based on what is output during `npm run server`
export const SERVER_URL = "http://192.168.2.42:8089";

export const slice = createSlice({
  name: "payment",
  initialState: {
    error: "",
    paymentLinksRes: null,
    paymentMethodsRes: null,
    paymentRes: null,
    paymentDetailsRes: null,
    // config: {
    //   paymentMethodsConfiguration: {
    //     ideal: {
    //       showImage: true,
    //     },
    //     card: {
    //       hasHolderName: true,
    //       holderNameRequired: true,
    //       name: "Credit or debit card",
    //       amount: {
    //         value: 1000, // 10€ in minor units
    //         currency: "EUR",
    //       },
    //     },
    //   },
    //   locale: "en_NL",
    //   showPayButton: true,
    // },
  },
  reducers: {
    // config: (state, action) => {
    //   state.config = {
    //     ...state.config,
    //     ...action.payload,
    //   };
    // },
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
//   config,
  paymentMethods,
  payments,
  paymentDetails,
  paymentLinks,
} = slice.actions;

// export const getAdyenConfig = () => async (dispatch) => {
//   const response = await fetch(`${SERVER_URL}/api/config`);
//   dispatch(config(await response.json()));
// };

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
