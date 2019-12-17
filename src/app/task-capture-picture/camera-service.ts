import { Injectable } from "@angular/core";
import * as camera from "nativescript-camera";
import { Options, ImagePicker } from "nativescript-imagepicker";
import * as fs from 'tns-core-modules/file-system';
import {ImageSource, fromFile, fromResource, fromBase64} from "tns-core-modules/image-source";
import { Camera } from "./camera";
import { CameraPermissionKey } from "./camera-permission";
import { WritePhotoPermissionKey } from "./write-photo-permission";

@Injectable({providedIn: 'root'})
export class CameraService {

    
    constructor() {
        
    }

    public options?: camera.CameraOptions

    private get cameraOptions(): camera.CameraOptions {
        return this.options;
    }


    private get isCameraAvailable() : Boolean {
        return camera.isAvailable();
    }

    public save(imageAsset) : void {

        ImageSource.fromAsset(imageAsset)
        .then((imageSource) => {
            const folder = fs.knownFolders.documents().path;
            const fileName = "test.png";
            const path = fs.path.join(folder, fileName);
            const saved = imageSource.saveToFile(path, "png");

            if (saved) {
                console.log("Image saved successfully!" + path);
            } else {
                console.log('Image cannot be saved.');
            }

        })
        .catch((e) => {
            console.log("Error: ");
            console.log(e);
        });
    }

    public capture(): void {

        this.options = !this.cameraOptions ?  this.defautCameraOptions(): this.cameraOptions;

            camera.takePicture({allowsEditing: false})
            .then((imageAsset) => {    
                  this.save(imageAsset);                        
            }).catch((err) => {
                console.log("Error -> " + err.message);
            });
    }

    private defautCameraOptions() : camera.CameraOptions {
        return {width: 200, height: 200, keepAspectRatio: true, saveToGallery: true, allowsEditing: true, cameraFacing: 'front'};
    }

    // Request camera permission
    public requestCameraPermissions(): Promise<Camera> {

        return new Promise<Camera> ( (resolve, reject) => {

            const cameraObject = new Camera() ;
            if (this.isCameraAvailable) {

                cameraObject.isAvailable = true;

                camera.requestCameraPermissions()
                    .then( (persmission) => {

                        
                        if(CameraPermissionKey.Android in persmission || CameraPermissionKey.iOS in persmission) {
                            cameraObject.cameraPermission = true;
                        } else {
                            cameraObject.cameraPermission = false;
                        }

                        resolve(cameraObject);
                    } )
                .catch ( (error) => {
                    cameraObject.cameraPermission = false;
                    resolve(cameraObject);
                }) 
            } else {
                cameraObject.isAvailable = false;
                resolve(cameraObject);
            }
        });

    }

    public requestPhotosPermissions(): Promise<Camera> {

        return new Promise<Camera> ( (resolve, reject) => {


            const cameraObject = new Camera() ;
            if (this.isCameraAvailable) {

                cameraObject.isAvailable = true;

                camera.requestPhotosPermissions()
                    .then( (persmission) => {
                        if(WritePhotoPermissionKey.Android in persmission || WritePhotoPermissionKey.iOS in persmission) {
                            cameraObject.photoPermission = true;
                        } else {
                            cameraObject.photoPermission = false;
                        }

                        resolve(cameraObject);
                    } )
                .catch ( (error) => {
                    cameraObject.photoPermission = false;
                    resolve(cameraObject);
                }) 
            } else {
                cameraObject.isAvailable = false;
                resolve(cameraObject);
            }
        });
    }


}
