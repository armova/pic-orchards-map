var fs = require("fs");
var dialogContainer = document.getElementById("dialog-container"); 
var formDiv = document.getElementById("form-div");
var mapDiv = document.getElementById("map");
var confirmationLayout = fs.readFileSync( __dirname + "/../views/confirmationLayout.html");
var orchardForm = fs.readFileSync( __dirname + "/../views/forms/orchardForm.html");
var orchardDisplayForm = fs.readFileSync( __dirname + "/../views/forms/orchardDisplayForm.html");
var OrchardRegistration = require("./orchardRegistration.js");
var OrchardLoader = require("./orchardLoader.js");
var Orchard = require("../models/orchard");
var EventEmitter = require('events').EventEmitter;
var showInMap = new EventEmitter();
var map = null;
var coordinates = null;


function init(){


    map = L.map('map').setView([9.93, -84.081], 15); 
    map.locate({setView : true});

    //Default Map is Open Street Map
    // L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    //     attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    //     maxZoom: 18
    // }).addTo(map);
    //mapbox
    L.tileLayer(' ', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18
    }).addTo(map);


    loadAllOrchards();

    function onMapClick(e) {

        mixpanel.track("Map Click");

        //Get Coordinates for Dialog Box
        var targetX = e.containerPoint.x,
            targetY = e.containerPoint.y;

        //Open Dialog Box
        showDialog(targetX,targetY,confirmationLayout,e);
        dialogOptions(e);
        
        //Show Dialog Options        
        function dialogOptions(events){
            
            coordinates = events.latlng;
            var btnConfirm = document.getElementById("confirm-marker"),
                btnCancel = document.getElementById("cancel-marker");

            btnConfirm.onclick = function(){
                mixpanel.track("Btn Confirm");
                showOrchardForm();
                removeDialog(); 
            }
            btnCancel.onclick = function(){
                mixpanel.track("Btn Cancel");
                hideDialog();
                setTimeout(function() {
                   removeDialog(); 
                }, 500);
            }
        }
            
    }

    //Function for Creating and Showing Confirmation Dialog
    function showDialog(x,y,template){
        dialogContainer.innerHTML = template; 
        var dialogPanel = document.getElementById("dialog-panel");

         
        setDialogInPos(dialogPanel);
        setMarker();

        //Get the dimensions of the Dialog Box
            function getSize(domEl){
                domElW = domEl.offsetWidth;
                domElH = domEl.offsetHeight;
                return {
                    width: domElW,
                    height: domElH
                }
            }

        //Set the Position for the Dialog
            function setDialogInPos(posEl){
                var size = getSize(posEl);
                posEl.style.left = x - (size.width/2);
                posEl.style.top = y - (size.height);
                posEl.classList.add("is-shown")
            }

        //Set the Marker in Position
            function setMarker(){
                var dialogMarker = document.createElement("span");
                dialogMarker.id = "dialog-marker";
                dialogMarker.classList.add("dialog-marker","is-shown");
                dialogContainer.appendChild(dialogMarker);

                var size = getSize(dialogMarker);
                
                dialogMarker.style.left = x - (size.width/2);
                dialogMarker.style.top = y - (size.height);

            }
        
    }

    //Actions when Mouse is being above the map
    function onMapMouseMove(e) {
        //console.log(e.latlng.toString());
    }

    //Actions when Marker is Selected
    function onMapPopupOpen(e) {
        mixpanel.track("Map Popup Open");
        coordinates = e.popup._source._latlng;
        var id = e.popup._leaflet_id;
        btn1 = document.getElementById("btn1");

        btn1.onclick = function(e){
            mixpanel.track("Btn1 (Show Orchard)");
            showOrchardDisplayForm(id, displayOrchard);
        }
    }

    function hideDialog(){
        var dialogPanel = document.getElementById("dialog-panel"),
            dialogMarker = document.getElementById("dialog-marker");
        if (dialogPanel) {
            dialogPanel.classList.remove("is-shown");
            dialogMarker.classList.remove("is-shown");
        }
    }

    function removeDialog(){
        var dialogPanel = document.getElementById("dialog-panel"),
            dialogMarker = document.getElementById("dialog-marker");
        if (dialogPanel) {
            dialogPanel.parentNode.removeChild(dialogPanel);
            dialogMarker.parentNode.removeChild(dialogMarker)
        };
    }

    //Actions When Map is being Dragged
    function onMapDragStart(){
       hideDialog();
    }

    //Actions when Map stops being dragged
    function onMapDragEnd(){
       removeDialog();
        // console.log("drgend"); 
    }

    function locateUser(e) {
        map.locate({setView : true});
    }

    map.on('click', onMapClick);
    map.on('mousemove', onMapMouseMove);
    map.on('popupopen', onMapPopupOpen);
    map.on('dragstart', onMapDragStart);
    map.on('dragend', onMapDragEnd);

    var btn1 = null;

 //    btn3.onclick = function(e){
 //        locateUser();
 //    }

    function registerOrchard(coordinates){
        var name = document.getElementById("orchardName").value;
        // var description = document.getElementById("orchardDescription").value;
        var attendant = document.getElementById("orchardAttendant").value;
        var phone = document.getElementById("orchardPhone").value;
        var email = document.getElementById("orchardEmail").value;
        var web = document.getElementById("orchardWeb").value;
        var fb = document.getElementById("orchardFb").value;
        var schedule = document.getElementById("orchardSchedule").value;

        // for (var i = radiosChar.length - 1; i >= 0; i--) {
        //     // radiosChar[i]
        //     if(radiosChar[i].checked){
        //         var characteristics = radiosChar[i].value;
        //         break;
        //     }
        // };
        // console.log(characteristics); 
        // 'orchardCharacteristics'

        var characteristics = getValuefromInput("orchardCharacteristics").toString();
        var cropTypology = getValuefromInput("orchardCropTypology").toString();
        var size = getValuefromInput("orchardSize").toString();
        var crops = getValuefromInput("orchardCrops").toString();
        var specials = getValuefromInput("orchardSpecials").toString();
        var concepts = getValuefromInput("orchardConcepts").toString();
        var sharing = getValuefromInput("orchardSharing").toString();
        var help = getValuefromInput("orchardHelp").toString();
        var market = getValuefromInput("orchardMarket").toString();
        var location = coordinates;

        var params = [name, attendant, phone, email, web, fb, schedule, characteristics, cropTypology,
            size, crops, specials, concepts, sharing, help, market, location]

        //console.log(params); 
        //console.log(location); 

        if (name != "" && attendant != "" && phone != "" 
            && schedule != "" && characteristics != "" 
            && cropTypology != "" && size != "" && crops != "" 
            && sharing != "" && market != "") {
            var params = [name, attendant, phone, email, web, fb, schedule, characteristics, cropTypology,
            size, crops, specials, concepts, sharing, help, market, location];
            
            OrchardRegistration.emit("registration", params);    
        } else {
            alert("Rellene todos los espacios requeridos (*)");
        }
    }

    function getValuefromInput(inputsName){
        var inputNameDom = document.getElementsByName(inputsName);
        var valuesChecked =[];
        for (var i = 0; i <inputNameDom.length ; i++) {
            if(inputNameDom[i].checked){
                valuesChecked.push(" " + inputNameDom[i].value)
            }
            else if(inputNameDom[i].tagName == "TEXTAREA" && inputNameDom[i].value != "") {
                valuesChecked.push(" " + inputNameDom[i].value)
            }
        };
        return valuesChecked;
    }

    function loadAllOrchards(){
        OrchardLoader.emit("loadAll"); 
    }

    function showOrchardForm(events){
        
        formDiv.innerHTML = orchardForm;
        formDiv.classList.add('is-shown');
        toggleInputs();
        console.log(coordinates); 
        var btnToMap = document.getElementById("toMapBtn");
        var btnToRegisterForm = document.getElementById("registerFormBtn");
        btnToRegisterForm.onclick = function(e){
            mixpanel.track("Btn To Register Form (Orchard)");
            e.preventDefault();
            registerOrchard(coordinates);
        }

        btnToMap.onclick = function(e){
            mixpanel.track("Btn To Map");
            showMap();
        }
    }

    function toggleInputs(){

        var otherRadioOpts = formDiv.getElementsByTagName("input");
        
        for (var i = otherRadioOpts.length - 1; i >= 0; i--) {
            if (otherRadioOpts[i].value == "Otros") {
                // console.log(otherRadioOpts[i].name);
                otherRadioOpts[i].onclick = function(){
                    var name = this.name.toString();
                    // console.log(name); 
                    var sameNameInputs = document.getElementsByName(name);
                    for (var i = sameNameInputs.length - 1; i >= 0; i--) {
                        if(sameNameInputs[i].tagName == "TEXTAREA"){
                            sameNameInputs[i].classList.toggle('disabled');
                            sameNameInputs[i].value = ""
                        }
                    };
                }
            };
        //     otherRadioOpts[i].onclick = function(){
        //         if(this.value == "Otros"){
        //             var name = this.name.toString();
        //             var sameNameInputs = document.getElementsByName(name);
        //             for (var i = sameNameInputs.length - 1; i >= 0; i--) {
        //                 if(sameNameInputs[i].tagName == "TEXTAREA"){
        //                     // sameNameInputs[i].classList.toggle('disabled');
        //                 }
        //             }; 
        //         }else{
        //             console.log(this); 
        //         }
        //     }
        };

            
        
    }

    function showOrchardDisplayForm(id, callback){
        formDiv.innerHTML = orchardDisplayForm;
        formDiv.classList.add('is-shown');
        var btnToMap = document.getElementById("toMapBtn");
        var orchardId = id;
        /*var btnToRegisterForm = document.getElementById("registerFormBtn");
        btnToRegisterForm.onclick = function(e){
            registerOrchard(coordinates);
        }*/

        btnToMap.onclick = function(e){
            mixpanel.track("Btn To Map");
            showMap();
        }

        callback(orchardId);
    }

    function showMap(){
        // formDiv.innerHTML = "";
        console.dir(map); 
        formDiv.classList.remove('is-shown');
        //map.setView([coordinates.lat, coordinates.lng], 18);
        map.setView([coordinates.lat, coordinates.lng], 18);
        window.scrollTo(0, 0);
        setTimeout(map.invalidateSize.bind(map));
    }

    function displayOrchard(id) {
        var orchardId = id.toString();
        var name = document.getElementById("orchardName");
        // var description = document.getElementById("orchardDescription");
        var attendant = document.getElementById("orchardAttendant");
        var phone = document.getElementById("orchardPhone");
        var email = document.getElementById("orchardEmail");
        var web = document.getElementById("orchardWeb");
        var fb = document.getElementById("orchardFb");
        var schedule = document.getElementById("orchardSchedule");
        var characteristics = document.getElementById("orchardCharacteristics");
        var cropTypology = document.getElementById("orchardCropTypology");
        var size = document.getElementById("orchardSize");
        var crops = document.getElementById("orchardCrops");
        var specials = document.getElementById("orchardSpecials");
        var concepts = document.getElementById("orchardConcepts");
        var sharing = document.getElementById("orchardSharing");
        var help = document.getElementById("orchardHelp");
        var market = document.getElementById("orchardMarket");

        var orchard = Orchard.find(orchardId);

        name.innerHTML = orchard.name;
        // description.innerHTML = orchard.description;
        attendant.innerHTML = orchard.attendantName;
        phone.innerHTML = orchard.phone;
        email.innerHTML = orchard.email;
        web.innerHTML = orchard.web;
        fb.innerHTML = orchard.facebook;
        schedule.innerHTML = orchard.schedule;
        characteristics.innerHTML = orchard.characteristics;
        cropTypology.innerHTML = orchard.cropTypology;
        size.innerHTML = orchard.size;
        crops.innerHTML = orchard.grownCrops;
        specials.innerHTML = orchard.specialProducts;
        concepts.innerHTML = orchard.cultivationConcepts;
        sharing.innerHTML = orchard.availableForSharing;
        help.innerHTML = orchard.needHelpWith;
        market.innerHTML = orchard.shareOrMarket;

        function emphasizeData(){
            var panelDisplay = document.getElementById("panel-display").querySelector(".panel-body");
            var cards = panelDisplay.getElementsByClassName("card");

            for (var i = cards.length - 1; i >= 0; i--) {
                var cardText = cards[i].getElementsByTagName("p")[0].textContent;
                if (cardText == "") {
                    cards[i].classList.add("disabled") 
                };
            };

        }
        emphasizeData();
        
    }

    showInMap.on('showAllOrchards', function(){
        console.log(Orchard.all());
        for (var i = Orchard.all().length - 1; i >= 0; i--) {
            var orchard = Orchard.all()[i];
            var marker = L.marker([orchard.location.lat, orchard.location.lng]).addTo(map);
            marker._leaflet_id = orchard.id;
            marker.bindPopup(
                "<span class='title'><i class='fa fa-home'></i></span><div class='body' id=\"btn1\"><p>" + orchard.name + "<small>" + orchard.attendantName + "</small></p><button class='btn btn-primary'><i class='fa fa-chevron-right'></i></button></div>"
                // "<a id=\"btn1\" class='title btn btn-success'><i class='fa fa-home'></i><i class='fa fa-chevron-circle-right'></i><span>" + orchard.name + "</span></a>" + "<p class='body'>" + orchard.attendantName + "</p>" 
            ); 
            marker._popup._leaflet_id = orchard.id;
        };
    });

    showInMap.on('showMapView', function(){
        showMap();
    });
}

module.exports = {
    init: init(),
    showInMap: showInMap
}