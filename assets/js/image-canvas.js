c = document.getElementById("canvas");
ctx = c.getContext("2d");
img = document.getElementById("scream");
ctx.drawImage(img, 0, 0);
ctx.stroke();

function drawLine(x, color)
{
		ctx.strokeStyle = color;
		ctx.fillStyle = color;
		ctx.globalAlpha = 1;
		ctx.moveTo(x, 0);
        ctx.lineTo(x, 10000);
		ctx.stroke();
}

var lines = [];
image = document.getElementById("canvas");



function updateCanvasPoints()
{
	for(i = 0; i < images[imageSelected].points.length; i++)
	{
		if(images[imageSelected].points[i] != undefined)
		{
			var selectedColor = "#6991fd";
			if(i == pointSelected)
			{
				selectedColor = "rgb(253, 117, 103)";
			}
			ctx.beginPath();
				drawLine(images[imageSelected].points[i].imgXCoord + 1, selectedColor);
				drawLine(images[imageSelected].points[i].imgXCoord - 1, selectedColor);
				drawLine(images[imageSelected].points[i].imgXCoord, selectedColor);
			ctx.closePath();
		}
	}
}


image.onmousemove = () => {
		if(images[imageSelected].url != undefined)
		{
			ctx.drawImage(img, 0, 0);
			x = ((event.pageX - image.offsetLeft)/image.clientWidth) * document.getElementById("scream").naturalWidth;
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
	}
}
