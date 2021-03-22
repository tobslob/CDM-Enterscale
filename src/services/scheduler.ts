import Agenda from "agenda";
import mongoose from "mongoose";
import differenceInDays from "date-fns/differenceInDays";
import { loopConcurrently, mapConcurrently } from "@app/data/util";
import { CampaignRepo } from "@app/data/campaign";
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

export async function job() {
  Scheduler.define("Start Scheduled Campaign", async () => {
    const campaigns = await CampaignRepo.all({});

    await loopConcurrently(campaigns, async c => {
      if (c.status == "STOP" && isToday(c.start_date)) {
        const defaulters = await DefaulterRepo.all({
          conditions: {
            request_id: c.target_audience
          }
        });

        await mapConcurrently(defaulters, async d => {
          const user = await UserRepo.byID(d.user);
          await CampaignServ.send(c, user);
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
    const campaigns = await CampaignRepo.all({});

    await loopConcurrently(campaigns, async c => {
      if (c.status == "START" && isToday(c.end_date)) {
        await CampaignRepo.atomicUpdate(c.id, {
          $set: {
            status: "STOP"
          }
        });
      }
    });
  });

  Scheduler.define("Run Scheduled Campaign", async () => {
    const campaigns = await CampaignRepo.all({});

    await loopConcurrently(campaigns, async c => {
      if (c.status == "START" && differenceInDays(c.end_date, new Date()) > 1) {
        const defaulters = await DefaulterRepo.all({
          conditions: {
            request_id: c.target_audience
          }
        });

        await mapConcurrently(defaulters, async d => {
          const user = await UserRepo.byID(d.user);
          await CampaignServ.send(c, user);
        });
      }
    });
  });

  const start = await Scheduler.create("Start Scheduled Campaign", null);
  const run = await Scheduler.create("Run Scheduled Campaign", null);
  const stop = await Scheduler.create("Stop Scheduled Campaign", null);

  await Scheduler.start();

  start.repeatEvery("0 1 * * *").save();
  run.repeatEvery("0 1 * * *").save();
  stop.repeatEvery("0 1 * * *").save();
}
job();
