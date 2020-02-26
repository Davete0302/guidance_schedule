import Spinner from 'react-native-loading-spinner-overlay';
import Color from '../Constants/Colors';
import React from 'react';
export const LoadingOverlay = (prop) => {
    return (
        <Spinner
            cancelable={true}
            animation='fade'
            visible={prop.visible}
            color={Color.primary}
            overlayColor='rgba(255,255,255,1)'
            textStyle={{color: Color.primary}}
            textContent={prop.textContent}
        />
    )
}
