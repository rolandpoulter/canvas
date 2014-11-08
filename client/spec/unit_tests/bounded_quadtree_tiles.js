'use strict';
require('../lib/bootstrap.lib.js');

/*global describe, it, before, beforeEach, afterEach, after*/
/*global Grid, Point, Quadtree, Rect, SpatialHash, Tiles*/

describe('Bounded Quadtree Tiles:', function () {
  before(function () {
    this.bounds = new Point(0.0, 0.0).toRectFromCenter(0.01);
    this.tiles = new Tiles({
      scale: 0.5,
      collect: true,
      unique: true
    });
  });

  after(function () {});

  describe('Intersection:', function () {
    it('Should intersect.', function () {
      var a = new Point(0, 0).toRectFromCenter(0.5),
          b = new Point(0, 0).toRectFromCenter(1);
      return a.intersectsRect(b).should.be.ok;
    });

    it('Should not intersect.', function () {
      var a = new Point(20, 20).toRectFromCenter(0.5),
          b = new Point(0, 0).toRectFromCenter(1);
      return a.intersectsRect(b).should.not.be.ok;
    });
  });

  withSamples('A', {
    a1: new Rect(-0.1, 0.1, 0.1, -0.1),
    a2: new Point(0.02, -0.001).toRectFromCenter(0.001),
    a3: new Point(0.02, -0.001).toRectFromTopLeft(0.001),
    a4: new Point(0.02, -0.001).toRectFromBottomRight(0.001)
  }, function () {
    before(function () {
      global.window = {};
      global.window.innerHeight = 100;
      global.window.innerWidth = 100;
    });

    it('Should have "4" samples.', function () {
      return this.tiles.collection.length.should.equal(4);
    });

    it('Filling', function () {
      this.tiles.setViewBounds(this.bounds, 0.1, 0.01);
      var filled = this.tiles.update();
      return filled.length.should.be.ok;
    });

    // it('Culling', function () {
    //   this.tiles.update(this.bounds, 0.1, 0.01);
    //   var culled =
    //     this.tiles.cullView(new Point(0.01, 0.01)
    //       .toRectFromCenter(0.0001));
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
