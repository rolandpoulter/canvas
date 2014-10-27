'use strict';

require('./Rect.js');

module.exports = global.Quadtree = Quadtree;

/**
 * Quadtree Constructor
 * @param Rect bounds
 * @param Integer max_objects (optional, default: 10)
 *        Max objects a node can hold before splitting into 4 subnodes
 * @param Integer max_levels (optional, default: 4)
 *        Total max levels inside root Quadtree
 * @param Integer level (optional)
 *        Depth level, required for subnodes.
 */
function Quadtree(rect, level, max_objects, max_levels) {
  this.max_objects = max_objects || 10;
  this.max_levels  = max_levels || 4;
  this.objects = [];
  this.nodes   = [null, null, null, null];
  this.level = level || 0;
  this.rect  = rect;
}


/*
 * Split the node into 4 subnodes.
 */
Quadtree.prototype.split = function () {
  var Rect = global.Rect,
      mO = this.max_objects,
      mL = this.max_levels,
      L = this.level + 1, // next level
      w = this.rect.getWidth(),
      h = this.rect.getHeight(),
      W = w / 2, // sub width
      H = h / 2, // sub height
      x = this.rect.left,
      y = this.rect.top,
      X = this.rect.right,
      Y = this.rect.bottom;

  // top right node
  this.nodes[0] = new Quadtree(new Rect(x + W, y, X, y + H), L, mO, mL);

  // top left node
  this.nodes[1] = new Quadtree(new Rect(x, y, x + W, y + H), L, mO, mL);

  // bottom left node
  this.nodes[2] = new Quadtree(new Rect(x, y + H, x + W, Y), L, mO, mL);

  // bottom right node
  this.nodes[3] = new Quadtree(new Rect(x + W, y + H, X, Y), L, mO, mL);
};


/*
 * Determine which node the object belongs to.
 * @param Rect object bounds
 * @return Integerindex of the subnode (0-3),
 *         or -1 if pRect cannot completely fit within
 *         a subnode and is part of the parent node
 */
Quadtree.prototype.getIndex = function (rect) {
  var index = -1,
      center = this.rect.getCenter(),
      verticalMidpoint = center.x,
      horizontalMidpoint = center.y,
      // rect can completely fit within the top quadrants
      topQuadrant = (rect.top < horizontalMidpoint &&
                     rect.bottom < horizontalMidpoint),
      // rect can completely fit within the bottom quadrants
      bottomQuadrant = (rect.top > horizontalMidpoint);

  // rect can completely fit within the left quadrants
  if (rect.left < verticalMidpoint && rect.right < verticalMidpoint) {
    if (topQuadrant)
      index = 1;

    else if (bottomQuadrant)
      index = 2;
  }

  // rect can completely fit within the right quadrants
  else if (rect.left > verticalMidpoint) {
    if (topQuadrant)
      index = 0;

    else if (bottomQuadrant)
      index = 3;
  }

  return index;
};


/*
 * Insert the object into the node. If the node
 * exceeds the capacity, it will split and add all
 * objects to their corresponding subnodes.
 * @param Rect
 *        bounds of the object to be added, with x, y, width, height
 */
Quadtree.prototype.insert = function (rect, ref) {
  /*jshint maxstatements:15*/
  var i = 0,
      index;

  // if we have subnodes...
  if (this.nodes[0]) {
    index = this.getIndex(rect);

    if (index !== -1) {
      this.nodes[index].insert(rect);
      return;
    }
  }

  if (ref) rect.setRef(ref);

  this.objects.push(rect);

  if (this.objects.length > this.max_objects && this.level < this.max_levels) {
    // split if we don't already have subnodes
    if (!this.nodes[0]) this.split();

    //add all objects to there corresponding subnodes
    while (i < this.objects.length) {
      index = this.getIndex(this.objects[i]);

      if (index !== -1)
        this.nodes[index].insert(
          this.objects.splice(i, 1)[0]);

      else
        i = i + 1;
    }
  }
};


/*
 * Return all objects that could collide with the given object
 * @param Rect
 *        bounds of the object to be checked, with x, y, width, height
 * @Return Array with all detected objects
 */
Quadtree.prototype.retrieve = function (rect) {
  var index = this.getIndex(rect),
      objects = this.objects,
      i = 0;

  // if we have subnodes...
  if (this.nodes[0]) {

    // if rect fits into a subnode...
    if (index !== -1)
      objects = objects.concat(
        this.nodes[index].retrieve(rect));

    //if pRect does not fit into a subnode, check it against all subnodes
    else
      for (; i < this.nodes.length; i += 1)
        objects = objects.concat(
          this.nodes[i].retrieve(rect));
  }

  return objects;
};


/*
 * Clear the quadtree
 */
Quadtree.prototype.clear = function () {
  this.objects = [];

  var i = 0;

  for (; i < this.nodes.length; i += 1)
    if (this.nodes[i]) {
      this.nodes[i].clear();
      this.nodes[i] = null;
    }
};
