import { Component, OnInit } from "@angular/core";

import { Item } from "./item";
import { ItemService } from "./item.service";
import { EventData } from "tns-core-modules/ui/page/page";
import { Button } from "tns-core-modules/ui/button";
import * as camera from "nativescript-camera";
var imageModule = require("tns-core-modules/ui/image");
var imageSourceModule = require("image-source");
var fs = require("tns-core-modules/file-system");

import { knownFolders, Folder, File } from "tns-core-modules/file-system";
import { CameraService } from "../task-capture-picture/camera-service";
import { PhotoService } from "../task-capture-picture/photo.service";
import { Camera } from "../task-capture-picture/camera";



@Component({
    selector: "ns-items",
    templateUrl: "./items.component.html"
})
export class ItemsComponent implements OnInit {
    items: Array<Item>;

     constructor(private cameraService: CameraService, private photoService: PhotoService) { }

    ngOnInit(): void {


    }

    takePicture(args: EventData) 
    {
        this.cameraService.requestCameraPermissions()
            .then( (camera: Camera) => {

                if (camera.cameraPermission) {
                    
                    this.cameraService.requestPhotosPermissions()
                        .then( (camera: Camera) => {
                            this.cameraService.capture();

                            
                        }).catch( (error) => {
                            console.log(error);
                        })
                }

            }).catch( (error) => {
                console.log(error);
            })
    }

    selectPicture() {
         this.photoService.requestPermission();
    }

}
