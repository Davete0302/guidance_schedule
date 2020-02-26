import AsyncStorage from '@react-native-community/async-storage';
import Endpoint from '../Constants/Endpoints';


const logout = () => {
    return {
        type: 'LOGOUT'
    }
}

const logoutSucess = () => {
    return {
        type: 'LOGOUT_SUCCESS'
    }
}


export const UserLogoutAsync = (navigation) => {
console.log(Endpoint.Logout_URL)
    return async (dispatch) => {

        dispatch(logout());
        await AsyncStorage.getItem('accessToken', (error, accessToken) => {
            fetch(Endpoint.Logout_URL, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`
                },

            })
                .then((response) => response.json())
                .then(async (responseJson) => {
                    console.log('logout', responseJson);
                    try {

                        // unsubscribe to a channel
                        // if (pusher) {
                        //     pusher.unsubscribe('private-general-broadcast-' + userid);
                        // }
                        // unsubscribe to a channel
                        dispatch(logoutSucess());
                        await AsyncStorage.removeItem('Type');
                        await AsyncStorage.removeItem('accessToken').then(() => {
                            navigation.navigate('Login')
                        
                        })
                    } catch (error) {
                        console.log(error);
                    }
                })
                .catch((error) => {
                    dispatch(logoutSucess());
                    console.log(error);
                    dispatch(onLoginFailed('Internal Server Error.'))
                });
        });
    }
}


