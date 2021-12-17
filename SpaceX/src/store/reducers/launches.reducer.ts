import { AnyAction } from "redux";
import { GET_LAUNCHES, SELECT_LAUNCH } from "../types";

const initialState = {
  launches: [],
  loading: true,
  selected: null,
};

export default function (state = initialState, action: AnyAction) {
  switch (action.type) {
    case GET_LAUNCHES:
      return {
        ...state,
        launches: action.payload.map((item: any) => ({
          id: item.flight_number,
          launch_name: item.mission_name,
          launch_date_local: new Date(item.launch_date_local),
          full_details: { ...item },
        })),
        loading: false,
      };
    case SELECT_LAUNCH:
      return {
        ...state,
        selected: action.payload,
      };
    default:
      return state;
  }
}
