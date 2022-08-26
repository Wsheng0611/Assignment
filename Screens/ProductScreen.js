import React, {Component} from 'react';

import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import Products from './Products';

let SQLite = require ('react-native-sqlite-storage');

export default class ProductScreen extends Component {
  constructor (props) {
    super (props);
    this.state = {
      products: [],
    };
    this._query = this._query.bind (this);
    this.db = SQLite.openDatabase (
      {name: 'assignmentdb'},
      this.openCallback,
      this.errorCallback
    );
  }

  componentDidMount () {
    this._query ();
  }

  _query () {
    this.db.transaction (tx =>
      tx.executeSql (
        'SELECT * FROM products ORDER BY category',
        [],
        (tx, results) => this.setState ({products: results.rows.raw ()})
      )
    );
  }

  openCallback () {
    console.log ('database open success');
  }

  errorCallback (err) {
    console.log ('Error in opening the database: ' + err);
  }

  render () {
    return (
      <ScrollView>
        <FlatList
          columnWrapperStyle={{
            justifyContent: "center",
          alignItems: 'center'}}
          data={this.state.products}
          // set two columns in one row
          numColumns={2}
          extraData={this.state}
          //showsVerticalScrollIndicator={true}
          
          renderItem={({item}) => {
            return (
              <View style={{
                borderRadius: 20,
                width: '50%',
                flexDirection: 'row', flexWrap: 'wrap',
                alignItems: 'center',
               backgroundColor: 'white'}}
                >
              <TouchableOpacity
                underlayColor="pink"
                onPress={() => {
                    this.props.navigation.navigate('AdminViewScreen', { 
                        id: item.id,
                        headerTitle: item.name,
                        refresh: this._query,
                    });
                }}>

              <ScrollView>
              <Products>
              <Image source={{uri: item.image}}
              style={{height: 200, width: 200}}/>
              <Text style={{fontSize: 10, margin: 5}}>
              {item.name}
              </Text>
              <Text>
                RM{item.price}
                </Text>
            </Products>
              </ScrollView>
              </TouchableOpacity>
              </View>
            );
        }}
        />
      </ScrollView>
    );
  }
}
