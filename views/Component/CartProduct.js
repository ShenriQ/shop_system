import React from 'react';
import { View, Text, StyleSheet, ImageBackground, StatusBar,TouchableOpacity, TextInput,ActivityIndicator } from 'react-native';
import {Input,Icon, Button, Avatar, Card} from 'react-native-elements';
import {GlobalImgs, HomeImgs} from '@assets/imgs';
import Image from 'react-native-image-progress';
import { width } from 'react-native-dimension';
import {Main_color, Primary_color, Secondary_color, Third_color, Fourth_color} from '../../Helper/Common';

export default class CartProduct extends React.Component {
    constructor(props){
        super(props);
        this.props = props;
        //console.log(this.props);
        this.state = {
            loading : true,
        }
    }

    UNSAFE_componentWillReceiveProps (props) {
        this.props = props;
    }

    onPress = () => {
        this.props.onPress(this.props.item);
    }

    onLoaded = () => {
        this.setState({loading : false})
    }

    onLongPressItem = () => {
        // this.props.onLongPressItem(this.props.item);
    }
    
    render(){
        return (

            <TouchableOpacity activeOpacity = {0.9} style = {{flexDirection : 'row',justifyContent : 'center', alignItems : 'center', height : 120, width: width(95), padding : 0,}}
            //    onLongPress = {this.onLongPressItem}
               onPress = {this.onPress} elevation={2} >
                {/* <Card   containerStyle = {{justifyContent : 'center',backgroundColor : '#f0f',flexDirection : 'row', alignItems : 'center',  margin : 0, width: width(95), height : 120,borderRadius: 10, padding : 3,}}>  */}
                    <View 
                        style = {{width : 110,height : 110,borderRadius: 20,justifyContent : 'center', alignItems : 'center'}}
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
                                width : 110,
                                height : 110,
                                aspectRatio: 1, 
                                borderRadius: 20,
                                resizeMode: 'contain',
                            }}
                        />
                    </View>
                    <View style = {{flex : 1, padding : 8,flexDirection : 'column', justifyContent : 'flex-start', alignItems : 'flex-start'}}>
                        <View style= {styles.info}>
                                <Text style = {[styles.title, {color : Third_color(),}]} numberOfLines={1} >{this.props.item.data.title}</Text>
                                <View style = {{flexDirection : 'row'}}>
                                    <Text style = {styles.brand} numberOfLines={1} >{this.props.item.data.brand}</Text>
                                    <View style = {{flex : 1}}></View>
                                    {
                                        this.props.item.data.promotion_price == null || this.props.item.data.promotion_price == '' ?
                                        <Text style = {[styles.price, {color : Fourth_color(),}]}>${this.props.item.data.price}</Text>
                                        :
                                        <Text style = {[styles.price, {color : Fourth_color(),}]}>${this.props.item.data.promotion_price}</Text>
                                    }
                                </View>
                        </View>
                        <View style = {{flex : 1}}></View>
                        <View style= {{flexDirection : 'row', justifyContent : 'flex-end', width : '100%', alignItems : 'center'}}>
                            <View style = {{flexDirection : 'row', marginRight : 16}}>
                                <Button
                                    // title="Outline button"
                                    type="outline"
                                    icon={
                                        <Icon
                                        size={18}
                                        color= {Third_color()}
                                        name='minus'
                                            type='font-awesome'
                                        />
                                    }
                                    onPress = {() => this.props.onMinus(this.props.item)}
                                />
                                
                                <Text style = {[styles.brand, {color : Third_color(), textAlignVertical : 'center', width : 28, textAlign : 'center'}]} numberOfLines={1} >{this.props.item.quantity}</Text>
                                <Button
                                    // title="Outline button"
                                    type="outline"
                                    icon={
                                        <Icon
                                        size={18}
                                        color= {Third_color()}
                                        name='plus'
                                        type='font-awesome'
                                        />
                                    }
                                    onPress = {() => this.props.onPlus(this.props.item)}
                                />
                            </View>
                            <Button
                                    // title="Outline button"
                                    type="outline"
                                    icon={
                                        <Icon
                                        size={18}
                                        color= {Third_color()}
                                        name='trash'
                                            type='font-awesome'
                                        />
                                    }
                                    onPress = {() => this.props.onRmv(this.props.item)}
                                />
                        </View>
                    </View>
                   
                {/* </Card> */}
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
        fontSize : 16,
        textAlign : 'left'
    },
    brand : {
        
    },
    price : {
        
        fontWeight : 'bold',
        marginLeft : 8
    },
    info : {
        flexDirection : 'column',
        justifyContent : 'center',
        alignItems : 'center',
        marginTop : 5,
        paddingLeft : 4,
        paddingRight : 4,
        width : '100%'
    }
});

