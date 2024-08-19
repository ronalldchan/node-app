import express, { Request, Response } from "express";
import pool from "../db";
import { isValid } from "date-fns";
import { EventController } from "../controllers/eventController";
import { generateNRandomId, getUtcDateTime } from "../utils";
import { UserController } from "../controllers/userController";

const router = express.Router();

const eventController: EventController = new EventController();
const userController: UserController = new UserController();

router
    .route("/")
    // .get(async (req: Request, res: Response) => {
    //     try {
    //         const [rows] = await pool.query("SELECT * FROM events");
    //         res.status(200).json(rows);
    //     } catch (error: any) {
    //         res.status(500).json({ error: error.message });
    //     }
    // })
    .post(eventController.createEvent);

router.route("/:eventId").get(eventController.getEvent);

router
    .route("/:eventId/users")
    .get(userController.getUsersFromEvent)
    .post(async (req: Request, res: Response) => {
        try {
            const sql: string = "insert into users values (?, ?, ?)";
            const name: string = req.body.name;
            const user_id: number = generateNRandomId(8);
            const event_id: number = parseInt(req.params.id);
            await pool.query(sql, [user_id, event_id, name]);
            res.status(200).json({
                message: "User added successfully",
                data: { user_id: user_id, event_id: event_id, name: name },
            });
        } catch (error: any) {
            switch (error.code) {
                case "ER_DUP_ENTRY":
                    res.status(409).json({ error: "Duplicate entry detected" });
                    break;
                case "ER_NO_REFERENCED_ROW_2":
                    res.status(404).json({ error: `No event with ID ${req.params.id}` });
                    break;
                default:
                    res.status(500).json({ error: error.message });
            }
        }
    });

router
    .route("/:eventId/users/:user_id") // drop this route? this isnt needed since events route returns the user and availability information from the request
    .get(async (req: Request, res: Response) => {
        try {
            const userSql = "SELECT * FROM users where user_id = ?";
            const availSql = "select available from availability where user_id = ?";
            const [userRows]: any[] = await pool.query(userSql, [req.params.user_id]);
            if (userRows.length == 0) {
                res.status(404).json({ error: "Resource not found" });
            }
            const [availRows]: any[] = await pool.query(availSql, [req.params.user_id]);
            const availability: string[] = availRows.map((val: any) => val.available);
            res.status(200).json({ ...userRows[0], availability: availability });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    })
    .put(async (req: Request, res: Response) => {
        const times: string[] = req.body.availability;
        const timezone: string = req.body.timezone;
        const dates: Date[] = times.map((time) => getUtcDateTime(time, timezone));
        if (dates.some((date: Date) => !isValid(date))) {
            res.status(400).json({ error: "Datetime or Timezone information is invalid" });
            return;
        }
        dates.forEach((date: Date) => {});
        const sql = "insert into availability values (user_id, available) values (?, ?)";
        const [rows]: any[] = await pool.query(sql, [req.params]);
    });

export default router;
