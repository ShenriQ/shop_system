import React from 'react';
import { View, Text, StyleSheet, ImageBackground,ScrollView, StatusBar,TouchableOpacity, Image, TextInput,Picker , FlatList, SafeAreaView } from 'react-native';
import {Input, Button, Avatar,Icon, Divider} from 'react-native-elements';
import {GlobalImgs, HomeImgs} from '@assets/imgs';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { width, height, totalSize } from 'react-native-dimension';
import Entypo from 'react-native-vector-icons/Entypo';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Octicons from 'react-native-vector-icons/Octicons';
import {api_base_url, Msg_Login_Success, Msg_Login_Failed} from '../../Helper/Constant';
import {Main_color, Primary_color, Secondary_color, Third_color, Fourth_color} from '../../Helper/Common';
import Spinner from 'react-native-loading-spinner-overlay';
import ImagePicker from 'react-native-image-picker';
import Modal from 'react-native-modal';
import CartProduct from '../Component/CartProduct';
import HttpHelper from '../../Helper/HttpHelper';
import Bottom from './ProductDetails/Bottom';
import stripe from 'tipsi-stripe';
import firestore from '@react-native-firebase/firestore';

let that = null;
export default class MyCart extends React.Component {
    constructor(props){
        super(props);
        this.props = props;
        that = this;
        this.state = {
            status  : '',
            loading : false,
            showModal : false,
            payment_enabled: true,
            total : 0,
            cur_product : {},
            products : [],
        }
    }

    componentDidMount = () => {
        this.setStripeConf();
        this.getCartProducts();
        this.focusListener = this.props.navigation.addListener("focus", () => {
            this.setStripeConf();
            this.getCartProducts();
        });
    }

    setStripeConf = async() => {
        try
        {
            const paymentInfoRef = await firestore().collection('setting').doc('payment').get();
            let payment_enabled = paymentInfoRef.data().enabled;
            this.setState({payment_enabled : payment_enabled});
            
            const stripeInfoRef = await firestore().collection('setting').doc('stripe').get();
            let stripe_pub_key = stripeInfoRef.data().pub_key;
            stripe.setOptions({
                publishableKey: stripe_pub_key
            });
        }
        catch(err)
        {
            alert(err);
        }
    }

    getCartProducts = () => {
        this.setState({loading : true});
        HttpHelper.doPost('get_cart', 
            {
                user_id : global.user.id
            },
            (data) => {
                for(var i = 0; i < data.data.length; i ++)
                {
                    data.data[i].quantity = 1;
                }
                this.setState({loading : false, products : data.data});

                this.calculateTotal(data.data);
            },
            (err) => {
                this.setState({loading : false});
            }
        )
    }

    rmvCartItem = (product_id) => {
        HttpHelper.doPost('del_cart', 
            {
                user_id : global.user.id,
                product_id : product_id
            },
            (data) => {
                console.log(data)
            },
            (err) => {
                console.log(err)
            }
        )
    }
 
    goDetail = (item) => {
        // this.props.navigation.navigate('product_detail', {product_item : item, products : this.state.products});
        this.setState({showModal : true, cur_product : item});
    }

    onMinus = (item) => {
        let products = this.state.products;
        for(var i = 0; i < products.length; i ++)
        {
            if(products[i].id == item.id)
            {
                if(products[i].quantity > 1)
                {
                    products[i].quantity = products[i].quantity - 1;
                }
                break;
            }
        }
        this.setState({products : products});
        this.calculateTotal(products);
    }

    onPlus = (item) => {
        let products = this.state.products;
        for(var i = 0; i < products.length; i ++)
        {
            if(products[i].id == item.id)
            {
                products[i].quantity = products[i].quantity + 1;
                break;
            }
        }
        this.setState({products : products});
        this.calculateTotal(products);
    }

    onRmv = (item) => {
        let products = this.state.products.slice();
        for(var i = 0; i < products.length; i ++)
        {
            if(products[i].id == item.id)
            {
                products.splice(i, 1);
                break;
            }
        }

        this.rmvCartItem(item.id);
        this.setState({products : products});
        this.calculateTotal(products);
    }

    calculateTotal = (products) => {
        let total = 0;
        for(var i = 0; i < products.length; i ++)
        {
            total = total + parseFloat(products[i].data.price) * products[i].quantity ;
        }
        this.setState({total : total});
    }

    doCheckout = (tokenId) => {
        this.setState({loading : true});   
        let checkout_items = [];
        for(var i = 0; i < this.state.products.length; i ++)
        {
            checkout_items.push({
                product_id : this.state.products[i].id,
                quantity : this.state.products[i].quantity
            });
        }
        HttpHelper.doPost("stripe/checkout", 
            {
                user : global.user,
                items : checkout_items,
                tokenId : tokenId
            }, 
            (data) => {
                if(data.status == 'success')
                {
                    this.clearCart();
                    alert('You paid successfully to buy these products. \n Please leave your address in message box for delivery.');
                    this.setState({status : 'success',  loading : false});
                }
                else
                {
                    if(data.data != null && data.data.raw != null)
                    {
                        alert(data.data.raw.message);
                    }
                    this.setState({status : 'failed',  loading : false});
                }
                console.log('payment result : ', data);
                
            },
            (err) => {
                console.log('bbbbbbbb', err)
                alert(err)
                this.setState({status : err.message,  loading : false});
            }
        )
    }

    clearCart = () => {
        HttpHelper.doPost("clear_cart", 
            {
                user_id : global.user.id
            }, 
            (data) => {
                this.getCartProducts();
                console.log(data);
            },
            (err) => {
                console.log(err);
            }
        )
    }

    requestPayment = () => {
       
        return stripe
          .paymentRequestWithCardForm()
          .then(stripeTokenInfo => {
            console.warn('Token created', { stripeTokenInfo });
            this.doCheckout(stripeTokenInfo.tokenId);
          })
          .catch(error => {
            console.warn('Payment failed', { error });
          });
    };

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
                        <Text style ={{fontSize : 20, color : Secondary_color(), fontWeight : 'bold'}} >My Cart</Text>
                    </View>
                    <TouchableOpacity style = {{width : 30, marginRight : 15 }} 
                        onPress = {() => this.clearCart()}
                    >
                        <Fontisto name = "shopping-basket-remove" size = {22} color={Secondary_color()}/>
                    </TouchableOpacity>
                </View>
                <View style = {styles.container} >
                    {
                        this.state.products.length != 0 ?
                        <View style= {{flexDirection : 'row', justifyContent : 'flex-end', width : '100%', marginBottom : 20, alignItems : 'center'}}>
                            <Text style = {{fontSize : 20, fontWeight : 'bold', marginTop : 5, flex : 1, color : Third_color}}>Total : 
                            <Text style = {{fontSize : 20,color : Fourth_color,  fontWeight : 'bold', marginTop : 5}}>    ${this.state.total}</Text>
                            </Text>
                            <Button
                                onPress={this.requestPayment}
                                icon={
                                    <Icon
                                    name="credit-card"
                                    size={16}
                                    color= '#fff'
                                    type='font-awesome'
                                    />
                                }
                                disabled = {!this.state.payment_enabled}
                                title="   CheckOut"
                                />
                        </View>
                        
                        :null
                    }
                    {
                        this.state.products.length == 0 ?
                        <Text style = {{fontSize : 14, fontWeight : 'bold', marginTop : 5}}>Nothing to show</Text>
                        :
                        <FlatList
                            data={this.state.products}
                            renderItem={({ item }) => (
                                <View  style={{ flexDirection: 'column', }}>
                                    <Divider />
                                    <CartProduct onPress = {this.goDetail} onMinus = {this.onMinus} onPlus = {this.onPlus} onRmv = {this.onRmv} item={item} />
                                </View>
                            )}
                            //Setting the number of column
                            contentContainerStyle = {{justifyContent : 'center', alignItems : 'center'}}
                            style = {{width : width(100), }}
                            numColumns={1}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    }
                </View>
                <Modal isVisible = {this.state.showModal}  
                    style = {{width : width(100), height : height(100), backgroundColor: '#fff', margin : 0, padding : 0,
                        justifyContent: 'center', alignItems: 'center'}}>
                    <Bottom item = {this.state.cur_product} width = {width(90)} page = 'cart' close = {() => {this.setState({showModal : false})}}/>
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
    submit_btn : {
        height: 45,
        width: width(75),
        marginTop: 10,
        borderRadius: 19,
        justifyContent: 'center',
        alignItems: 'center',
        
    }
    
});

