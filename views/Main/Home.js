import React from 'react';
import {BackHandler,Share, View, Text, Dimensions, Button, YellowBox, StatusBar,ImageBackground, TextInput,StyleSheet, ScrollView , Image, TouchableOpacity} from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Modal from 'react-native-modal';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import {GlobalImgs} from '@assets/imgs';
import {width, height, totalSize} from 'react-native-dimension';
import { createDrawerNavigator,  DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { Avatar } from 'react-native-elements';
import EditProfile from '../Screens/EditProfile';
import ProductList from '../Screens/ProductList';
import ProductDetailCard from '../Screens/ProductDetailCard';
import ProductDetailShow from '../Screens/ProductDetailShow';
import Chat from '../Screens/Chat';
import {_retrieveData, _storeData, _removeData} from '../../Helper/Util';
import HttpHelper from '../../Helper/HttpHelper';
import Favs from '../Screens/Favs';
import MyCart from '../Screens/MyCart';
import {Main_color, Primary_color, Secondary_color, Third_color, Fourth_color} from '../../Helper/Common';

YellowBox.ignoreWarnings([
  'Non-serializable values were found in the navigation state',
]);


const onShare = async (semester_slug) => {
  if(semester_slug == '') return;
  try {
    const result = await Share.share({
      message:
        'Please take a look at how my college semester is going here! https://www.gradebacker.com/semester/' + semester_slug,
    });
    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        // shared with activity type of result.activityType
      } else {
        // shared
      }
    } else if (result.action === Share.dismissedAction) {
      // dismissed
    }
  } catch (error) {
    alert(error.message);
  }
};

const goNewContact = async (navigation) => {
  HttpHelper.doPost("create_contact", 
      {
          user_id : global.user.id,
          user_data : global.user.data
      }, 
      async (data) => {
          if(data.status == 'success') // success
          {
              global.user.data.contact_id = data.contact_id
              await _storeData('user', global.user);

              navigation.navigate('chat', {contact_id : global.user.data.contact_id});
          }
      },
      (err) => {
          alert(err)
      }
  )
}

function CustomDrawerContent(props) {
  return (
    <>
    <ImageBackground style = {{width: '100%', height : height(100), shadowColor: '#ff0000',}} 
                  imageStyle={{ borderTopRightRadius : 40, borderBottomRightRadius : 40, }} 
                  source = {GlobalImgs.bg}>
      <View style = {styles.userInfo}>
          <Avatar
              rounded
              containerStyle = {{borderWidth : 2, borderColor : '#fff'}}
              size = {width(25)}
              source={
                global.user.data.photo == null || global.user.data.photo.original == null ?
                GlobalImgs.default_user :
                {
                  uri: global.user.data.photo.original
                }
              }
          />
        <Text style = {{fontSize : 18, fontWeight : 'bold', color : Secondary_color()}}>{global.user.data.first_name} {global.user.data.last_name}</Text>
      </View>
      {/* <TouchableOpacity style = {styles.drawerItem} onPress = {() => {props.navigation.navigate('edit_profile')}}>
        <AntDesign name = "edit" color = "#fff" size = {28} style = {styles.drawerItem_icon}/>
        <Text style = {[styles.drawerItem_txt, {color : Secondary_color(),}]}>Edit my profile</Text>
      </TouchableOpacity> */}
      <TouchableOpacity style = {styles.drawerItem} onPress = {() => {props.navigation.navigate('product_list')}}>
        <Entypo name = "shopping-bag" color = {Secondary_color()} size = {24} style = {styles.drawerItem_icon}/>
        <Text style = {[styles.drawerItem_txt, {color : Secondary_color(),}]}>View Products</Text>
      </TouchableOpacity>
      <TouchableOpacity style = {styles.drawerItem} onPress = {() => {props.navigation.navigate('favs')}}>
        <MaterialIcons name = "favorite-border" color = {Secondary_color()} size = {24} style = {styles.drawerItem_icon}/>
        <Text style = {[styles.drawerItem_txt, {color : Secondary_color(),}]}>Favorites</Text>
      </TouchableOpacity>
      <TouchableOpacity style = {styles.drawerItem} onPress = {() => {props.navigation.navigate('mycart')}}>
        <AntDesign name = "shoppingcart" color = {Secondary_color()} size = {24} style = {styles.drawerItem_icon}/>
        <Text style = {[styles.drawerItem_txt, {color : Secondary_color(),}]}>My Cart</Text>
      </TouchableOpacity>
      <TouchableOpacity style = {styles.drawerItem} 
          onPress = {() => {
            if(global.user.data.contact_id == null || global.user.data.contact_id == '')
            {
              goNewContact(props.navigation);
            }
            else
            {
              props.navigation.navigate('chat', {contact_id : global.user.data.contact_id});
            }
          }}>
        <Entypo name = "chat" color = {Secondary_color()} size = {24} style = {styles.drawerItem_icon}/>
        <Text style = {[styles.drawerItem_txt, {color : Secondary_color(),}]}>Message</Text>
      </TouchableOpacity>
      {/* <TouchableOpacity style = {styles.drawerItem }  onPress = {() => {props.navigation.navigate('setting')}}>
        <AntDesign name = "setting" color = "#fff" size = {28} style = {styles.drawerItem_icon}/>
        <Text style = {[styles.drawerItem_txt, {color : Secondary_color(),}]}>Setting</Text>
      </TouchableOpacity> */}
      <TouchableOpacity style = {styles.drawerItem} onPress = {async () => {
          await _removeData('user');
          global.user = null;
          props.navigation.navigate('login')
        }}>
        <AntDesign name = "logout" color = {Secondary_color()} size = {24} style = {styles.drawerItem_icon}/>
        <Text style = {[styles.drawerItem_txt, {color : Secondary_color(),}]}>Logout</Text>
      </TouchableOpacity>
    </ImageBackground>
    </>
  );
}

const Drawer = createDrawerNavigator();

export default class Home extends React.Component {
  constructor(props)
  {
    super(props);
    this.props = props;
    this.state = {
    };
  }

  componentDidMount(){
  
  }

  render() {
    return (
      <>
        <StatusBar hidden/>
        <Drawer.Navigator initialRouteName="product_list"
          drawerType={ Dimensions.get('window').width >= 768 ? 'permanent' : 'front'}
          drawerStyle= {styles.drawerStyle}
          drawerContent = {CustomDrawerContent}
          overlayColor = {20}
          >
            <Drawer.Screen name="product_list" component={ProductList} />
            <Drawer.Screen name="product_detail" component={ProductDetailCard} />
            <Drawer.Screen name="favs" component={Favs} />
            <Drawer.Screen name="mycart" component={MyCart} />
            <Drawer.Screen name="chat" component={Chat} />
            <Drawer.Screen name="edit_profile" component={EditProfile} />
            <Drawer.Screen name="detailshow" component={ProductDetailShow} />
        </Drawer.Navigator>
      </>
    );
  }
  
}

const styles = StyleSheet.create({
   drawerStyle : {
    backgroundColor: '#fff',
    borderTopRightRadius : 40,
    borderBottomRightRadius : 40,
    width : width(70),
    shadowColor: '#ff0000',
    shadowOffset: {
      width: 30,
      height: 30
    },
    shadowRadius: 50,
    shadowOpacity: 0.5
   },
   userInfo : {
     marginTop : height(8),
     marginBottom : height(2),
     flexDirection : 'column',
     justifyContent : 'center',
     alignItems : 'center'
   },
   drawerItem : {
     flexDirection : 'row',
     justifyContent : 'flex-start',
     alignItems : 'center',
     padding : 15
   },
   drawerItem_icon : {
    marginRight : 7
   },
   drawerItem_txt : {
      
      fontSize : 20,
      fontWeight : 'bold',
      borderBottomColor : '#B034CD',
     borderBottomWidth : 1
   },
});