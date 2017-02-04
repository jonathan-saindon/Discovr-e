import {connect} from 'react-redux'
import {login} from '../ducks'
import LoginForm from '../components/LoginForm'

const mapStateToProps = () => {
  return {
    initialValues: {
      email: "",
      password: ""
    }
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onSubmit: (data) => {
      dispatch(login(data))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginForm)