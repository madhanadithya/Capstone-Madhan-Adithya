import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import { thunk } from "redux-thunk";
import categoryReducer from "../reducers/categoryReducer";
import bookReducer from "../reducers/bookReducer";
import authReducer from "../reducers/authReducer";

const rootReducer = combineReducers({
  auth: authReducer,
  category: categoryReducer,
  book: bookReducer,
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk))
);

export default store;
