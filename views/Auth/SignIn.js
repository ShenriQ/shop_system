import React from 'react';
import { View, Text, StyleSheet, ImageBackground, StatusBar,TouchableOpacity, Image, TextInput , FlatList, SafeAreaView } from 'react-native';
import {Input, Button, Avatar} from 'react-native-elements';
import {GlobalImgs, HomeImgs} from '@assets/imgs';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import { width, height, totalSize } from 'react-native-dimension';
import {api_base_url, Msg_Login_Success, Msg_Login_Failed} from '../../Helper/Constant';
import {_retrieveData, _storeData, _getUserDetail, _getSemesterSlug} from '../../Helper/Util';
import Spinner from 'react-native-loading-spinner-overlay';
import HttpHelper from '../../Helper/HttpHelper';
import {Main_color, Primary_color, Secondary_color, Third_color, Fourth_color} from '../../Helper/Common';

export default class SignIn extends React.Component {
    constructor(props){
        super(props);
        this.props = props;
        this.state = {
            loading : false,
            status : '',
            email : '',
            password : '',
            err_msg_email : '',
            err_msg_pass : '',
        }
    }
 
    close = () => {
        this.props.close();
    }
    
    doSign = async () => {
        this.setState({
            err_msg_email : '',
            err_msg_pass : '',
        });
        if(this.state.email == '')
        {
            this.setState({err_msg_email : 'Please input email'})
            return;
        }
        if(this.state.password == '')
        {
            this.setState({err_msg_pass : 'Please input password'})
            return;
        }

        this.setState({
            err_msg_email : '',
            err_msg_pass : '',
            status : '',
            loading : true
        });
        
        HttpHelper.doPost("Auth/login", 
            {
                "email" : this.state.email,
                "pass" : this.state.password
            }, 
            async (data) => {
                if(data.id != null) // success
                {
                    await _storeData('user', data);
    
                    global.user = data;
                  
                    this.setState({status : Msg_Login_Success, loading : false});
                    this.props.goHome();
                }
                else{
                    this.setState({status : data.err, loading : false})
                }
            },
            (err) => {
                alert(err)
                this.setState({status : err.message,  loading : false});
            }
        )
    }

    render(){
        // console.log(this.state.status)
        return (
            <View style = {{flex : 1, flexDirection : 'column'}}>
                <Spinner
                    visible={this.state.loading}
                />
                <View style = {styles.container} >
                    <View style = {{flexDirection : 'row',alignSelf : 'flex-end', marginBottom : 10}}>
                        <TouchableOpacity onPress = {this.close} >
                            <AntDesignIcon name = "closecircleo" size = {22} color={global.setting.color.primary_color}/>
                        </TouchableOpacity>
                    </View>
                    <View style ={styles.banner_container}>
                        <View  style = {styles.title}>
                            <Text style = {styles.title_label}>Sign In</Text>
                        </View>
                        <View  style = {styles.title}>
                            <Text style = {{color : '#ff0000'}}>{this.state.status}</Text>
                        </View>
                        <View style = {styles.searchBar}>
                            <View style={styles.formItem}>
                                <AntDesignIcon style = {{marginHorizontal : -30}} size={24} color='#3434ff77'  name = 'mail' />
                                <TextInput
                                onChangeText={(value) => this.setState({ email: value })}
                                placeholder= "Your email"
                                autoCapitalize='none'
                                style={styles.inputTxt}
                                />
                            </View>
                            {
                                this.state.err_msg_email != '' ? 
                                <Text style = {{color : '#ff0000'}}>{this.state.err_msg_email}</Text>
                                : null
                            }
                            <View style={styles.formItem}>
                                <AntDesignIcon style = {{marginHorizontal : -30}} size={24} color='#3434ff77'  name = 'lock' />
                                <TextInput
                                onChangeText={(value) => this.setState({ password: value })}
                                placeholder= "Your password"
                                secureTextEntry = {true}
                                autoCapitalize='none'
                                style={styles.inputTxt}
                                />
                            </View>
                            {
                                this.state.err_msg_pass != '' ? 
                                <Text style = {{color : '#ff0000'}}>{this.state.err_msg_pass}</Text>
                                : null
                            }
                            
                            <View style = {{padding : 30, width : '100%'}}>
                                <TouchableOpacity onPress = {() => this.doSign()} style = {[styles.button, {backgroundColor : Primary_color()}]}>
                                    <Text style = {[styles.buttonText, {color : Secondary_color()}]}>Login</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    
    container:{
        flex : 1,
        flexDirection : 'column',
        justifyContent : 'flex-start',
        alignItems : 'center',
        paddingLeft : 30,
        paddingRight : 30,
        paddingTop : 10,
        paddingBottom : 10,
        borderTopLeftRadius: 20, 
        borderTopRightRadius: 20,
        width : width(90),
    },
    banner_container : {
        flex : 1,
        flexDirection : 'column',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom : 20,
    },
    list_container : {  
        flex : 1,
        width: '100%',
        alignSelf : 'center',
    },
    title_label : {
        color: '#000',
        fontSize: 18,
        fontWeight : 'bold',
        alignSelf: 'center',
        marginLeft : 24,
        marginBottom : 24
    },
    title : {
    },
    inputTxt: {
        textAlignVertical: 'center',
        fontSize: 16,
        textAlign : 'center',
        borderRadius : 16,
        borderWidth : 1,
        flex : 1
    },
    searchBar : {
        flex : 1,
        flexDirection : 'column',
        justifyContent : 'flex-start',
        alignItems : 'center',
        width : '100%'
    },
    formItem : {
        flexDirection : 'row', 
        width : '100%', 
        justifyContent : 'center',
        alignItems : 'center',
        padding : 20,
        marginLeft : 40
    },
    button: {
        width: width(70),
        padding: 10,
        margin: 5,
        alignSelf : 'center',
        borderRadius : 10,
        justifyContent : 'center',
        alignItems : 'center'
    },
    buttonText : {
        fontSize : 18, fontWeight : 'bold'
    }
    
});

