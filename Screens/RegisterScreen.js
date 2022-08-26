import React, { Component } from "react";

import {
	StyleSheet,
	Text,
	TouchableOpacity,
	SafeAreaView,
	ImageBackground,
	ScrollView,
	KeyboardAvoidingView,
	View
} from "react-native";

import { TextInput } from 'react-native-paper';

import AsyncStorage from '@react-native-async-storage/async-storage'

export default class RegisterScreen extends Component {
	constructor(props){
		super(props);

		// ref is created and assigned to an instance property
		this.nameRef = React.createRef();
		this.emailRef = React.createRef();
		this.passwordRef = React.createRef();
		this.confirmPasswordRef = React.createRef();
		this.mobileRef = React.createRef();
		this.bdateRef = React.createRef();

        this.state = {
			// input for new information
			name: '',
			email: '',
			mobile: '',
			bdate: '',
			password: '',
			confirmPassword: '',
			error: '',

			// wrong input format
			emptyError: false,
			emailError: false,
			mobileError: false,
			passwordError: false,
			confirmPasswordError: false,
			navigation: this.props.navigation
		}
	}

	showData = async() => {

		let {name, email, mobile, password, confirmPassword, bdate } = this.state;

		// validate input data using Regex rule
		let emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
		let passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
		let phoneRegex = /^(\+?6?01)[02-46-9][-][0-9]{7}$|^(\+?6?01)[1][-][0-9]{8}$/;

		// test empty field
		if((name, email, mobile, password, confirmPassword, bdate) != ''){
			this.setState({ emptyError: false })

			// test email format
			if (emailRegex.test(email)) {
				this.setState({ emailError: false })

				// test password format
				if (passwordRegex.test(password)) {
					this.setState({ passwordError: false })

					// check password enter = confirmed password
					if (password === confirmPassword) {
						this.setState({ passwordError: false, confirmPasswordError: false })

						// test phone format
						if (phoneRegex.test(mobile)) {
							this.setState({ mobileError: false })

							await AsyncStorage.setItem('userName', name)
							await AsyncStorage.setItem('userEmail', email)
							await AsyncStorage.setItem('userPassword', password)
							await AsyncStorage.setItem('userMobile', mobile)
							await AsyncStorage.setItem('userDOB', bdate);
							
							return alert('Register Sucessfully'), this.state.navigation.replace('LoginScreen');
						}
						this.setState({ mobile: '', mobileError: true })
						return alert('Please follow mobile format in 01X-XXXXXXX');

					}
					this.setState({ password: '', confirmPassword: '', passwordError: true, confirmPasswordError: true })
					return alert('Confirm Password Not Matching with Password');

				}
				this.setState({ password: '', confirmPassword: '', passwordError: true, confirmPasswordError: true })
				return alert('Password Not Matching Format in must be at least 8 long, one upper case, one digit and one non-alphanumeric');

			}
			this.setState({email: '', emailError: true })
			return alert('Please follow email format in xxx@xxx.xxx');

		}
		this.setState({ emptyError: true })
		return alert('Empty Field is not allowed !!!');
	}

	// display register form
	render() {
		return (

			<SafeAreaView style = {{ flex: 1}}> 
				<KeyboardAvoidingView style = {{ flex: 1 }}>
					<ImageBackground 
						style = {{ flex: 1 }}
						opacity = {0.5}
						source = {{ uri:'https://raw.githubusercontent.com/AboutReact/sampleresource/master/crystal_background.jpg' }}
					>

					<ScrollView contentContainerStyle = { styles.scrollviewStyles } showsVerticalScrollIndicator={false} >

						<View style = { styles.headingStyles }>
							<Text style = { styles.title } >Registration Form</Text>
						</View>

						{/* TextInput mode --> flat and outlined ## in this case we use flat only */}

						{/* Name */}
						<TextInput
							mode="flat"
							label="Name"
							placeholder="Username" 
							returnKeyType="next"
							blurOnSubmit={false}
							ref={this.nameRef}
							value={this.state.name}
							onChangeText={ (name) => this.setState({ name })}
							onSubmitEditing={() => this.nameRef.current.focus()}
							style={styles.inputStyles}
						/>
						
						{/* Email Address */}
						<TextInput
							mode="flat"
							label="Email Address"
							placeholder="email@example.com"
							returnKeyType="next"
							blurOnSubmit={false}
							error={this.state.emailError}
							ref={this.emailRef}
							value={this.state.email}
							onChangeText={ (email) => this.setState({ email })} 
							onSubmitEditing={() => this.passwordRef.current.focus()}
							style={styles.inputStyles}
						/>
					
						{/* Password */}
						<TextInput
							mode="flat"
							label="Password"
							placeholder="at least one(1-9), one (A-Z), one (symbol) and >= 8 long"
							returnKeyType="next"
							blurOnSubmit={false}
							error={this.state.passwordError}
							ref={this.passwordRef}
							value={this.state.password}
							secureTextEntry={true}
							onChangeText={(password) => this.setState({ password })} 
							onSubmitEditing={() => this.confirmPasswordRef.current.focus()}
							style={styles.inputStyles}
						/>
						
						{/* Confirm Password */}
						<TextInput
							mode="flat"
							label="Confirm Password"
							placeholder="Re-enter Password"
							returnKeyType="next"
							blurOnSubmit={false}
							error={this.state.confirmPasswordError}
							ref={this.confirmPasswordRef}
							value={this.state.confirmPassword}
							secureTextEntry={true}
							onChangeText={ (confirmPassword) => this.setState({ confirmPassword })} 
							onSubmitEditing={() => this.mobileRef.current.focus()}
							style={styles.inputStyles}
						/>
						
						{/* Mobile */}
						<TextInput
							mode="flat"
							label="Phone Number"
							returnKeyType="next"
							placeholder="01X-XXXXXXX" 
							keyboardType="phone-pad"
							blurOnSubmit={false}
							maxLength={11}
							error={this.state.mobileError}
							ref={this.mobileRef}
							value={this.state.mobile}
							onChangeText={ (mobile) => this.setState({ mobile })}
							onSubmitEditing={() => this.bdateRef.current.focus()}
							style={styles.inputStyles}
						/>
					
						{/* Date of Birth */}
						<TextInput
							mode="flat"
							label="Date of Birth"
							placeholder="DD-MM-YYYY"
							keyboardType="numeric"
							returnKeyType="done"
							ref={this.bdateRef}
							value={this.state.bdate}
							onChangeText={ (bdate) => {
								let bdateUpdate = bdate;
								if (bdate.length === 2 || bdate.length === 5) {
									bdateUpdate = bdateUpdate + '-';
								}
								this.setState({ bdate: bdateUpdate })
							}}
							style={styles.inputStyles}
							maxLength={10}
						/>

						{/* Submit Button */}
						<TouchableOpacity
							activeOpacity={0.8}
							style={styles.submitbuttonStyle}
							onPress={() => this.showData()}>
							<Text style={{ fontSize: 20, fontWeight: 'bold' }}>
								Submit
							</Text>
						</TouchableOpacity>

					{/* Back to Login Part */}
					<Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 15, color: 'black' }} >
						Already have Account?  
						<Text onPress = 
							{() => {
								this.state.navigation.navigate('LoginScreen');
							}}
							style={{color: '#00F', textDecorationLine: 'underline'}}>

							<Text> Sign in</Text>
						</Text> 
					</Text>
					</ScrollView>

					</ImageBackground>
				</KeyboardAvoidingView>
			</SafeAreaView>
		);
	}
}

const styles = StyleSheet.create({

	scrollviewStyles: {
		flexGrow:1,
		justifyContent:'center' 		
	},

	headingStyles: {
		alignItems: 'center',
		marginVertical: 12,
	},

	title: {
		fontSize: 35,
		fontWeight: 'bold',
		fontFamily: 'sans-serif-medium',
		color: '#191970',
	},

	inputStyles: {
		overflow: 'hidden',
		borderColor: "#233067 ",
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		borderBottomLeftRadius: 20,
		borderBottomRightRadius: 20,
		marginHorizontal: 10,	
		marginVertical: 7,
		width: '95%',
		backgroundColor: '#EFF4F9',
		marginLeft: 'auto',
		marginRight: 'auto'
	},

	submitbuttonStyle: {
		borderRadius: 10,
		borderColor: "#FBB741",
		borderWidth: 1,
		height: 50,
		width: 250,
		marginVertical: 10,
		alignItems:"center",
		justifyContent:"center",
		marginLeft: 'auto',
		marginRight: 'auto',
		backgroundColor: 'yellow'
	},
});
