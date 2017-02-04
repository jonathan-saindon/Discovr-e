import React from 'react'
import {Link} from 'react-router'

const NotFoundPage = () => (
  <div className="not-found">
    <div className="not-found-content">
      <h2 className="underline">Erreur 404</h2>
      <div className="small-padding-top">
        Désolé! Il n'y a rien à cette adresse.
        <Link to="/">Retourner à l'application</Link>
      </div>
    </div>
  </div>
)

export default NotFoundPage