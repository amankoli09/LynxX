export async function requestNotificationPermission() {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return false;
  }
  if (Notification.permission === "granted") {
    return true;
  }
  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  }
  return false;
}

export function notifyCampaignGoalReached(campaignId = "lynxx_main") {
  if (typeof window === "undefined" || !("Notification" in window)) return;
  if (Notification.permission !== "granted") return;

  const storageKey = `lynxx_goal_notified_${campaignId}`;
  
  // Guard: Only fire once per session / storage
  if (localStorage.getItem(storageKey) || sessionStorage.getItem(storageKey)) {
    return;
  }

  new Notification("🎉 LynxX Campaign Goal Reached!", {
    body: "The crowdfunding goal has been met!",
    icon: "/favicon.ico",
  });

  localStorage.setItem(storageKey, "true");
  sessionStorage.setItem(storageKey, "true");
}