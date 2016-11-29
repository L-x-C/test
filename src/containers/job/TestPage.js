import React, {Component, PropTypes} from 'react';
import {action} from 'mobx';
import StudentActions from '../../actions/student';
import {observer, inject} from 'mobx-react';
import { Link } from 'react-router';

@inject("student")
@observer
export default class TestPage extends Component {
  @action
  static fetchData({states, query, params}) {
    return StudentActions.fetchName(states);
  }

  changeName = () => {
    this.props.student.store_name = 'ClientName';
  };

  render() {
    return (
      <div>
        <Link to='/test2' >link to test2</Link>
        <h1>{this.props.student.store_name}</h1>
        <button onClick={this.changeName}>click</button>
      </div>
    );
  }
}


TestPage.propTypes = {
  student: PropTypes.object
};
