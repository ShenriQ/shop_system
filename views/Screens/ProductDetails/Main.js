import React from 'react';
import { View, Text, StyleSheet, Share, ImageBackground,ActivityIndicator, StatusBar,TouchableOpacity, Image, TextInput, ScrollView , FlatList, SafeAreaView } from 'react-native';
import {Input, Button, Avatar, Header, Card} from 'react-native-elements';
import {GlobalImgs, HomeImgs} from '@assets/imgs';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { width, height, totalSize } from 'react-native-dimension';
import Gallery from 'react-native-image-gallery';
import LinearGradient from 'react-native-linear-gradient';
import {Main_color, Primary_color, Secondary_color, Third_color, Fourth_color} from '../../../Helper/Common';

export default class Main extends React.Component {
    constructor(props){
        super(props);
        this.props = props;
    }

    render() {
        return (
            <TouchableOpacity activeOpacity = {0.8} style = {{width: width(90), justifyContent : 'center', alignItems : 'center', borderRadius : 30, height : height(85), padding : 0,}}
                elevation={10} >
                <Card   containerStyle = {{justifyContent : 'center', alignItems : 'center',  margin : 0, width: width(90), height : height(85),borderRadius: 30, padding : 3,}}> 
                    <View 
                        style = {{
                            alignSelf : 'center',
                            width : width(90) - 40,
                            height : height(50),
                            // backgroundColor : '#f00',
                            borderRadius: 17,justifyContent : 'center', alignItems : 'center'}}
                    >
                        <Image 
                            source={{ uri: this.props.item.data.photos == null || 
                                this.props.item.data.photos.length == null ||
                                this.props.item.data.photos.length == 0 || 
                                this.props.item.data.photos[0] == null ?
                                '' :
                                this.props.item.data.photos[0].original  }} 
                            indicatorProps = { {
                                size: 30,
                                borderWidth: 0,
                                color: 'rgba(150, 150, 150, 1)',
                                unfilledColor: 'rgba(200, 200, 200, 0.2)'
                            }}
                            style = {{
                                width : width(90) - 30,
                                height : height(48),
                                borderRadius: 17,
                                resizeMode: 'stretch',
                            }}
                        />
                    </View>
                    <View style = {styles.info} >
                        <View style= {styles.row}>
                                <Text style = {[styles.title, {color : Third_color(),}]} numberOfLines={1} >{this.props.item.data.title}</Text>
                        </View>
                        <View style= {styles.row}>
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
                        <View style= {styles.row}>
                                <Text numberOfLines = {2} style = {[styles.desc, {color : Third_color()}]}  >{this.props.item.data.description}</Text>
                        </View>
                    </View>
                    <View style = {styles.buttons} >
                        <LinearGradient colors={[Main_color(), Primary_color()]} style = {{borderRadius : 40}} >
                            <TouchableOpacity style = {{padding : 8,}} onPress = {this.props.goChat == null ? () =>{} : this.props.goChat}>
                                <MaterialIcons color = {Secondary_color()} name = "chat" size = {24}/>
                            </TouchableOpacity>
                        </LinearGradient>
                        <TouchableOpacity style = {{padding : 16, borderRadius : 40, backgroundColor : Main_color()}} 
                            onPress = {() => this.props.onSwipedRight(this.props.item)}>
                            <AntDesignIcon color = {Secondary_color()} name = "heart" size = {26}/>
                        </TouchableOpacity>
                        <TouchableOpacity  style = {{padding : 16, borderRadius : 40, backgroundColor : Primary_color()}}
                            onPress = {() => this.props.onSwipedBottom(this.props.item)} >
                            <AntDesignIcon color = {Secondary_color()} name = "shoppingcart" size = {26}/>
                        </TouchableOpacity>
                        <LinearGradient colors={[Main_color(), Primary_color()]} style = {{borderRadius : 40}}>
                            <TouchableOpacity style = {{padding : 8, paddingLeft : 16, paddingRight : 16}}
                                onPress = {() => this.props.onSwipedTop(this.props.item)}  >
                                <FontAwesome color = {Secondary_color()} name = "info" size = {24}/>
                            </TouchableOpacity>
                        </LinearGradient>
                    </View>
                </Card>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    title : {
        
        fontSize : 20,
        fontWeight : 'bold'
    },
    brand : {
    },
    price : {
        fontSize : 20,
        
    },
    desc : {
        
        flexWrap : 'wrap'
    },  
    row : {
        flexDirection : 'row',
        justifyContent : 'center',
        alignItems : 'center',
        marginTop : 15,
        paddingLeft : 10,
        paddingRight : 10
    },
    info : {
        width : width(90) - 10,
        height : height(22),
        borderRadius: 20,
        justifyContent : 'flex-start', 
        alignItems : 'center'
    },
    buttons : {
        paddingLeft : 10,
        paddingRight : 10,
        width :  width(90) - 10,
        height : height(10),
        marginBottom : 6,
        flexDirection : 'row',
        justifyContent : 'space-around', 
        alignItems : 'flex-end'
    }
});
