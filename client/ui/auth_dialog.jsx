'use strict';
/*jshint maxerr:10000*/
/*global React, bootstrap*/

var Modal = bootstrap.Modal,
    Button = bootstrap.Button,
    Input = bootstrap.Input,
    TabPane = bootstrap.TabPane,
    TabbedArea = bootstrap.TabbedArea,
    ButtonGroup = bootstrap.ButtonGroup;

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
            <Button>
              <i className="fa fa-facebook"></i>
              <span>&nbsp;Facebook</span>
            </Button>
            <Button>
              <i className="fa fa-google-plus"></i>
              <span>&nbsp;Google</span>
            </Button>
            <Button>
              <i className="fa fa-instagram"></i>
              <span>&nbsp;Instagram</span>
            </Button>
            <Button>
              <i className="fa fa-tumblr"></i>
              <span>&nbsp;Tumblr</span>
            </Button>
            <Button bsStyle="primary">Log In</Button>
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
          <Button bsStyle="primary">Sign Up</Button>
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
