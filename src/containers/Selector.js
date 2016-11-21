import React, {PropTypes, Component} from 'react';
import {connect} from 'react-redux';
import SelectorView from '../components/common/selector.jsx';
import {setToolBar} from '../actions/toolBarActions';
import {handleSelectorClick, prepareSelectorData, loadSelectorData} from '../actions';

function mapStateToProps(state) {
  return {...state.selector};
}

export default connect(
  mapStateToProps,
  {setToolBar, handleSelectorClick, prepareSelectorData, loadSelectorData}
)(SelectorView);
