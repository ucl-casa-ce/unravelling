//Multi Markers WebAR - AR.js and Aframe - Unravelling - Connected Environment CASA-UCL @2021

//Global Variable
let markersURLArray = [];
let markersNameArray = [];
let usercontentURLArray = [];

AFRAME.registerComponent('markers_start_json', {
    init: function () {
        console.log('Add markers to the scene using json ref');

        var sceneEl = document.querySelector('a-scene');

        //index.json contains the list of markers and content
        fetch("./resources/content/index.json")
            .then(response => response.json())
            .then(json => {
                console.log(json.content);

                let i = 0;

                json.content.forEach(el => {
                    i++;
                    let imgURL = '';
                    let titleContent='';
                    let markerURL = './resources/patt/' + el.markerName + '.patt';
                    if (el.contentName) {
                        imgURL = './resources/content/' + el.contentName + '.jpg';
                    }
                    
                    let titleContent = el.titleContent;

                    //Add Marker to scene
                    var markerEl = document.createElement('a-marker');
                    markerEl.setAttribute('type', 'pattern');
                    markerEl.setAttribute('url', markerURL);
                    markerEl.setAttribute('id', el.markerName);

                    markerEl.setAttribute('registerevents', '');
                    sceneEl.appendChild(markerEl);

                    //Adding text to each marker
                    var textEl = document.createElement('a-entity');

                    textEl.setAttribute('id', 'text' + i);
                    textEl.setAttribute('text', { color: 'red', align: 'center', value: titleContent, width: '5.5' });
                    textEl.object3D.position.set(0, 0.7, 0);
                    textEl.object3D.rotation.set(-90, 0, 0);

                    markerEl.appendChild(textEl);

                    //Adding an Image to each marker, but check if the url exist
                    fetch(imgURL).then((response) => {
                        console.log(response.statusText);
                        if (response.statusText !== 'Not Found') {
                            var imgEl = document.createElement('a-image');
                            imgEl.setAttribute('src', imgURL);
                            imgEl.setAttribute('id', 'img' + i);
                            imgEl.object3D.position.set(0, 0.7, 0);
                            imgEl.object3D.rotation.set(-90, 0, 0);
                            markerEl.appendChild(imgEl);
                        }
                        else { console.log('Img is not there') }
                    }).catch((error) => {
                        console.log('Network Error');
                    });
                });
            })
    }
});


AFRAME.registerComponent('markers_start', {
    init: function () {
        console.log('Add markers to the scene');

        var sceneEl = document.querySelector('a-scene');

        //list of the markers and content
        for (var i = 1; i < 9; i++) {
            var url = "resources/patt/patt_marker_" + i + ".patt";
            markersURLArray.push(url);
            markersNameArray.push('Marker_' + i);
            console.log(url);

            var urlImg = "resources/content/Img_Marker_" + i + ".jpg";
            usercontentURLArray.push(urlImg);
        }

        for (var k = 0; k < 8; k++) {
            var markerEl = document.createElement('a-marker');
            markerEl.setAttribute('type', 'pattern');
            markerEl.setAttribute('url', markersURLArray[k]);
            markerEl.setAttribute('id', markersNameArray[k]);

            markerEl.setAttribute('registerevents', '');
            sceneEl.appendChild(markerEl);

            //Adding text to each marker
            var textEl = document.createElement('a-entity');

            textEl.setAttribute('id', 'text');
            textEl.setAttribute('text', { color: 'red', align: 'center', value: markersNameArray[k], width: '5.5' });
            textEl.object3D.position.set(0, 0.7, 0);
            textEl.object3D.rotation.set(-90, 0, 0);

            markerEl.appendChild(textEl);


            //Adding an Image to each marker
            var imgEl = document.createElement('a-entity');

        }
    }
});


//Detect marker found and lost
AFRAME.registerComponent('registerevents', {
    init: function () {
        const marker = this.el;

        marker.addEventListener("markerFound", () => {
            var markerId = marker.id;
            console.log('Marker Found: ', markerId);
        });

        marker.addEventListener("markerLost", () => {
            var markerId = marker.id;
            console.log('Marker Lost: ', markerId);
        });
    },
});