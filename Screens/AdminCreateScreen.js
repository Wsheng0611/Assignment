import React, {Component} from 'react';
import {StyleSheet, TextInput, Text, View, ScrollView, Button, Image} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';

let SQLite = require('react-native-sqlite-storage');

export default class CreateScreen extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      price: 0,
      category: '',
      description: '',
      image: '',
    };
    this._insert = this._insert.bind(this);
    this.db = SQLite.openDatabase(
     {name: 'assignmentdb'},
      this.openDb,
      this.errorDb,
    );
  }

  openGallery = () => {
    const options = {
      storageOptions: {
        path: 'images',
        mediaType: 'photo',
      },
    };
  
    launchImageLibrary(options, response => {
  
    console.log('Response = ',response);
    if(response.didCancel){
      console.log('User cancelled image picker');
    }
    else if(response.error){
      console.log('ImagePickerError',response.error);
    }
    else if(response.customButton){
      console.log('User tapped custom button',response.customButton);
    }
    else{
      const source = { uri: response.assets[0].uri };
      console.log("source = ",source);
      this.setState({image: source});
      console.log(this.image);
    }
    });
  };

  componentDidMount() {
    this.props.navigation.setOptions({headerTitle: 'Add New Product'});
  }

  _insert() {
    this.db.transaction(tx => {
      tx.executeSql('INSERT INTO products(name,image,price,category,description) VALUES(?,?,?,?,?)', [
        this.state.name,
        this.state.image,
        this.state.price,
        this.state.category,
        this.state.description,
      ]);
    });

    this.props.route.params.refresh();
    this.props.navigation.goBack();
  }

  openDb() {
    console.log('Database opened');
  }
  errorDb(err) {
    console.log('SQL Error: ' + err);
  }
  render() {
    let product = this.state.product;
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.TextLabel}>Name : </Text>
        <TextInput
            style={styles.TextInput}
            onChangeText={(name) => this.setState({name})}
            value={this.state.name}
        />
        <Text style={styles.TextLabel}>Image : </Text>
        {/* <Image 
          source={this.state.image}
          styles={{
            height:100,
            width:100,
            borderWidth:1,
            margin: 5,
          }}
        /> */}
        <Button
            title='Pick image'
            onPress={this.openGallery}
        />
        <TextInput
            style={styles.TextInput}
            value={this.state.image}
        />
        <Text style={styles.TextLabel}>Price : RM</Text>
        <TextInput
            style={styles.TextInput}
            onChangeText={(price) => this.setState({price})}
            value={this.state.price}
        />
        <Text style={styles.TextLabel}>Category : </Text>
        <TextInput
            style={styles.TextInput}
            onChangeText={(category) => this.setState({category})}
            value={this.state.category}
        />
        <Text style={styles.TextLabel}>Description : </Text>
        <TextInput
            style={styles.TextInput}
            onChangeText={(description) => this.setState({description})}
            value={this.state.description}
        />
        <Button
          style={styles.button}
          title={'Save'}
          onPress={this._insert}
        />
      </ScrollView>
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