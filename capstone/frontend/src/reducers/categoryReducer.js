const initialState = {
  categories: [],
  serviceTypes: [],
  services: [],
  loading: false,
  error: null,
};

const categoryReducer = (state = initialState, action) => {
  switch (action.type) {
    case "CATEGORIES_REQUEST":
      return { ...state, loading: true };
    case "CATEGORIES_SUCCESS":
      return { ...state, loading: false, categories: action.payload };
    case "CATEGORIES_FAILURE":
      return { ...state, loading: false, error: action.payload };

    case "SERVICE_TYPES_REQUEST":
      return { ...state, loading: true };
    case "SERVICE_TYPES_SUCCESS":
      return { ...state, loading: false, serviceTypes: action.payload };
    case "SERVICE_TYPES_FAILURE":
      return { ...state, loading: false, error: action.payload };

    case "SERVICES_REQUEST":
      return { ...state, loading: true };
    case "SERVICES_SUCCESS":
      return { ...state, loading: false, services: action.payload };
    case "SERVICES_FAILURE":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

export default categoryReducer;
