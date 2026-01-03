var g = {
    camera: {},
    computer: {},
    imgs: {},
    imgs_to_load: {
        woodsDef1: "https://res.cloudinary.com/dohbq0tta/image/upload/v1763765144/woodsDef1_l1matw.jpg",
        woodsLarry1: "https://res.cloudinary.com/dohbq0tta/image/upload/v1763768817/woodsLarry1_l3iwg9.png",
        woodsLarry2: "https://res.cloudinary.com/dohbq0tta/image/upload/v1763768817/woodsLarry2_hd9yzz.png",
        woodsLarry3: "https://res.cloudinary.com/dohbq0tta/image/upload/v1763768817/woodsLarry3_oyqcpf.png",

        schoolEntranceDef1: "https://res.cloudinary.com/dohbq0tta/image/upload/v1764962054/schoolEntranceDef1Temp_iiw8qa.png",
        schoolEntranceLarry1: "https://res.cloudinary.com/dohbq0tta/image/upload/v1764962682/schoolEntranceLarry1_kypm4t.png",
        schoolEntranceLarry2: "https://res.cloudinary.com/dohbq0tta/image/upload/v1764962881/schoolEntranceLarry2_rcq64r.png",
        schoolEntranceLarry3: "https://res.cloudinary.com/dohbq0tta/image/upload/v1764963031/schoolEntranceLarry3_la2kld.png",

        cameraViewerDef: "https://res.cloudinary.com/dohbq0tta/image/upload/v1763673279/Desk_3_qcorr7.jpg",
    },
    gameVars: {
        commandHistory: [],
        commandHistoryIndex: -1,
        cameraInitialized: false,
        inCam: false,
        currentCamera: "woods",
        statusData: {
            energy: 1000,
            maxEnergy: 1000,
        },
        locations: {
            woods: {
                name: "The Woods",
                description: "A dense forest area located on the outskirts of campus. Known for its tall trees and winding paths, it's a popular spot for students seeking solitude or adventure. However, recent reports of strange sightings have made it a place of intrigue and caution.",
                img: "woodsDef1",
            },
            school1: {
                name: "The School Entrance",
                description: "A dense forest area located on the outskirts of campus. Known for its tall trees and winding paths, it's a popular spot for students seeking solitude or adventure. However, recent reports of strange sightings have made it a place of intrigue and caution.",
                img: "schoolEntranceDef1",
            }
        },
        enemies: {
            larry: {
                name: "Larry the Lurker",
                description: "A mysterious figure often spotted lurking in the shadows of the woods. Descriptions vary, but many report seeing a tall, thin figure with glowing eyes. Larry is known for his stealth and ability to appear and disappear without a trace.",
                location: "woods",
                placementLevel: 0,
                levelImgs: {
                    woods: [
                        "woodsLarry1",
                        "woodsLarry2",
                        "woodsLarry3",
                    ],
                    school1: [
                        "schoolEntranceLarry1",
                        "schoolEntranceLarry2",
                        "schoolEntranceLarry3",
                    ],
                }
            }
        }
    },
};
var gee;
window.onload = function() {
    g.block = document.createElement('div');
    g.block.style.position = 'absolute';
    g.block.style.top = '0';
    g.block.style.left = '0';
    g.block.style.width = '100%';
    g.block.style.height = '100%';
    g.block.style.backgroundColor = 'black';
    g.block.style.zIndex = '9999';
    document.body.appendChild(g.block);
    g.startButton = document.createElement('button');
    g.startButton.disabled = true;
    g.startButton.innerText = "Start Campus Watchers OS";
    g.startButton.style.position = 'absolute';
    g.startButton.style.top = '50%';
    g.startButton.style.left = '50%';
    g.startButton.style.transform = 'translate(-50%, -50%)';
    g.startButton.style.padding = '20px 40px';
    g.startButton.style.fontSize = '24px';
    g.startButton.onclick = function() {
        typeLine(g.computer.entranceLines);
        g.block.remove();
    };

    document.getElementById("gameFullscreen").onclick = function() {
        document.body.requestFullscreen();
        setTimeout(()=>{
            g.camera.ele.style.width = `${window.innerHeight * 3}px`;
            g.camera.width = g.camera.ele.clientWidth;
            g.camera.height = g.camera.ele.clientHeight;
        }, 100);
    };

    document.getElementById("CMDInput").addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            event.preventDefault(); // Prevent default behavior (e.g., form submission)
            const input = event.target;
            const command = input.value.trim();
            if (command.length > 0) {
                g.computer.ele.innerHTML += `> ${command}<br>`;
                // Process command here

                if(g.gameVars.inCam) {
                    if(command.toLowerCase() === "exit_cam" || command.toLowerCase() === "exit-cam" || command.toLowerCase() === "exit") {
                        document.getElementById('cameraMonitor').style.display = 'none';
                        document.getElementById('monitorMain').style.display = 'block';
                        document.getElementById("CMDInput").disabled = false;
                        g.gameVars.inCam = false;
                        document.getElementById("CMDInput").focus();
                        attemptNewLine("Exiting camera view.", true);
                    }
                } else {

                    if (command.toLowerCase() === "help") {
                        attemptNewLine([["Available commands:", 1000], "  - help", "  - status", "  - view_cam [camera_name] *See Camera Names In {list_cams} Command*", "  - list_cams", "  - exit_cam"], true);
                    } else if (command.toLowerCase() === "status") {
                        let statusLines = [
                            "Facility Status:",
                            `  Energy: ${g.gameVars.statusData.energy} kJ / ${g.gameVars.statusData.maxEnergy} kJ`,
                        ];
                        
                        attemptNewLine(statusLines, true);
                    } else if (command.toLowerCase().includes("view_cam") || command.toLowerCase().includes("view-cam")) {
                        if(command.split(" ").length > 1) {
                            let camName = command.split(" ")[1];
                            if(g.gameVars.locations[camName]) {
                                g.gameVars.currentCamera = camName;
                                attemptNewLine(`Switched to camera: ${g.gameVars.locations[camName].name}`, true);
                                setTimeout(()=>{
                                    updateActiveCameraLabel();
                                    document.getElementById('cameraMonitor').style.display = 'block';
                                    g.gameVars.inCam = true;
                                    document.getElementById('monitorMain').style.display = 'none';
                                    if(g.gameVars.cameraInitialized == false){
                                        initilizeCanvas();
                                        g.gameVars.cameraInitialized = true;
                                    };
                                    draw();
                                }, 500);
                            } else {
                                attemptNewLine(`Camera '${camName}' not found.`, true);
                            }
                        } else {
                            attemptNewLine("Please specify a camera name. Usage: view_cams [camera_name]", true);
                        }
                        
                    } else if(command.toLowerCase() === "list_cams" || command.toLowerCase() === "list-cams") {
                        let camList = ["Available Cameras:"];
                        for (let cam in g.gameVars.locations) {
                            camList.push(`  - ${cam}: ${g.gameVars.locations[cam].name}`);
                        }
                        attemptNewLine(camList, true);
                    } else if(command === "MarkathiousPort") {
                        attemptNewLine("Easter Egg Found! Hello, Markathious!", true);
                    } else {
                        attemptNewLine(`Unknown command: ${command}`);
                    }
                };
                // Clear input field
                input.value = "";
                // Scroll to bottom
                const monitorMain = document.getElementById("monitorMain");
                monitorMain.scrollTop = monitorMain.scrollHeight;
                commandHistoryPush(command);
            };
        };
    });

    function commandHistoryPush(command) {
        g.gameVars.commandHistory.push(command);
        g.gameVars.commandHistoryIndex = g.gameVars.commandHistory.length;
    }

    document.getElementById("CMDInput").addEventListener("keydown", function(event) {
        if (event.key === "ArrowUp") {
            if (g.gameVars.commandHistoryIndex > 0) {
                g.gameVars.commandHistoryIndex--;
                event.target.value = g.gameVars.commandHistory[g.gameVars.commandHistoryIndex];
            }
            event.preventDefault();
        } else if (event.key === "ArrowDown") {
            if (g.gameVars.commandHistoryIndex < g.gameVars.commandHistory.length - 1) {
                g.gameVars.commandHistoryIndex++;
                event.target.value = g.gameVars.commandHistory[g.gameVars.commandHistoryIndex];
            } else {
                g.gameVars.commandHistoryIndex = g.gameVars.commandHistory.length;
                event.target.value = "";
            }
            event.preventDefault();
        }
    });

    g.block.appendChild(g.startButton);
    //Camera Viewer Setup
    g.camera.ele = document.getElementById('cameraViewer');
    g.camera.ele.style.width = `${window.innerHeight * 3}px`; // 300% of container
    g.camera.width = g.camera.ele.clientWidth; // 300% of container
    g.camera.height = g.camera.ele.clientHeight; // 100% of container
    g.camera.position = 1;
    g.camera.ele.style.left = `-${g.camera.width/3}px`;
        document.querySelector("#LeftInd").addEventListener("click", function() {
            setMonitorExpanded(false);
            if(g.camera.position == 1){
                g.camera.ele.style.left = `0px`;
                console.log("left");
                g.camera.position = 0;
            }
            else if(g.camera.position == 2){
                g.camera.ele.style.left = `-${g.camera.width/3}px`;
                console.log("center");
                g.camera.position = 1;
            }
        });
        document.querySelector("#RightInd").addEventListener("click", function() {
            setMonitorExpanded(false);
            if(g.camera.position == 0){
                g.camera.ele.style.left = `-${g.camera.width/3}px`;
                console.log("center");
                g.camera.position = 1;
            }
            else if(g.camera.position == 1){
                g.camera.ele.style.left = `-${g.camera.width/3*2}px`;
                console.log("right");
                g.camera.position = 2;
            }
        });


    //World Images Setup

    g.camera.ele.style.backgroundImage = "url('https://res.cloudinary.com/dohbq0tta/image/upload/v1763673279/Desk_3_qcorr7.jpg')";

    //Computer Monitor Setup
    g.computer.ele = document.getElementById('monitorOutput');
    g.computer.entranceLines = [
        ["System Booting...", 1000],
        "Loading Campus Watcher OS v0.1.0...",
        "Establishing Secure Connection...",
        "Connection Established.",
        "Welcome, Operator.",
        "Warning: Unauthorized use of this system is prohibited and may be subject to criminal and civil penalties.",
        ["Further use indicates consent to these terms.", 1000],
        ["Initializing Camera Feeds...", 1000],
        "Camera Feeds Initialized.",
        ["Type 'help' for a list of commands.", ["function", function() {document.getElementById("CMDInput").disabled = false; document.getElementById("CMDInput").focus();}]],
    ];
    g.computer.currentLine = 0;
    attemptNewLine = function(lines, cmd) {
        if(Array.isArray(lines) == false) {
            lines = [lines];
        }
        if(!g.computer.typing) {
            typeLine(lines, cmd);
        }
    };
    function typeLine(givenLines, cmd) {
        if(g.computer.currentLine < givenLines.length) {
            g.computer.typing = true;
            if(cmd && g.computer.currentLine == 0) {
                g.computer.ele.innerHTML += "> ";
            } else if(!cmd) {
                g.computer.ele.innerHTML += "> ";
            }
            let line = givenLines[g.computer.currentLine];
            let i = 0;
            let wait = 2;
            var button = null;
            if(line instanceof Array) {
                if (typeof line[1] === 'number') {
                    wait = line[1];
                    line = line[0];
                } else if (Array.isArray(line[1])) {
                    if(line[1][0] == "button") {
                        button = document.createElement("button");
                        button.innerText = line[1][1];
                        button.functionToRun = line[1][2];
                        line = line[0];
                    } else if (line[1][0] == "function") {
                        line[1][1]();
                        line = line[0];
                    }
                } else {
                    line = line[0];
                }
            };
            let interval = setInterval(() => {
                if(i < line.length) {
                    g.computer.ele.innerHTML += line.charAt(i);
                    i++;
                } else {
                    clearInterval(interval);
                    // append a real <br> element instead of using innerHTML (preserves event listeners)
                    g.computer.ele.appendChild(document.createElement('br'));
                    g.computer.currentLine++;
                    if(button != null) {
                        button.onclick = function() {
                            console.log("Button clicked");
                            this.functionToRun();
                            return false;
                        };
                        gee = g.computer.ele.appendChild(button);
                        // append a line break node instead of mutating innerHTML which would remove
                        // the button's event listeners
                        g.computer.ele.appendChild(document.createElement('br'));
                        button = null;
                        //gee.onclick();
                    }
                    setTimeout(typeLine, wait, givenLines, cmd);
                    monitorMain = document.getElementById("monitorMain");
                    monitorMain.scrollTop = monitorMain.scrollHeight;
                    
                }
            }, 1);
        } else {
            g.computer.currentLine = 0;
            g.computer.typing = false;
        }
    }
    setInterval(function() {
        let ele = document.getElementById('monitorMain');
        if(ele.scrollTop > 0) {
            document.getElementById('scrollTop').style.display = 'block';
        } else {
            document.getElementById('scrollTop').style.display = 'none';
        }
        if(ele.scrollTop + ele.clientHeight < ele.scrollHeight) {
            document.getElementById('scrollBottom').style.display = 'block';
        } else {
            document.getElementById('scrollBottom').style.display = 'none';
        }

        document.getElementById("CMDInput").focus();
    }, 10);

    // Toggle monitor to fill the #gameboard element (instead of browser fullscreen)
    const fullscreenComputerEl = document.getElementById('fullscreenComputer');
    g._monitorExpanded = false;
    g._monitorOriginalStyles = null;

    function setMonitorExpanded(expanded) {
        const monitor = document.getElementById('monitor');
        const cameraViewer = g.camera.ele;
        const gameboard = document.getElementById('gameboard');
        if (expanded && g.camera.position == 1) {
            // store original inline styles so we can revert
            g._monitorOriginalStyles = {
                position: monitor.style.position || '',
                left: monitor.style.left || '',
                top: monitor.style.top || '',
                width: monitor.style.width || '',
                height: monitor.style.height || '',
                transform: monitor.style.transform || '',
                zIndex: monitor.style.zIndex || '',
            };
            // compute offsets relative to cameraViewer
            const gameRect = gameboard.getBoundingClientRect();
            const cameraRect = cameraViewer.getBoundingClientRect();
            const left = gameRect.left - cameraRect.left;
            const top = gameRect.top - cameraRect.top;
            const width = gameRect.width;
            const height = gameRect.height-(window.innerHeight/10);
            // make monitor fill the gameboard area
            monitor.style.position = 'absolute';
            monitor.style.left = `${left}px`;
            monitor.style.top = `${top}px`;
            monitor.style.width = `${width}px`;
            monitor.style.height = `${height}px`;
            monitor.style.transform = 'none';
            monitor.style.zIndex = '9';
            g._monitorExpanded = true;
        } else {
            // restore saved styles
            if (g._monitorOriginalStyles) {
                const s = g._monitorOriginalStyles;
                monitor.style.position = s.position;
                monitor.style.left = s.left;
                monitor.style.top = s.top;
                monitor.style.width = s.width;
                monitor.style.height = s.height;
                monitor.style.transform = s.transform;
                monitor.style.zIndex = s.zIndex;
            }
            g._monitorExpanded = false;
        }
        // ensure canvas size matches new monitor size
        setTimeout(resizeCanvas, 20);
    }

    fullscreenComputerEl.addEventListener('click', function() {
        setMonitorExpanded(!g._monitorExpanded);
    });

    document.addEventListener('fullscreenchange', () => {
        if (!document.fullscreenElement) { // document.fullscreenElement is null when exiting fullscreen
            const root = document.documentElement;
            root.style.setProperty('--text-factor', '14px');
            // Perform any actions needed after exiting fullscreen
        } else {
            const root = document.documentElement;
            root.style.setProperty('--text-factor', '150%');
        }
    });
    //Img Stuffs
    var imagesToLoad = Object.keys(g.imgs_to_load);
    loadImg(imagesToLoad, 0)

    // Add camera switch UI: [Prev] [Label] [Next]
    const controls = document.getElementById('controlsGUI');
    if (controls && g.gameVars.locations) {
        const keys = Object.keys(g.gameVars.locations);
        if (keys.length > 0) {
            const group = document.createElement('div');
            group.id = 'cameraSwitchGroup';
            group.style.float = "left";
            group.style.display = 'flex';
            group.style.gap = '8px';
            group.style.justifyContent = 'center';
            group.style.alignItems = 'center';

            const label = document.createElement('span');
            label.id = 'cameraNameDisplay';
            label.style.padding = '0 16px';
            label.style.color = '#00ff00';
            label.style.fontFamily = 'VT323, monospace';

            group.appendChild(label);
            controls.appendChild(group);

            function updateActiveCameraLabel() {
                const cam = g.gameVars.locations[g.gameVars.currentCamera];
                label.textContent = cam ? cam.name : g.gameVars.currentCamera;
                // Shrink font size if label is too wide for monitor
                const monitor = document.getElementById('monitor');
                if (monitor) {
                    const maxWidth = monitor.offsetWidth / 2;
                    label.style.opacity = '0';
                    label.style.fontSize = '1.2em'; // Reset
                    label.style.whiteSpace = 'nowrap';
                    label.style.overflow = 'hidden';
                    label.style.textOverflow = 'ellipsis';
                    setTimeout(() => {
                        let fontSize = 1.2;
                        while (label.offsetWidth > maxWidth && fontSize > 0.6) {
                            fontSize -= 0.05;
                            label.style.fontSize = fontSize + 'em';
                        }
                        label.style.opacity = '1';
                    }, 0);
                }
            }

            updateActiveCameraLabel();
        }
    }
}

function loadImg(keyReference, index) {
    g.imgs[keyReference[index]] = new Image();
    g.imgs[keyReference[index]].src = g.imgs_to_load[keyReference[index]];
    if(index + 1 < keyReference.length) {
        g.imgs[keyReference[index]].onload = function() {
            loadImg(keyReference, index + 1);
        };
    } else {
        g.startButton.disabled = false;
    }
};

function initilizeCanvas() {
    resizeCanvas();
    draw();
    setInterval(() => {
        g.gameVars.enemies.larry.placementLevel = (g.gameVars.enemies.larry.placementLevel + 1);
        posStill = false;
        if (g.gameVars.enemies.larry.placementLevel > 2) {
            g.gameVars.enemies.larry.placementLevel = 0;
            posStill = g.gameVars.currentCamera == g.gameVars.enemies.larry.location;
            g.gameVars.enemies.larry.location = (g.gameVars.enemies.larry.location == "woods") ? "school1" : "woods";
        }
        if(g.gameVars.currentCamera == g.gameVars.enemies.larry.location || posStill) {
            drawChange(draw);
        } else {
            draw();
        };
    }, 5000);
}

const canvas = document.getElementById('cameraCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    draw();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //Background
    ctx.drawImage(g.imgs[g.gameVars.locations[g.gameVars.currentCamera].img], 0, 0, canvas.width, canvas.height);
    //Larry
    if(g.gameVars.currentCamera == g.gameVars.enemies.larry.location) {
        ctx.drawImage(g.imgs[g.gameVars.enemies.larry.levelImgs[g.gameVars.enemies.larry.location][g.gameVars.enemies.larry.placementLevel]], 0, 0, canvas.width, canvas.height);
    };
}

function drawChange(latterFunc, changeTime) {
    //ctx.clearRect(0, 0, canvas.width, canvas.height);
    const imageData = ctx.createImageData(canvas.width, canvas.height);
    const data = imageData.data;

    if (!changeTime) {
        changeTime = 400;
    }

    for (let i = 0; i < data.length; i += 4) {
        // Generate a random grayscale value (0-255)
        const color = Math.floor(Math.random() * 125);

        // Set R, G, B channels to the same random value for grayscale static
        data[i] = color;     // Red
        data[i + 1] = color; // Green
        data[i + 2] = color; // Blue
        data[i + 3] = 150;   // Alpha (full opacity)
    }

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = imageData.width;
    tempCanvas.height = imageData.height;
    const tempCtx = tempCanvas.getContext('2d');

    tempCtx.putImageData(imageData, 0, 0);
    ctx.drawImage(tempCanvas, 0, 0, canvas.width, canvas.height);
    tempCanvas.remove();
    setTimeout(() => {
        latterFunc();
    }, changeTime);
}

window.addEventListener('resize', function() {
    if (g._monitorExpanded) {
        // recompute size to keep it matching the gameboard on resize
        setMonitorExpanded(true);
    } else {
        resizeCanvas();
    }
});