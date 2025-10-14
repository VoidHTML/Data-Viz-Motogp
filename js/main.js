// Chargement des données JSON (à la racine, pas dans data/)
async function chargerJSON(fichier) {
    const response = await fetch(`${fichier}`);
    if (!response.ok) throw new Error(`Erreur chargement ${fichier}`);
    return await response.json();
}

// Initialisation
document.addEventListener('DOMContentLoaded', async function() {
    try {
        // Charger les données
        const paysData = await chargerJSON('pays.json');
        const crashsData = await chargerJSON('crashs.json');
        const constructeursData = await chargerJSON('constructeurs.json');

        // Initialiser les graphiques
        initGraphPays(paysData);
        initGraphCrashs(crashsData);
        initGraphConstructeurs(constructeursData);

        // Initialiser les animations et le slider
        animateOnScroll();
        animateStats();
        initSlider();

        // Navigation au scroll
        window.addEventListener('scroll', () => {
            const navbar = document.getElementById('navbar');
            navbar.classList.toggle('visible', window.scrollY > 100);
        });

        // Smooth scroll
        document.querySelectorAll('nav a').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                document.querySelector(this.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                });
            });
        });
    } catch (err) {
        console.error('Erreur:', err);
    }
});

// Graphique Pays avec ECharts
function initGraphPays(data) {
    const chart = echarts.init(document.getElementById('chart-pays'));
    const option = {
        title: { 
            text: data.titre, 
            textStyle: { color: '#ff6600', fontSize: 16 },
            left: 'center'
        },
        tooltip: { 
            trigger: 'axis',
            axisPointer: { type: 'shadow' }
        },
        xAxis: { 
            type: 'category', 
            data: data.pays, 
            axisLabel: { color: '#ccc', rotate: 45, fontSize: 11 },
            axisLine: { lineStyle: { color: '#666' } }
        },
        yAxis: { 
            type: 'value', 
            axisLabel: { color: '#ccc' },
            axisLine: { lineStyle: { color: '#666' } },
            splitLine: { lineStyle: { color: '#333' } }
        },
        series: [{ 
            data: data.victoires, 
            type: 'bar', 
            itemStyle: { color: '#ff6600', borderRadius: [5, 5, 0, 0] },
            animationDelay: function (idx) { return idx * 100; },
            label: { show: true, position: 'top', color: '#ff6600' }
        }],
        backgroundColor: 'transparent',
        grid: { left: '10%', right: '10%', bottom: '20%', top: '15%' }
    };
    chart.setOption(option);
    window.addEventListener('resize', () => chart.resize());
}

// Graphique Crashs avec ECharts
function initGraphCrashs(data) {
    const chart = echarts.init(document.getElementById('chart-crashs'));
    const option = {
        title: { 
            text: data.titre, 
            textStyle: { color: '#ff6600', fontSize: 16 },
            left: 'center'
        },
        tooltip: { 
            trigger: 'axis',
            formatter: '{b}<br/>Crashs: {c}'
        },
        xAxis: { 
            type: 'category', 
            data: data.annees, 
            axisLabel: { color: '#ccc', fontSize: 11 },
            axisLine: { lineStyle: { color: '#666' } }
        },
        yAxis: { 
            type: 'value', 
            axisLabel: { color: '#ccc' },
            axisLine: { lineStyle: { color: '#666' } },
            splitLine: { lineStyle: { color: '#333' } }
        },
        series: [{
            data: data.crashs,
            type: 'line',
            smooth: true,
            lineStyle: { color: '#ff6600', width: 3 },
            areaStyle: { 
                color: {
                    type: 'linear',
                    x: 0, y: 0, x2: 0, y2: 1,
                    colorStops: [
                        { offset: 0, color: 'rgba(255,102,0,0.5)' },
                        { offset: 1, color: 'rgba(255,102,0,0.1)' }
                    ]
                }
            },
            itemStyle: { color: '#ff6600', borderWidth: 2, borderColor: '#000' },
            symbol: 'circle',
            symbolSize: 8
        }],
        backgroundColor: 'transparent',
        grid: { left: '10%', right: '10%', bottom: '15%', top: '15%' }
    };
    chart.setOption(option);
    window.addEventListener('resize', () => chart.resize());
}

// Graphiques Constructeurs avec ECharts
function initGraphConstructeurs(data) {
    for (const marque in data) {
        const chart = echarts.init(document.getElementById(`chart-${marque}`));
        const option = {
            title: { 
                text: data[marque].titre, 
                textStyle: { color: data[marque].couleur, fontSize: 16 },
                left: 'center'
            },
            tooltip: { 
                trigger: 'axis',
                formatter: '{b}<br/>Victoires: {c}'
            },
            xAxis: { 
                type: 'category', 
                data: data[marque].annees, 
                axisLabel: { color: '#ccc', fontSize: 11 },
                axisLine: { lineStyle: { color: '#666' } }
            },
            yAxis: { 
                type: 'value', 
                axisLabel: { color: '#ccc' },
                axisLine: { lineStyle: { color: '#666' } },
                splitLine: { lineStyle: { color: '#333' } }
            },
            series: [{
                data: data[marque].victoires,
                type: 'bar',
                itemStyle: { color: data[marque].couleur, borderRadius: [5, 5, 0, 0] },
                animationDelay: function (idx) { return idx * 80; },
                label: { show: true, position: 'top', color: data[marque].couleur }
            }],
            backgroundColor: 'transparent',
            grid: { left: '10%', right: '10%', bottom: '15%', top: '15%' }
        };
        chart.setOption(option);
        window.addEventListener('resize', () => chart.resize());
    }
}

// Slider Constructeurs
function initSlider() {
    function showSlide(constructor) {
        document.querySelectorAll('.slide').forEach(s => s.classList.remove('active'));
        document.getElementById(`slide-${constructor}`).classList.add('active');

        document.querySelectorAll('.slide-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-slide="${constructor}"]`).classList.add('active');

        document.querySelectorAll('.indicator').forEach(ind => ind.classList.remove('active'));
        document.querySelector(`.indicator[data-slide="${constructor}"]`).classList.add('active');
    }

    document.querySelectorAll('.slide-btn').forEach(btn => {
        btn.addEventListener('click', e => {
            e.preventDefault();
            showSlide(btn.getAttribute('data-slide'));