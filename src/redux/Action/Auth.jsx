import axios from 'axios';
import { SET_USER } from '../types';
import {jwtDecode} from 'jwt-decode';
import { SET_AUTH_ERROR } from '../types';

export const LoginAction = form => async dispatch => {
  try {
    const res = await axios.post('http://localhost:3000/auth/login', form);
    if (res.data.success) {
      const { access_token } = res.data;
      localStorage.setItem('jwt', access_token);
      const decode = jwtDecode(access_token);
      dispatch(setUser(decode));
      return { success: true, user: decode };
    } else {
      dispatch(setAuthError(res.data.message || 'Login failed'));
      return { success: false };
    }
  } catch (error) {
    dispatch(setAuthError('Veuillez Valider Ton Compte ! '));
    return { success: false };
  }
};

export const setUser = decode => ({
  type: SET_USER,
  payload: decode,
});

export const setAuthError = message => ({
  type: SET_AUTH_ERROR,
  payload: message,
});

export const Logout = () => dispatch => {
  localStorage.removeItem('jwt');
  dispatch({
    type: SET_USER,
    payload: {},
  });
};
