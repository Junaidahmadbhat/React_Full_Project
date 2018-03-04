
import store from "../store";


export function getappointmentList(apponintmentList) {
    console.log("inside get getappointmentList");

    return function (dispatch) {
        dispatch({ type: "GET_LIST",  payload: apponintmentList });
    }
}