import React from 'react';
import { View, Text, StyleSheet, ImageBackground, StatusBar,TouchableOpacity, TextInput,ActivityIndicator } from 'react-native';
import {Input, Button, Avatar, Card} from 'react-native-elements';
import {GlobalImgs, HomeImgs} from '@assets/imgs';
import Icon from 'react-native-vector-icons/Ionicons';
import Image from 'react-native-image-progress';
import {Main_color, Primary_color, Secondary_color, Third_color, Fourth_color} from '../../Helper/Common';

export default class Product extends React.Component {
    constructor(props){
        super(props);
        this.props = props;
        //console.log(this.props);
        this.state = {
            loading : true
        }
    }
    onPress = () => {
        this.props.onPress(this.props.item, this.props.index);
    }

    onLoaded = () => {
        this.setState({loading : false})
    }

    onLongPressItem = () => {
        // this.props.onLongPressItem(this.props.item);
    }
    
    render(){
        return (

            <TouchableOpacity activeOpacity = {0.8} style = {{width: this.props.width,padding : 0,}}
               onLongPress = {this.onLongPressItem}
               onPress = {this.onPress} elevation={2} >
                <Card   containerStyle = {{justifyContent : 'center', alignItems : 'center',  margin : 0, width: '100%',borderRadius: 10, padding : 3,}}> 
                    <View 
                        style = {{width : '100%',
                            borderRadius: 20,justifyContent : 'center', alignItems : 'center'}}
                    >
                        <Image 
                            source={{ uri: this.props.item.data.photos == null || 
                                        this.props.item.data.photos.length == null ||
                                        this.props.item.data.photos.length == 0 || 
                                        this.props.item.data.photos[0] == null ?
                                        '' :
                                        this.props.item.data.photos[0].original }} 
                            indicatorProps = { {
                                size: 30,
                                borderWidth: 0,
                                color: 'rgba(150, 150, 150, 1)',
                                unfilledColor: 'rgba(200, 200, 200, 0.2)'
                            }}
                            style = {{
                                flex : 1, 
                                width : '100%',
                                aspectRatio: 1, 
                                resizeMode: 'contain',
                            }}
                        />
                    </View>
                    
                    <View style= {styles.info}>
                            <Text style = {[styles.title,{color : Third_color()}]} numberOfLines={1} >{this.props.item.data.title}</Text>
                    </View>
                    <View style= {styles.info}>
                            <Text style = {[styles.brand, {color : Third_color()}]} numberOfLines={1} >{this.props.item.data.brand}</Text>
                            <View style = {{flex : 1}}></View>
                            {
                                this.props.item.data.promotion_price == null || this.props.item.data.promotion_price == '' ?
                                <Text style = {[styles.price, {color : Fourth_color(),}]}>${this.props.item.data.price}</Text>
                                :
                                <Text style = {[styles.price, {color : Fourth_color(),}]}> 
                                    <Text style = {[styles.price, {color : Fourth_color(), textDecorationLine : 'line-through'}]}>
                                        ${this.props.item.data.price}
                                    </Text>
                                     / ${this.props.item.data.promotion_price}
                                </Text>
                            }
                    </View>
                </Card>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    bgImg: {
        width: '100%', height: '100%', resizeMode: 'cover', 
         justifyContent: 'flex-end', alignItems: 'flex-start',
    },
    container: {
        flexDirection : 'column', justifyContent: 'center', alignItems : 'center', width: '100%',
    },
    title : {
        fontWeight : 'bold',
        width : '100%',
        // backgroundColor : '#f00',
        textAlign : 'center'
    },
    brand : {
        
    },
    price : {
        
        fontWeight : 'bold',
        marginLeft : 8
    },
    info : {
        flexDirection : 'row',
        justifyContent : 'center',
        alignItems : 'center',
        marginTop : 5,
        paddingLeft : 4,
        paddingRight : 4
    }
});

