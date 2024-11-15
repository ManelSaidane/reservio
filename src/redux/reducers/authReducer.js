import { SET_USER, SET_AUTH_ERROR } from '../types';
import isEmpty from '../../util/isEmpty';

const initialState = {
	isConnected: false,
	user: {},
	authError: null,
};

export default function authReducer(state = initialState, action) {
	switch (action.type) {
		case SET_USER:
			return {
				...state,
				isConnected: !isEmpty(action.payload),
				user: action.payload,
				authError: null,
			};

		case SET_AUTH_ERROR:
			return {
				...state,
				authError: action.payload,
			};

		default:
			return state;
	}
}
