import React from 'react';
import { StyleSheet, Text, TextInput, View, TouchableHighlight, BackHandler , Linking, ImageBackground, Dimensions } from 'react-native';
import Colors from '../Constants/Colors';
import { ScrollView } from 'react-native-gesture-handler';
import StepIndicator from 'react-native-step-indicator';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import { TransactionDetails, StatusUpdate } from '../actions/Transactions';
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import { LoadingOverlay } from "../components/Indicator";
let pageTitle='',id='';
class JobOrderScreenDetails extends React.Component {
  constructor(props) {
    super(props);
  
    const { navigation } = this.props;
    let steps = JSON.stringify(navigation.getParam('Step', '4')).replace(/"/g, '');
    let Type = JSON.stringify(navigation.getParam('type', 'default value')).replace(/"/g, '');
      this.state = {
        nextStep: steps, finalStep: steps, disabled: false, Texts: 'Mark Service as Done', type: Type,
       choices:-1
      };
    

  }
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressed);
    this.willFocusSubscription = this.props.navigation.addListener(
      'willFocus',
      () => {
       
        this.setState({choices:-1})
        const { navigation } = this.props;
        this.props.navigation.setParams({ handleSave: this.dialCall });
        id = JSON.stringify(navigation.getParam('questionId', 'default value')).replace(/"/g, '');
        console.log(id,'question id');
        this.props.TransactionDetails(id);
      }
    );
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressed);
    this.willFocusSubscription.remove();
  }

  
  onBackButtonPressed() {
    return true;
  }
  Done(current) {
    const { navigation } = this.props;
    let id = JSON.stringify(navigation.getParam('id', 'default value'));
    let Type = JSON.stringify(navigation.getParam('type', 'default value')).replace(/"/g, '');
    let currentstep = Number.parseInt(current) + 1;

    if (currentstep > 6) {
      this.setState({ nextStep: currentstep, disabled: true, Texts: 'Done' });
      this.props.StatusUpdate(id, 6)

    } else if (Type == 2 && currentstep == 5 || Type == 5 && currentstep == 5) {
      this.setState({ nextStep: currentstep, disabled: true, Texts: 'Pending' });
      this.Navigate('Dashboard');

    } else {
      this.setState({ nextStep: currentstep });
      this.props.StatusUpdate(id, currentstep)
    }
    // this.setState({nextStep: currentstep,disabled:true,Texts:'Done'});
  }
  Navigate() {
    this.props.StatusUpdate(questionId, this.state.choices+1,this.props.navigation,'DetailsJob');
    // this.props.navigation.navigate('JobDetails');
  }

  renderText() {
    let { finalStep, type } = this.state;
    if (finalStep == 1 && type == 2) {
      return (
        <View>
          <Text style={{ fontSize: 20, marginTop: 20, fontWeight: 'bold' }}>Final Price</Text>
          <TextInput placeholder="Enter Total Price" keyboardType='numeric' style={{ backgroundColor: "white", height: 40, textAlign: 'center', marginBottom: 10, marginTop: 5 }} />
        </View>
      )
    }
  }
  renderStepIndicator = params => (
    <FontAwesome {...getStepIndicatorIconConfig(params)} />
  )

  dialCall = (number) => {
    const { navigation } = this.props;
    let phone = JSON.stringify(navigation.getParam('phone', 'default value'));
    let phoneNumber = '';
    if (Platform.OS === 'android') { phoneNumber = `tel:${phone}`; }
    else { phoneNumber = `telprompt:${phone}`; }
    Linking.openURL(phoneNumber);
  };
  currencyFormat(num) {
    let value = parseFloat(num)
    return 'P ' + value.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  }
  render() {

    const { navigation } = this.props;
    let { nextStep, disabled, Texts } = this.state;
    pageTitle = JSON.stringify(navigation.getParam('title', 'default value'));
    let Service = JSON.stringify(navigation.getParam('Service', 'default value'));
    const serv = Service.replace(/"/g, '');
    const { job_details, isLoading } = this.props.jobdetails;
    const {Loading } = this.props.status;
    return (

      <ScrollView style={{ backgroundColor: '#F8F8F8' }}>
      <LoadingOverlay visible={isLoading}/>
      <LoadingOverlay visible={Loading}/>
          <View style={styles.container}>
            <View style={{ width: '80%', alignSelf: 'center', marginTop: 10 }}>

            </View>
            <View style={styles.Card}>

              <Text style={styles.headline}>Question {questionId} of 21</Text>
    <Text style={{fontSize:20,fontWeight:'bold',marginTop:5}}>Please choose the answer that represents your feeling</Text>

          
              <RadioForm
          radio_props={job_details.choices}
          initial={-10}
          style={{marginTop:20}}
          buttonColor={'#780000'}
          formHorizontal={false}
          labelHorizontal={true}
          buttonSize={10}
          onPress={(value) => this.setState({choices:value})}
        />
           
            </View>
            <TouchableHighlight style={
              this.state.choices==-1
                ? styles.ready
                : styles.submit
            }
              disabled={this.state.choices==5?true:false}
              onPress={() => this.Navigate(nextStep)}
              underlayColor='#fff'>
              <Text style={[styles.submitText]}>
                Next Question</Text>
            </TouchableHighlight> 

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
      title: 'Exam',
      headerTitleStyle: { flex: 1, textAlign: 'center', color: 'white', fontSize: 20 },
      headerTintColor: 'white',
      headerLeft: null,
      headerStyle: {
        backgroundColor: '#780000',
      },
    };
  };

}
const mapStateToProps = (state) => {
  const { jobdetails, status } = state;
  return {
    jobdetails: jobdetails,
    status: status
  };
}
export default connect(mapStateToProps, { TransactionDetails, StatusUpdate })(JobOrderScreenDetails);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    textAlign: 'center',
  },
  Card: {
    width: '80%',
    padding: 15,
    borderRadius: 20,
    marginTop: 30,
    backgroundColor: '#fff',
    justifyContent: 'center',
    borderColor: '#F5F5F5',
    borderWidth: 1
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
    width: '50%',
    alignItems: 'flex-start' // is 50% of container width
  }, submit: {
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: Colors.CustomButton,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#fff',
    width: '50%',
    marginTop: 15,
    marginBottom: 30

  }, ready: {
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: Colors.CustomButton,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#fff',
    width: '50%',
    marginTop: 15,
    backgroundColor: 'grey',
    marginBottom: 30

  },
  submitText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold'
  }
});
