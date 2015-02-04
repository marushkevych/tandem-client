var Dissolve = require("dissolve");

module.exports = function createParser(){
    
    var decoder = Dissolve().loop(function(end) {
        
        // first read header with length
        this.tap('isoMessage', function(){
            this.string('MTI', 4)
                    .buffer('bitmap', 8)
                    .string('7', 10)
                    .string('11', 6)
                    .string('12', 12)
                    .string('24', 3)
                    .string('39', 3)
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
                    console.log('redemption bitmap', this.vars.detailsBitmap )
                    console.log('BITMASK_LOYALTY_REDEMPTION bitmap result', this.vars.detailsBitmap & BITMASK_LOYALTY_REDEMPTION )
                    console.log('BITMASK_LOYALTY_POINTS bitmap result', this.vars.detailsBitmap & BITMASK_LOYALTY_POINTS )
                    console.log('BITMASK_CPL_REDEMPTION bitmap result', this.vars.detailsBitmap & BITMASK_CPL_REDEMPTION )

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
                                    .string('numberOfProductEntries', 2)
                            this.tap(function(){
                                var numberOfProductEntries = parseInt(this.vars.numberOfProductEntries, 10);
                                for(var i = 1; i <= numberOfProductEntries; i++){
                                    this.tap('product'+i, function(){
                                        this.string('networkProductCode', 2)
                                                .string('eligibleFlg', 1)
                                                .string('amountIncludingTax', 8)
                                                .string('quantity', 5)
                                                .string('bonusPoints', 6)
                                                .string('promoPoints', 6)
                                    })
                                    
                                }
                            })
                        });
                    }

                    this.tap(function(){


                        end();

                    }).tap(function() {
                        this.push(this.vars.isoMessage);
                        this.vars = {};

                    });
                })
            })
        });
    });
    
    return decoder;
};

var BITMASK_LOYALTY_REDEMPTION = 16;
var BITMASK_LOYALTY_POINTS = 8;
var BITMASK_CPL_REDEMPTION = 4;

var isLoyaltyRedemptionDetailPresent = function(detailBItmap){
    return (detailBItmap & BITMASK_LOYALTY_REDEMPTION) > 0;
}
var isLoyaltyPointsEarnedDetailPresent = function(detailBItmap){
    return (detailBItmap & BITMASK_LOYALTY_POINTS) > 0;
}
