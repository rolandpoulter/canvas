'use strict';
/*jshint maxerr:10000*/
/*global React, bootstrap, widgets*/

var Point = require('./lib/Point.js');

var Modal = bootstrap.Modal,
    Button = bootstrap.Button,
    Input = bootstrap.Input,
    Multiselect = widgets.Multiselect,
    NumberPicker = widgets.NumberPicker;

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
      entity: {
        // meta: {
        //   url: '//localhost/img/wall.io.svg',
        //   layer: 0,
        //   scale: 0
        // },
        // name: 'Wall.IO',
        // type: ['SVG'],
        // shape: {
        //   type: 'Polygon',
        //   coordinates: [[-125, 125], [125, -125]]
        // },
        // private: true
        // position: {x: -125, y: 125}
      },
      style: {}
    };
  },

  saveEntity: function () {
    console.log(this);
    var position = new Point(-125, 125),
        shape = position.toRectFromTopLeft(512, 512);
    var entity = {
      meta: {url: '//localhost/img/wall.io.svg'},
      name: 'Wall.IO',
      type: ['SVG'],
      shape: shape.toGeoJSON(),
      layer: 0,
      scale: 0,
      private: true,
      position: position
    };
    app.setEntity(null, entity, function (err, entity) {
      console.log(err, entity);
    });
  },

  toggle: function () {
    this.setState({isModalOpen: !this.state.isModalOpen});
  },

  render: function () {
    /*jshint white:false, maxstatements:12*/

    var metaPlaceholder = JSON.stringify({url: '//localhost/img/picture.png'});

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

    var typeList = [
      {label: 'Audio', id: 'audio'}, // <audio> tag
      {label: 'Calendar', id: 'calendar'}, // show entities using a calendar
      {label: 'Canvas', id: 'canvas'}, // canvas painting
      {label: 'Chart', id: 'chart'}, // d3 charts
      {label: 'Collada', id: 'collada'}, // 3d collada objects
      {label: 'Document', id: 'document'},
      {label: 'Event', id: 'event'},
      {label: 'File', id: 'file'},
      {label: 'Graph', id: 'graph'}, // graph of entities
      {label: 'Group', id: 'group'}, // group of entities
      {label: 'Instance', id: 'instance'},
      {label: 'Interface', id: 'interface'},
      {label: 'Link', id: 'link'}, // uri link
      {label: 'Mail', id: 'mail'},
      {label: 'Notes', id: 'notes'}, // note cards
      {label: 'Photo', id: 'photo'}, // <img> tag
      {label: 'Pin', id: 'pin'}, // point of reference to other entities
      {label: 'Presentation', id: 'presentation'},
      {label: 'Project', id: 'project'},
      {label: 'Script', id: 'script'},
      {label: 'Shape', id: 'shape'}, // basic svg shapes
      {label: 'Slieshow', id: 'slideshow'},
      {label: 'Spreadsheet', id: 'spreadsheet'},
      {label: 'SVG', id: 'svg'}, // complex svg files
      {label: 'Template', id: 'template'},
      {label: 'Text', id: 'text'},
      {label: 'Timeline', id: 'timeline'}, // show entities in time line
      {label: 'Video', id: 'video'}, // <video> tag
      {label: 'Wall', id: 'wall'}, // inception of walls
      {label: 'Whiteboard', id: 'whiteboard'},
      {label: 'Yarn', id: 'yarn'}
    ];

    this.typeInput = <Multiselect
      ref="type"
      data={typeList}
      value={this.state.entity.type}
      onChange={this.onTypeChange}
      textField='label'
      valueField='id'
      placeholder="Photo"/>;

    var shapePlaceholder = JSON.stringify({
      type: 'Polygon',
      coordinates: [[-1, 1], [1, -1]]
    });

    this.shapeInput = <Input
      ref="shape"
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

    this.privateInput = <Input
      ref="private"
      type="checkbox"
      label="private:"
      checked={this.state.entity.private}/>;

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
            <div className="form-group">
              <label className="control-label"><span>Type:</span></label>
              {this.typeInput}
            </div>
            {this.shapeInput}
            <div className="form-group">
              <label className="control-label"><span>Layer:</span></label>
              {this.layerInput}
            </div>
            <div className="form-group">
              <label className="control-label"><span>Scale:</span></label>
              {this.scaleInput}
            </div>
            {this.privateInput}
          </form>
        </div>
        <div className="modal-footer">
          <Button bsStyle="primary"
                  onClick={this.saveEntity}>Save Entity</Button>
        </div>
      </Modal>
    );
  }
});
