import Agenda from "agenda";
import mongoose from "mongoose";
import differenceInDays from "date-fns/differenceInDays";
import { loopConcurrently, mapConcurrently } from "@app/data/util";
import { CampaignRepo, Campaign } from "@app/data/campaign";
import { isToday } from "date-fns";
import { CampaignServ } from "@app/services/campaign";
import { UserRepo } from "@app/data/user";
import { DefaulterRepo } from "@app/data/defaulter";

/**
 * Freqeuncy for a recurring `ScheduleType`
 */
export enum Frequency {
  Daily = "daily",
  Weekly = "weekly",
  Monthly = "monthly"
}

export const Scheduler = new Agenda({
  //@ts-ignore
  mongo: mongoose.connection,
  db: {
    collection: "campaignJobs"
  }
});

export async function job(done?: (err?: Error) => void) {
  try {
    const campaigns = await CampaignRepo.all({});

    Scheduler.define("Start Scheduled Campaign", async () => {
      await loopConcurrently(campaigns, async c => {
        if (c.status == "STOP" && isToday(c.start_date)) {
          const defaulters = await DefaulterRepo.all({
            conditions: {
              request_id: c.target_audience
            }
          });

          await mapConcurrently(defaulters, async d => {
            await CampaignRepo.atomicUpdate(c.id, {
              $set: {
                status: "START"
              }
            });
          });
        }
      });
    });

    Scheduler.define("Stop Scheduled Campaign", async () => {
      await loopConcurrently(campaigns, async c => {
        const stop_hour = c.end_date.getHours();
        const today_hour = new Date().getHours();

        if (c.status == "START" && isToday(c.end_date) && stop_hour == today_hour) {
          await CampaignRepo.atomicUpdate(c.id, {
            $set: {
              status: "STOP"
            }
          });
        }
      });
    });

    async function runCampaign(c: Campaign) {
      const defaulters = await DefaulterRepo.all({
        conditions: {
          request_id: c.target_audience
        }
      });

      await mapConcurrently(defaulters, async d => {
        if (d.status !== "completed") {
          const user = await UserRepo.byID(d.user);
          await CampaignServ.send(c, user);
        }
      });
    }

    Scheduler.define("Run Campaign", async () => {
      await loopConcurrently(campaigns, async c => {
        const send_hour = c.start_date.getHours();
        const time_hour = new Date().getHours();

        if (c.status == "START" && !c.sent && differenceInDays(c.end_date, new Date()) > 1 && send_hour == time_hour) {
          await runCampaign(c);
        }
      });
    });

    Scheduler.define("Reset Daily Campaign", async () => {
      await loopConcurrently(campaigns, async c => {
        if (
          c.status == "START" &&
          c.sent &&
          c.frequency == Frequency.Daily &&
          differenceInDays(c.end_date, new Date()) > 1
        ) {
          await CampaignRepo.atomicUpdate(c.id, {
            $set: {
              sent: false
            }
          });
        }
      });
    });

    Scheduler.define("Reset Weekly Campaign", async () => {
      await loopConcurrently(campaigns, async c => {
        if (
          c.status == "START" &&
          c.sent &&
          c.frequency == Frequency.Weekly &&
          differenceInDays(c.end_date, new Date()) > 1
        ) {
          await CampaignRepo.atomicUpdate(c.id, {
            $set: {
              sent: false
            }
          });
        }
      });
    });

    Scheduler.define("Reset Monthly Campaign", async () => {
      await loopConcurrently(campaigns, async c => {
        if (
          c.status == "START" &&
          c.sent &&
          c.frequency == Frequency.Monthly &&
          differenceInDays(c.end_date, new Date()) > 1
        ) {
          await CampaignRepo.atomicUpdate(c.id, {
            $set: {
              sent: false
            }
          });
        }
      });
    });

    const start = await Scheduler.create("Start Scheduled Campaign", null);
    const stop = await Scheduler.create("Stop Scheduled Campaign", null);
    const run = await Scheduler.create("Run Campaign", null);
    const resetWeekly = await Scheduler.create("Reset Daily Campaign", null);
    const resetMonthly = await Scheduler.create("Reset Weekly Campaign", null);
    const resetDaily = await Scheduler.create("Reset Monthly Campaign", null);

    start.repeatEvery("0 0 * * *").save();
    stop.repeatEvery("0 0 * * *").save();
    run.repeatEvery("0 * * * *").save();
    resetDaily.repeatEvery("0 0 * * *").save();
    resetWeekly.repeatEvery("0 0 * * MON").save();
    resetMonthly.repeatEvery("0 0 1 * *").save();
  } catch (error) {
    done(error.message);
  }
}
