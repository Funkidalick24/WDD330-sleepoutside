window.addEventListener("DOMContentLoaded", () => {
    resizeProductImages();
  });
  
  window.addEventListener("resize", resizeProductImages);
  
  function resizeProductImages() {
    const screenWidth = window.innerWidth;
    const images = document.querySelectorAll("img.divider");
  
    let newWidth;
  
    if (screenWidth <= 480) {
      newWidth = "100px";
    } else if (screenWidth <= 768) {
      newWidth = "200px";  // ✅ removed extra semicolon
    } else {
      newWidth = "320px";  // ✅ removed extra semicolon
    }
  
    images.forEach((img) => {
      img.style.width = newWidth;
      img.style.height = "auto";
    });
}
  
export { resizeProductImages };
  