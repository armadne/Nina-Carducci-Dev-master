(function($) {
  $.fn.mauGallery = function(options) {
    const settings = $.extend({}, $.fn.mauGallery.defaults, options);
    let tagsCollection = [];

    return this.each(function() {
      const $gallery = $(this);

      $.fn.mauGallery.methods.createRowWrapper($gallery);

      if (settings.lightBox) {
        $.fn.mauGallery.methods.createLightBox(
          $gallery,
          settings.lightboxId,
          settings.navigation
        );
      }

      $.fn.mauGallery.listeners(settings);

      $gallery.children(".gallery-item").each(function() {
        const $item = $(this);
        $.fn.mauGallery.methods.responsiveImageItem($item);
        $.fn.mauGallery.methods.moveItemInRowWrapper($item);
        $.fn.mauGallery.methods.wrapItemInColumn($item, settings.columns);

        const tag = $item.data("gallery-tag");
        if (settings.showTags && tag && !tagsCollection.includes(tag)) {
          tagsCollection.push(tag);
        }
      });

      if (settings.showTags) {
        $.fn.mauGallery.methods.showItemTags(
          $gallery,
          settings.tagsPosition,
          tagsCollection
        );
      }

      $gallery.fadeIn(300);
    });
  };

  $.fn.mauGallery.defaults = {
    columns: 3,
    lightBox: true,
    lightboxId: null,
    showTags: true,
    tagsPosition: "bottom",
    navigation: true
  };

  $.fn.mauGallery.listeners = function(settings) {
    $(".gallery-item").on("click", function() {
      if (settings.lightBox && $(this).is("img")) {
        $.fn.mauGallery.methods.openLightBox($(this), settings.lightboxId);
      }
    });

    $(".gallery").on("click", ".nav-link", $.fn.mauGallery.methods.filterByTag);
    $(".gallery").on("click", ".mg-prev", () =>
      $.fn.mauGallery.methods.navigateImage("prev", settings.lightboxId)
    );
    $(".gallery").on("click", ".mg-next", () =>
      $.fn.mauGallery.methods.navigateImage("next", settings.lightboxId)
    );
  };

  $.fn.mauGallery.methods = {
    // ... (autres méthodes identiques)

    navigateImage(direction) {
      const $active = $(".lightboxImage");
      const activeSrc = $active.attr("src");

      const activeTag = $(".tags-bar span.active-tag").data("images-toggle");
      const $images = activeTag === "all"
        ? $("img.gallery-item")
        : $(`img.gallery-item[data-gallery-tag='${activeTag}']`);

      const imagesArray = $images.toArray();
      const currentIndex = imagesArray.findIndex(img => $(img).attr("src") === activeSrc);

      let newIndex;
      if (direction === "next") {
        newIndex = (currentIndex + 1) % imagesArray.length;
      } else {
        newIndex = (currentIndex - 1 + imagesArray.length) % imagesArray.length;
      }

      $active.attr("src", $(imagesArray[newIndex]).attr("src"));
    }
  };
})(jQuery);
