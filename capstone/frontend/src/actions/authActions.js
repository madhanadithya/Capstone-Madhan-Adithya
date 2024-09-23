import axios from "axios";

export const REGISTER_SUCCESS = "REGISTER_SUCCESS";
export const REGISTER_FAIL = "REGISTER_FAIL";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAIL = "LOGIN_FAIL";
export const LOGOUT = "LOGOUT";
export const GET_USER_SUCCESS = "GET_USER_SUCCESS";

const API_URL = "http://localhost:5001/api/auth";

export const register = (userData) => async (dispatch) => {
  try {
    await axios.post(`${API_URL}/register`, userData);
    dispatch({ type: REGISTER_SUCCESS });
  } catch (error) {
    dispatch({
      type: REGISTER_FAIL,
      payload: error.response.data.message,
    });
  }
};

export const login = (credentials) => async (dispatch) => {
  try {
    const response = await axios.post(`${API_URL}/login`, credentials);
    const { token } = response.data;

    // Save token to local storage or state
    localStorage.setItem("token", token);

    // Fetch user details with the token
    const userResponse = await axios.get(`${API_URL}/user`, {
      headers: {
        "x-auth-token": token,
      },
      params: {
        email: credentials.email,
        password: credentials.password,
      },
    });

    dispatch({
      type: LOGIN_SUCCESS,
      payload: { user: userResponse.data, token },
    });

    // Redirect based on role
    const { role } = userResponse.data;
    if (role === "consumer") {
      window.location.href = "/";
    } else if (role === "provider") {
      window.location.href = "/provider";
    } else if (role === "admin") {
      window.location.href = "/admin";
    }
  } catch (error) {
    dispatch({
      type: LOGIN_FAIL,
      payload: error.response.data.message,
    });
  }
};

export const logout = () => {
  localStorage.removeItem("token");
  return { type: LOGOUT };
};

export const getUserDetails = (email, password) => async (dispatch) => {
  try {
    const response = await axios.get(`${API_URL}/user`, {
      headers: {
        "x-auth-token": localStorage.getItem("token"),
      },
      params: {
        email,
        password,
      },
    });
    dispatch({ type: GET_USER_SUCCESS, payload: response.data });
  } catch (error) {
    console.error(error);
  }
};
