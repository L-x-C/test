import React, {PropTypes, Component} from 'react';
import map from 'lodash/map';
import isObject from 'lodash/isObject';
import initialState from '../../reducers/initialState';

class SelectorView extends Component {
  static propTypes = {
    setToolBar: PropTypes.func,
    handleSelectorClick: PropTypes.func,
    prepareSelectorData: PropTypes.func,
    loadSelectorData: PropTypes.func,
    title: PropTypes.string,
    name: PropTypes.string,
    step: PropTypes.number,
    close: PropTypes.object,
    section_name: PropTypes.string,
    data: PropTypes.array
  }

  componentWillMount() {
    this.setToolBar();
  }

  componentDidUpdate() {
    this.setToolBar();
  }

  setToolBar() {
    const {title, step, name, close, section_name, prepareSelectorData, loadSelectorData, handleSelectorClick} = this.props;
    const toolBar = {
      title,
      back() {
        if (step > 1) {
          prepareSelectorData({step: step - 1, name, section_name});
        }
        else {
          loadSelectorData(initialState.selector);
        }
      }
    };
    const closeText = close && close.text;
    if (closeText) {
      toolBar.element = {
        type: 'a',
        title: closeText,
        className: 'job-toolbar__right_text',
        onClick() {
          handleSelectorClick({
            value: close.value,
            end: true
          });
        }
      };
    }
    this.props.setToolBar(toolBar);
  }

  handleTabClick = (e) => {
    const {step, section_name, prepareSelectorData} = this.props;
    prepareSelectorData({step, section_name, name: e.target.value});
  }

  handleClick = (e) => {
    const data = {
      value: e.target.value
    };
    this.props.handleSelectorClick(data);
  }

  render() {
    const {name, step} = this.props;
    const university_tabs = [
      ['university_domestic', '国内'],
      ['university_foreign', '国外']
    ];
    return (<div>
      {
        (step === 1) && university_tabs.map(u => u[0]).includes(name) &&
        <div className="selector__tab-wrapper">
          <div className="selector__tab">
            {
              university_tabs.map(u => {
                const un = u[0];
                return <a key={un} value={un} className={`selector__tab-item${(name === un) ? ' selected' : ''}`} onClick={this.handleTabClick}>{u[1]}</a>;
              })
            }
          </div>
        </div>
      }
      <div className="selector__box">
        {map(this.props.data, (item) => {
          if (isObject(item)) {
            return <div key={item.name || item.text} className="selector__box-item" value={item} onClick={this.handleClick}>{item.name || item.text}</div>;
          }
          return <div key={item} className="selector__box-item" value={item} onClick={this.handleClick}>{item}</div>;
        })}
      </div>
    </div>);
  }
}

export default SelectorView;
