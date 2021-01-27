import React from 'react';
import { View, Text, StyleSheet, ImageBackground,ScrollView, Keyboard, StatusBar,TouchableOpacity, Image, TextInput,Picker , FlatList, SafeAreaView } from 'react-native';
import {Input, Button, Avatar} from 'react-native-elements';
import {GlobalImgs, HomeImgs} from '@assets/imgs';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { width, height, totalSize } from 'react-native-dimension';
import Entypo from 'react-native-vector-icons/Entypo';
import {api_base_url, Msg_Login_Success, Msg_Login_Failed} from '../../Helper/Constant';
import {_retrieveData, _storeData} from '../../Helper/Util';
import Spinner from 'react-native-loading-spinner-overlay';
import LeftMsg from '../Component/LeftMsg';
import RightMsg from '../Component/RightMsg';
import {_getAllMsgs} from '../../Helper/FirebaseHelper';
import HttpHelper from '../../Helper/HttpHelper';
import firestore from '@react-native-firebase/firestore';
import MyModal from '../../customComponent/MyModal';
import ImagePicker from 'react-native-image-picker';
import {Main_color, Primary_color, Secondary_color, Third_color, Fourth_color} from '../../Helper/Common';

export default class Chat extends React.Component {
    constructor(props){
        super(props);
        this.props = props;
        this.state = {
            status : '',
            loading : false,
            messages : [],
            msg : '',
            isModalVisible : false,
            contact_id :  this.props.route.params.contact_id,
        }
    }

    componentDidMount (){
        this.createListener();
        this.getOldMsgs();
        this.focusListener = this.props.navigation.addListener("focus", () => {
            if(this.scrollView != null)
            {
                this.scrollView.scrollToEnd({animated: true});
            }
        });
    }

    getOldMsgs = async () => {
        this.setState({loading : true})
        let msgs =  await _getAllMsgs(this.state.contact_id);
        this.setState({loading : false, messages : msgs});
    }

    createListener = async () => {
        let that = this;
        const partner_msg_listener =  firestore().doc('chatting/contacts/list/' + this.state.contact_id + '/users/admin').onSnapshot(doc => {
            // console.log("partner_msg_listener", doc.data().last_message)
            if(doc == null || doc.data() == null)
            {

            }
            else
            {
                that.addMessage(doc.data().last_message)
            }
        });
  
        // let user = _sessionStorage.getItem('user');
        const my_msg_listener =  firestore().doc('chatting/contacts/list/' + this.state.contact_id + '/users/' + global.user.id).onSnapshot(doc => {
            // console.log("my_msg_listener",doc.data().last_message)
            if(doc == null || doc.data() == null)
            {

            }
            else
            {
                that.addMessage(doc.data().last_message)
            }
        });
    }

    addMessage = (msg_obj) => {
        let cur_messages = this.state.messages;
        cur_messages.push(msg_obj);
        this.setState({messages : cur_messages});
    }

    sendMessage = async () => {
        if(this.state.msg == '') return;
        Keyboard.dismiss();
        HttpHelper.doPost('write_msg',
            {
                user_id : global.user.id,
                contact_id : this.state.contact_id,
                message : this.state.msg,

            },
            (data) => {
                if(data.data == "success")
                {
                    // alert('success')
                    this.setState({msg : ''});
                }
            },
            (err) => {
                console.log(err);
            }
        )
    }

    sendImage = (photo) => {
        this.setState({loading : true})
        HttpHelper.doPost('write_msg',
            {
                user_id : global.user.id,
                contact_id : this.state.contact_id,
                photo : photo
            },
            (data) => {
                if(data.data == "success")
                {
                    // alert('success')
                    this.setState({msg : ''});
                }
                this.setState({loading : false})
            },
            (err) => {
                console.log(err);
                this.setState({loading : false})
            }
        )
    }

    uploadImage = (base64Image) => {
        this.setState({loading : true})
        HttpHelper.doPost('image_upload_base64',
            {
                base64Image : base64Image
            },
            (data) => {
                if(data.status == "success")
                {
                    this.sendImage(data.photo);
                }
                this.setState({loading : false})
            },
            (err) => {
                console.log(err);
                this.setState({loading : false})
            }
        )
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
                    // const source = { uri: response.uri };
                    // You can also display the image using data:
                    // const source = { uri: 'data:image/jpeg;base64,' + response.data };
                    // console.log(response.data)
                    
                    // this.setState({
                    //     photoUrl: source,
                    //     base64Image : response.data
                    // });
                    this.uploadImage(response.data);
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
                    // const source = { uri: response.uri };
                    // You can also display the image using data:
                    // const source = { uri: 'data:image/jpeg;base64,' + response.data };
                    // console.log(response.data)
                    // this.setState({
                        // photoUrl: source,
                        // base64Image : response.data
                    // });
                    this.uploadImage(response.data);
                }
            });
        } catch (err) {
          console.warn(err);
        }
    }

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



    render(){
        return (
            <View style = {{flex : 1, height : height(100),  flexDirection : 'column'}}>
                <MyModal isModalVisible = {this.state.isModalVisible} onModalResult = {this.onModalResult} 
                title = "Select Image" buttons = {["Take Photo from Camera", "Select from Image Library"]}/>
                <View style = {[styles.header, {backgroundColor : Main_color(),}]} >
                    <TouchableOpacity onPress = {() => {this.props.navigation.openDrawer()}} >
                        <Entypo name = "menu" size = {32} color= {Secondary_color()}/>
                    </TouchableOpacity>
                    <View style = {{flex : 1, alignItems : 'center', justifyContent : 'center'}}>
                        <Text style ={{fontSize : 20, color : Secondary_color(), fontWeight : 'bold'}} >Owner</Text>
                    </View>
                    <TouchableOpacity style = {{width : 30}}>
                    </TouchableOpacity>
                </View>
                <View style = {styles.container} >
                    <Spinner
                        visible={this.state.loading}
                    />
                    <ScrollView 
                        ref={ref => {this.scrollView = ref}}
                        onContentSizeChange={() => this.scrollView.scrollToEnd({animated: true})} 
                        style ={styles.scroller_container}>
                        <View style = {styles.msg_list}>
                            {
                                this.state.messages.map((message, index) => 
                                    message.from == null ?
                                    null :
                                    (
                                        message.from == global.user.id ?
                                        <RightMsg key = {index} message = {message}/>
                                        :<LeftMsg key = {index} message = {message}/>
                                    )
                                )
                            }
                        </View>
                    </ScrollView>
                    <View style = {[styles.msg_input, {backgroundColor : Main_color(),}]}>
                        <TouchableOpacity style = {styles.btn} onPress = {() => this.setState({isModalVisible : true})}>
                            <AntDesignIcon name = "camera" style = {{color : Secondary_color(), fontWeight : 'bold'}} size = {20} />
                        </TouchableOpacity>
                        <TextInput
                            onChangeText={(value) => this.setState({ msg: value })}
                            placeholder= "message"
                            autoCapitalize='none'
                            multiline = {true}
                            value = {this.state.msg}
                            style={styles.inputTxt}
                        />
                        <TouchableOpacity style = {[styles.btn, {backgroundColor : Primary_color(),}]} onPress = {() => this.sendMessage()}>
                            <MaterialIcons name = "send" style = {{color : Secondary_color(), fontWeight : 'bold'}} size = {20} />
                        </TouchableOpacity>
                    </View>
                    
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    header:{
        
        flexDirection : 'row',
        justifyContent : 'center',
        alignItems : 'center',
        paddingLeft : 10,
        width : width(100),
        height: 55
    },
    container:{
        flex : 1,
        flexDirection : 'column',
        paddingTop : 5,
        width : width(100),
    },
    scroller_container : {
        flex : 1,
        flexDirection : 'column',
        padding : 5,
        width: '100%',
        height : '100%',
        marginBottom : 20,
        // backgroundColor : '#00f'
    },
    msg_list : {
        flex : 1,
        width: '100%',
        flexDirection : 'column',
    },
    msg_input : {
        height : 55,
        flexDirection : 'row',
        justifyContent: 'center',
        alignItems: 'center',
        
        width: width(100),
        padding : 5
    },
    inputTxt: {
        textAlignVertical: 'center',
        flex : 1,
        borderColor : '#fff',
        borderWidth : 1,
        paddingLeft : 8,
        textAlign : 'left',
        backgroundColor : '#fff',
        borderRadius : 8
    },
    btn : {
        justifyContent : 'center', 
        alignItems : 'center', 
        
        borderRadius : 40,
        margin : 3,
        padding : 8
    }
});

