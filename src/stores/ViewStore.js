import {observable, action} from 'mobx';

export default class ViewStore {
  @action changeName() {
    this.store_name = 'lxc2';
  }
	@observable store_name = 'lxc';
}

