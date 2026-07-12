const healthController = {
  getHealth: (req, res) => {
    res.status(200).json({ status: "ok" });
  },
};

module.exports = healthController;
