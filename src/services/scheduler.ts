import Agenda from "agenda";
import mongoose from "mongoose";
import differenceInDays from "date-fns/differenceInDays";
import { loopConcurrently, mapConcurrently } from "@app/data/util";
import { CampaignRepo, Campaign, CampaignType } from "@app/data/campaign";
import { isToday } from "date-fns";
import { CampaignServ } from "@app/services/campaign";
import { DefaulterRepo, Defaulter } from "@app/data/defaulter";

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
  const campaigns = await CampaignRepo.all({});
  Scheduler.define("Start Scheduled Campaign", { priority: "high", concurrency: 10 }, async (_job, done) => {
    await loopConcurrently(campaigns, async c => {
      if (c.status == "STOP" && isToday(c.start_date)) {
        await CampaignRepo.atomicUpdate(c.id, {
          $set: {
            status: "START"
          }
        });
      }
    });
    done();
  });

  Scheduler.define("Stop Scheduled Campaign", async (_job, done) => {
    await loopConcurrently(campaigns, async c => {
      if (c.status == "START" && isToday(c.end_date)) {
        await CampaignRepo.atomicUpdate(c.id, {
          $set: {
            status: "STOP"
          }
        });
      }
    });
    done();
  });

  async function runCampaign(c: Campaign) {
    const defaulters = await DefaulterRepo.all({
      conditions: {
        batch_id: c.target_audience
      }
    });

    await mapConcurrently(defaulters, async (d: Defaulter) => {
      d.users.forEach(async u => {
        if (
          (d.upload_type === CampaignType.STANDARD && u.status === "owing") ||
          d.upload_type === CampaignType.AQUISITION
        ) {
          await CampaignServ.send(c, u);
        }
      });
    });
  }

  Scheduler.define("Run Campaign", async (_job, done) => {
    await loopConcurrently(campaigns, async (c: Campaign) => {
      const time_hour = new Date().getHours();

      if (
        c.status == "START" &&
        !c.sent &&
        differenceInDays(c.end_date, new Date()) > 1 &&
        c.delivery_time.map(d => d === time_hour)
      ) {
        await runCampaign(c);
        await CampaignRepo.atomicUpdate({ _id: c.id }, { $set: { sent_date: new Date() } });
      }
    });
    done();
  });

  Scheduler.define("Reset Daily Campaign", async (_job, done) => {
    await loopConcurrently(campaigns, async c => {
      if (
        c.status == "START" &&
        c.sent &&
        c.frequency == Frequency.Daily &&
        differenceInDays(c.end_date, new Date()) >= 1
      ) {
        await CampaignRepo.atomicUpdate(c.id, {
          $set: {
            sent: false
          }
        });
      }
    });
    done();
  });

  Scheduler.define("Reset Weekly Campaign", async (_job, done) => {
    await loopConcurrently(campaigns, async c => {
      if (
        c.status == "START" &&
        c.sent &&
        c.frequency == Frequency.Weekly &&
        differenceInDays(new Date(), c.sent_date) >= 7
      ) {
        await CampaignRepo.atomicUpdate(c.id, {
          $set: {
            sent: false
          }
        });
      }
    });
    done();
  });

  Scheduler.define("Reset Monthly Campaign", async (_job, done) => {
    await loopConcurrently(campaigns, async c => {
      if (
        c.status == "START" &&
        c.sent &&
        c.frequency == Frequency.Monthly &&
        differenceInDays(new Date(), c.sent_date) >= 31
      ) {
        await CampaignRepo.atomicUpdate(c.id, {
          $set: {
            sent: false
          }
        });
      }
    });
    done();
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
  resetWeekly.repeatEvery("0 0 * * SUN").save();
  resetMonthly.repeatEvery("0 0 1 * *").save();
}
