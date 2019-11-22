import React from 'react';
import { Platform, Text, TouchableOpacity } from 'react-native';

const buttonStyles = {
  button: {
    flexFlow: 'row wrap',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
    width: '80%',
    paddingVertical: 10,
    borderRadius: 50,
    ...Platform.select({
      ios: {
        shadowOffset: {
          width: 4,
          height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 3,
      },
      android: {
        elevation: 5,
      }
    }),
  },
  text: {
    textTransform: 'capitalize',
    color: '#6c63ff',
    fontSize: 25,
    fontWeight: 'bold',
  }
}

const Button = ({ background, color, style = {}, children, ...restProps }) => {
  const buttonStyle = {};
  const textStyle = {};

  if (background === 'white') buttonStyle.backgroundColor = '#FFF'
  if (background === 'purple') buttonStyle.backgroundColor = '#6c63ff'
  if (color === 'white') textStyle.color = '#FFF'
  if (color === 'purple') textStyle.color = '#6c63ff'

  return (
    <TouchableOpacity {...restProps} style={[buttonStyles.button, buttonStyle, style]}>
      {typeof children !== 'string' ? children : (
        <Text style={[buttonStyles.text, textStyle, restProps.textStyle]}>{children}</Text>
      )}
    </TouchableOpacity>
  )
}

export default Button
