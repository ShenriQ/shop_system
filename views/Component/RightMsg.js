import React from 'react';
import { View, Text, StyleSheet, ImageBackground,TouchableOpacity, ActivityIndicator } from 'react-native';
import { Card, Divider} from 'react-native-elements';
import {GlobalImgs, HomeImgs} from '@assets/imgs';
import { width, height, totalSize } from 'react-native-dimension';
import moment from 'moment';
import Image from 'react-native-image-progress';

export default class RightMsg extends React.Component {
    constructor(props){
        super(props);
        this.props = props;
        this.state = {
            loading : true
        }
    }

    onPressedImage = () => {
       this.props.onPressedImage(this.props.index);
    }

    render(){
        return (
            <View style = {{flexDirection : 'row', margin : 4}}>
                <View style = {{flex : 1}}/>
                <View style = {styles.msg_container}>
                    <Text style = {styles.msg_time}>{moment(this.props.message.date_time).format('DD/MM/YYYY h:m:s')}</Text>
                    <Divider/>
                    {
                        this.props.message.msg_body != null && this.props.message.msg_body != '' ?
                        <Text style = {styles.msg_body}>{this.props.message.msg_body}</Text>
                        : null
                    }
                    {
                        this.props.message.photo != null && this.props.message.photo.original != null ?
                        <Image 
                            style = {styles.img} 
                            indicatorProps = { {
                                size: 30,
                                borderWidth: 0,
                                color: 'rgba(150, 150, 150, 1)',
                                unfilledColor: 'rgba(200, 200, 200, 0.2)'
                            }}    
                            source = {{uri : this.props.message.photo.original}} />
                        : null
                    }
                </View>
            </View>
            
        );
    }
}

const styles = StyleSheet.create({
    msg_container : {
        maxWidth : width(75),
        color : '#fff',
        borderRadius : 20,
        borderTopRightRadius : 0,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius : 10,
        backgroundColor : 'grey',
        padding : 5,
        paddingLeft: 10,
        paddingRight: 10,
    },
    msg_time : {
        color : '#ddd',
        fontSize : 11,
        textAlign : 'right'
    },
    msg_body : {
        color : '#fff',
        flexWrap : 'wrap'
    },
    img : {
        width : '100%',
        aspectRatio : 1.5,
        resizeMode : 'stretch'
    }
});

