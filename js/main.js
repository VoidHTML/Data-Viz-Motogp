

// Fonction utilitaire pour charger un fichier JSON
async function chargerJSON(fichier) {
    const response = await fetch(`./js/data/${fichier}`);
    if (!response.ok) throw new Error(`Erreur chargement ${fichier}`);
    return await response.json();
}

// === INITIALISATION ===
document.addEventListener("DOMContentLoaded", async () => {
    try {
        // Chargement des données JSON
        const paysData = await chargerJSON("pays.json");
        const crashsData = await chargerJSON("crashs.json");
        const constructeursData = await chargerJSON("constructeurs.json");

        // Initialisation des graphiques
        initGraphPays(paysData);
        initGraphCrashs(crashsData);
        initGraphConstructeurs(constructeursData);

        // Gestion du slider
        initSlider();

        // Apparition du menu au scroll
        window.addEventListener("scroll", () => {
            const navbar = document.getElementById("navbar");
            navbar.classList.toggle("visible", window.scrollY > 100);
        });

        // Smooth scroll sur les liens du menu
        document.querySelectorAll("nav a").forEach(anchor => {
            anchor.addEventListener("click", function (e) {
                e.preventDefault();
                document.querySelector(this.getAttribute("href")).scrollIntoView({
                    behavior: "smooth"
                });
            });
        });

    } catch (err) {
        console.error("Erreur :", err);
    }
});

// === GRAPH : Victoires par pays ===
function initGraphPays(data) {
    const chart = echarts.init(document.getElementById("chart-pays"));
    const option = {
        title: { text: data.titre, textStyle: { color: "#ff6600" } },
        tooltip: { trigger: "axis" },
        xAxis: { type: "category", data: data.pays, axisLabel: { color: "#ccc" } },
        yAxis: { type: "value", axisLabel: { color: "#ccc" } },
        series: [{
            data: data.victoires,
            type: "bar",
            itemStyle: { color: "#ff6600" },
            barWidth: "60%"
        }],
        backgroundColor: "transparent"
    };
    chart.setOption(option);
    window.addEventListener("resize", () => chart.resize());
}

// === GRAPH : Crashs ===
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
            areaStyle: { color: "rgba(255,102,0,0.2)" }
        }],
        backgroundColor: "transparent"
    };
    chart.setOption(option);
    window.addEventListener("resize", () => chart.resize());
}

// === GRAPH : Constructeurs (barres comparatives) ===
function initGraphConstructeurs(data) {
    const marques = Object.keys(data);
    marques.forEach(marque => {
        const chart = echarts.init(document.getElementById(`chart-${marque}`));
        const option = {
            title: { text: data[marque].titre, textStyle: { color: "#ff6600" } },
            tooltip: { trigger: "axis" },
            xAxis: { type: "category", data: data[marque].annees, axisLabel: { color: "#ccc" } },
            yAxis: { type: "value", axisLabel: { color: "#ccc" } },
            series: [{
                data: data[marque].victoires,
                type: "bar",
                itemStyle: { color: data[marque].couleur },
                barWidth: "60%"
            }],
            backgroundColor: "transparent"
        };
        chart.setOption(option);
        window.addEventListener("resize", () => chart.resize());
    });
}

// === SLIDER Constructeurs ===
function initSlider() {
    function showSlide(constructor) {
        document.querySelectorAll(".slide").forEach(s => s.classList.remove("active"));
        document.getElementById(`slide-${constructor}`).classList.add("active");

        document.querySelectorAll(".slide-btn").forEach(btn => btn.classList.remove("active"));
        document.querySelector(`[data-slide="${constructor}"]`).classList.add("active");

        document.querySelectorAll(".indicator").forEach(ind => ind.classList.remove("active"));
        document.querySelector(`.indicator[data-slide="${constructor}"]`).classList.add("active");
    }

    // Boutons
    document.querySelectorAll(".slide-btn").forEach(btn => {
        btn.addEventListener("click", e => {
            e.preventDefault();
            const c = btn.getAttribute("data-slide");
            showSlide(c);
        });
    });

    // Indicateurs
    document.querySelectorAll(".indicator").forEach(ind => {
        ind.addEventListener("click", () => {
            const c = ind.getAttribute("data-slide");
            showSlide(c);
        });
    });
}
