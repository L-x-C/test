import React, { Component, PropTypes } from 'react';
import './tagList.scss';

export default class TagList extends Component {
  render() {
    return (
      <div className="tag-list__wrapper">
        {this.props.data && this.props.data.map((item) => {
          return <h2 onClick={() => {this.props.onClick && this.props.onClick(item);}} className="tag-list" key={item}>{item}</h2>;
        })}
      </div>
    );
  }
}

TagList.propTypes = {
  data: PropTypes.array.isRequired,
  onClick: PropTypes.func
};
