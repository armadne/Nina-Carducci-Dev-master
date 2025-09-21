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
          <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content bg-dark text-center">
              <div class="modal-body p-0">
                <img src="" class="img-fluid" alt=""/>
              </div>
            </div>
          </div>
        </div>
      `);

      $("body").append($lightbox);
    }

    // === Ouverture du lightbox ===
    function bindLightbox($gallery) {
      $gallery.on("click", ".gallery-item", function () {
        const src = $(this).attr("src");
        $("#" + settings.lightboxId)
          .find("img")
          .attr("src", src);
        $("#" + settings.lightboxId).modal("show");
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
