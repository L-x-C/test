export function enterJobList(stores) {
  return (nextState, replace) => {
    stores.view.fetchName();
  };
}
