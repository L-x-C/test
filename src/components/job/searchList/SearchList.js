import React, { Component, PropTypes } from 'react';
import './searchList.scss';

export default class SearchList extends Component {


  render() {
    return (
      <div className="job-search__list">
        {this.props.data && this.props.data.map((item) => {
          return (
            <div className="job-search__item"  key={item}>
              <span onClick={() => {this.props.onClick(item);}} className="job-search__list_content">{item}</span>
              {this.props.deleteLog && <span onClick={() => {this.props.deleteLog(item);}} className="icon-iconfont-close"> </span>}
            </div>
          );
        })}
      </div>
    );
  }
}

SearchList.propTypes = {
  data: PropTypes.array.isRequired,
  onClick: PropTypes.func.isRequired,
  deleteLog: PropTypes.func
};
