import React, {PropTypes, Component} from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions/jobActions';
import * as toolBarActions from '../actions/toolBarActions';
import ToolBar from '../components/toolBar/ToolBar.js';

class App extends Component {
  static propTypes = {
    children: PropTypes.element,
    toolBarInfo: PropTypes.object,
    toolBarActions: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    drawerMenuInfo: PropTypes.object.isRequired,
    searchSuggestion: PropTypes.array.isRequired
  };

  render() {
    return (
      <div>
        <ToolBar actions={this.props.actions} searchSuggestion={this.props.searchSuggestion} toolBarActions={this.props.toolBarActions} data={this.props.toolBarInfo} drawerMenuInfo={this.props.drawerMenuInfo}/>
        {this.props.children}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    toolBarInfo: state.toolBar.toolBarData,
    drawerMenuInfo: state.toolBar.drawerMenuInfo,
    searchSuggestion: state.toolBar.searchSuggestion
  };
}
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
    toolBarActions: bindActionCreators(toolBarActions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
