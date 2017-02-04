import {connect} from 'react-redux'
import TopBar from '../components/Menu'
import {logout} from '../../shared/ducks'


const mapStateToProps = (state) => {
  return {
    current_user: state.shared.topBar.current_user,
    routes: [
      {route: "/", text: "Entreprises"},
      {route: "/pairing", text: "Maillages"}
    ]
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => {
      dispatch(logout())
    }
  }
}

const Menu = connect(
  mapStateToProps,
  mapDispatchToProps
)(TopBar)

export default Menu