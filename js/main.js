// === main.js ===

// Charger un fichier JSON depuis /data/
async function chargerJSON(fichier) {
  const response = await fetch(`data/${fichier}`);
  if (!response.ok) throw new Error(`Erreur chargement ${fichier}`);
  return await response.json();
}

// Initialisation globale
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const paysData = await chargerJSON("pays.json");
    const crashsData = await chargerJSON("crashs.json");
    const constructeursData = await chargerJSON("constructeurs.json");

    initGraphPays(paysData);
    initGraphCrashs(crashsData);
    initGraphConstructeurs(constructeursData);
    initSlider();

    // Navbar visible au scroll
    window.addEventListener("scroll", () => {
      const navbar = document.getElementById("navbar");
      navbar.classList.toggle("visible", window.scrollY > 100);
    });
  } catch (err) {
    console.error("Erreur :", err);
  }
});

// === Graphiques ===
function initGraphPays(data) {
  const chart = echarts.init(document.getElementById("chart-pays"));
  const option = {
    title: { text: data.titre, textStyle: { color: "#ff6600" } },
    tooltip: { trigger: "axis" },
    xAxis: { type: "category", data: data.pays, axisLabel: { color: "#ccc" } },
    yAxis: { type: "value", axisLabel: { color: "#ccc" } },
    series: [{ data: data.victoires, type: "bar", itemStyle: { color: "#ff6600" } }],
    backgroundColor: "transparent"
  };
  chart.setOption(option);
  window.addEventListener("resize", () => chart.resize());
}

function initGraphCrashs(data) {
  const chart = echarts.init(document.getElementById("chart-crashs"));
  const option = {
    title: { text: data.titre, textStyle: { color: "#ff6600" } },
    tooltip: { trigger: "axis" },
    xAxis: { type: "category", data: data.annees, axisLabel: { color: "#ccc" } },
    yAxis: { type: "value", axisLabel: { color: "#ccc" } },
    series: [{
      data: data.crashs,
      type: "line",
      smooth: true,
      lineStyle: { color: "#ff6600" },
      areaStyle: { color: "rgba(255,102,0,0.3)" }
    }],
    backgroundColor: "transparent"
  };
  chart.setOption(option);
  window.addEventListener("resize", () => chart.resize());
}

function initGraphConstructeurs(data) {
  for (const marque in data) {
    const chart = echarts.init(document.getElementById(`chart-${marque}`));
    const option = {
      title: { text: data[marque].titre, textStyle: { color: data[marque].couleur } },
      tooltip: { trigger: "axis" },
      xAxis: { type: "category", data: data[marque].annees, axisLabel: { color: "#ccc" } },
      yAxis: { type: "value", axisLabel: { color: "#ccc" } },
      series: [{
        data: data[marque].victoires,
        type: "bar",
        itemStyle: { color: data[marque].couleur }
      }],
      backgroundColor: "transparent"
    };
    chart.setOption(option);
    window.addEventListener("resize", () => chart.resize());
  }
}

// === Slider Constructeurs ===
function initSlider() {
  function showSlide(constructor) {
    document.querySelectorAll(".slide").forEach(s => s.classList.remove("active"));
    document.getElementById(`slide-${constructor}`).classList.add("active");

    document.querySelectorAll(".slide-btn").forEach(btn => btn.classList.remove("active"));
    document.querySelector(`[data-slide="${constructor}"]`).classList.add("active");

    document.querySelectorAll(".indicator").forEach(ind => ind.classList.remove("active"));
    document.querySelector(`.indicator[data-slide="${constructor}"]`).classList.add("active");
  }

  document.querySelectorAll(".slide-btn").forEach(btn => {
    btn.addEventListener("click", e => {
      e.preventDefault();
      showSlide(btn.getAttribute("data-slide"));
    });
  });

  document.querySelectorAll(".indicator").forEach(ind => {
    ind.addEventListener("click", () => showSlide(ind.getAttribute("data-slide")));
  });
}
