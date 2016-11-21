import React, { Component, PropTypes } from 'react';
import ReactSwipe from 'react-swipe';
import './fullScreenCarousel.scss';


export default class FullScreenCarousel extends Component {
  state = {
    pos: 1
  };

  callBack = () => {
    this.setState({
      pos: this.refs.reactSwipe.swipe.getPos() + 1
    });
  };

  render() {
    return (
      <div className="carousel-fullscreen__wrapper" onClick={this.props.triggerFullScreen}>
        <ReactSwipe ref="reactSwipe" className="carousel-fullscreen" swipeOptions={{continuous: false, callback: this.callBack}}>
          {this.props.pics.map((item) => {
            return (<div className="item" key={item.raw}>
              <img src={item.raw} alt=""/>
            </div>);
          })}
        </ReactSwipe>

        <div className="carousel-fullscreen__dotlist">
          {this.state.pos}/{this.props.pics.length}
          
        </div>
      </div>
    );
  }
}

FullScreenCarousel.propTypes = {
  pics: PropTypes.array.isRequired,
  triggerFullScreen: PropTypes.func.isRequired
};
