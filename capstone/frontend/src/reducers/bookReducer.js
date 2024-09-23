const initialState = {
  loading: false,
  booking: null,
  error: null,
};

const bookReducer = (state = initialState, action) => {
  switch (action.type) {
    case "BOOKING_REQUEST":
      return { ...state, loading: true, error: null };
    case "BOOKING_SUCCESS":
      return { ...state, loading: false, booking: action.payload };
    case "BOOKING_FAILURE":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default bookReducer;
