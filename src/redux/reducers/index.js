import { LOGIN, LOGOUT, SIGNUP, JOBS, ADDFAVORITES, REMOVEFAVORITES, ALLJOBS } from '../types/index'
const intialState = {
    user: {},
    users: [],
    favorites: [],
    logged_in: false,
    allJobs: [],
}
const reducer = (state = intialState, action) => {
    switch (action.type) {
        case LOGIN: {
            return {
                ...state,
                user: action.payload,
                logged_in: true,
                date: new Date()
            }
        }
        case SIGNUP: {
            return {
                ...state,
                user: action.payload,
            }
        }
        case LOGOUT: {
            return {
                ...state,
                user: {},
                logged_in: false
            }
        }
        case ADDFAVORITES: {
            return {
                ...state,
                favorites: action.payload
            }
        }
        case REMOVEFAVORITES: {
            return {
                ...state,
                favorites: action.payload
            }
        }
        case JOBS: {
            return {
                ...state,
                jobs: action.payload
            }
        }
        case ALLJOBS: {
            return {
                ...state,
                allJobs: action.payload
            }
        }
        default:
            return state
    }
}
export default reducer;