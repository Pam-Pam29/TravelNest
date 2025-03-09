import { combineReducers } from 'redux';
import authReducer from './authReducer';
import packageReducer from './packageReducer';
import bookingReducer from './bookingReducer';
import serviceProviderReducer from './serviceProviderReducer';
import alertReducer from './alertReducer';

export default combineReducers({
  auth: authReducer,
  package: packageReducer,
  booking: bookingReducer,
  serviceProvider: serviceProviderReducer,
  alert: alertReducer
});
