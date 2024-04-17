//Re-used Elements
newImageButton = document.getElementById('newimg-button');
imageSelector = document.getElementById("image-selector");
image = document.getElementById("scream");
imageCanvas = document.getElementById("canvas");

function updateImage() {
	//alert("Image Updated");
        if(images[imageSelected].url == undefined)
        {
        	document.getElementById("scream").src = "20230326_180945.jpg";
        }
        else
        {
                document.getElementById("scream").src = images[imageSelected].url;
        }
	document.getElementById("scream").onload = function() {
	        document.getElementById("canvas").width = document.getElementById("scream").naturalWidth;
		images[imageSelected].natWid = document.getElementById("scream").naturalWidth;
	        document.getElementById("canvas").height = document.getElementById("scream").naturalHeight;
		ctx.drawImage(img, 0, 0);
		updateCanvasPoints();
	}
}

function setupImage() {
	document.getElementById('sidebar-element-container').innerHTML = "";
	imageSelected = document.getElementById('image-selector').value;
        pointSelected = undefined;

        document.getElementById('image-name-field').value = images[imageSelected].name;
	//if(images[imageSelected].url != undefined)
	//{
		document.getElementById('url-field').value = images[imageSelected].url;
        //}
	document.getElementById('fov-field').value = images[imageSelected].fov;
}

function setupPoint(pointNum) {
	//Create Element
	pointcontainer = document.createElement('div');
	pointcontainer.append(document.getElementById("sidebar-element-template").content.cloneNode(true));
	pointcontainer.setAttribute("id", "point" + pointNum);
	document.getElementById("sidebar-element-container").append(pointcontainer)

	//Give Element Values

	var point = document.getElementById("point" + pointNum);

	//Title
	point.querySelector('[class^=point-title]').innerHTML = images[imageSelected].points[pointNum].name;

	//Image X Coord
	point.querySelector(".xcoordField").value = images[imageSelected].points[pointNum].imgXCoord;
	point.querySelector(".xcoordField").onchange = function() {
		images[imageSelected].points[pointNum].imgXCoord = point.querySelector(".xcoordField").value;
		rePoints();
	}

	//Select Point
	point.querySelector('[class^=selectImgXCoord-button]').setAttribute("id", "selectXcoord" + pointNum);
	document.getElementById("selectXcoord" + pointNum).onclick = function() {
		for (let element of document.querySelectorAll('[class^=sidebar-element-table]'))
		{
			element.style.backgroundColor = "#6991fd";
		}
        	pointSelected = pointNum;
		point.querySelector('[class^=sidebar-element-table]').style.backgroundColor = "#fd7567";
		rePoints();
		updateCanvasPoints();
        }

	//Bearing Selector


	document.getElementById("point" + pointNum).querySelector('[class^=bearing-selector').setAttribute("id", "bearing" + pointNum);
	document.getElementById("bearing" + pointNum).onchange = function() {
		if(document.getElementById("bearing" + pointNum).checked)
		{
			document.getElementById("point" + pointNum).querySelector('[class^=bFieldContainer').style.display = "";
		}
		else
		{
			document.getElementById("point" + pointNum).querySelector('[class^=bFieldContainer').style.display = "none";
			document.getElementById("bearingField" + pointNum).value = undefined;
			images[imageSelected].points[pointNum].bearing = undefined;
			rePoints();
		}
	}

	//Bearing Field
	document.getElementById("point" + pointNum).querySelector('[class^=bearingField').setAttribute("id", "bearingField" + pointNum);
	document.getElementById("bearingField" + pointNum).value = images[imageSelected].points[pointNum].bearing;
	document.getElementById("bearingField" + pointNum).onchange = function() {
		images[imageSelected].points[pointNum].bearing = document.getElementById("bearingField" + pointNum).value;
		rePoints();
	}

	if(images[imageSelected].points[pointNum].bearing != undefined)
	{
		document.getElementById("point" + pointNum).querySelector('[class^=bFieldContainer').style.display = "";
		document.getElementById("bearingField" + pointNum).value = images[imageSelected].points[pointNum].bearing;
		document.getElementById("bearing" + pointNum).checked = true;
	}

	//Remove Point
	point.querySelector('[class^=removepoint-button]').setAttribute("id", "close" + pointNum);
	document.getElementById("close" + pointNum).onclick = function() {
	        if(confirm("Are you sure you want to remove \'" + images[imageSelected].points[pointNum].name + "\' ?")) {
	                document.getElementById("point" + pointNum).remove();
	                images[imageSelected].points[pointNum] = undefined;
			rePoints();
	        }
	}
}

function displayPoints(img)
{
	for(i = 0; i < images[img].points.length; i++)
	{
		if (images[img].points[i] != undefined)
		{
			setupPoint(i);
		}
	}
}

//Create and Change Images Manually

newImageButton.onclick = function() {
	imageNum = 0;
	while(images[imageNum] != undefined)
	{
		imageNum++;
	}
        images[imageNum] = new ImgObj;

        images[imageNum].name = "Image #" + (imageNum + 1);
	imageSelector.options.add(new Option(images[imageNum].name, imageNum));

        document.getElementById("imageManip").style.display = "initial";
        imageSelector.value = imageNum;

	setupImage();
	updateImage();
	rePoints();
}

document.getElementById('image-selector').onchange = function() {
	setupImage();
	updateImage();
	//Display Points
	displayPoints(imageSelected);
	rePoints();
}

document.getElementById("enlarge-btn").onclick = function() {
	document.getElementById("overlayimg").src = document.getElementById("scream").src;
	document.getElementById("enlarged-overlay").style.display = "initial";
	c = document.getElementById("overlaycanvas");
	img = document.getElementById("overlayimg");
	document.documentElement.style.setProperty("--overlay-box-height", img.naturalHeight);
	document.documentElement.style.setProperty("--overlay-box-width", img.naturalWidth);
	c.height = img.naturalHeight;
	c.width = img.naturalWidth;
	ctx = c.getContext("2d");
	ctx.drawImage(img, 0, 0);
	ctx.stroke();
	image = c;
	updateCanvasPoints();

	image.onmousemove = () => {
                if(images[imageSelected].url != undefined)
                {
                        //document.getElementsByTagName("body")[0].style.cursor = "url('google.cur'), auto";
                        ctx.drawImage(img, 0, 0);
                        x = ((event.pageX - document.getElementById("eo-box").offsetLeft)/image.clientWidth) * document.getElementById("overlayimg").naturalWidth;
                        ctx.beginPath();
                                drawLine(x, "#00ff00");
                                drawLine(x + 1, "#00ff00");
                                drawLine(x - 1, "#00ff00");
                        ctx.closePath();
                        updateCanvasPoints();
                }
	}
	image.onclick = () => {
                if(images[imageSelected].url != undefined && pointSelected != undefined){
	                //alert("X Coordinate: " + x);
	                images[imageSelected].points[pointSelected].imgXCoord = x;
	                document.getElementById("point" + pointSelected).querySelector(".xcoordField").value = images[imageSelected].points[pointSelected].imgXCoord;
	                //drawLine(x, "rgb(253, 117, 103)");
	                rePoints();

			document.getElementById("enlarged-overlay").style.display = "none";
		        c = document.getElementById("canvas");
		        ctx = c.getContext("2d");
		        img = document.getElementById("scream");
		        image = c;
		        ctx.drawImage(img, 0, 0);
		        updateCanvasPoints();
		        ctx.stroke();
        	}
	}
}
document.getElementById("overlay-bg").onclick = function() {
	document.getElementById("enlarged-overlay").style.display = "none";
	c = document.getElementById("canvas");
	ctx = c.getContext("2d");
	img = document.getElementById("scream");
	image = c;
	ctx.drawImage(img, 0, 0);
	updateCanvasPoints();
	ctx.stroke();
}

//Remove Image
document.getElementById('image-remove-button').onclick = function() {
	if(confirm("Are you sure you want to remove \'" + images[imageSelected].name + "\' ?"))
	{
 		i = 0;
		while(imageSelected != document.getElementById("image-selector")[i].value && i < images.length)
		{
			i++
		}
		document.getElementById("image-selector").remove(i);
		images[imageSelected] = undefined;

		for(imageSelected = 0; imageSelected < images.length; imageSelected++)
		{
			if(typeof images[imageSelected] !== "undefined")
			{
				imageSelector.value = imageSelected;
				setupImage();
        			updateImage();
				displayPoints(imageSelected);
				rePoints();
				return 0;
			}
		}
		images = [];
		rePoints();
                document.getElementById("imageManip").style.display = "none";
	}
}


//Change Image Properties

document.getElementById("image-name-field").onchange = () => {
        images[imageSelected].name = document.getElementById('image-name-field').value;
        document.getElementById("image-selector")[imageSelected].innerHTML = images[imageSelected].name;
}

function updateImagehelper()
{
	updateImage();
}

document.getElementById("fov-field").onchange = () => {
        images[imageSelected].fov = document.getElementById("fov-field").value;
	rePoints();
}

document.getElementById("url-field").onchange = () => {
        images[imageSelected].url = document.getElementById("url-field").value;
	updateImage();
}


//Create Points Manually

document.getElementById('newpoint-button').onclick = function() {
	var pointNum = 0;
	while(images[imageSelected].points[pointNum] != undefined)
	{
		pointNum++;
	}
	images[imageSelected].points[pointNum] = new Point;
	images[imageSelected].points[pointNum].name = "Point #" + (pointNum + 1);


	setupPoint(pointNum);

}
