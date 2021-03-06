// @flow
import { connect } from 'react-redux';
import type { TLoginUser } from '../../Types/TLoginUser';
import LoginForm from './LoginForm';
import type { TStore } from '../../Redux/RootReducer';
import { login } from '../../Redux/Auth/AuthActions';

const mapStateToProps = (state: TStore) => ({
  loading: state.services.isFetching.login,
  redirectToChat: state.auth.isAuthenticated,
});

const mapDispatchToProps = dispatch => ({
  onLogin: (user: TLoginUser) => dispatch(login(user)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LoginForm);
