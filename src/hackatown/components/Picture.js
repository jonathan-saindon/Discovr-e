import React, {PropTypes} from 'react'
import classnames from 'classnames'

const Picture = ({picture, name, size, icon_class, shape}) => {
  let pictureClass = classnames(shape, size)
  if (typeof name !== "undefined") {
    return (
      <div className={pictureClass}>
        { picture ? <img src={picture}/> : <span className="letter">{name[0]}</span> }
        { icon_class && <i className={"fa " + icon_class}/> }
      </div>
    )
  }
}

Picture.propTypes = {
  picture: PropTypes.string,
  name: PropTypes.string.isRequired,
  size: PropTypes.string.isRequired,
  icon_class: PropTypes.string,
  shape: PropTypes.string
}

export default Picture
