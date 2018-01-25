const initialState = {
  userCreation: {
    creating: false,
    created: false,
    failed: false,
    user: null,
    error: null
  },
  userAuthentication: {
    authenticating: false,
    authenticated: false,
    failed: false,
    user: null,
    error: null
  },
  userVerification: {
    verifying: false,
    verified: false,
    failed: false,
    data: null,
    error: null
  },

  center: {
    requesting: false,
    success: false,
    failed: false,
    requestType: '',
    data: null,
    error: null
  },

  event: {
    requesting: false,
    success: false,
    failed: false,
    requestType: '',
    data: null,
    error: null
  }
};

export default initialState;
