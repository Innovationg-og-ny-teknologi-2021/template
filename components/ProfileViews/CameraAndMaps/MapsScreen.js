import Styles from "../../../globalStyles/Styles";
import {Component, useEffect, useState} from "react";
import * as Location from 'expo-location';
import MapView, {Marker} from 'react-native-maps';
import {ActivityIndicator, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View} from "react-native";
import Modal from 'react-native-modal';



export default function MapsScreen() {
    const [currentLocation, setCurrentLocation] = useState(null);
    const [region, setRegion] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [countries, setCountries] = useState(null)
    const [countryNames, setCountryNames] = useState(null)
    const [filteredCountries, setFilteredCountries] = useState([])
    const [modal, setModalVisibility] = useState(false)
    const [pin, setPin] = useState('green');
    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access currentLocation was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setCurrentLocation(location);
            setRegion(location)
        })();
        (async () => {
            fetch('https://countriesnow.space/api/v0.1/countries/positions')
                .then((response) => response.json())
                .then((data) => {
                    setCountries(data.data)
                    const names = data.data.map(country => country.name)
                    setCountryNames(names)
                   // setFilteredCountries(names)
                });
        })();

    }, []);

    const searchFilterFunction = (text) => {
        if(text){
            const newData = countryNames.filter(item => {
                const itemData = item ? item.toUpperCase() : ''.toUpperCase();
                const textData = text.toUpperCase();
                return itemData.indexOf(textData) > -1;
            })
            setFilteredCountries(newData);
        } else {
            setFilteredCountries([]);
            setRegion(currentLocation)
        }
    }

    const chooseCountry = (country) => {
        const coordsRetrived = (countries.filter(item => item.name ===country))[0]
        setRegion({coords: {latitude: coordsRetrived.lat, longitude: coordsRetrived.long}, name: coordsRetrived.name})
    }


    if (currentLocation && countries && countryNames && region){
        return (
            <View style={{...Styles.container, justifyContent: "flex-start", backgroundColor: "white"}}>
                <Modal isVisible={modal}>
                    <View style={{...Styles.modalContent, display: 'flex', justifyContent: 'flex-start', alignItems: 'center'}}>
                        <Text style={{fontSize: 20}} > Add destination </Text>
                        <Text style={{margin: '10%'}}>Name: {region.name}</Text>
                        <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-around', width: '100%' }}>
                            <Pressable
                                title={'Add location'}
                                style={{...Styles.btnAuth, height: 60, width: '45%'}}
                                onPress={() => setModalVisibility(false)}
                            >
                                <Text style={{color: 'white'}} >Cancel</Text>
                            </Pressable>
                            <Pressable
                                title={'Cancel'}
                                style={{...Styles.btnAuth, height:60, width: '45%'}}
                                onPress={() => console.log("hej")}
                            >
                                <Text style={{color: 'white'}} >Add Marker</Text>
                            </Pressable>
                        </View>
                    </View>
                </Modal>
            <MapView
                style={Styles.map}
                region={{
                    latitude: region.coords.latitude,
                    longitude: region.coords.longitude,
                    latitudeDelta: 4,
                    longitudeDelta: 4
                }}
                zoomEnabled={true}
            >
                <Marker
                    pinColor={pin}
                    coordinate={{
                    latitude: currentLocation.coords.latitude,
                    longitude: currentLocation.coords.longitude
                }}/>
                {region && filteredCountries.length > 0 &&(
                    <Marker
                        pinColor={'gold'}
                        coordinate={{
                            latitude: region.coords.latitude,
                            longitude: region.coords.longitude
                        }}
                    onPress={()=> setModalVisibility(true)}
                    />
                )}

            </MapView>
            <TextInput
                onChangeText={(text) => searchFilterFunction(text)}
                placeholder={'Search'}
                style={{...Styles.input, marginTop: '5%'}}
            />
            <ScrollView contentContainerStyle={{alignItems: 'center', justifyContent: 'center', width: '80%'}} >
                {
                    filteredCountries.map((item, index) => {
                        return (
                            <View key={index} style={Styles.itemContainer}>
                                <TouchableOpacity
                                    onPress={() => chooseCountry(item)}
                                    style={{borderWidth: 1, borderBottomColor: 'black', backgroundColor: "#009688", borderRadius: 5, height: 40, width: '100%', justifyContent: 'center', alignItems: 'center'}} >
                                    <Text style={{color: 'white'}}>{item}</Text>
                                </TouchableOpacity>
                            </View>
                        )
                    })
                }
            </ScrollView>
        </View>);
    } else return <View style={Styles.container} ><ActivityIndicator size="large" color="#0000ff" /><Text>Loading</Text></View>

}