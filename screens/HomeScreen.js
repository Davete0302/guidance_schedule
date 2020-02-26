import React from 'react';
import { StyleSheet, Text, View, TouchableHighlight, Switch, ImageBackground, PermissionsAndroid, TextInput } from 'react-native';
import Colors from '../Constants/Colors';
import { ScrollView } from 'react-native-gesture-handler';
import { Overlay } from 'react-native-elements';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Geolocation from '@react-native-community/geolocation';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import AsyncStorage from '@react-native-community/async-storage';
import { connect } from 'react-redux';
import { LoadingOverlay } from "../components/Indicator";
let pageTitle;

class HomeScreen extends React.Component {
  state = {}
  constructor(props) {
    super(props)
    this.state = {
      switchValue: true, isVisible: false, Accept: false, Receipt: false,
      userlatitude: '7.0780', userlongitude: '125.6137',
      location: null, latitude: '7.0499', longitude: '125.5881',
      Type: 0, finalprice: false
    }
  }
 
  componentDidMount() {
      
    this.willFocusSubscription = this.props.navigation.addListener(
        'willFocus',
        () => {
          this.requestAccess();
          this._retrieveData();
        }
    );
}

componentWillUnmount() {
    this.willFocusSubscription.remove();
}
  _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('Type');
      const active = await AsyncStorage.getItem('Active');
      if (active === true || active === 'true') {
        this.props.navigation.setParams({ handleSave: this.toggleSwitch, switchValue: true, Save: this.Logout });
      } else {
        this.props.navigation.setParams({ handleSave: this.toggleSwitch, switchValue: false, Save: this.Logout });
      }
      if (value !== null) {
        //get user type 
        this.setState({ Type: value })
        this.props.navigation.setParams({ Type: value });
      }
    } catch (error) {

    }
  }
  toggleSwitch = async (value) => {
    let { Type } = this.state;
    let holder = !value;

    let active = !value;
    if (holder == true) {
      active = 1;
      await AsyncStorage.setItem('Active', 'true');
    } else {
      active = 0;
      await AsyncStorage.setItem('Active', 'false');
    }
    //set switch value in navigation
    this.props.navigation.setParams({
      switchValue: holder,
    });
    //set switch value in state
    this.setState({ switchValue: holder })
    if (Type == 2) {
      //hide overlay if user type is provider
      this.setState({ isVisible: false })
    } else {
      this.setState({ isVisible: holder })
    }
  }

  Navigate(RouteTo, HeaderTitle) {

    let header = HeaderTitle.replace(/"/g, '');
    this.props.navigation.navigate(RouteTo, { title: header });

  }

  requestAccess = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          'title': 'Location permission',
          'message': 'App needs access to your location ' +
            'so we can show your location.'
        }
      )
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        Geolocation.getCurrentPosition(
          (position) => {
            const location = JSON.stringify(position);

            this.setState({ location });
            this.setState({ userlatitude: position.coords.latitude });
            this.setState({ userlongitude: position.coords.longitude });
          },
          (error) => this.setState({ error: error.message }),
          { enableHighAccuracy: false, timeout: 20000, maximumAge: 1000 },
        );

      } else {
        console.log("Location permission denied")
      }
    } catch (err) {
      console.warn(err)
    }
  }
  render() {
    const { navigation } = this.props;
    const { isVisible, Accept, latitude, longitude, Receipt, userlatitude, userlongitude, finalprice } = this.state;
    pageTitle = JSON.stringify(navigation.getParam('title', 'default value'));
    let Texts = 'Item in Shop';
    let Service = JSON.stringify(navigation.getParam('Service', 'default value'));
    const serv = Service.replace(/"/g, '');
    const { isLoading } = this.props;
    return (

      <View style={{ flex: 1 }}>
        <LoadingOverlay visible={isLoading} />
        <Overlay
          width='90%'
          height='25%'
          isVisible={Accept}>
          <View style={styles.container}>
            <View style={styles.Card}>

              <Text style={{ fontSize: 20, textAlign: 'center', marginBottom: 20 }}>Are you sure you want to deny the order?</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                <TouchableHighlight
                  onPress={() => this.setState({ Accept: false })}
                  underlayColor='#fff'>
                  <FontAwesome name='check-circle' size={60} style={{ color: '#5cb85c', marginRight: 50 }} />
                </TouchableHighlight>
                <TouchableHighlight
                  onPress={() => this.setState({ isVisible: true, Accept: false })}
                  underlayColor='#fff'>
                  <FontAwesome name='times-circle' size={60} style={{ color: '#d9534f' }} />
                </TouchableHighlight>
              </View>
            </View>
          </View>
        </Overlay>



        <Overlay
          width='90%'
          height='90%'
          isVisible={isVisible}>

          <View style={styles.container}>
            <View style={styles.Card}>
              <ScrollView persistentScrollbar={true}>

                <Text style={styles.headline}>Name</Text>
                <Text style={styles.Textcontent}>Aresha Mae Pepino</Text>

                <Text style={styles.headline}>Address</Text>
                <Text style={styles.Textcontent}>BLK 8 Lot 11 Bonifacio St. Brgy. 23-C</Text>
                <Text style={styles.Textcontent}>Panacan, Davao City</Text>

                <Text style={styles.headline}>Note</Text>
                <Text style={styles.Textcontent}>Tapad sa Mcdonalds og Inasal, Red ang gate, atbang sa Holy Cross Davao College</Text>


                <Text style={styles.headline}>Date & Time</Text>
                <View style={{ flexDirection: 'row' }}>

                  <Text style={styles.Textcontent}>October 22, 2019</Text>


                  <Text style={{ fontSize: 16, marginLeft: 'auto', marginRight: 5 }}>9:30 AM</Text>

                </View>


                <Text style={styles.headline}>Contact Number</Text>
                <Text style={styles.Textcontent}>+63 999 9999 999</Text>
                <Text style={{ fontSize: 20, marginTop: 40, fontWeight: 'bold' }}>Estimated Cost</Text>
                <Text style={{ fontSize: 30, textAlign: 'center', marginTop: 5 }}>P500.00</Text>
                <View style={{ flexDirection: 'row' }}>

                  <TouchableHighlight style={styles.ready}
                    onPress={() => this.setState({ isVisible: false, Accept: false })}
                    underlayColor='#fff'>
                    <Text style={[styles.submitText]}>
                      Accept</Text>
                  </TouchableHighlight>

                  <TouchableHighlight style={styles.submit}
                    onPress={() => this.setState({ isVisible: false, Accept: true })}
                    underlayColor='#fff'>
                    <Text style={[styles.submitText]}>
                      Deny</Text>
                  </TouchableHighlight>
                </View>
              </ScrollView>



            </View>

          </View>

          <View style={{ position: 'absolute', bottom: 10, alignItems: 'center', alignSelf: 'center' }}>

          </View>


        </Overlay>

        <MapView
          provider={PROVIDER_GOOGLE}
          style={{ flex: 1 }} region={{
            latitude: parseFloat(userlatitude),
            longitude: parseFloat(userlongitude), latitudeDelta: 0.15,
            longitudeDelta: 0.15
          }}
          showsUserLocation={true} >

        </MapView>
      </View>

    );
  }

  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    if (params.Type == 2 || params.Type==5) {
      return {
        headerBackground: (
          <ImageBackground
            style={{ width: '100%', height: '100%' }}
            source={require('../assets/images/header.png')}
          />
        ),
        title: "Home",
        headerTitleStyle: { flex: 1, textAlign: 'center', color: 'white', fontSize: 20 },
        headerTintColor: 'white',
        headerStyle: {
          backgroundColor: '#4169E1',
        },

      };
    } else {
      return {
        headerBackground: (
          <ImageBackground
            style={{ width: '100%', height: '100%' }}
            source={require('../assets/images/header.png')}
          />
        ),
        title: "Home",
        headerTitleStyle: { flex: 1, textAlign: 'center', color: 'white', fontSize: 20 },
        headerTintColor: 'white',
        headerStyle: {
          backgroundColor: '#4169E1',
        },

        headerRight: <Switch
          thumbColor='white'
          trackColor={{ true: '#5cb85c', false: '#d9534f' }}
          style={{ transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }], color: '#5cb85c', marginRight: 5 }}
          onValueChange={() => params.handleSave(params.switchValue)}
          value={navigation.state.params.switchValue} />
      };
    }
  };
}

const mapStateToProps = (state) => {
  return state.toggle
}
export default connect(mapStateToProps, {  })(HomeScreen);


const styles = StyleSheet.create({
  mapPinContainer: {
    height: 25,
    width: 25,
    borderRadius: 25 / 2,
    overflow: 'hidden',
    borderColor: 'black',
    borderWidth: 2
  }, profileimage: {
    flex: 1,
    width: null,
    height: null
  }, container: {
    flex: 1,
    alignItems: 'center',
    textAlign: 'center',
  },
  Card: {
    width: '95%',
    height: '100%',
    padding: 15,
    borderRadius: 20,
    justifyContent: 'center',
  },
  headline: {
    fontSize: 20,
    marginTop: 15,
  }, Textcontent: {
    fontSize: 16,
  }
  , itemcontainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start' // if you want to fill rows left to right
  },
  item: {
    width: '50%', // is 50% of container width
  },
  item2: {
    width: '45%',
    marginLeft: 10, marginRight: 10,
    alignItems: 'flex-start' // is 50% of container width
  }, submit: {
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: Colors.CustomButton,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#fff',
    width: '45%',
    backgroundColor: '#d9534f',
    marginLeft: 5, marginRight: 5

  }, ready: {
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: Colors.CustomButton,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#fff',
    width: '45%',
    backgroundColor: '#5cb85c',
    marginLeft: 5, marginRight: 5

  },
  submitText: {
    color: '#fff',
    textAlign: 'center',
  }
});
