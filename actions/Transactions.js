import AsyncStorage from '@react-native-community/async-storage';
import Endpoint from '../Constants/Endpoints';
import { Alert} from 'react-native';
const getTransaction = () => {
    return {
        type: 'GET_TRANSACTION'
    }
}
const getTransactionsSuccess = (data) => {
    return {
        type: 'GET_TRANSACTION_SUCCESS',
        job_order_list: data,
    }
}
const getTransactionsFailed = (message) => {
    return {
        type: 'GET_TRANSACTION_FAILED',
        message: message
    }
}


export const ListOfTransactions = (page) => {
    console.log(Endpoint.ListofSchedules )
    return async (dispatch) => {
        dispatch(getTransaction());
        try {
            await AsyncStorage.getItem('accessToken', (error, accessToken) => {
                fetch(Endpoint.ListofSchedules, {
                    method: 'GET',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'applcation/json',
                        Authorization: `Bearer ${accessToken}`
                    }
                })
                    .then((response) => response.json())
                    .then((responseJson) => {
                        console.log(responseJson)
                        dispatch(getTransactionsSuccess(responseJson));
                    })
                    .catch((error) => {
                        console.log(error);
                        dispatch(getTransactionsFailed())
                    })
            });
        } catch (error) {
            console.log(error);
            dispatch(getTransactionsFailed('Internal Server Error'))
        }
    }
}

const getDetails = () => {
    return {
        type: 'GET_DETAILS'
    }
}
const getDetailsSuccess = (data) => {
    return {
        type: 'GET_DETAILS_SUCCESS',
        job_details: data
    }
}
const getDetailsFailed = (message) => {
    return {
        type: 'GET_DETAILS_FAILED',
        message: message
    }
}


const clearArray = () => {
    return {
        type: 'CLEAR_ARRAY'
    }
}

export const ClearArrayAction = () => {
    return async (dispatch) => {
        dispatch(clearArray());
    }
}

export const TransactionDetails = (id) => {
  
    return async (dispatch) => {
        dispatch(getDetails());
        try {
            await AsyncStorage.getItem('accessToken', (error, accessToken) => {
                fetch(Endpoint.Questions_URL, {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'applcation/json',
                        Authorization: `Bearer ${accessToken}`
                    }, body: JSON.stringify({ question_id: id })
                })
                    .then((response) => response.json())
                    .then((responseJson) => {
                        console.log(responseJson)
                        dispatch(getDetailsSuccess(responseJson));
                    })
                    .catch((error) => {
                        console.log(error);
                        dispatch(getDetailsFailed())
                    })
            });
        } catch (error) {
            console.log(error);
            dispatch(getDetailsFailed('Internal Server Error'))
        }
    }
}



const UpdateStatus = () => {
    return {
        type: 'UPDATE_STATUS'
    }
}
const UpdateStatusSuccess = (data) => {
    return {
        type: 'UPDATE_STATUS_SUCCESS',
        status_update: data
    }
}
const UpdateStatusFailed = (message) => {
    return {
        type: 'UPDATE_STATUS_FAILED',
        message: message
    }
}

export const StatusUpdate = (question, choice, navigation, Route) => {
    console.log(question)
    return async (dispatch) => {
        dispatch(UpdateStatus());
        try {
            await AsyncStorage.getItem('accessToken', (error, accessToken) => {
                fetch(Endpoint.Submit_URL, {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'applcation/json',
                        Authorization: `Bearer ${accessToken}`
                    },
                    body: JSON.stringify({ question_id: question, choice_id: choice })
                })
                    .then((response) => response.json())
                    .then((responseJson) => {
                        console.log(responseJson)
                        dispatch(UpdateStatusSuccess(responseJson));
                        if (responseJson.question_id == question) {
                            if (question >= 21) {
                                questionId = 1;
                                navigation.navigate('Dashboard');
                            } else {
                               
                                if(Route=='JobDetails'){
                                    Route='Details';
                                }
                                questionId += 1;
                                navigation.navigate(Route, { questionId:questionId});
                            }

                        }
                    })
                    .catch((error) => {
                        console.log(error);
                        dispatch(UpdateStatusFailed())
                    })
            });
        } catch (error) {
            console.log(error);
            dispatch(UpdateStatusFailed('Internal Server Error'))
        }
    }
}



const Schedule = () => {
    return {
        type: 'SCHEDULE'
    }
}
const ScheduleSuccess = (data) => {
    return {
        type: 'SCHEDULE_SUCCESS',
        schedule: data
    }
}
const ScheduleFailed = (message) => {
    return {
        type: 'SCHEDULE_FAILED',
        message: message
    }
}

export const CreateSchedule = (type, date, from, to,sched) => {
   let data={};
    if (type=='Consultation'){
        data={
            type:type,
            date:date,
            isConfirmed:0,
            from:from,
            to:to,
            typeOfSched:sched
        }
    }else{
        data={
            type:type,
            date:date,
            isConfirmed:0,
            typeOfSched:sched
        }
    }
    console.log(data)
    console.log(Endpoint.CreateSchedule_URL)

    return async (dispatch) => {
        dispatch(Schedule());
        try {
            await AsyncStorage.getItem('accessToken', (error, accessToken) => {
                fetch(Endpoint.CreateSchedule_URL, {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'applcation/json',
                        Authorization: `Bearer ${accessToken}`
                    },
                    body: JSON.stringify(data)
                })
                    .then((response) => response.json())
                    .then(async (responseJson) => {
                        console.log(responseJson)
                       if(responseJson.isConfirmed==0){
                        Alert.alert(
                            "Alert",
                            'Successfully scheduled for '+type,
                            [
                              { text: "Ok", onPress: () => console.log("later pressed") },
                            ],
                            { cancelable: false }
                          );
                       }else{
                        Alert.alert(
                            "Alert",
                            'Something went wrong.',
                            [
                              { text: "Ok", onPress: () => console.log("later pressed") },
                            ],
                            { cancelable: false }
                          );
                       }
                        dispatch(ScheduleSuccess(responseJson));
                     
                    })
                    .catch((error) => {
                        console.log(error);
                        dispatch(ScheduleFailed())
                    })
            });
        } catch (error) {
            console.log(error);
            dispatch(ScheduleFailed('Internal Server Error'))
        }
        
    }
}