google.charts.load("current", { packages: ["gauge"] });
google.charts.setOnLoadCallback(drawChart);

const now = new Date();

function drawChart() {
  const url =
    "https://api.thingspeak.com/channels/3515278/feeds/last.json?api_key=XLJKREJGG0ELKWCU";

  const data = google.visualization.arrayToDataTable([
    ["Label", "Value"],
    ["Lämpötila", 0],
  ]);

  const options = {
    width: 400,
    height: 120,
    redFrom: 80,
    redTo: 100,
    minorTicks: 5,
  };

  const chart = new google.visualization.Gauge(
    document.getElementById("gauge_div"),
  );

  function resetGauge() {
    data.setValue(0, 1, 0);
    chart.draw(data, options);
  }

  function updateGauge() {
    fetch(url)
      .then((response) => response.json())
      .then((feed) => {
        const time = new Date(feed.created_at);

        const temp = parseFloat(feed.field1);

        if (!isNaN(temp)) {
          data.setValue(0, 1, temp);
          chart.draw(data, options);
        }
        // Onko laite  käynnissä?
        const diff = now - time;
        if (diff > 2 * 60 * 1000) {
          document.getElementById("output").style.color = "red";
          document.getElementById("output").textContent = "Offline";
          resetGauge();
        } else {
          document.getElementById("output").style.color = "green";
          document.getElementById("output").textContent = "Online";
        }
      })
      .catch((error) =>
        console.error("Error fetching or drawing gauge:", error),
      );
  }

  updateGauge();
  setInterval(updateGauge, 13000);
}
