import {toJS} from 'mobx'
import ViewStore from './stores/ViewStore';

// All our actions are listed here
export const stores = {
  view: new ViewStore()
};


export default stores;
// Export function that creates our server tate
// export const createServerState = () => toJS(stores)

// Export function that creates our client state
// export const createClientState = () => mergeObservables(defaultState, window.__STATE)

//
// import { observable, toJS } from 'mobx'
// import mergeObservables from './helpers/mergeObservables'
//
// // Default state structure
// let defaultState =  observable({
//   app: {
//     title: 'Mobx Isomorphic Starter',
//     description : 'Here goes description',
//     host: ''
//   },
//   browse: {
//     data : ''
//   }
// })
//
// // Export function that creates our server tate
// export const createServerState = () => toJS(defaultState)
//
// // Export function that creates our client state
// export const createClientState = () => mergeObservables(defaultState, window.__INITIAL_STATE__)

