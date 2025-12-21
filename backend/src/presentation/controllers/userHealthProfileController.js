const userHealthProfileService = require("../../services/userHealthProfileService");

exports.createProfile = async (req, res) => {
  try {
    const profile = await userHealthProfileService.createProfile(
      req.body,
      req.user
    );
    res.status(201).json(profile);
  } catch (err) {
    console.error(err);

    if (err.message) {
      return res.status(400).json({ message: err.message });
    }

    res.status(500).json({ message: "Server error" });
  }
};

exports.getProfileByUserId = async (req, res) => {
  try {
    const profiles = await userHealthProfileService.getProfileByUserId(
      req.params.userId
    );
    res.json(profiles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const updatedProfile = await userHealthProfileService.updateProfile(
      req.params.id,
      req.body,
      req.user
    );

    if (!updatedProfile) {
      return res.status(404).json({ message: "Profili nuk u gjet" });
    }

    res.json(updatedProfile);
  } catch (err) {
    console.error(err);

    if (err.message) {
      return res.status(400).json({ message: err.message });
    }

    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteProfile = async (req, res) => {
  try {
    const success = await userHealthProfileService.deleteProfile(
      req.params.id,
      req.user
    );

    if (!success) {
      return res.status(404).json({ message: "Profili nuk u gjet" });
    }

    res.json({ message: "Profili u fshi me sukses" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
