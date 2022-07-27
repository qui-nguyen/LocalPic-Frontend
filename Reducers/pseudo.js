export const userPseudo = (userPseudo = "", action) => {
  switch (action.type) {
    case "savePseudo":
      return action.pseudo;
    default:
      return userPseudo;
  }
};
