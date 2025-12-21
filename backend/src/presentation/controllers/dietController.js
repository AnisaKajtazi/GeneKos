const dietService = require("../../services/dietService");

exports.createDiet = async (req, res) => {
  try {
    const diet = await dietService.createDiet(req.body, req.user);
    return res.status(201).json(diet);
  } catch (err) {
    return res.status(err.status || 500).json({ message: err.message || "Server error" });
  }
};

exports.getUserDiets = async (req, res) => {
  try {
    const diets = await dietService.getUserDiets(req.params.userId);
    return res.json({ diets });
  } catch (err) {
    return res.status(err.status || 500).json({ message: err.message || "Server error" });
  }
};

exports.getDietById = async (req, res) => {
  try {
    const diet = await dietService.getDietById(req.params.id);
    return res.json(diet);
  } catch (err) {
    return res.status(err.status || 500).json({ message: err.message || "Server error" });
  }
};

exports.getAllDiets = async (req, res) => {
  try {
    const diets = await dietService.getAllDiets();
    return res.json({ diets });
  } catch (err) {
    return res.status(err.status || 500).json({ message: err.message || "Server error" });
  }
};

exports.updateDiet = async (req, res) => {
  try {
    const diet = await dietService.updateDiet(req.params.id, req.body);
    return res.json(diet);
  } catch (err) {
    return res.status(err.status || 500).json({ message: err.message || "Server error" });
  }
};

exports.deleteDiet = async (req, res) => {
  try {
    await dietService.deleteDiet(req.params.id);
    return res.json({ message: "Diet deleted successfully" });
  } catch (err) {
    return res.status(err.status || 500).json({ message: err.message || "Server error" });
  }
};
