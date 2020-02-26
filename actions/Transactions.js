import AsyncStorage from '@react-native-community/async-storage';
import Endpoint from '../Constants/Endpoints';

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
    console.log(Endpoint.ListOfTransaction_URL + '?page=' + page)
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