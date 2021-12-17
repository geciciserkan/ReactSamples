import { GET_LAUNCHES, LAUNCHES_ERROR, SELECT_LAUNCH } from "../types";
import axios from "axios";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";

export const getLaunches = () => async (dispatch: ThunkDispatch<void, unknown, AnyAction>) => {
  try {
    const res = await axios.get(
      `https://api.spacexdata.com/v3/launches/past?sort=flight_number&order=desc&limit=50`
    );
    dispatch({
      type: GET_LAUNCHES,
      payload: res.data,
    });
  } catch (e) {
    dispatch({
      type: LAUNCHES_ERROR,
      payload: console.log(e),
    });
  }
};

export const setSelectedLaunch = (selected: Launch | null) => (dispatch: ThunkDispatch<void, unknown, AnyAction>) => {
  console.log("test");
  dispatch({
    type: SELECT_LAUNCH,
    payload: selected,
  });
};
