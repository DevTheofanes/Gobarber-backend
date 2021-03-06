import { startOfDay, endOfDay, parseISO } from "date-fns";
import { Op } from "sequelize";
import User from "../models/User";
import Appointment from "../models/Appointment";
class ScheduleController {
  async index(req, res) {
    const isProvider = await User.findOne({
      where: { id: req.userId, provider: true }
    });
    if (!isProvider) {
      return res.status(401).json({ error: "User is not a Provider" });
    }
    const { date } = req.query;
    const parsedDate = parseISO(date);
    const schedules = await Appointment.findAll({
      where: {
        provider_id: req.userId,
        canceled_at: null,
        date: {
          [Op.between]: [startOfDay(parsedDate), endOfDay(parsedDate)]
        }
      },
      order: ["date"],
      attributes: ["id", "date"]
    });
    return res.json(schedules);
  }
}
export default new ScheduleController();
