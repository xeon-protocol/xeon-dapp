
var container, stats;
var camera, controls, scene, renderer;
var info;
var cube;
var sphereTab = [];
var objects = [];
var intersectObjects = [];
var parent2;
var sun;
var sun2;
var sun3;
var currentcolor;
var cubeNul;
var earthPivot;
var earthPivot3;
var mesh;
var planetViewed = 0;
var material3; // Define material3 here

document.addEventListener('DOMContentLoaded', function() {
    init();
    animate();
});


$(window).on('load', function() {
    TweenMax.to($('#ecosystemWelcome'), 1, {
        css: {
            opacity: 1
        },
        ease: Quad.easeInOut,
    });
   TweenMax.to($('#developmentStatus'), 0.5, {
        css: {
            bottom:'20px'
        },delay:0.5,
        ease: Quad.easeInOut,
    });
    TweenMax.to($('#border'), 0.5, {
        css: {
            height: '200px',
        },
        delay: 0.5,
        ease: Quad.easeInOut,
    });
   
});

function hideecosystemWelcome() {
    TweenMax.to($('#ecosystemWelcome'), 0.5, {
        css: {
            opacity: 0
        },
        ease: Quad.easeInOut
    });
    TweenMax.to($('#ecosystemWelcome'), 0.5, {
        css: {
            display: 'none'
        },
        delay: 1,
        ease: Quad.easeInOut
    });
}

function init() {
    camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 95;
    controls = new THREE.OrbitControls(camera);
    controls.maxDistance = 100;
    controls.minDistance = 30;
    scene = new THREE.Scene();
    var geoSphere = new THREE.SphereGeometry(Math.random() * 1, 20, 20);
    for (var i = 0; i < 500; i++) {
        // randRadius = Math.random()*30+10;
        lumiereS = new THREE.MeshPhongMaterial({
            emissive: '#08e7fe'
        });
        sphereTab.push(new THREE.Mesh(new THREE.SphereGeometry(Math.random() * 1, 20, 20), lumiereS));
    }
    var posX = -3000;
    var posY = -3000;
    for (var i = 0; i < sphereTab.length; i++) {
        sphereTab[i].position.set(Math.random() * 600 - 300, Math.random() * 600 - 300, Math.random() * 600 - 300);
        scene.add(sphereTab[i]);
    }
    //////Sun////////
    // Generate a random number between 0x42ecf5 and 0xf542b9 for the specular color
    // Cooloest manual colors list: #592417, #
    var minSpecular = 0x42ecf5;
    var maxSpecular = 0xf542b9;
    var randomSpecular = Math.floor(Math.random() * (maxSpecular - minSpecular + 1)) + minSpecular;

    // Convert the random specular number to a hexadecimal color string
    var randomSpecularHex = '#' + randomSpecular.toString(16);

    var pinkMat = new THREE.MeshPhongMaterial({
        color: 0x090a21, //gold sun 0xF66120
        emissive: 0x090a21,
        specular: randomSpecularHex, //yellow filter, purple filter 0xf542b9, light blue 0x42ecf5
        shininess: 10,
        shading: THREE.FlatShading,
        transparent: 1,
        opacity: 1
    });
    var pinkMat2 = new THREE.MeshPhongMaterial({
        color: 0x090a21,
        emissive: 0x090a21,
       specular: randomSpecularHex,
        shininess: 10,
        shading: THREE.FlatShading,
        transparent: 1,
        opacity: 1
    });


    var geometry = new THREE.IcosahedronGeometry(3, 1);
    var geometry2 = new THREE.IcosahedronGeometry(2.5, 1);
    var geometry4 = new THREE.IcosahedronGeometry(3, 1);
    // material
    var material = new THREE.MeshPhongMaterial({
        color: 0x089353,
        emissive: 0x089353,
        shading: THREE.FlatShading
    });
    var material2 = new THREE.MeshPhongMaterial({
        color: 0x188dd6,
        emissive: 0x188dd6,
        shading: THREE.FlatShading
    });
    var material4 = new THREE.MeshPhongMaterial({
        color: 0x600164,
        emissive: 0x600164,
        shading: THREE.FlatShading
    });

    sun = new THREE.Mesh(new THREE.IcosahedronGeometry(10, 1), pinkMat);
    scene.add(sun);
    objects.push(sun);
    sun2 = new THREE.Mesh(new THREE.IcosahedronGeometry(10, 1), pinkMat2);
    sun2.rotation.x = 1;
    scene.add(sun2);
    objects.push(sun2);
    sun3 = new THREE.Mesh(new THREE.IcosahedronGeometry(10, 1), pinkMat2);
    sun3.rotation.x = 1;
    scene.add(sun2);
    objects.push(sun3);
 
    earthPivot3 = new THREE.Object3D();
    sun.add(earthPivot3);

    var radius = 16;
    var tubeRadius = 0.03;
    var radialSegments = 8 * 10;
    var tubularSegments = 6 * 15;
    var arc = Math.PI * 3;
    var geometry3 = new THREE.TorusGeometry(radius, tubeRadius, radialSegments, tubularSegments, arc);
    var material3 = new THREE.MeshLambertMaterial({
        color: 0xffffff,
        emissive: 0xffffff,
        shading: THREE.FlatShading,
    });
    mesh = new THREE.Mesh(geometry3, material3);
    earthPivot3.add(mesh);
    /// planet blue ///
    earthPivot = new THREE.Object3D();
    sun.add(earthPivot);
    var earth = new THREE.Mesh(geometry, material);
    earth.position.x = 15;
    earthPivot.add(earth);
    objects.push(earth);
    ///// planet green ////
    earthPivot2 = new THREE.Object3D();
    sun.add(earthPivot2);
    var earth2 = new THREE.Mesh(geometry2, material2);
    earth2.position.x = 20;
    earthPivot2.add(earth2);
    objects.push(earth2);
    ////planet violet ///
    earthPivot4 = new THREE.Object3D();
    sun.add(earthPivot4);
    var earth3 = new THREE.Mesh(geometry4, material4);
    earth3.position.x = 26;
    earthPivot4.add(earth3);
    objects.push(earth3);

    // lights
    light = new THREE.DirectionalLight(0x4f4f4f);
    light.position.set(4, 4, 4);
    scene.add(light);
    light = new THREE.DirectionalLight(0x4f4f4f);
    light.position.set(-4, -4, -4);
    scene.add(light);
    //render
    renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    });
    renderer.sortObjects = false;
    renderer.setClearColor(0x040115, 0.6); //canvas color and opacity
    renderer.setSize(window.innerWidth, window.innerHeight);
    stats = new Stats();
    container = document.getElementById('ecosystemContainer');
    container.appendChild(renderer.domElement);
    window.addEventListener('resize', onWindowResize, false);
    info = document.getElementById('ecoContentTitle');
    subtitle = document.getElementById('subtitle');
    description = document.getElementById('description')
    var univers = document.getElementById('univers');
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    render();
}

function setFromCamera(raycaster, coords, origin) {
    raycaster.ray.origin.copy(camera.position);
    raycaster.ray.direction.set(coords.x, coords.y, 0.5).unproject(camera).sub(camera.position).normalize();
}



function onMouseDown(event) {
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();
    mouse.x = (event.clientX / renderer.domElement.width) * 2 - 1;
    mouse.y = -(event.clientY / renderer.domElement.height) * 2 + 1;
    setFromCamera(raycaster, mouse, camera);
    var intersects = raycaster.intersectObjects(objects);
    
    if (intersects.length > 0) {
        currentcolor = intersects[0].object.material.color.getHex();

        // debugging information
        console.log('Intersected object color: ' + currentcolor);
        console.log('Intersected object: ', intersects[0].object);
        console.log('Intersected object type: ' + intersects[0].object.geometry.type);

        switch (intersects[0].object.geometry.type) {
            case 'IcosahedronGeometry':
                if (currentcolor == 0x090a21) {
                    
                    if (planetViewed == 0) {
                        hideecosystemWelcome();
                        planetViewed = 1;
                        TweenMax.from($('#ecoContent'), 0.5, {
                            css: {
                                left: '-500px'
                            },
                            delay:0.5,
                            ease: Quad.easeInOut
                        });

                        TweenMax.from($('#border'), 0.5, {
                            css: {
                                height: '0px'
                            },
                            delay: 1,
                            ease: Quad.easeInOut,
                        });                      
                        
                        info.innerHTML = " <span>Neon</span> Protocol";
                 
                        description.innerHTML = "Universal ERC20 <span>Hedging</span> and <span>Lending</span> ecosystem comprising 3 Platforms.<br/><br/><div>Click on the ecosystem planets to learn more ...<div>";
                    }
                    if (planetViewed == 2 || planetViewed==3 || planetViewed==4) {
                        planetViewed = 1;
                        TweenMax.from($('#ecoContent'), 0.5, {
                            css: {
                                left: '-500px'
                            },
                            ease: Quad.easeInOut
                        });
                        TweenMax.to($('#border'), 0.2, {
                            css: {
                                height: '200px'
                            },delay:1,
                            ease: Quad.easeInOut,
                        });
                           TweenMax.from($('#border'), 0.5, {
                            css: {
                                height: '0px'
                            },
                            delay: 0.5,
                            ease: Quad.easeInOut,
                        });

                        info.innerHTML = " <span>Neon</span> Protocol";
                 
                        description.innerHTML = "Universal ERC20 <span>Hedging</span> and <span>Lending</span> ecosystem comprising 3 Platforms.<br/><br/><div>Click on the ecosystem planets to learn more ...<div>";
                    }
                    updateCurrentMeshColor(0xFFFFFF);
                }
                if (currentcolor == 0x089353) {
                    
                    if (planetViewed == 0 || planetViewed == 1 || planetViewed==3 || planetViewed==4) {
                        updateInformation();
                        planetViewed = 2;
                        info.innerHTML = " Neon <span id='couleur'>Hedging</span>";
                 
                        document.getElementById('couleur').style.color="#2ce492";
                        document.getElementById('couleur').style.textShadow="0 0 2px #089556, 0 0 3px #089556, 0 0 15px #089556, 0 0 15px #089556, 0 0 3px #089556, 3px 3px 0.5px #014324";

                        description.innerHTML = "OTC: Call Options, Put Options, Equity Swaps. Hedge or speculate any ERC20 token.<br/><br/><div>Click on the other planets to learn more ...<div>";
                     
                        TweenMax.from($('#ecoContent'), 0.5, {
                            css: {
                                left: '-500px'
                            },
                            ease: Quad.easeInOut
                        });
                        TweenMax.to($('#border'), 0.2, {
                            css: {
                                height: '200px'
                            },delay:1,
                            ease: Quad.easeInOut,
                        });
                       
                         TweenMax.from($('#border'), 0.5, {
                            css: {
                                height: '0px'
                            },
                            delay: 0.5,
                            ease: Quad.easeInOut,
                        });
                    }
                    updateCurrentMeshColor(0x2ce492);
                }
                if (currentcolor == 0x188dd6) {
                    if (planetViewed == 0 || planetViewed == 1 || planetViewed==2 || planetViewed==4) {
                        updateInformation();
                        planetViewed = 3;
                        info.innerHTML = ' Neon <span id="couleur">Lending</span>';
                      
                         
                        description.innerHTML = "Borrow against any ERC20 token, lend any ERC20 token as liquidity.<br/><br/><div>Click on the other planets to learn more ...<div>";
                        document.getElementById('couleur').style.color="#26D7E7";

                        TweenMax.from($('#ecoContent'), 0.5, {
                            css: {
                                left: '-500px'
                            },
                            ease: Quad.easeInOut
                        });

                        TweenMax.to($('#border'), 0.2, {
                            css: {
                                height: '200px'
                            },delay:1,
                            ease: Quad.easeInOut,
                        });
                         TweenMax.from($('#border'), 0.5, {
                            css: {
                                height: '0px'
                            },
                            delay: 0.5,
                            ease: Quad.easeInOut,
                        });
                    }
                    updateCurrentMeshColor(0x188dd6);
                }   
                if (currentcolor == 0x600164) {
                    if (planetViewed == 0 || planetViewed == 1 || planetViewed==2 || planetViewed==3) {
                        updateInformation();
                        planetViewed = 4;
                        info.innerHTML = ' Neon <span id="couleur">Farming</span>';
                         document.getElementById('couleur').style.color="#a824d7";
                         document.getElementById('couleur').style.textShadow="0 0 2px #650089, 0 0 3px #650089, 0 0 15px #650089, 0 0 15px #650089, 0 0 3px #650089, 3px 3px 0.5px #4a0663";

                  
                        description.innerHTML = "Join pools to provide native Hedging or Lending liquidity on our protocol and earn yield. Projects can farm their own ERC20 token.<br/><br/><div>Click on the other planets to learn more ...<div>";

                        TweenMax.from($('#ecoContent'), 0.5, {
                            css: {
                                left: '-500px'
                            },
                            ease: Quad.easeInOut
                        });

                        TweenMax.to($('#border'), 0.1, {
                            css: {
                                height: '200px'
                            },delay:1,
                            ease: Quad.easeInOut,
                        });
                         TweenMax.from($('#border'), 0.5, {
                            css: {
                                height: '0px'
                            },
                            delay: 0.5,
                            ease: Quad.easeInOut,
                        });
                    }
                    updateCurrentMeshColor(0xa824d7);
                }
                break;
        }
    }
    console.log('Down');    
}

document.addEventListener('click', function(event) {
    var ecosystemContainer = document.getElementById('ecosystemContainer');
    // Check if the target element of the click event is inside the ecosystemContainer to adjust view
    if (ecosystemContainer.contains(event.target)) {
        scrollToEcosystemContainer();
    } else {
        // Click is outside the ecosystemContainer
    }
});

function updateInformation() {
        hideecosystemWelcome();
        planetViewed = 1;
        TweenMax.from($('#ecoContent'), 0.5, {
            css: {
                left: '-500px'
            },
            delay:0.5,
            ease: Quad.easeInOut
        });

        TweenMax.from($('#border'), 0.5, {
            css: {
                height: '0px'
            },
            delay: 1,
            ease: Quad.easeInOut,
        });                      
        
        info.innerHTML = " <span>Neon</span> Protocol";
 
        description.innerHTML = "Universal ERC20 <span>Hedging</span> and <span>Lending</span> ecosystem comprising 3 Platforms.<br/><br/><div>Click on the ecosystem planets to learn more ...<div>";
}


function updateCurrentMeshColor(currentcolor) {
    // Update material3.color to match the clicked planet's color. Redundant code no option for this
    var radius = 16;
    var tubeRadius = 0.03;
    var radialSegments = 8 * 10;
    var tubularSegments = 6 * 15;
    var arc = Math.PI * 3;
    var geometry3 = new THREE.TorusGeometry(radius, tubeRadius, radialSegments, tubularSegments, arc);
    var material3 = new THREE.MeshLambertMaterial({
        color: currentcolor,
        emissive: currentcolor,
        shading: THREE.FlatShading,
    });
    mesh = new THREE.Mesh(geometry3, material3);
    earthPivot3.add(mesh);
}

function scrollToEcosystemContainer() {
    var containerEco = document.getElementById('ecosystemContainer');
    var offset = 10; // top distance adjuster, tucks the container higher
    var containerTop = containerEco.getBoundingClientRect().top + window.scrollY - offset;
    var scrollDuration = 1000; 

    // smooth scrolling for a nicer effect
    window.scrollTo({
        top: containerTop,
        behavior: 'smooth'
    });
}

document.addEventListener('mousedown', onMouseDown, false);

function animate() {
    ;
    var timer = 0.00001 * Date.now();
    for (var i = 0, il = sphereTab.length; i < il; i++) {
        var sfere = sphereTab[i];
        sfere.position.x = 400 * Math.sin(timer + i);
        sfere.position.z= 500 * Math.sin( timer + i * 1.1 );
        sfere.position.z = 400 * Math.sin(timer + i * 1.1);
    }
    sun.rotation.x += 0.004;
    sun2.rotation.y += 0.004;
    sun3.rotation.z += 0.004;
    earthPivot.rotation.z += 0.003;
    earthPivot2.rotation.z += 0.008;
    earthPivot3.rotation.y += 0.003;
    earthPivot4.rotation.z+=0.004;
    requestAnimationFrame(animate);
    controls.update();
    render();
}

function render() {
    // }
    renderer.render(scene, camera)
}