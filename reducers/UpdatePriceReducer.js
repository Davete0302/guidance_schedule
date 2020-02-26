// import Types from "../actions/Types";

const initialState = {
    result: [],
    isLoading: false,
    error: '',
    message: '',
    data: null,
}

export const UpdatePriceReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'UPDATE_PRICE':
            return { ...state, isLoading: true }
        case 'UPDATE_PRICE_SUCCESS':
            return { ...state, isLoading: false, result: action.result }
        case 'UPDATE_PRICE_FAILED':
            return { ...state, isLoading: false }
        default:
            return state;
    }
} 
