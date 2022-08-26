import React, {Component} from 'react';
import { View, Text, StyleSheet, SafeAreaView, RefreshControl, TouchableOpacity, FlatList } from 'react-native';

export default class CartScreen extends Component{
    render(){
        return(
            <View style={{flex:1}}>
                <Text style={{ fontSize:25, padding: 10}}>Cart</Text>
                
            </View>
        )
    }
}