import { Dimensions } from 'react-native';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default {
   
    margin: 10,
    padding: 10,
    window: {
        width,
        height,
    },
    isSmallDevice: width < 375,
    extraSmall: 12,
    small: 15,
    medium: 18,
    large: 20,
    extraLarge: 25,
    buttonBorderRadius: 10,
    buttonPadding: 12,
    buttonMargin: 10,
    buttonWidth: 265,
    logoWidth: 220,
    logoHeight: 200,
    headerlogoWidth: 70,
    headerlogoHeight: 60,
    socialButton: 100,
    socialButtonHeigth: 60,
    socialButtonWidth: 60,
    socialButtonRadius: 60 / 2,
    inputTextMargin:10,
    whiteButtonWidth: 375,
    whiteButtonHeight: 60,
    whiteButtonPadding: 15,
    imageButtonWidth: 100,
    imageButtonHeight: 100,
}