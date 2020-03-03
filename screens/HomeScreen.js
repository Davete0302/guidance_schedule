import React from 'react';
import { StyleSheet, TouchableHighlight, Text, View, Picker, Alert, ImageBackground, TouchableWithoutFeedback, TextInput } from 'react-native';
import Colors from '../Constants/Colors';
import moment from "moment";
import { ScrollView } from 'react-native-gesture-handler';
import { Calendar } from 'react-native-calendars';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { CreateSchedule } from '../actions/Transactions';
import { connect } from 'react-redux';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { UserLogoutAsync } from '../actions/Login';
import { WebView } from 'react-native-webview';
let pageTitle;

class HomeScreen extends React.Component {
  state = {}
  constructor(props) {
    super(props)
    this.state = {
      isDateTimePickerVisible: false, isDateTimePickerVisible1: false,
      selectedStartDate: '', disabled: true,
      StartTime: moment(new Date(), 'hh:mm:ss'),
      EndTime: moment(new Date(), 'hh:mm:ss'),
      schedType: 'Referral', examType: 'Consultation',
      refType: [
        { label: 'Referral', value: 'Referral' },
        { label: 'Call in', value: 'Call in' },
        { label: 'Walk in', value: 'Walk in' }
      ],
      examSel: [
        { label: 'Consultation', value: 'Consultation' },
        { label: 'Examination - College Adjustment Scale', value: 'Examination - College Adjustment Scale' },
        { label: 'Examination - Standard Progressive Matrices', value: 'Examination - Standard Progressive Matrices' },
        { label: 'Examination - 16 Personality Factor Test', value: 'Examination - 16 Personality Factor Test' },
        { label: "Examination - Beck's Depression Inventory", value: "Examination - Beck's Depression Inventory" },
        { label: 'Examination - Filipino Work Values Scale', value: 'Examination - Filipino Work Values Scale' },
        { label: 'Examination - IQ Test', value: 'Examination - IQ Test' },
        { label: 'Examination - Basic Personality Inventory', value: 'Examination - Basic Personality Inventory' },
        { label: 'Examination - BarOn Emotional Quotient Inventory', value: 'Examination - BarOn Emotinal Quotient Inventory' },

      ],
    }
  }

  componentDidMount() {

    this.willFocusSubscription = this.props.navigation.addListener(
      'willFocus',
      () => {
        this.props.navigation.setParams({ Save: this.Logout });
        this.setState({ EndTime: moment(this.state.StartTime).add(1, 'hours') })
      }
    );
  }


  componentWillUnmount() {
    this.willFocusSubscription.remove();
  }

  Logout = (value, response) => {
    this.props.UserLogoutAsync(this.props.navigation);
  }

  handleDatePicked = date => {
    let format = 'hh:mm:ss'
    console.log(date)
    // var time = moment() gives you current time. no format required.
    let time = moment(date, format),
      beforeTime = moment('07:59:00', format),
      afterTime = moment('20:01:00', format);
    if (time.isBetween(beforeTime, afterTime)) {
      this.setState({
        StartTime: date,
      });

    } else {
      Alert.alert(
        "Alert",
        'Booking time is between 8:00 AM to 8:00 PM',
        [
          { text: "Ok", onPress: () => console.log("later pressed") },
        ],
        { cancelable: false }
      );
    }
    this.hideDateTimePicker();
  };

  showDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: true });
  };
  hideDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: false });
  };

  handleDatePicked1 = date => {
    let format = 'hh:mm:ss'
    // var time = moment() gives you current time. no format required.
    let time = moment(date, format),
      beforeTime = moment('07:59:00', format),
      afterTime = moment('20:01:00', format);
    if (time.isBetween(beforeTime, afterTime)) {
      this.setState({
        EndTime: date,
      });

    } else {
      Alert.alert(
        "Alert",
        'Booking time is between 8:00 AM to 8:00 PM',
        [
          { text: "Ok", onPress: () => console.log("later pressed") },
        ],
        { cancelable: false }
      );
    }
    this.hideDateTimePicker1();
  };

  showDateTimePicker1 = () => {
    this.setState({ isDateTimePickerVisible1: true });
  };
  hideDateTimePicker1 = () => {
    this.setState({ isDateTimePickerVisible1: false });
  };


  onDateChange(date) {
    this.setState({
      selectedStartDate: date
    });
  }

  renderPicker() {
    let itemsource = this.state.refType.map((item, i) => <Picker.Item key={i} label={item.label} value={item.value} />);
    return (
      <View style={{ backgroundColor: 'white' }}>
        <Picker selectedValue={this.state.schedType} onValueChange={this.refAction.bind(this)} mode="dropdown" style={{ height: 40 }} >
          {/* <Picker.Item value='' label='Select Home Type' style={{color:'grey'}} /> */}
          {itemsource}
        </Picker>
      </View>
    );
  }
  refAction(typename) {
    console.log(typename)
    this.setState({ schedType: typename })
  }

  renderPickerExam() {
    let itemsource = this.state.examSel.map((item, i) => <Picker.Item key={i} label={item.label} value={item.value} />);
    return (
      <View style={{ backgroundColor: 'white' }}>
        <Picker selectedValue={this.state.examType} onValueChange={this.examAction.bind(this)} mode="dropdown" style={{ height: 40 }} >
          {/* <Picker.Item value='' label='Select Home Type' style={{color:'grey'}} /> */}
          {itemsource}
        </Picker>
      </View>
    );
  }
  examAction(typename) {
    if (typename == 'Consultation') {
      this.setState({ disabled: true })
    } else {
      this.setState({ disabled: false })
    }
    this.setState({ examType: typename })
  }

  Sched() {
    let from = moment(this.state.StartTime).format("HH:mm");
    let to = moment(this.state.EndTime).format("HH:mm");
    if (this.state.selectedStartDate == '') {
      Alert.alert(
        "Alert",
        'Select Day',
        [
          { text: "Ok", onPress: () => console.log("later pressed") },
        ],
        { cancelable: false }
      );
    } else {
      this.props.CreateSchedule(this.state.examType, this.state.selectedStartDate, from, to, this.state.schedType);
      this.setState({ selectedStartDate: '' })
      this.forceUpdate()

    }
  }

  render() {
    console.log(this.state.disabled)
    const { selectedStartDate, StartTime, EndTime } = this.state;
    let dates = moment(selectedStartDate).format("YYYY-MM-DD");
    const finaltime = StartTime ? moment(StartTime).format("hh:mm A") : moment(new Date()).format("hh:mm A");
    const Totime = EndTime ? moment(EndTime).format("hh:mm A") : moment(new Date()).format("hh:mm A");
    return (
      <ScrollView style={styles.back}>
        <View>
          <View style={styles.container}>

            <Text style={styles.headline}>Type of Schedule</Text>
            {this.renderPickerExam()}

            <Text style={styles.headline}>Type</Text>
            {this.renderPicker()}
            <Text style={styles.headline}>Choose Schedule</Text>
          </View>
          <View style={styles.content}>
            <Text style={{ marginBottom: 5 }}>Set Date</Text>
            {/* <Calendars minDate={minDate}  width={280} onDateChange={this.onDateChange} /> */}
            {/* <WebView
          source={{ uri: 'http://54.254.162.165/webview' }}
          style={{width:'auto',height:500,marginBottom:30}} /> */}
            {/* http://54.254.162.165/webview */}
            <Calendar
              onDayPress={({ dateString }) => this.onDateChange(dateString)}
              style={styles.Card}
              minDate={new Date()}
              markedDates={{ [dates]: { disabled: true, startingDay: true, color: '#780000', endingDay: true } }}
              markingType={'period'}
              theme={{
                backgroundColor: '#ffffff',
                calendarBackground: '#ffffff',
                textSectionTitleColor: '#b6c1cd',
                selectedDayBackgroundColor: '#00adf5',
                selectedDayTextColor: '#ffffff',
                todayTextColor: '#00adf5',
                dayTextColor: '#2d4150',
                textDisabledColor: '#d9e1e8',
                dotColor: '#00adf5',
                selectedDotColor: '#ffffff',
                arrowColor: '#154c99',
                disabledArrowColor: '#d9e1e8',
                monthTextColor: 'black',
                indicatorColor: 'blue',
                textDayFontFamily: 'monospace',
                textMonthFontFamily: 'monospace',
                textDayHeaderFontFamily: 'monospace',
                textDayFontWeight: '300',
                textMonthFontWeight: 'bold',
                textDayHeaderFontWeight: '300',
                textDayFontSize: 16,
                textMonthFontSize: 16,
                textDayHeaderFontSize: 16
              }}
            />
            {this.state.disabled != false ?
              <View>
                <Text>From: </Text>
                <DateTimePickerModal
                  mode="time"
                  locale="en_GB"
                  isVisible={this.state.isDateTimePickerVisible}
                  onConfirm={this.handleDatePicked}
                  onCancel={this.hideDateTimePicker}
                />
                <TouchableWithoutFeedback onPress={this.showDateTimePicker} >
                  <Text style={styles.time}>{finaltime}</Text>
                </TouchableWithoutFeedback>




                <Text>To:</Text>
                <DateTimePickerModal
                  mode="time"
                  locale="en_GB"
                  isVisible={this.state.isDateTimePickerVisible1}
                  onConfirm={this.handleDatePicked1}
                  onCancel={this.hideDateTimePicker1}
                />
                <TouchableWithoutFeedback onPress={this.showDateTimePicker1}>
                  <Text style={styles.time}>{Totime}</Text>
                </TouchableWithoutFeedback>
              </View>

              : null}

          </View>
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <TouchableHighlight style={styles.submit}
              onPress={() => this.Sched()}
              underlayColor='#fff'>
              <Text style={[styles.submitText]}>Proceed</Text>
            </TouchableHighlight>
          </View>
        </View>

      </ScrollView>
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
      title: "Schedule",
      headerTitleStyle: { flex: 1, textAlign: 'center', color: 'white', fontSize: 20 },
      headerTintColor: 'white',
      headerStyle: {
        backgroundColor: '#780000',
      },
      headerRight:
        <TouchableHighlight onPress={() => params.Save()} accessible={false}>
          <FontAwesome name='sign-out' size={25} style={{ marginRight: 20, color: 'white' }} />
        </TouchableHighlight>

    };

  };
}


const mapStateToProps = (state) => {
  return state.schedule
}
export default connect(mapStateToProps, { CreateSchedule, UserLogoutAsync })(HomeScreen);



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    backgroundColor: "#F5F5F5",
    marginRight: 40,
    marginLeft: 40,
  },
  content: {
    marginRight: 40,
    marginLeft: 40,
  },
  Card: {
    borderRadius: 25,
    borderColor: '#F5F5F5',
    marginBottom: 10,
    paddingBottom: 10

  },
  headline: {
    textAlign: 'center',
    fontSize: 22,
    fontFamily: 'Arial',
    marginTop: 20,
    marginBottom: 10

  },
  textContent: {
    textAlign: 'center',
    fontSize: 15,
    fontFamily: 'Arial',
    marginTop: 10,

  },
  back: {
    backgroundColor: "#F5F5F5"
  },
  time: {
    marginTop: 30,
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 40,
    fontFamily: 'Arial',
    color: Colors.CustomButton
  }, itemcontainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start' // if you want to fill rows left to right
  },
  item: {
    width: '50%' // is 50% of container width
  }, submit: {
    marginRight: 40,
    marginLeft: 40,
    marginBottom: 40,
    marginTop: 20,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#780000',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#fff',
    width: '50%',

  },
  submitText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 20
  }
});
