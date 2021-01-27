import React from 'react';
import { View, Text, StyleSheet, ImageBackground,ScrollView, StatusBar,TouchableOpacity, Image, TextInput,Picker , FlatList, SafeAreaView } from 'react-native';
import {Input, Button, Avatar} from 'react-native-elements';
import {GlobalImgs, HomeImgs} from '@assets/imgs';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { width, height, totalSize } from 'react-native-dimension';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import Octicons from 'react-native-vector-icons/Octicons';
import {api_base_url, Msg_Login_Success, Msg_Login_Failed} from '../../Helper/Constant';
import {Main_color, Primary_color, Secondary_color, Third_color, Fourth_color} from '../../Helper/Common';
import Spinner from 'react-native-loading-spinner-overlay';
import ImagePicker from 'react-native-image-picker';
import Modal from 'react-native-modal';
import Product from '../Component/Product';
import HttpHelper from '../../Helper/HttpHelper';

let that = null;
export default class ProductList extends React.Component {
    constructor(props){
        super(props);
        this.props = props;
        that = this;
        this.state = {
            status  : '',
            loading : false,
            isVisibleFilterModal : false,
            searchText : '',
            category : 'all',
            products : [],
            categories : []
        }
    }

    componentDidMount = () => {
        this.setState({loading : true});
        HttpHelper.doPost('product/get', 
            {},
            (data) => {
                this.setState({loading : false, products : data.data});
            },
            (err) => {
                this.setState({loading : false});
            }
        )
        HttpHelper.doPost('category/get', 
            {},
            (data) => {
                this.setState({categories : data.data});
            },
            (err) => {
                console.log(err)
            }
        )

        this.focusListener = this.props.navigation.addListener("focus", () => {
            global.cur_page_name = 'product_list';
        });
    }
 
    filterCategory = () => {
        this.setState({loading : true, isVisibleFilterModal : false});
        let body = this.state.category == 'all' ? {} : { category : this.state.category };
        HttpHelper.doPost('product/get', 
            body,
            (data) => {
                this.setState({loading : false, products : data.data, });
            },
            (err) => {
                this.setState({loading : false, });
            }
        )
    }

    searchProduct = () => {
        this.setState({loading : true, isVisibleFilterModal : false});
        HttpHelper.doPost('product/search', 
            {
                search : this.state.searchText
            },
            (data) => {
                this.setState({loading : false, products : data.data, });
            },
            (err) => {
                this.setState({loading : false, });
            }
        )
    }

    goDetail = (item, index) => {
        this.props.navigation.navigate('product_detail', {product_item : item, product_index : index, products : this.state.products});
    }

    render(){
        return (
            <View style = {{flex : 1, flexDirection : 'column'}}>
                <Spinner
                    visible={this.state.loading}
                />
                <View style = {[styles.header, {backgroundColor : Main_color()}]} >
                    <TouchableOpacity onPress = {() => {this.props.navigation.openDrawer()}} >
                        <Entypo name = "menu" size = {32} color= {Secondary_color()}/>
                    </TouchableOpacity>
                    <View style = {{ flex : 1, alignItems : 'center', justifyContent : 'center'}}>
                        <TextInput
                            onChangeText={(value) => this.setState({ searchText: value })}
                            placeholder= "Search Product"
                            autoCorrect={false}
                            autoCapitalize='none'
                            style={[styles.inputTxt, {borderColor : Main_color()}]}
                            />
                    </View>
                    <TouchableOpacity style = {{width : 30, }} onPress = {() => this.searchProduct()}>
                        <Feather name = "search" size = {26} color={Secondary_color()}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress = {() => this.setState({isVisibleFilterModal : true})} style = {{width : 30, marginTop : 3,  marginRight : 4, alignItems : 'center', justifyContent : 'center'}}>
                        <Octicons name = "kebab-vertical" size = {28} color={Secondary_color()}/>
                    </TouchableOpacity>
                </View>
                <View style = {styles.container} >
                    {
                        this.state.products.length == 0 ?
                        <Text style = {{fontSize : 14, fontWeight : 'bold', marginTop : 5}}>Nothing to show</Text>
                        :
                        <FlatList
                            data={this.state.products}
                            renderItem={({ item , index}) => (
                                <View style={{ flexDirection: 'column', margin: 5 }}>
                                    <Product onPress = {this.goDetail} width = {width(45)} item={item} index = {index} />
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
                <Modal isVisible = {this.state.isVisibleFilterModal} onBackdropPress = {() => this.setState({isVisibleFilterModal : false})} style = {{justifyContent : 'center', alignItems : 'center'}}>
                    <View style = {{backgroundColor : '#fff', width : width(86), paddingTop : 20, justifyContent : 'center', alignItems : 'center'}}>
                        <Text style = {{fontSize : 16, fontWeight : 'bold'}}>Add Filter</Text>
                        <Text style = {{fontSize : 14, fontWeight : 'bold', marginTop : 5}}>Category</Text>
                        <View style={{ height: 50, width: width(80), borderWidth : 1, borderColor : '#000' }}>
                            <Picker
                                selectedValue={this.state.category}
                                style={{ height: 50, width: width(80), borderWidth : 1, borderColor : '#000' }}
                                onValueChange={(itemValue, itemIndex) => this.setState({category : itemValue})}
                            >
                                <Picker.Item label= 'all' value= 'all'/>
                                {
                                    this.state.categories.map((item, index) => 
                                        <Picker.Item key = {index} label={item.data.name} value={item.data.name}/>
                                    )
                                }
                            </Picker>
                        </View>
                        <TouchableOpacity style={[styles.submit_btn, { marginTop : 15, marginBottom : 15, backgroundColor: Primary_color()}]} onPress={() => this.filterCategory()}>
                            <Text style={[styles.signUpTxt, {color : Secondary_color()}]}>Filter</Text>
                        </TouchableOpacity>
                    </View>
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
    inputTxt: {
        textAlignVertical: 'center',
        fontSize: 16,
        textAlign : 'center',
        width : '100%',
        height : 40,
        backgroundColor : '#fff',
        
        borderWidth : 1,
        borderRadius : 10
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

