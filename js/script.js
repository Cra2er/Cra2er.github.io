let popups_active = 0;

// popup background

let popup_background = document.querySelector(".popup__background");
let popup_link = document.querySelector(".timed-popup__link");

let popup_background_active = false;

popup_link.addEventListener('click', () => {
  closeTimedPopup();
  popup_background_active();
});

//popup_gallery

let gallery_popup_picture = document.querySelector(".gallery-popup__picture");
let gallery_popup_container = document.querySelector(".gallery-popup-container");
let gallery_button_prev = document.querySelector(".button_prev");
let gallery_button_next = document.querySelector(".button_next");

let gallery_popup_active = false;

let galleryPictures = Array.from(document.querySelectorAll(".gallery__picture"));
let srcs = galleryPictures.map(picture => picture.src);

function popupBackgroundHandler() {
  if (popups_active === 0 && popup_background_active) {
    popup_background.classList.add("inactive");
    popup_background_active = false;
  } else if (popups_active > 0 && !popup_background_active) {
    popup_background.classList.remove("inactive");
    popup_background_active = true;
  }
}

function handleButtons() {
  if (parseInt(gallery_popup_picture.dataset.ind) === 0) {
    gallery_button_prev.classList.add('inactive');
  } else if (gallery_button_prev.classList.contains('inactive')) {
    gallery_button_prev.classList.remove('inactive');
  }

  if (parseInt(gallery_popup_picture.dataset.ind) === galleryPictures.length - 1) {
    gallery_button_next.classList.add('inactive');
  } else if (gallery_button_next.classList.contains('inactive')) {
    gallery_button_next.classList.remove('inactive');
  }
}

function initGalleryPopup(ind) {
  if (gallery_popup_active) {
    return;
  }
  gallery_popup_container.classList.remove('inactive');
  gallery_popup_picture.src = srcs[ind];
  gallery_popup_picture.dataset.ind = ind;
  handleButtons();
  gallery_popup_active = true;
  ++popups_active;
  popupBackgroundHandler();
}

function closeGalleryPopup() {
  if (!gallery_popup_active) {
    return;
  }
  gallery_button_prev.classList.add('inactive');
  gallery_button_next.classList.add('inactive');
  gallery_popup_container.classList.add('inactive');
  gallery_popup_picture.dataset.ind = -1;
  gallery_popup_active = false;
  --popups_active;
  popupBackgroundHandler();
}

function nextPicture(delta) {
  let cur_ind = parseInt(gallery_popup_picture.dataset.ind);
  if (cur_ind + delta < 0 || cur_ind + delta >= galleryPictures.length) {
    return;
  }
  let new_ind = cur_ind + delta
  gallery_popup_picture.dataset.ind = new_ind;
  handleButtons()
  gallery_popup_picture.src = srcs[new_ind];
}

let pictures = document.querySelectorAll('.info__image');
pictures.forEach((elem) => {
    elem.addEventListener('click', async function () {
        initGalleryPopup(elem.dataset.ind);
      }
    )
  }
);

gallery_button_prev.addEventListener('click', () => {
  nextPicture(-1);
});

gallery_button_next.addEventListener('click', () => {
  nextPicture(1);
});

// popup controls

document.addEventListener('click', function (event) {
  if (event.target === gallery_popup_container) {
    closeGalleryPopup();
  } else if (event.target === form_popup_container) {
    closeFormPopup();
  } else if (event.target === timed_popup_container) {
    closeTimedPopup();
  } else if (event.target === info_popup_container) {
    closeInfoPopup();
  }
});

document.addEventListener('keyup', (event) => {
  if (event.key === 'Escape') {
    if (timed_popup_active) {
      closeTimedPopup();
    } else if (info_popup_active) {
      closeInfoPopup();
    } else if (form_popup_active) {
      closeFormPopup();
    } else if (gallery_popup_active) {
      closeGalleryPopup();
    }
  } else if (event.key === 'ArrowLeft' && gallery_popup_active) {
    nextPicture(-1);
  } else if (event.key === 'ArrowRight' && gallery_popup_active) {
    nextPicture(1);
  }
});

// info popup

let info_popup_container = document.querySelector(".info-popup-container");
let info_popup_text = document.querySelector(".info-popup__text");

let info_popup_active = false;

function initInfoPopup(message) {
  if (!info_popup_active) {
    info_popup_container.classList.remove('inactive');
    info_popup_container.style.transform = "scale(1.0)";
    info_popup_active = true;
    ++popups_active;
    popupBackgroundHandler()
  }
  info_popup_text.innerHTML = message;
}

function closeInfoPopup() {
  if (!info_popup_active) {
    return;
  }
  info_popup_container.style.transform = "scale(0.0)"
  info_popup_active = false;
  setTimeout(function () {
    info_popup_container.classList.add('inactive');
    --popups_active;
    popupBackgroundHandler();
  }, 500);
}

// feedback form

let form_popup_container = document.querySelector(".form-popup-container");
let form_submit_button = document.querySelector(".submit_button");

let form_link_button = document.querySelector(".form-link");

let form_popup_active = false;

form_link_button.addEventListener('click', () => {
  initFormPopup();
});

form_submit_button.addEventListener('click', () => {
  processForm();
});

function initFormPopup() {
  if (form_popup_active) {
    return;
  }
  if (!form_submit_button.classList.contains("button-loading")) {
    form_submit_button.value = "Отправить";
    form_submit_button.classList.remove("button-success");
    form_submit_button.classList.remove("button-failure");
    form_submit_button.disabled = false;
  }
  form_popup_container.classList.remove('inactive');
  form_popup_container.style.transform = "scale(1.0)";
  form_popup_active = true;
  ++popups_active;
  popupBackgroundHandler();
}

function closeFormPopup() {
  if (!form_popup_active) {
    return;
  }
  form_popup_container.style.transform = "scale(0.0)"
  form_popup_active = false;
  setTimeout(function () {
    form_popup_container.classList.add('inactive');
    --popups_active;
    popupBackgroundHandler();
  }, 500);
}

function processForm() {
  let form_group = document.querySelector(".form-body__input[type=text]");
  let form_tel = document.querySelector(".form-body__input[type=tel]");
  let form_email = document.querySelector(".form-body__input[type=email]");
  let form_crying = document.querySelector(".form-body__input[id=crying]");

  let group_data = form_group.value;
  let tel_data = form_tel.value;
  let email_data = form_email.value;
  let crying_data = form_crying.value;
  if (group_data !== 'Кино') {
    initInfoPopup("Неправильный вкус!");
    return;
  }
  if (!validateTel(tel_data)) {
    initInfoPopup("Неправильный формат телефонного номера!");
    return;
  } else if (!validateEmail(email_data)) {
    initInfoPopup("Неправильный формат электронной почты!");
    return;
  } else if (!validateText(crying_data)) {
    initInfoPopup("Неправильный мёд " +
      "(используйте только символы кириллицы, цифры 0-9, или символы '.', ',', '?', '!', ':', ';'. '-')");
    return;
  }

  form_submit_button.value = "Отправка";
  form_submit_button.classList.add("button-loading");
  form_submit_button.disabled = true;
  document.body.style.cursor = 'wait';
  form_submit_button.style.cursor = 'wait';

  (new Promise(resolve => setTimeout(resolve, 1000))).then(
    () => sendData("").then((response) => {
      if (response.ok) {
        form_submit_button.value = "Победа!";
        form_submit_button.classList.remove("button-loading");
        form_submit_button.classList.add("button-success");
        document.body.style.cursor = 'default';
        form_submit_button.style.cursor = 'default';
        group_data = "";
        tel_data = "";
        email_data = "";
        crying_data = "";

        requestAnimationFrame(draw);
      } else {
        form_submit_button.value = "Упс!";
        form_submit_button.classList.remove("button-loading");
        form_submit_button.classList.add("button-failure");
        document.body.style.cursor = 'default';
        form_submit_button.style.cursor = 'not-allowed';
      }
    }).catch(() => {
      form_submit_button.value = "Упс!";
      form_submit_button.classList.remove("button-loading");
      form_submit_button.classList.add("button-failure");
      document.body.style.cursor = 'default';
      form_submit_button.style.cursor = 'not-allowed';
    })
  );
}

async function sendData(data) {
  return await fetch("https://jsonplaceholder.typicode.com/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: data
  });
}

function validateTel(tel_data) {
  return /^(\+7|8)\([0-9]{3}\)[0-9]{3}-[0-9]{2}-[0-9]{2}$/.test(tel_data)
    || /^(\+7|8)[0-9]{10}$/.test(tel_data);
}

function validateEmail(email_data) {
  return /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu.test(email_data);
}

function validateText(feedback_data) {
  return /^[а-яА-Я0-9.,?!:;\- ]*$/.test(feedback_data);
}

// Timed popup

const timed_popup_container = document.querySelector(".timed-popup-container");
const timed_popup_link = document.querySelector(".timed-popup__link")

timed_popup_link.addEventListener('click', () => {
  closeTimedPopup();
});

let timed_popup_active = false;

function initTimedPopup() {
  if (timed_popup_active) {
    return;
  }
  timed_popup_container.classList.remove("inactive");
  timed_popup_container.style.transform = "scale(1.0)";
  timed_popup_active = true;
  ++popups_active;
  popupBackgroundHandler()
}

function closeTimedPopup() {
  if (!timed_popup_active) {
    return;
  }
  timed_popup_container.style.transform = "scale(0.0)"
  timed_popup_active = false;
  setTimeout(function () {
    timed_popup_container.classList.add('inactive');
    --popups_active;
    popupBackgroundHandler()
  }, 500);
}

function timedPopup() {
  if (localStorage.getItem("popup_shown") === "true") {
    return;
  }
  setTimeout(() => {
    initTimedPopup();
    localStorage.setItem("popup_shown", "true");
  }, 30000);
}

timedPopup();

// countdown

const countdown_time = document.querySelector(".countdown-time");

function updateCountdown() {
  let final_time = new Date("Dec 20, 2104 10:40:00");
  let cur_time = new Date();

  let left_time = final_time - cur_time;

  let seconds = Math.floor((left_time % (1000 * 60)) / 1000);
  let minutes = Math.floor((left_time % (1000 * 60 * 60)) / (1000 * 60));
  let hours = Math.floor((left_time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  let days = Math.floor(left_time % (1000 * 60 * 60 * 24 * 365.24) / (1000 * 60 * 60 * 24));
  let years = Math.floor(left_time / (1000 * 60 * 60 * 24 * 365.24));

  countdown_time.innerHTML = years + 'л ' + days + 'д ' + hours + 'ч ' + minutes + 'м ' + seconds;
  let ost = seconds % 10;
  let sec = 'секунд';
  if (ost % 10 === 1) {
    sec = 'секунда';
  } else if (ost < 5 && ost !== 0) {
    sec = 'секунды';
  }
  countdown_time.innerHTML += sec;
}

updateCountdown();
setInterval(function () {
  updateCountdown();
}, 1000)

//fixed menu

let headerHeader = document.querySelector('.header__header');
let menu = document.querySelector('.menu');
let sum_height = headerHeader.offsetHeight + menu.offsetHeight;
addEventListener('resize', function () {
  sum_height = headerHeader.offsetHeight + menu.offsetHeight;
})

window.addEventListener('scroll', function () {
  if (window.pageYOffset >= sum_height) {
    menu.classList.add('fixed_menu');
  } else {
    menu.classList.remove('fixed_menu');
  }
});


//svg rotating

let stars = document.querySelectorAll('.header__star');
let star_1 = stars[0];
let star_2 = stars[1];

function draw(dt) {
  rotate(star_1, dt / 40);
  rotate(star_2, dt / 40);
  requestAnimationFrame(draw)
}

function rotate(el, value) {
  let bb = el.getBBox();
  let cx = bb.x;
  let cy = bb.y - bb.height / 50;
  el.setAttribute('transform', `rotate(${value} ${cx},${cy})`)
}
