import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Login from "../authentication/Login";
import SignUp from "../authentication/SignUp";
import HomeScreen from "../ProfileViews/HomeScreen";
import EntranceScreen from "../ProfileViews/CameraAndMaps/EntranceScreen";
import MapsScreen from "../ProfileViews/CameraAndMaps/MapsScreen";

const StackAuthentication = createStackNavigator();
const StackEntrance = createStackNavigator();
const Tab = createBottomTabNavigator();


function AuthStack() {
    return (
        <StackAuthentication.Navigator
            initialRouteName="Login"
            screenOptions={{
                headerMode: 'screen',
                headerTintColor: 'black',
                headerStyle: { backgroundColor: 'white' },
            }}>
            <StackAuthentication.Screen name="Login" component={Login} />
            <StackAuthentication.Screen name="SignUp" component={SignUp} />
        </StackAuthentication.Navigator>
    );
}

function EntranceStack() {
    return (
        <StackEntrance.Navigator
            initialRouteName="entrance"
            screenOptions={{
                headerMode: 'screen',
                headerTintColor: 'white',
                headerStyle: { backgroundColor: 'tomato' },
                headerShown: false
            }}>
            <StackEntrance.Screen
                name="entrance"
                component={EntranceScreen} />
            <StackEntrance.Screen
                name="maps"
                component={MapsScreen} />
        </StackEntrance.Navigator>
    );
}

function ProfileTab() {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false
            }}>
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen
                name="entranceStack"
                component={EntranceStack}
            />
        </Tab.Navigator>
    );
}


export {AuthStack, ProfileTab, EntranceStack}