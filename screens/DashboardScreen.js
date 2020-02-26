import React from 'react';
import { StyleSheet, Text, View, TouchableNativeFeedback, ImageBackground, FlatList, RefreshControl, Switch,Alert } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { ScrollView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';
import { ListOfTransactions, ListOfTransactionsPagination } from '../actions/Transactions';
import { connect } from 'react-redux';
import { LoadingOverlay } from "../components/Indicator";
import { UserLogoutAsync } from '../actions/Login';


class NotificationScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            switchValue: true,
            refreshing: false, Type: 0, load: 1,
        };
    }
    componentDidMount() {
        this.willFocusSubscription = this.props.navigation.addListener(
            'willFocus',
            () => {
                questionId=1;
                this.props.ListOfTransactions(1);
                this._retrieveData();
            }
        );
    }

    componentWillUnmount() {
        this.willFocusSubscription.remove();
    }

    Logout = (value, response) => {
        this.props.UserLogoutAsync(this.props.navigation);
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

    LoadMore = () => {
        const { job_order_list } = this.props;
        if (job_order_list.list.current_page < job_order_list.list.last_page && job_order_list.length != 0) {
            this.setState({ load: this.state.load + 1 })
            this.props.ListOfTransactionsPagination(this.state.load)
        } else {
            this.setState({ load: 0 })
        }
    }
    _retrieveData = async () => {
        //get user type
        try {
            const value = await AsyncStorage.getItem('Type');
            const active = await AsyncStorage.getItem('Active');
            if (active === true || active === 'true') {
                this.props.navigation.setParams({ handleSave: this.toggleSwitch, switchValue: true, Save: this.Logout });
            } else {
                this.props.navigation.setParams({ handleSave: this.toggleSwitch, switchValue: false, Save: this.Logout });
            }
            if (value !== null) {

                this.setState({ Type: value })
                this.props.navigation.setParams({ Type: value });
            }
        } catch (error) {
            console.log(error)
        }
    }

    Navigate = async (RouteTo, HeaderTitle, id,type) => {
        let header = HeaderTitle.replace(/"/g, '');
        if(id==0){
            Alert.alert(
                'Alert',
                'Waiting for Confirmation.',
                [
                    { text: 'OK' },
                ],
                { cancelable: false }
            )
        }else if(type=='Consultation'){
            Alert.alert(
                'Alert',
                'Exam not available.',
                [
                    { text: 'OK' },
                ],
                { cancelable: false }
            )
        }
        else if(id==2){
            Alert.alert(
                'Alert',
                'Exam already taken.',
                [
                    { text: 'OK' },
                ],
                { cancelable: false }
            )
        }
        else{
            this.props.navigation.navigate(RouteTo, { title: header,questionId:1 });
        }
    }


    renderIcon(value) {
        switch (value) {
            case 0:
                return (<FontAwesome name='circle' size={12} style={{ marginLeft: 5, marginTop: 3, color: 'red' }} />);
            case 1:
                return (<FontAwesome name='circle' size={12} style={{ marginLeft: 5, marginTop: 3, color: 'green' }} />);
                case 2:
                    return (<FontAwesome name='circle' size={12} style={{ marginLeft: 5, marginTop: 3, color: 'black' }} />);
            default:
        }
    }
    stepCount(value) {
        switch (value) {
            case 0:
                return ('Pending');
            case 1:
                return ('Approved');
            case 2:
                return ('Done');
        
            default: return ('4');
        }
    }

    _onRefresh = () => {
        this.setState({ refreshing: true });
        this.props.ListOfTransactions(1);
        this.setState({ refreshing: false });

    }
    render() {
        let { refreshing } = this.state;
        const { job_order_list, listLoading, job_list, isLoadingPagination } = this.props;
        return (
            //to be converted to array 
            <View style={styles.container}>
                <Text style={{ fontSize: 20, fontWeight: 'bold', paddingLeft: 20, paddingTop: 20, paddingBottom: 10 }}>List of Exams</Text>

                <LoadingOverlay visible={listLoading}/>

                {job_order_list.length != 0 ?
                    <FlatList
                        showsHorizontalScrollIndicator={false}
                        numColumns={1}
                        data={job_order_list}
                        renderItem={({ item }) =>
                            <TouchableNativeFeedback onPress={() => this.Navigate('DetailsJob', 'Exam',item.isConfirmed,item.schedule_type)} accessible={false}>
                                <View style={styles.Card}>
                                    <View style={{ marginLeft: 20, marginRight: 20, marginBottom: 10 }}>
                                        <Text style={styles.headline}>{item.schedule_type}</Text>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={{ fontSize: 12, marginRight: 3 }}>Guidance and Testing</Text>
                                            <FontAwesome name='angle-right' size={20} style={{ marginLeft: 'auto' }} />
                                        </View>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={{ fontSize: 12 }}>{item.start_date}</Text>
                                            <Text style={{ marginLeft: 'auto', fontWeight: 'bold', fontSize: 12, fontSize: 12 }}>{this.stepCount(item.isConfirmed)}</Text>
                                            {this.renderIcon(item.isConfirmed)}
                                        </View>
                                    </View>
                                </View>
                            </TouchableNativeFeedback>
                        }
                        keyExtractor={(item, index) => index.toString()}
                        // onEndReached={this.LoadMore}
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


        );
    }

    static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state;
        if (params.Type == 2) {
            return {
                headerBackground: (
                    <ImageBackground
                        style={{ width: '100%', height: '100%' }}
                        source={require('../assets/images/header.png')}
                    />
                ),
                title: "Exams",
                headerTitleStyle: { flex: 1, textAlign: 'center', color: 'white', fontSize: 20 },
                headerTintColor: 'white',
                headerStyle: {
                    backgroundColor: '#780000',
                },
                headerLeft: <Switch
                    thumbColor='white'
                    trackColor={{ true: '#5cb85c', false: '#d9534f' }}
                    style={{ transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }], color: '#5cb85c', marginLeft: 5 }}
                    onValueChange={() => params.handleSave(params.switchValue)}
                    value={navigation.state.params.switchValue} />,
                headerRight:
                    <TouchableNativeFeedback onPress={() => params.Save()} accessible={false}>
                        <FontAwesome name='sign-out' size={25} style={{ marginRight: 20, color: 'white' }} />
                    </TouchableNativeFeedback>
            };
        } else {
            return {
                headerBackground: (
                    <ImageBackground
                        style={{ width: '100%', height: '100%' }}
                        source={require('../assets/images/header.png')}
                    />
                ),
                title: "Exams",
                headerTitleStyle: { flex: 1, textAlign: 'center', color: 'white', fontSize: 20 },
                headerTintColor: 'white',
                headerStyle: {
                    backgroundColor: '#780000',
                },
                headerRight:
                    <TouchableNativeFeedback onPress={() => params.Save()} accessible={false}>
                        <FontAwesome name='sign-out' size={25} style={{ marginRight: 20, color: 'white' }} />
                    </TouchableNativeFeedback>
            };
        }

    };
}
const mapStateToProps = (state) => {
    return state.joblist
}
export default connect(mapStateToProps, { ListOfTransactions, UserLogoutAsync, ListOfTransactionsPagination })(NotificationScreen);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        textAlign: 'center',
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 10
    },
    Card: {
        width: '100%',
        borderRadius: 8,
        marginTop: 10,
        backgroundColor: '#fff',
        borderColor: 'grey',
        borderWidth: 1,
    },
    headline: {
        fontSize: 18,
        marginTop: 10,
        fontWeight: 'bold'
    }, Textcontent: {
        fontSize: 15,
        color: 'white',
        paddingLeft: 15
    }
    , itemcontainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        marginTop: 20
    },
    item: {
        width: '33.33%', // is 50% of container width
        alignItems: 'center',
    },
    item1: {
        width: '33.33%', // is 50% of container width
        alignItems: 'flex-start',
    },
    row: {
        flexDirection: 'row',
        paddingLeft: 5
    },
    text: {
        fontSize: 10
    }
});
