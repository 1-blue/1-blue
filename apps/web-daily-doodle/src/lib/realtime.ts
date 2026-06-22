import { createServerClient } from "@1-blue/database/server";
import type { BroadcastStrokeEvent } from "./types";

export const getChannelName = (boardDate: string) => `daily-doodle:${boardDate}`;

export const broadcastBoardEvent = async (boardDate: string, payload: BroadcastStrokeEvent) => {
  const supabase = createServerClient();
  const channel = supabase.channel(getChannelName(boardDate));

  await new Promise<void>((resolve, reject) => {
    channel.subscribe((status: string) => {
      if (status === "SUBSCRIBED") {
        resolve();
        return;
      }

      if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
        reject(new Error(`channel_${status.toLowerCase()}`));
      }
    });
  });

  const eventName =
    payload.type === "new_stroke"
      ? "stroke"
      : payload.type === "remove_stroke"
        ? "remove_stroke"
        : payload.type === "move_stroke"
          ? "move_stroke"
          : "day_closed";

  await channel.send({
    type: "broadcast",
    event: eventName,
    payload,
  });

  await supabase.removeChannel(channel);
};
