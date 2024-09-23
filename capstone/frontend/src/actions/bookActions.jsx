import axios from "axios";

// Create a booking
export const createBooking = (bookingData) => async (dispatch) => {
  try {
    dispatch({ type: "BOOKING_REQUEST" });
    const { data } = await axios.post(
      "http://localhost:5001/api/bookings",
      bookingData,
      {
        headers: {
          "x-auth-token": localStorage.getItem("token"),
        },
      }
    );
    dispatch({ type: "BOOKING_SUCCESS", payload: data });
  } catch (error) {
    dispatch({
      type: "BOOKING_FAILURE",
      payload: error.response.data.message || error.message,
    });
  }
};
