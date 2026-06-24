export const notifySlack = async (text: string): Promise<void> => {
  const url = process.env.SLACK_WEBHOOK_URL;
  if (!url) {
    return;
  }

  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
  } catch {
    // Slack failure should not break cron/admin
  }
};
