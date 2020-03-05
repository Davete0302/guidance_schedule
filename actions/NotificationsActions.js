import AsyncStorage from '@react-native-community/async-storage';
import Endpoint from '../Constants/Endpoints';


const getNotification = () => {
    return {
        type: 'GET_NOTIFICATION'
    }
}
const getNotificationSuccess = (data) => {
    return {
        type: 'GET_NOTIFICATION_SUCCESS',
        notification_list: data
    }
}
const getNotificationFailed = (message) => {
    return {
        type: 'GET_NOTIFICATION_FAILED',
        message: message
    }
}


export const ListOfNotifications = (page) => {
    return async (dispatch) => {
        dispatch(getNotification());
        try {
            await AsyncStorage.getItem('accessToken', (error, accessToken) => {
                fetch(Endpoint.ListofScores, {
                    method: 'GET',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'applcation/json',
                        Authorization: `Bearer ${accessToken}`
                    }
                })
                    .then((response) => response.json())
                    .then((responseJson) => {
                        dispatch(getNotificationSuccess(responseJson));
                    })
                    .catch((error) => {
                        console.log(error);
                        dispatch(getNotificationFailed())
                    })
            });
        } catch (error) {
            console.log(error);
            dispatch(getNotificationFailed('Internal Server Error'))
        }
    }
}


const getResult= () => {
    return {
        type: 'GET_RESULT'
    }
}
const getResultSuccess = (data) => {
    return {
        type: 'GET_RESULT_SUCCESS',
        result_list: data
    }
}
const getResultFailed = (message) => {
    return {
        type: 'GET_RESULT_FAILED',
        message: message
    }
}


export const ListOfResult = (page) => {
    return async (dispatch) => {
        dispatch(getResult());
        try {
            await AsyncStorage.getItem('accessToken', (error, accessToken) => {
                fetch(Endpoint.Notif_URL, {
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
                        dispatch(getResultSuccess(responseJson));
                    })
                    .catch((error) => {
                        console.log(error);
                        dispatch(getResultFailed())
                    })
            });
        } catch (error) {
            console.log(error);
            dispatch(getResultFailed('Internal Server Error'))
        }
    }
}