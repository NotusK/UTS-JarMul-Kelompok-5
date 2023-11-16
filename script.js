// Constants
const fileInput = document.getElementById("file_selector");
const fileName = document.getElementById("filename");
const prevImg = document.getElementById("prevImg");
const inpWidth = document.getElementById("width");
const inpHeight = document.getElementById("height");
const modalInput = document.getElementById('imageUrl');
const compressAndDownloadBtn = document.getElementById('compressAndDownloadBtn');
const qualitySlider = document.getElementById('qualitySlider');
const qualityValue = document.getElementById('qualityValue');

// Variables
let realWidth = prevImg.clientWidth;
let realHeight = prevImg.clientHeight;
let format = "png";

function selFile() {
  fileInput.click();
}

function fileSelected() {
  if (fileInput.files.length !== 0) {
    // Selecting the first file
    const [file] = fileInput.files;
    // removing the file extension from name
    fileName.value = file.name.replace(/\.[^.]*$/, "");
    // setting file name
    prevImg.src = URL.createObjectURL(file);
    // updating new height and width
    setTimeout(() => {
      realWidth = prevImg.clientWidth;
      realHeight = prevImg.clientHeight;
      // setting height and width input value
      inpHeight.value = realHeight;
      inpWidth.value = realWidth;
    }, 100);
  }
}

function fileSelected2() {
  if (modalInput.files.length !== 0) {
    // Selecting the first file
    const [file] = fileInput.files;
    // removing the file extension from name
    fileName.value = file.name.replace(/\.[^.]*$/, "");
    // setting file name
    prevImg.src = URL.createObjectURL(file);
    // updating new height and width
    setTimeout(() => {
      realWidth = prevImg.clientWidth;
      realHeight = prevImg.clientHeight;
      // setting height and width input value
      inpHeight.value = realHeight;
      inpWidth.value = realWidth;
    }, 100);
  }
}

function onWChange() {
  inpHeight.value = (inpWidth.value / realWidth) * realHeight;
}

function onHChange() {
  inpWidth.value = (inpHeight.value / realHeight) * realWidth;
}

function changeFormat() {
    var selectBox = document.getElementById("selectBox");
    var selectedValue = selectBox.options[selectBox.selectedIndex].value;
    format = selectedValue;
   }

function downloadFile() {
  if (inpHeight.value > 8000 || inpWidth.value > 8000) {
    alert("Height or Width can not be greater than 8000px");
  } else {
    imgConverter(
      prevImg.src,
      realWidth,
      realHeight,
      format,
      inpHeight.value / realHeight
    ).then((dataUri) => {
      const a = document.createElement("a");
      a.href = dataUri;
      a.style.display = "none";
      a.download = fileName.value + "." + format || "spiffy" + "." + format;
      a.click();
    });
  }
}

// via: https://www.npmjs.com/package/image-converter-pro
const imgConverter = (
  Dataurl,
  width = 500,
  height = 500,
  format = "png",
  scale = 1
) =>
  new Promise((resolve, reject) => {
    let canvas;
    let ctx;
    let img;

    img = new Image();
    img.src = Dataurl;
    img.onload = () => {
      canvas = document.createElement("canvas");
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      ctx = canvas.getContext("2d");
      ctx.drawImage(
        img,
        0,
        0,
        img.width,
        img.height,
        0,
        0,
        width * scale,
        height * scale
      );

      img = new Image();
      img.src = canvas.toDataURL(`image/${format}`);
      img.onload = () => {
        canvas = document.createElement("canvas");
        canvas.width = width * scale;
        canvas.height = height * scale;
        ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL(`image/${format}`));
      };
    };
  });

  document.addEventListener('DOMContentLoaded', function() {
    const toggleButton = document.querySelector('.fa.fa-angle-down.btn.btn__primary');
    const dropdownMenu = document.querySelector('.dropdown-menu');

    toggleButton.addEventListener('click', function(event) {
        event.stopPropagation(); // Prevent the click event from reaching the document

        dropdownMenu.classList.toggle('visible'); // Toggle the "visible" class on click
    });

    // Hide the dropdown menu if the user clicks outside of it
    document.addEventListener('click', function(event) {
        if (!dropdownMenu.contains(event.target) && !toggleButton.contains(event.target)) {
            dropdownMenu.classList.remove('visible');
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
  const urlButton = document.querySelector('.dropdown-menu a[href="#url"]');
  const modal = document.getElementById('urlModal');

  // Show the modal when "From URL" button is clicked
  urlButton.addEventListener('click', function(event) {
      event.preventDefault(); // Prevent the default behavior of the anchor tag
      modal.style.display = 'block';
  });

  // Close the modal when the close button or outside the modal is clicked
  const closeButtons = document.querySelectorAll('.close');
  closeButtons.forEach(function(button) {
      button.addEventListener('click', function() {
          modal.style.display = 'none';
      });
  });

  window.onclick = function(event) {
      if (event.target === modal) {
          modal.style.display = 'none';
      }
  };

  // Function to handle image upload from URL
  window.uploadFromUrl = function() {
      const imageUrl = modalInput.value;
      if (imageUrl) {
          const prevImg = document.getElementById('prevImg');
          prevImg.src = imageUrl;
          modal.style.display = 'none';
          handleImageUrl(imageUrl);
      } else {
          alert('Please enter a valid image URL.');
      }
  };

  // Get the Upload button inside the modal by its id
  const uploadButton = document.getElementById('uploadBtn');

  // Add click event listener to the Upload button
  uploadButton.addEventListener('click', function(event) {
      event.preventDefault(); // Prevent the default behavior of the button
      uploadFromUrl(); // Call the uploadFromUrl function when the button is clicked
  });
});

function handleImageUrl(imageUrl, callback) {
  const img = new Image();
  img.onload = function() {
      prevImg.src = imageUrl;
      realWidth = img.width;
      realHeight = img.height;
      inpWidth.value = realWidth;
      inpHeight.value = realHeight;
      fileName.value = "customFileName"; // Example: Set a custom file name
      if (callback && typeof callback === 'function') {
          callback(); // Invoke the callback function after the image is loaded
      }
  };
  img.onerror = function() {
      alert("Failed to load the image from the provided URL.");
  };
  img.src = imageUrl;
}

compressAndDownloadBtn.addEventListener('click', () => {
  let imageUrl;

  if (fileInput.files.length > 0) {
      // Image uploaded from device
      const imageFile = fileInput.files[0];
      imageUrl = window.URL.createObjectURL(imageFile);
  } else {
      // Image uploaded from URL
      imageUrl = modalInput.value;

      // Ensure a valid URL is provided
      if (!imageUrl) {
          alert('Please enter a valid image URL.');
          return;
      }
  }

  const img = new Image();
  img.crossOrigin = 'Anonymous'; // Enable cross-origin resource sharing (CORS)
  img.src = imageUrl;

  img.onload = function() {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      // Resize the image if necessary
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Convert canvas to blob with specified quality
      canvas.toBlob(function (blob) {
          // Create a download link
          const downloadLink = document.createElement('a');
          const filename = fileName.value || 'compressed_image';
          downloadLink.href = window.URL.createObjectURL(blob);
          downloadLink.download = `${filename}.jpeg`;
          document.body.appendChild(downloadLink);

          // Trigger the download
          downloadLink.click();

          // Clean up the download link
          window.URL.revokeObjectURL(downloadLink.href);
          document.body.removeChild(downloadLink);
      }, 'image/jpeg', parseFloat(qualitySlider.value));
  };
});


qualitySlider.addEventListener('input', () => {
  qualityValue.textContent = qualitySlider.value;
});





