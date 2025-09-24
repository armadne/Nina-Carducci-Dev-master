(function ($) {
  $.fn.mauGallery = function (options) {
    const settings = $.extend(
      {
        columns: { xs: 1, sm: 2, md: 3 }, 
        lightBox: true,
        lightboxId: "mauLightbox",
        showTags: true,
        tagsPosition: "top",
      },
      options
    );

   
    function createTags($gallery) {
      const tags = new Set();
      $gallery.find("[data-gallery-tag]").each(function () {
        tags.add($(this).data("gallery-tag"));
      });

      if (tags.size > 0) {
        const $tagsContainer = $("<div>", {
          class: "gallery-tags",
        });

       
        $("<button>", {
          class: "gallery-btn active",
          text: "Tous",
          "data-gallery-tag": "all",
        }).appendTo($tagsContainer);

       
        tags.forEach((tag) => {
          $("<button>", {
            class: "gallery-btn",
            text: tag,
            "data-gallery-tag": tag,
          }).appendTo($tagsContainer);
        });

       
        if (settings.tagsPosition === "top") {
          $gallery.before($tagsContainer);
        } else {
          $gallery.after($tagsContainer);
        }

        
        $tagsContainer.on("click", "button", function () {
          const tag = $(this).data("gallery-tag");

          $tagsContainer.find("button").removeClass("active");
          $(this).addClass("active");

          if (tag === "all") {
            $gallery.find(".gallery-item").show();
          } else {
            $gallery.find(".gallery-item").hide();
            $gallery.find(`[data-gallery-tag='${tag}']`).show();
          }
        });
      }
    }
function createLightbox() {
  if ($("#" + settings.lightboxId).length > 0) return;

  const $lightbox = $(`
    <div id="${settings.lightboxId}" class="modal fade" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered modal-fullscreen m-0">
        <div class="modal-content text-center position-relative border-0 shadow-none"
             style="background-color: transparent; box-shadow: none;">
          
          <!-- bouton précédent -->
          <button class="lightbox-prev btn btn-dark position-absolute top-50 start-0 translate-middle-y border-0 shadow-none">
            &#10094;
          </button>
          
          <!-- image -->
          <div class="modal-body d-flex justify-content-center align-items-center p-3">
            <img src="" alt="" 
                 style="max-width: 90%; max-height: 90vh; object-fit: contain; border-radius: 8px;"/>
          </div>
          
          <!-- bouton suivant -->
          <button class="lightbox-next btn btn-dark position-absolute top-50 end-0 translate-middle-y border-0 shadow-none">
            &#10095;
          </button>
        </div>
      </div>
    </div>
  `);

  $("body").append($lightbox);
}




function bindLightbox($gallery) {
  const $items = $gallery.find(".gallery-item");
  let currentIndex = 0;

  function showImage(index) {
    const src = $items.eq(index).attr("src");
    $("#" + settings.lightboxId).find("img").attr("src", src);
    currentIndex = index;
  }

  $gallery.on("click", ".gallery-item", function () {
    currentIndex = $items.index(this);
    showImage(currentIndex);
    $("#" + settings.lightboxId).modal("show");
  });

  $("body").on("click", ".lightbox-prev", function () {
    currentIndex = (currentIndex - 1 + $items.length) % $items.length;
    showImage(currentIndex);
  });

  $("body").on("click", ".lightbox-next", function () {
    currentIndex = (currentIndex + 1) % $items.length;
    showImage(currentIndex);
  });
}


    
    function applyResponsive($gallery) {
      $gallery.css({
        display: "grid",
        gap: "15px",
      });

      const resize = () => {
        const width = window.innerWidth;
        let cols = settings.columns.md; // valeur par défaut

        if (width < 576) cols = settings.columns.xs || cols;
        else if (width < 992) cols = settings.columns.sm || cols;

        $gallery.css("grid-template-columns", `repeat(${cols}, 1fr)`);
      };

      resize();
      $(window).on("resize", resize);
    }

   
    return this.each(function () {
      const $gallery = $(this);

      
      applyResponsive($gallery);

      
      if (settings.showTags) {
        createTags($gallery);
      }

     
      if (settings.lightBox) {
        createLightbox();
        bindLightbox($gallery);
      }
    });
  };
})(jQuery);
