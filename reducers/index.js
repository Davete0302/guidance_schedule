import { combineReducers } from 'redux';
import {JobOrderListReducer,JobOrderDetailsReducer,ScheduleReducer,UpdateStatusReducer} from './JobOrderReducer';
import {NotoficationListReducer ,ResultListReducer} from './NotificationReducer';
export default combineReducers({
    status:UpdateStatusReducer,
    notiflist:NotoficationListReducer,
    schedule:ScheduleReducer,
    result:ResultListReducer
}) 
