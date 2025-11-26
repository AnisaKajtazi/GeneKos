const AnalysisResult = require('../models/AnalysisResult');

const createAnalysisResult = async ({ request_id, pdf_url }) => {
  const result = await AnalysisResult.create({ request_id, pdf_url });
  return result;
};

module.exports = { createAnalysisResult };
