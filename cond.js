function Point(name, mapCoords, imgXCoord, bearing, natWid) {
  this.name = name;
  this.mapCoords = null;
  this.imgXCoord = null;
  this.bearing = undefined;
  this.natWid = null;
}
function ImgObj (name, url, points, bearings, fov) {
        this.name = name;
        this.url = url;
        this.points = [];
        this.bearings = [];
        this.fov = fov;
}

