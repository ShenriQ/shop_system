import React from 'react';
import { View, Text, StyleSheet, ImageBackground, StatusBar, Image, TextInput,Dimensions, ActivityIndicator,TouchableOpacity } from 'react-native';
import {Input, Button, Card} from 'react-native-elements';
import {GlobalImgs, HomeImgs, Ad_video} from '@assets/imgs';
import {width, height, totalSize} from 'react-native-dimension';
import Video from 'react-native-video';
import RBSheet from "react-native-raw-bottom-sheet";
import SignIn from '../Auth/SignIn';
import Register from '../Auth/Register';
import {Main_color, Primary_color, Secondary_color, Third_color, Fourth_color} from '../../Helper/Common';


export default class Login extends React.Component {
    constructor(props){
        super(props);
        this.props = props;
        //console.log(this.props);
        this.state = {
            email: '',
            name : '',
            pass : '',
            confirm_pass: '',
            show_err_email: false,
            show_err_name: false,
            show_err_password : false,
            show_err_confirm : false,
            isSigning: false,
            isVideoLoading : true
        }
    }
    goHome = () => {
        this.props.navigation.replace('home');
    }

    openRegister = () => {
        this.RegisterModal.open(); 
    }
    closeRegister = () => {
        this.RegisterModal.close(); 
    }

    openSignIn = () => {
        this.LoginModal.open();
    }
    closeSignIn = () => {
        this.LoginModal.close();
    }



    

    render(){
        console.log("logo image",  global.setting.logo.original)
        return (
            <>
            <StatusBar hidden/>
            {/* <ImageBackground   style={styles.bgImg}  source = {GlobalImgs.hover} > */}
            <View style={[styles.bgImg, {backgroundColor : Main_color()}]} >
                <View style = {{flex : 1}}></View>
                <Image style = {{width : width(50), height : width(50), resizeMode : 'cover'}} source = {{uri : global.setting.logo.original}}/>
                {/* <Text style = {{fontSize : 20, fontWeight : 'bold', color : '#fff'}}>Get Reward For Your Grades</Text> */}
                <View style = {{flex : 1}}></View>
                <TouchableOpacity style = {[styles.button, {backgroundColor : Primary_color()}]} onPress = {() => this.openSignIn()}>
                    <Text style = {[styles.buttonText, {color : Secondary_color()}]}>Sign In</Text>
                </TouchableOpacity>
                <TouchableOpacity style = {[styles.button, {backgroundColor : Primary_color()}]} onPress = {() => this.openRegister()}>
                    <Text style = {[styles.buttonText, {color : Secondary_color()}]}>Sign Up</Text>
                </TouchableOpacity>
                <View style = {{flex : 1}}></View>
            </View>
            {/* </ImageBackground> */}
            <RBSheet
                ref={ref => {
                    this.RegisterModal = ref;
                }}
                height={height(93)}
                openDuration={250}
                customStyles={{
                    container: {
                    justifyContent: "center",
                    alignItems: "center",
                    borderTopLeftRadius: 20, 
                    borderTopRightRadius: 20,
                    }
                }}
            >
                <Register close = {this.closeRegister} goHome = {this.goHome}/>
            </RBSheet>
            <RBSheet
                ref={ref => {
                    this.LoginModal = ref;
                }}
                height={height(80)}
                openDuration={250}
                customStyles={{
                    container: {
                    justifyContent: "center",
                    alignItems: "center",
                    borderTopLeftRadius: 20, 
                    borderTopRightRadius: 20,
                    }
                }}
            >
                <SignIn close = {this.closeSignIn} goHome = {this.goHome}/>
            </RBSheet>
            </>
        );
    }
}

const styles = StyleSheet.create({
    bgImg: {
        width: '100%', height: '100%', resizeMode: 'contain', flex : 1, justifyContent: "center", alignItems: "center"
    },
    container: {
        flex : 1, flexDirection : 'column', justifyContent: 'center', alignItems : 'center', width: '94%',
    },
    textInput:{
        width: '100%'
    },
    button: {
        width: width(70),
        padding: 10,
        margin: 5,
        opacity : 1,
        borderRadius : 10,
        justifyContent : 'center',
        alignItems : 'center'
    },
    buttonText : {
         fontSize : 18, fontWeight : 'bold'
    }
});