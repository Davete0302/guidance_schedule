// import Types from "../actions/Types";

const initialState = {
    notification_list: [],
    notifications: [],
    noticationsLoading: false,
    isLoading: true,
    error:'',
    message:'',
    data : null,
}

export const NotoficationListReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'GET_NOTIFICATION':
            return { ...state,isLoading: true }
        case 'GET_NOTIFICATION_SUCCESS':
            return { ...state, isLoading: false, notification_list: action.notification_list,notifications:action.notifications }
        case 'GET_NOTIFICATION_FAILED':
            return { ...state,isLoading: false }
            case 'GET_NOTIFICATIONS_PAGINATION':
                return { ...state, noticationsLoading: true };
            case 'GET_NOTIFICATIONS_PAGINATION_DONE':
                return { ...state, noticationsLoading: false };
            case 'GET_NOTIFICATIONS_PAGINATION_FAILED':
                return { ...state, noticationsLoading: false };
            case 'GET_NOTIFICATIONS_PAGINATION_SUCCESS':
                return { ...state, noticationsLoading: true, notification_list: action.notification_list, notifications: [...state.notifications, action.notifications] };
        default:
            return state; 
    }
} 
