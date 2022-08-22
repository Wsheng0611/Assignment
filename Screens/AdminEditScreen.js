import React, {Component} from 'react';
import {StyleSheet, TextInput, Text, View, ScrollView, Button} from 'react-native';

let SQLite = require('react-native-sqlite-storage');

export default class EditScreen extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      productID: this.props.route.params.id,
      name: '',
      email: '',
      state: '',
    };
    this._query = this._query.bind(this);
    this._update = this._update.bind(this);
    this.db = SQLite.openDatabase(
      {name: 'assignmentdb'},
      this.openDb,
      this.errorDb,
    );
  }
  componentDidMount() {
    this._query();
  }
  componentDidUpdate() {
    this.props.navigation.setOptions({headerTitle: this.state.name});
  }
  _query() {
    this.db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM products WHERE id = ?',
        [this.state.productsID],
        (tx, results) => {
          if (results.rows.length) {
            this.setState({
              name: results.rows.item(0).name,
              category: results.rows.item(0).category,
              price: results.rows.item(0).price,
              description: results.rows.item(0).description,
            });
          }
        },
      );
    });
  }
  _update() {
    this.db.transaction(tx => {
      tx.executeSql('UPDATE products SET name=?,price=?,category=?,description=? WHERE id=?', [
        this.state.name,
        this.state.price,
        this.state.category,
        this.state.description,
        this.state.productID,
      ]);
    });
    this.props.route.params.refresh();
    this.props.route.params.homeRefresh();
    this.props.navigation.goBack();
  }
  openDb() {
    console.log('Database opened');
  }
  errorDb(err) {
    console.log('SQL Error: ' + err);
  }
  render() {
    let student = this.state.student;
    return (
      <View style={styles.container}>
        <ScrollView>
            <Text style={styles.TextLabel}>Name:</Text>
            <TextInput
                style={styles.TextInput}
                value={this.state.name}
                onChangeText={name => {
                    this.setState({name});
                }}
                orientation={'vertical'}
            />
            <Text style={styles.TextLabel}>Price:</Text>
            <TextInput
                style={styles.TextInput}
                value={this.state.price}
                onChangeText={price => {
                    this.setState({price});
                }}
                orientation={'vertical'}
            />
            <Text style={styles.TextLabel}>Category:</Text>
            <TextInput
                style={styles.TextInput}
                value={this.state.category}
                onChangeText={category => {
                    this.setState({category});
                }}
                orientation={'vertical'}
            />
            <Text style={styles.TextLabel}>Description:</Text>
            <TextInput
                style={styles.TextInput}
                value={this.state.description}
                onChangeText={description => {
                    this.setState({description});
                }}
                orientation={'vertical'}
            />
            <Button
                title={'Save'}
                onPress={this._update}
            />
        </ScrollView>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  TextLabel: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 3,
    textAlignVertical: 'center',
  },

  TextInput: {
    fontSize: 24,
    color: '#000099',
  },

  pickerItemStyle: {
    fontSize: 20,
    color: '#000099',
  },
});