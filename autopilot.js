window.SANS = new class SANS {
    constructor() {}

    ActUponPlanets() {
        let planets = gGame.m_State.m_rgPlanets;
        let planetStates = planets.map(planet => { return {...planet.state, id: planet.id} });
        planetStates = planetStates.sort((a,b) => {
            return a.capture_progress - b.capture_progress;
        });
        let planetsReport = {};
        planets.forEach(element => {
            let state = element.state
            planetsReport[element.id] = {
                // active: state.active,
                'Captured': state.captured,
                'Capture Progress': (state.capture_progress * 100).toFixed(2) + '%',
                capture_progress: state.capture_progress,
                'Name': state.name,
            }
        });
        console.log(`Sensors detect ${planets.length} Planets in range. Displaying Information:`);
        console.table(planetsReport, ['Name', 'Captured', 'Capture Progress']);
        let target = planetStates[0]
        console.log(`Planet '${target.name}' considered highest priority to Salien High Command. Creating Trajectory Vector to Planetary Orbit...`);
        gGame.ChangeState(new CBattleSelectionState(target.id));
    }

    ActUponGrid() {
        console.log('Starting Scan of Detected Sectors.')

        let tiles = gGame.m_State.m_Grid.m_Tiles;
        let tileStates = tiles.map((tile, i) => { return {...tile.Info, id: i} });

        //creates a function based off click(tileX, tileY) that directly uses the tile ID from the tile array
        gGame.m_State.m_Grid.enterTile = function(zoneIdx, instance) {
            if ( instance.m_bJoiningPlanet )
            {
                return;
            }
    
            var unPlanetID = instance.m_unPlanetID;
    
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

        let tilesReport = tileStates.map(tile => {
            return {
                id: tile.id,
                captured: tile.captured,
                difficulty: tile.difficulty,
                progress: tile.progress
            }
        });

        //get top 5 to make report (make sure they're not captured)
        tilesReport = tilesReport.filter(tile => !tile.captured);

        if(tilesReport.length == 0) {
            //out of tiles to capture
            console.log('No Sectors left to Capture. Returning to Stellar Orbit...');
            gGame.m_State.m_LeaveButton.click();
        } else {

            //sort difficulty in descending order
            tilesReport = tilesReport.sort((a,b) => {
                return b.difficulty - a.difficulty;
            });

            //sort progress in descending order
            tilesReport = tilesReport.sort((a,b) => {
                return b.progress - a.progress;
            });

            let top5Tiles = tilesReport.slice(0, 5);
            console.log(`Scan Complete. Displaying ${top5Tiles.length > 1 ? ('Top '+top5Tiles.length+' Sectors') : 'Primary Sector'} of highest priority.`);
            console.table(top5Tiles.reduce((prev, tile) => { 
                prev[tile.id] = {
                    Difficulty: tile.difficulty,
                    Progress: (tile.progress * 100).toFixed(2) + '%'
                }
                return prev;
            }, {}));
            console.log(`Sector ${top5Tiles[0].id} targetted. Deploying Salien Position...`);
            let coords = this._GetTileCoords(top5Tiles[0].id);
            // console.log(coords);
            setTimeout(() => {gGame.m_State.m_Grid.click(coords.x, coords.y)}, 10);
            // setTimeout(gGame.m_State.m_Grid.enterTile(top5Tiles[0].id, gGame.m_State), 10);
        }
    }

    _GetTileCoords(tileIdx)
    {
	    return {
            x: tileIdx % 12,
            y: Math.floor(tileIdx/12)
        };
    }
}