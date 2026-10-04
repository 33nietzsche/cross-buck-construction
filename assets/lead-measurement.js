(function () {
  "use strict";

  function measure(name, parameters) {
    // Measurement must never prevent a customer from contacting us.
    try {
      if (typeof window.gtag === "function") {
        window.gtag("event", name, parameters);
      }
    } catch (_) { /* The quote and phone link still work if tracking is blocked. */ }
  }

  // The form emits this only after Web3Forms confirms a successful submission.
  // No customer-supplied form fields are passed to Google.
  document.addEventListener("crossbuck:quote-sent", function () {
    measure("conversion", {
      send_to: "AW-18466560284/u79xCISMlJAdEJyyxeVE",
      value: 0,
      currency: "USD"
    });
  });

  // A phone-link click is an interaction, not proof of a completed call or lead.
  document.addEventListener("click", function (event) {
    var target = event.target;
    var link = target && target.closest ? target.closest('a[href^="tel:"]') : null;
    if (!link) return;
    measure("phone_click", { send_to: "G-VGGX50Y3KE" });
  });
})();
