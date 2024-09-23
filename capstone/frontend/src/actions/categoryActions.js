// actions/categoryActions.js
import axios from "axios";

// Fetch all categories
export const getCategories = () => async (dispatch) => {
  try {
    dispatch({ type: "CATEGORIES_REQUEST" });
    const { data } = await axios.get(
      "http://localhost:5001/api/consumer/categories"
    );
    dispatch({ type: "CATEGORIES_SUCCESS", payload: data });
  } catch (error) {
    dispatch({ type: "CATEGORIES_FAILURE", payload: error.message });
  }
};

// Fetch service types by category
export const getServiceTypesByCategory = (categoryId) => async (dispatch) => {
  try {
    dispatch({ type: "SERVICE_TYPES_REQUEST" });
    const { data } = await axios.get(
      `http://localhost:5001/api/consumer/service-types/category/${categoryId}`
    );
    dispatch({ type: "SERVICE_TYPES_SUCCESS", payload: data });
  } catch (error) {
    dispatch({ type: "SERVICE_TYPES_FAILURE", payload: error.message });
  }
};

// Fetch services by service type
export const getServicesByServiceType = (serviceTypeId) => async (dispatch) => {
  try {
    dispatch({ type: "SERVICES_REQUEST" });
    const { data } = await axios.get(
      `http://localhost:5001/api/consumer/services/service-type/${serviceTypeId}`
    );
    dispatch({ type: "SERVICES_SUCCESS", payload: data });
  } catch (error) {
    dispatch({ type: "SERVICES_FAILURE", payload: error.message });
  }
};
