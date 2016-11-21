import React, { Component, PropTypes } from 'react';
import ReactIScroll from 'react-iscroll';
import './jobDropdown.scss';
import * as JobHelper from '../../../helpers/jobHelper';

const iScrollDropOptions = {
  mouseWheel: true,
  scrollbars: false,
  bounce: false,
  click: true
};

export default class Dropdown extends Component {
  state = {
    firstSelected: this.props.selected[this.props.data.type + 'Key'] ?  Number(this.props.selected[this.props.data.type + 'Key']) : '',
    iscrollInstance: null
  };

  componentDidMount() {
    let iscrollInstance = require('iscroll/build/iscroll-probe');
    this.setState({
      iscrollInstance: iscrollInstance
    });
  }

  handleBgClick = (e) => {
    //点击在阴影部分让他消失
    if (e.target.className === 'job-dropdown__wrapper') {
      this.props.disappearDropdown();
    }
  };

  //双层下拉的第一层点击
  handleFirstClick = (key) => {
    let dpData = this.props.data;
    if (key !== -1) {
      this.setState({
        firstSelected: key
      });
      if (!dpData.data[key].children) {
        //当对应的第二层没有数据时,直接就拿第一层的数据来提交了
        //这里设置一个延时是因为,如果按照代码的顺序执行,上面虽然改变了state,但是在执行到这里的时候state还是按没改变之前的,可以在上面那个setstate下输出console一看就明白
        setTimeout(() => {
          this.handleSelect();
        }, 0);
      }
    } else {
      //处理是不限的情况
      JobHelper.generateSearchUrl(this.props.pathname, {
        [dpData.type]: '',
        [dpData.type + 'Str']: '',
        [dpData.type + 'Key']: ''
      });
      this.props.disappearDropdown();
    }
  };

  //选择排序
  handleSelect = (obj) => {
    let dpData = this.props.data;
    if (dpData.type === 'kind' || dpData.type === 'sort') {
      let name = obj.fieldName === '不限' ? '' : obj.fieldName,
          id = obj.fieldValue;
      if (dpData.type === 'kind' && name === '' && this.props.selected.sortStr === '薪资最高') {
        //当选择职位性质为不限,如果此时排序为薪资最高时,自动变成最新
        JobHelper.generateSearchUrl(this.props.pathname, {
          [dpData.type]: id,
          [dpData.type + 'Str']: name,
          sort: 1,
          sortStr: '最新'
        });
      } else {
        JobHelper.generateSearchUrl(this.props.pathname, {
          [dpData.type]: id,
          [dpData.type + 'Str']: name
        });
      }
    } else if (dpData.type === 'intention' && this.props.mode !== 'search') {
      //选择行业并且是在职位列表页,也就是选择行业是双列的情况下
      if (obj && obj.name !== '不限') {
        JobHelper.generateSearchUrl(this.props.pathname, {
          [dpData.type]: [dpData.data[this.state.firstSelected].name, obj.name],
          [dpData.type + 'Str']: [dpData.data[this.state.firstSelected].name, obj.name],
          [dpData.type + 'Key']: this.state.firstSelected
        });
      } else {
        JobHelper.generateSearchUrl(this.props.pathname, {
          [dpData.type]: [dpData.data[this.state.firstSelected].name],
          [dpData.type + 'Str']: [dpData.data[this.state.firstSelected].name],
          [dpData.type + 'Key']: this.state.firstSelected
        });
      }
    } else if (dpData.type === 'intention' && this.props.mode === 'search') {
      //选择行业并且是在搜搜页,也就是选择行业是单列的情况下
      if (obj && obj.name !== '不限') {
        JobHelper.generateSearchUrl(this.props.pathname, {
          [dpData.type]: [obj.name],
          [dpData.type + 'Str']: [obj.name]
        });
      } else {
        JobHelper.generateSearchUrl(this.props.pathname, {
          [dpData.type]: '',
          [dpData.type + 'Str']: ''
        });
      }
    } else if (dpData.type === 'city') {
      if (obj && obj.name !== '不限') {
        JobHelper.generateSearchUrl(this.props.pathname, {
          [dpData.type]: obj.value,
          [dpData.type + 'Str']: [dpData.data[this.state.firstSelected].name, obj.name],
          [dpData.type + 'Key']: this.state.firstSelected
        });
      } else {
        JobHelper.generateSearchUrl(this.props.pathname, {
          [dpData.type]: dpData.data[this.state.firstSelected].value,
          [dpData.type + 'Str']: [dpData.data[this.state.firstSelected].name],
          [dpData.type + 'Key']: this.state.firstSelected
        });
      }
    }
    this.props.disappearDropdown();
  };

  render() {
    let dpData = this.props.data;
    //iscroll没发服务端渲染,所以把iscroll实例放在state中,一开始state中没值就先不渲染,等componentdidmount之后把实例赋给state
    if (this.state.iscrollInstance) {
      if (dpData.single) {
        return (
          <div className="job-dropdown__wrapper" onClick={this.handleBgClick}>
            <div className="job-dropdown">
              <div className="job-dropdown__ul">
                {dpData.data.map((item, index) => {
                  let currentClass = this.props.selected[dpData.type + 'Str'] === item.fieldName || (!this.props.selected[dpData.type + 'Str'] && index === 0) ? 'job-dropdown__item active' : 'job-dropdown__item';
                  if (this.props.selected.kind) {
                    return (
                      <div className={currentClass} key={item.fieldValue} onClick={() => {this.handleSelect(item);}}>
                        {item.fieldName}
                      </div>
                    );
                  } else {
                    //当职位性质为不限时,不要出现薪资最高
                    if (item.fieldName !== '薪资最高') {
                      return (
                        <div className={currentClass} key={item.fieldValue} onClick={() => {this.handleSelect(item);}}>
                          {item.fieldName}
                        </div>
                      );
                    }
                  }

                })}
              </div>
            </div>
          </div>
        );
      } else if (this.props.mode === 'search' && dpData.type === 'intention') {
        //搜索页的选择行业是单列
        let selected = this.props.selected[dpData.type + 'Str'] ? this.props.selected[dpData.type + 'Str'].split(',') : [],
          selected1 = selected[0] || '',
          selected2 = selected[1] || '';
        return (
          <div className="job-dropdown__wrapper" onClick={this.handleBgClick}>
            <div className="job-dropdown job-dropdown__double">
              <div className="job-dropdown__ul job-dropdown__special">
                <ReactIScroll iScroll={this.state.iscrollInstance} options={iScrollDropOptions}>
                  <div>
                    <div onClick={() => {this.handleSelect({name: '不限'});}} className={this.props.selected[dpData.type + 'Str'] === undefined ? 'job-dropdown__item active' : 'job-dropdown__item'}>
                      不限
                    </div>

                    {dpData.data.map((item, index) => {
                      return <div onClick={() => {this.handleSelect(item);}} className={this.props.selected[dpData.type + 'Str'] === item.name ? 'job-dropdown__item active' : 'job-dropdown__item'} key={index}>{item.name}</div>;
                    })}
                  </div>
                </ReactIScroll>
              </div>
            </div>
          </div>
        );
      } else {
        let selected = this.props.selected[dpData.type + 'Str'] ? this.props.selected[dpData.type + 'Str'].split(',') : [],
          selected1 = selected[0] || '',
          selected2 = selected[1] || '';
        return (
          <div className="job-dropdown__wrapper" onClick={this.handleBgClick}>
            <div className="job-dropdown job-dropdown__double">
              <div className="job-dropdown__ul">
                <ReactIScroll iScroll={this.state.iscrollInstance} options={iScrollDropOptions}>
                  <div>
                    <div onClick={() => {this.handleFirstClick(-1);}} className={this.state.firstSelected === '' ? 'job-dropdown__item active' : 'job-dropdown__item'}>
                      不限
                    </div>

                    {dpData.data.map((item, index) => {
                      return <div onClick={() => {this.handleFirstClick(index);}} className={index === this.state.firstSelected ? 'job-dropdown__item active' : 'job-dropdown__item'} key={index}>{item.name}</div>;
                    })}
                  </div>
                </ReactIScroll>
              </div>

              <div className="job-dropdown__ul">
                <ReactIScroll iScroll={this.state.iscrollInstance} options={iScrollDropOptions}>
                  <div>
                    {this.state.firstSelected !== '' && dpData.data[this.state.firstSelected].children &&
                    <div onClick={() => {this.handleSelect({name: '不限'});}} className={selected2 === '' ? 'job-dropdown__item active' : 'job-dropdown__item'}>不限</div>}

                    {this.state.firstSelected !== '' && dpData.data[this.state.firstSelected].children &&
                    dpData.data[this.state.firstSelected].children.map((item, index) => {
                      return <div onClick={() => {this.handleSelect(item);}} className={selected2 === item.name ? 'job-dropdown__item active' : 'job-dropdown__item'} key={index}>{item.name}</div>;
                    })}
                  </div>
                </ReactIScroll>
              </div>
            </div>
          </div>
        );
      }
    } else {
      return null;
    }


  }
}


Dropdown.propTypes = {
  data: PropTypes.object.isRequired,
  disappearDropdown: PropTypes.func.isRequired,
  pathname: PropTypes.string.isRequired,
  mode: PropTypes.string,
  selected: PropTypes.object.isRequired
};
