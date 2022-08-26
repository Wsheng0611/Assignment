import React, {Component} from 'react';
import {StyleSheet, TextInput, Text, View, ScrollView, Button, Image} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import {Picker} from '@react-native-picker/picker';

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
      this.setState({image: response.assets[0].uri});
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
        <View>
          <Text style={styles.TextLabel}>Name : </Text>
          <TextInput
              style={styles.TextInput}
              onChangeText={(name) => this.setState({name})}
              value={this.state.name}
          />
        </View>
        <View>
          <Text style={styles.TextLabel}>Image : </Text>
        </View>
        <View style={{ width: 200, height: 200, borderWidth: 1, marginBottom:20,}}>
          <Image source={{uri: this.state.image}} 
          style={{
            width: '100%',
            height: undefined,
            marginBottom: 20,
            aspectRatio: 1,
          }}/>
        </View>
        <View style={{marginBottom:20, width:200}}>
        <Button
            title='Pick image'
            onPress={this.openGallery}
        />
        </View>
        <View>
          <Text style={styles.TextLabel}>Price : RM</Text>
          <TextInput
              style={styles.TextInput}
              onChangeText={(price) => this.setState({price})}
              value={this.state.price}
          />
        </View>
        <View>
          <Text style={styles.TextLabel}>Category : </Text>
          <Picker
            style={styles.picker}
            mode={'dialog'}                     
            prompt={'Select Product Category'}  
            selectedValue={this.state.category}
            onValueChange={
              (itemValue, itemIndex) => this.setState({category: itemValue})
            }>
            <Picker.Item label="Racquet" value="Racquet" />
            <Picker.Item label="Accessories" value="Accessories" />
            <Picker.Item label="Bag" value="Bag" />
            <Picker.Item label="Footwear" value="Footwear" />
            <Picker.Item label="Appareal" value="Appareal" />
        </Picker>
        </View>
        <View>
          <Text style={styles.TextLabel}>Description : </Text>
          <TextInput
              style={styles.TextInput}
              multiline={true}
              onChangeText={(description) => this.setState({description})}
              value={this.state.description}
          />
        </View>
        <View style={{marginBottom: 20, paddingBottom: 20}}>
          <Button
            title={'Save'}
            onPress={this._insert}
          />
        </View>
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
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 3,
  },

  TextInput: {
    fontSize: 20,
    color: '#000099',
    width: '100%',
    borderBottomWidth:2,
    borderColor:'#ccc',
    marginBottom: 20,
    marginLeft: 3,
  },
  picker: {
    color: '#000099',
    margin: 10,
    width: '50%',
    left: 10,
    transform: [
      { scaleX: 1.5 }, 
      { scaleY: 1.5 },
   ]
 },

});