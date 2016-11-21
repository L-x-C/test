import React, { Component, PropTypes } from 'react';
import SearchList from '../job/searchList/SearchList.js';

export default class SearchSuggestion extends Component {
  state = {
    show: true
  };

  componentWillReceiveProps(res) {
    if (res.data.length !== 0) {
      this.setState({
        show: true
      });
    }
  }

  handleClick = (e) => {
    if (e.target.className !== 'job-search__list_content') {
      //点击空白处消失
      this.setState({
        show: false
      });
      this.props.toolBarActions.initSearchSuggestion();
    }
  };

  render() {
    let data = this.props.data;
    if (this.state.show) {
      return (
        <div className="toolbar-suggestion_wrapper" onClick={this.handleClick}>
          <div className="toolbar-suggestion">
              <SearchList onClick={this.props.searchAction} data={data} />
          </div>
        </div>
      );
    } else {
      return null;
    }

  }
}

SearchSuggestion.propTypes = {
  toolBarActions: PropTypes.object,
  data: PropTypes.array,
  searchAction: PropTypes.func
};
