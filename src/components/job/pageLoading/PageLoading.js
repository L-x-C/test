import React, { Component, PropTypes } from 'react';
import './pageLoading.scss';
import imageLoading from '../../../images/loading.gif';

class PageLoading extends Component {
  render() {
    return (
      <div className="pageloading">
        <img src={imageLoading} alt=""/>
      </div>
    );
  }
}

export default PageLoading;
