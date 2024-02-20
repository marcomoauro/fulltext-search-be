import log from "../log.js";
import ESSummary from "../elasticsearch-models/Summary.js";

export const searchSummaries = async ({search}) => {
  log.info('Controller::Summaries::searchSummaries', {search});

  const summaries = await ESSummary.list(search);

  return summaries
}