import React from 'react';
import { StyleSheet, Text, View, TouchableNativeFeedback, ImageBackground, FlatList, RefreshControl } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { ScrollView } from 'react-native-gesture-handler';
import { ListOfResult } from '../actions/NotificationsActions';
import { connect } from 'react-redux';
import { LoadingOverlay } from "../components/Indicator";
import { UserLogoutAsync } from '../actions/Login';
import AsyncStorage from '@react-native-community/async-storage';
class NotificationScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false, Type: 0, load: 1,
    };
  }
  componentDidMount() {
    this.willFocusSubscription = this.props.navigation.addListener(
      'willFocus',
      () => {
        this.props.navigation.setParams({ Save: this.Logout });
        this.props.ListOfResult();
      }
    );
  }

  componentWillUnmount() {
    this.willFocusSubscription.remove();
  }
  Logout = (value, response) => {
    console.log('clicked')
    this.props.UserLogoutAsync(this.props.navigation);
  }
  _onRefresh = () => {
    this.setState({ refreshing: true });
    this.props.ListOfNotifications(1);
    this.setState({ refreshing: false });
  }

  LoadMore = () => {
    // const { notification_list } = this.props;
    // console.log(notification_list.list.current_page)
    // if (notification_list.list.current_page < notification_list.list.last_page && notification_list.length != 0) {
    //   this.setState({ load: this.state.load + 1 })
    //   this.props.ListOfNotificationsPagination(this.state.load)
    // } 
  }

  Navigate(RouteTo, HeaderTitle, serv, id, typeID, category) {
    
    let header = HeaderTitle.replace(/"/g, '');
    this.props.navigation.navigate(RouteTo, { title: header});
  }

  
  render() {
    let { refreshing } = this.state;
    let { result_list, isLoading } = this.props;
    console.log(result_list)
    return (
      <View style={styles.container}>
        <View style={{ alignItems: 'center' }}>
        
          {result_list.length != 0 ?
            <FlatList
              showsHorizontalScrollIndicator={false}
              numColumns={1}
              data={result_list}
              renderItem={({ item }) =>
              <View>
              <View style={styles.Card}>
                <View style={styles.itemcontainer}>
                  <View style={styles.item1}>
                  <Text style={{fontSize:16,marginRight:15,fontWeight:'bold'}}>{item.schedule_type}</Text>
                  <Text style={{fontSize:14}}>{item.message}</Text>
                  {/* <Text style={styles.headline}>{item.email}</Text>
                    <Text style={styles.headline}>{item.schedule_type}</Text> */}

                  </View>
                </View>
              </View>
              </View>
              }
              keyExtractor={(item, index) => index.toString()}
              onEndReached={this.LoadMore}
              onEndReachedThreshold={0.1}
              ListFooterComponent={this.ListFooterComponent}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={this._onRefresh}
                />
              }
            />
            : null}
        </View>
        <View style={{ marginBottom: 5 }}></View>
      </View>


    );
  }
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;

    return {
      headerBackground: (
        <ImageBackground
          style={{ width: '100%', height: '100%' }}
          source={require('../assets/images/header.png')}
        />
      ),
      title: "Notifications",
      headerTitleStyle: { flex: 1, textAlign: 'center', color: 'white', fontSize: 20 },
      headerTintColor: 'white',
      headerStyle: {
        backgroundColor: '#4169E1',
      },
      headerRight: <TouchableNativeFeedback onPress={() => params.Save()} accessible={false}>
        <FontAwesome name='sign-out' size={25} style={{ marginRight: 20, color: 'white' }} />
      </TouchableNativeFeedback>
    };
  }
}
const mapStateToProps = (state) => {
  return state.result
}
export default connect(mapStateToProps, { ListOfResult, UserLogoutAsync })(NotificationScreen);



const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    textAlign: 'center',
  },
  Card: {
    width: '96%',
    borderRadius: 20,
    marginTop: 5,
    backgroundColor: '#fff',
    justifyContent: 'center',
    borderColor: '#F5F5F5',
    borderWidth: 1
  },
  headline: {
    fontSize: 12,
    fontWeight: 'bold'
  }, Textcontent: {
    fontSize: 10,
    color: 'white',
    paddingLeft: 15
  },
  itemcontainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginLeft: 20,
    marginBottom: 5,
    marginTop: 5

  },
  item: {
    width: '15%', // is 50% of container width
    alignItems: 'center',
  },
  item1: {
    width: '100%', // is 50% of container width

  },
  text: {
    fontSize: 10
  }, logoImage: {
    height: 30,
    width: 30,
    marginTop: 10,
    marginLeft: 10
  }, row: {
    flexDirection: 'row'
  }
});
