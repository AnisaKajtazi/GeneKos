const Diet = require("../../domain/models/Diet");
const AppointmentRequest = require("../../domain/models/AppointmentRequest");

exports.createDiet = async (req, res) => {
  try {
    const { user_id, request_id, diet_plan, analysis_id } = req.body;

    if (!user_id || !diet_plan)
      return res.status(400).json({ message: "User ID and diet plan are required" });
    
    if (request_id) {
      const appointment = await AppointmentRequest.findOne({
        where: { id: request_id, user_id },
      });
      if (!appointment)
        return res.status(404).json({ message: "Appointment not found for this user" });
    }

    const diet = await Diet.create({ user_id, request_id, diet_plan, analysis_id });
    return res.status(201).json({ message: "Diet added successfully", diet });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};


exports.getUserDiets = async (req, res) => {
  try {
    const { userId } = req.params;

    const diets = await Diet.findAll({
      where: { user_id: userId },
      order: [["createdAt", "DESC"]],
    });

    return res.json({ diets });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.getDietById = async (req, res) => {
  try {
    const { id } = req.params;
    const diet = await Diet.findByPk(id);

    if (!diet) return res.status(404).json({ message: "Diet not found" });

    return res.json({ diet });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.updateDiet = async (req, res) => {
  try {
    const { id } = req.params;
    const { diet_plan } = req.body;

    const diet = await Diet.findByPk(id);
    if (!diet) return res.status(404).json({ message: "Diet not found" });

    diet.diet_plan = diet_plan || diet.diet_plan;
    await diet.save();

    return res.json({ message: "Diet updated successfully", diet });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.deleteDiet = async (req, res) => {
  try {
    const { id } = req.params;

    const diet = await Diet.findByPk(id);
    if (!diet) return res.status(404).json({ message: "Diet not found" });

    await diet.destroy();
    return res.json({ message: "Diet deleted successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};
