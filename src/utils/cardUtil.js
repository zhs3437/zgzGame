var cardUtil = utils || {};

/**
 * 识别身份
 * @param cards
 * @param type
 * @returns {number} 返回consts.GAME.IDENTITY，如果是HONG3，说话Menu显示：亮3和不叫；如果是GUZI则显示股子和不叫
 */
cardUtil.recognitionIdentity = function (cards, type) {
    var identity = GAME.IDENTITY.UNKNOW;
    switch (type) {
        case GAME.TYPE.FIVE:
            if (_.contains(cards, 116) || _.contains(cards, 216)) {
                identity = GAME.IDENTITY.HONG3;
            }
            else {
                identity = GAME.IDENTITY.GUZI;
            }
            break;

        default :
            if (_.contains(cards, 116) || _.contains(cards, 216) || _.contains(cards, 316)) {
                identity = GAME.IDENTITY.HONG3;
            }
            else {
                identity = GAME.IDENTITY.GUZI;
            }
            break;
    }

    return identity;
}

/**
 * 牌型识别
 * @param cards 当前出牌
 * @param type  当前牌桌类型（5：5人、6：6人、7：7人），使用consts.GAME.TYPE
 * @param append 当前牌局亮3情况，决定片3是否能打4；决定双三是否可满天飞，使用gActor.append
 * @returns {CardRecognization}
 */
cardUtil.recognitionCards = function (cards, type, append) {
    return CardLogic.recognizeSeries(cards, type, append);
}

/**
 * 牌型比较
 * @param cr1   当前牌型
 * @param cr2   上手牌型
 * @param type  当前牌桌类型（5：5人、6：6人、7：7人）
 * @param append 当前牌局亮3情况，决定片3是否能打4；决定双三是否可满天飞，使用gActor.append
 * @returns {boolean}
 */
cardUtil.isCurrentBiggerThanLast = function (cr1, cr2, type, append) {
    return CardLogic.isCurrentBiggerThanLast(cr1, cr2, type, append);
}