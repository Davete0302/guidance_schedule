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
