import createInputConverter from "./UI/createInputConverter.js";
import createLottoMachine from "../js/domain/models/LottoMachine/createLottoMachine.js";

const { convertToMatchingDataType } = createInputConverter();

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

const $issueLottoForm = $("#issue-lotto-form");
const $purchasingPriceInput = $("#purchasing-price-input");
const $lottosCount = $("#lottos-count");
const $lottosView = $("#lottos-view");
const $switch = $(".switch");
const $lottoNumbersToggleButton = $("#lotto-numbers-toggle-button");
const $winningLottoForm = $("#winning-lotto-form");
const $showResultButton = $(".open-result-modal-button");
const $modalClose = $(".modal-close");
const $modal = $(".modal");

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
      .map(
        (lotto) => `
				<span class="mx-1 text-4xl">🎟️ 
					<span class="d-none text-base lotto-numbers">
						${lotto.display().join(", ")}
					</span>
				</span>`
      )
      .join("");
    $lottosView.innerHTML = issuedLottosContent;
    $switch.classList.remove("d-none");
  } catch (error) {
    window.alert(error.message + "구입 금액을 다시 입력해주세요.");
    $purchasingPriceInput.value = "";
    $lottosCount.innerText = "";
    $lottosView.innerHTML = "";
    $switch.classList.add("d-none");
  }
});

$lottoNumbersToggleButton.addEventListener("click", () => {
  $lottosView.classList.toggle("flex-wrap");
  $lottosView.classList.toggle("flex-col");
  const $$lottoNumbers = $$(".lotto-numbers");
  $$lottoNumbers.forEach(($lottoNumber) => {
    $lottoNumber.classList.toggle("d-none");
  });
});

const onModalShow = () => {
  $modal.classList.add("open");
};

const onModalClose = () => {
  $modal.classList.remove("open");
};

$showResultButton.addEventListener("click", onModalShow);
$modalClose.addEventListener("click", onModalClose);
