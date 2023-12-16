const $ = document;

$.addEventListener("DOMContentLoaded", () => {
  /* ------------------------------
  /*      AUTOMATIC REVIEWS
  /* -----------------------------*/

  $.querySelectorAll(".notation[data-note]").forEach((element) => {
    let result =
        '<svg aria-label="" class="zWXXYhVR" height="12" viewBox="0 0 68 12" width=68>',
      note = Math.round(Number(element.getAttribute("data-note")));

    for (let i = 1; i <= Math.floor(element.getAttribute("data-note")); i++) {
      result +=
        '<path d="M 12 0C5.388 0 0 5.388 0 12s5.388 12 12 12 12-5.38 12-12c0-6.612-5.38-12-12-12z"transform=scale(0.5)></path><path d="M 12 0C5.388 0 0 5.388 0 12s5.388 12 12 12 12-5.38 12-12c0-6.612-5.38-12-12-12z"transform="translate(14 0) scale(0.5)"></path><path d="M 12 0C5.388 0 0 5.388 0 12s5.388 12 12 12 12-5.38 12-12c0-6.612-5.38-12-12-12z"transform="translate(28 0) scale(0.5)"></path><path d="M 12 0C5.388 0 0 5.388 0 12s5.388 12 12 12 12-5.38 12-12c0-6.612-5.38-12-12-12z"transform="translate(42 0) scale(0.5)"></path>';
    }
    if (element.getAttribute("data-note").match(/\./)) {
      result +=
        '<path d="M 12 0C5.389 0 0 5.389 0 12c0 6.62 5.389 12 12 12 6.62 0 12-5.379 12-12S18.621 0 12 0zm0 2a9.984 9.984 0 0110 10 9.976 9.976 0 01-10 10z"transform="translate(56 0) scale(0.5)"></path>';
    }
    if (note < 5) {
      for (let i = 1; i <= 5 - note; i++) {
        result +=
          '<path d="M 12 0C5.388 0 0 5.388 0 12s5.388 12 12 12 12-5.38 12-12c0-6.612-5.38-12-12-12zm0 2a9.983 9.983 0 019.995 10 10 10 0 01-10 10A10 10 0 012 12 10 10 0 0112 2z"transform="translate(56 0) scale(0.5)"></path>';
      }
    }
    result += "</svg>";
    element.innerHTML = result + element.innerHTML;
  });

  /* ------------------------------
  /*      ARROWS SYSTEM
  /* -----------------------------*/

  const autoHideArrows = (elements) => {
    if (elements) {
      elements = elements.querySelectorAll(".fas, .icon");
    } else {
      elements = $.querySelectorAll(
        ".elements-content .fas, .elements-content .icon"
      );
    }

    elements.forEach((arrow) => {
      const el = elements[0].parentElement.querySelector(".elements"),
        currentScroll = el.scrollLeft,
        maxScrollLeft = el.scrollWidth - el.clientWidth;

      if (
        arrow.classList.contains("next") &&
        currentScroll === maxScrollLeft &&
        !arrow.classList.contains("hide")
      ) {
        arrow.classList.add("hide");
      } else if (
        arrow.classList.contains("next") &&
        currentScroll < maxScrollLeft &&
        arrow.classList.contains("hide")
      ) {
        arrow.classList.remove("hide");
      }

      if (
        arrow.classList.contains("previous") &&
        currentScroll === 0 &&
        !arrow.classList.contains("hide")
      ) {
        arrow.classList.add("hide");
      } else if (
        arrow.classList.contains("previous") &&
        currentScroll > 0 &&
        arrow.classList.contains("hide")
      ) {
        arrow.classList.remove("hide");
      }
    });
  };

  autoHideArrows();

  $.querySelectorAll(".elements-content .fas, .elements-content .icon").forEach(
    (element) => {
      element.addEventListener("click", () => {
        const el = element.parentElement.querySelector(".elements");
        (cards = element.parentElement.querySelectorAll(".card")),
          (cardWidth = cards[0].clientWidth),
          (currentScroll = el.scrollLeft),
          (totalScroll = el.scrollLeftMax),
          (nbVisibleCards = Math.round(el.clientWidth / cardWidth)),
          (spaces =
            (cards[1].offsetLeft - cards[1].offsetWidth) * nbVisibleCards),
          (containerWidth = cardWidth * nbVisibleCards + spaces);

        if (element.classList.contains("next")) {
          if (
            currentScroll + containerWidth === el.scrollWidth &&
            !element.classList.contains("hide")
          ) {
            return element.classList.add("hide");
          }
          for (let i = 0; i < cards.length; i++) {
            if (currentScroll + containerWidth <= cards[i].offsetLeft) {
              cards[i].scrollIntoView({
                behavior: "smooth",
                block: "end",
                inline: "nearest",
              });
              break;
            }
            if (i === cards.length - 1) {
              cards[i].scrollIntoView({
                behavior: "smooth",
                block: "end",
                inline: "nearest",
              });
            }
          }
        }

        if (element.classList.contains("previous")) {
          if (currentScroll === 0 && !element.classList.contains("hide")) {
            return element.classList.add("hide");
          }
          for (let i = cards.length - 1; i >= 0; i--) {
            if (cards[i].offsetLeft < currentScroll) {
              cards[i].scrollIntoView({
                behavior: "smooth",
                block: "end",
                inline: "nearest",
              });
              break;
            }
          }
        }
      });
    }
  );

  /* ------------------------------
  /*             MODAL
  /* -----------------------------*/

  $.querySelectorAll(".elements-content .elements").forEach((carousel) => {
    carousel.addEventListener("scroll", (e) => {
      autoHideArrows(carousel.parentElement);
    });
  });

  $.querySelector("#contact").addEventListener("click", (e) => {
    e.preventDefault();
    $.body.classList.add("modal-open");
    $.querySelector(".modal").classList.add("show");
  });

  $.querySelectorAll('a[href="#"]').forEach((element) => {
    element.addEventListener("click", (e) => {
      e.preventDefault();
      return false;
    });
  });

  const closeModal = (forceClosing = false) => {
    if (!$.querySelectorAll(".modal input").length) {
      forceClosing = true;
    }

    if (!forceClosing) {
      let emptyElements = true;
      $.querySelectorAll(".modal input, .modal textarea").forEach((element) => {
        if (element.getAttribute("type") !== "submit" && element.value) {
          emptyElements = false;
        }
      });
      if (!emptyElements) {
        return false;
      }
    }
    $.querySelector(".modal.show").classList.remove("show");
    $.body.classList.remove("modal-open");
  };

  window.addEventListener("click", function autoClose(event) {
    if (event.target === $.querySelector("#modal")) {
      closeModal();
      window.removeEventListener("click", autoClose);
    }
  });

  window.addEventListener(
    "keydown",
    function escapeKey(e) {
      if (e.key == "Escape" || e.key == "Esc" || e.keyCode == 27) {
        closeModal();
        window.removeEventListener("keydown", escapeKey);
      }
    },
    true
  );

  $.querySelectorAll('#modal *[data-dismiss="modal"]').forEach((close) => {
    close.addEventListener("click", () => {
      closeModal(true);
    });
  });

  /* ------------------------------
  /*             FORM
  /* -----------------------------*/

  $.querySelector(".modal form").addEventListener("submit", async (e) => {
    e.preventDefault();

    let isEmpty = false;
    $.querySelectorAll(".modal input, .modal textarea").forEach((element) => {
      if (element.getAttribute("type") !== "submit" && !element.value) {
        isEmpty = true;
        element.classList.add("invalid");
        console.log(element.nextSibling.nodeName);
        if (element.nextSibling.nodeName !== "SPAN") {
          const errorSpan = document.createElement("span");
          errorSpan.innerText = "Ce champ doit être rempli.";
          element.parentNode.insertBefore(errorSpan, element.nextSibling);
        }
      } else if (element.classList.contains("invalid")) {
        element.classList.remove("invalid");
        if (element.nextSibling.nodeName === "SPAN") {
          element.nextSibling.remove();
        }
      }
    });

    if (isEmpty) {
      return;
    }

    const data = {
      firstName: $.querySelector('input[name="firstname"]').value,
      lastName: $.querySelector('input[name="lastname"]').value,
      email: $.querySelector('input[name="email"]').value,
      message: $.querySelector('textarea[name="message"]').value,
    };

    try {
      const response = await axios.post(
        "https://backend-tripadvisor-clone.herokuapp.com/form",
        data
      );

      if (!response.data.result) {
        return alert(
          "An error has occured, please contact your administrator."
        );
      } else {
        $.querySelector(".modal .modal-body").innerText =
          "Le mail a bien été envoyé, merci !";
      }
    } catch (error) {
      alert("An error has occured.");
    }
  });

  $.querySelectorAll('a[href="#"]').forEach((element) => {
    element.addEventListener("click", (e) => {
      e.preventDefault();
      return false;
    });
  });
});
