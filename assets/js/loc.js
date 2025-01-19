function getRefDeg(pxover) {
  //imgwid = document.getElementById("scream").naturalWidth;
  imgwid = images[imageCount].natWid;
  return images[imageCount].fov / (imgwid / pxover);
}

function normDeg(deg) {
  return (deg % 360 + 360) % 360;
}

function findAngle(xPx) {
        bearingPx = 0.0;
        bearingDeg = 0.0;
        bearingCnter = 0.0;
        for(i = 0; i < images[imageCount].points.length; i++)
        {
                if(typeof images[imageCount].points[i] !== "undefined" && images[imageCount].points[i].bearing != undefined)
                {
                        bearingCnter++;
                        bearingPx += parseFloat(images[imageCount].points[i].imgXCoord);
                        bearingDeg += parseFloat(images[imageCount].points[i].bearing);
                }
        }
	console.log("BearingDeg: " + bearingDeg);
        bearingPx /= bearingCnter;
        bearingDeg /= bearingCnter;

	console.log("Final Angle: " + normDeg( ( (getRefDeg(xPx)) - getRefDeg(bearingPx) ) + bearingDeg + 180) + "\n\n");
	return normDeg( ( (getRefDeg(xPx)) - getRefDeg(bearingPx) ) + bearingDeg + 180);
}
