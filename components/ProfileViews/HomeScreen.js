import {View, Text, TextInput, Pressable, TouchableOpacity, StyleSheet, Alert, useWindowDimensions} from "react-native";
import Styles from "../../globalStyles/Styles";
import {AppContext} from "../AppContext";
import React, {useContext, useState} from "react";
import {AntDesign, MaterialIcons} from '@expo/vector-icons';
import {formatDayOrMonth} from "../helperFunctions";
import Modal from "react-native-modal";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import firebase from "firebase/compat";


function HomeScreen() {
    const height = useWindowDimensions().height
    const [isVisibleModalProfile, setProfileModalVisibility] = useState(false)
    const [isVisibleModalCredentials, setCredentialsModalVisibility] = useState(false)
    const [globalUser, setGlobalUser] = useContext(AppContext)
    const [password, setNewPassword] = useState("")
    const [oldPassword, setOldPassword] = useState("")
    const [newFirstname, setNewFirstname] = useState("")
    const [newLastname, setNewLastname] = useState("");
    const [year, setNewYear] = useState(null)
    const [day, setNewDay] = useState(null)
    const [month, setNewMonth] = useState(null)
    const [showDatePicker, setShowDatePicker] = useState(false)

    const handleConfirm = (date) => {
        setNewDay(date.getDate())
        setNewMonth((date.getMonth())+1)
        setNewYear(date.getFullYear())
        setShowDatePicker(false)
    };

    const updateGlobalUser = () => {
        setGlobalUser({
            id: globalUser.id,
            birtDate: day ? day: globalUser.birtDate,
            birthMonth: month ? month: globalUser.birthMonth,
            birthYear: year ? year: globalUser.birthYear,
            firstname: newFirstname ? newFirstname : globalUser.firstname,
            lastname: newLastname ? newLastname : globalUser.lastname,
            username: globalUser.username,
            countries:globalUser.countries.length > 0 ? globalUser.countries : []
        })
    }


    const cleanFields = () => {
        setNewPassword("")
        setNewFirstname("")
        setNewLastname("")
        setNewDay(null)
        setNewMonth(null)
        setNewYear(null)
        setOldPassword("")
    }

    const updateCredentials = () => {
        const user = firebase.auth().currentUser
        const credential = firebase.auth.EmailAuthProvider.credential(
            user.email,
            oldPassword
        );
        user.reauthenticateWithCredential(credential).then((val)  => {
            val.user.updatePassword(password).then((r)=>
                setCredentialsModalVisibility(false))
            Alert.alert("success")
        })

    }

    const updateUser = () => {
        const userDetails = {
            birtDate: day ? day: globalUser.birtDate,
            birthMonth: month ? month: globalUser.birthMonth,
            birthYear: year ? year: globalUser.birthYear,
            firstname: newFirstname ? newFirstname : globalUser.firstname,
            lastname: newLastname ? newLastname : globalUser.lastname,
            username: globalUser.username,
            countries:globalUser.countries.length > 0 ? globalUser.countries : []
        }
        try {
            firebase
                .database()
                .ref(`/users/${globalUser.id}`)
                .update(userDetails);
            updateGlobalUser()
            setProfileModalVisibility(false)
            Alert.alert("Update was succesfull ")
            cleanFields()

        } catch (error) {
            console.log(`Error: ${error.message}`);
        }
    }

    const handleLogOut = async () => {
        setGlobalUser({ id: null, birtDate: null, birthMonth: null, birthYear: null, firstname: null, lastname: null, username: null, countries: []});
        await firebase.auth().signOut()
    };

    return (
        <View style={{...Styles.container, justifyContent: 'flex-start'}} >
            <Text style={{...Styles.title, marginBottom: 0, marginTop: 100}} >Profile Page!</Text>
            <View style={{margin: 60}} >
                 <View style={Styles.circle} >
                 <MaterialIcons name="face" size={50} color="black" />
                  </View>
        </View>
            <TextInput
                value={globalUser.firstname}
                placeholder={globalUser.firstname}
                style={{...Styles.input, borderWidth: 0, borderBottomWidth: 1, borderBottomColor: 'black'}}
                editable={false}
            />
            <TextInput
                value={globalUser.lastname}
                placeholder={globalUser.lastname}
                style={{...Styles.input, borderWidth: 0, borderBottomWidth: 1, borderBottomColor: 'black'}}
                editable={false}
            />
            <TextInput
                value={formatDayOrMonth(globalUser.birtDate) + "-" + formatDayOrMonth(globalUser.birthMonth) + "-" + globalUser.birthYear }
                placeholder={formatDayOrMonth(globalUser.birtDate) + "-" + formatDayOrMonth(globalUser.birthMonth) + "-" + globalUser.birthYear}
                style={{...Styles.input, borderWidth: 0, borderBottomWidth: 1, borderBottomColor: 'black'}}
                editable={false}
            />
            <Pressable
                title={'Change profile'}
                style={Styles.btnAuth}
                onPress={() => setProfileModalVisibility(true)}
            >
                <Text style={{color: 'white'}} >Change info</Text>
            </Pressable>
            <Pressable
                title={'Change Password'}
                style={{...Styles.btnAuth, marginTop: 5}}
                onPress={() => setCredentialsModalVisibility(true)}
            >
                <Text style={{color: 'white'}} >Change Password</Text>
            </Pressable>
            <Pressable
                title={'Log out'}
                style={{...Styles.btnAuth, marginTop: 5}}
                onPress={() => handleLogOut()}
            >
                <Text style={{color: 'white'}} >Log out</Text>
            </Pressable>

            <Modal style={{minHeight: height, justifyContent: 'center'}} isVisible={isVisibleModalProfile}>
                <View style={{...Styles.modalContent, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '40%'}}>
                    <Text style={{fontSize: 20}} > Change My Info </Text>
                    <TextInput
                        value={newFirstname}
                        placeholder={globalUser.firstname}
                        onChangeText={(firstname) => setNewFirstname(firstname)}
                        style={{...Styles.input, ...stylesLocal.modalTextInputLocal}}
                    />
                    <TextInput
                        value={newLastname}
                        placeholder={globalUser.lastname}
                        onChangeText={(lastname) => setNewLastname(lastname)}
                        style={{...Styles.input, ...stylesLocal.modalTextInputLocal}}
                    />
                    <Pressable style={{...Styles.btnCalender, ...stylesLocal.btnLocalDateTime}} title="Pick Birthdate" onPress={(() => setShowDatePicker(true))}>
                        <AntDesign name="calendar" size={24} color="black" />
                        <Text style={{marginLeft: 10}} >{ day && month && year ? formatDayOrMonth(day) + "-" + formatDayOrMonth(month) + "-" + year : formatDayOrMonth(globalUser.birtDate) + "-" + formatDayOrMonth(globalUser.birthMonth) + "-" + globalUser.birthYear }</Text>
                    </Pressable>
                    <DateTimePickerModal
                        isVisible={showDatePicker}
                        mode="date"
                        onConfirm={handleConfirm}
                        onCancel={() => setShowDatePicker(false)}
                    />
                    <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', width: '100%', height: '30%' }}>
                        <Pressable
                            title={'Cancel'}
                            style={{...Styles.btnAuth, height: 50, width: '45%'}}
                            onPress={() => setProfileModalVisibility(false)}
                        >
                            <Text style={{color: 'white'}} >Cancel</Text>
                        </Pressable>
                        <Pressable
                            title={'Update'}
                            style={{...Styles.btnAuth, height:50, width: '45%'}}
                            onPress={() => updateUser()}
                        >
                            <Text style={{color: 'white'}} >Confirm</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
            <Modal style={{minHeight: height, justifyContent: 'center'}} isVisible={isVisibleModalCredentials}>
                <View style={{...Styles.modalContent, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '40%'}}>
                    <Text style={{fontSize: 20}} > Change Credentials </Text>
                    <TextInput
                        value={globalUser.username}
                        placeholder={globalUser.username}
                        style={{...Styles.input, ...stylesLocal.modalTextInputLocal}}
                        editable={false}
                    />
                    <TextInput
                        value={oldPassword}
                        placeholder={"Old Password"}
                        secureTextEntry={true}
                        onChangeText={(oldPassword) => setOldPassword(oldPassword)}
                        style={{...Styles.input, ...stylesLocal.modalTextInputLocal}}
                    />
                    <TextInput
                        value={password}
                        placeholder={"New Password"}
                        secureTextEntry={true}
                        onChangeText={(newPass) => setNewPassword(newPass)}
                        style={{...Styles.input, ...stylesLocal.modalTextInputLocal}}
                    />
                    <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', width: '100%', height: '30%' }}>
                        <Pressable
                            title={'Cancel'}
                            style={{...Styles.btnAuth, height: 50, width: '45%'}}
                            onPress={() => setCredentialsModalVisibility(false)}
                        >
                            <Text style={{color: 'white'}} >Cancel</Text>
                        </Pressable>
                        <Pressable
                            title={'Update'}
                            style={{...Styles.btnAuth, height:50, width: '45%'}}
                            onPress={() => updateCredentials()}
                        >
                            <Text style={{color: 'white'}} >Confirm</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>


        </View>
    );
}


export default HomeScreen

const stylesLocal = StyleSheet.create({
    btnLocalDateTime: {
        width: 200,
        justifyContent: 'flex-start',
        margin: 0,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth:1,
        alignSelf: 'center',
        padding: 10,
        paddingLeft: 0,
        paddingBottom: 2
    },
    modalTextInputLocal: {
        borderWidth: 0,
        borderBottomWidth: 1,
        borderBottomColor: 'black',
        height: 40
    }
})

