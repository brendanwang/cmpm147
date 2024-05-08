/* exported p4_inspirations, p4_initialize, p4_render, p4_mutate */


function getInspirations() {
  return [
    {
      name: "Astroworld", 
      assetUrl: "img/astroworld.jpg",
      credit: "Astroworld, Travis Scott, 2018"
    },
    {
      name: "Her Loss", 
      assetUrl: "img/her_loss.jpg",
      credit: "Her Loss, Drake, OVO Sound, 2022"
    },
    {
      name: "Scary Hours", 
      assetUrl: "img/scary_hours.jpg",
      credit: "For All The Dogs: Scary Hours Edition, Drake, OVO Sound, 2023"
    },
  ];
}

function initDesign(inspiration) {
  // set the canvas size based on the container
  let canvasContainer = $('.image-container'); // Select the container using jQuery
  let canvasWidth = canvasContainer.width(); // Get the width of the container
  let aspectRatio = inspiration.image.height / inspiration.image.width;
  let canvasHeight = canvasWidth * aspectRatio; // Calculate the height based on the aspect ratio
  resizeCanvas(canvasWidth, canvasHeight);
  $(".caption").text(inspiration.credit); // Set the caption text

  // add the original image to #original
  const imgHTML = `<img src="${inspiration.assetUrl}" style="width:${canvasWidth}px;">`
  $('#original').empty();
  $('#original').append(imgHTML);

  
  let design = {
    bg: 128,
    fg: []
  }
  
  for(let i = 0; i < 100; i++) {
    design.fg.push({
      x: random(width),
      y: random(height),
      w: random(width / 2),
      h: random(height / 2),
      fill: random(255)
    });
  }
  return design;
}

function renderDesign(design, inspiration) {
  // Clear the canvas
  background(design.bg);
  noStroke();
  
  // Render foreground objects
  for(let box of design.fg) {
    fill(box.fill, 128);
    rect(box.x, box.y, box.w, box.h);
  }
}

function mutateDesign(design, inspiration, rate) {
  // Mutate background color
  design.bg = mut(design.bg, 0, 255, rate);
  
  // Mutate foreground objects
  for(let box of design.fg) {
    box.fill = mut(box.fill, 0, 255, rate);
    box.x = mut(box.x, 0, width, rate);
    box.y = mut(box.y, 0, height, rate);
    box.w = mut(box.w, 0, width / 2, rate);
    box.h = mut(box.h, 0, height / 2, rate);
  }
}


// Utility function for mutation
function mut(num, min, max, rate) {
  return constrain(randomGaussian(num, (rate * (max - min)) / 10), min, max);
}
