// import Types from "../actions/Types";

const initialState = {
    job_order: [],
    status_update: [],
    job_list: [],
    isLoadingPagination: false,
    isLoading: true,
    Loading: false,
    AcceptLoading: false,
    error: '',
    message: '',
    data: null,
    accept_job: [],
    listLoading: false,
    job_order_list:[{"created_at": "2020-02-18 16:08:14", "end_date": "2020-02-20 11:00", "id": 4, "isConfirmed": 1, "schedule_type": "Consultation", "start_date": "2020-02-20 09:00", "updated_at": "2020-02-18 16:09:20", "user_id": 3}],
    rating: [],
    job_details: [],

}


export const JobOrderListReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'GET_TRANSACTION':
            return { ...state, listLoading: true }
        case 'GET_TRANSACTION_SUCCESS':
            // console.log('list',action.list_of_providers )
            return { ...state, listLoading: false, job_order_list: action.job_order_list}
        case 'GET_TRANSACTION_FAILED':
            return { ...state, listLoading: false }
        case 'GET_TRANSACTION_PAGINATION':
            return { ...state, isLoadingPagination: true };
        case 'GET_TRANSACTION_PAGINATION_DONE':
            return { ...state, isLoadingPagination: false };
        case 'GET_TRANSACTION_PAGINATION_FAILED':
            return { ...state, isLoadingPagination: false };
        case 'GET_TRANSACTION_PAGINATION_SUCCESS':
            return { ...state, isLoadingPagination: true, job_order_list: action.job_order_list};
        default:
            return state;
    }
}



export const JobOrderDetailsReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'GET_DETAILS':
            return { ...state, isLoading: true }
        case 'GET_DETAILS_SUCCESS':
            // console.log('list',action.list_of_providers )
            return { ...state, isLoading: false, job_details: action.job_details }
        case 'GET_DETAILS_FAILED':
            return { ...state, isLoading: false }
        case 'CLEAR_ARRAY':
            return { ...state, isLoading: true, result: [] }
        default:
            return state;
    }
}


export const UpdateStatusReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'UPDATE_STATUS':
            return { ...state, Loading: true }
        case 'UPDATE_STATUS_SUCCESS':
            // console.log('list',action.list_of_providers )
            return { ...state, Loading: false, status_update: action.status_update }
        case 'UPDATE_STATUS_FAILED':
            return { ...state, Loading: false }
        case 'LOGOUT':
            return { ...state, isLoadingLogout: true };
        case 'LOGOUT_SUCCESS':
            return { ...state, isLoadingLogout: false };

        default:
            return state;
    }
}

// export const RatingReducer = (state = initialState, action) => {
//     switch (action.type) {
//         case 'RATING':
//             return { ...state,isLoading: true }
//         case 'RATING_SUCCESS':
//             // console.log('list',action.list_of_providers )
//             return { ...state, isLoading: false, rating: action.rating }
//         case 'RATING_FAILED':
//             return { ...state,isLoading: false }
//         default:
//             return state; 
//     }
// } 

