import * as actions from '../actions';
import {fetchDrawerInfo} from '../actions/toolBarActions';
import {SmartDisPatch} from '../helpers/';

export function enterCareer(store) {
  return (nextState) => {
    const { uid } = nextState.params;
    if (uid) {
      SmartDisPatch(store, actions.loadUID(uid));
      SmartDisPatch(store, actions.loadCareer(uid));
      SmartDisPatch(store, fetchDrawerInfo());
    } else {
      store.dispatch(actions.loadMyCareer());
    }
  };
}
