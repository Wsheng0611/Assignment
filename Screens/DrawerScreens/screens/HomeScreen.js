import React, {Component} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import Products from '../../Products';

let SQLite = require ('react-native-sqlite-storage');

export default class HomeScreen extends Component {
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
        'SELECT * FROM products WHERE name = "YONEX ASTROX 99 PRO" OR name = "YONEX JAPAN STRING EXBOLT 63" OR name = "YONEX 75TH SAFERUN 200" OR name = "YONEX PRO TROLLEY BAG 92232EX" OR name = "YONEX MEN’S POLO SHIRT 10482EX"',
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
        <Text style = {{fontSize: 25, marginHorizontal: 10, marginVertical: 10, fontWeight: ""}}>PROMOTION</Text>
        <FlatList
          data={this.state.products}
          extraData={this.state}
          showsVerticalScrollIndicator={true}
          
          renderItem={({item}) => (
          <TouchableOpacity
              underlayColor="pink"
              onPress={() => {
                this.props.navigation.navigate('AdminViewScreen', {
                  id: item.id,
                  headerTitle: item.name,
                  refresh: this._query,
                });
              }}>
          <Products>
            <Image source={{uri: item.image}} style={{
              width:150,
              height:150,
              margin:5,   
            }}/>
              <Text style={{fontSize: 20, fontWeight: 'bold'}}>{item.name}</Text>
              <Text style={{fontSize: 20, fontWeight: 'bold', color: 'red'}}>RM{item.price}</Text>
          </Products>
          </TouchableOpacity>
          )}
        />
      </ScrollView>
    );
  }
}
