export default function reducer(state = {
    myList : null,
    fetching : false,
    fetched : false,
    error: null
}, action) {
    switch (action.type) {
        case "GET_LIST": {
            console.log("action.payload===>",action.payload)
            return { ...state,   myList : action.payload  };
        }
    }
    return state;
}