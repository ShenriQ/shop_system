import React from 'react';
import { View, Text, StyleSheet, ImageBackground,ScrollView, StatusBar,TouchableOpacity, Image, TextInput,PermissionsAndroid , FlatList, SafeAreaView, Linking } from 'react-native';
import {Input, Button, Avatar, Divider, CheckBox} from 'react-native-elements';
import {GlobalImgs, HomeImgs} from '@assets/imgs';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import { width, height, totalSize } from 'react-native-dimension';
import ImagePicker from 'react-native-image-picker';
import MyModal from '../../customComponent/MyModal';
import {api_base_url, Msg_Register_Success, Msg_Register_Failed} from '../../Helper/Constant';
import {_retrieveData, _storeData, _getUserDetail, _getSemesterSlug} from '../../Helper/Util';
import Spinner from 'react-native-loading-spinner-overlay';
import Modal from 'react-native-modal';
import {Main_color, Primary_color, Secondary_color, Third_color, Fourth_color} from '../../Helper/Common';
import axios from 'axios';

export default class Register extends React.Component {
    constructor(props){
        super(props);
        this.props = props;
        this.state = {
            fname : '',
            lname : '',
            email : '',
            phone : '',
            pass : '',
            confirmpass : '',
            err_msg_fname : '',
            err_msg_lname : '',
            err_msg_email : '',
            err_msg_phone : '',
            err_msg_pass : '',
            err_msg_confirmpass : '',
            status : '',
            term_checked : false,
            loading : false,
            showHelpModal : false,
            isModalVisible : false,
            photoUrl : '',
            base64Image : null
        }
    }
 
    close = () => {
        this.props.close();
    }
    
    doRegister = async () => {
        this.setState({
            err_msg_fname : '',
            err_msg_lname : '',
            err_msg_email : '',
            err_msg_phone : '',
            err_msg_pass : '',
            err_msg_confirmpass : '',
        });
        if(this.state.fname == '')
        {
            this.setState({err_msg_fname : 'Please input first name.'})
            return;
        }
        if(this.state.lname == '')
        {
            this.setState({err_msg_lname : 'Please input last name.'})
            return;
        }
        if(this.state.email == '')
        {
            this.setState({err_msg_email : 'Please input email.'})
            return;
        }
        if(this.state.phone == '')
        {
            this.setState({err_msg_phone : 'Please input phone number.'})
            return;
        }
        if(this.state.pass == '')
        {
            this.setState({err_msg_pass : 'Please input password.'})
            return;
        }
        if(this.state.confirmpass == '')
        {
            this.setState({err_msg_confirmpass : 'Please confirm password.'})
            return;
        }
        if(this.state.confirmpass != this.state.pass)
        {
            this.setState({err_msg_confirmpass : 'Please confirm password.'})
            return;
        }
        if(this.state.term_checked == false)
        {
            return;
        }

        this.setState({
            err_msg_fname : '',
            err_msg_lname : '',
            err_msg_email : '',
            err_msg_phone : '',
            err_msg_pass : '',
            err_msg_confirmpass : '',
            status : '',
            loading : true
        });
        
        try{
            let response = await axios({
                method  :'post',
                url : api_base_url + "Auth/signup",
                headers : {
                    Accept : "application/json",
                    "Content-Type" : "application/json",
                },
                data : {
                    first_name : this.state.fname,
                    last_name : this.state.lname,
                    email : this.state.email,
                    phone : this.state.phone,
                    pass : this.state.pass,
                    base64Image : this.state.base64Image
                }
            })
            
            let data = await response.data;
            if(data.id != null) // success
            {
                await _storeData('user', data);
                global.user = data;
              
                this.setState({status : Msg_Register_Success, loading : false});
                this.setState({showHelpModal : true});
            }
            else
            {
                this.setState({status : Msg_Register_Failed, loading : false})
            }
        }
        catch(err)
        {
            this.setState({status : err.message,  loading : false});
        }
    }
    
    requestCameraPermission = async () => {
        try {
            const options = {
                title: 'Select Avatar',
                storageOptions: {
                  skipBackup: true,
                  path: 'images',
                },
                quality: 0.4
              };
            ImagePicker.launchCamera(options, (response) => {
                if (response.didCancel) {
                console.log('User cancelled image picker');
                } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
                } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
                } else {
                const source = { uri: response.uri };
                // You can also display the image using data:
                // const source = { uri: 'data:image/jpeg;base64,' + response.data };
                // console.log(response.data)
                this.setState({
                    photoUrl: source,
                    base64Image : response.data
                });
                }
            });
        } catch (err) {
          console.warn(err);
        }
    }

    requestImagGalleryPermission = async () => {
        try {
            const options = {
                title: 'Select Avatar',
                storageOptions: {
                  skipBackup: true,
                  path: 'images',
                },
                quality: 0.4
              };
            ImagePicker.launchImageLibrary(options, (response) => {
                if (response.didCancel) {
                } else if (response.error) {
                } else if (response.customButton) {
                } else {
                    const source = { uri: response.uri };
                    // You can also display the image using data:
                    // const source = { uri: 'data:image/jpeg;base64,' + response.data };
                    // console.log(response.data)
                    this.setState({
                        photoUrl: source,
                        base64Image : response.data
                    });
                }
            });
        } catch (err) {
          console.warn(err);
        }
    }

    showModal = () => {
        this.setState({isModalVisible: true});
    };

    onModalResult = (res) => {
        this.setState({isModalVisible: false});
        if(res == -1){
            return;
        }
        else if(res == 0) { // take photo
            this.requestCameraPermission();
        }
        else if(res == 1) { // select from image gallery
            this.requestImagGalleryPermission();
        }
    }

    onContinue = () => {
        this.setState({showHelpModal : false});
        this.props.goHome();
    }

    gotoTermsUrl = () => {
        try
        {
            const terms_url = 'https://abetech-app.web.app/terms_condition'; // Terms and Service
            Linking.openURL(terms_url);
        }
        catch(err)
        {
            alert(err);
        }
    }

    render(){
        return (
            <View style = {{flex : 1, flexDirection : 'column'}}>
                <Spinner
                    visible={this.state.loading}
                />
                 <MyModal isModalVisible = {this.state.isModalVisible} onModalResult = {this.onModalResult} 
                title = "Select Avatar" buttons = {["Take Photo from Camera", "Select from Image Library"]}/>
                <View style = {styles.container} >
                    <View style = {{flexDirection : 'row',alignSelf : 'flex-end', marginBottom : 10}}>
                        <TouchableOpacity onPress = {this.close} >
                            <AntDesignIcon name = "closecircleo" size = {22} color={global.setting.color.primary_color}/>
                        </TouchableOpacity>
                    </View>
                    <View style ={styles.banner_container}>
                        <View  style = {styles.title}>
                            <Text style = {styles.title_label}>Sign Up</Text>
                        </View>
                        <View  style = {styles.title}>
                            <Text style = {{color : '#ff0000', alignSelf : 'center'}}>{this.state.status}</Text>
                        </View>
                        <View style = {styles.searchBar}>
                            <View>
                                <Avatar
                                    onPress = {this.showModal}
                                    rounded
                                    size = {width(25)}
                                    source = { this.state.photoUrl == ''? GlobalImgs.default_user: this.state.photoUrl}
                                />
                            </View>
                            <ScrollView style = {{width : width(90),padding : 20,marginTop : 10}}>
                                <View style={styles.formItem}>
                                    <AntDesignIcon  size={24} color='#3434ff77'  name = 'user' />
                                    <TextInput
                                    onChangeText={(value) => this.setState({ fname: value })}
                                    placeholder= "First name"
                                    autoCapitalize='none'
                                    style={styles.inputTxt}
                                    />
                                </View>
                                {
                                    this.state.err_msg_fname != '' ? 
                                    <Text style = {{color : '#ff0000', textAlign : 'center'}}>{this.state.err_msg_fname}</Text>
                                    : null
                                }
                                <View style={styles.formItem}>
                                    <AntDesignIcon  size={24} color='#3434ff77'  name = 'user' />
                                    <TextInput
                                    onChangeText={(value) => this.setState({ lname: value })}
                                    placeholder= "Last name"
                                    autoCapitalize='none'
                                    style={styles.inputTxt}
                                    />
                                </View>
                                {
                                    this.state.err_msg_lname != '' ? 
                                    <Text style = {{color : '#ff0000', textAlign : 'center'}}>{this.state.err_msg_lname}</Text>
                                    : null
                                }
                                <View style={styles.formItem}>
                                    <AntDesignIcon size={24} color='#3434ff77'  name = 'mail' />
                                    <TextInput
                                    onChangeText={(value) => this.setState({ email: value })}
                                    placeholder= "Email"
                                    autoCorrect={true}
                                    autoCapitalize='none'
                                    style={styles.inputTxt}
                                    />
                                </View>
                                {
                                    this.state.err_msg_email != '' ? 
                                    <Text style = {{color : '#ff0000', textAlign : 'center'}}>{this.state.err_msg_email}</Text>
                                    : null
                                }
                                <View style={styles.formItem}>
                                    <AntDesignIcon  size={24} color='#3434ff77'  name = 'phone' />
                                    <TextInput
                                    onChangeText={(value) => this.setState({ phone: value })}
                                    placeholder= "Phone"
                                    autoCapitalize='none'
                                    style={styles.inputTxt}
                                    />
                                </View>
                                {
                                    this.state.err_msg_phone != '' ? 
                                    <Text style = {{color : '#ff0000', textAlign : 'center'}}>{this.state.err_msg_phone}</Text>
                                    : null
                                }
                                <View style={styles.formItem}>
                                    <AntDesignIcon  size={24} color='#3434ff77'  name = 'lock' />
                                    <TextInput
                                    onChangeText={(value) => this.setState({ pass: value })}
                                    placeholder= "Password"
                                    secureTextEntry = {true}
                                    autoCapitalize='none'
                                    style={styles.inputTxt}
                                    />
                                </View>
                                {
                                    this.state.err_msg_pass != '' ? 
                                    <Text style = {{color : '#ff0000', textAlign : 'center'}}>{this.state.err_msg_pass}</Text>
                                    : null
                                }
                                <View style={styles.formItem}>
                                    <AntDesignIcon  size={24} color='#3434ff77'  name = 'lock' />
                                    <TextInput
                                    onChangeText={(value) => this.setState({ confirmpass: value })}
                                    placeholder= "Confirm password"
                                    secureTextEntry = {true}
                                    autoCapitalize='none'
                                    style={styles.inputTxt}
                                    />
                                </View>
                                {
                                    this.state.err_msg_confirmpass != '' ? 
                                    <Text style = {{color : '#ff0000', textAlign : 'center'}}>{this.state.err_msg_confirmpass}</Text>
                                    : null
                                }
                                <View style = {styles.terms_line}>
                                    <CheckBox  checked={this.state.term_checked} onPress = {() => {
                                            this.setState({term_checked: !this.state.term_checked})
                                        }} 
                                    checkedColor = '#3434aa' activeOpacity={1} textStyle = {styles.terms_checkbox_txt}
                                    containerStyle={styles.terms_checkbox} title='I agree with '/>
                                    <Text style={styles.terms_txt} onPress = {() => this.gotoTermsUrl()}>Terms and conditions</Text>
                                </View>
                                <View style = {{padding : 30, width : '100%', marginBottom : 20}}>
                                    <TouchableOpacity onPress = {this.doRegister} style = {[styles.button, {backgroundColor : Primary_color()}]}>
                                        <Text style = {[styles.buttonText, {color : Secondary_color()}]}>Register</Text>
                                    </TouchableOpacity>
                                </View>
                            </ScrollView>
                            
                        </View>
                    </View>
                </View>
                <Modal isVisible = {this.state.showHelpModal}  
                    style = {{width : width(90), height : height(80), backgroundColor: '#fff',
                        justifyContent: 'flex-start', alignItems: 'center'}}>
                    <Text style={{fontWeight : 'bold', fontSize : 18, marginTop : 8 }}>Help</Text>
                    <Divider style={{width : '100%'}}/>
                    <ScrollView style ={{flex : 1, width : '100%', padding : 20}}>
                       <Image source = {HomeImgs.guide} style = {{width : width(70), height : height(50), resizeMode : 'contain', alignSelf : 'center'}}/>
                       <View style ={{flexDirection : 'row', justifyContent : 'center', marginTop : 20}}>
                            <Image source = {HomeImgs.left} style = {{width : 80, height : 100, resizeMode : 'contain', alignSelf : 'center'}}/>
                            <Text style={{fontWeight : 'bold', fontSize : 12, marginTop : 8, maxWidth : '70%', flex : 1 }}>Swipe left - uninterested(product will appear again)</Text>
                       </View>
                       <View style ={{flexDirection : 'row', justifyContent : 'center', marginTop : 20}}>
                            <Image source = {HomeImgs.right} style = {{width : 80, height : 100, resizeMode : 'contain', alignSelf : 'center'}}/>
                            <Text style={{fontWeight : 'bold', fontSize : 12, marginTop : 8, maxWidth : '70%', flex : 1 }}>Swipe right - add to favourite</Text>
                       </View>
                       <View style ={{flexDirection : 'row', justifyContent : 'center', marginTop : 20}}>
                            <Image source = {HomeImgs.top} style = {{width : 80, height : 100, resizeMode : 'contain', alignSelf : 'center'}}/>
                            <Text style={{fontWeight : 'bold', fontSize : 12, marginTop : 8, maxWidth : '70%', flex : 1 }}>Swipe up - more information</Text>
                       </View>
                       <View style ={{flexDirection : 'row', justifyContent : 'center', marginTop : 20, marginBottom : 60}}>
                            <Image source = {HomeImgs.bottom} style = {{width : 80, height : 100, resizeMode : 'contain', alignSelf : 'center'}}/>
                            <Text style={{fontWeight : 'bold', fontSize : 12, marginTop : 8, maxWidth : '70%', flex : 1 }}>Swipe down - add to cart</Text>
                       </View>
                    </ScrollView>
                    <Divider style={{width : '100%'}}/>
                    <Button title = "Continue" containerStyle = {{margin : 6}} onPress = {() => this.onContinue()}/>
                </Modal>
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
        marginBottom : 24,
        textAlign : 'center',
    },
    title : {
        width : '100%'
    },
    inputTxt: {
        textAlignVertical: 'center',
        fontSize: 16,
        textAlign : 'center',
        borderRadius : 16,
        borderWidth : 1,
        flex : 1,
        marginLeft : -40
    },
    searchBar : {
        flex : 1,
        flexDirection : 'column',
        justifyContent : 'flex-start',
        alignItems : 'center',
    },
    formItem : {
        width : '100%',
        flexDirection : 'row', 
        justifyContent : 'center',
        alignItems : 'center',
        padding : 10,
        marginLeft : 10,
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
    },
    terms_checkbox:{
        backgroundColor: "transparent", 
        borderWidth: 0 ,
        color: '#3434aa',
        padding: 0,
        margin: 0
    },
        terms_checkbox_txt:{
        color: '#3434aa',
        fontWeight: 'normal',
        marginRight: 0
    },
    terms_line : {
        flex : 1,
        justifyContent: 'flex-start',
        alignItems : 'flex-end',
        flexDirection: 'row',
        marginBottom : 8,
        marginTop : 8,
        width:width(80),
        paddingLeft: 0,
    },
    terms_txt : {
        color: '#3434aa',
        fontWeight: 'normal',
        marginLeft: -5,
        height: 21
    }
    
});

