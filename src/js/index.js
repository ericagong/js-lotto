import createInputConverter from "./UI/createInputConverter.js";
import createLottoMachine from "../js/domain/models/LottoMachine/createLottoMachine.js";

const { convertToMatchingDataType } = createInputConverter();

const $ = (selector) => document.querySelector(selector);
const $issueLottoForm = $("#issue-lotto-form");
const $purchasingPriceInput = $("#purchasing-price-input");
const $lottosCount = $("#lottos-count");
const $lottosView = $("#lottos-view");

let lottos;

$issueLottoForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const purchasingPrice = convertToMatchingDataType(
    $purchasingPriceInput.value
  );
  try {
    const { issueLottoOf } = createLottoMachine();
    lottos = issueLottoOf(purchasingPrice);
    $lottosCount.innerText = `총 ${lottos.length}개를 구매하였습니다.`;
    const issuedLottosContent = lottos
      .map((lotto) => `<span class="mx-1 text-4xl">🎟️ </span>`)
      .join("");
    $lottosView.innerHTML = issuedLottosContent;
  } catch (error) {
    window.alert(error.message + "구입 금액을 다시 입력해주세요.");
    $purchasingPriceInput.value = "";
    $lottosCount.innerText = "";
    $lottosView.innerHTML = "";
  }
});

const $showResultButton = document.querySelector(".open-result-modal-button");
const $modalClose = document.querySelector(".modal-close");
const $modal = document.querySelector(".modal");
const $lottoNumbersToggleButton = document.querySelector(
  ".lotto-numbers-toggle-button"
);

const onModalShow = () => {
  $modal.classList.add("open");
};

const onModalClose = () => {
  $modal.classList.remove("open");
};

$showResultButton.addEventListener("click", onModalShow);
$modalClose.addEventListener("click", onModalClose);
