(function ($) {
  $.fn.mauGallery = function (options) {
    const settings = $.extend({}, $.fn.mauGallery.defaults, options);
    let tagsCollection = [];

    return this.each(function () {
      const $gallery = $(this);

      // Crée le conteneur principal (row bootstrap)
      $.fn.mauGallery.methods.createRowWrapper($gallery);

      // Lightbox si activée
      if (settings.lightBox) {
        $.fn.mauGallery.methods.createLightBox(
          $gallery,
          settings.lightboxId,
          settings.navigation
        );
      }

      // Ajout des écouteurs
      $.fn.mauGallery.listeners(settings);

      // Parcours des items
      $gallery.children(".gallery-item").each(function () {
        const $item = $(this);
        $.fn.mauGallery.methods.responsiveImageItem($item);
        $.fn.mauGallery.methods.moveItemInRowWrapper($item);
        $.fn.mauGallery.methods.wrapItemInColumn($item, settings.columns);

        const tag = $item.data("gallery-tag");
        if (settings.showTags && tag && !tagsCollection.includes(tag)) {
          tagsCollection.push(tag);
        }
      });

      // Affichage des tags
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

  // Options par défaut
  $.fn.mauGallery.defaults = {
    columns: 3,
    lightBox: true,
    lightboxId: "lightbox",
    showTags: true,
    tagsPosition: "bottom",
    navigation: true,
  };

  // Listeners (clic sur images et tags)
  $.fn.mauGallery.listeners = function (settings) {
    $(".gallery-item").on("click", function () {
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

  // Méthodes
  $.fn.mauGallery.methods = {
    createRowWrapper($gallery) {
      if ($gallery.find(".row").length === 0) {
        $gallery.wrapInner('<div class="row"></div>');
      }
    },

    responsiveImageItem($item) {
      $item.addClass("img-fluid");
    },

    moveItemInRowWrapper($item) {
      const $row = $item.closest(".row");
      if ($row.length === 0) {
        $item.wrap('<div class="row"></div>');
      }
    },

    wrapItemInColumn($item, columns) {
      $item.wrap(`<div class="col-md-${12 / columns}"></div>`);
    },

    showItemTags($gallery, position, tagsCollection) {
      const $tagsBar = $('<div class="tags-bar"></div>');
      $tagsBar.append(
        "<span class='nav-link active-tag' data-images-toggle='all'>All</span>"
      );

      tagsCollection.forEach((tag) => {
        $tagsBar.append(
          `<span class="nav-link" data-images-toggle="${tag}">${tag}</span>`
        );
      });

      if (position === "top") {
        $gallery.before($tagsBar);
      } else {
        $gallery.after($tagsBar);
      }
    },

    createLightBox($gallery, lightboxId, navigation) {
      if ($(`#${lightboxId}`).length) return;

      const navButtons = navigation
        ? `<button class="mg-prev">Prev</button><button class="mg-next">Next</button>`
        : "";

      const lightbox = `
        <div id="${lightboxId}" class="mg-lightbox" style="display:none;">
          <span class="mg-close">&times;</span>
          <img class="lightboxImage img-fluid" src="" />
          ${navButtons}
        </div>`;

      $("body").append(lightbox);

      // fermer lightbox
      $(".mg-close").on("click", () => {
        $(`#${lightboxId}`).fadeOut(200);
      });
    },

    openLightBox($img, lightboxId) {
      const $lightbox = $(`#${lightboxId}`);
      if ($lightbox.length) {
        $lightbox.find(".lightboxImage").attr("src", $img.attr("src"));
        $lightbox.fadeIn(300);
      }
    },

    filterByTag(e) {
      const tag = $(e.target).data("images-toggle");
      $(".tags-bar .nav-link").removeClass("active-tag");
      $(e.target).addClass("active-tag");

      if (tag === "all") {
        $(".gallery-item").parent().show();
      } else {
        $(".gallery-item").each(function () {
          const $item = $(this);
          if ($item.data("gallery-tag") === tag) {
            $item.parent().show();
          } else {
            $item.parent().hide();
          }
        });
      }
    },

    navigateImage(direction, lightboxId) {
      const $active = $(`#${lightboxId} .lightboxImage`);
      const activeSrc = $active.attr("src");

      const activeTag = $(".tags-bar span.active-tag").data("images-toggle");
      const $images =
        activeTag === "all"
          ? $("img.gallery-item")
          : $(`img.gallery-item[data-gallery-tag='${activeTag}']`);

      const imagesArray = $images.toArray();
      const currentIndex = imagesArray.findIndex(
        (img) => $(img).attr("src") === activeSrc
      );

      let newIndex;
      if (direction === "next") {
        newIndex = (currentIndex + 1) % imagesArray.length;
      } else {
        newIndex = (currentIndex - 1 + imagesArray.length) % imagesArray.length;
      }

      $active.attr("src", $(imagesArray[newIndex]).attr("src"));
    },
  };
})(jQuery);
