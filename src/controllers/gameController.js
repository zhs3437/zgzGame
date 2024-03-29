var pomelo = window.pomelo;

var GameController = GameController || {};

/**
 * 加入游戏
 * @param roomId
 */
GameController.join = function (roomId, lobbyId)
{
    cc.log("GameController.join roomId:", roomId);
    gRoomId = roomId;
    pomelo.request(route.join, {roomId: roomId}, function(data) {
        cc.log("join :", data);
        if(data.code == 200){
            gGameType = data.gameType;

            var scene = new GameScene(data);
            cc.director.runScene(new cc.TransitionFade(1.2, scene));

        }else if(data.code == 500){
            cc.log("----> join game fail");
        }

    });
};

/**
 * 离开游戏
 * @param roomId
 */
GameController.leave = function (roomId, lobbyId)
{
    cc.log("GameController.leave roomId:", roomId);
    pomelo.request(route.leave, {roomId: roomId}, function(data) {
        cc.log("leave :", data);
        if(data.code == 200){
            GameController.enterLobby(gLobbyId);

        }else if(data.code == 500){
            cc.log("----> join game fail");
        }

    });
};
/**
 * 加入大厅
 * @param lobbyId
 */
GameController.enterLobby = function (lobbyId)
{
    pomelo.request(route.enterLobby, {lobbyId: lobbyId}, function(data) {
        cc.log("enterLobby :", data);
        var scene = new LobbyScene(data, lobbyId);
        cc.director.runScene(new cc.TransitionFade(1.2, scene));
    });

};

/**
 * ready
 * @param roomId
 */
GameController.ready = function (roomId, gameId)
{
    cc.log("GameController.ready roomId:" +  roomId + "  gameId: "+gameId);
    pomelo.request(route.ready, {roomId: roomId, gameId:gameId}, function(data) {
        cc.log("ready :", data);
        if(data.code == 200){
            cc.eventManager.dispatchCustomEvent("ReadyResponse", data);

        }else if(data.code == 500){
            cc.log("----> ready game fail");
        }

    });
};

GameController.talk = function (roomId, gameId, goal, append) {
    cc.log("GameController.talk roomId:" +  roomId + "  gameId: "+gameId+ "  goal: "+goal + "append: ", append);
    if (roomId == null || gameId == null || goal == null) {
        //参数错误，返回用户界面友好信息，比如“说话失败，请重试”
        cc.eventManager.dispatchCustomEvent("TalkResponse", {code: 500});
    }

    pomelo.request(route.talk, {roomId: roomId, gameId:gameId, goal: goal, append: append}, function(data) {
        cc.log("talk :", data);
        if(data.code == 200){
            gActor.append = append;
            //说话成功，此处使用callback处理，UI中设置参数包括回调function(data)，再处理说话时牌局UI逻辑
            cc.eventManager.dispatchCustomEvent("TalkResponse", data);
        }else if(data.code == 500){
            cc.log("----> talk fail");
        }
    });
};

GameController.fan = function (roomId, gameId, cards) {
    cc.log("GameController.talk roomId:" +  roomId + "  gameId: "+gameId+ "  cards: "+cards);
    if (roomId == null || gameId == null || !_.isArray(cards)) {
        cc.eventManager.dispatchCustomEvent("FanOutResponse", {code: 500, err: ''});
        return;
    }

    ////牌型识别
    //var recogntition = cardUtil.recognitionCards(cards, gGameType, gActor.append);
    ////错误牌型
    //if (recogntition.cardSeries == CardLogic.CardSeriesCode.cardSeries_99) {
    //    cc.eventManager.dispatchCustomEvent("FanOutResponse", {code: 500, err: '出牌不符合牌型规则'});
    //    return;
    //}
    //
    //if (!gActor.isBoss) {
    //    if (!cardUtil.isCurrentBiggerThanLast(recogntition, gLastFanCardRecognization, gGameType, gActor.append)) {
    //        cc.eventManager.dispatchCustomEvent("FanOutResponse", {code: 500, err: '当前出牌小于上手出牌'});
    //        return;
    //    }
    //}
    //else {
    //    if (_.size(cards) == 0) {
    //        cc.eventManager.dispatchCustomEvent("FanOutResponse", {code: 500, err: '当前玩家是上回合Boss, 不能不出'});
    //        return;
    //    }
    //}

    //自己出牌结果由response返回，其他玩家接受用onFan Event；
    pomelo.request(route.fan, {roomId: roomId, gameId:gameId, cards: cards, isTimeout: false}, function(data) {
        cc.log("fan :", data);
        if(data.code == 200){
            //出牌成功后，设置上手牌型；其他玩家的在onFan Event中设置
            //gLastFanCardRecognization = recogntition;
            //出牌成功，处理出牌时牌局UI逻辑：自己出牌成功，中间显示出牌；
            cc.eventManager.dispatchCustomEvent("FanOutResponse", data);
        }else if(data.code == 500){
            cc.log("----> fan fail");
        }
    });
};