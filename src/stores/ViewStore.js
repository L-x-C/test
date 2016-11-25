import {observable} from 'mobx';

export default class ViewStore {
	@observable todoBeingEdited = 1;
	@observable todoFilter= 2;
}
