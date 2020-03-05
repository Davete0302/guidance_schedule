import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { Text, View, Linking } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { Avatar, Badge, Icon, withBadge } from 'react-native-elements'
//Home Screen
import HomeScreen from '../screens/HomeScreen';

// Dashboard Screens
import DashboardScreen from '../screens/DashboardScreen';
import JobOrderDetailsScreen from '../screens/JobOrderDetails';
import JobOrderLaundryDetailsScreen from '../screens/JobOrderLaundryDetailsScreen';

// Notification Screens
import NotificationScreen from '../screens/NotificationScreen';


const HomeStack = createStackNavigator({
  Home: HomeScreen,
});

HomeStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;

  if (navigation.state.index > 0) {
    tabBarVisible = false;

  }

  return {
    tabBarVisible,
  };
};

HomeStack.path = '';

const DashboardStack = createStackNavigator({
  Dashboard: DashboardScreen,
  DetailsJob: JobOrderDetailsScreen,
  JobDetails: JobOrderLaundryDetailsScreen,
});

DashboardStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;

  if (navigation.state.index > 0) {
    tabBarVisible = false;

  }

  return {
    tabBarVisible,
  };
};

DashboardStack.path = '';

const ResultStack = createStackNavigator({
  JobDetails: JobOrderLaundryDetailsScreen,
});

ResultStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;

  if (navigation.state.index > 0) {
    tabBarVisible = false;

  }

  return {
    tabBarVisible,
  };
};

ResultStack.path = '';


const NotificationStack = createStackNavigator({
  Notification: NotificationScreen,
});

NotificationStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;

  if (navigation.state.index > 0) {
    tabBarVisible = false;

  }

  return {
    tabBarVisible,
  };
};

NotificationStack.path = '';

class SupportScreen extends React.Component {
  constructor(props) {
    super(props)
    this.dialCall('09291639349 ');
  }
  componentDidMount() {
    this.willFocusSubscription = this.props.navigation.addListener(
      'willFocus',
      () => {
        this.dialCall('09123456789');
      }
    );
  }
  componentWillUnmount() {
    this.willFocusSubscription.remove();
  }
  dialCall = (number) => {
    let phoneNumber = '';
    this.props.navigation.navigate('Dashboard');
    if (Platform.OS === 'android') { phoneNumber = `tel:${number}`; }
    else { phoneNumber = `telprompt:${number}`; }
    Linking.openURL(phoneNumber);

  };
  render() {
    return (
      <View>
        {this.dialCall('665-9606')}
      </View>
    );
  }
}

export default createAppContainer(
  createBottomTabNavigator(
    {
      Home: HomeStack,
      Dashboard: DashboardStack,
      Support:SupportScreen,
      Result:ResultStack,
      Notification: NotificationStack,
    }, {
    backBehavior: 'history',
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarLabel: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state;
        let labelName;
        if (routeName === 'Home') {
          labelName = `Schedule`;
        } else if (routeName === 'Notification') {
          labelName = `Notification`;
        } else if (routeName === 'Dashboard') {
          labelName = `Exams`;
        } else if (routeName === 'Support') {
          labelName = `Suppport`;
        }
        else if (routeName === 'Result') {
          labelName = `Result`;
        }
        return <View><Text style={{ alignSelf: 'center', fontSize: 12, color: tintColor, marginBottom: 3, }}>{labelName}</Text></View>;
      },
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;
        let opac=0;
        if (routeName === 'Home') {
          iconName = `clock`;
          opac=0;
        } else if (routeName === 'Notification') {
          iconName = `bell`;
          opac=1;
        } else if (routeName === 'Dashboard') {
          iconName = `file`;
          opac=0;
        } else if (routeName === 'Support') {
          iconName = 'phone';
          opac=0;
        }
        else if (routeName === 'Result') {
          iconName = 'poll';
          opac=0;
        }
        return <View><MaterialCommunityIcons name={iconName} size={35} color={tintColor} style={{justifyContent:'center',marginTop:5}} active={tintColor} 
        />
        {notifcount>0?
        <Badge status="error" value={notifcount} containerStyle={{ position: 'absolute',alignSelf:'center',alignContent:'center', top: 8,left:15,opacity:opac }}/>
        :null}
        </View>;
      }
    }),
    resetOnBlur: true,
    tabBarOptions: {
      activeTintColor: 'white',
      inactiveTintColor: '#A0A0A0',
      style: {
        backgroundColor: '#780000',
      },

    },
  }));
