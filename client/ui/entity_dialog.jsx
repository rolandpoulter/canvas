'use strict';
/*jshint maxerr:10000*/
/*global React, bootstrap*/

var Modal = bootstrap.Modal,
    Button = bootstrap.Button,
    Input = bootstrap.Input,
    TabPane = bootstrap.TabPane,
    TabbedArea = bootstrap.TabbedArea,
    ButtonGroup = bootstrap.ButtonGroup,
    NumberPicker = window.widgets.NumberPicker;

module.exports =
global.AuthDialog = React.createClass({
  mixins: [bootstrap.OverlayMixin],

  getDefaultProps: function () {
    return {
      action: 'New'
    };
  },

  getInitialState: function () {
    return {
      isModalOpen: false,
      entity: {},
      style: {}
    };
  },

  toggle: function () {
    this.setState({isModalOpen: !this.state.isModalOpen});
  },

  render: function () {
    /*jshint white:false*/

    var metaPlaceholder = JSON.stringify({url: '//localhost/img/wall.io.svg'});

    this.metaInput = <Input
      ref="meta"
      type="textarea"
      value={this.state.entity.meta}
      label="Meta:"
      placeholder={metaPlaceholder}/>;

    this.nameInput = <Input
      ref="name"
      type="text"
      value={this.state.entity.name}
      label="Name:"
      placeholder="Pretty picture!"/>;

    this.typeInput = <Input
      ref="meta"
      type="text"
      value={this.state.entity.type}
      label="Type:"
      placeholder="photo"/>;

    var shapePlaceholder = JSON.stringify({
      type: 'Polygon',
      coordinates: [[-1, 1], [1, -1]]
    });

    this.shapeInput = <Input
      ref="meta"
      type="textarea"
      value={this.state.entity.shape}
      label="Shape:"
      placeholder={shapePlaceholder}/>;

    this.layerInput = <NumberPicker
      ref="layer"
      value={this.state.entity.layer}
      min={-100}
      max={100}/>;

    this.scaleInput = <NumberPicker
      ref="scale"
      value={this.state.entity.scale}
      format="n"
      step={0.1}
      min={-100}
      max={100}/>;

    this.hiddenInput = <Input
      ref="hidden"
      type="checkbox"
      label="Hidden:"
      checked={this.state.entity.hidden}/>;

    return (
      <Button bsStyle="default"
              onClick={this.toggle}>{this.props.action} Entity</Button>
    );
    /*jshint white:true*/
  },

  renderOverlay: function () {
    /*jshint white:false, nonbsp:false*/
    if (!this.state.isModalOpen) {
      return <span/>;
    }

    var title = this.props.action + ' Entity';

    return (
      <Modal title={title}
             className="entity-dialog"
             backdrop={true}
             animation={true}
             onRequestHide={this.toggle}>
        <div className="modal-body">
          <form>
            {this.metaInput}
            {this.nameInput}
            {this.typeInput}
            {this.shapeInput}
            <div className="form-group">
              <label className="control-label"><span>Layer:</span></label>
              {this.layerInput}
            </div>
            <div className="form-group">
              <label className="control-label"><span>Scale:</span></label>
              {this.scaleInput}
            </div>
            {this.hiddenInput}
          </form>
        </div>
        <div className="modal-footer">
          <Button bsStyle="primary">Save Entity</Button>
        </div>
      </Modal>
    );
  }
});
