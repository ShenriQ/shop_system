import React from 'react';
import { View, Text, StyleSheet, Share, ImageBackground,ActivityIndicator, StatusBar,TouchableOpacity, Image, TextInput, ScrollView , FlatList, SafeAreaView } from 'react-native';
import {Input, Button, Avatar, Header,} from 'react-native-elements';
import {GlobalImgs, HomeImgs} from '@assets/imgs';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import { width, height, totalSize } from 'react-native-dimension';
import {api_base_url, Msg_Login_Success, Msg_Login_Failed} from '../../Helper/Constant';
import Gallery from 'react-native-image-gallery';
import Spinner from 'react-native-loading-spinner-overlay';
import Swiper from 'react-native-swiper'
import Main from './ProductDetails/Main';
import Bottom from './ProductDetails/Bottom';
import HttpHelper  from '../../Helper/HttpHelper';
import {_storeData} from '../../Helper/Util';
import CardStack, { Card } from 'react-native-card-stack-swiper';
import Toast from 'react-native-simple-toast';
import Modal from 'react-native-modal';
import {Main_color, Primary_color, Secondary_color, Third_color, Fourth_color} from '../../Helper/Common';
import { cos } from 'react-native-reanimated';

let blurListener = null;

export default class ProductDetailCard extends React.Component {
    constructor(props){
        super(props);
        this.props = props;
        this.state = {
            loading : false,
            isGalleryVisible : false,
            showModal : false,
            galleryIndex : 0,
            imgs :  [],
            first_padding : 55,
            cur_product : {},
            products : [],
            product_item : this.props.route.params.product_item,
            product_index : 0,// this.props.route.params.product_index,
        }
    }

    componentDidMount = () => {
        this.getProducts(this.state.product_item);

        this.focusListener = this.props.navigation.addListener("focus", () => {
            if(global.cur_page_name == 'product_detail_show')
            {
                try{
                    this.swiper.goBackFromTop();
                }
                catch(err)
                {
                    console.log('go_back_top_err', err)
                }
            }
            global.cur_page_name = 'product_card_show';
        });
    }

    UNSAFE_componentWillReceiveProps (props) {
        this.props = props;
        this.setState({
            // first_padding: 55,
            products : [],
            product_item : this.props.route.params.product_item,
        })
        this.getProducts(this.props.route.params.product_item);
    }

    getProducts = (cur_item) => {
        this.setState({loading : true});
        HttpHelper.doPost('product/get', 
            {},
            (data) => {
                
                let products = data.data;
                let cur_index = 0;
                for(var i = 0; i < products.length; i ++)
                {
                    if(products[i].id == cur_item.id)
                    {
                        cur_index = i;
                        break;
                    }
                }
                // console.log('products', products);
                this.setState({loading : false, products : products, product_index : cur_index});
            },
            (err) => {
                this.setState({loading : false});
            }
        )
    }

    viewStyle() {
        return {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }
    }

    goChat = () => {
        try
        {
            if(global.user.data.contact_id == null || global.user.data.contact_id == '')
            {
                this.goNewContact();
            }
            else
            {
                this.props.navigation.navigate('chat', {contact_id : global.user.data.contact_id});
            }
        }
        catch(err)
        {
            console.log('err', err);
        }
    }

    goContact = async (data) => {
        try
        {
            global.user.data.contact_id = data.contact_id
            await _storeData('user', global.user);
    
            this.props.navigation.navigate('chat', {contact_id : global.user.data.contact_id});
        }
        catch(err)
        {
            console.log('err', err);
        }
    }

    goNewContact =  () => {
        this.setState({loading : true});
        HttpHelper.doPost("create_contact", 
            {
                user_id : global.user.id,
                user_data : global.user.data
            }, 
             (data) => {
                this.setState({loading : false});
                if(data.status == 'success') // success
                {
                    this.goContact(data);
                }
            },
            (err) => {
                this.setState({loading : false});
                alert(err)
            }
        )
    }

    // see detail
    onSwipedTop = (product) => {
        // console.log('product', product)
        // this.setState({
        //     cur_product : product,
        //     showModal : true
        // })
    }

    // add to cart
    onSwipedBottom = (product) => {
        HttpHelper.doPost('add_cart', 
            {
                user_id : global.user.id,
                product_id : product.id
            },
            (data) => {
                // alert(data.data)
            },
            (err) => {
                alert(err)
            }
        )
        Toast.show('This product is added to cart.', Toast.SHORT);
        this.removeProductFromStack(product);
    }

    // see next product
    onSwipedLeft = (product) => {
        
    }

    // add favorite
    onSwipedRight = (product) => {
        HttpHelper.doPost('add_favorite', 
            {
                user_id : global.user.id,
                product_id : product.id
            },
            (data) => {
                // alert(data.data)
            },
            (err) => {
                alert(err)
            }
        )
        Toast.show('This product added to favorites.', Toast.SHORT);
        this.removeProductFromStack(product);
    }

    removeProductFromStack = (product) => {
        let index = 0;
        for(var i = 0; i < this.state.products.length; i ++)
        {
            if(this.state.products[i].id == product.id)
            {
                index = i;
            }
        }
        let tmp_products = this.state.products.slice();
        tmp_products.splice(index, 1)
        this.setState({products : tmp_products});
    }

    onShowDetail = (product) => {
        this.props.navigation.navigate('detailshow', {product : product, btnflag : false })
    }

    onShowDetailByButton = (product) => {
        this.props.navigation.navigate('detailshow', {product : product, btnflag : true})
    }

    render(){
        // console.log(this.state.product_index)
        return (
            
            <View style = {{flex : 1, flexDirection : 'column'}}>
                <Spinner
                    visible={this.state.loading}
                />
                <View style = {[styles.header, {backgroundColor : Main_color(),}]} >
                    <TouchableOpacity onPress = {() => {this.props.navigation.goBack()}} >
                        <Feather name = "arrow-left" size = {32} color= {Secondary_color()}/>
                    </TouchableOpacity>
                    <View style = {{flex : 1, alignItems : 'center', justifyContent : 'center'}}>
                        <Text style ={{fontSize : 20, color : Secondary_color(), fontWeight : 'bold'}} >Product Detail</Text>
                    </View>
                    <TouchableOpacity style = {{width : 30, marginRight : 10}} >
                    </TouchableOpacity>
                </View>
                <View style = {{flex : 1, flexDirection : 'column'}}>
                {
                    this.state.products.length > 0 ?
                    <CardStack  style = {{flex: 1, justifyContent: 'center', alignItems: 'center'}}
                         renderNoMoreCards = {() => {return(<Text>No More Products</Text>)}}
                         secondCardZoom = {1.02}
                         initialIndex = {this.state.product_index}
                         loop = {true} ref={swiper => { this.swiper = swiper }}>
                            
                        {
                            this.state.products.map((product, index) => 
                                <Card
                                    style = {{flex: 1, justifyContent: 'center', alignItems: 'center'}} key = {index} 
                                    onSwipedBottom = {() => this.onSwipedBottom(product)}
                                    onSwipedLeft = {() => this.onSwipedLeft(product)}
                                    onSwipedRight = {() => this.onSwipedRight(product)}
                                    onSwipedTop = {() => this.onShowDetail(product)}
                                >
                                     <Main goChat = {this.goChat} 
                                         onSwipedBottom = {this.onSwipedBottom}
                                         onSwipedLeft = {this.onSwipedLeft}
                                         onSwipedRight = {this.onSwipedRight}
                                         onSwipedTop = {this.onShowDetailByButton}
                                         item = {product} width = {width(90)} />
                                </Card>
                            )
                        }
                    </CardStack>
                    :
                    null
                }
                </View>
                {/* <Modal isVisible = {this.state.showModal}  
                    style = {{width : width(100), height : height(100), backgroundColor: '#fff', margin : 0, padding : 0,
                        justifyContent: 'center', alignItems: 'center'}}>
                    <Bottom item = {this.state.cur_product} width = {width(90)} close = {() => {this.setState({showModal : false})}}/>
                </Modal> */}
            </View>
        );s
    }
}

const styles = StyleSheet.create({
    
    header:{
        
        flexDirection : 'row',
        justifyContent : 'center',
        alignItems : 'center',
        paddingLeft : 10,
        width : width(100),
        height: 50
    },
    container:{
        flex : 1,
        flexDirection : 'column',
        paddingLeft : 30,
        paddingRight : 30,
        paddingTop : 30,
        paddingBottom : 40,
        marginBottom : 20,
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
    summary : {
        marginTop : 8,
        width : '100%',
        flexDirection  :'row',
        justifyContent : 'flex-start',
        alignItems : 'flex-start',
    },
    title_label : {
        color: '#3434ff77',
        fontSize: 16,
        fontWeight : 'bold',
        marginLeft : 8,
    },
    title_val : {
        color: '#000',
        fontSize: 16,
        fontWeight : 'bold',
        marginLeft : 8,
    },
    title : {
        marginTop : 8,
        width : '100%',
        flexDirection  :'row',
        justifyContent : 'flex-start',
        alignItems : 'center',
    },
    inputTxt: {
        textAlignVertical: 'center',
        fontSize: 16,
        textAlign : 'center',
        flex : 1
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
    }
    
});

