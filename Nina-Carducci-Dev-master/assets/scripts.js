document.addEventListener("DOMContentLoaded", () => {
  $(".gallery").mauGallery({
    columns: { xs: 1, sm: 2, md: 3 }, // 3 colonnes en desktop
    lightBox: true,
    lightboxId: "myAwesomeLightbox",
    showTags: true,
    tagsPosition: "top",
  });
});
