const pin1 = document.getElementById("pin");

const pin2 = document.getElementById("pin2");

const boomImg = document.getElementById("boom");

const rezeImg = document.getElementById("reze");

const titleImg = document.getElementById("title");

const starterImg = document.getElementById("starter");

const bloodImg = document.getElementById("blood");

const denziImg = document.getElementById("denzi");

const mainText = document.getElementById("main-text"); // "きみだけ"

const secondText = document.getElementById("second-text"); // "大正解"

const starterMusic = document.getElementById("starter-music");

const bombSound = document.getElementById("bomb-sound");

const rattleSound = document.getElementById("rattle-sound");

const pins = [pin1, pin2];

if (
  pin1 &&
  pin2 &&
  boomImg &&
  rezeImg &&
  titleImg &&
  starterImg &&
  bloodImg &&
  denziImg &&
  mainText &&
  secondText &&
  starterMusic &&
  bombSound &&
  rattleSound
) {
  const PIN_MOVE_DURATION = 1000;

  const PIN_DELAY_DURATION = 1000;

  const BOOM_ANIMATION_DURATION = 1000;

  const REZE_APPEAR_DURATION = 1500;

  const TITLE_DELAY = 500;

  const TEXT_APPEAR_DELAY = 1000;

  const TEXT_INTERVAL = 1000;

  const STARTER_MOVE_DURATION = 600;

  const STARTER_MOVE_DISTANCE = 600; //

  const STARTER_DELAY_BEFORE_REMOVE = 1000;

  const BLOOD_DELAY = 200;

  const TIME_PINS_REMOVED = PIN_MOVE_DURATION + PIN_DELAY_DURATION;

  const TIME_TITLE_APPEARS =
    TIME_PINS_REMOVED + REZE_APPEAR_DURATION + TITLE_DELAY + 20;

  function removePin(e) {
    if (e.currentTarget.classList.contains("is-removed")) return;

    pins.forEach((pin) => pin.classList.add("is-removed"));

    pins.forEach((pin) => {
      pin.style.transform = "translateX(-400px)";
    });

    setTimeout(() => {
      pins.forEach((pin) => {
        pin.style.opacity = "0";
      });

      console.log("핀: 움직임 완료 및 투명화 (1s)");
    }, PIN_MOVE_DURATION);

    setTimeout(() => {
      pins.forEach((pin) => pin.remove());

      boomImg.style.display = "block";

      rezeImg.style.display = "block";

      setTimeout(() => {
        boomImg.style.transform = "translateX(50px)";

        boomImg.style.opacity = "0";

        bombSound.currentTime = 0;

        bombSound

          .play()

          .catch((error) => console.warn("Bomb 사운드 재생 실패:", error));

        rezeImg.style.opacity = "1";
      }, 10);

      setTimeout(() => {
        boomImg.remove();

        console.log("Boom 이미지 제거 완료 (3s)");
      }, BOOM_ANIMATION_DURATION + 20);

      setTimeout(() => {
        titleImg.style.display = "block";

        titleImg.style.opacity = "1";

        console.log("Title 이미지 서서히 등장 완료 (4.52s)");
      }, TIME_TITLE_APPEARS);

      const TIME_FIRST_TEXT_APPEARS = TIME_TITLE_APPEARS + TEXT_APPEAR_DELAY;

      setTimeout(() => {
        $("#main-text").show();

        setTimeout(() => {
          mainText.style.opacity = "1";

          console.log(`'きみだけ' 등장 (T=${TIME_FIRST_TEXT_APPEARS / 500}s)`);
        }, 10);

        const TIME_SECOND_TEXT_APPEARS = TEXT_INTERVAL;

        setTimeout(() => {
          $("#second-text").show();

          setTimeout(() => {
            secondText.style.opacity = "1";

            console.log(
              `'大正解' 등장 (T=${
                (TIME_FIRST_TEXT_APPEARS + TEXT_INTERVAL) / 400
              }s)`
            );
          }, 10);
        }, TIME_SECOND_TEXT_APPEARS);
      }, TIME_FIRST_TEXT_APPEARS);
    }, TIME_PINS_REMOVED);
  }

  function moveAndRemoveStarter(e) {
    const target = e.currentTarget;

    if (target.classList.contains("is-moving")) return;

    target.classList.add("is-moving");

    starterMusic.play().catch((error) => {
      console.error("오디오 재생 실패:", error);
    });

    target.style.transform = `translateX(${STARTER_MOVE_DISTANCE}px)`;

    setTimeout(() => {
      bloodImg.style.display = "block";

      bloodImg.style.transform = `translateX(400px)`;

      bloodImg.style.opacity = "1";

      console.log("Blood 이미지 등장 및 X축 400px 이동 시작.");

      setTimeout(() => {
        bloodImg.remove();

        console.log("Blood 이미지 제거 완료 (T=1.22s).");

        denziImg.style.display = "block";

        setTimeout(() => {
          denziImg.style.opacity = "1";

          denziImg.style.transform = "translateX(0)";

          console.log("Denzi 이미지 서서히 등장 및 X축 이동 시작.");
        }, 10);
      }, BOOM_ANIMATION_DURATION + 20);
    }, BLOOD_DELAY);

    setTimeout(() => {
      target.style.opacity = "0";
    }, STARTER_MOVE_DURATION + STARTER_DELAY_BEFORE_REMOVE);

    const REMOVE_TIME_MS =
      STARTER_MOVE_DURATION + STARTER_DELAY_BEFORE_REMOVE + 200;

    setTimeout(() => {
      target.remove();

      console.log("Starter 이미지 제거 완료 (T=1.8s).");
    }, REMOVE_TIME_MS);
  }

  pins.forEach((pin) => {
    pin.addEventListener("click", removePin);

    $(pin).hover(
      function () {
        rattleSound.currentTime = 0;

        rattleSound.play().catch((error) => {
          console.warn("Rattle 사운드 재생 실패:", error);
        });
      },

      function () {
        rattleSound.pause();
      }
    );
  });

  starterImg.addEventListener("click", moveAndRemoveStarter);
}
