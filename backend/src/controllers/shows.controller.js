const ShowsService = require("../services/shows.service");

class ShowsController {
  static async list(req, res) {
    try {
      const shows = await ShowsService.getAllShows();
      res.json(shows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async details(req, res) {
    try {
      const id = req.params.id;
      const show = await ShowsService.getShowById(id);
      if (!show) return res.status(404).json({ error: "Show not found" });
      res.json(show);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async seats(req, res) {
    try {
      const id = req.params.id;
      const seats = await ShowsService.getSeatsForShow(id);
      res.json(seats);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async create(req, res) {
    try {
      const show = await ShowsService.createShow(req.body);
      res.status(201).json(show);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async update(req, res) {
    try {
      const show = await ShowsService.getShowById(req.params.id);
      if (!show) {
        return res.status(404).json({ error: "Show not found" });
      }

      await ShowsService.updateShow(req.params.id, req.body);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }


  static async remove(req, res) {
    try {
      await ShowsService.deleteShow(req.params.id);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = ShowsController;
