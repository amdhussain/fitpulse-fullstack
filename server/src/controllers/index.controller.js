const indexController = {
  getRoot: (req, res) => {
    res.status(200).json({
      success: true,
      message: "Professional Fitness Booking Platform API Running Successfully",
    });
  },
};

module.exports = indexController;
