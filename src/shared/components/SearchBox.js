import React, {Component, PropTypes} from 'react'

export default class SearchBox extends Component {
  constructor(props, context) {
    super(props, context)

    this.search = this.search.bind(this)
  }

  search(event) {
    this.props.searchAction(event.target.value)
  }

  render() {
    const {placeholder, value } = this.props
    return (
      <div className="search-box">
        <input id="id-search-box-input" type="text" name="search" placeholder={placeholder} value={value} onChange={this.search}/>
      </div>
    )
  }
}

SearchBox.propTypes = {
  placeholder: PropTypes.string,
  dropdown: PropTypes.array,
  searchAction: PropTypes.func,
  value: PropTypes.string
}