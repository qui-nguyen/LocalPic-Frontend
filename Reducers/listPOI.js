export const listPOI = (POIList = [], action) => {
  switch (action.type) {
    case "savePOI":
      return [...POIList, action.newPOI];

    case "getListPOI":
      return action.POIs;

    case "deletePOI":
      return POIList.filter((POI) => {
        return POI !== action.marker;
      });

    default:
      return POIList;
  }
};
