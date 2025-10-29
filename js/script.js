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
  secondText && // 두 번째 텍스트 요소 확인
  starterMusic &&
  bombSound &&
  rattleSound
) {
  // --- 시간 상수 정의 ---

  const PIN_MOVE_DURATION = 1000; // 핀 이동 시간 (1s)

  const PIN_DELAY_DURATION = 1000; // 핀 이동 후 대기 시간 (1s)

  const BOOM_ANIMATION_DURATION = 1000; // Boom/Blood 애니메이션 시간 (1s)

  const REZE_APPEAR_DURATION = 1500; // Reze/Title 등장 애니메이션 시간 (1.5s)

  const TITLE_DELAY = 500; // Reze 완료 후 Title 대기 시간 (0.5s)

  // 🌟 텍스트 등장 타이밍 상수 정의

  const TEXT_APPEAR_DELAY = 1000; // Title 등장 후 첫 번째 텍스트 등장까지의 지연 시간 (1s)

  const TEXT_INTERVAL = 1000; // 첫 번째 텍스트 등장 후 두 번째 텍스트 등장까지의 지연 시간 (1s)

  const STARTER_MOVE_DURATION = 600; // Starter 이동 시간 (0.6s)

  const STARTER_MOVE_DISTANCE = 600; // Starter 이동 거리 (600px)

  const STARTER_DELAY_BEFORE_REMOVE = 1000; // Starter 투명화 지연 시간 (1s)

  const BLOOD_DELAY = 200; // Blood 등장 지연 시간 (0.2s) // 주요 시점 계산

  const TIME_PINS_REMOVED = PIN_MOVE_DURATION + PIN_DELAY_DURATION; // 2s

  const TIME_TITLE_APPEARS =
    TIME_PINS_REMOVED + REZE_APPEAR_DURATION + TITLE_DELAY + 20; // 약 4.52s // ------------------------------------------------------------------ // A. PIN & BOOM & REZE & TITLE 시퀀스 (pin 클릭 시) // ------------------------------------------------------------------

  function removePin(e) {
    if (e.currentTarget.classList.contains("is-removed")) return;

    pins.forEach((pin) => pin.classList.add("is-removed")); // 핀 이동 시작

    pins.forEach((pin) => {
      pin.style.transform = "translateX(-400px)";
    }); // 1. (1초 시점) 핀 투명화 시작

    setTimeout(() => {
      pins.forEach((pin) => {
        pin.style.opacity = "0";
      });

      console.log("핀: 움직임 완료 및 투명화 (1s)");
    }, PIN_MOVE_DURATION); // 2. (총 2초 시점) 핀 제거 및 BOOM/REZE 동시 등장 준비

    setTimeout(() => {
      // A. 기존 핀 제거

      pins.forEach((pin) => pin.remove()); // B. BOOM/REZE 동시 등장 시작

      boomImg.style.display = "block";

      rezeImg.style.display = "block"; // 10ms 지연 후 애니메이션 발동

      setTimeout(() => {
        boomImg.style.transform = "translateX(50px)";

        boomImg.style.opacity = "0";

        bombSound.currentTime = 0;

        bombSound

          .play()

          .catch((error) => console.warn("Bomb 사운드 재생 실패:", error));

        rezeImg.style.opacity = "1";
      }, 10); // 3. (총 3초 시점) Boom 제거

      setTimeout(() => {
        boomImg.remove();

        console.log("Boom 이미지 제거 완료 (3s)");
      }, BOOM_ANIMATION_DURATION + 20); // 4. (총 4.52초 시점) Title 이미지 서서히 등장

      setTimeout(() => {
        titleImg.style.display = "block";

        titleImg.style.opacity = "1";

        console.log("Title 이미지 서서히 등장 완료 (4.52s)");
      }, TIME_TITLE_APPEARS);

      // 🌟 5. 첫 번째 텍스트 ("きみだけ") 등장 (Title 등장 완료 후 1초 지연)

      const TIME_FIRST_TEXT_APPEARS = TIME_TITLE_APPEARS + TEXT_APPEAR_DELAY;

      setTimeout(() => {
        $("#main-text").show(); // jQuery .show() 사용

        setTimeout(() => {
          mainText.style.opacity = "1"; // CSS transition 발동

          console.log(`'きみだけ' 등장 (T=${TIME_FIRST_TEXT_APPEARS / 500}s)`);
        }, 10);

        // 🌟 6. 두 번째 텍스트 ("大正解") 등장 (첫 번째 텍스트 등장 후 1초 지연)

        const TIME_SECOND_TEXT_APPEARS = TEXT_INTERVAL;

        setTimeout(() => {
          $("#second-text").show(); // jQuery .show() 사용

          setTimeout(() => {
            secondText.style.opacity = "1"; // CSS transition 발동

            console.log(
              `'大正解' 등장 (T=${
                (TIME_FIRST_TEXT_APPEARS + TEXT_INTERVAL) / 400
              }s)`
            );
          }, 10);
        }, TIME_SECOND_TEXT_APPEARS);
      }, TIME_FIRST_TEXT_APPEARS);
    }, TIME_PINS_REMOVED);
  } // ------------------------------------------------------------------ // B. STARTER & BLOOD & DENZI 시퀀스 (starter 클릭 시) // ------------------------------------------------------------------

  function moveAndRemoveStarter(e) {
    const target = e.currentTarget;

    if (target.classList.contains("is-moving")) return;

    target.classList.add("is-moving"); // 🎧 MP3 재생 시작

    starterMusic.play().catch((error) => {
      console.error("오디오 재생 실패:", error);
    }); // 1. starter 이동 시작 (0.6s)

    target.style.transform = `translateX(${STARTER_MOVE_DISTANCE}px)`; // 2. 0.2초 후 blood.png 애니메이션 시작

    setTimeout(() => {
      bloodImg.style.display = "block"; // X축 400px 이동 (1s 동안)

      bloodImg.style.transform = `translateX(400px)`;

      bloodImg.style.opacity = "1";

      console.log("Blood 이미지 등장 및 X축 400px 이동 시작."); // 3. (총 1.22초 시점) Blood 제거 후 Denzi 등장 시작

      setTimeout(() => {
        bloodImg.remove();

        console.log("Blood 이미지 제거 완료 (T=1.22s)."); // ⭐ Denzi 등장 시작 (T=1.22s) ⭐

        denziImg.style.display = "block"; // 10ms 지연을 주어 CSS transition이 적용되도록 함

        setTimeout(() => {
          denziImg.style.opacity = "1"; // 1.5초에 걸쳐 서서히 등장

          denziImg.style.transform = "translateX(0)"; // X축 이동 애니메이션 발동

          console.log("Denzi 이미지 서서히 등장 및 X축 이동 시작.");
        }, 10);
      }, BOOM_ANIMATION_DURATION + 20);
    }, BLOOD_DELAY); // 4. starter 투명화 (T=1.6s 시점)

    setTimeout(() => {
      target.style.opacity = "0";
    }, STARTER_MOVE_DURATION + STARTER_DELAY_BEFORE_REMOVE); // 5. starter DOM에서 완전히 제거 (T=1.8s 시점)

    const REMOVE_TIME_MS =
      STARTER_MOVE_DURATION + STARTER_DELAY_BEFORE_REMOVE + 200; // 0.6s + 1s + 0.2s = 1.8s

    setTimeout(() => {
      target.remove();

      console.log("Starter 이미지 제거 완료 (T=1.8s).");
    }, REMOVE_TIME_MS);
  } // ------------------ 2. 이벤트 리스너 연결 ------------------

  pins.forEach((pin) => {
    pin.addEventListener("click", removePin);

    // pin 호버 이벤트 (rattle 사운드 재생)

    $(pin).hover(
      function () {
        // mouseenter (마우스 진입)

        rattleSound.currentTime = 0; // 사운드 초기화

        rattleSound.play().catch((error) => {
          console.warn("Rattle 사운드 재생 실패:", error);
        });
      },

      function () {
        // mouseleave (마우스 이탈)

        rattleSound.pause(); // 마우스가 떠나면 사운드 일시정지
      }
    );
  });

  starterImg.addEventListener("click", moveAndRemoveStarter);
}
