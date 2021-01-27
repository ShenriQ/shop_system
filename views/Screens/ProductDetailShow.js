import React from 'react';
import { View, Text, StyleSheet, Share, ImageBackground,ActivityIndicator, StatusBar,TouchableOpacity, Image, TextInput, ScrollView , FlatList, SafeAreaView, ViewBase } from 'react-native';
import {Input, Button,Divider, Avatar, Header, Card} from 'react-native-elements';
import {GlobalImgs, HomeImgs} from '@assets/imgs';
import Feather from 'react-native-vector-icons/Feather';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { width, height, totalSize } from 'react-native-dimension';
import {Main_color, Primary_color, Secondary_color, Third_color, Fourth_color} from '../../Helper/Common';
import LinearGradient from 'react-native-linear-gradient';
import { SliderBox } from "react-native-image-slider-box";

export default class ProductDetailShow extends React.Component {
    constructor(props){
        super(props);
        this.props = props;
        this.state = {
            images : [],
            item : this.props.route.params.product
        }
    }

    componentDidMount () {
        
        let tmp_images = [];
        this.state.item.data.photos.map((photo, index) => {
            tmp_images.push({uri : photo.original});
        });
        this.setState({images : tmp_images});

        this.focusListener = this.props.navigation.addListener("focus", () => {
            
            if(this.props.route.params.btnflag == false)
            {
                global.cur_page_name = 'product_detail_show';
            }
        });
    }

    UNSAFE_componentWillReceiveProps (props) {
        this.props = props;
        let item = this.props.route.params.product;
        let tmp_images = [];
        item.data.photos.map((photo, index) => {
            tmp_images.push({uri : photo.original});
        });
        this.setState({images : tmp_images,  item : item});
    }

    render() {
        return (
            <View style = {{flex : 1, flexDirection : 'column'}}>
                <View style = {styles.header} >
                    <TouchableOpacity onPress = {() => {this.props.navigation.goBack()}} >
                        <Feather name = "arrow-left" size = {32} color= {Third_color()}/>
                    </TouchableOpacity>
                    <View style = {{flex : 1, alignItems : 'center', justifyContent : 'center'}}>
                        <Text style ={{fontSize : 20, color : Third_color(), fontWeight : 'bold'}} >Product Detail</Text>
                    </View>
                    <TouchableOpacity style = {{width : 30, marginRight : 10}}>
                    </TouchableOpacity>
                </View>
                <ScrollView style = {styles.info} >
                    <SliderBox
                            ImageComponentStyle={{ width: '100%', height : height(50),backgroundColor : '#fff', marginTop: 5}}
                            images= {this.state.images}
                            // style = {{backgroundColor : '#f00'}}
                            // sliderBoxHeight={200}
                            // onCurrentImagePressed={index=> console.warn(`image ${index} pressed`)} 
                            dotColor="#FFEE58"
                            inactiveDotColor="#90A4AE"
                            dotStyle={{
                                width: 12,
                                height: 12,
                                borderRadius: 12,
                                marginHorizontal : 10 , 
                                padding: 0,
                                margin: 0
                            }}
                        />
                    <View style= {styles.row}>
                            <Text style = {[styles.info_title, {color : Fourth_color(),}]}  >Title</Text>
                            <View style = {{flex : 1}}></View>
                            <Text style = {[styles.info_data, {color : Third_color(),}]}>{this.state.item.data.title}</Text>
                    </View>
                    <Divider />
                    <View style= {styles.row}>
                            <Text style = {[styles.info_title, {color : Fourth_color(),}]}   >Price</Text>
                            <View style = {{flex : 1}}></View>
                            {
                                this.state.item.data.promotion_price == null || this.state.item.data.promotion_price == '' ?
                                <Text style = {[styles.info_data, {color : Third_color(),}]}>${this.state.item.data.price}</Text>
                                :
                                <Text style = {[styles.info_data, {color : Third_color(),}]}> 
                                    <Text style = {[styles.info_data, {color : Third_color(), textDecorationLine : 'line-through'}]}>
                                        ${this.state.item.data.price} 
                                    </Text>
                                       / ${this.state.item.data.promotion_price}
                                </Text>
                            }
                    </View>
                    <Divider />
                    <View style= {styles.row}>
                            <Text style = {[styles.info_title, {color : Fourth_color(),}]}  >Brand</Text>
                            <View style = {{flex : 1}}></View>
                            <Text style = {[styles.info_data, {color : Third_color(),}]}>{this.state.item.data.brand}</Text>
                    </View>
                    <Divider />
                    <View style= {styles.row}>
                            <Text style = {[styles.info_title, {color : Fourth_color(),}]}  >Color</Text>
                            <View style = {{flex : 1}}></View>
                            <Text style = {[styles.info_data, {color : Third_color(),}]}>{this.state.item.data.color}</Text>
                    </View>
                    <Divider />
                    <View style= {styles.row}>
                            <Text style = {[styles.info_title, {color : Fourth_color(),}]}  >Size</Text>
                            <View style = {{flex : 1}}></View>
                            <Text style = {[styles.info_data, {color : Third_color(),}]}>{this.state.item.data.size}</Text>
                    </View>
                    <Divider />
                    <View style= {styles.row}>
                            <Text style = {[styles.info_title, {color : Fourth_color(),}]}   >Description</Text>
                    </View>
                    <Divider />
                    <View style= {styles.row}>
                            <Text style = {[styles.desc, {color : Third_color(),}]}  >{this.state.item.data.description}</Text>
                    </View>
                    <View style= {{marginBottom : 60}}>
                    </View>
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    header:{
        backgroundColor : '#fff',
        flexDirection : 'row',
        justifyContent : 'center',
        alignItems : 'center',
        paddingLeft : 10,
        width : width(100),
        height: 50
    },
    price : {
        fontSize : 22,
        color : '#f00'
    },
    desc : {
        
        fontSize : 16,
        flexWrap : 'wrap'
    },  
    info_title : {
        
        fontSize : 20,
        fontWeight : 'bold',
    },  
    info_data : {
        
        fontSize : 20,
        // fontWeight : 'bold'
    },
    row : {
        width : '100%',
        flexDirection : 'row',
        justifyContent : 'flex-start',
        alignItems : 'flex-start',
        marginTop : 15,
        paddingLeft : 10,
        paddingRight : 10,
    },
    info : {
        flex : 1,
        width : width(100),
        padding : 10,
        paddingBottom : 60,
        backgroundColor : '#fff'
    },
   
});
