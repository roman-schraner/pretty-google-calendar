document.addEventListener("DOMContentLoaded", function () {
  const calendarEl = document.getElementById("pgcalendar");
  calendarEl.innerHTML = "";
  let width = window.innerWidth;

  const views = pgcal_resolve_views(pgcalSettings);
  const cals = pgcal_resolve_cals(pgcalSettings);

  //   console.log(":: pgcalSettings");
  //   console.table(pgcalSettings);
  //   console.log(":: views");
  //   console.table(views);

  const toolbarLeft = pgcal_is_truthy(pgcalSettings["show_today_button"])
    ? "prev,next today"
    : "prev,next";
  const toolbarCenter = pgcal_is_truthy(pgcalSettings["show_title"])
    ? "title"
    : "";
  const toolbarRight = views.length > 1 ? views.all.join(",") : "";

  let selectedView = views.initial;

  const calendar = new FullCalendar.Calendar(calendarEl, {
    locale: pgcalSettings["locale"],
    googleCalendarApiKey: pgcalSettings["google_api"],

    eventSources: cals,

    views: {
      // Options apply to dayGridMonth, dayGridWeek, and dayGridDay views
      dayGrid: {
        eventTimeFormat: {
          hour: "numeric",
          minute: "2-digit",
          meridiem: "short",
        },
      },
      // Custom List View
      listCustom: {
        type: "list",
        duration: { days: parseInt(pgcalSettings["custom_days"]) },
        buttonText: pgcalSettings["custom_list_button"],
      },
    },

    // Day grid options
    eventDisplay: "block", // Adds border and bocks to events instead of bulleted list (default)
    height: "auto",
    fixedWeekCount: false, // True: 6 weeks, false: flex for month

    // List options
    listDayFormat: { weekday: "long", month: "long", day: "numeric" },

    timeZone: pgcalSettings["fixed_tz"], // TODO: Necessary?

    eventDataTransform: function(eventData) {
      //console.dir(eventData); // DEBUG
      // Private Events have an 'undefined' title and description. Change to predefined value in Settings.
      if (typeof eventData.title === 'undefined') {
        eventData.extendedProps.isPrivate = true;
        eventData.title = pgcalSettings["private_event_title"];
        eventData.className = 'fc-h-event-private';
        eventData.backgroundColor = 'white';
        eventData.textColor = 'black';
        if (typeof eventData.description === 'undefined') {
          eventData.description = pgcalSettings["private_event_description"];
        }
      } else {
        eventData.extendedProps.isPrivate = false;
        eventData.backgroundColor = 'var(--nv-primary-accent, var(--fc-event-bg-color,#3788d8))';
      }

      eventData.borderColor = 'var(--nv-primary-accent, var(--fc-event-bg-color,#3788d8))';
    },

    initialView: views.initial,

    headerToolbar: {
      left: toolbarLeft,
      center: toolbarCenter,
      right: toolbarRight,
    },
    // headerToolbar: pgcal_is_mobile()
    //   ? {
    //       left: toolbarLeft,
    //       center: "",
    //       right: toolbarRight,
    //     }
    //   : {
    //       left: toolbarLeft,
    //       center: toolbarCenter,
    //       right: toolbarRight,
    //     },

    eventDidMount: function (info) {
      if (pgcalSettings["use_tooltip"]) {
        pgcal_tippyRender(info);
      }
    },

    eventClick: function (info) {
      if (pgcalSettings["use_tooltip"] || pgcalSettings["no_link"]) {
        info.jsEvent.preventDefault(); // Prevent following link
      }
    },

    // Change view on window resize
    windowResize: function (view) {
      // Catch mobile chrome, which changes window size as nav bar appears
      // so only fire if width has changed.
      if (
        window.innerWidth !== width &&
        views.hasList &&
        views.wantsToEnforceListviewOnMobile
      ) {
        if (pgcal_is_mobile()) {
          calendar.changeView(views.listType);
        } else {
          calendar.changeView(selectedView);
        }
      }
    },
  });

  calendar.render();
});
