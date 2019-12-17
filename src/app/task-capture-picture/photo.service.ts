import { Injectable } from "@angular/core";
import { ImagePicker } from "nativescript-imagepicker";
import { Photo } from "./photo";
import * as imagepicker from "nativescript-imagepicker";
import { ImageAsset } from "tns-core-modules/image-asset/image-asset";

@Injectable({providedIn: 'root'})
export class PhotoService {


    private currentContext: ImagePicker;
    public options?: imagepicker.Options;
    
    constructor() {
        this.currentContext = imagepicker.create({mode: 'multiple'});
    }

    public requestPermission(): Promise<Photo> {

        let photo = new Photo();
        photo.imagePicker =this.currentContext;

        return new Promise ( (resolve, reject) => {
            this.currentContext.authorize()
            .then( () => {
                photo.externalStoragePermission = true;
                 this.currentContext.present()
                 .then( (imageAsset: ImageAsset[]) => {
                    imageAsset.forEach(function(asset) {
                        console.log(asset);
                    });
                 })
                resolve(photo);
            }).catch( (error) => {
                reject(false);
                
            }); 
        } );

    }
}
