var g = {
    camera: {},
};
window.onload = function() {
    g.camera.ele = document.getElementById('cameraViewer');
    g.camera.width = g.camera.ele.clientHeight*3; // 300% of container
    g.camera.height = g.camera.ele.clientHeight; // 100% of container
    g.camera.position = 1;
    g.camera.ele.style.left = `-${g.camera.width/3}px`;
    g.camera.ele.onclick = function(e) {
        if(e.clientX < 100){
            if(g.camera.position == 1){
                this.style.left = `0px`;
                console.log("left");
                g.camera.position = 0;
            }
            else if(g.camera.position == 2){
                this.style.left = `-${g.camera.width/3}px`;
                console.log("center");
                g.camera.position = 1;
            }
        } else if(e.clientX > window.innerWidth - 100) {
            if(g.camera.position == 0){
                this.style.left = `-${g.camera.width/3}px`;
                console.log("center");
                g.camera.position = 1;
            }
            else if(g.camera.position == 1){
                this.style.left = `-${g.camera.width/3*2}px`;
                console.log("right");
                g.camera.position = 2;
            }
        }
    }
}