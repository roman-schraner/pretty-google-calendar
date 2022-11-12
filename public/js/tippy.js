function pgcal_tippyRender(info) {
  //   console.log(info.event); // DEBUG

  // Tippy: Show start and end date if multi Day event. If not, show date only once.
  var dateString = "";
  if (pgcal_isSameDay(info.event.start, info.event.end)) {
    dateString = `${new Intl.DateTimeFormat(pgcalSettings["locale"], { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: 'numeric'}).format(info.event.start)} - ${new Intl.DateTimeFormat(pgcalSettings["locale"], { hour: 'numeric', minute: 'numeric'}).format(info.event.end)}`;
  } else {
    dateString = `${new Intl.DateTimeFormat(pgcalSettings["locale"], { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: 'numeric'}).format(info.event.start)} - ${new Intl.DateTimeFormat(pgcalSettings["locale"], { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: 'numeric'}).format(info.event.end)}`;
  }

  const timeString = info.event.allDay ? "All Day" : `${dateString}`;

  let toolContent = `
    <div class="tippy-container">
      <div class="tippy-icon-child"><span class="tippy-event-dot"></span></div>
      <div class="tippy-text-child">
        <h4 class="tippy-title"> ${info.event.title} </h4>
        ${timeString}
      </div>
    </div>
		`;
    if (info.event.extendedProps.description !== undefined) {
      toolContent += `
      <div class="tippy-container">
        <div class="tippy-icon-child"><span class="dashicons dashicons-text"></span></div>
        <div class="tippy-text-child">${pgcal_breakify(info.event.extendedProps.description)}</div>
      </div>`;
    }

  if (pgcalSettings["tooltip_show_buttons"] === "true") {
    toolContent += `<div class="toolloc">${pgcal_mapify(info.event.extendedProps.location)} ${pgcal_linkify(
      info.event.url
    )}</div>`;
  }

  tippy(info.el, {
    trigger: "click",
    content: toolContent,
    theme: "light", // TODO: from settings
    allowHTML: true,
    placement: pgcal_is_mobile() ? "bottom" : "auto",
    popperOptions: pgcal_is_mobile()
      ? {
          modifiers: [
            {
              name: "flip",
              enabled: false,
              options: {
                // flipBehavior: ['bottom', 'right', 'top']
                // fallbackPlacements: ['right', 'top'],
              },
            },
          ],
        }
      : "",
    interactive: "true", // Allows clicking inside
    appendTo: document.getElementById("pgcalendar"),
    maxWidth: 600, // TODO: from settings
    boundary: "window",
  });
}
