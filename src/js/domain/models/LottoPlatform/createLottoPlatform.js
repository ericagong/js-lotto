import createLottoMachine from "../LottoMachine/createLottoMachine.js";
import Lotto from "../Lotto/index.js";
import WinningLotto from "../WinningLotto/index.js";
import createStatistics from "../createStatistics.js";
import { RetryError } from "./errors.js";

const createLottoPlatform = () => {
  const issueLottos = (purchasingPrice) => {
    const { issueLottoOf } = createLottoMachine();
    return issueLottoOf(purchasingPrice);
  };

  const getLottoWithWinningNumbers = (winningNumbers) => {
    return Lotto.of(winningNumbers);
  };

  const getRanks = (lottoWithWinningNumber, bonusNumber, lottos) => {
    const winningLotto = WinningLotto.from(lottoWithWinningNumber, bonusNumber);

    let ranks = [];
    lottos.forEach((targetLotto) => {
      ranks.push(winningLotto.getRank(targetLotto));
    });
    return ranks;
  };

  const getStatistics = (ranks) => {
    const { countRanks, calculateRevenue } = createStatistics();
    const rankCount = countRanks(ranks);
    const revenueRate = calculateRevenue(ranks);
    return { rankCount, revenueRate };
  };

  return {
    issueLottos,
    getLottoWithWinningNumbers,
    getRanks,
    getStatistics,
  };
};

export default createLottoPlatform;
