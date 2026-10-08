(function () {
  "use strict";

  // ChatGPT ads (OpenAI) measurement pixel "Cross Buck website".
  // Loaded once per page here, since every page already includes this file.
  try {
    !function (w, d, s, u) {
      if (w.oaiq) return;
      var q = function () { q.q.push(arguments); };
      q.q = [];
      w.oaiq = q;
      var j = d.createElement(s); j.async = 1; j.src = u;
      var f = d.getElementsByTagName(s)[0];
      f.parentNode.insertBefore(j, f);
    }(window, document, "script", "https://bzrcdn.openai.com/sdk/oaiq.min.js");
    window.oaiq("init", { pixelId: "XDYMF6dUzoBwKjs13t2TFJ" });
  } catch (_) { /* Never block the page if the pixel fails. */ }

  function oaiMeasure() {
    try {
      if (typeof window.oaiq === "function") {
        window.oaiq.apply(null, arguments);
      }
    } catch (_) { /* The quote and phone link still work if tracking is blocked. */ }
  }

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
    oaiMeasure("measure", "lead_created", { type: "customer_action" });
  });

  // A phone-link click is an interaction, not proof of a completed call or lead.
  document.addEventListener("click", function (event) {
    var target = event.target;
    var link = target && target.closest ? target.closest('a[href^="tel:"]') : null;
    if (!link) return;
    measure("phone_click", { send_to: "G-VGGX50Y3KE" });
    oaiMeasure("measure", "custom", { type: "custom" }, { custom_event_name: "phone_call_click" });
  });
})();
