const createInputConverter = () => {
  function convertToMatchingDataType(input) {
    if (input === "null") {
      return null;
    }
    if (input === "undefined") {
      return undefined;
    }
    if (/^-?\d+(\.\d+)?$/.test(input)) {
      // 숫자 변환
      return parseFloat(input);
    }

    try {
      return JSON.parse(input);
    } catch (error) {
      // 그대로 반환 (문자열 유지)
      return input;
    }
  }

  function convertToArray(input) {
    return input
      .split(",")
      .map((element) => convertToMatchingDataType(element));
  }

  return {
    convertToMatchingDataType,
    convertToArray,
  };
};

export default createInputConverter;
