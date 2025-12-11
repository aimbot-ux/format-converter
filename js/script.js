const fileInput = document.getElementById("fileInput");
const dropZone = document.getElementById("dropZone");
const uploadText = document.getElementById("uploadText");
const previewArea = document.getElementById("previewArea");
const imagePreview = document.getElementById("imagePreview");
const fileNameDisplay = document.getElementById("fileName");
const controls = document.getElementById("controls");
const downloadSection = document.getElementById("downloadSection");
const downloadLink = document.getElementById("downloadLink");

let originalFile = null;
let originalImage = new Image();

fileInput.addEventListener("change", function (e) {
  handleFile(e.target.files[0]);
});

dropZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropZone.classList.add("dragover");
});

dropZone.addEventListener("dragleave", () =>
  dropZone.classList.remove("dragover")
);

dropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropZone.classList.remove("dragover");
  handleFile(e.dataTransfer.files[0]);
});

function handleFile(file) {
  if (!file || !file.type.startsWith("image/")) {
    alert("Please upload a valid image file!");
    return;
  }

  originalFile = file;
  const reader = new FileReader();

  reader.onload = function (e) {
    originalImage.src = e.target.result;
    imagePreview.src = e.target.result;

    uploadText.classList.add("hidden");
    previewArea.classList.remove("hidden");
    controls.classList.remove("hidden");
    fileNameDisplay.textContent = file.name;
    downloadSection.classList.add("hidden");
  };
  reader.readAsDataURL(file);
}

function convertFile() {
  const format = document.getElementById("formatSelect").value;

  if (format === "pdf") {
    convertToPDF();
    return;
  }

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = originalImage.width;
  canvas.height = originalImage.height;
  ctx.drawImage(originalImage, 0, 0);

  const dataUrl = canvas.toDataURL(`image/${format}`, 0.9);

  showDownloadButton(dataUrl, format);
}

function convertToPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const imgProps = doc.getImageProperties(originalImage.src);
  const pdfWidth = doc.internal.pageSize.getWidth();
  const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

  doc.addImage(originalImage.src, "JPEG", 0, 0, pdfWidth, pdfHeight);

  const pdfBlob = doc.output("blob");
  const url = URL.createObjectURL(pdfBlob);

  showDownloadButton(url, "pdf");
}

function showDownloadButton(url, extension) {
  const originalName = originalFile.name.split(".")[0];
  const newFileName = `${originalName}_converted.${extension}`;

  downloadLink.href = url;
  downloadLink.download = newFileName;

  downloadSection.classList.remove("hidden");

  downloadSection.scrollIntoView({ behavior: "smooth" });
}

function resetApp() {
  fileInput.value = "";
  originalFile = null;
  uploadText.classList.remove("hidden");
  previewArea.classList.add("hidden");
  controls.classList.add("hidden");
  downloadSection.classList.add("hidden");
}
