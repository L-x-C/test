import React, {Component, PropTypes} from 'react';
import {action} from 'mobx';
import StudentActions from '../../actions/student';
import {observer, inject} from 'mobx-react';

@inject("student")
@observer
export default class TestPage extends Component {
  @action
  static fetchData({state, query, params}) {
    return StudentActions.fetchName(state);
  }

  changeName = () => {
    this.props.student.store_name = 'ClientName';
  };

  render() {
    return (
      <div>
        <h1>{this.props.student.store_name}</h1>
        <button onClick={this.changeName}>click</button>
      </div>
    );
  }
}


TestPage.propTypes = {
  student: PropTypes.object
};
