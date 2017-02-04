import React, { Component, PropTypes } from 'react'
import { reduxForm } from 'redux-form'

const validate = values => {
  const errors = {}
  return errors
}

class LoginForm extends Component {
  constructor(props, context) {
    super(props, context)
  }

  render() {
    const { fields: { password, email },
      handleSubmit,
      submitting
      } = this.props

    return (
      <form onSubmit={handleSubmit} className="login-form">
        <h2 className="underline">Plateforme de maillage de la Maison des Régions</h2>
        <h3 className="bold small-padding-top">Connexion</h3>
        <div className="field">
          <label for="id_email">Email</label>
          <input className="login-email" id="id_email" name="email" type="email" {...email}/>
        </div>
        <div className="field">
          <label for="id_password">Mot de Passe</label>
          <input className="password" id="id_password" name="password" type="password" {...password}/>
        </div>
        <div className="submit-buttons">
            <input id="login-button" type="submit" name="submit" className="btn" disabled={submitting}
                   value="Se connecter"/>
        </div>
      </form>
    )
  }
}

LoginForm.propTypes = {
  fields: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  resetForm: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired
}

export default reduxForm({
  form: 'login',
  fields: [ 'password', 'email' ],
  validate
})(LoginForm)
