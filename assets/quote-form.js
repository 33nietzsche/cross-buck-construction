(function () {
  "use strict";

  var testMode = new URLSearchParams(window.location.search).get("test") === "1";
  document.querySelectorAll("[data-quote-form]").forEach(function (form) {
    var status = form.querySelector('[role="status"]');
    var button = form.querySelector('[type="submit"]');
    var service = form.querySelector('[name="job_type"]');
    var defaultService = form.getAttribute("data-default-service");
    if (defaultService) service.value = defaultService;

    form.addEventListener("submit", async function (event) {
      event.preventDefault();
      if (button.disabled || !form.reportValidity()) return;
      var data = {};
      new FormData(form).forEach(function (value, key) { data[key] = value; });
      if (!String(data.phone || "").trim() && !String(data.email || "").trim()) {
        status.className = "form-status form-error";
        status.textContent = "Please add a phone number or email so we can get back to you.";
        return;
      }
      data.source_page = window.location.pathname;
      if (testMode) data.subject = "TEST ONLY — " + data.subject;
      var controller = new AbortController();
      var timeout = setTimeout(function () { controller.abort(); }, 15000);
      button.disabled = true;
      button.textContent = "Sending…";
      form.setAttribute("aria-busy", "true");
      status.className = "form-status";
      status.textContent = "Sending…";
      try {
        var response = await fetch(form.action, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Accept": "application/json" },
          body: JSON.stringify(data),
          signal: controller.signal
        });
        var result = await response.json();
        if (!response.ok || !result.success) throw new Error("Send failed");
        document.dispatchEvent(new CustomEvent("crossbuck:quote-sent", { detail: { test: testMode } }));
        form.reset();
        if (defaultService) service.value = defaultService;
        status.className = "form-status form-success";
        status.innerHTML = 'Thanks — your request was sent. We’ll get back to you soon. Have photos? <a href="sms:+18064966999">Text (806) 496-6999</a>.';
      } catch (error) {
        status.className = "form-status form-error";
        status.innerHTML = error.name === "AbortError"
          ? 'We couldn’t confirm delivery in time. Your details are still here. Please <a href="tel:+18064966999">call (806) 496-6999</a> or <a href="sms:+18064966999">text us</a> so we can check your request.'
          : 'Your request could not be confirmed. Your details are still here. Please try again, <a href="tel:+18064966999">call (806) 496-6999</a>, <a href="sms:+18064966999">text us</a>, or email <a href="mailto:zach@crossbuckconstruction.com">zach@crossbuckconstruction.com</a>.';
      } finally {
        clearTimeout(timeout);
        button.disabled = false;
        button.textContent = "Send request";
        form.removeAttribute("aria-busy");
      }
    });
  });
})();
