import {View, Text, TouchableOpacity} from "react-native";
import Styles from "../../../globalStyles/Styles";

function EntranceScreen({navigation}) {
    return (
        <View style={{...Styles.container, flexDirection: 'row', justifyContent: 'space-evenly'}} >
            <TouchableOpacity style={Styles.btnEntrance} >
                <Text>Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity style={Styles.btnEntrance} onPress={() => navigation.navigate('maps')} >
                <Text>Maps</Text>
            </TouchableOpacity>
        </View>
    );
}

export default EntranceScreen