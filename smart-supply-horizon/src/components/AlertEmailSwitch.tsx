import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner"; // Optional: use toaster to show success/fail

export default function AlertEmailSwitch() {
  const [emailEnabled, setEmailEnabled] = useState(false);

  const handleEmailToggle = async (checked: boolean) => {
    setEmailEnabled(checked);

    if (checked) {
      try {
        const response = await fetch("http://localhost:8080/api/email/send", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            subject: "Inventory Alert - Email Enabled",
            body: "You have enabled email notifications for inventory alerts.",
          }),
        });

        if (response.ok) {
          console.log("✅ Email sent successfully");
          toast.success("Email alert sent successfully!");
        } else {
          console.error("❌ Server error", await response.text());
          toast.error("Email failed! Check backend logs.");
        }
      } catch (err) {
        console.error("❌ Failed to send email:", err);
        toast.error("Email send failed. Server not reachable.");
      }
    }
  };

  return (
    <div className="flex items-center justify-between p-3 border rounded-lg shadow-sm bg-white dark:bg-gray-900">
      <div>
        <p className="font-semibold">Enable Email Alerts</p>
        <p className="text-sm text-muted-foreground">
          Receive alert emails to your inbox
        </p>
      </div>
      <Switch checked={emailEnabled} onCheckedChange={handleEmailToggle} />
    </div>
  );
}
