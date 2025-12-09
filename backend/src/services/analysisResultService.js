const AnalysisResult = require('../domain/models/AnalysisResult');

const createAnalysisResult = async ({ request_id, pdf_url, analysis_type }) => {
  const result = await AnalysisResult.create({ request_id, pdf_url, analysis_type });
  return result;
};

module.exports = { createAnalysisResult };
