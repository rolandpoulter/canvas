'use strict';
/*jshint maxerr:10000*/
/*global React, bootstrap, ApiRequest*/

require('./lib/ApiRequest.js');

var Modal = bootstrap.Modal,
    Button = bootstrap.Button,
    Input = bootstrap.Input,
    Tooltip = bootstrap.Tooltip,
    TabPane = bootstrap.TabPane,
    TabbedArea = bootstrap.TabbedArea,
    ButtonGroup = bootstrap.ButtonGroup,
    OverlayTrigger = bootstrap.OverlayTrigger;

module.exports =
global.AuthDialog = React.createClass({
  mixins: [bootstrap.OverlayMixin],

  getDefaultProps: function () {
    return {};
  },

  getInitialState: function () {
    return {
      isModalOpen: false,
      session: app.session,
      style: {}
    };
  },

  toggle: function () {
    this.setState({isModalOpen: !this.state.isModalOpen});
  },

  validateUserEmail: function () {},
  validatePassword: function () {},
  validateConfirmPassword: function () {},

  onUserEmailChange: function () {},
  onPasswordChange: function () {},
  onConfirmPasswordChange: function () {},

  // onDropboxLogIn: function () {
  //   new ApiRequest('/', function (err, event, apiRequest) {});
  // },

  onFacebookLogIn: function () {
    // new ApiRequest('/', function (err, event, apiRequest) {});
  },

  onGoogleLogIn: function () {
    window.location = '//' + window.location.host + '/auth/google';
  },

  // onInstagramLogIn: function () {
  //   new ApiRequest('/', function (err, event, apiRequest) {});
  // },

  onTwitterLogIn: function () {
    // new ApiRequest('/', function (err, event, apiRequest) {});
  },

  // onTumblrLogIn: function () {
  //   new ApiRequest('/', function (err, event, apiRequest) {});
  // },

  // onVineLogInLogIn: function () {
  //   new ApiRequest('/', function (err, event, apiRequest) {});
  // },

  onLogIn: function () {
    // new ApiRequest('/', function (err, event, apiRequest) {});
  },

  onSignUp: function () {
    // new ApiRequest({
    //   method: 'POST', url: '/',
    //   callback: function () {}});
  },

  render: function () {
    /*jshint white:false*/
    this.userEmailInput = <Input
      ref="userEmail"
      type="text"
      value={this.state.userName}
      label="E-mail Address:"
      help=""
      bsStyle={this.validateUserEmail()}
      onChange={this.onUserEmailChange}
      placeholder="wolfgang@mail.org"
      hasFeedback
      groupClassName="group-class"
      wrapperClassName="wrapper-class"
      labelClassName="label-class"/>;

    this.passwordInput = <Input
      ref="password"
      type="password"
      value={this.state.password}
      label="Password:"
      help=""
      bsStyle={this.validatePassword()}
      onChange={this.onPasswordChange}
      placeholder="secret"
      hasFeedback
      groupClassName="group-class"
      wrapperClassName="wrapper-class"
      labelClassName="label-class"/>;

    this.confirmPasswordInput = <Input
      ref="configPassword"
      type="password"
      value={this.state.password}
      label="Confirm Password:"
      help=""
      bsStyle={this.validateConfirmPassword()}
      onChange={this.onConfirmPasswordChange}
      placeholder="secret"
      hasFeedback
      groupClassName="group-class"
      wrapperClassName="wrapper-class"
      labelClassName="label-class"/>;

    return (
      <Button bsStyle="primary"
              onClick={this.toggle}>Auth</Button>
    );
    /*jshint white:true*/
  },

  renderOverlay: function () {
    /*jshint white:false, nonbsp:false*/
    if (!this.state.isModalOpen) {
      return <span/>;
    }

    var logInPane =
      <TabPane eventKey={0}
               tab="Log In">
        <form>
          {this.userEmailInput}
          {this.passwordInput}
        </form>
        <div className="modal-footer">
          <ButtonGroup>
            <Button onClick={this.onDropboxLogIn}
                    disabled={true}>
              <OverlayTrigger placement="top"
                              overlay={<Tooltip>Dropbox</Tooltip>}>
                <i className="fa fa-dropbox"></i>
              </OverlayTrigger>
            </Button>
            <Button onClick={this.onFacebookLogIn}
                    disabled={true}>
              <OverlayTrigger placement="top"
                              overlay={<Tooltip>Facebook</Tooltip>}>
                <i className="fa fa-facebook"></i>
              </OverlayTrigger>
            </Button>
            <Button onClick={this.onGoogleLogIn}>
              <OverlayTrigger placement="top"
                              overlay={<Tooltip>Google</Tooltip>}>
                <i className="fa fa-google-plus"></i>
              </OverlayTrigger>
            </Button>
            <Button onClick={this.onInstagramLogIn}
                    disabled={true}>
              <OverlayTrigger placement="top"
                              overlay={<Tooltip>Instagram</Tooltip>}>
                <i className="fa fa-instagram"></i>
              </OverlayTrigger>
            </Button>
            <Button onClick={this.onTumblrLogIn}
                    disabled={true}>
              <OverlayTrigger placement="top"
                              overlay={<Tooltip>Tumblr</Tooltip>}>
                <i className="fa fa-tumblr"></i>
              </OverlayTrigger>
            </Button>
            <Button onClick={this.onTwitterLogIn}
                    disabled={true}>
              <OverlayTrigger placement="top"
                              overlay={<Tooltip>Twitter</Tooltip>}>
                <i className="fa fa-twitter"></i>
              </OverlayTrigger>
            </Button>
            <Button disabled={true}>
              <OverlayTrigger placement="top"
                              overlay={<Tooltip>Vine</Tooltip>}>
                <i className="fa fa-vine"></i>
              </OverlayTrigger>
            </Button>
            <Button bsStyle="primary"
                    onClick={this.onLogIn}>Log In</Button>
          </ButtonGroup>
        </div>
      </TabPane>;

    var signUpPane =
      <TabPane eventKey={1}
               tab="Sign Up">
        <form>
          {this.userEmailInput}
          {this.passwordInput}
          {this.confirmPasswordInput}
        </form>
        <div className="modal-footer">
          <Button bsStyle="primary"
                  onClick={this.onSignUp}>Sign Up</Button>
        </div>
      </TabPane>;

    return (
      <Modal className="auth-dialog"
             backdrop={true}
             animation={true}
             onRequestHide={this.toggle}>
        <div className="modal-body">
          <Button className="close"
                  onClick={this.toggle}>x</Button>
          <TabbedArea defaultActiveKey={0}
                      animation={true}>
            {logInPane}
            {signUpPane}
          </TabbedArea>
        </div>
      </Modal>
    );
  }
});
