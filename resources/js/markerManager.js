//Multi Markers WebAR - AR.js and Aframe - Unravelling - Connected Environment CASA-UCL @2021

//Global Variable
let markersURLArray = [];
let markersNameArray = [];
let usercontentURLArray = [];

//Howler Variables
let isThis=''; // a varibale to store the name of the marker detected
let sound; //the Howler sound
let device; //check the device to provide best settings for iOS or Android
let vector = new THREE.Vector3(); //target to getWorldDirection of the listener/camera //https://stackoverflow.com/questions/14813902/three-js-get-the-direction-in-which-the-camera-is-looking



AFRAME.registerComponent('markers_start_json', {
    init: function () {

        console.log('Add markers to the scene using json ref');
        device=navigator.platform; //checking which device is running the WebAR to provide best settings

        var sceneEl = document.querySelector('a-scene');

        //index.json contains the list of markers and content
        fetch("./resources/content/index.json")
            .then(response => response.json())
            .then(json => {
                console.log(json.content);

                let i = 0;

                json.content.forEach(el => {
                    i++;

                    let mediaURL = '';
                    let titleContent='';
                    let markerURL = './resources/patt/' + el.markerName + '.patt';
                    if (el.contentName) {
                        if(el.type == 'image'){ //needs to be JPG
                        mediaURL = './resources/content/' + el.contentName;
                        }
                        if(el.type == 'model'){ //needs to be GLB format
                            mediaURL = './resources/content/' + el.contentName;
                            }
                            if(el.type == 'sound'){ //needs to be MP3
                                mediaURL = './resources/content/' + el.contentName;
                                }
                    }
                    
                    titleContent = el.titleContent;

                    //Add Marker to scene
                    var markerEl = document.createElement('a-marker');
                    markerEl.setAttribute('type', 'pattern');
                    markerEl.setAttribute('url', markerURL);
                    markerEl.setAttribute('id', el.markerName+'_'+el.type);

                    markerEl.setAttribute('registerevents', '');
                    sceneEl.appendChild(markerEl); //Add the marker to the scene

                    //Adding text to each marker
                    // TO DO, add variable for position, colour, font size as option fields in the JSON
                    var textEl = document.createElement('a-entity');

                    textEl.setAttribute('id', 'text' + i);
                    textEl.setAttribute('text', { color: 'red', align: 'center', value: titleContent, width: '4.5' });
                    textEl.object3D.position.set(0, 0.7, 0);
                    textEl.object3D.rotation.set(-90, 0, 0);

                    markerEl.appendChild(textEl); //add the text to the marker

                    //Adding the media file to each marker depending on the content type, but check if the url exist first
                    // TO DO, currently it is not possible to add two different medium to the same marker
                    fetch(mediaURL).then((response) => {
                        console.log(response.statusText);
                        //console.log(response);
                        if (response.statusText !== 'Not Found') {
                            if(el.type == 'image'){
                            var imgEl = document.createElement('a-image');
                            imgEl.setAttribute('src', mediaURL);
                            imgEl.setAttribute('id', 'img' + i);
                            imgEl.object3D.position.set(0, 0.7, 0);
                            imgEl.object3D.rotation.set(-90, 0, 0);
                            markerEl.appendChild(imgEl); //add the image to the marker
                            }
                            if(el.type == 'model'){
                                var modelEl = document.createElement('a-entity');
                                modelEl.setAttribute('gltf-model', 'url('+mediaURL+')');
                                modelEl.setAttribute('id', 'model' + i);
                                modelEl.object3D.position.set(0, 0.2, 0);
                                modelEl.object3D.rotation.set(0, 0, 0);
                                modelEl.object3D.scale.set(0.4, 0.4, 0.4);
                                markerEl.appendChild(modelEl); //add the 3Dmodel to the marker
                            }

                            if(el.type == 'sound'){
                                var soundEl = document.createElement('a-entity');
                                soundEl.setAttribute('id', 'sound' + i);
                                markerEl.setAttribute('sound-sample',{src: mediaURL} );
                                markerEl.appendChild(soundEl); //add the sound to the marker
                                }

                        }
                        else { console.log('Media file not found') }
                    }).catch((error) => {
                        console.log('Network Error');
                    });
                });
            })
    }
});

//Old component, now with JSON
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
    schema: {
		soundid: {type: 'int', default:0},
	  },
    init: function () {
        const marker = this.el;

        marker.addEventListener("markerFound", () => {
            var markerId = marker.id;
            console.log('Marker Found: ', markerId);

            if(markerId.includes("sound"))
            {
                playSound(marker);
            }
        });

        marker.addEventListener("markerLost", () => {
            var markerId = marker.id;
            console.log('Marker Lost: ', markerId);

            if(markerId.includes("sound"))
            {
                sound.pause(marker.components['registerevents'].data.soundid);
            }
            
        });
    },
});









//Additional componets for the sounds

	//[on Entity - each marker] just a string with the ref of sound to play
    AFRAME.registerComponent("sound-sample",{
        schema: {
         src: {type: 'string'},
       },
      });

  //[on Camera]. It is the listener of the sounds and update position and orientation every tick
  AFRAME.registerComponent("listener-howler",{
	init:function(){
		Howler.pos(this.el.object3D.position.x, this.el.object3D.position.y, this.el.object3D.position.z);
		this.el.object3D.getWorldDirection(vector);
		Howler.orientation(vector.x,vector.y, vector.z, 0, -1, 0); //Threejs Up vector is -1?
	  },
	
	tick:function(){
	  Howler.pos(this.el.object3D.position.x, this.el.object3D.position.y, this.el.object3D.position.z);
	  this.el.object3D.getWorldDirection(vector);
	  Howler.orientation(vector.x,vector.y, vector.z, 0, -1, 0);//Threejs Up vector is -1?
	 }
  });


// JS function to control Howler and play the sound. A workaround is needed for iOS devices
function playSound(marker)
{ console.log(marker.data);
    if(marker.id!==isThis)
    {
        let notiOS=true;
        if (device==='iPad'||device==='iPhone'||device==='iPod'===true)
        {
            notiOS=false;
        }
        if(sound!==undefined){sound.stop();}
          sound = new Howl({
                mute: false,
                html5: notiOS,
                src: [marker.components['sound-sample'].data.src],

        onload: function() {
        console.log("LOADED");

      },
    });
     // Tweak the attributes to get the desired effect.
    sound.pannerAttr({
          coneInnerAngle: 360,
          coneOuterAngle: 360,
          coneOuterGain: 0,
          maxDistance: 10000,
          panningModel:'HRTF',
          refDistance: 1,
          rolloffFactor: 1,
          distanceModel: 'exponential',
        });
        sound.autoUnlock = true;

        sound.pos(marker.object3D.position.x,marker.object3D.position.y,marker.object3D.position.z); //update the position for spatial sound
        marker.components['registerevents'].data.soundid = sound.play();
        isThis=marker.id;

    }
    else
    {
        sound.pos(marker.object3D.position.x,marker.object3D.position.y,marker.object3D.position.z); //update the position for spatial sound
        sound.play(marker.components['registerevents'].data.soundid);
    }
}

  