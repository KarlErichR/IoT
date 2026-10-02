google.charts.load("current", { packages: ["corechart"] });
google.charts.setOnLoadCallback(drawChart);

let showFullHistory = false;
const button = document.querySelector("button");
button.style.cursor = "pointer";

function drawChart() {
  const url =
    "https://api.thingspeak.com/channels/3515278/feeds.json?api_key=XLJKREJGG0ELKWCU&results=8000";

  function updateChart() {
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        const feeds = data.feeds;
        const endTime = new Date();
        const startTime = new Date(endTime.getTime() - 24 * 60 * 60 * 1000);

        const chartData = [["Time", "Lämpötila (°C)"]];

        feeds.forEach((feed) => {
          const time = new Date(feed.created_at);

          const temp = parseFloat(feed.field1);

          if (
            !isNaN(temp) &&
            (showFullHistory || (time >= startTime && time <= endTime))
          ) {
            chartData.push([time, temp]);
          }
        });

        const dataTable = google.visualization.arrayToDataTable(chartData);

        const options = {
          title: showFullHistory
            ? "Saunan lämpötilan koko historia"
            : "Saunan lämpötila viimeisen 24 tunnin aikana",
          curveType: "function",
          backgroundColor: "#b1927d",
          legend: { position: "bottom" },
          hAxis: {
            title: "Aika",
            format: showFullHistory ? "yyyy-MM-dd" : "HH:mm",
            ...(showFullHistory
              ? {}
              : { viewWindow: { min: startTime, max: endTime } }),
          },
          vAxis: { title: "Lämpötila (°C)", viewWindow: { min: 0, max: 100 } },
        };

        const chart = new google.visualization.LineChart(
          document.getElementById("chart_div"),
        );

        chart.draw(dataTable, options);
      })

      .catch((error) => {
        console.error("Error fetching or drawing chart:", error);
      });
  }
  button.addEventListener("click", () => {
    showFullHistory = !showFullHistory;
    button.textContent = showFullHistory
      ? "Näytä viimeiset 24 tuntia"
      : "Näytä koko historia";
    updateChart();
  });

  updateChart();
  setInterval(updateChart, 13000);
}
