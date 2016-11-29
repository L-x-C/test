import {observable, action} from 'mobx';

export default class ViewStore {
  @action fetchName() {
    let _this = this;
    // return new Promise((resolve)=>{
    //   setTimeout(function() {
    //     _this.store_name = 'aaaaaaaaaaa';
    //   }, 1000);
    // });
    _this.store_name = 'aaaaaa'
    // setTimeout(function() {
    //   _this.store_name = 'aaaaaaaaaaa';
    // }, 1000);
  }
  @action changeName() {
    this.store_name = 'lxc2';
  }
	@observable store_name = 'lxc';
}

