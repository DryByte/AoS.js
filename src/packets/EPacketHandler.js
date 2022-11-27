const PositionData = require("./PositionData.js");
const OrientationData = require("./OrientationData.js");
const WorldUpdate = require("./WorldUpdate.js");
const WeaponInput = require("./WeaponInput.js");
const SetTool = require("./SetTool.js");
const SetColor = require("./SetColor.js");
const ExistingPlayer = require("./ExistingPlayer.js");
const CreatePlayer = require("./CreatePlayer.js");
const BlockAction = require("./BlockAction.js");
const BlockLine = require("./BlockLine.js");
const StateData = require("./StateData.js");
const KillAction = require("./KillAction.js");
const ChatMessage = require("./ChatMessage.js");
const MapStart = require("./MapStart.js");
const MapChunk = require("./MapChunk.js");
const PlayerLeft = require("./PlayerLeft.js");
const WeaponReload = require("./WeaponReload.js");
const ChangeTeam = require("./ChangeTeam.js");
const ChangeWeapon = require("./ChangeWeapon.js");

module.exports = [
	PositionData,
	OrientationData,
	WorldUpdate,
	false,//InputData - Keep disabled until implement,
	WeaponInput,
	false,//SetHP - Keep disabled until implement,
	false,//Grenade - Keep disabled until implement,
	SetTool,
	SetColor,
	ExistingPlayer,
	false,//ShortPlayerData - Keep disabled until implement,
	false,//MoveObject - Keep disabled until implement,
	CreatePlayer,
	BlockAction,
	BlockLine,
	StateData,
	KillAction,
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
	WeaponReload,
	ChangeTeam,
	ChangeWeapon,
];