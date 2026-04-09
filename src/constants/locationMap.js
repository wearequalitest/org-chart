export const flagMap = {
  NY: "us",
  SF: "us",
  USA: "us",
  US: "us",
  LON: "gb",
  UK: "gb",
  BER: "de",
  FR: "fr",
  JP: "jp",
  SG: "sg",
  LIS: "pt",
  IL: "il",
  IND: "in",
  MEX: "mx",
  ROM: "ro",
};

export const getFlagClass = (locString) => {
  const code = flagMap[locString.toUpperCase()];
  return code ? `fi fi-${code}` : "";
};
