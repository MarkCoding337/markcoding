var g = {
    camera: {},
    computer: {},
};
var gee;
window.onload = function() {
    //Camera Viewer Setup
    g.camera.ele = document.getElementById('cameraViewer');
    g.camera.ele.style.width = `${window.innerHeight * 3}px`; // 300% of container
    g.camera.width = g.camera.ele.clientWidth; // 300% of container
    g.camera.height = g.camera.ele.clientHeight; // 100% of container
    g.camera.position = 1;
    g.camera.ele.style.left = `-${g.camera.width/3}px`;
        document.querySelector("#LeftInd").addEventListener("click", function() {
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
    //Computer Monitor Setup
    g.computer.ele = document.getElementById('monitorOutput');
    g.computer.lines = [
        ["System Booting...", 1000],
        "Loading Campus Watcher OS v0.1.0...",
        "Establishing Secure Connection...",
        "Connection Established.",
        "Welcome, Operator.",
        "Warning: Unauthorized use of this system is prohibited and may be subject to criminal and civil penalties.",
        ["Further use indicates consent to these terms.", 1000],
        ["Initializing Camera Feeds...", 1000],
        ["Camera Feeds Online.", ["button", "View Camera Feeds", ()=>{document.getElementById('cameraMonitor').style.display = 'block'; document.getElementById('monitorMain').style.display = 'none';}]],
    ];
    g.computer.currentLine = 0;
    function typeLine() {
        if(g.computer.currentLine < g.computer.lines.length) {
            g.computer.ele.innerHTML += "> ";
            let line = g.computer.lines[g.computer.currentLine];
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
                    setTimeout(typeLine, wait);
                }
            }, 1);
        }
    }
    typeLine();
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
    }, 10);

    cameraCloseBtn.onclick = function() {
        document.getElementById('cameraMonitor').style.display = 'none';
        document.getElementById('monitorMain').style.display = 'block';
    }
}