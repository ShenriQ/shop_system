import { AsyncStorage } from 'react-native';
import {api_base_url, Msg_Login_Success, Msg_Login_Failed} from './Constant';
import axios from 'axios';

const _storeData = async (key, value) => {
    try {
      await AsyncStorage.setItem(
        key,
        JSON.stringify(value) 
      );
      return true;
    } catch (error) {
      console.log(error)
      return false;
    }
};

const _retrieveData = async (key) => {
    try {
      const value = await AsyncStorage.getItem(key);
      return JSON.parse(value);
    } catch (error) {
        console.log(error)
        return null;
    }
};

const _removeData = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (error) {
    // Error retrieving data
    console.log(error.message);
    return false;
  }
}

const _getUserDetail = async (user_id) => {
    try{
        let response = await axios({
            method  :'post',
            url : api_base_url + "userdetail",
            headers : {
                Accept : "application/json",
                "Content-Type" : "application/json",
            },
            data : {
                "user_id" : user_id
            }
        })

        let data = await response.data;
        if(data.reponse == 'yes') // success
        {
            return data;
        }
        else{
            return null;
        }
    }
    catch(err)
    {
        return null
    }
}

const _getSemesterSlug = async (user_id) => {
  try{
      let response = await axios({
          method  :'post',
          url : api_base_url + "checksemester",
          headers : {
              Accept : "application/json",
              "Content-Type" : "application/json",
          },
          data : {
              "user_id" : user_id,
          }
      })
      let data = await response.data;
      if(data.reponse == 'yes') // success
      {
        return data.semester;
      }
      else{
          return null;
      }
  }
  catch(err)
  {
     return null;
  }
}


export  {_storeData, 
    _retrieveData, 
    _removeData,
    _getUserDetail,
    _getSemesterSlug
}; 
