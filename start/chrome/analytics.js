(function (e) {
  var t = chrome.runtime.id;
  var a = chrome.i18n.getMessage("extName");
  var o = function (t) {
    if (e.debug) console.log("ga: send pageview " + t);
    ga("send", "pageview", t);
  };
  var l = function (t) {
    if (e.debug) console.log("ga: send event", t);
    if (t.eventAction.indexOf("active") > -1) ga("trackActive.send", t);
    else if (
      t.eventAction.indexOf("install") == 0 ||
      t.eventAction.indexOf("update") == 0
    )
      ga("trackInstall.send", t);
    else if (t.eventAction.indexOf("click") == 0) ga("trackClick.send", t);
    else if (t.eventAction.indexOf("search") == 0) ga("trackSearch.send", t);
    else if (t.eventAction.indexOf("error") == 0) ga("trackError.send", t);
    else ga("send", t);
  };
  var r = function (t, o) {
    if (
      t != "opt-out" &&
      t != "opted-out" &&
      localStorage.getItem("optout") == "1"
    )
      return;
    if (e.debug) console.log("TRACK: ", t, o);
    else {
      var r = { hitType: "event", eventCategory: a, eventAction: t };
      if (o) r.eventLabel = o;
      l(r);
    }
  };
  e.trackNoti = function (t, a) {
    if (e.debug) console.log("TRACK NOTI: ", t, a);
    else {
      var o = { hitType: "event", eventCategory: t, eventAction: a };
      ga("trackNoti.send", o);
    }
  };
  var c, s;
  var i = function () {
    var e = new Date();
    var t = "" + e.getUTCFullYear();
    var a =
      e.getUTCMonth() < 9
        ? "0" + (e.getUTCMonth() + 1)
        : "" + (e.getUTCMonth() + 1);
    var o = e.getUTCDate() < 10 ? "0" + e.getUTCDate() : "" + e.getUTCDate();
    c = t + a + o;
    s = 0;
    var l = localStorage.getItem("installdt");
    if (!l) {
      localStorage.setItem("installdt", c);
    } else {
      try {
        var r = l.substr(0, 4);
        var i = l.substr(4, 2) - 1;
        var n = l.substr(6, 2);
        var g = new Date(r, i, n);
        var m = e.getTime() - g.getTime();
        s = Math.floor(m / (1e3 * 60 * 60 * 24));
      } catch (e) {}
    }
    localStorage.setItem("installdc", s);
    localStorage.setItem("BST", new Date().toISOString());
  };
  function n() {
    var e = chrome.runtime.getManifest();
    return e.version;
  }
  function g() {
    var e = chrome.runtime.getManifest();
    return e.name;
  }
  var m = user["firstRunDomain"];
  var f = user["firstRunLandingPage"];
  var d = false,
    u = false;
  var h = n().split(".");
  var S = "http://" + m + "/update-" + h[0] + "-" + h[1] + "-" + h[2] + "/";
  var I = "update-" + h[0] + "-" + h[1] + "-" + h[2];
  var p = function (e, a) {
    r(e, a);
    var o = localStorage.getItem("confSE") || t;
    if (o.length === 32 && o.indexOf("://") === -1)
      o =
        "https://chrome.google.com/webstore/detail/" +
        n().replace(/\./g, "_") +
        "/" +
        o;
    if (e == "click-Rate") {
      var l = localStorage.getItem("confRE") || t;
      if (l.length === 32 && l.indexOf("://") === -1)
        l = "https://chrome.google.com/webstore/detail/" + l + "/reviews";
      chrome.tabs.create({ url: l });
    } else if (e == "click-ChangeCity") {
      chrome.tabs.create({
        url:
          f +
          "?utm_campaign=Extensions&utm_medium=changecity&utm_source=" +
          chrome.runtime.id,
        active: true
      });
    } else if (e == "click-Feedback") {
      chrome.tabs.create(
        { url: "http://" + user["firstRunDomain"] + "/feedback/?id=" + t },
        function (e) {
          chrome.tabs.executeScript(e.id, {
            code:
              'window.threadFeedback=setInterval(function(){ var feedbackName = document.getElementById("feedbackName"); if( feedbackName ){ clearInterval(window.threadFeedback); feedbackName.value = "' +
              g().replace(/'/g, "\\'").replace(/"/g, '\\"') +
              '"; } },1000)',
            allFrames: false,
            runAt: "document_start"
          });
        }
      );
    } else if (e == "click-Fanpage") {
      chrome.tabs.create({
        url: "https://www.facebook.com/FreeAddonWallpaperNewTabExtensions/"
      });
    } else if (e == "click-ShareFB") {
      chrome.tabs.create({
        url:
          "https://www.facebook.com/sharer/sharer.php?u=" +
          encodeURIComponent(o)
      });
    } else if (e == "click-ShareGG") {
      chrome.tabs.create({
        url: "https://plus.google.com/share?url=" + encodeURIComponent(o)
      });
    } else if (e == "click-ShareTW") {
      chrome.tabs.create({
        url: "http://www.twitter.com/share?url=" + encodeURIComponent(o)
      });
    } else if (e == "click-SharePI") {
      chrome.tabs.create({
        url:
          "https://pinterest.com/pin/create/bookmarklet/?url=" +
          encodeURIComponent(o)
      });
    } else if (e == "click-ShareTU") {
      chrome.tabs.create({
        url:
          "https://www.tumblr.com/widgets/share/tool?canonicalUrl=" +
          encodeURIComponent(o)
      });
    } else if (e == "click-ShareVK") {
      chrome.tabs.create({
        url: "http://vk.com/share.php?url=" + encodeURIComponent(o)
      });
    } else if (e == "click-Donate") {
      var c = "http://" + user["firstRunDomain"] + "/donate/?id=" + t;
      chrome.tabs.create({ url: c });
    } else if (e == "click-Uninstall") {
      chrome.management.uninstallSelf({ showConfirmDialog: true }, function (
        e
      ) {});
    }
  };
  var _ = [];
  chrome.tabs.onUpdated.addListener(function (t, a, o) {
    if (
      (a.status == "complete" || _.indexOf(t) == -1) &&
      (o.url
        .replace(/^https?:\/\//, "")
        .indexOf(f.replace(/^https?:\/\//, "")) > -1 ||
        o.url
          .replace(/^https?:\/\//, "")
          .indexOf(S.replace(/^https?:\/\//, "")) > -1)
    ) {
      _.push(t);
      chrome.tabs.executeScript(
        t,
        {
          file: "/start/search/content-homepage.js",
          allFrames: false,
          runAt: "document_start"
        },
        function () {
          if (e.debug) chrome.tabs.sendMessage(t, { debug: e.debug });
          if (
            d &&
            o.url
              .replace(/^https?:\/\//, "")
              .indexOf(S.replace(/^https?:\/\//, "")) > -1
          ) {
            chrome.tabs.sendMessage(t, { type: "showMajor" });
          } else if (u) {
            chrome.tabs.sendMessage(t, { type: "showInstall" });
          } else {
            chrome.tabs.sendMessage(t, { type: "showMinor" });
          }
          var a = JSON.parse(localStorage.getItem("weather_location"));
          var l = JSON.parse(localStorage.getItem("weather_data"));
          var r = localStorage.getItem("weather_location_isvalid") === "true";
          if (r) {
            chrome.tabs.sendMessage(t, {
              type: "weather_info",
              info: { weather_location: a, weather_data: l }
            });
          } else {
            chrome.tabs.sendMessage(t, {
              type: "error_get_weather_in_city",
              info: {
                weather_location: JSON.parse(
                  localStorage.getItem("weather_location")
                ),
                error_msg: "Unable to get weather data."
              }
            });
          }
        }
      );
    }
  });
  function b(t) {
    if (e.debug) console.log("Extension Installed");
    r("installed");
    if (localStorage.getItem("installdt") === null) {
      localStorage.setItem("installdt", c);
    }
    y();
    u = true;
    chrome.tabs.create(
      { url: localStorage.getItem("newtab_url"), active: false },
      function () {}
    );
    chrome.tabs.query(
      {
        url: [
          "http://" + m + "/*",
          "https://" + m + "/*",
          "http://www." + m + "/*",
          "https://www." + m + "/*"
        ]
      },
      function (e) {
        if (e.length) {
          chrome.tabs.update(e[0].id, { url: f, active: true });
        } else {
          chrome.tabs.create({ url: f, active: true });
        }
      }
    );
    setTimeout(function () {
      r("install-alive");
    }, 15e3);
  }
  function v(t, a) {
    if (e.debug) console.log("Extension Updated");
    r("updated" + "-" + t);
    try {
      y();
      if ((user["ver_update_ignore"] + "").indexOf(a) >= 0) {
        return;
      }
      if ((user["ver_update_major"] + "").indexOf(t) >= 0) {
        chrome.cookies.get({ url: S, name: I }, function (e) {
          if (e) return;
          d = true;
          chrome.tabs.query(
            {
              url: [
                "http://" + m + "/*",
                "https://" + m + "/*",
                "http://www." + m + "/*",
                "https://www." + m + "/*"
              ]
            },
            function (e) {
              if (e.length) {
                chrome.tabs.update(e[0].id, { url: S, active: true });
              } else {
                chrome.tabs.create({ url: S, active: true });
              }
            }
          );
        });
      } else if (s >= 3 && (user["ver_update_minor"] + "").indexOf(t) >= 0) {
        chrome.tabs.query(
          {
            url: [
              "http://" + m + "/*",
              "https://" + m + "/*",
              "http://www." + m + "/*",
              "https://www." + m + "/*"
            ]
          },
          function (e) {
            if (e.length) {
              chrome.tabs.update(e[0].id, { url: f, active: true });
            } else {
              chrome.tabs.create({ url: f, active: true });
            }
          }
        );
      }
      if ((user["ver_reset_clicked_options"] + "").indexOf(t) >= 0) {
        localStorage.removeItem("theme_clicked");
      }
      if (localStorage.getItem("countdownToTime")) {
        var o = new Date();
        var l = new Date(localStorage.getItem("countdownToTime"));
        if (o > l) {
          var c = o.getFullYear();
          var i = l.getMonth() + 1;
          var n = l.getDate();
          var g = l.getHours();
          var u = l.getMinutes();
          if (
            (i == 10 && n == 31) ||
            (i == 12 && n == 24) ||
            (i == 12 && n == 25) ||
            (i == 12 && n == 31) ||
            (i == 1 && n == 1)
          ) {
            var h = `${c}-${("0" + i).slice(-2)}-${("0" + n).slice(-2)}T${(
              "0" + g
            ).slice(-2)}:${("0" + u).slice(-2)}`;
            if (o > new Date(h))
              h = `${c + 1}-${("0" + i).slice(-2)}-${("0" + n).slice(-2)}T${(
                "0" + g
              ).slice(-2)}:${("0" + u).slice(-2)}`;
            localStorage.setItem("countdownToTime", h);
            localStorage.setItem("countdown_notified", "no");
          }
        }
      }
    } catch (e) {}
  }
  function w(t, a) {
    if (e.debug) console.log("Extension Active");
    if (localStorage.getItem("optout") === "1") {
      r("opted-out", a);
    } else {
      r("active", a);
    }
  }
  i();
  e.currVersion = e.currVersion || n();
  e.prevVersion =
    e.prevVersion ||
    localStorage.getItem("version") ||
    localStorage.getItem("installed");
  if (currVersion != prevVersion) {
    if (prevVersion === null) {
      b(currVersion);
    } else {
      localStorage.setItem("instact", 1);
      v(currVersion, prevVersion);
    }
    localStorage.setItem("version", currVersion);
  }
  var k = localStorage.getItem("last_active");
  e.last_active = false;
  if (!k || k !== c) {
    if (k) localStorage.setItem("instact", 1);
    w(currVersion, s);
    localStorage.setItem("last_active", c);
    e.last_active = true;
  }
  chrome.extension.onMessage.addListener(function (t, a, o) {
    if (typeof t == "string" && t.indexOf("click-") == 0) {
      p(t);
      return;
    } else if (typeof t.name == "string" && t.name.indexOf("click-") == 0) {
      p(t.name, t.data);
      return;
    } else if (t.search) {
      r(t.search, t.query);
      o("ok");
      return;
    } else if (t.trackNoti) {
      e.trackNoti(t.category, t.action);
    } else if (t.rateStatus) {
      if (s < 1) {
        o(0);
      } else if (localStorage.getItem("rate_clicked") == null) {
        o(1);
      } else if (
        localStorage.getItem("rate_clicked") == "yes" ||
        localStorage.getItem("rate_clicked") == "feedback"
      ) {
        o(0);
      } else if (localStorage.getItem("rate_clicked") == "cws") {
        o(-1);
      }
    }
  });
  function y() {
    if (!localStorage.getItem("disable_weather")) {
      localStorage.setItem("disable_weather", "no");
    }
    if (!localStorage.getItem("enable_most_visited")) {
      if (!localStorage.getItem("disable_most_visited")) {
        localStorage.setItem("enable_most_visited", "yes");
      } else if (localStorage.getItem("disable_most_visited") == "yes") {
        localStorage.setItem("enable_most_visited", "no");
      } else {
        localStorage.setItem("enable_most_visited", "yes");
      }
      localStorage.removeItem("disable_most_visited");
    }
    if (!localStorage.getItem("enable_apps")) {
      if (!localStorage.getItem("disable_apps")) {
        localStorage.setItem("enable_apps", "yes");
      } else if (localStorage.getItem("disable_apps") == "yes") {
        localStorage.setItem("enable_apps", "no");
      } else {
        localStorage.setItem("enable_apps", "yes");
      }
      localStorage.removeItem("disable_apps");
    }
    if (!localStorage.getItem("enable_share")) {
      if (!localStorage.getItem("disable_share")) {
        localStorage.setItem("enable_share", "yes");
      } else if (localStorage.getItem("disable_share") == "yes") {
        localStorage.setItem("enable_share", "no");
      } else {
        localStorage.setItem("enable_share", "yes");
      }
      localStorage.removeItem("disable_share");
    }
    if (!localStorage.getItem("enable_todo")) {
      if (!localStorage.getItem("disable_todo")) {
        localStorage.setItem("enable_todo", "yes");
      } else if (localStorage.getItem("disable_todo") == "yes") {
        localStorage.setItem("enable_todo", "no");
      } else {
        localStorage.setItem("enable_todo", "yes");
      }
      localStorage.removeItem("disable_todo");
    }
    if (!localStorage.getItem("enable_slideshow")) {
      localStorage.setItem("enable_slideshow", "no");
    }
    if (!localStorage.getItem("hideTodoPanel")) {
      localStorage.setItem("hideTodoPanel", "yes");
    }
    if (!localStorage.getItem("todoList")) {
      localStorage.setItem("todoList", "[]");
    }
    if (!localStorage.getItem("enable_note")) {
      localStorage.setItem("enable_note", "yes");
    }
    if (!localStorage.getItem("notes")) {
      localStorage.setItem("notes", "[]");
    }
    if (!localStorage.getItem("bg_animation")) {
      localStorage.setItem("bg_animation", "fadeIn");
    }
    if (!localStorage.getItem("enable_autohide")) {
      localStorage.setItem("enable_autohide", "no");
    }
    if (!localStorage.getItem("enable_snow")) {
      localStorage.setItem("enable_snow", "no");
    }
    if (!localStorage.getItem("snow_type")) {
      localStorage.setItem("snow_type", "flake");
    }
    if (!localStorage.getItem("enable_countdown")) {
      localStorage.setItem("enable_countdown", "no");
    }
    if (
      localStorage.getItem("countdownText") === null ||
      localStorage.getItem("countdownToTime") === null
    ) {
      var e = new Date().getUTCFullYear() + 1 + "-01-01T00:00:00";
      localStorage.setItem("countdownToTime", e);
      localStorage.setItem("countdownText", "New Year");
    }
    if (!localStorage.getItem("countdownPosition")) {
      localStorage.setItem("countdownPosition", "Bottom Center");
    }
    if (!localStorage.getItem("countdown_text_color")) {
      localStorage.setItem("countdown_text_color", "#ffffff");
    }
    if (!localStorage.getItem("countdown_background")) {
      localStorage.setItem("countdown_background", "no");
    }
    if (!localStorage.getItem("countdown_notified")) {
      localStorage.setItem("countdown_notified", "no");
    }
    if (!localStorage.getItem("setTimeAutomatically")) {
      localStorage.setItem("setTimeAutomatically", "yes");
    }
    if (!localStorage.getItem("latency")) {
      localStorage.setItem("latency", "0");
    }
    if (!localStorage.getItem("time_format")) {
      localStorage.setItem("time_format", "24h");
    }
    if (!localStorage.getItem("date_format")) {
      localStorage.setItem("date_format", "{{d}}.{{m}}.{{y}}");
    }
    if (!localStorage.getItem("units_weather")) {
      localStorage.setItem("units_weather", "metric");
    }
    if (!localStorage.getItem("hideLink")) {
      localStorage.setItem("hideLink", "[]");
    }
    if (!localStorage.getItem("hideApp")) {
      localStorage.setItem("hideApp", "[]");
    }
    if (!localStorage.getItem("had_wl")) {
      localStorage.setItem("had_wl", "[]");
    }
    if (!localStorage.getItem("random_all_newtab")) {
      localStorage.setItem("random_all_newtab", "no");
    }
    if (!localStorage.getItem("last_opened")) {
      localStorage.setItem("last_opened", new Date().getTime());
    }
    if (!localStorage.getItem("bg_img")) {
      localStorage.setItem("bg_img", "bg-01.jpg");
    }
    if (!localStorage.getItem("last_bg")) {
      localStorage.setItem("last_bg", "0");
    }
    if (
      !localStorage.getItem("shuffle_background") ||
      !localStorage.getItem("shuffle_favorites")
    ) {
      localStorage.setItem("shuffle_background", "yes");
      localStorage.setItem("shuffle_favorites", "no");
    }
    localStorage.setItem(
      "bg_img",
      localStorage
        .getItem("bg_img")
        .replace("url(", "")
        .replace("/start/skin/images/", "")
        .replace("/skin/images/", "")
        .replace(")", "")
    );
    if (!localStorage.getItem("mark_favor")) {
      localStorage.setItem("mark_favor", JSON.stringify([]));
    }
    if (!localStorage.getItem("likedImages")) {
      localStorage.setItem("likedImages", JSON.stringify([]));
    }
    if (!localStorage.getItem("IDT")) {
      localStorage.setItem("IDT", new Date().toISOString());
    }
  }
})(this);
