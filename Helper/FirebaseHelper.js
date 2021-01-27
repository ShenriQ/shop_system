import firestore from '@react-native-firebase/firestore';

const _getAppSetting = async () => {
    try {
        const color  = await firestore().collection('setting').doc('color').get();
        const logo  = await firestore().collection('setting').doc('logo').get();
        let setting = {
            color : color.data(),
            logo : logo.data()
        }
        return setting;
    } catch (error) {
      console.log(error)
      return null;
    }
};

const _getAllMsgs = async (contact_id) => {
    try {
        const msg_list_ref  = await firestore().collection('chatting/' + contact_id + '/msg_list').orderBy('date_time', 'asc').get();
        let msg_list = [];
        msg_list_ref.forEach(function (doc) {
            msg_list.push({
                id: doc.id,
                ...doc.data()
            })
        })
        return msg_list;
    } catch (error) {
      console.log(error)
      return null;
    }
};


export  {
    _getAppSetting, 
    _getAllMsgs
}; 
