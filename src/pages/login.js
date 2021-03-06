import React, { Component } from 'react';

import { Text, Button } from 'native-base';
import { View, TextInput, StyleSheet, AsyncStorage } from 'react-native';

import { MaterialCommunityIcons } from '@expo/vector-icons';

import { common, messages } from '../styles/common';

import AgendaEdu from '../services/api';
import adapter from 'axios/lib/adapters/http';

export default class Login extends Component {
  state = {
    message: null,
    email: null,
    password: null,
    loginPassed: false,
    styleEmail: null,
    stylePassword: null
  };

  static navigationOptions = {
    title: 'Login',
    header: null
  };

  async componentDidMount() {
    const token = await AsyncStorage.getItem('user_token');
    this.afterLogin(token);
  }

  login = async () => {
    this.clear();
    try {
      const response = await AgendaEdu.authenticate(
        this.state.email,
        this.state.password
      );

      AsyncStorage.setItem('user_token', response.data.token);

      await this.afterLogin(response.data.token);
    } catch (error) {
      this.setState({
        message: 'E-mail ou senha incorretos'
      });
    }
  };

  afterLogin = async token => {
    if (token != null) {
      AgendaEdu.initialize(token);
      this.props.navigation.navigate('Events');
    }
  };

  clear = () => {
    this.setState({
      message: null
    });
  };

  onBlurEmail() {
    this.setState({
      styleEmail: {
        borderColor: '#ABB1B7'
      }
    });
  }

  onFocusEmail() {
    this.setState({
      styleEmail: {
        borderColor: '#733DBE'
      }
    });
  }

  onBlurPassword() {
    this.setState({
      stylePassword: {
        borderColor: '#ABB1B7'
      }
    });
  }

  onFocusPassword() {
    this.setState({
      stylePassword: {
        borderColor: '#733DBE'
      }
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.form}>
          <View style={styles.title}>
            <Text style={styles.titleText}>Faça seu login 🔑</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>E-mail ou usuário</Text>
            <View sytle={styles.inputIconGroup}>
              <TextInput
                id="emailInput"
                style={[styles.emailInput, this.state.styleEmail]}
                onBlur={() => this.onBlurEmail()}
                onFocus={() => this.onFocusEmail()}
                onChangeText={email => this.setState({ email })}
              />
              <MaterialCommunityIcons
                style={styles.icon}
                name="email-outline"
                size={24}
              />
            </View>
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Senha</Text>
            <View sytle={styles.inputIconGroup}>
              <TextInput
                id="passwordInput"
                secureTextEntry={true}
                style={[styles.passwordInput, this.state.stylePassword]}
                onBlur={() => this.onBlurPassword()}
                onFocus={() => this.onFocusPassword()}
                onChangeText={password => this.setState({ password })}
              />
              <MaterialCommunityIcons
                style={styles.icon}
                name="eye-off-outline"
                size={24}
              />
            </View>
          </View>

          {this.state.message != null ? (
            <Text style={messages.error}>{this.state.message}</Text>
          ) : null}
        </View>
        <View style={styles.buttonsGroup}>
          <Button id="loginButton" style={styles.button} onPress={this.login}>
            <Text style={styles.buttonText}>Entrar</Text>
          </Button>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    alignSelf: 'stretch',
    marginBottom: 36
  },
  titleText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#333333',
    alignSelf: 'stretch',
    fontFamily: 'sf-pro-display-bold'
  },
  form: {
    flex: 3,
    padding: 24,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center'
  },
  label: {
    color: '#666666',
    marginBottom: 8,
    fontFamily: 'sf-pro-display-regular'
  },
  inputGroup: {
    alignSelf: 'stretch',
    marginBottom: 17
  },
  inputIconGroup: {
    flexDirection: 'row'
  },
  emailInput: {
    ...common.textInput,

    borderColor: '#ABB1B7'
  },
  passwordInput: {
    ...common.textInput,
    borderColor: '#ABB1B7'
  },
  icon: {
    color: '#AAAAAA',
    alignSelf: 'flex-end',
    marginTop: -37,
    marginRight: 15
  },
  buttonsGroup: {
    padding: 30,
    alignSelf: 'stretch'
  },
  button: {
    marginBottom: 40,
    alignSelf: 'stretch',
    height: 50,
    paddingTop: 16,
    paddingBottom: 16,
    borderRadius: 5,
    backgroundColor: '#733DBE',

    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText: {
    fontWeight: '600',
    fontFamily: 'sf-pro-display-semibold'
  }
});
