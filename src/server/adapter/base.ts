import { Notification } from "@app/data/notification";

/**
 * Facilitator for notification transport.
 */
export interface Adapter {
  /**
   * Send the notification to the recipient
   * @param notification
   */
  send(notification: Notification): Promise<any>;
}