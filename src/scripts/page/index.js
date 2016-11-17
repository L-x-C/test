//引入css
require("../../styles/lib/reset.css");
require("../../styles/common/global.css");
require("../../styles/common/grid.css");
require("../../styles/common/common.less");
require("../../styles/page/index.less");
import React, {Component} from 'react';
import ReactDOM, {render} from 'react-dom';
import { DatePicker } from 'antd';
import 'antd/dist/antd.css';  // or 'antd/dist/antd.less'

ReactDOM.render(<DatePicker />, document.getElementById('lxc'));

var oP = document.createElement('p');
oP.className = 'text';
oP.innerHTML = '这是由js生成的一句话。';
document.querySelector('.g-bd').appendChild(oP);

//增加事件
$('.btn').click(function() {
	require(['../components/dialog/index.js'], function(dialog) {
		dialog();
	});
});