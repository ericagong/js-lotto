const createInputConverter = () => {
  const REGEX_NUMBER = /^-?\d+(\.\d+)?$/;

  const convertToMatchingDataType = (input) => {
    if (input === "null") {
      return null;
    }
    if (input === "undefined") {
      return undefined;
    }
    if (REGEX_NUMBER.test(input)) {
      return parseFloat(input);
    }

    try {
      return JSON.parse(input);
    } catch (error) {
      // 그대로 반환 (문자열 유지)
      return input;
    }
  };

  const convertToArray = (input) => {
    return input
      .split(",")
      .map((element) => convertToMatchingDataType(element));
  };

  return {
    convertToMatchingDataType,
    convertToArray,
  };
};

export default createInputConverter;
