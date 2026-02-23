// Netlify event-triggered function: automatically called on every form submission.
// Logs submission details and attempts to set up email notifications.

const NOTIFICATION_EMAIL = "arnold.poulin@outlook.com";

exports.handler = async function (event, context) {
  let payload;
  try {
    payload = JSON.parse(event.body);
  } catch {
    console.error("Failed to parse submission payload");
    return { statusCode: 200 };
  }

  const { form_name, data } = payload;

  if (form_name !== "demande-devis") {
    return { statusCode: 200 };
  }

  const nom = data?.nom || "Non renseigné";
  const email = data?.email || "Non renseigné";
  const telephone = data?.telephone || "Non renseigné";
  const ville = data?.ville || "Non renseigné";
  const message = data?.message || "Non renseigné";
  const date = new Date().toLocaleString("fr-CH", { timeZone: "Europe/Zurich" });

  console.log("=== Nouvelle demande de devis ===");
  console.log(`Date: ${date}`);
  console.log(`Nom: ${nom}`);
  console.log(`Email: ${email}`);
  console.log(`Téléphone: ${telephone}`);
  console.log(`Ville: ${ville}`);
  console.log(`Message: ${message}`);
  console.log("================================");

  // Attempt to create email notification hook via Netlify API
  const siteId = process.env.SITE_ID || process.env.NETLIFY_SITE_ID;
  const token = process.env.NETLIFY_AUTH_TOKEN;

  if (token && siteId) {
    try {
      const hooksRes = await fetch(
        `https://api.netlify.com/api/v1/hooks?site_id=${siteId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (hooksRes.ok) {
        const hooks = await hooksRes.json();
        const hasEmailHook = hooks.some(
          (h) =>
            h.type === "email" &&
            h.event === "submission_created" &&
            h.data?.email === NOTIFICATION_EMAIL
        );
        if (!hasEmailHook) {
          const createRes = await fetch("https://api.netlify.com/api/v1/hooks", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              site_id: siteId,
              type: "email",
              event: "submission_created",
              data: { email: NOTIFICATION_EMAIL },
            }),
          });
          if (createRes.ok) {
            console.log("Email notification hook created successfully");
          }
        }
      }
    } catch (err) {
      console.log("Hook setup skipped:", err.message);
    }
  }

  return { statusCode: 200 };
};
