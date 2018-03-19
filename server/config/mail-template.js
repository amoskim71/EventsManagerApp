const messageBody = {
  accountCreated: (username, token) => {
    const body = `<p>Welcome ${username}.</p><br/><p>Click the link below to complete your registration</p><br />
                  <a href="http://event-manager-andela.herokuapp.com/verified?token=${token}">Complete Registration</a><br/>`;
    return body;
  },
  eventCreated: (username) => {
    const body = `<p>Well done ${username}.</p><br/><p>You have successfully created an event.<br />You would get a response shortly from the event center
                </p>Thank you for using EventsManager`;
    return body;
  },

  eventApproved: (username, centerName, startDate) => {
    const body = `<p>Hello ${username}</p><br/>
                <p> This is to inform you that your event in ${centerName}, scheduled for ${startDate} has been accepted by the center<br />
                  You can now proceed with you planning.<br/>Do ensure to visit the center for more informations
                </p>Thank you for using EventsManager`;

    return body;
  },

  eventRejected: (username, centerName, startDate, newDate) => {
    const body = `<p>Hello ${username}</p><br/>
              <p> Unfortunately your event in ${centerName}, scheduled for ${startDate} has been cancelled by the center.<br />
              However, The center would like you to reschedule your event<br/>
              </p> Thank you for using EventsManager`;
    return body;
  }
};

export default messageBody;