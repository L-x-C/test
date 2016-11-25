import ViewStore from './stores/ViewStore';

// All our actions are listed here
export const stores = () => {
    return {
        view: new ViewStore()
    };
};

// Initialize actions and state
export default stores();
