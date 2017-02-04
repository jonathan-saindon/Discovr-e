import {connect} from 'react-redux'
import UserInfo from '../components/UserInfo'
import {isEmpty} from 'lodash'
import { denormalize } from 'normalizr'
import {userSchema} from '../../../middleware/schema'

const mapStateToProps = (state, ownProps) => {
  // let user = denormalize(ownProps.id, userSchema, state.entities)
  let user = state.entities.user[ownProps.id]
  return {
    user: user,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserInfo)