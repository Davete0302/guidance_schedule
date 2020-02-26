// import Types from "../actions/Types";

const initialState = {
    result: [],
    isLoading: false,
    error:'',
    message:'',
    data : null,
}

export const ToggleStatusReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'UPDATE_STATUS':
            return { ...state,isLoading: true }
        case 'UPDATE_STATUS_SUCCESS':
            return { ...state, isLoading: false, result: action.result }
        case 'UPDATE_STATUS_FAILED':
            return { ...state,isLoading: false }
        default:
            return state; 
    }
} 
