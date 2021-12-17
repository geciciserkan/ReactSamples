import { combineReducers } from "redux";
import launchesReducer from "./launches.reducer";

const rootReducer = () =>
  combineReducers({
    launches: launchesReducer,
  });
export default rootReducer;
