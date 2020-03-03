import React, { useState, useEffect } from 'react';
import { Image, StyleSheet, Text, View, TextInput, ImageBackground, TouchableHighlight, Alert, Dimensions } from 'react-native';
import Colors from '../Constants/Colors';
import { WebView } from 'react-native-webview';
import Spinner from 'react-native-loading-spinner-overlay';
import AsyncStorage from '@react-native-community/async-storage';
import Endpoint from '../Constants/Endpoints';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Overlay } from 'react-native-elements';
let pageTitle;
let screenh = Dimensions.get('screen').height;
let screenw = Dimensions.get('screen').width;

class LoginScreen extends React.Component {
  state = {
    spinner: false, username: '', password: '',isVisible:false
  };
  componentDidMount() {
    this.willFocusSubscription = this.props.navigation.addListener(
      'willFocus',
      () => {
        this.getUserType();
      }
    );
  }
  componentWillUnmount() {
    this.willFocusSubscription.remove();
  }
  Navigate(RouteTo, HeaderTitle, type, active) {
    // alert('You tapped the button!');

    let header = pageTitle.replace(/"/g, '');
    this.props.navigation.navigate('Provider', { switchValue: active });

  }
  getUserType = async () => {
    let token = await AsyncStorage.getItem('accessToken');
    let count = await AsyncStorage.getItem('count');
    let email = await AsyncStorage.getItem('email');
    let pass = await AsyncStorage.getItem('pass');
   
    notifcount=count;
    try {
      if (token != null || token > 3) {
        this.fetchdata(email,pass)
      }
    } catch (error) {
      console.log(error)
    }
  }

  fetchdata(uname, password) {
    this.setState({ spinner: true });

    fetch(Endpoint.LOGIN_URL, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: uname, password: password })
    })
      .then(response => response.json())
      .then(async (json) => {
        try {
          console.log(json)
          await AsyncStorage.setItem('email', uname);
          await AsyncStorage.setItem('pass', password);
          await AsyncStorage.setItem('count', json.count+"");
          await AsyncStorage.setItem('accessToken', json.bearer_token).then(() => {
            this.setState({ spinner: false });
            notifcount=json.count;
            this.Navigate('CustomerDetails', 'title', json.type, json.active);
          });
        } catch (error) {
          console.log('catch');
          this.setState({ spinner: false });
          Alert.alert(
            'Error',
            'Email not Found. Please contact administrator.',
            [
              { text: 'OK' },
            ],
            { cancelable: false }
          )

        }
      })
      .catch(error => {
        this.setState({ spinner: false });
        console.error(error);
        Alert.alert(
          'Error',
          'Email not Found. Please contact administrator.',
          [
            { text: 'OK' },
          ],
          { cancelable: false }
        )
      });
  }
  signin(uname, pword) {
    if (uname == '' || pword == '') {
      Alert.alert(
        'Error',
        'Please fill in all fields',
        [
          { text: 'OK' },
        ],
        { cancelable: false }
      )
    } else {
      this.fetchdata(uname, pword)
    }

  }

  render() {
    const { navigation } = this.props;
    pageTitle = JSON.stringify(navigation.getParam('title', 'default value'));

    return (

    
     
        <View style={styles.container}>

          <Spinner
            visible={this.state.spinner}
            textContent={'Loading...'}
            textStyle={{ color: 'white' }} />

          <ImageBackground source={require('../assets/images/examback.jpg')} style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', resizeMode: "contain" }} >
          <Overlay
          width='95%'
          height='95%'
          isVisible={this.state.isVisible}>
                <WebView
          source={{ uri: 'http://54.254.162.165/register' }}
          style={{width:'100%',height:'100%'}} />
          <View style={{alignItems:'center',justifyContent:'center'}}>
                <TouchableHighlight style={styles.submit}
              onPress={() => this.setState({isVisible:false})}
              underlayColor='#fff'>
              <Text style={[styles.submitText]}>
                Close</Text>
            </TouchableHighlight>
            </View>
        </Overlay>
  
            <View style={styles.logoContainer}>

              <Image source={require('../assets/images/exam.png')} style={styles.logoImage} />
            </View>
            <View style={styles.content}>

              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  value={this.state.name}
                  onChangeText={(searchString) => { this.setState({ username: searchString }) }}
                  underlineColorAndroid="transparent" />
                <FontAwesome style={styles.searchIcon} name="user" size={28} color="#000" />
              </View>

            </View>
            <View style={styles.content}>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Password" secureTextEntry={true}
                  value={this.state.contact}
                  onChangeText={(searchString) => { this.setState({ password: searchString }) }}
                  underlineColorAndroid="transparent" />
                <FontAwesome style={styles.searchIcon} name="lock" size={28} color="#000" />
              </View>
            </View>

            <TouchableHighlight
              onPress={() => this.setState({isVisible:true})}
              underlayColor='#fff'>
              <Text style={{ color: 'blue' }}>
                Don't have an account?</Text>
            </TouchableHighlight>


            <TouchableHighlight style={styles.submit}
              onPress={() => this.signin(this.state.username, this.state.password)}
              underlayColor='#fff'>
              <Text style={[styles.submitText]}>
                Login</Text>
            </TouchableHighlight>

          </ImageBackground>

        </View>
      
    );
  }
  static navigationOptions = ({ navigation }) => ({

    title: navigation.state.params ? `${navigation.state.params.title}` : 'Default Title in Here',
    headerTitleStyle: { flex: 1, textAlign: 'center', color: 'white', fontSize: 20 },
    headerTintColor: 'white',
    headerStyle: {
      backgroundColor: '#4169E1',
    },
  })
}
export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    textAlign: 'center',
  }, submit: {
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: Colors.CustomButton,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#fff',
    width: '50%',
    marginTop: 15,
  },
  headline: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 0,
    color: 'white'

  },
  Ic: {
    color: 'white',
    marginRight: 10,
  },
  logoImage: {
    height: 200,
    width: 230,
  },
  logoContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    width: '80%',
    padding: 15,
    borderRadius: 20,
    marginTop: 10,
  },
  submitText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold'
  }, passwordContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#000',
    width: '100%'
  },
  input: {
    flex: 1,
    paddingRight: 10,
    paddingBottom: 0,
    paddingLeft: 0,
    color: '#424242',
  }, content: {
    flexDirection: 'row',
    width: '80%',
    padding: 15,
    justifyContent: 'center',
  },
});
