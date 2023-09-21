import { RANKS, LOTTO_UNIT_PRICE } from "../constants.js";

const createStatistics = () => {
  const DECIMAL_POINT = 2;
  const REGEX_NUMERIC = /.\d+0/;

  const countRanks = (ranks) => {
    const rankCounts = new Map([
      [RANKS.FIRST, 0],
      [RANKS.SECOND, 0],
      [RANKS.THIRD, 0],
      [RANKS.FOURTH, 0],
      [RANKS.FIFTH, 0],
      [RANKS.NONE, 0],
    ]);

    ranks.forEach((rank) => {
      const key = rank.getRank();
      rankCounts.set(key, rankCounts.get(key) + 1);
    });

    return Array.from(rankCounts.values());
  };

  const roundToSecondDecimalPoint = (number) => {
    if (Number.isInteger(number)) return number.toString();

    const formatted = number.toFixed(DECIMAL_POINT);

    return REGEX_NUMERIC.test(formatted) ? formatted.slice(0, -1) : formatted;
  };

  const calculateRevenue = (ranks) => {
    const totalPurchased = LOTTO_UNIT_PRICE * ranks.length;

    const totalRevenue = ranks.reduce((acc, rank) => {
      return acc + rank.getPrize();
    }, 0);

    const revenueRate = (totalRevenue / totalPurchased) * 100;
    return roundToSecondDecimalPoint(revenueRate);
  };

  return {
    countRanks,
    calculateRevenue,
  };
};

export default createStatistics;
