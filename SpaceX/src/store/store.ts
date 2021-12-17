import { applyMiddleware, createStore, compose } from "redux";
import thunk from "redux-thunk";
import rootReducer from "./reducers";
import { composeWithDevTools } from 'redux-devtools-extension';

const configureStore = () => {
  const middlewares = [thunk];
  const enhancers = composeWithDevTools(applyMiddleware(...middlewares));
  const store = createStore(rootReducer(), enhancers);

  return store;
};

export default configureStore;
