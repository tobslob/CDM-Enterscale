export type Channel = "mail" | "web" | "dual";

/**
 * Base type of notifications sent over the queue
 */
export interface Notification {
  /**
   * transport mechanism to use for dispatch
   */
  channel: Channel;
  /**
   * who's to receive this notification. Depends on the channel
   */
  recipient: string;
}
