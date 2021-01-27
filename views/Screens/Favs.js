import React from 'react';
import { View, Text, StyleSheet, ImageBackground,ScrollView, StatusBar,TouchableOpacity, Image, TextInput,Picker , FlatList, SafeAreaView } from 'react-native';
import {Input, Button, Avatar} from 'react-native-elements';
import {GlobalImgs, HomeImgs} from '@assets/imgs';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { width, height, totalSize } from 'react-native-dimension';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import {api_base_url, Msg_Login_Success, Msg_Login_Failed} from '../../Helper/Constant';
import {Main_color, Primary_color, Secondary_color, Third_color, Fourth_color} from '../../Helper/Common';
import Spinner from 'react-native-loading-spinner-overlay';
import ImagePicker from 'react-native-image-picker';
import Modal from 'react-native-modal';
import Product from '../Component/Product';
import HttpHelper from '../../Helper/HttpHelper';
import Bottom from './ProductDetails/Bottom';
import Toast from 'react-native-simple-toast';

let that = null;
export default class Favs extends React.Component {
    constructor(props){
        super(props);
        this.props = props;
        that = this;
        this.state = {
            status  : '',
            loading : false,
            showModal : false,
            cur_product : {},
            products : [],
        }
    }

    componentDidMount = () => {
        this.getFavProducts();
        this.focusListener = this.props.navigation.addListener("focus", () => {
            this.getFavProducts();
        });
    }

    getFavProducts = () => {
        this.setState({loading : true});
        HttpHelper.doPost('get_favorite', 
            {
                user_id : global.user.id
            },
            (data) => {
                this.setState({loading : false, products : data.data});
            },
            (err) => {
                this.setState({loading : false});
            }
        )
    }

    clearFavs = () => {
        HttpHelper.doPost('clear_favorite', 
            {
                user_id : global.user.id
            },
            (data) => {
                this.getFavProducts();
            },
            (err) => {
                console.log(err);
            }
        )
    }

    onAddCart = (product) => {
        HttpHelper.doPost('add_cart', 
            {
                user_id : global.user.id,
                product_id : product.id
            },
            (data) => {
                this.del_favorite(product);
                Toast.show('This product is added to cart.', Toast.SHORT);
            },
            (err) => {
                alert(err)
            }
        )
    }

    del_favorite = (product) => {
        HttpHelper.doPost('del_favorite', 
            {
                user_id : global.user.id,
                product_id : product.id
            },
            (data) => {
                this.getFavProducts();
            },
            (err) => {
                alert(err)
            }
        )
    }
 
    goDetail = (item, index) => {
        // this.props.navigation.navigate('product_detail', {product_item : item, products : this.state.products});
        this.setState({showModal : true, cur_product : item});
    }

    render(){
        return (
            <View style = {{flex : 1, flexDirection : 'column'}}>
                <Spinner
                    visible={this.state.loading}
                />
                <View style = {[styles.header, {backgroundColor : Main_color(),}]} >
                    <TouchableOpacity onPress = {() => {this.props.navigation.openDrawer()}} >
                        <Entypo name = "menu" size = {32} color={Secondary_color()}/>
                    </TouchableOpacity>
                    <View style = {{ flex : 1, alignItems : 'center', justifyContent : 'center'}}>
                        <Text style ={{fontSize : 20, color : Secondary_color(), fontWeight : 'bold'}} >Favorites</Text>
                    </View>
                    <TouchableOpacity style = {{width : 30, marginRight : 10}}  onPress = {() => this.clearFavs()}>
                        <MaterialCommunityIcons name = "layers-remove" size = {32} color={Secondary_color()}/>
                    </TouchableOpacity>
                </View>
                <View style = {styles.container} >
                    {
                        this.state.products.length == 0 ?
                        <Text style = {{fontSize : 14, fontWeight : 'bold', marginTop : 5}}>Nothing to show</Text>
                        :
                        <FlatList
                            data={this.state.products}
                            renderItem={({ item, index }) => (
                                <View style={{ flexDirection: 'column', margin: 5 }}>
                                    <Product onPress = {this.goDetail} width = {width(45)} item={item} index = {index}/>
                                </View>
                            )}
                            //Setting the number of column
                            contentContainerStyle = {{justifyContent : 'center', alignItems : 'center'}}
                            style = {{width : width(100), }}
                            numColumns={2}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    }
                </View>
                <Modal isVisible = {this.state.showModal}  
                    style = {{width : width(100), height : height(100), backgroundColor: '#fff', margin : 0, padding : 0,
                        justifyContent: 'center', alignItems: 'center'}}>
                    <Bottom item = {this.state.cur_product} width = {width(90)} page = 'favs' onAddCart = {this.onAddCart}  close = {() => {this.setState({showModal : false})}}/>
                </Modal>
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
        justifyContent : 'flex-start',
        alignItems : 'center',
        paddingLeft : 30,
        paddingRight : 30,
        paddingTop : 30,
        width : width(100),
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
    searchBar : {
        flex : 1,
        width : '100%'
    },
    formItem : {
        flexDirection : 'row', 
        width : '100%', 
        justifyContent : 'center',
        alignItems : 'center',
        marginTop : 24,
        borderRadius :10, 
        borderWidth : 1,
        borderColor : '#000'
    },
    
});

