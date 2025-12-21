const clinicUserService = require("../../services/clinicUserService");

exports.getAllClinicUsers = async (req, res) => {
  try {
    const result = await clinicUserService.getAllClinicUsers(req.query);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gabim serveri" });
  }
};

exports.createClinicUser = async (req, res) => {
  try {
    const newUser = await clinicUserService.createClinicUser(
      req.body,
      req.user
    );
    res.status(201).json(newUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gabim serveri" });
  }
};

exports.updateClinicUser = async (req, res) => {
  try {
    const updatedUser = await clinicUserService.updateClinicUser(
      req.params.id,
      req.body,
      req.user
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "Pacienti nuk u gjet" });
    }

    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gabim serveri" });
  }
};

exports.deleteClinicUser = async (req, res) => {
  try {
    const success = await clinicUserService.deleteClinicUser(
      req.params.id,
      req.user
    );

    if (!success) {
      return res.status(404).json({ message: "Pacienti nuk u gjet" });
    }

    res.json({ message: "Pacienti u fshi me sukses" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gabim serveri" });
  }
};
