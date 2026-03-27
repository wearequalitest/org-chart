export const flagMap = {
  NY: "us",
  SF: "us",
  USA: "us",
  LON: "gb",
  UK: "gb",
  BER: "de",
  PAR: "fr",
  TOK: "jp",
  SIN: "sg",
  PRT: "pt",
  ISR: "il",
  IND: "in",
  MEX: "mx",
  ROU: "ro",
};

export const getFlagClass = (locString) => {
  const code = flagMap[locString.toUpperCase()];
  return code ? `fi fi-${code}` : "";
};
