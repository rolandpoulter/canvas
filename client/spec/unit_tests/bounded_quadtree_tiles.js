'use strict';
require('../lib/bootstrap.lib.js');

/*global describe, it, before, beforeEach, afterEach, after*/
/*global Grid, Point, Quadtree, Rect, SpatialHash, Tiles*/

describe('Bounded Quadtree Tiles:', function () {
  before(function () {
    this.bounds = new Point().toRectFromCenter(0.01);
    this.tiles = new Tiles({
      scale: 0.5,
      collect: true,
      unique: true
    });
  });

  after(function () {});

  withSamples('A', {
    a1: new Rect(-0.1, 0.1, 0.1, -0.1),
    a2: new Point(0.02, -0.001).toRectFromCenter(0.001),
    a3: new Point(0.02, -0.001).toRectFromTopLeft(0.001),
    a4: new Point(0.02, -0.001).toRectFromBottomRight(0.001)
  }, function () {
    it('Should have "4" samples.', function () {
      return this.tiles.collection.length.should.equal(4);
    });

    it('Filling', function () {
      var filled = this.tiles.fillView(this.bounds, 1, 1);
      return filled.length.should.be.ok;
    });

    // it('Culling', function () {
    //   var filled = this.tiles.fillView(this.bounds, 1, 1),
    //       culled = this.tiles.cullView(
    //         filled, new Point().toRectFromCenter(0.005), 1);
    //   return culled.length.should.be.ok;
    // });
  });

  withSamples('B', {
    b1: new Rect(-0.1, 0.1, 0.1, -0.1),
    b2: new Point(0.02, -0.001).toRectFromCenter(0.001),
    b3: new Point(0.02, -0.001).toRectFromTopLeft(0.001)
  }, function () {
    it('Should have "3" samples.', function () {
      return this.tiles.collection.length.should.equal(3);
    });
  });

  withSamples('C', {
    c1: new Rect(-0.1, 0.1, 0.1, -0.1),
    c2: new Point(0.02, -0.001).toRectFromCenter(0.001)
  }, function () {
    it('Should have "2" samples.', function () {
      return this.tiles.collection.length.should.equal(2);
    });
  });

  function withSamples(name, samples, specificSampleAssertions) {
    var refs = Object.keys(samples),
        count = refs.length;

    describe('With "' + name + '" Sample Set: ', function () {
      beforeEach(function () {
        refs.forEach(function (ref) {
          var rect = samples[ref];
          this.tiles.insert(rect, ref);
        }.bind(this));
      });

      afterEach(function () {
        this.tiles.clear();
      });

      it('Should have "' + count + '" samples.', function () {
        return this.tiles.collection.length.should.equal(count);
      });

      specificSampleAssertions(samples, refs, count);
    });
  }
});