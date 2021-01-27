import React from 'react';
import { View, ActivityIndicator, Text, Image, ImageBackground, Alert, Button, StatusBar , YellowBox ,TouchableOpacity } from 'react-native';
import { thisTypeAnnotation } from '@babel/types';
import {GlobalImgs} from '@assets/imgs';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {_retrieveData, _storeData, _getUserDetail, _getSemesterSlug} from '../Helper/Util';
import {_getAppSetting} from '../Helper/FirebaseHelper';
import Spinner from 'react-native-loading-spinner-overlay';
import {width, height} from 'react-native-dimension';

YellowBox.ignoreWarnings([
    'Non-serializable values were found in the navigation state',
  ]);

export default class Splash extends React.Component {
    constructor(props){
        super(props);
        this.props = props;
        this.state = {
            loading : false,
            logo : ''
        }
    }

    componentDidMount() {
        this.loadSetting();
    }

    loadSetting = async () => {
        this.setState({loading : true})
        let setting = await _getAppSetting();
        if(setting == null){
            alert('Sorry, we could not get setting information.');
            return;
        }
        global.setting = setting;
        console.log("setting : ", global.setting);
        this.setState({loading : false, logo : setting.logo.original});
        var that = this;
        setTimeout(function(){
            that.goMain();
        }, 2500);
    }

    goMain = async () =>{
        let user =  await _retrieveData('user');
        if(user == null)
        {
            this.props.navigation.replace('login');
        }
        else{
            global.user = user;
            this.props.navigation.replace('home');
        }
    }

    render(){
        console.log(this.state.logo)
        return (
            <> 
            {
                this.state.loading == true ?
                <Spinner visible = {true} />
                :
                <> 
                    <StatusBar hidden/>
                    <ImageBackground   style={{width: '100%', height: '100%', resizeMode: 'contain'}}  source = {GlobalImgs.bg} >
                        <View   style = {{flex: 1, flexDirection : 'column', justifyContent: 'center', alignItems: 'center'}}>
                            <Image style = {{width : width(50), height : width(50), marginBottom : height(20), resizeMode : 'cover'}} source = {{uri : this.state.logo}}/>
                            {/* <Text style = {{fontSize : 20, fontWeight : 'bold', color : '#fff'}}>GRADEBACKER</Text> */}
                        </View>
                    </ImageBackground>
                </>
            }
            </>
        );
    }
    
}