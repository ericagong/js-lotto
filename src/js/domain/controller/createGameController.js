import createLottoPlatform from "../models/LottoPlatform/createLottoPlatform.js";
import View from "../../UI/View.js";
import { PurchasingPriceError } from "../models/LottoMachine/errors.js";
import { LottoNumbersError } from "../models/Lotto/errors.js";
import { BonusNumberError } from "../models/WinningLotto/errors.js";
import { RetryError } from "../models/LottoPlatform/errors.js";

const createGameController = () => {
  let view = new View();
  let lottos;
  let winningLotto;

  const { issueLottos, getLottoWithWinningNumbers, getRanks, getStatistics } =
    createLottoPlatform();

  const displayIssuedLottos = (lottos) => {
    view.printLine(`${lottos.length}개를 구매했습니다.`);
    lottos.forEach((targetLotto) => view.printLine(targetLotto.display()));
    view.printLine("");
  };

  const displayLottoStatistics = (rankCount, revenueRate) => {
    view.printStatistics(rankCount, revenueRate);
  };

  const gameStep1 = async () => {
    await view.addPurchasingPriceHandler((purchasingPrice) => {
      lottos = issueLottos(purchasingPrice);
      displayIssuedLottos(lottos);
    });
  };

  const gameStep2 = async () => {
    await view.addWinningNumberHandler((winningNumbers) => {
      winningLotto = getLottoWithWinningNumbers(winningNumbers);
    });
  };

  const gameStep3 = async () => {
    await view.addBonusNumberHandler((bonusNumber) => {
      const ranks = getRanks(winningLotto, bonusNumber, lottos);
      const { rankCount, revenueRate } = getStatistics(ranks);
      displayLottoStatistics(rankCount, revenueRate);
    });
  };

  const gameStep4 = async () => {
    await view.addRetryHandler((retry) => {
      switch (retry) {
        case "y":
          runUntilFinish();
          break;
        case "n":
          process.exit();
        default:
          throw new RetryError();
      }
    });
  };

  const runGameStep = async (step) => {
    switch (step) {
      case 1:
        await gameStep1();
        break;
      case 2:
        await gameStep2();
        break;
      case 3:
        await gameStep3();
        break;
      case 4:
        await gameStep4();
      default:
        return;
    }
  };

  const runOnce = async () => {
    try {
      await runGameStep(1);
      await runGameStep(2);
      await runGameStep(3);
    } catch (error) {
      view.printLine(error.message);
    } finally {
      view.close();
    }
  };

  const runUntilFinish = async () => {
    let step = 1;

    try {
      while (step !== 5) {
        try {
          await runGameStep(step);
          step += 1;
        } catch (error) {
          view.printLine(error.message);
          if (error instanceof PurchasingPriceError) step = 1;
          if (error instanceof LottoNumbersError) step = 2;
          if (error instanceof BonusNumberError) step = 3;
          if (error instanceof RetryError) step = 4;
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return { runOnce, runUntilFinish };
};

export default createGameController;
