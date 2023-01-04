const optionalChaning = obj => {
  try {
    return obj();
  } catch (e) {
    return "";
  }
};

export { optionalChaning };
