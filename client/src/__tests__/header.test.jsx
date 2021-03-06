import React from 'react';
import expect from 'expect';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import ConnectedHeader, { Header } from '../components/Header';

let mountedComponent;
let props;
let wrapper;
let authWrapper;

const response = {
  currentUser: {
    isAuthenticated: false,
    status: null,
    data: null
  }
};

const mockStore = configureStore();

let status;
const logout = () => {
  status = 'logged out';
};

/**
 * @description Initialise the component
 *
 * @returns {object} mountedComponent - Mounte
 */
const getComponent = () => {
  if (!mountedComponent) {
    props = {
      response,
      logout
    };
    mountedComponent = shallow(<Header {...props} />);
  }
  return mountedComponent;
};

/**
 * @description Initialise the component
 *
 * @returns {object} mountedComponent - Mounte
 */
const getComponentWithDiffProps = () => {
  if (!mountedComponent) {
    props = {
      response: {
        currentUser: {
          ...response.currentUser,
          isAuthenticated: true
        }
      },
      logout
    };
    mountedComponent = shallow(<Header {...props} />);
  }
  return mountedComponent;
};
describe('Event Component', () => {
  beforeAll(() => {
    wrapper = getComponent();
    authWrapper = getComponentWithDiffProps();
  });


  it('component successfully rendered', () => {
    expect(wrapper).toMatchSnapshot();
    expect(authWrapper).toMatchSnapshot();
  });

  it('testing navCLick function', () => {
    wrapper.setState({
      navClassName: 'navigator'
    });
    wrapper.instance().navCLick();
    expect(wrapper.state().navClassName).toEqual('navigator responsive');
    expect(wrapper.state().sideNavStyle).toEqual({ width: '250px' });
  });

  it('testing navCLick function', () => {
    wrapper.setState({
      navClassName: 'navigator responsive'
    });
    wrapper.instance().navCLick();
    expect(wrapper.state().navClassName).toEqual('navigator');
    expect(wrapper.state().sideNavStyle).toEqual({ width: '0px' });
  });

  it('testing close side nav function', () => {
    wrapper.instance().closeSideNav();
    expect(wrapper.state().navClassName).toEqual('navigator');
    expect(wrapper.state().sideNavStyle).toEqual({ width: '0px' });
  });

  it('testing logout function', () => {
    wrapper.instance().logOut();
    expect(status).toEqual('logged out');
  });
});

describe('Connected Component', () => {
  describe('Connected Events Component', () => {
    it('component successfully rendered', () => {
      const store = mockStore({
        response,
      });
      wrapper = shallow(<ConnectedHeader store={store} />);
      expect(wrapper.length).toBe(1);
    });
  });
});
