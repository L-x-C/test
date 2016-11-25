import React, { Component, PropTypes } from 'react';
import {observer, inject} from 'mobx-react';

@inject("view")
@observer
export default class TestPage extends Component {
  changeName = () => {
    this.props.view.changeName();
  };

  render() {
    return (
      <div>
        <h1>{this.props.view.store_name}</h1>
        <button onClick={this.changeName}>click</button>
      </div>
    );
  }
}


TestPage.propTypes = {
  view: PropTypes.object
};
