import React, { Component, PropTypes } from 'react'

/* TEXT INPUT
 *  This component is to create a text input.
 *
 *  Call to component should look something like this:
 *  <TextInput id={"id-first-name"} label={"First Name :"} name={"first_name"} placeholder={"First Name"}
 *       text={first_name} required={true}/>
 *
 * */
export default class TextInput extends Component {
  constructor(props, context) {
    super(props, context)
  }

  render() {
    const {id, label, name, placeholder, text, required} = this.props
    let field = required ? "field required-field" : "field"
    return (
      <div className={field}>
        <label className="dark-purple" for={id} >{label}</label>
        <input type="text" id={id} name={name} placeholder={placeholder} text/>
        {(text.touched) && text.error ?
          <div className="dark-orange">{text.error}</div>
          : null
        }
      </div>
    )
  }
}

TextInput.propTypes = {
  // action: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  text: PropTypes.object,
  required: PropTypes.bool.isRequired
}