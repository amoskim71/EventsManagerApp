import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import debounce from 'throttle-debounce/debounce';
import PropTypes from 'prop-types';
import { Input, Icon } from 'react-materialize';
import Pagination from '../Reusables/Pagination';
import Loader from './../Loader/Loader';
import EventActions from '../../../actions/event.action';

import UpdateEventModal from '../modals/UpdateEvent';
// import DeleteEventModal from '../modals/DeleteEvent';

const eventAction = new EventActions();
window.jQuery = window.$ = jQuery;

/**
 *
 */
class Event extends Component {
  /**
   *@param {*} props
   */
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      searchNotfound: '',
      pageOfItems: [],
      // eventName: '',
      // startDate: '',
      // days: '',
      // centerId: '',
      selectedEvent: {},
      event_Id: undefined,
      loading: true
    };

    $(document).ready(() => {
      $('#newEvent').modal();
      $('#updateEvent').modal();
      $('#deleteEvent').modal();
    });

    this.handleSearch = this.handleSearch.bind(this);
    this.onChangePage = this.onChangePage.bind(this);
    this.triggerSearch = debounce(100, this.triggerSearch);
    this.handleOpen = this.handleOpen.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    // this.handleClose = this.handleClose.bind(this);
  }

  /**
   *@returns {*} fetches all events
   */
  componentDidMount() {
    const { getAll } = this.props;
    getAll();
  }

  /**
   * @param {*} nextProps
   * @returns {*} change state if new prop is recieved
   */
  componentWillReceiveProps(nextProps) {
    const { getAll } = this.props;
    if (nextProps.stateProps.events.data !== this.state.data
      && nextProps.stateProps.events.data) {
      this.setState({
        data: nextProps.stateProps.events.data
      }, () => {
        console.log(this.state.data);
        this.setState({
          loading: false
        }, () => {
          Materialize.toast('Syncronizing.....', 10000, 'blue');
        });
      });
    }

  }

  /**
   *
   * @param {*} pageOfItems
   * @returns {*} newPage
   */
  onChangePage(pageOfItems) {
    const { stateProps } = this.props;
    // update state with new page of items
    if (pageOfItems) {
      this.setState({ pageOfItems });
    } else {
      this.setState({ pageOfItems: stateProps });
      console.log('holla');
    }
  }

  /**
   *@param {*} event
  *@returns {*} updates state.search with search parameters
  */
  handleSearch(event) {
    clearTimeout(this.state.loadTimeOut);
    const { value } = event.target;
    const { stateProps } = this.props;
    this.triggerSearch(value, stateProps.events.data);
  }

  /**
   * @param {*} eventId
   * @returns {*} update event modal
   */
  handleOpen = (eventId) => {
    const { pageOfItems } = this.state;
    const event = pageOfItems.find(x => x.id === eventId);
    console.log(event);
    this.setState({
      selectedEvent: event
    }, () => {
      $('#updateEvent').modal('open');
    });
  };

  handleModalClose = () => {
    this.setState({
      loading: true
    }, () => {
      console.log('loading');
    });
  };

  /**
   * @param {*} eventId
   * @returns {*} update event modal
   */
  handleDelete = (eventId) => {
    const { event_Id } = this.state;
    this.setState({
      event_Id: eventId
    }, () => {
      $('#deleteEvent').modal('open');
    });
  };

  /**
   *
   * @param {*} value
   * @param {*} data
   * @returns {*} trrigers onchange of search input
   */
  triggerSearch(value, data) {
    const { stateProps } = this.props;
    if (value.length > 0) {
      const newItems = data.filter(item =>
        item.name.toLowerCase().includes(value.toLowerCase()));
      if (newItems.length > 0) {
        this.setState({
          data: newItems,
          searchNotfound: '',
        });
      } else {
        this.setState({ searchNotfound: 'no event matches this query' });
      }
    } else {
      this.setState({ data: stateProps.events.data });
    }
  }

  /**
   * @param {*} event
   * @returns {*} triggers when key is pressed
   */
  handleKeyDown(event) {
    if (event.keyCode === 13) {
      this.triggerSearch();
    }
  }


  /**
   * @returns {*} for modal control
  */
  handleClose() {
    // this.setState({ open: false });
  }


  /**
 *@returns {*} event for sortin
 */
  render() {
    const {
      data,
      searchNotfound,
      pageOfItems,
      loading,
      selectedEvent,
      // openUpdateModal
    } = this.state;
    return (
      <div>

        <div style={{
          backgroundColor: 'rgb(5, 22, 22)',
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          paddingBottom: '20px',
          overflow: 'auto'
        }}
        >
          <div className={['container', 'animated', 'bounceInRight'].join(' ')} style={{ paddingTop: '100px' }}>
            <div className={['row', 'event'].join(' ')} />
            <div className={['col', 's12', 'm8', 'l12'].join(' ')}>
              <div className={['card-panel', 'white'].join(' ')}>
                <div className="row">
                  <h4 className={['black-text', 'col', 's6'].join(' ')}>
                    Events
                    {loading === true && <Loader />}
                  </h4>
                  {!searchNotfound.length || <p className="red-text">{searchNotfound}</p>}
                  <Input
                    s={6}
                    type="text"
                    label="Search...."
                    validate
                    onChange={this.handleSearch}
                    onKeyDown={this.handleKeyDown}
                    ref={(searchField) => { this.node = searchField; }}
                  >
                    <Icon>search</Icon>
                  </Input>
                </div>
                <table className={['bordered', 'evented'].join(' ')}>
                  <thead>
                    <tr>
                      <th>Event Name</th>
                      <th>Event Center</th>
                      <th>Event Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      pageOfItems.map((item, index) => (
                        <tr key={item.id}>
                          <td>{item.name}</td>
                          <td>{item.State.statName}</td>
                          <td>
                            <a href="#updateEvent" className={['waves-effect', 'waves-light', 'btn'].join(' ')} style={{ marginLeft: '5px' }} onClick={() => this.handleOpen((item.id))} ><i className=" material-icons">create</i></a>
                            <a href="#deleteEvent" className={['waves-effect', 'waves-light', 'btn', 'red'].join(' ')} style={{ marginLeft: '5px' }} onClick={() => this.handleDelete((item.id))}><i className=" material-icons">delete</i></a>
                          </td>
                        </tr>))
                    }
                  </tbody>
                </table>
                <div className={['fixed-action-btn', 'click-to-toggle', 'spin-close'].join(' ')}>
                  <a className={['btn-floating', 'btn-large', 'waves-effect', 'waves-light'].join(' ')} onClick={() => { $('#createEvent').modal(); }} href="#newEvent">
                    <i className="material-icons">add</i>
                  </a>
                </div>
                <Pagination
                  items={
                    data
                  }
                  onChangePage={this.onChangePage}
                />
              </div>
            </div>
          </div>
        </div>
        <UpdateEventModal selectedEvent={selectedEvent} />
        {/* <DeleteEventModal eventId={this.state.event_Id} /> */}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  stateProps: {
    events: state.getAllEvents,
    states: state.getStates,
    newEvent: state.createEvent
  }
});

const mapDispatchToProps = dispatch => bindActionCreators({
  getAll: eventAction.getAll,
  // createEvent: eventAction.createEvent
}, dispatch);

Event.propTypes = {
  stateProps: PropTypes.objectOf(() => null),
  getAll: PropTypes.func.isRequired
};

Event.defaultProps = {
  stateProps: {}
};

export default connect(mapStateToProps, mapDispatchToProps)(Event);
