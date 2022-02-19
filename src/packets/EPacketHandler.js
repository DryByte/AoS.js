const WorldUpdate = require("./WorldUpdate.js");
const SetColor = require("./SetColor.js");
const ExistingPlayer = require("./ExistingPlayer.js");
const CreatePlayer = require("./CreatePlayer.js");
const BlockAction = require("./BlockAction.js");
const StateData = require("./StateData.js");
const ChatMessage = require("./ChatMessage.js");
const MapStart = require("./MapStart.js");
const MapChunk = require("./MapChunk.js");
const PlayerLeft = require("./PlayerLeft.js");

module.exports = [
	false,//PositionData - Keep disabled until implement,
	false,//OrientationData - Keep disabled until implement,
	WorldUpdate,
	false,//InputData - Keep disabled until implement,
	false,//WeaponInput - Keep disabled until implement,
	false,//SetHP - Keep disabled until implement,
	false,//Grenade - Keep disabled until implement,
	false,//SetTool - Keep disabled until implement,
	SetColor,
	ExistingPlayer,
	false,//ShortPlayerData - Keep disabled until implement,
	false,//MoveObject - Keep disabled until implement,
	CreatePlayer,
	BlockAction,
	false,//BlockLine - Keep disabled until implement,
	StateData,
	false,//KillAction - Keep disabled until implement,
	ChatMessage,
	MapStart,
	MapChunk,
	PlayerLeft,
	false,//TerritoryCapture - Keep disabled until implement,
	false,//ProgressBar - Keep disabled until implement,
	false,//IntelCapture - Keep disabled until implement,
	false,//IntelPickup - Keep disabled until implement,
	false,//IntelDrop - Keep disabled until implement,
	false,//Restock - Keep disabled until implement,
	false,//FogColour - Keep disabled until implement,
	false,//WeaponReload - Keep disabled until implement,
	false,//ChangeTeam - Keep disabled until implement,
	false,//ChangeWeapon - Keep disabled until implement,
];