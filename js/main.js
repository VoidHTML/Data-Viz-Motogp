// Chargement des données JSON
async function chargerJSON(fichier) {
    const response = await fetch(`data/${fichier}`);
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
        
        // Redessiner le graphique après changement de slide
        setTimeout(() => {
            const chartElement = document.getElementById(`chart-${constructor}`);
            if (chartElement) {
                const chartInstance = echarts.getInstanceByDom(chartElement);
                if (chartInstance) {
                    chartInstance.resize();
                }
            }
        }, 100);
    }

    document.querySelectorAll('.slide-btn').forEach(btn => {
        btn.addEventListener('click', e => {
            e.preventDefault();
            showSlide(btn.getAttribute('data-slide'));
            btn.style.transform = 'scale(0.95)';
            setTimeout(() => { btn.style.transform = ''; }, 150);
        });
    });

    document.querySelectorAll('.indicator').forEach(ind => {
        ind.addEventListener('click', () => showSlide(ind.getAttribute('data-slide')));
    });
}

// Animations au scroll
function animateOnScroll() {
    const elements = document.querySelectorAll('.text-card, .chart-container, .stat-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 100);
            }
        });
    }, { threshold: 0.2 });

    elements.forEach(element => {
        observer.observe(element);
    });
}

// Animation des statistiques avec compteur
function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(stat => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.dataset.animated) {
                    entry.target.dataset.animated = 'true';
                    const finalValue = entry.target.textContent;
                    const isPercentage = finalValue.includes('%');
                    const numericValue = parseInt(finalValue.replace(/[^\d]/g, ''));
                    
                    let currentValue = 0;
                    const increment = numericValue / 50;
                    
                    const counter = setInterval(() => {
                        currentValue += increment;
                        if (currentValue >= numericValue) {
                            currentValue = numericValue;
                            clearInterval(counter);
                        }
                        
                        entry.target.textContent = Math.floor(currentValue) + (isPercentage ? '%' : '');
                    }, 30);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(stat);
    });
}


// Variables globales pour le carousel circuits
let currentCircuitIndex = 0;
const circuitCards = document.querySelectorAll('.circuit-card-3d');
const circuitIndicators = document.querySelectorAll('.circuit-indicator');
const totalCircuits = circuitCards.length;

// Fonction pour mettre à jour l'affichage du carousel
function updateCircuitCarousel() {
    circuitCards.forEach((card, index) => {
        // Retirer toutes les classes
        card.classList.remove('active', 'prev', 'next');
        
        if (index === currentCircuitIndex) {
            // Carte active (au centre)
            card.classList.add('active');
        } else if (index === (currentCircuitIndex - 1 + totalCircuits) % totalCircuits) {
            // Carte précédente (à gauche)
            card.classList.add('prev');
        } else if (index === (currentCircuitIndex + 1) % totalCircuits) {
            // Carte suivante (à droite)
            card.classList.add('next');
        }
    });

    // Mettre à jour les indicateurs
    circuitIndicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentCircuitIndex);
    });
}

// Fonction pour changer de carte
function changeCircuitCard(direction) {
    currentCircuitIndex = (currentCircuitIndex + direction + totalCircuits) % totalCircuits;
    updateCircuitCarousel();
}

// Fonction pour aller directement à une carte
function goToCircuitCard(index) {
    currentCircuitIndex = index;
    updateCircuitCarousel();
}

// Écouteurs d'événements pour les flèches
document.querySelector('.circuit-arrow-left').addEventListener('click', () => {
    changeCircuitCard(-1);
});

document.querySelector('.circuit-arrow-right').addEventListener('click', () => {
    changeCircuitCard(1);
});

// Écouteurs d'événements pour les indicateurs
circuitIndicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
        goToCircuitCard(index);
    });
});

// Support clavier pour le carousel circuits
document.addEventListener('keydown', (e) => {
    // Vérifier si on est dans la section circuits
    const circuitsSection = document.querySelector('#circuits');
    const rect = circuitsSection.getBoundingClientRect();
    const isInView = rect.top < window.innerHeight && rect.bottom > 0;
    
    if (isInView) {
        if (e.key === 'ArrowLeft') {
            changeCircuitCard(-1);
        } else if (e.key === 'ArrowRight') {
            changeCircuitCard(1);
        }
    }
});

// Support tactile (swipe) pour mobile
let touchStartX = 0;
let touchEndX = 0;

const carouselContainer = document.querySelector('.circuits-carousel-container');

carouselContainer.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
}, false);

carouselContainer.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}, false);

function handleSwipe() {
    const swipeThreshold = 50; // Distance minimale pour détecter un swipe
    
    if (touchEndX < touchStartX - swipeThreshold) {
        // Swipe vers la gauche -> carte suivante
        changeCircuitCard(1);
    }
    
    if (touchEndX > touchStartX + swipeThreshold) {
        // Swipe vers la droite -> carte précédente
        changeCircuitCard(-1);
    }
}

// Auto-play optionnel (commenté par défaut)
// let autoPlayInterval;
// function startAutoPlay() {
//     autoPlayInterval = setInterval(() => {
//         changeCircuitCard(1);
//     }, 5000); // Change toutes les 5 secondes
// }

// function stopAutoPlay() {
//     clearInterval(autoPlayInterval);
// }

// // Démarrer l'auto-play
// startAutoPlay();

// // Arrêter l'auto-play au hover
// carouselContainer.addEventListener('mouseenter', stopAutoPlay);
// carouselContainer.addEventListener('mouseleave', startAutoPlay);

// Initialisation du carousel au chargement
updateCircuitCarousel();

console.log('🏁 Carousel 3D des circuits initialisé avec succès!');