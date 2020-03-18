import {
    AUTH_USER,
    UNAUTH_USER,
    AUTH_ERROR,
    GET_USER
} from '../../actions/types';

const Inital_State = {
    authenticated: false,
    user: {},
    error: ''
}

export default (state = Inital_State, action) => {
    console.log(action.type)
    switch (action.type) {

        case AUTH_USER:
            console.log("authing from reducer")
            return {
                ...state, authenticated: true, error: ''
            }

            case UNAUTH_USER:
                console.log("unauthing from reducer")
                return {
                    ...state, authenticated: false, error: ''
                }

                case AUTH_ERROR:
                    return {
                        ...state, error: action.payload
                    }

                    default:

                    case GET_USER:
                        return {
                            ...state, user: action.payload
                        }
                        console.log('defaulting on auth')
                        return state;
    }
}