﻿
module SimCivil.Contract {

    // $Classes/Enums/Interfaces(filter)[template][separator]
    // filter (optional): Matches the name or full name of the current item. * = match any, wrap in [] to match attributes or prefix with : to match interfaces or base classes.
    // template: The template to repeat for each matched item
    // separator (optional): A separator template that is placed between all templates e.g. $Properties[public $name: $Type][, ]

    // More info: http://frhagn.github.io/Typewriter/

    

	
	export enum InteractionType{
		
	}	
	

	
	export class IPlayerController{
		
		
		
        @RPC("SimCivil.Contract.IPlayerController", false)
		public static async GetMoveState(): Promise<{ X: number, Y: number, Speed: number }>{
            return null;
        }
		
        @RPC("SimCivil.Contract.IPlayerController", false)
		public static async Move(direction: { X: number, Y: number }, speed: number): Promise<{ X: number, Y: number, Speed: number }>{
            return null;
        }
		
        @RPC("SimCivil.Contract.IPlayerController", false)
		public static async MovePercentage(direction: { X: number, Y: number }, relativeSpeed: number): Promise<{ X: number, Y: number, Speed: number }>{
            return null;
        }
		
        @RPC("SimCivil.Contract.IPlayerController", true)
		public static async Stop(): Promise<void>{
            return void(0);
        }
		
        @RPC("SimCivil.Contract.IPlayerController", true)
		public static async Interaction(target: string, interactionType: InteractionType): Promise<void>{
            return void(0);
        }
		
        @RPC("SimCivil.Contract.IPlayerController", true)
		public static async Build(tileElement: string, position: { X: number, Y: number }): Promise<void>{
            return void(0);
        }
		
	}
	
}