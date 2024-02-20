import axios from 'axios';
import { APIError400, APIError404 } from '../errors.js';
import log from '../log.js';

export default class ESSummary {
  video_id;
  video_title;
  video_author;
  language_code;
  value;
  constructor(properties) {
    Object.keys(this)
      .filter((k) => typeof this[k] !== 'function')
      .map((k) => (this[k] = properties[k]));
  }

  static fromESHit = (hit) => {
    const doc = hit._source;

    const summary = new ESSummary({
      video_id: doc.video_id,
      video_title: doc.video_title,
      video_author: doc.video_author,
      language_code: doc.language_code,
      value: doc.summary,
    });

    return summary;
  };

  static list = async (search) => {
    log.info('Model::ESSummary::list', { search });
    let body

    if (search) {
      body = {
        query: {
          match: {
            summary: search,
          },
        },
      };
    } else {
      body = {
        query: {
          match_all: {},
        },
      };
    }

    const { hits } = await ESSummary._callSearchEndpoint(body);

    const summaries = hits.hits.map(ESSummary.fromESHit);

    return summaries;
  };

  static _callSearchEndpoint = async (body) => {
    const { data } = await axios.post(`${process.env.ELASTIC_SEARCH_URL}/${process.env.ELASTIC_SEARCH_INDEX_SUMMARIES}/_search`, body, {
      headers: { 'Content-Type': 'application/json' },
    });

    return data;
  };

}
