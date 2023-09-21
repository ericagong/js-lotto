import createInputConverter from "./UI/createInputConverter.js";
import createLottoMachine from "../js/domain/models/LottoMachine/createLottoMachine.js";
import Lotto from "./domain/models/Lotto/index.js";
import WinningLotto from "./domain/models/WinningLotto/index.js";
import { LottoNumbersError } from "./domain/models/Lotto/errors.js";
import { BonusNumberError } from "./domain/models/WinningLotto/errors.js";
import createStatistics from "./domain/models/createStatistics.js";

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
const $$winningNumbers = $$(".winning-number");
const $bonusNumber = $(".bonus-number");
const $modal = $(".modal");
const $modalClose = $(".modal-close");
const $$rankCounts = $$(".rank-count");
const $totalRevenue = $("#total-revenue");
const $showResultButton = $(".open-result-modal-button");
const $restartButton = $("#restart-button");

let lottos = [];

const issueLottos = (purchasingPrice) => {
  const { issueLottoOf } = createLottoMachine();
  lottos = issueLottoOf(purchasingPrice);
};

const renderIssuedLottosView = () => {
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
  $winningLottoForm.classList.remove("d-none");
};

const resetIssuedLottosView = () => {
  $purchasingPriceInput.value = "";
  $lottosCount.innerText = "";
  $lottosView.innerHTML = "";
  $switch.classList.add("d-none");
  $lottoNumbersToggleButton.checked = false;
  $winningLottoForm.classList.add("d-none");
};

const alertError = (error, extraMessage = "") => {
  window.alert(`${extraMessage}\n ${error.message}`);
};

$issueLottoForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const purchasingPrice = convertToMatchingDataType(
    $purchasingPriceInput.value
  );

  try {
    issueLottos(purchasingPrice);
    renderIssuedLottosView();
  } catch (error) {
    const MESSAGE = "구입 금액을 다시 입력해주세요.";
    alertError(error, MESSAGE);
    resetIssuedLottosView();
  }
});

const toggleLottoNumbersView = () => {
  $lottosView.classList.toggle("flex-wrap");
  $lottosView.classList.toggle("flex-col");
  const $$lottoNumbers = $$(".lotto-numbers");
  $$lottoNumbers.forEach(($lottoNumber) => {
    $lottoNumber.classList.toggle("d-none");
  });
};

$lottoNumbersToggleButton.addEventListener("click", toggleLottoNumbersView);

const onModalShow = () => {
  $modal.classList.add("open");
};

const onModalClose = () => {
  $modal.classList.remove("open");
};

const getLottoStatistics = (winningNumbers, bonusNumber) => {
  const lottoWithWinningNumber = Lotto.of(winningNumbers);
  const winningLotto = WinningLotto.from(lottoWithWinningNumber, bonusNumber);

  let ranks = [];
  lottos.forEach((targetLotto) => {
    ranks.push(winningLotto.getRank(targetLotto));
  });

  const { countRanks, calculateRevenue } = createStatistics();
  const rankCount = countRanks(ranks);
  const winningRankCount = rankCount.slice(0, rankCount.length - 1).reverse();
  const revenueRate = calculateRevenue(ranks);

  return [winningRankCount, revenueRate];
};

const renderStatisticsView = (winningRankCount, revenueRate) => {
  Array.from($$rankCounts).forEach(($rankCount, idx) => {
    $rankCount.innerText = `${winningRankCount[idx]}개`;
  });
  $totalRevenue.innerText = `당신의 총 수익률은 ${revenueRate}%입니다.`;
};

const resetWinningNumbersInputView = () => {
  $$winningNumbers.forEach(($winningNumber) => ($winningNumber.value = ""));
};

const resetBonusNumberInputView = () => {
  $bonusNumber.value = "";
};

$showResultButton.addEventListener("click", () => {
  const winningNumbers = Array.from($$winningNumbers).map(($winningNumber) =>
    convertToMatchingDataType($winningNumber.value)
  );

  const bonusNumber = convertToMatchingDataType($bonusNumber.value);
  try {
    const [winningRankCount, revenueRate] = getLottoStatistics(
      winningNumbers,
      bonusNumber
    );
    renderStatisticsView(winningRankCount, revenueRate);

    onModalShow();
  } catch (error) {
    if (error instanceof LottoNumbersError) {
      alertError(error, "당첨 번호 6자리를 다시 입력해주세요.");
      resetWinningNumbersInputView();
    }
    if (error instanceof BonusNumberError) {
      alertError(error, "보너스 번호를 다시 입력해주세요.");
      resetBonusNumberInputView();
    }
  }
});

$modalClose.addEventListener("click", onModalClose);

$restartButton.addEventListener("click", () => {
  lottos = [];
  onModalClose();
  resetIssuedLottosView();
  resetWinningNumbersInputView();
  resetBonusNumberInputView();
});
