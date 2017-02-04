import React from 'react'
import DisplayError from '../../containers/DisplayError'

const ErrorPage = () => (
  <div className="error-page">
    <div className="error-content">
      <h2 className="underline">Une erreur est survenue</h2>
      <div className="small-padding-top">
        <p className="small-padding-bottom">Plus de détails sont indiqués ci-dessous. Veuillez copier cette information dans votre rapport de bug.</p>
        <DisplayError />
      </div>
    </div>
  </div>
)

export default ErrorPage