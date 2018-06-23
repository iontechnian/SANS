CBattleState.prototype.RenderVictoryScreen = function( result )
{
	gApp.renderer.plugins.interaction.cursorStyles.default = 'inherit';
	gApp.renderer.plugins.interaction.cursorStyles.pointer = 'pointer';

	var instance = this;
	this.m_VictoryScreen = new PIXI.Container();
	this.m_VictoryScreen.x = 375;
	this.m_VictoryScreen.y = 140;

	var victoryBackground = new PIXI.Graphics();
	victoryBackground.beginFill( 0x000000, 1.0 );
	victoryBackground.drawRect( 0, 0, 545, 405 );
	victoryBackground.endFill();
	this.m_VictoryScreen.addChild( victoryBackground );

	var continueButton = new PIXI.Graphics();
	continueButton.beginFill( k_UIWhite, 1.0 );
	continueButton.drawRect( 0, 0, 230, 40 );
	continueButton.endFill();
	this.m_VictoryScreen.addChild( continueButton );
	continueButton.x = 155;
	continueButton.y = 300;
	continueButton.interactive = true;
	continueButton.buttonMode = true;
	continueButton.pointertap = function () {
		instance.m_VictoryScreen.visible = false;
		if ( continueButton.result.new_level > continueButton.result.old_level )
		{
			instance.RenderLevelUpScreen( continueButton.result );
		}
		else
		{
			gGame.ChangeState( new CBattleSelectionState( instance.m_PlanetData.id ) );
		}
	};

	var continueText = new PIXI.Text( 'Continue'.toUpperCase() );
	continueText.style = {
		fontFamily: k_FontType,
		fontSize: 18,
		fontWeight: 'bold',
		fill: 'black',
		align: 'center',
	};
	continueButton.addChild( continueText );
	continueText.anchor.set( 0.5, 0.5 );
	continueText.x = 115;
	continueText.y = 20;

	var reportingScoreText = new PIXI.Text( 'Reporting Score to Salien High Command...'.toUpperCase() );
	reportingScoreText.style = {
		fontFamily: k_FontType,
		fontSize: 18,
		fontWeight: 'bold',
		fill: 'white',
		align: 'center',
	};
	reportingScoreText.anchor.set( 0.5, 0.5 );
	reportingScoreText.x = victoryBackground.width / 2;
	reportingScoreText.y = 300;
	this.m_VictoryScreen.addChild( reportingScoreText );

	continueButton.visible = false;

	var victoryText = new PIXI.Text( 'Battle Complete!'.toUpperCase() );
	victoryText.style = {
		fontFamily: k_FontType,
		fontSize: 48,
		fontWeight: 'bold',
		fill: 'white',
		align: 'center',
	};
	victoryText.anchor.set( 0.5, 0.5 );
	victoryText.x = victoryBackground.width / 2;
	victoryText.y = 100;
	this.m_VictoryScreen.addChild( victoryText );

	var planetVictoryText = new PIXI.Text( 'On '.toUpperCase() + this.m_PlanetData.state.name );
	planetVictoryText.style = {
		fontFamily: k_FontType,
		fontSize: 16,
		fontWeight: 'bold',
		fill: 'white',
		align: 'center',
	};
	planetVictoryText.anchor.set( 0.5, 0.5 );
	planetVictoryText.x = victoryText.x;
	planetVictoryText.y = victoryText.y + ( victoryText.height / 2 ) + 5;
	this.m_VictoryScreen.addChild( planetVictoryText );

	var enemiesVanquishedText = new PIXI.Text( 'You vanquished ' + this.m_EnemyManager.m_nDefeatedEnemies + ' enemy aliens' );
	enemiesVanquishedText.style = {
		fontFamily: k_FontType,
		fontSize: 24,
		fill: 'white',
		align: 'center',
	};
	enemiesVanquishedText.anchor.set( 0.5, 0.5 );
	enemiesVanquishedText.x = victoryText.x;
	enemiesVanquishedText.y = planetVictoryText.y + ( planetVictoryText.height / 2 ) + 40;
	this.m_VictoryScreen.addChild( enemiesVanquishedText );

	var victoryScoreText = new PIXI.Text( 'Final Score: ' + this.m_Score );
	victoryScoreText.style = {
		fontFamily: k_FontType,
		fontSize: 24,
		fill: 'white',
		align: 'center',
	};
	victoryScoreText.anchor.set( 0.5, 0.5 );
	victoryScoreText.x = victoryText.x;
	victoryScoreText.y = enemiesVanquishedText.y + ( enemiesVanquishedText.height / 2 ) + 20;
	this.m_VictoryScreen.addChild( victoryScoreText );

	//victoryBackground
	var gameFadeOut = new PIXI.Graphics();
	gameFadeOut.beginFill( 0x000000, 0.8 );
	gameFadeOut.drawRect( 0, 0, 545, 135 );
	gameFadeOut.endFill();
	gameFadeOut.x = victoryBackground.x;
	gameFadeOut.y = victoryBackground.height;
	this.m_VictoryScreen.addChild( gameFadeOut );

	var enteredText = new PIXI.Text( 'You have been entered to win one of these four games:' );
	enteredText.style = {
		fontFamily: k_FontType,
		fontSize: 14,
		fill: 'white',
		align: 'center',
	};
	enteredText.anchor.set( 0.5, 0.5 );
	enteredText.x = gameFadeOut.width / 2;
	enteredText.y = 20;
	gameFadeOut.addChild( enteredText );

	// loop over all the apps
	for(var idx = 0; idx < this.m_PlanetData.giveaway_apps.length; idx++ )
	{
		var appid = this.m_PlanetData.giveaway_apps[idx];

		// retrieve our image
		var sprite = new PIXI.Sprite.fromImage('app_' + appid);
		sprite.width = k_GameBoxW;
		sprite.height = k_GameBoxH;
		sprite.interactive = true;
		sprite.buttonMode = true;
		sprite.appid = appid;
		sprite.pointertap = function() {
			window.open( 'https://store.steampowered.com/app/'+this.appid + '/?snr=1_saliens_4__salienapps', '_blank' );
		};
		gameFadeOut.addChild(sprite);

		sprite.x = 80 + (idx * (k_GameBoxW + k_GameBoxPadding));
		sprite.y = enteredText.y + 20;
	}

	this.button = new CUIButton( 300, 40, 'Browse Similar Games on Sale'.toUpperCase() );
	this.button.x = 122;
	this.button.y = enteredText.y + enteredText.height / 2 + 60;
	this.button.click = function(btn) {
		gAudioManager.PlaySound( 'ui_select' );
		if ( instance.m_PlanetData.state.tag_ids !== undefined )
		{
			window.open( 'https://store.steampowered.com/search/?snr=1_saliens_4__salientags&tags=' + instance.m_PlanetData.state.tag_ids, '_blank' );
		}
		else
		{
			window.open( 'https://store.steampowered.com/', '_blank' );
		}
	};

	gameFadeOut.addChild( this.button );

    gApp.stage.addChild( this.m_VictoryScreen );
    
    console.log('Mission Complete. Reporting to Salien High Command...')

	gServer.ReportScore(
		this.m_Score,
		function ( results ) {
			reportingScoreText.visible = false;
			continueButton.visible = true;
            continueButton.result = results.response;
            console.log('Report Created. Returning to Planetary Orbit...');
            gGame.ChangeState( new CBattleSelectionState( instance.m_PlanetData.id ) );
			//attempt to refresh player info
			gServer.GetPlayerInfo( function( results ) { gPlayerInfo = results.response; }, function(){} );
		},
		GameLoadError
	);
};

CPlanetSelectionState.prototype.OnLoadComplete = function(loader, resources)
{
	//console.log("CPlanetSelectionState::OnLoadComplete()");

	if(null == gSalien)
	{
		gSalien = new CSalien(resources);
	}

	this.background = new PIXI.Sprite.fromImage( 'planet_select_bg' );
	this.background.width = gApp.screen.width;
	this.background.height = gApp.screen.height;
	gApp.stage.addChild( this.background );

	gAudioManager.PlayMusic( 'galaxy_music', true );

	this.m_rgPlanetLocations =
		[{ x: 1036, y: 228, scale: 0.8 },
		{ x: 453, y: 261, scale: 0.7 },
		{ x: 750, y: 370, scale: 0.3 },
		{ x: 600, y: 542, scale: 0.4 },
		{ x: 900, y: 579, scale: 0.5 }];

	this.m_rgPlanetSprites = [];

	this.m_MouseOverInfo = false;
	this.m_MouseOverPlanet = null;

	var instance = this;
	this.m_rgPlanets.forEach( function( planet, i ) {
		var position = planet.state.position;
		var planetSprite = new PIXI.Sprite.fromImage( 'Planet_' + planet.id );
		planetSprite.anchor.set( 0.5, 0.5 );
		planetSprite.x = instance.m_rgPlanetLocations[position].x;
		planetSprite.y = instance.m_rgPlanetLocations[position].y;
		planetSprite.vscale = 0;
		planetSprite.minscale = instance.m_rgPlanetLocations[position].scale - 0.02;
		planetSprite.maxscale = instance.m_rgPlanetLocations[position].scale + 0.03;
		planetSprite.basescale = instance.m_rgPlanetLocations[position].scale;
		planetSprite.scale.set( instance.m_rgPlanetLocations[position].scale, instance.m_rgPlanetLocations[position].scale );
		planetSprite.interactive = true;
		planetSprite.buttonMode = true;
		planetSprite.mouseover = function()
		{
			instance.OnMouseOverPlanet(this, planet.id);
		};
		planetSprite.mouseout = function()
		{
			instance.OnMouseOutPlanet(this);
		};
		planetSprite.pointertap = function() {
			gAudioManager.PlaySound( 'ui_select_forward' );
			gServer.JoinPlanet(
				planet.id,
				function ( response ) {
					gGame.ChangeState( new CBattleSelectionState( planet.id ) );
				},
				function ( response ) {
					ShowAlertDialog( 'Join Planet Error', 'Failed to join planet.  Please reload your game or try again shortly.' );
				}
			);
		};
		instance.m_rgPlanetSprites.push( planetSprite );
		gApp.stage.addChild( planetSprite );
	});
	
	this.m_SelectedPlanet = null;
	this.m_ShowingInfo = false;
	
	this.m_LogoBG = new PIXI.Sprite.fromImage( 'logo_bg' );
	gApp.stage.addChild(this.m_LogoBG);
	this.m_Logo = new PIXI.Sprite.fromImage( 'logo' );
	this.m_Logo.x = 33;
	this.m_Logo.y = 17;
	gApp.stage.addChild(this.m_Logo);
	
	this.m_Elapsed = 0;
	this.m_Ship = new PIXI.Sprite.fromImage( 'ship' );
	this.m_Ship.y = k_ScreenHeight - this.m_Ship.height;
	gApp.stage.addChild(this.m_Ship);
	
	this.m_ShipFlag = new PIXI.Sprite.fromImage( 'ship_flag' );
	this.m_ShipFlag.x = 84;
	this.m_ShipFlag.y = 2;
	this.m_Ship.addChild(this.m_ShipFlag);

	this.m_ShipFlag.interactive = true;
	this.m_ShipFlag.buttonMode = true;
	this.m_ShipFlag.pointertap = function() {
		ShowRepresentGroupDialog( function( groupid, strAvatarHash ) {
			gPlayerInfo.clan_info = {};
			gPlayerInfo.clan_info.accountid = groupid;
			gPlayerInfo.clan_info.avatar = strAvatarHash;
			gGame.ChangeState( new CPlanetSelectionState( instance.m_unPlanetID ) );
		} );
	};
	this.m_Ship.addChild(this.m_ShipFlag);

	if ( gPlayerInfo.clan_info !== undefined )
	{
		this.m_ShipFlagClan = new PIXI.Sprite.fromImage( 'clanavatar_' + gPlayerInfo.clan_info.accountid );
		this.m_ShipFlagClan.x = this.m_ShipFlag.x + 32;
		this.m_ShipFlagClan.y = this.m_ShipFlag.y + 12;
		this.m_Ship.addChild(this.m_ShipFlagClan);
	}
	else if ( WebStorage.GetLocal('minigame_joingroupprompt') <= 3 )
	{
		if ( WebStorage.GetLocal('minigame_joingroupprompt') !== null )
		{
			WebStorage.SetLocal( 'minigame_joingroupprompt', WebStorage.GetLocal('minigame_joingroupprompt') + 1 );
		}
		else
		{
			WebStorage.SetLocal( 'minigame_joingroupprompt', 1 );
		}

		this.m_JoinGroupText = new PIXI.Text( '< Choose a group!' );
		this.m_JoinGroupText.anchor.set( 0, 0.5 );
		this.m_JoinGroupText.x = this.m_ShipFlag.x + this.m_ShipFlag.width;
		this.m_JoinGroupText.y = this.m_ShipFlag.y + ( this.m_ShipFlag.height / 2 ) - 10;
		this.m_JoinGroupText.style = {
			fontFamily: k_FontType,
			fontSize: 14,
			fill: 'white',
			align: 'center',
		};
		this.m_Ship.addChild(this.m_JoinGroupText);
	}


	// add the salien to the top
	gSalien.position.set(98, 386);
	gSalien.scale.set(0.13, 0.13);
	this.m_Ship.addChild(gSalien);	
	
	// our info!
	this.m_SalienInfoBox = new CSalienInfoBox();
	this.m_SalienInfoBox.x = 12;
	this.m_SalienInfoBox.y = k_ScreenHeight - 72;
	gApp.stage.addChild(this.m_SalienInfoBox);	
	
	this.m_Cursor = new CCrosshair(256, 256);
	this.m_InfoBox = new CUIBox(244, 180);
	this.m_InfoBox.SetTitleStyle(k_TextStyleDefault);
	this.m_InfoBox.AddRolloverBox(function() {
		instance.m_MouseOverInfo = true;
	},
	function() {
		instance.m_MouseOverInfo = false;

		if(null == instance.m_MouseOverPlanet && null != instance.m_SelectedPlanet)
		{
			instance.OnMouseOutPlanet(instance.m_SelectedPlanet);
		}
	});
	
	this.m_InfoBoxProgress = new CProgressBar(200);
	this.m_InfoBoxProgress.x = (this.m_InfoBox.GetWidth() - this.m_InfoBoxProgress.m_Width) * 0.5;
	this.m_InfoBoxProgress.y = 48;
	this.m_InfoBox.addChild(this.m_InfoBoxProgress);

	this.m_InfoBoxFlavorText = new PIXI.Text();
	this.m_InfoBoxFlavorText.style = k_TextStyleItalics;
	this.m_InfoBoxFlavorText.anchor.set(0.5, 0.0);
	this.m_InfoBoxFlavorText.x = (this.m_InfoBox.GetWidth() / 2);
	this.m_InfoBoxFlavorText.y = 32
	this.m_InfoBox.addChild(this.m_InfoBoxFlavorText);

	this.m_InfoBoxPlanetStatus = new PIXI.Text( 'Status:' );
	this.m_InfoBoxPlanetStatus.style = {
		fontFamily: k_FontType,
		fontSize: 14,
		fill: 'white',
		align: 'center',
	};
	this.m_InfoBoxPlanetStatus.anchor.set(0.0, 0.0);
	this.m_InfoBoxPlanetStatus.y = this.m_InfoBoxProgress.y - 20;
	this.m_InfoBox.addChild( this.m_InfoBoxPlanetStatus );

	this.m_InfoBoxPlanetStatusCurrent = new PIXI.Text( '' );
	this.m_InfoBoxPlanetStatusCurrent.style = {
		fontFamily: k_FontType,
		fontSize: 14,
		fill: 'white',
		align: 'left',
	};
	this.m_InfoBoxPlanetStatusCurrent.anchor.set(0.0, 0.0);
	this.m_InfoBoxPlanetStatusCurrent.y = this.m_InfoBoxPlanetStatus.y;
	this.m_InfoBox.addChild( this.m_InfoBoxPlanetStatusCurrent );

	var statusWidth = this.m_InfoBoxPlanetStatus.width + this.m_InfoBoxPlanetStatusCurrent.width + 8;
	this.m_InfoBoxPlanetStatus.x = (this.m_InfoBox.GetWidth() / 2) - (statusWidth / 2);
	this.m_InfoBoxPlanetStatusCurrent.x = this.m_InfoBoxPlanetStatus.x + this.m_InfoBoxPlanetStatus.width + 8;

	this.m_InfoBoxBattlingLabel = new PIXI.Text('Battling for a chance to win'.toUpperCase());
	this.m_InfoBoxBattlingLabel.style = k_TextStyleSmallBoldLeft;
	this.m_InfoBoxBattlingLabel.anchor.set(0,0);
	this.m_InfoBoxBattlingLabel.x = (this.m_InfoBox.GetWidth() / 2) - 99;
	this.m_InfoBoxBattlingLabel.y = 76;
	this.m_InfoBox.addChild(this.m_InfoBoxBattlingLabel);

	this.m_QueuedMouseOutPlanet = null;

	this.m_InfoBoxGameSprites = [];
	this.m_InfoBoxTeamSprites = [];

	this.m_DynamicLoader = new PIXI.loaders.Loader();
	this.m_DynamicLoader.on('complete', (loader, resources) =>
	{
		instance._RefreshInfoBoxGames(resources);
	});

	this.m_TeamIconIds = [];
	this.m_GameBannerIds = [];

	// button to customize the salien
	this.m_CustomizeButton = CreateCustomizeButton(220, 300);
	this.m_CustomizeButton.y = k_ScreenHeight - 340;
	gApp.stage.addChild(this.m_CustomizeButton);

	this.m_AudioIndicator = new PIXI.Sprite.fromImage( 'sound_toggle' );
	this.m_AudioIndicator.x = k_ScreenWidth - this.m_AudioIndicator.width - 10;
	this.m_AudioIndicator.y = k_ScreenHeight - this.m_AudioIndicator.height - 10;
	this.m_AudioIndicator.alpha = gAudioManager.m_Muted ? 0.3 : 1.0;
	this.m_AudioIndicator.interactive = true;
	this.m_AudioIndicator.buttonMode = true;
	this.m_AudioIndicator.pointertap = function() {
		gAudioManager.ToggleMute();
		this.alpha = gAudioManager.m_Muted ? 0.3 : 1.0;
	};
    gApp.stage.addChild( this.m_AudioIndicator );
    console.log('Returned to Stellar Orbit.');
    SANS.ActUponPlanets();
};

CBattleSelectionState.prototype.OnLoadComplete = function(loader, resources)
{
	//console.log("CBattleSelectionState::OnLoadComplete()");

	if(null == gSalien)
	{
		gSalien = new CSalien(resources);
	}

	var instance = this;
	this.m_Background = new PIXI.Sprite.fromImage( 'planet_select_bg' );
	this.m_Background.width = gApp.screen.width;
	this.m_Background.height = gApp.screen.height;
	
	this.m_GridContainer = new PIXI.Container();
	this.m_GridContainer.x = 408;
	this.m_GridContainer.y = 102;
	
	const gridBgHeight = 648;
	this.m_GridBox = new CUIBox(854, gridBgHeight);
	this.m_GridBox.SetTitleHeight(44);
	var titleStyle = jQuery.extend({}, k_TextStyleBold);
	titleStyle.fontSize = 20;
	this.m_GridBox.SetTitleStyle(titleStyle);
	this.m_GridBox.SetTitleText( this.m_PlanetData.state.name.toUpperCase() );
	this.m_GridBox.x = -24;
	this.m_GridBox.y = -64;	
	this.m_GridContainer.addChild(this.m_GridBox);	

	this.m_MapImage = new PIXI.Sprite.fromImage( 'map_bg_' + instance.m_PlanetData.id );
	this.m_GridContainer.addChild(this.m_MapImage);	

	this.m_bJoiningPlanet = false;

	// initialize a grid the user can click on
	this.m_Grid = new CBattleSelect(resources, this.m_GridContainer);
	this.m_Grid.click = function(tileX, tileY)
	{
		if ( instance.m_bJoiningPlanet )
		{
			return;
		}

		var unPlanetID = instance.m_unPlanetID;
		var zoneIdx = _GetTileIdx( tileX, tileY );

		if ( instance.m_PlanetData.zones[zoneIdx].captured )
		{
			ZoneCaptured();
			return;
		}

		instance.m_bJoiningPlanet = true;

		gServer.JoinZone(
			zoneIdx,
			function ( results ) {
				gGame.ChangeState( new CBattleState( instance.m_PlanetData, zoneIdx ) );
				instance.m_bJoiningPlanet = false;
			},
			function ( error, eResult ) {
				if ( eResult !== undefined )
				{
					if ( eResult == 27 )
					{
						instance.m_bJoiningPlanet = false;
						ZoneCaptured();
						gGame.ChangeState( new CBattleSelectionState( instance.m_PlanetData.id ) );
					}
					else
					{
						instance.m_bJoiningPlanet = false;
						GameLoadError();
					}
				}
				else
				{
					instance.m_bJoiningPlanet = false;
					GameLoadError();
				}
			}
		);
	};

	this.m_RewardsContainer = new PIXI.Container();
	this.m_RewardsContainer.x = 256;
	this.m_RewardsContainer.y = this.m_GridBox.y + gridBgHeight - 55;

	this.m_PossibleRewardsLabel = new PIXI.Text('Possible rewards:'.toUpperCase());
	this.m_PossibleRewardsLabel.style = {
		fontFamily: k_FontType,
		fontSize: 12,
		fill: "white",
		fontWeight: 'bold',
		align: 'center',
	};
	this.m_PossibleRewardsLabel.anchor.set( 0.5, 0.5 );
	this.m_RewardsContainer.addChild(this.m_PossibleRewardsLabel);

	// show our game rewards
	for(var idx = 0; idx < this.m_PlanetData.giveaway_apps.length; idx++)
	{
		const boxScale = 0.80;

		var appId = this.m_PlanetData.giveaway_apps[idx];
		var sprite = new PIXI.Sprite.fromImage('app_' + appId);
		sprite.x = idx * (k_GameBoxW * boxScale + k_GameBoxPadding);
		sprite.y = 12;
		sprite.width = k_GameBoxW * boxScale;
		sprite.height = k_GameBoxH * boxScale;
		sprite.interactive = true;
		sprite.buttonMode = true;
		sprite.appid = appId;
		sprite.pointertap = function() {
			window.open( 'https://store.steampowered.com/app/'+this.appid + '/?snr=1_saliens_4__salienapps', '_blank' );
		};
		this.m_RewardsContainer.addChild(sprite);
	}

	this.m_GridContainer.addChild(this.m_RewardsContainer);

	this.m_PossibleRewardsLabel.x = ( this.m_RewardsContainer.width / 2 ) - 40;

	this.m_RewardCountdown = new PIXI.Text( '' );
	this.m_RewardCountdown.style = {
		fontFamily: k_FontType,
		fontSize: 14,
		fill: "white",
		fontWeight: 'bolder',
		align: 'center',
	};
	this.m_RewardCountdown.anchor.set( 0.5, 0.5 );
	this.m_RewardCountdown.x = this.m_PossibleRewardsLabel.x;
	this.m_RewardCountdown.y = this.m_PossibleRewardsLabel.y  - 18;
	this.m_RewardsContainer.addChild( this.m_RewardCountdown );

	this.m_rtPlanetCountUp = 0;
	gServer.GetPlayerInfo( function(results){
			gPlayerInfo = results.response;
			instance.m_rtPlanetCountUp = Date.now();
			var nSecondsOnPlanet = gPlayerInfo.time_on_planet;
			var strTime = PadZerosLeft( Math.floor( nSecondsOnPlanet / 3600 ), 2 ) + ':' + PadZerosLeft( Math.floor( ( nSecondsOnPlanet % 3600 ) / 60 ), 2 ) + ':' + PadZerosLeft( nSecondsOnPlanet % 60, 2 );
			instance.m_RewardCountdown.text = 'Time Spent On Planet: '.toUpperCase() + strTime;
		},
		function() {}
	);

	// add button
	this.m_LeaveButton = new CUIButton( 134, 34, 'Leave Planet'.toUpperCase() );
	this.m_LeaveButton.x = 0;
	this.m_LeaveButton.y = this.m_GridBox.y + gridBgHeight - 55;
	this.m_LeaveButton.click = function(btn) {
		gAudioManager.PlaySound( 'ui_select_backwards' );
		gServer.LeaveGameInstance(
			instance.m_PlanetData.id,
			function() {
				gGame.ChangeState( new CPlanetSelectionState() );
			}
		);
	};		
	this.m_GridContainer.addChild(this.m_LeaveButton);

	var nEasy = 0;
	var nMedium = 0;
	var nHard = 0;
	//var nBoss = 0;
	this.m_PlanetData.zones.forEach( function( zone ) {
		if ( zone.captured )
			return;

		if ( zone.difficulty == 1 )
			++nEasy;
		else if ( zone.difficulty == 2 )
			++nMedium;
		else if ( zone.difficulty == 3 )
			++nHard;
	});

	this.m_ZonesRemainingBox = new PIXI.Container();
	this.m_ZonesRemainingBox.x = 660;
	this.m_ZonesRemainingBox.y = 524;
	this.m_GridContainer.addChild(this.m_ZonesRemainingBox);

	this.m_EnemiesRemainingText = new PIXI.Text( 'Enemy Tiles Remaining:'.toUpperCase() );
	this.m_EnemiesRemainingText.style = {
		fontFamily: k_FontType,
		fontSize: 10,
		fill: "white",
		fontWeight: 'bold',
		align: 'left',
	};
	this.m_EnemiesRemainingText.y = -16;
	this.m_EnemiesRemainingText.x = -20;
	this.m_ZonesRemainingBox.addChild(this.m_EnemiesRemainingText);

	this.m_EasySprite = new PIXI.Sprite.fromImage( 'easy_difficulty' );
	this.m_EasySprite.scale.set( 0.1, 0.1 );
	this.m_EasyText = new PIXI.Text( 'x' + nEasy );
	this.m_EasyText.x = this.m_EasySprite.x + this.m_EasySprite.width / 2;
	this.m_EasyText.y = this.m_EasySprite.height;
	this.m_EasyText.style = k_TextStyleZoneRemaining;
	this.m_ZonesRemainingBox.addChild( this.m_EasyText );
	this.m_ZonesRemainingBox.addChild( this.m_EasySprite );

	this.m_MediumSprite = new PIXI.Sprite.fromImage( 'medium_difficulty' );
	this.m_MediumSprite.scale.set( 0.1, 0.1 );
	this.m_MediumSprite.x = this.m_EasySprite.x + this.m_EasySprite.width + k_GameBoxPadding;
	this.m_MediumText = new PIXI.Text( 'x' + nMedium );
	this.m_MediumText.x = this.m_MediumSprite.x + this.m_MediumSprite.width / 2;
	this.m_MediumText.y = this.m_MediumSprite.height;
	this.m_MediumText.style = k_TextStyleZoneRemaining;
	this.m_ZonesRemainingBox.addChild( this.m_MediumText );
	this.m_ZonesRemainingBox.addChild( this.m_MediumSprite );

	this.m_HardSprite = new PIXI.Sprite.fromImage( 'hard_difficulty' );
	this.m_HardSprite.scale.set( 0.1, 0.1 );
	this.m_HardSprite.x = this.m_MediumSprite.x + this.m_MediumSprite.width + k_GameBoxPadding;
	this.m_HardText = new PIXI.Text( 'x' + nHard );
	this.m_HardText.x = this.m_HardSprite.x + this.m_HardSprite.width / 2;
	this.m_HardText.y = this.m_HardSprite.height;
	this.m_HardText.style = k_TextStyleZoneRemaining;
	this.m_ZonesRemainingBox.addChild( this.m_HardText );
	this.m_ZonesRemainingBox.addChild( this.m_HardSprite );

	for ( var i = 0; i < k_NumMapTilesW; ++i )
	{
		for ( var j = 0; j < k_NumMapTilesH; ++j )
		{
			var idx = _GetTileIdx( i, j );
			var zone = this.m_PlanetData.zones[idx];
			
			var bBoss = false;
			if ( zone.type == 4  )
			{
				bBoss = true;
			}
			var bCaptured = false;
			if ( zone.captured !== undefined  && zone.captured == true )
			{
				bCaptured = true;
			}

			var difficulty = zone.difficulty;

			var clanavatar = null;
			var clanurl = null;
			if ( zone.leader !== undefined )
			{
				clanurl = zone.leader.url;
				clanavatar = 'clanavatar_' + zone.leader.accountid;
			}

			var progress = 0.0;
			if ( zone.capture_progress !== undefined )
			{
				progress = zone.capture_progress;
			}

			var clans = [];
			if ( zone.top_clans !== undefined )
			{
				clans = zone.top_clans;
			}

			var params = {
				boss : bBoss,
				captured : bCaptured,
				difficulty :  difficulty,
				clanurl : clanurl,
				clanavatar : clanavatar,
				progress:progress,
				clans:clans
			};

			this.m_Grid.SetTile( i, j, params );
		}
	}
	
	this.m_MapImage.width = this.m_Grid.width;
	this.m_MapImage.height = this.m_Grid.height;		
	
	
	gApp.stage.addChild( this.m_Background );		 
	
	this.m_LogoBG = new PIXI.Sprite.fromImage( 'logo_bg' );
	gApp.stage.addChild(this.m_LogoBG);
	this.m_Logo = new PIXI.Sprite.fromImage( 'logo' );
	this.m_Logo.x = 33;
	this.m_Logo.y = 17;
	gApp.stage.addChild(this.m_Logo);
	
	this.m_Elapsed = 0;
	this.m_Ship = new PIXI.Sprite.fromImage( 'ship' );
	this.m_Ship.x = -8;
	this.m_Ship.y = k_ScreenHeight - this.m_Ship.height + 20;
	gApp.stage.addChild(this.m_Ship);
	this.m_ShipFlag = new PIXI.Sprite.fromImage( 'ship_flag' );
	this.m_ShipFlag.x = 84;
	this.m_ShipFlag.y = 2;
	this.m_ShipFlag.interactive = true;
	this.m_ShipFlag.buttonMode = true;
	this.m_ShipFlag.pointertap = function() {
		ShowRepresentGroupDialog( function( groupid, strAvatarHash ) {
			gPlayerInfo.clan_info = {};
			gPlayerInfo.clan_info.accountid = groupid;
			gPlayerInfo.clan_info.avatar = strAvatarHash;
			gGame.ChangeState( new CBattleSelectionState( instance.m_unPlanetID ) );
		} );
	};
	this.m_Ship.addChild(this.m_ShipFlag);

	if ( gPlayerInfo.clan_info !== undefined )
	{
		this.m_ShipFlagClan = new PIXI.Sprite.fromImage( 'clanavatar_' + gPlayerInfo.clan_info.accountid );
		this.m_ShipFlagClan.x = this.m_ShipFlag.x + 32;
		this.m_ShipFlagClan.y = this.m_ShipFlag.y + 12;
		this.m_Ship.addChild(this.m_ShipFlagClan);
	}
	else if ( WebStorage.GetLocal('minigame_joingroupprompt') <= 3 )
	{
		if ( WebStorage.GetLocal('minigame_joingroupprompt') !== null )
		{
			WebStorage.SetLocal( 'minigame_joingroupprompt', WebStorage.GetLocal('minigame_joingroupprompt') + 1 );
		}
		else
		{
			WebStorage.SetLocal( 'minigame_joingroupprompt', 1 );
		}

		this.m_JoinGroupText = new PIXI.Text( '< Choose a group!' );
		this.m_JoinGroupText.anchor.set( 0, 0.5 );
		this.m_JoinGroupText.x = this.m_ShipFlag.x + this.m_ShipFlag.width;
		this.m_JoinGroupText.y = this.m_ShipFlag.y + ( this.m_ShipFlag.height / 2 ) - 10;
		this.m_JoinGroupText.style = {
			fontFamily: k_FontType,
			fontSize: 14,
			fill: 'white',
			align: 'center',
		};
		this.m_Ship.addChild(this.m_JoinGroupText);
	}

	// add the salien to the top
	gSalien.position.set(98, 386);
	gSalien.scale.set(0.13, 0.13);
	this.m_Ship.addChild(gSalien);	

	// our info!
	this.m_SalienInfoBox = new CSalienInfoBox();
	this.m_SalienInfoBox.x = 12;
	this.m_SalienInfoBox.y = k_ScreenHeight - 72;
	gApp.stage.addChild(this.m_SalienInfoBox);
	
	gApp.stage.addChild( this.m_GridContainer );      	
	
	// button to customize the salien
	this.m_CustomizeButton = CreateCustomizeButton(220, 300);
	this.m_CustomizeButton.y = k_ScreenHeight - 320;
	gApp.stage.addChild(this.m_CustomizeButton);		
	
	gAudioManager.PlayMusic( 'galaxy_music', true );

	this.m_AudioIndicator = new PIXI.Sprite.fromImage( 'sound_toggle' );
	this.m_AudioIndicator.x = k_ScreenWidth - this.m_AudioIndicator.width - 10;
	this.m_AudioIndicator.y = k_ScreenHeight - this.m_AudioIndicator.height - 10;
	this.m_AudioIndicator.alpha = gAudioManager.m_Muted ? 0.3 : 1.0;
	this.m_AudioIndicator.interactive = true;
	this.m_AudioIndicator.buttonMode = true;
	this.m_AudioIndicator.pointertap = function() {
		gAudioManager.ToggleMute();
		this.alpha = gAudioManager.m_Muted ? 0.3 : 1.0;
	};
    gApp.stage.addChild( this.m_AudioIndicator );
    SANS.ActUponGrid()
};