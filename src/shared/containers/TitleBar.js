// import ActionButton from '../../shared/components/ActionButton'

// <TitleBar title={"Employees"}>
//   <ActionButton action={actions.openSidePanel} text={"Add an employee"} color_class={"darkorange"}
//                 icon_class={"fa-plus"}/>
// </TitleBar>

import {connect} from 'react-redux'
import TitleBar from '../components/TitleBar'

const mapStateToProps = (state) => {
  return {
    title: "Companies",
    color: "orange",
    id_name: "employee_side_panel"
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TitleBar)