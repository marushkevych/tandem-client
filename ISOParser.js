var Dissolve = require("dissolve");

module.exports = function createParser(){
    
    var decoder = Dissolve().loop(function(end) {
        
        // first read header with length
        this.int16be('header').tap(function() {
            console.log("got header with length", this.vars.header);
            
            this.tap('isoMessage', function(){
                this.string('MTI', 4)
                        .buffer('bitmap', 8)
                        .string('dateAndTime', 10)
                        .string('traceNumber', 6)
                        .string('posDateAndTime', 12)
                        .string('functionCode', 3)
                        .string('actionCode', 3)
                        .string('length_48', 3);

                this.tap('field48', function() {
                    this.string('actionIndicator', 1)
                            .string('transactionId', 18)
                            .string('memberId', 19)
                            .string('batchNumber', 3)
                            .string('ticketNumber', 4)
                            .string('GLGRecordKey', 18)
                            .int8('detailsBitmap');

                    this.tap(function(){

                        if(isLoyaltyRedemptionDetailPresent(this.vars.detailsBitmap)){
                            this.tap('LoyaltyRedemptionDetail', function(){

                                this.string('numberOfRedemptions', 1)
                                        .string('entryMethod', 1)
                                        .string('rewardCode', 4)
                                        .string('quantity', 1)
                                        .string('totlalPoints', 8);
                            });
                        }

                        if(isLoyaltyPointsEarnedDetailPresent(this.vars.detailsBitmap)){
                            this.tap('LoyaltyPointsEarnedDetail', function(){

                                this.string('totalBaseFuelPoints', 7)
                                        .string('totalBonusFuelPoints', 7)
                                        .string('totalPromoFuelPoints', 7)
                                        .string('totalBaseCarwashPoints', 7)
                                        .string('totalBonusCarwashPoints', 7)
                                        .string('totalPromoCarwashPoints', 7)
                                        .string('totalBaseDeptPoints', 7)
                                        .string('totalBonusDeptPoints', 7)
                                        .string('totalPromoDeptPoints', 7)
                                        .string('numberOfProductEntries', 2);
                                this.tap(function(){
                                    var numberOfProductEntries = parseInt(this.vars.numberOfProductEntries, 10);
                                    for(var i = 1; i <= numberOfProductEntries; i++){
                                        this.tap('product'+i, function(){
                                            this.string('networkProductCode', 2)
                                                    .string('eligibleFlg', 1)
                                                    .string('amountIncludingTax', 8)
                                                    .string('quantity', 5)
                                                    .string('bonusPoints', 6)
                                                    .string('promoPoints', 6);
                                        });
                                    }
                                });
                            });
                        }

                        if(isCPLRedemptionDetailPresent(this.vars.detailsBitmap)){
                            this.tap('CPLRedemptionDetail', function(){
                                this.string('numberOfCplEntries', 2);
                                
                                this.tap(function(){
                                    var numberOfCplEntries = parseInt(this.vars.numberOfCplEntries, 10);
                                    for(var i = 1; i <= numberOfCplEntries; i++){
                                        this.tap('cplEntry'+i, function(){
                                            this.string('cardNumber', 20)
                                                    .string('cardStatus', 2)
                                                    .string('redeemAmount', 7)
                                                    .string('balanceAmount', 7);
                                        });
                                    }
                                });
                            });
                        }

                        this.tap(function() {
                            this.push(this.vars.isoMessage);
                            this.vars = {};

                        });
                    })
                })
            });
        });
    });
    
    return decoder;
};


var isLoyaltyRedemptionDetailPresent = function(detailBItmap){
    return (detailBItmap & 16) > 0;
}
var isLoyaltyPointsEarnedDetailPresent = function(detailBItmap){
    return (detailBItmap & 8) > 0;
}
var isCPLRedemptionDetailPresent = function(detailBItmap){
    return (detailBItmap & 4) > 0;
}
