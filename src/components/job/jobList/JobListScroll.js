import React, { Component, PropTypes } from 'react';
import ReactIScroll from 'react-iscroll';
import objectAssign from 'object-assign';
import JobList from './JobList';
import './jobList.scss';

const iScrollOptions = {
  mouseWheel: true,
  scrollbars: false,
  click: true,
  probeType: 2
};

export default class JobListScroll extends Component {
  state = {
    iscrollInstance: null
  };

  componentDidMount() {
    this.setState({
      iscrollInstance: require('iscroll/build/iscroll-probe')
    });
  }
  componentWillUpdate() {
    this.refs.scrollMore.style.display = 'none';
  }

  componentDidUpdate() {
    if (this.props.listInfoMoreEmpty && this.props.data.length >= 20) {
      this.refs.scrollMoreTip.style.display = 'none';
    }
  }

  onScrollEnd = (iscroll) => {
    if (iscroll.directionY === 1 && iscroll.y === iscroll.maxScrollY && JSON.stringify(this.props.data) !== JSON.stringify(this.props.lastData) && this.props.data.length >= 20) {
      //上滑加载更多
      this.refs.scrollMore.style.display = 'block';
      let currentSkip = this.props.data.length,
        currentQuery = this.props.selected;
      //把当前已有参数和加载更多参数合并
      let obj = objectAssign({}, currentQuery, {skip: currentSkip});
      this.props.actions.fetchSkipJobListScroll(this.props.api, obj);
    }
  };

  render() {
    return (
      <div className="iscroll-wrapper iscroll-wrapper__myjob">
        {this.state.iscrollInstance &&
        <ReactIScroll iScroll={this.state.iscrollInstance} options={iScrollOptions} onScrollEnd={this.onScrollEnd}>
          <div>
            <JobList type={this.props.type} data={this.props.data}/>

            <p ref="scrollMore" className="scroll-more__tip icon-spin4" >正在加载</p>

            {this.props.data.length >= 20 && <p ref="scrollMoreTip" className="scroll-more__tip">上滑加载</p>}
          </div>
        </ReactIScroll>}

        {!this.state.iscrollInstance &&
          <div>
            <JobList type={this.props.type} data={this.props.data}/>

            <p ref="scrollMore" className="scroll-more__tip icon-spin4" >正在加载</p>

            {this.props.data.length >= 20 && <p ref="scrollMoreTip" className="scroll-more__tip">上滑加载</p>}
          </div>}
      </div>
    );
  }
}


JobListScroll.propTypes = {
  data: PropTypes.array,
  actions: PropTypes.object.isRequired,
  lastData: PropTypes.array.isRequired,
  listInfoMoreEmpty: PropTypes.bool.isRequired,
  selected: PropTypes.object.isRequired,
  api: PropTypes.string.isRequired,
  type: PropTypes.string
};
